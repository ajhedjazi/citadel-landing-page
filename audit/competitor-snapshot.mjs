import fs from "node:fs/promises";
import path from "node:path";

const sites = [
  "https://www.effectivefitnesshessle.co.uk/",
  "https://www.yournextlevelfitness.co.uk/",
  "https://mrhutty.com/",
];

const decode = (text = "") =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const stripTags = (html = "") => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
const getAttr = (tag, attr) => tag.match(new RegExp(`${attr}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i"))?.[1]?.replace(/^['"]|['"]$/g, "") || "";

const normalise = (href, from) => {
  try {
    const url = new URL(href, from);
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
};

const parse = (html, url) => {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description =
    [...html.matchAll(/<meta\b[^>]*>/gi)]
      .find((match) => getAttr(match[0], "name").toLowerCase() === "description")?.[0]
      ?.match(/content\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i)?.[1]
      ?.replace(/^['"]|['"]$/g, "") || "";
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => decode(stripTags(match[1])));
  const h2 = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => decode(stripTags(match[1]))).slice(0, 12);
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)]
    .map((match) => ({ href: normalise(getAttr(match[0], "href"), url), text: decode(stripTags(match[0])) }))
    .filter((link) => link.href);
  const origin = new URL(url).origin;
  const internal = anchors.filter((link) => {
    try {
      return new URL(link.href).origin === origin;
    } catch {
      return false;
    }
  });
  const candidateLinks = [
    ...new Map(
      internal
        .filter((link) => /service|personal|training|online|coach|result|testimonial|about|contact|transform|success|program/i.test(`${link.href} ${link.text}`))
        .map((link) => [link.href, link]),
    ).values(),
  ].slice(0, 6);
  const bodyText = decode(stripTags(html)).slice(0, 2000);
  return { title, description: decode(description), h1, h2, candidateLinks, bodyText };
};

const output = [];

for (const site of sites) {
  const item = { site, pages: [] };
  try {
    const res = await fetch(site, { headers: { "user-agent": "RebirthAreteAuditBot/1.0 (+limited competitor review)" } });
    const html = await res.text();
    const home = { url: site, status: res.status, ...parse(html, site) };
    item.pages.push(home);
    for (const link of home.candidateLinks.slice(0, 4)) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const pageRes = await fetch(link.href, { headers: { "user-agent": "RebirthAreteAuditBot/1.0 (+limited competitor review)" } });
        const pageHtml = await pageRes.text();
        item.pages.push({ url: link.href, sourceText: link.text, status: pageRes.status, ...parse(pageHtml, link.href) });
      } catch (error) {
        item.pages.push({ url: link.href, sourceText: link.text, error: error.message });
      }
    }
  } catch (error) {
    item.error = error.message;
  }
  output.push(item);
}

await fs.writeFile(path.join("audit", "competitor-snapshot.json"), JSON.stringify(output, null, 2), "utf8");
console.log(JSON.stringify(output.map((site) => ({ site: site.site, pageCount: site.pages.length, error: site.error || "" })), null, 2));
