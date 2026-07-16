import fs from "node:fs/promises";
import path from "node:path";

const [baseArg, prefixArg] = process.argv.slice(2);

if (!baseArg || !prefixArg) {
  console.error("Usage: node audit/crawl-site.mjs <base-url> <output-prefix>");
  process.exit(1);
}

const baseUrl = new URL(baseArg);
const outputPrefix = prefixArg;
const auditDir = path.resolve("audit");
const maxPages = 80;
const externalCheckLimit = 30;
const trackingParams = /^(utm_|gclid$|fbclid$|msclkid$|mc_)/i;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const writeCsv = async (file, rows, headers) => {
  const body = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  await fs.writeFile(path.join(auditDir, file), `${body}\n`, "utf8");
};

const normaliseUrl = (href, from = baseUrl.href) => {
  try {
    const url = new URL(href, from);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (trackingParams.test(key)) url.searchParams.delete(key);
    }
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.replace(/\/+$/, "/");
    }
    return url.href;
  } catch {
    return null;
  }
};

const isSameOrigin = (href) => {
  try {
    return new URL(href).origin === baseUrl.origin;
  } catch {
    return false;
  }
};

const stripTags = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(?:x[0-9a-f]+|\d+);/gi, " ");

const decodeEntities = (text = "") =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&eacute;/g, "é")
    .replace(/\s+/g, " ")
    .trim();

