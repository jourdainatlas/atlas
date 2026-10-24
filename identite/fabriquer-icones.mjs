// Fabrique les icônes et l image d aperçu d ATLAS (à lancer à la main si le logo change).
// Usage : depuis un dossier où @fontsource/spectral et @fontsource/gfs-didot sont installés, node fabriquer-icones.mjs
import fs from 'fs';
import { createRequire } from 'module'; const { chromium } = createRequire('/')('playwright');
const A = '#ff6d7d';
const f = p => 'data:font/woff2;base64,' + fs.readFileSync(p).toString('base64');
const polices = `@font-face{font-family:Spectral;font-weight:600;src:url(${f('node_modules/@fontsource/spectral/files/spectral-latin-600-normal.woff2')})}
@font-face{font-family:Spectral;font-weight:400;src:url(${f('node_modules/@fontsource/spectral/files/spectral-latin-400-normal.woff2')})}
@font-face{font-family:'GFS Didot';src:url(${f('node_modules/@fontsource/gfs-didot/files/gfs-didot-greek-400-normal.woff2')})}`;

// Favicon : version miniature (pas de lettres), tuile sombre
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" rx="44" fill="#1d2027"/><g transform="translate(20 20) scale(0.8)"><path d="M150 150 L50 150 L100 50" fill="none" stroke="#a1a6af" stroke-width="13" stroke-linejoin="round"/><path d="M150 150 L100 50" fill="none" stroke="#e7e9ed" stroke-width="13" stroke-linecap="round"/><circle cx="50" cy="150" r="22" fill="#e7e9ed"/><circle cx="150" cy="150" r="16" fill="#e7e9ed"/><circle cx="100" cy="50" r="30" fill="${A}"/></g></svg>
`;
fs.writeFileSync('favicon.svg', favicon);

// Grand format, avec lettres
const graphe = `<defs>
<marker id="pd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#a1a6af"/></marker>
<marker id="pw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3.5" markerHeight="3.5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#e7e9ed"/></marker></defs>
<g transform="translate(20 20) scale(0.8)">
<path d="M57.2 135.7 L91.5 67 M66 150 L138 150" fill="none" stroke="#a1a6af" stroke-width="3.5" stroke-linecap="round" marker-end="url(#pd)"/>
<path d="M146 142 L108.5 67" fill="none" stroke="#e7e9ed" stroke-width="3.5" stroke-linecap="round" marker-end="url(#pw)"/>
<circle cx="50" cy="150" r="16" fill="#1d2027" stroke="#e7e9ed" stroke-width="3.5"/>
<circle cx="150" cy="150" r="9" fill="#e7e9ed"/>
<circle cx="100" cy="50" r="16" fill="#121418" stroke="${A}" stroke-width="4"/>
<text x="49.74" y="154.58" text-anchor="middle" font-family="GFS Didot" font-size="20" fill="#e7e9ed">α</text>
<text x="100" y="57.01" text-anchor="middle" font-family="GFS Didot" font-size="20" fill="${A}">Ω</text></g>`;
const tuile = (arrondi) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">${arrondi ? '<rect x="1" y="1" width="198" height="198" rx="44" fill="#1d2027" stroke="#2b2f38" stroke-width="2"/>' : '<rect width="200" height="200" fill="#1d2027"/>'}${graphe}</svg>`;

const page = (w, h, corps, fond = 'transparent') => `<!doctype html><meta charset="utf-8"><style>${polices}html,body{margin:0;width:${w}px;height:${h}px;background:${fond};overflow:hidden}</style>${corps}`;
const apercu = `<div style="width:1200px;height:630px;background:#121418;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px">
<div style="width:300px;height:300px">${tuile(true)}</div>
<div style="font-family:Spectral;font-weight:600;font-size:64px;letter-spacing:.18em;padding-left:.18em;color:#e7e9ed;line-height:1">ATLAS</div>
<div style="font-family:Spectral;font-weight:400;font-size:26px;color:#a1a6af;letter-spacing:.02em">Les dépendances entre les théories mathématiques</div></div>`;

const nav = await chromium.launch();
const p = await nav.newPage();
const tirer = async (nom, w, h, html, fond) => {
  await p.setViewportSize({ width: w, height: h });
  await p.setContent(page(w, h, html, fond));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: nom, omitBackground: true });
};
await tirer('apercu.png', 1200, 630, apercu, '#121418');
await tirer('apple-touch-icon.png', 180, 180, `<div style="width:180px;height:180px">${tuile(false)}</div>`);
await tirer('icone-512.png', 512, 512, `<div style="width:512px;height:512px">${tuile(true)}</div>`);
await tirer('favicon-32.png', 32, 32, favicon.replace('<svg ', '<svg width="32" height="32" '));
await nav.close();
console.log(await (await import('fs')).readdirSync('.').filter(x => /png|svg/.test(x)));
