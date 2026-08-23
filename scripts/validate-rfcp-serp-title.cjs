'use strict';
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const title = 'Federal Contract Matching | Registered Federal Contractors Portal';
const oldTitle = 'Federal Contract Matching for Registered Contractors | Registered Federal Contractors Portal';
const required = [
  `<title>${title}</title>`,
  `<meta property="og:title" content="${title}">`,
  `<meta name="twitter:title" content="${title}">`,
  '<link rel="canonical" href="https://federalcontractorportal.aproposgroupllc.com/">',
  'Registered Federal Contractors Portal'
];
const failures = [];
for (const marker of required) if (!html.includes(marker)) failures.push(`missing ${marker}`);
if (html.includes(oldTitle)) failures.push('old overlong homepage title remains');
if (title.length > 65) failures.push(`title is too long (${title.length})`);
if (failures.length) {
  console.error('[rfcp-serp-title] Validation failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}
console.log(`[rfcp-serp-title] PASS — ${title.length}-character homepage title, OG/Twitter parity, canonical and primary identity verified`);
