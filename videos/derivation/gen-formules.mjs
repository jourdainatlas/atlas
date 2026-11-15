// Compose les formules de formules-src.mjs avec MathJax et écrit formules.js (tracés SVG, sans police à charger).
//   node gen-formules.mjs <dossier où mathjax-full est installé>      (npm i mathjax-full@3 dans un dossier hors dépôt)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
const base = path.resolve(process.argv[2] || '.'), mj = (f) => import(pathToFileURL(path.join(base, 'node_modules/mathjax-full/js', f)).href);
const { mathjax } = await mj('mathjax.js'), { TeX } = await mj('input/tex.js'), { SVG } = await mj('output/svg.js');
const { liteAdaptor } = await mj('adaptors/liteAdaptor.js'), { RegisterHTMLHandler } = await mj('handlers/html.js'), { AllPackages } = await mj('input/tex/AllPackages.js');
const adaptor = liteAdaptor(); RegisterHTMLHandler(adaptor);
const doc = mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ fontCache: 'none' }) });
const src = (await import(pathToFileURL(path.resolve('formules-src.mjs')).href)).default, out = {};
for (const [id, tex, c] of src) {
  const svg = adaptor.innerHTML(doc.convert(tex, { display: true }));
  if (/data-mjx-error/.test(svg)) throw new Error('formule ' + id + ' : ' + tex);
  const vb = /viewBox="([^"]+)"/.exec(svg)[1].split(' ').map(Number);
  out[id] = { c: c || 'encre', vb, svg: svg.replace(/ style="[^"]*"/, '').replace(/ width="[^"]*" height="[^"]*"/, '').replace(/ role="img" focusable="false"/, '').replace(/ data-[a-z-]+="[^"]*"/g, '') };
}
fs.writeFileSync('formules.js', '// Engendré par gen-formules.mjs à partir de formules-src.mjs : ne pas modifier à la main.\nglobalThis.FORMULES = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length + ' formules, ' + Math.round(fs.statSync('formules.js').size / 1024) + ' ko');
