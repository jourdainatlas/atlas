// Rubrique Activités : outils de dessin communs aux explorations écrites pour le site (MEMO_atlas_activites.md, §120).
// Les fonctions de tracé reprennent celles des prototypes de l'auteur (mêmes grilles, mêmes poignées), pour que
// toutes les figures aient le même aspect. Les couleurs sont lues dans les variables posées par commun.js.
import { bac } from './commun.js';

export const borne = (v, a, b) => Math.max(a, Math.min(b, v));
// Nombre à la française : virgule, vrai signe moins, d décimales.
export function fr(v, d = 2) {
  if (!isFinite(v)) return '—';
  if (Math.abs(v) < 0.5 * Math.pow(10, -d)) v = 0;
  return v.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
}
// Décimal court : 2 → « 2 », 0,5 → « 0,5 », 0,25 → « 0,25 » (au plus d décimales, zéros de fin retirés).
export function frc(v, d = 2) {
  if (Math.abs(v) < 0.5 * Math.pow(10, -d)) v = 0;
  return v.toLocaleString('fr-FR', { maximumFractionDigits: d }).replace('-', '−');
}
export const pgcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// Fraction exacte p/q (entiers) sous forme irréductible : « −3/2 », « 4 ».
export function fraction(p, q) {
  if (q < 0) { p = -p; q = -q; }
  const g = pgcd(p, q) || 1; p /= g; q /= g;
  return (p < 0 ? '−' : '') + Math.abs(p) + (q === 1 ? '' : '/' + q);
}

