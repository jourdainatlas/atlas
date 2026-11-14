// Tire du dépôt ATLAS les données de dessin : symboles de la planche sym-sprite et miniature de l'édifice.
//   node gen-data.js <gabarit.html> <edifice-mini.json>  ->  data.js
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const mini = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const SYM = {};
const re = /<symbol id="sym-([a-z-]+)" viewBox="0 0 24 24">(.*?)<\/symbol>/gs;
let m;
while ((m = re.exec(html))) {
  const items = [], pile = [];
  const tags = m[2].match(/<\/?[a-z]+[^>]*>/g) || [];
  const at = (tag, k) => { const r = new RegExp('\\b' + k + '="([^"]*)"').exec(tag); return r ? r[1] : null; };
  for (const tag of tags) {
    if (tag.startsWith('</g')) { pile.pop(); continue; }
    const nom = /^<([a-z]+)/.exec(tag)[1];
    if (nom === 'g') { pile.push({ cls: at(tag, 'class') || '', tf: at(tag, 'transform'), i: (/--i:\s*(\d+)/.exec(tag) || [])[1] }); continue; }
    const grp = pile.map((g) => g.cls).filter(Boolean).join(' ');
    const gi = pile.map((g) => g.i).filter((x) => x != null).pop();
    const gtf = pile.map((g) => g.tf).filter(Boolean);
    const cls = at(tag, 'class') || '';
    const it = { nom, cls: (grp + ' ' + cls).trim(), i: (/--i:\s*(\d+)/.exec(tag) || [])[1] ?? gi ?? null, gtf };
    if (nom === 'path') { it.d = at(tag, 'd'); if (at(tag, 'fill') === 'none') { it.trait = (/stroke:\s*var\((--[a-z0-9-]+)\)/.exec(tag) || [])[1]; it.lw = +at(tag, 'stroke-width'); } }
    else if (nom === 'circle') { it.cx = +at(tag, 'cx'); it.cy = +at(tag, 'cy'); it.r = +at(tag, 'r'); if (at(tag, 'fill') === 'none') { it.trait = (/stroke:\s*var\((--[a-z0-9-]+)\)/.exec(tag) || [])[1]; it.lw = +at(tag, 'stroke-width'); } }
    else if (nom === 'use') { it.tf = at(tag, 'transform'); }
    else continue;
    items.push(it);
  }
  SYM[m[1]] = items;
}
const out = { SYM, EDIFICE: mini };
fs.writeFileSync(__dirname + '/data.js', '// Engendré par gen-data.js à partir de gabarit.html et du site construit : ne pas modifier à la main.\nglobalThis.ATLAS_DATA = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(SYM).map((k) => k + ':' + SYM[k].length).join(' '), '| nœuds', mini.nds.length, 'arêtes', mini.ar.length);
