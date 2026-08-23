'use strict';
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const title = 'Federal + State Contracts | Registered Federal Contractors Portal';
const oldTitle = 'Federal + State Contract Opportunities for Registered Contractors | Registered Federal Contractors Portal';
const required = [
  `<title>${title}</title>`,
  `<meta property="og:title" content="${title}">`,
  `<meta name="twitter:title" content="${title}">`,
  '<link rel="canonical" href="https://federalcontractorportal.aproposgroupllc.com/">',
  'Registered Federal Contractors Portal',
  'Federal + State'
];
const failures = [];
for (const marker of required) if (!html.includes(marker)) failures.push(`missing ${marker}`);
if (html.includes(oldTitle)) failures.push('old overlong controlled Federal + State title remains');
if (title.length > 65) failures.push(`title is too long (${title.length})`);
if (failures.length) {
  console.error('[rfcp-serp-title] Validation failed:');
  failures.forEach(f => console.error(`- ${f}`));
  process.exit(1);
}
console.log(`[rfcp-serp-title] PASS — ${title.length}-character Federal + State title, OG/Twitter parity, canonical and primary identity verified`);