// Scène : couleurs du thème, rendu différé (une image par rafraîchissement d'écran), suivi du thème et de la taille.
// rendre(C) redessine tout ; l'objet rendu donne planifier() et arreter().
export function scene(racine, rendre) {
  const { MutationObserver: MO, ResizeObserver: RO, demonter } = bac();
  let C = {}, attente = false, vivant = true;
  const lire = () => {
    const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim();
    C = { fond: g('--sheet'), encre: g('--ink'), doux: g('--ink-soft'), filet: g('--rule'), filetFort: g('--rule-strong'),
      orange: g('--sec'), vert: g('--tan'), bleu: g('--mark'), violet: g('--semi'), surligne: g('--hl'), police: g('--font-display') };
  };
  const planifier = () => { if (attente || !vivant) return; attente = true; requestAnimationFrame(() => { attente = false; if (vivant) rendre(C); }); };
  new MO(() => { lire(); planifier(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  new RO(planifier).observe(racine);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { lire(); planifier(); });
  lire(); planifier();
  return { planifier, arreter() { vivant = false; demonter(); } };
}

export function toile(cv) {
  const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
  const w = Math.max(60, r.width), h = Math.max(60, r.height), W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  return { ctx, w, h };
}
export function vue(w, h, x0, x1, y0, y1) {
  return { w, h, x0, x1, y0, y1, X: x => (x - x0) / (x1 - x0) * w, Y: y => h - (y - y0) / (y1 - y0) * h,
    ix: px => x0 + px / w * (x1 - x0), iy: py => y0 + (h - py) / h * (y1 - y0) };
}
// Repère orthonormé centré en (cx, cy), de demi-largeur hw.
export function vueEgale(w, h, cx, cy, hw) { const hh = hw * h / w; return vue(w, h, cx - hw, cx + hw, cy - hh, cy + hh); }
export function pas(etendue, cible) {
  const brut = etendue / cible, p = Math.pow(10, Math.floor(Math.log10(brut))), m = brut / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}
export function trait(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
export function grille(ctx, v, C, egale, sansNombres) {
  const sx = pas(v.x1 - v.x0, 8), sy = egale ? sx : pas(v.y1 - v.y0, Math.max(3, Math.round(8 * v.h / v.w * 1.4)));
  ctx.lineWidth = 1; ctx.setLineDash([]); ctx.strokeStyle = C.filetFort;
  for (let k = Math.ceil(v.x0 / sx); k * sx <= v.x1; k++) { const X = Math.round(v.X(k * sx)) + .5; trait(ctx, X, 0, X, v.h); }
  for (let k = Math.ceil(v.y0 / sy); k * sy <= v.y1; k++) { const Y = Math.round(v.Y(k * sy)) + .5; trait(ctx, 0, Y, v.w, Y); }
  ctx.strokeStyle = C.doux; ctx.lineWidth = 1.5;
  if (v.y0 <= 0 && v.y1 >= 0) trait(ctx, 0, v.Y(0), v.w, v.Y(0));
  if (v.x0 <= 0 && v.x1 >= 0) trait(ctx, v.X(0), 0, v.X(0), v.h);
  if (sansNombres) return;
  ctx.fillStyle = C.doux; ctx.font = '500 11px ' + C.police;
  const dx = Math.max(0, -Math.floor(Math.log10(sx) + 1e-9)), dy = Math.max(0, -Math.floor(Math.log10(sy) + 1e-9));
  const ly = borne(v.Y(0) + 14, 12, v.h - 5), lx = borne(v.X(0) - 6, 34, v.w - 4);
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  for (let k = Math.ceil(v.x0 / sx); k * sx <= v.x1; k++) { if (!k) continue; const X = v.X(k * sx); if (X < 16 || X > v.w - 16) continue; ctx.fillText(fr(k * sx, dx), X, ly); }
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  for (let k = Math.ceil(v.y0 / sy); k * sy <= v.y1; k++) { if (!k) continue; const Y = v.Y(k * sy); if (Y < 10 || Y > v.h - 10) continue; ctx.fillText(fr(k * sy, dy), lx, Y); }
}
// Courbe de f ; coupures : abscisses où le tracé doit être interrompu (discontinuités).
export function courbe(ctx, v, f, couleur, epaisseur, tirets, coupures = []) {
  ctx.strokeStyle = couleur; ctx.lineWidth = epaisseur; ctx.setLineDash(tirets || []);
  const n = Math.ceil(v.w / 1.5); ctx.beginPath(); let plume = false, xp = null;
  for (let i = 0; i <= n; i++) {
    const x = v.x0 + (v.x1 - v.x0) * i / n, y = f(x);
    if (xp !== null && coupures.some(c => xp < c && x >= c)) plume = false;
    xp = x;
    if (!isFinite(y)) { plume = false; continue; }
    const X = v.X(x), Y = borne(v.Y(y), -4000, v.h + 4000);
    if (plume) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); plume = true; }
  }
  ctx.stroke(); ctx.setLineDash([]);
}
export function droite(ctx, v, x, y, pente, couleur, epaisseur, tirets) {
  ctx.strokeStyle = couleur; ctx.lineWidth = epaisseur; ctx.setLineDash(tirets || []);
  trait(ctx, v.X(v.x0), v.Y(y + pente * (v.x0 - x)), v.X(v.x1), v.Y(y + pente * (v.x1 - x))); ctx.setLineDash([]);
}
export function etiquette(ctx, C, txt, X, Y, couleur, alignement, taille) {
  ctx.font = '700 ' + (taille || 13) + 'px ' + C.police; ctx.textAlign = alignement || 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 4; ctx.strokeStyle = C.fond; ctx.setLineDash([]); ctx.strokeText(txt, X, Y); ctx.fillStyle = couleur; ctx.fillText(txt, X, Y);
}
export function poignee(ctx, C, X, Y, couleur, nom, dessous) {
  ctx.globalAlpha = .18; ctx.fillStyle = couleur; ctx.beginPath(); ctx.arc(X, Y, 15, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = C.fond; ctx.strokeStyle = couleur; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X, Y, 6.5, 0, 7); ctx.fill(); ctx.stroke();
  if (nom) etiquette(ctx, C, nom, X - 14, Y + (dessous ? 18 : -18), couleur, 'center', 15);
}
export function pastille(ctx, X, Y, couleur, r) { ctx.fillStyle = couleur; ctx.beginPath(); ctx.arc(X, Y, r || 4, 0, 7); ctx.fill(); }
// Glisser sur une toile, à la souris ou au doigt : fn({x, y}, phase), phase = 'debut' | 'suite' | 'fin'.
export function glisser(cv, fn) {
  let actif = false;
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener('pointerdown', e => { actif = true; try { cv.setPointerCapture(e.pointerId); } catch (_) {} e.preventDefault(); fn(pos(e), 'debut'); });
  cv.addEventListener('pointermove', e => { if (actif) fn(pos(e), 'suite'); });
  const fin = e => { if (actif) { actif = false; fn(pos(e), 'fin'); } };
  cv.addEventListener('pointerup', fin); cv.addEventListener('pointercancel', fin);
}
// Écrit un texte dans un élément seulement s'il a changé (évite de réveiller inutilement les lecteurs d'écran).
export function ecrire(el, txt, html) { if (!el) return; if (html) { if (el.innerHTML !== txt) el.innerHTML = txt; } else if (el.textContent !== txt) el.textContent = txt; }

// Styles propres aux explorations écrites pour le site : réglages (curseurs étiquetés) et lectures.
export const cssFigures = `
.activites-act .reglages { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px 12px; align-items: center; padding: 12px 16px; border-top: 1px solid var(--filet); font: 14px var(--f-ui); }
.activites-act .reglages label { color: var(--encre-2); white-space: nowrap; }
.activites-act .reglages input[type=range] { width: 100%; min-width: 0; }
.activites-act .reglages output { font-family: var(--f-mono); font-size: 13.5px; min-width: 5.5ch; text-align: right; font-variant-numeric: tabular-nums; }
.activites-act .lectures { margin: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 5px 10px; font: 14px/1.4 var(--f-ui); }
.activites-act .lectures dt { color: var(--encre-2); white-space: nowrap; }
.activites-act .lectures dd { margin: 0; font-family: var(--f-mono); font-size: 13.5px; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.activites-act .formes { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; font: 14px/1.4 var(--f-ui); }
.activites-act .formes b { display: block; font-weight: 500; font-size: 12px; letter-spacing: .05em; text-transform: uppercase; color: var(--encre-3); }
.activites-act .formes span { font-family: var(--f-mono); font-size: 13.5px; }
.activites-act canvas.carre { aspect-ratio: 1 / 1; max-height: 520px; }
.activites-act canvas.large { aspect-ratio: 16 / 7; }
.activites-act canvas.moyen { aspect-ratio: 16 / 10; }
.activites-act canvas.fixe { touch-action: none; }
@media (max-width: 560px) { .activites-act canvas.large { aspect-ratio: 4 / 3; } .activites-act canvas.moyen { aspect-ratio: 1 / 1; } }
`;
// Bloc final commun : piège, démonstration, ce que la page calcule.
export const suite = (piege, demo, calcul) => `
<div class="suite col">
  <h4>Le piège le plus courant</h4><p>${piege}</p>
  <h4>Où lire la démonstration</h4><p>${demo}</p>
  <h4>Ce que la page calcule</h4><p>${calcul}</p>
</div>`;
