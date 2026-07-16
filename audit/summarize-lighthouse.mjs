import fs from "node:fs/promises";
import path from "node:path";

const [directoryArg, outputName = "summary"] = process.argv.slice(2);

if (!directoryArg) {
  console.error("Usage: node audit/summarize-lighthouse.mjs <directory> [output-name]");
  process.exit(1);
}

const directory = path.resolve(directoryArg);
const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".report.json")).sort();

const metricIds = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"];
const categoryIds = ["performance", "accessibility", "best-practices", "seo"];

const median = (values) => {
  const sorted = values.filter((value) => typeof value === "number" && !Number.isNaN(value)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  return sorted[Math.floor(sorted.length / 2)];
};

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const rows = [];

for (const file of files) {
  const report = JSON.parse(await fs.readFile(path.join(directory, file), "utf8"));
  const row = {
    file,
    url: report.finalDisplayedUrl || report.finalUrl || report.requestedUrl,
    formFactor: report.configSettings?.formFactor || "",
    fetchTime: report.fetchTime || "",
  };

  for (const id of categoryIds) {
    row[id] = Math.round((report.categories?.[id]?.score ?? 0) * 100);
  }

  for (const id of metricIds) {
    const audit = report.audits?.[id];
    row[id] = audit?.numericValue ?? null;
    row[`${id}Display`] = audit?.displayValue || "";
  }

  const opportunities = Object.values(report.audits || {})
    .filter((audit) => audit.details?.type === "opportunity" && typeof audit.numericValue === "number" && audit.numericValue > 50)
    .sort((a, b) => b.numericValue - a.numericValue)
    .slice(0, 6)
    .map((audit) => `${audit.title} (${audit.displayValue || Math.round(audit.numericValue)})`);
  row.majorOpportunities = opportunities.join(" | ");

  const failedA11y = Object.values(report.audits || {})
    .filter((audit) => audit.score !== null && audit.score === 0 && audit.scoreDisplayMode !== "notApplicable")
    .slice(0, 10)
    .map((audit) => audit.title);
  row.failedAudits = failedA11y.join(" | ");

  rows.push(row);
}

const groups = new Map();
for (const row of rows) {
  const key = `${row.url}|${row.formFactor}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

const medians = [...groups.entries()].map(([key, groupRows]) => {
  const [url, formFactor] = key.split("|");
  const row = { url, formFactor, runs: groupRows.length };
  for (const id of categoryIds) row[id] = median(groupRows.map((item) => item[id]));
  for (const id of metricIds) row[id] = median(groupRows.map((item) => item[id]));
  row.majorOpportunities = groupRows[0]?.majorOpportunities || "";
  return row;
});

const headers = [
  "file",
  "url",
  "formFactor",
  "fetchTime",
  ...categoryIds,
  ...metricIds,
  ...metricIds.map((id) => `${id}Display`),
  "majorOpportunities",
  "failedAudits",
];

const medianHeaders = ["url", "formFactor", "runs", ...categoryIds, ...metricIds, "majorOpportunities"];

await fs.writeFile(path.join(directory, `${outputName}.json`), JSON.stringify({ rows, medians }, null, 2), "utf8");
await fs.writeFile(
  path.join(directory, `${outputName}.csv`),
  `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
  "utf8",
);
await fs.writeFile(
  path.join(directory, `${outputName}-medians.csv`),
  `${medianHeaders.join(",")}\n${medians.map((row) => medianHeaders.map((header) => csvEscape(row[header])).join(",")).join("\n")}\n`,
  "utf8",
);

console.log(JSON.stringify({ runs: rows.length, medians }, null, 2));
