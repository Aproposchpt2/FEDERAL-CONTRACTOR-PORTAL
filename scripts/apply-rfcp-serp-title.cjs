'use strict';
const fs = require('fs');
const file = 'index.html';
let html = fs.readFileSync(file, 'utf8');
const oldTitle = 'Federal Contract Matching for Registered Contractors | Registered Federal Contractors Portal';
const newTitle = 'Federal Contract Matching | Registered Federal Contractors Portal';
for (const marker of [
  `<title>${oldTitle}</title>`,
  `<meta property="og:title" content="${oldTitle}">`,
  `<meta name="twitter:title" content="${oldTitle}">`
]) {
  if (!html.includes(marker)) throw new Error(`[rfcp-serp-title] expected source marker missing: ${marker}`);
}
html = html
  .replace(`<title>${oldTitle}</title>`, `<title>${newTitle}</title>`)
  .replace(`<meta property="og:title" content="${oldTitle}">`, `<meta property="og:title" content="${newTitle}">`)
  .replace(`<meta name="twitter:title" content="${oldTitle}">`, `<meta name="twitter:title" content="${newTitle}">`);
fs.writeFileSync(file, html, 'utf8');
console.log('[rfcp-serp-title] PASS — concise homepage title applied to title/OG/Twitter metadata');