const getAttr = (tag, attr) => {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i"));
  if (!match) return "";
  return match[1].replace(/^['"]|['"]$/g, "");
};

const matches = (html, regex) => [...html.matchAll(regex)];

const fetchWithRedirects = async (url, method = "GET") => {
  const chain = [];
  let current = url;
  let response;

  for (let i = 0; i < 8; i += 1) {
    const started = Date.now();
    response = await fetch(current, {
      method,
      redirect: "manual",
      headers: {
        "user-agent": "RebirthAreteAuditBot/1.0 (+controlled SEO audit)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    const elapsed = Date.now() - started;
    const status = response.status;
    const location = response.headers.get("location");
    chain.push({ url: current, status, location, elapsed });

    if (![301, 302, 303, 307, 308].includes(status) || !location) {
      break;
    }

    current = new URL(location, current).href;
    if (chain.some((entry) => entry.url === current)) {
      return { response, chain, finalUrl: current, loop: true };
    }
  }

  return { response, chain, finalUrl: current, loop: false };
};

const parseSitemapUrls = (xml) =>
  [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => normaliseUrl(decodeEntities(match[1])))
    .filter(Boolean);

const parseHtml = (html, url) => {
  const title = decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const metaDescription = decodeEntities(
    matches(html, /<meta\b[^>]*>/gi)
      .find((match) => getAttr(match[0], "name").toLowerCase() === "description")?.[0]
      ?.match(/content\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i)?.[1]
      ?.replace(/^['"]|['"]$/g, "") || "",
  );
  const robotsMeta = decodeEntities(
    matches(html, /<meta\b[^>]*>/gi)
      .find((match) => getAttr(match[0], "name").toLowerCase() === "robots")
      ?.[0]
      ?.match(/content\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i)?.[1]
      ?.replace(/^['"]|['"]$/g, "") || "",
  );
  const canonical = normaliseUrl(
    matches(html, /<link\b[^>]*>/gi).find((match) => getAttr(match[0], "rel").toLowerCase() === "canonical")
      ? getAttr(matches(html, /<link\b[^>]*>/gi).find((match) => getAttr(match[0], "rel").toLowerCase() === "canonical")[0], "href")
      : "",
    url,
  );
  const h1s = matches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi).map((match) => decodeEntities(stripTags(match[1])));
  const h2s = matches(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).map((match) => decodeEntities(stripTags(match[1])));
  const headings = matches(html, /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi).map((match) => Number(match[1]));
  const headingConcern =
    h1s.length !== 1 ||
    (headings.length > 0 && headings[0] !== 1) ||
    headings.some((level, index) => index > 0 && level - headings[index - 1] > 1);
  const anchors = matches(html, /<a\b[^>]*>/gi).map((match) => getAttr(match[0], "href")).filter(Boolean);
  const links = anchors.map((href) => normaliseUrl(href, url)).filter(Boolean);
  const images = matches(html, /<img\b[^>]*>/gi).map((match) => ({
    src: normaliseUrl(getAttr(match[0], "src"), url) || getAttr(match[0], "src"),
    alt: getAttr(match[0], "alt"),
    width: getAttr(match[0], "width"),
    height: getAttr(match[0], "height"),
    loading: getAttr(match[0], "loading"),
  }));
  const jsonLdBlocks = matches(html, /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi).map((match) =>
    match[1].trim(),
  );
  const jsonLdFailures = jsonLdBlocks.filter((block) => {
    try {
      JSON.parse(block);
      return false;
    } catch {
      return true;
    }
  });
  const ogCount = matches(html, /<meta\b[^>]*property\s*=\s*["']og:/gi).length;
  const twitterCount = matches(html, /<meta\b[^>]*(?:name|property)\s*=\s*["']twitter:/gi).length;
  const hreflangCount = matches(html, /<link\b[^>]*hreflang\s*=/gi).length;
  const language = html.match(/<html\b[^>]*lang\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i)?.[1]?.replace(/^['"]|['"]$/g, "") || "";
  const viewport = matches(html, /<meta\b[^>]*>/gi).some((match) => getAttr(match[0], "name").toLowerCase() === "viewport");
  const visibleWords = stripTags(html).trim().split(/\s+/).filter(Boolean).length;

  return {
    title,
    titleLength: title.length,
    metaDescription,
    descriptionLength: metaDescription.length,
    robotsMeta,
    canonical,
    h1s,
    h2s,
    headingConcern,
    links,
    images,
    jsonLdBlocks,
    jsonLdFailures,
    ogCount,
    twitterCount,
    hreflangCount,
    language,
    viewport,
    visibleWords,
  };
};

const discovery = new Map();
const queue = [];
const addUrl = (href, source, depth = null) => {
  const normalised = normaliseUrl(href);
  if (!normalised || !isSameOrigin(normalised)) return;
  if (!discovery.has(normalised)) discovery.set(normalised, new Set());
  discovery.get(normalised).add(source);
  if (!queue.some((item) => item.url === normalised) && !results.has(normalised) && queue.length + results.size < maxPages) {
    queue.push({ url: normalised, depth });
  }
};

const results = new Map();
const sitemapUrls = new Set();
const linkEdges = [];
const linkErrors = [];
const externalLinks = new Set();

const robotsUrl = new URL("/robots.txt", baseUrl).href;
let robotsStatus = "";
let robotsText = "";
try {
  const robots = await fetchWithRedirects(robotsUrl);
  robotsStatus = robots.response.status;
  robotsText = await robots.response.text();
  for (const match of robotsText.matchAll(/^sitemap:\s*(.+)$/gim)) {
    const sitemapUrl = normaliseUrl(match[1].trim(), baseUrl.href);
    if (sitemapUrl) sitemapUrls.add(sitemapUrl);
  }
} catch (error) {
  robotsStatus = `error: ${error.message}`;
}

if (!sitemapUrls.size) {
  sitemapUrls.add(new URL("/sitemap.xml", baseUrl).href);
}

for (const sitemapUrl of [...sitemapUrls]) {
  try {
    await sleep(150);
    const sitemap = await fetchWithRedirects(sitemapUrl);
    if (sitemap.response.ok) {
      const xml = await sitemap.response.text();
      for (const url of parseSitemapUrls(xml)) {
        if (url.endsWith(".xml")) sitemapUrls.add(url);
        else addUrl(url, "sitemap", null);
      }
    }
  } catch {
    // Recorded in findings via missing sitemap membership.
  }
}

addUrl(baseUrl.href, "repository-route", 0);
addUrl(baseUrl.href, "homepage", 0);

while (queue.length) {
  const { url, depth } = queue.shift();
  if (results.has(url)) continue;
  await sleep(200);

  let record = {
    url,
    discoverySource: [...(discovery.get(url) || [])].join("|"),
    clickDepth: depth ?? "",
    error: "",
  };

  try {
    const fetched = await fetchWithRedirects(url);
    const response = fetched.response;
    const contentType = response.headers.get("content-type") || "";
    const xRobots = response.headers.get("x-robots-tag") || "";
    const html = contentType.includes("text/html") ? await response.text() : "";
    const parsed = html ? parseHtml(html, fetched.finalUrl) : null;
    const redirectChain = fetched.chain.map((entry) => `${entry.status}:${entry.url}`).join(" > ");
    const responseTime = fetched.chain.reduce((sum, entry) => sum + entry.elapsed, 0);
    const finalUrl = normaliseUrl(fetched.finalUrl) || fetched.finalUrl;
    const noindex = /noindex/i.test(`${parsed?.robotsMeta || ""} ${xRobots}`);
    const indexable = response.status === 200 && contentType.includes("text/html") && !noindex;

    record = {
      ...record,
      status: response.status,
      finalUrl,
      redirectChain,
      contentType,
      responseTimeMs: responseTime,
      indexable: indexable ? "yes" : "no",
      robotsMeta: parsed?.robotsMeta || "",
      xRobotsTag: xRobots,
      canonicalUrl: parsed?.canonical || "",
      selfCanonical: parsed?.canonical ? (parsed.canonical === finalUrl ? "yes" : "no") : "missing",
      canonicalStatus: "",
      title: parsed?.title || "",
      titleLength: parsed?.titleLength || 0,
      duplicateTitle: "",
      metaDescription: parsed?.metaDescription || "",
      descriptionLength: parsed?.descriptionLength || 0,
      duplicateDescription: "",
      h1Count: parsed?.h1s.length || 0,
      h1Text: parsed?.h1s.join(" | ") || "",
      h2Count: parsed?.h2s.length || 0,
      headingOrderConcerns: parsed?.headingConcern ? "yes" : "no",
      approximateVisibleWordCount: parsed?.visibleWords || 0,
      internalLinksOut: 0,
      internalLinksIn: 0,
      orphanPage: "",
      brokenInternalLinks: "",
      brokenExternalLinks: "",
      images: parsed?.images.length || 0,
      imagesMissingAlt: parsed ? parsed.images.filter((image) => image.alt === "").length : 0,
      imagesEmptyAltReview: parsed ? parsed.images.filter((image) => image.alt === "").map((image) => image.src).join(" | ") : "",
      imageDimensions: parsed
        ? parsed.images.map((image) => `${image.src} ${image.width || "?"}x${image.height || "?"}`).join(" | ")
        : "",
      oversizedImageCandidates: parsed
        ? parsed.images.filter((image) => !image.width || !image.height).map((image) => image.src).join(" | ")
        : "",
      openGraphMetadata: parsed?.ogCount ? "present" : "missing",
      twitterMetadata: parsed?.twitterCount ? "present" : "missing",
      languageAttribute: parsed?.language || "",
      viewportMetadata: parsed?.viewport ? "present" : "missing",
      structuredDataBlocks: parsed?.jsonLdBlocks.length || 0,
      jsonLdParseSuccess: parsed ? (parsed.jsonLdFailures.length ? "no" : parsed.jsonLdBlocks.length ? "yes" : "none") : "none",
      hreflangCount: parsed?.hreflangCount || 0,
      noindexStatus: noindex ? "yes" : "no",
      sitemapMembership: [...sitemapUrls].includes(url) || discovery.get(url)?.has("sitemap") ? "yes" : "no",
      robotsAccessibility: robotsStatus,
      trailingSlashConcern: url !== baseUrl.origin + "/" && /\/$/.test(new URL(url).pathname) ? "trailing slash" : "",
      httpHttpsConcern: new URL(url).protocol !== "https:" ? "non-https" : "",
      wwwConcern: new URL(url).hostname.startsWith("www.") ? "" : "non-www",
    };

    if (parsed) {
      const internalOut = new Set();
      for (const link of parsed.links) {
        if (isSameOrigin(link)) {
          internalOut.add(link);
          linkEdges.push({ from: url, to: link });
          const nextDepth = typeof depth === "number" ? depth + 1 : 1;
          addUrl(link, "internal-link", nextDepth);
        } else {
          externalLinks.add(link);
        }
      }
      record.internalLinksOut = internalOut.size;
    }
  } catch (error) {
    record.error = error.message;
  }

  results.set(url, record);
}

const rows = [...results.values()];
const titleGroups = rows.filter((row) => row.title).reduce((map, row) => {
  map.set(row.title, (map.get(row.title) || 0) + 1);
  return map;
}, new Map());
const descGroups = rows.filter((row) => row.metaDescription).reduce((map, row) => {
  map.set(row.metaDescription, (map.get(row.metaDescription) || 0) + 1);
  return map;
}, new Map());
const inLinks = new Map();
for (const edge of linkEdges) inLinks.set(edge.to, (inLinks.get(edge.to) || 0) + 1);

for (const row of rows) {
  row.internalLinksIn = inLinks.get(row.url) || 0;
  row.orphanPage = row.url === normaliseUrl(baseUrl.href) ? "no" : row.internalLinksIn === 0 && row.indexable === "yes" ? "yes" : "no";
  row.duplicateTitle = row.title && titleGroups.get(row.title) > 1 ? "yes" : "no";
  row.duplicateDescription = row.metaDescription && descGroups.get(row.metaDescription) > 1 ? "yes" : "no";
}

const checkLink = async (sourceUrl, targetUrl, type) => {
  try {
    await sleep(150);
    let fetched = await fetchWithRedirects(targetUrl, "HEAD");
    if ([405, 403].includes(fetched.response.status)) {
      fetched = await fetchWithRedirects(targetUrl, "GET");
    }
    const status = fetched.response.status;
    if (status >= 400 || fetched.loop) {
      linkErrors.push({
        sourceUrl,
        targetUrl,
        type,
        status,
        finalUrl: fetched.finalUrl,
        redirectChain: fetched.chain.map((entry) => `${entry.status}:${entry.url}`).join(" > "),
        error: fetched.loop ? "redirect loop" : "",
      });
    }
  } catch (error) {
    linkErrors.push({ sourceUrl, targetUrl, type, status: "", finalUrl: "", redirectChain: "", error: error.message });
  }
};

for (const edge of linkEdges) {
  if (!results.has(edge.to)) await checkLink(edge.from, edge.to, "internal");
}

let checkedExternal = 0;
for (const target of externalLinks) {
  if (checkedExternal >= externalCheckLimit) break;
  checkedExternal += 1;
  await checkLink("", target, "external");
}

const headers = [
  "url",
  "discoverySource",
  "status",
  "finalUrl",
  "redirectChain",
  "contentType",
  "responseTimeMs",
  "indexable",
  "robotsMeta",
  "xRobotsTag",
  "canonicalUrl",
  "selfCanonical",
  "canonicalStatus",
  "title",
  "titleLength",
  "duplicateTitle",
  "metaDescription",
  "descriptionLength",
  "duplicateDescription",
  "h1Count",
  "h1Text",
  "h2Count",
  "headingOrderConcerns",
  "approximateVisibleWordCount",
  "internalLinksOut",
  "internalLinksIn",
  "clickDepth",
  "orphanPage",
  "brokenInternalLinks",
  "brokenExternalLinks",
  "images",
  "imagesMissingAlt",
  "imagesEmptyAltReview",
  "imageDimensions",
  "oversizedImageCandidates",
  "openGraphMetadata",
  "twitterMetadata",
  "languageAttribute",
  "viewportMetadata",
  "structuredDataBlocks",
  "jsonLdParseSuccess",
  "hreflangCount",
  "noindexStatus",
  "sitemapMembership",
  "robotsAccessibility",
  "trailingSlashConcern",
  "httpHttpsConcern",
  "wwwConcern",
  "error",
];

await fs.writeFile(path.join(auditDir, `${outputPrefix}-crawl.json`), JSON.stringify({ baseUrl: baseUrl.href, robotsStatus, sitemapUrls: [...sitemapUrls], rows }, null, 2), "utf8");
await writeCsv(`${outputPrefix}-crawl.csv`, rows, headers);
await writeCsv(`${outputPrefix}-metadata-matrix.csv`, rows, [
  "url",
  "title",
  "titleLength",
  "duplicateTitle",
  "metaDescription",
  "descriptionLength",
  "duplicateDescription",
  "h1Count",
  "h1Text",
  "h2Count",
]);
await writeCsv(`${outputPrefix}-link-errors.csv`, linkErrors, ["sourceUrl", "targetUrl", "type", "status", "finalUrl", "redirectChain", "error"]);

const summary = {
  crawledUrls: rows.length,
  indexableUrls: rows.filter((row) => row.indexable === "yes").length,
  redirects: rows.filter((row) => String(row.status).startsWith("3")).length,
  notFound: rows.filter((row) => String(row.status).startsWith("4")).length,
  serverErrors: rows.filter((row) => String(row.status).startsWith("5")).length,
  brokenLinks: linkErrors.length,
  missingCanonical: rows.filter((row) => row.selfCanonical === "missing").length,
  nonSelfCanonical: rows.filter((row) => row.selfCanonical === "no").length,
  missingDescriptions: rows.filter((row) => !row.metaDescription).length,
  missingOpenGraph: rows.filter((row) => row.openGraphMetadata === "missing").length,
  missingTwitter: rows.filter((row) => row.twitterMetadata === "missing").length,
  missingStructuredData: rows.filter((row) => row.structuredDataBlocks === 0).length,
  imagesMissingAlt: rows.reduce((sum, row) => sum + Number(row.imagesMissingAlt || 0), 0),
};

await fs.writeFile(path.join(auditDir, `${outputPrefix}-crawl-summary.json`), JSON.stringify(summary, null, 2), "utf8");
console.log(JSON.stringify(summary, null, 2));
