'use strict';
const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const oldTitle = 'Federal + State Contract Opportunities for Registered Contractors | Registered Federal Contractors Portal';
const newTitle = 'Federal + State Contracts | Registered Federal Contractors Portal';
for (const marker of [
  `<title>${oldTitle}</title>`,
  `<meta property="og:title" content="${oldTitle}">`,
  `<meta name="twitter:title" content="${oldTitle}">`
]) {
  if (!html.includes(marker)) throw new Error(`[rfcp-serp-title] expected controlled Federal + State marker missing: ${marker}`);
}
html = html
  .replace(`<title>${oldTitle}</title>`, `<title>${newTitle}</title>`)
  .replace(`<meta property="og:title" content="${oldTitle}">`, `<meta property="og:title" content="${newTitle}">`)
  .replace(`<meta name="twitter:title" content="${oldTitle}">`, `<meta name="twitter:title" content="${newTitle}">`);
fs.writeFileSync(file, html, 'utf8');
console.log('[rfcp-serp-title] PASS — concise Federal + State homepage title applied to title/OG/Twitter metadata');
