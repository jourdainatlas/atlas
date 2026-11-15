// OUTILS COMMUNS de la vidéo « La dérivation » : couleurs du site (thème sombre), texte, formules, repères et courbes,
// et le jardin du bas (logo, herbe, arbres repris de videos/presentation/film.js).
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE;
  const W = G.W, H = G.H, CX = W / 2;
  const borne = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), doux = (x) => x * x * (3 - 2 * x);
  const ressort = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const pr = (t, t0, d) => borne((t - t0) / d), sortie = (x) => 1 - Math.pow(1 - x, 3);
  const lerp = (a, b, k) => a + (b - a) * k;
  const ap = (t, t0, d = 0.45) => sortie(pr(t, t0, d));                                  // apparition : 0 avant t0, 1 après t0 + d
  const fen = (t, a, b, d = 0.4) => Math.min(doux(pr(t, a, d)), 1 - doux(pr(t, b - d, d)));  // fenêtre : présent entre a et b
  const alea = (g) => () => { g |= 0; g = g + 0x6D2B79F5 | 0; let t = Math.imul(g ^ g >>> 15, 1 | g); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const fr = (x, n = 2) => x.toFixed(n).replace('.', ',').replace('-', '−');             // nombre à la française

  // ---------- couleurs : thème sombre de gabarit.html. Code constant : la courbe de f en bleu, ce qui touche à la
  // dérivée (tangente, f′) en turquoise, la sécante et le taux de variation en orange, l'écart h en violet. ----------
  const C = { papier: '#121418', surface: '#191c22', encre: '#e7e9ed', encre2: '#aeb4be', encre3: '#90979f', filet: '#2b2f37', trame: '#1f2329', rouge: '#ff6d7d',
    bleu: '#55aaff', edifice: '#55aaff', cours: '#35caa4', violet: '#c793e6', exercices: '#c793e6', orange: '#ffa24a', annales: '#ffa24a', activites: '#b6ca4c', gd: '#d6d9de', gm: '#a3a8b1', gl: '#4a505b' };
  const RUBC = [C.edifice, C.cours, C.exercices, C.annales, C.activites];
  const F = { titre: 'Spectral', ui: '"IBM Plex Sans"', mono: '"IBM Plex Mono"', math: 'KaTeX_Math', main: 'KaTeX_Main' };

  // ---------- texte ----------
  function txt(ctx, s, x, y, o = {}) {
    ctx.save();
    ctx.font = `${o.it ? 'italic ' : ''}${o.w || 600} ${o.size || 48}px ${o.fam || F.titre}`;
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.base || 'alphabetic';
    ctx.letterSpacing = (o.ls || 0) + 'px';
    ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre;
    ctx.fillText(s, x + (o.ls && ctx.textAlign === 'center' ? o.ls / 2 : 0), y);
    ctx.restore();
  }
  // Petit balisage des phrases : $…$ pour les mathématiques (lettres en italique KaTeX), [ … ] pour un terme que l'on
  // définit (en rouge, comme sur le site), { … } pour une mise en valeur turquoise.
  function segments(s) {
    const segs = []; let mode = '', buf = '';
    const vide = () => { if (!buf) return;
      if (mode === '$') { for (const m of buf.matchAll(/_.|\^.|[A-Za-z]+|′|[ℝℚℕℤ]|[^A-Za-z′_^ℝℚℕℤ]+/g)) { const u = m[0];      // _n : indice, ^2 : exposant (un seul caractère), ℝ ℚ ℕ ℤ : lettres ajourées
          if (u[0] === '_' || u[0] === '^') segs.push({ s: u[1], math: /[A-Za-z]/.test(u[1]), main: !/[A-Za-z]/.test(u[1]), petit: u[0] === '_' ? 0.22 : -0.38 });
          else if ('ℝℚℕℤ'.includes(u)) segs.push({ s: 'RQNZ'['ℝℚℕℤ'.indexOf(u)], bb: 1 });
          else segs.push(/[A-Za-z]/.test(u) ? { s: u, math: 1 } : u === '′' ? { s: '′', prime: 1 } : { s: u, main: 1 }); } }
      else segs.push({ s: buf, c: mode === '[' ? C.rouge : mode === '{' ? C.cours : null });
      buf = ''; };
    for (const ch of s) {
      if (ch === '$') { vide(); mode = mode === '$' ? '' : '$'; }
      else if (ch === '[' || ch === '{') { vide(); mode = ch; }
      else if (ch === ']' || ch === '}') { vide(); mode = ''; }
      else buf += ch;
    }
    vide(); return segs;
  }
  // une ligne balisée ; align : 'center' (défaut) ou 'left'
  function ligne(ctx, s, x, y, o = {}) {
    const segs = segments(s), size = o.size || 44;
    ctx.save();
    const f = (g) => { const k = g.petit !== undefined ? 0.7 : 1; return g.prime ? `400 ${size * 0.76}px ${F.main}` : g.bb ? `400 ${size * 1.04}px KaTeX_AMS` : g.math ? `italic 400 ${size * 1.04 * k}px ${F.math}` : g.main ? `400 ${size * 1.04 * k}px ${F.main}, KaTeX_AMS` : `${o.it ? 'italic ' : ''}${o.w || 600} ${size}px ${o.fam || F.titre}`; };
    let total = 0; for (const g of segs) { ctx.font = f(g); total += ctx.measureText(g.s).width; }
    let cx = o.align === 'left' ? x : x - total / 2; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha *= o.a ?? 1;
    for (const g of segs) { ctx.font = f(g); ctx.fillStyle = g.c || o.c || C.encre; ctx.fillText(g.s, cx, g.prime ? y - size * 0.34 : g.petit !== undefined ? y + size * g.petit : y); cx += ctx.measureText(g.s).width; }
    ctx.restore(); return total;
  }
  // légende du bas : une ou deux lignes, présentes entre t0 et t1
  function legende(ctx, t, [t0, t1], lignes, o = {}) {
    if (t < t0 || t > t1 + 0.35) return;
    const out = 1 - pr(t, t1, 0.3), size = o.size || 44, lh = size * 1.3, y0 = 846 - (lignes.length - 1) * lh / 2;
    lignes.forEach((l, i) => { const k = ap(t, t0 + i * 0.15, 0.4); if (k > 0) ligne(ctx, l, CX, y0 + i * lh + (1 - k) * 18, { size, a: k * out }); });
  }

  // ---------- formules (formules.js) : une image par formule, préparée dans init ----------
  const IMG = {};
  async function chargerFormules() {
    for (const [id, f] of Object.entries(globalThis.FORMULES)) {
      const svg = f.svg.replace('<svg ', `<svg width="${f.vb[2] / 10}" height="${f.vb[3] / 10}" `).replace(/currentColor/g, C[f.c] || f.c);
      const im = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await im.decode(); IMG[id] = im;
    }
  }
  // (x, y) : point d'ancrage sur la ligne de base ; o.fs : corps en pixels ; o.align ; o.mil : y est le milieu vertical
  function formule(ctx, id, x, y, o = {}) {
    const f = globalThis.FORMULES[id], im = IMG[id]; if (!im) throw new Error('formule inconnue : ' + id);
    const fs = o.fs || 40, w = f.vb[2] / 1000 * fs, h = f.vb[3] / 1000 * fs, a = o.a ?? 1; if (a <= 0) return w;
    const x0 = o.align === 'left' ? x : o.align === 'right' ? x - w : x - w / 2, y0 = o.mil ? y - h / 2 : y + f.vb[1] / 1000 * fs;
    ctx.save(); ctx.globalAlpha *= a; ctx.drawImage(im, x0, y0 + (o.monte ? (1 - a) * 16 : 0), w, h); ctx.restore(); return w;
  }
  const largeur = (id, fs = 40) => globalThis.FORMULES[id].vb[2] / 1000 * fs;
  function cadre(ctx, x, y, w, h, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, o.r ?? 14);
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); } if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 2.5; ctx.stroke(); } ctx.restore();
  }

  // ---------- repères et courbes ----------
  // b : cadre en pixels { x, y, w, h } ; r : fenêtre { x0, x1, y0, y1 }
  function repere(b, r) {
    const X = (x) => b.x + (x - r.x0) / (r.x1 - r.x0) * b.w, Y = (y) => b.y + b.h - (y - r.y0) / (r.y1 - r.y0) * b.h;
    return { b, r, X, Y, kx: b.w / (r.x1 - r.x0), ky: b.h / (r.y1 - r.y0) };
  }
  const dans = (ctx, R, f) => { ctx.save(); ctx.beginPath(); ctx.rect(R.b.x, R.b.y, R.b.w, R.b.h); ctx.clip(); f(); ctx.restore(); };
  // axes gradués ; k : part tracée (0 à 1) ; o.gx, o.gy : graduations chiffrées ; o.chiffres : opacité des nombres
  function axes(ctx, R, k = 1, o = {}) {
    if (k <= 0) return; const { b, r, X, Y } = R, a = o.a ?? 1, ch = (o.chiffres ?? 1) * a * borne(k * 2 - 1);
    ctx.save(); ctx.globalAlpha *= a;
    dans(ctx, R, () => { ctx.strokeStyle = C.trame; ctx.lineWidth = 2;                                      // quadrillage
      for (const x of o.gx || []) { ctx.beginPath(); ctx.moveTo(X(x), b.y); ctx.lineTo(X(x), b.y + b.h); ctx.stroke(); }
      for (const y of o.gy || []) { ctx.beginPath(); ctx.moveTo(b.x, Y(y)); ctx.lineTo(b.x + b.w, Y(y)); ctx.stroke(); } });
    ctx.strokeStyle = C.encre3; ctx.fillStyle = C.encre3; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    const ox = borne(X(0), b.x, b.x + b.w), oy = borne(Y(0), b.y, b.y + b.h), xe = lerp(b.x, b.x + b.w, k), ye = lerp(b.y + b.h, b.y, k);
    const vx = r.y0 <= 0 && r.y1 >= 0, vy = r.x0 <= 0 && r.x1 >= 0;
    if (vx) { ctx.beginPath(); ctx.moveTo(b.x, oy); ctx.lineTo(xe, oy); ctx.stroke(); ctx.beginPath(); ctx.moveTo(xe + 12, oy); ctx.lineTo(xe - 4, oy - 7); ctx.lineTo(xe - 4, oy + 7); ctx.fill(); }
    if (vy) { ctx.beginPath(); ctx.moveTo(ox, b.y + b.h); ctx.lineTo(ox, ye); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ox, ye - 12); ctx.lineTo(ox - 7, ye + 4); ctx.lineTo(ox + 7, ye + 4); ctx.fill(); }
    ctx.restore();
    if (ch <= 0) return;
    ctx.save(); ctx.globalAlpha *= ch; ctx.strokeStyle = C.encre3; ctx.lineWidth = 2.5;
    if (vx) for (const x of o.gx || []) { if (x === 0) continue; ctx.beginPath(); ctx.moveTo(X(x), oy - 6); ctx.lineTo(X(x), oy + 6); ctx.stroke(); if (!o.muetX) txt(ctx, fr(x, 0), X(x), oy + 34, { fam: F.main, w: 400, size: 26, c: C.encre3 }); }
    if (vy) for (const y of o.gy || []) { if (y === 0) continue; ctx.beginPath(); ctx.moveTo(ox - 6, Y(y)); ctx.lineTo(ox + 6, Y(y)); ctx.stroke(); if (!o.muetY) txt(ctx, fr(y, 0), ox - 16, Y(y) + 9, { fam: F.main, w: 400, size: 26, c: C.encre3, align: 'right' }); }
    if (vx && vy && !o.sansO) txt(ctx, '0', ox - 14, oy + 32, { fam: F.main, w: 400, size: 26, c: C.encre3, align: 'right' });
    ctx.restore();
  }
  // courbe de f entre xa et xb (coordonnées du repère)
  function courbe(ctx, R, f, xa, xb, o = {}) {
    if (xb <= xa) return;
    dans(ctx, R, () => { ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.bleu; ctx.lineWidth = o.lw || 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash(o.dash || []);
      const n = Math.max(8, Math.ceil((xb - xa) * R.kx / 4)); ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n); if (i) ctx.lineTo(R.X(x), R.Y(f(x))); else ctx.moveTo(R.X(x), R.Y(f(x))); }
      ctx.stroke(); });
  }
  // droite passant par (x0, y0), de pente p, coupée par le cadre ; k : part tracée, depuis (x0, y0) vers les deux bouts
  function droite(ctx, R, x0, y0, p, o = {}) {
    const k = o.k ?? 1; if (k <= 0) return; const { r } = R, xa = lerp(x0, r.x0, k), xb = lerp(x0, r.x1, k);
    dans(ctx, R, () => { ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.cours; ctx.lineWidth = o.lw || 4; ctx.lineCap = 'round'; ctx.setLineDash(o.dash || []);
      ctx.beginPath(); ctx.moveTo(R.X(xa), R.Y(y0 + p * (xa - x0))); ctx.lineTo(R.X(xb), R.Y(y0 + p * (xb - x0))); ctx.stroke(); });
  }
  function trait(ctx, R, x1, y1, x2, y2, o = {}) {
    ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.encre3; ctx.lineWidth = o.lw || 2.5; ctx.lineCap = 'round'; ctx.setLineDash(o.dash || []);
    ctx.beginPath(); ctx.moveTo(R.X(x1), R.Y(y1)); ctx.lineTo(R.X(x2), R.Y(y2)); ctx.stroke(); ctx.restore();
  }
  function point(ctx, R, x, y, o = {}) {
    const k = o.k ?? 1; if (k <= 0) return; const r = (o.r || 9) * ressort(borne(k));
    ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.arc(R.X(x), R.Y(y), r, 0, 6.3); ctx.fillStyle = o.c || C.encre; ctx.fill(); ctx.strokeStyle = C.papier; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }
  // flèche d'un point à un autre (pixels)
  function fleche(ctx, x1, y1, x2, y2, o = {}) {
    const k = o.k ?? 1; if (k <= 0) return; const xe = lerp(x1, x2, k), ye = lerp(y1, y2, k), an = Math.atan2(y2 - y1, x2 - x1), tp = o.tp || 13;
    ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = ctx.fillStyle = o.c || C.encre; ctx.lineWidth = o.lw || 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(xe - Math.cos(an) * tp * 0.6, ye - Math.sin(an) * tp * 0.6); ctx.stroke();
    ctx.translate(xe, ye); ctx.rotate(an); ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(-tp, -tp * 0.55); ctx.lineTo(-tp, tp * 0.55); ctx.closePath(); ctx.fill(); ctx.restore();
  }

  // ---------- le jardin du bas : 1 unité = SC pixels, le sol est en y = 0 ----------
  const SC = 3.6, SOLPX = 1046, LU = W / SC, BEC = 18, HERBE = 0.4;
  function logo(ctx, cx, cy, taille, k = [1, 1, 1, 1, 1], tuile = 1) {
    const s = taille / 200;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s * tuile, s * tuile); ctx.translate(-100, -100);
    ctx.beginPath(); ctx.roundRect(1, 1, 198, 198, 44); ctx.fillStyle = '#1d2027'; ctx.fill(); ctx.strokeStyle = '#2b2f38'; ctx.lineWidth = 2; ctx.stroke();
    ctx.translate(20, 20); ctx.scale(0.8, 0.8); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const fleche = (x0, y0, x1, y1, q, c) => { if (q <= 0) return; const x = lerp(x0, x1, q), y = lerp(y0, y1, q), a = Math.atan2(y1 - y0, x1 - x0);
      ctx.strokeStyle = c; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(1.2, 0); ctx.lineTo(-11, -6.1); ctx.lineTo(-11, 6.1); ctx.closePath(); ctx.fill(); ctx.restore(); };
    fleche(66, 150, 138, 150, k[1], '#a1a6af'); fleche(57.2, 135.7, 91.5, 67, k[3], '#a1a6af'); fleche(146, 142, 108.5, 67, k[3], '#e7e9ed');
    const rond = (x, y, r, q, fond, bord, lw, lettre, ly) => { if (q <= 0) return; const e = ressort(q); ctx.save(); ctx.translate(x, y); ctx.scale(e, e);
      ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.3); ctx.fillStyle = fond; ctx.fill(); if (bord) { ctx.strokeStyle = bord; ctx.lineWidth = lw; ctx.stroke(); }
      if (lettre) G.decor(() => { ctx.font = '400 20px "GFS Didot"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = bord; ctx.fillText(lettre, lettre === 'α' ? -0.26 : 0, ly); }); ctx.restore(); };
    rond(50, 150, 16, k[0], '#1d2027', '#e7e9ed', 3.5, 'α', 4.58); rond(150, 150, 9, k[2], '#e7e9ed'); rond(100, 50, 16, k[4], '#121418', '#ff6d7d', 4, 'Ω', 7.01);
    ctx.restore();
  }
  const FE = new Path2D('M-1 0 C-0.55 -0.66 0.5 -0.62 1 0 C0.52 0.44 -0.5 0.52 -1 0 Z');
  const TRONC = new Path2D('M8.7 21.8 C8.6 16.4 10.9 12 16.6 8.2 C12.9 12.3 11.9 16.6 12.7 21.8 Z');
  const BRANCHE = new Path2D('M9.9 14.6 C9.3 12.1 8 10.1 6.4 8.3 C8.6 9.2 10.4 10.9 11.4 13.1 Z');
  const FEUILLES = [[17, 12.9, 12, 2.55], [5.9, 10.8, -14, 1.85], [16.4, 8.6, -36, 3.25], [6.3, 7.9, 28, 2.25], [11.7, 7.8, 67, 3], [8.7, 6.5, 66, 1.85], [14.4, 5.1, -74, 2.55]];
  const VERTS = { fond: ['#1d5649', '#3d5a1a', '#1f6b58'], milieu: ['#35caa4', '#b6ca4c', '#2aa888', '#93a83a'], clair: '#c6f0e5' };
  const feuille = (ctx, x, y, rot, ech, c, alpha = 1) => { if (ech <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(ech, ech); ctx.globalAlpha *= alpha; ctx.fillStyle = c; ctx.fill(FE); ctx.restore(); };
  function prairie() {
    if (prairie.l) return prairie.l; const r = alea(4242), l = [], fin = LU + 10;
    const brin = (x, h, pen, ep, plan, c) => l.push({ g: 'brin', x, h, pen, ep, plan, c, ph: r() * 6.28, cb: (r() - 0.5) * 0.8 });
    for (let x = -6; x < fin; x += 0.75 + r() * 0.9) brin(x, 2.6 + r() * 4.2, (r() - 0.5) * 3, 0.9 + r() * 0.6, 0, VERTS.fond[Math.floor(r() * 3)]);       // le fond, continu
    for (let x = -4 + r() * 6; x < fin;) {
      const tirage = r();
      if (tirage < 0.42) { const nb = 5 + Math.floor(r() * 7), larg = 2.5 + r() * 5, haut = 7 + r() * 8, plan = r() < 0.22 ? 2 : 1;                       // une touffe en éventail
        for (let i = 0; i < nb; i++) { const u = nb > 1 ? i / (nb - 1) * 2 - 1 : 0; brin(x + u * larg * 0.45 + (r() - 0.5), (plan === 2 ? 0.6 : 1) * haut * (1 - 0.5 * u * u) * (0.7 + r() * 0.5), u * (3.5 + r() * 4), 1.1 + r() * 0.8, plan, r() < 0.07 ? VERTS.clair : VERTS.milieu[Math.floor(r() * 4)]); }
        if (r() < 0.3) l.push({ g: 'epi', x: x + (r() - 0.5) * larg * 0.4, h: haut * (1.05 + r() * 0.3), pen: (r() - 0.5) * 5, plan: 1, ph: r() * 6.28 });
        x += larg + 3 + r() * 9; }
      else if (tirage < 0.56) { l.push({ g: 'fleur', x, h: 6 + r() * 7, c: Math.floor(r() * 5), plan: 1, ph: r() * 6.28, pet: 5 + Math.floor(r() * 2) }); x += 4 + r() * 8; }
      else if (tirage < 0.68) { l.push({ g: 'trefle', x, h: 2.2 + r() * 2, plan: r() < 0.5 ? 2 : 1, ph: r() * 6.28 }); x += 3 + r() * 6; }
      else x += 3 + r() * 10;
    }
    return (prairie.l = l);
  }
  function dessinerPrairie(ctx, t, cm, plans, pieds) {
    ctx.save(); ctx.lineCap = 'round';
    for (const b of prairie()) {
      if (!plans.includes(b.plan)) continue; const x = b.x - cm; if (x < -14 || x > LU + 14) continue;
      const tp = HERBE + Math.abs(b.x - 40) / 160 + (b.ph - 3) * 0.05, age = t - tp; if (age < 0) continue;   // l'herbe lève autour du premier arrosage
      const vie = doux(borne(age / (b.g === 'brin' ? 1.2 : 2.2))), raf = 0.45 + 0.55 * Math.sin(0.5 * t - b.x * 0.012), vent = raf * Math.sin(2.1 * t + b.ph + b.x * 0.05) + 0.35 * Math.sin(0.7 * t + b.x * 0.03);
      let ecart = 0; for (const p of pieds) { const d = x - p; if (Math.abs(d) < 6) ecart += Math.sign(d || 1) * (6 - Math.abs(d)) * 0.42; }                      // les brins s'écartent
      const h = b.h * vie;
      if (b.g === 'brin') {
        const tx = x + b.pen + ecart + vent * (0.12 + 0.1 * h), ty = -h * (1 - 0.012 * (b.pen + ecart) * (b.pen + ecart)), mx = x + (b.pen + ecart) * 0.28 + b.cb, my = -h * 0.55, w = b.ep * (0.5 + 0.5 * vie);
        ctx.fillStyle = b.c; ctx.globalAlpha = b.plan === 0 ? 0.9 : 1; ctx.beginPath(); ctx.moveTo(x - w / 2, 0.3); ctx.quadraticCurveTo(mx - w * 0.42, my, tx, ty); ctx.quadraticCurveTo(mx + w * 0.42, my, x + w / 2, 0.3); ctx.closePath(); ctx.fill(); continue; }
      ctx.globalAlpha = 1; const hx = x + (b.pen || 0) * 0.5 + ecart * 0.7 + vent * (0.2 + 0.09 * h), hy = -h;
      if (b.g === 'epi') { ctx.strokeStyle = '#93a83a'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x, hy * 0.6, hx, hy); ctx.stroke();
        for (let i = 0; i < 6; i++) { const u = i / 6, gx = lerp(x, hx, 0.62 + 0.38 * u) + (i % 2 ? 0.55 : -0.55) * (1 - u * 0.5), gy = hy * (0.7 + 0.3 * u) ; feuille(ctx, gx, gy, (i % 2 ? -0.9 : -2.2), 0.95 * vie * (1 - u * 0.35), '#b6ca4c'); } continue; }
      if (b.g === 'trefle') { ctx.strokeStyle = VERTS.milieu[2]; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(hx, hy); ctx.stroke(); ctx.fillStyle = VERTS.milieu[0];
        for (let i = 0; i < 3; i++) { const a = -1.57 + (i - 1) * 2.1 + vent * 0.12; ctx.beginPath(); ctx.arc(hx + Math.cos(a) * 0.85 * vie, hy + Math.sin(a) * 0.85 * vie, 0.85 * vie, 0, 6.3); ctx.fill(); } continue; }
      // une fleur : tige, deux feuilles, pétales autour d'un cœur
      ctx.strokeStyle = VERTS.milieu[2]; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x, hy * 0.5, hx, hy); ctx.stroke();
      feuille(ctx, lerp(x, hx, 0.3) - 1.4, hy * 0.36, -0.55 + vent * 0.15, 1.6 * vie, VERTS.milieu[0]); feuille(ctx, lerp(x, hx, 0.5) + 1.4, hy * 0.55, -2.6 + vent * 0.15, 1.4 * vie, VERTS.milieu[1]);
      const e = ressort(borne((age - 2.3) / 0.5)); if (e <= 0) continue; ctx.fillStyle = RUBC[b.c];
      for (let i = 0; i < b.pet; i++) { const a = i / b.pet * 6.283 + b.ph + vent * 0.1; ctx.beginPath(); ctx.ellipse(hx + Math.cos(a) * 1.15 * e, hy + Math.sin(a) * 1.15 * e, 0.95 * e, 0.55 * e, a, 0, 6.3); ctx.fill(); }
      ctx.fillStyle = '#eef0f3'; ctx.beginPath(); ctx.arc(hx, hy, 0.62 * e, 0, 6.3); ctx.fill();
    }
    ctx.restore();
  }
  function dessinerArbre(ctx, t, a) {
    const age = t - a.ne; if (age < 0) return; const s = a.ech;
    const tronc = doux(borne(age / (a.lent ? 0.9 : 0.6))), branche = doux(borne((age - 0.35) / 0.4)), rafale = 0.5 + 0.5 * Math.sin(0.5 * t - a.x * 0.006);
    const X = (ux, uy) => [a.x + (ux - 10.7) * s * a.miroir, (uy - 21.8) * s];
    ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = C.filet; ctx.beginPath(); ctx.ellipse(a.x, 0.5, 3.2 * s * borne(age / 0.5), 1.6, 0, 0, 6.3); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(a.x, 0); ctx.rotate(0.018 * Math.sin(0.9 * t + a.x * 0.01)); ctx.scale(s * a.miroir, s * tronc); ctx.translate(-10.7, -21.8);
    ctx.fillStyle = C.gd; ctx.fill(TRONC);
    if (branche > 0) { ctx.translate(11.4, 13.1); ctx.scale(branche, branche); ctx.translate(-11.4, -13.1); ctx.fillStyle = C.gm; ctx.fill(BRANCHE); }
    ctx.restore();
    FEUILLES.forEach(([ux, uy, deg, e], i) => {
      const eclos = borne((age - 0.5 - i * 0.09) / 0.4); if (eclos <= 0) return;
      const rot0 = deg * Math.PI / 180 * a.miroir, [x0, y0] = X(ux, uy), ph = i * 1.7 + a.x, vent = (0.09 + 0.13 * rafale) * Math.sin(2.3 * t + ph);
      feuille(ctx, x0 + vent * 3, y0, rot0 + vent, e * s * ressort(eclos), a.coul[i]);
    });
    for (const f of a.extra || []) { const q = pr(t, f.t, 0.4); if (q <= 0) continue; const [x0, y0] = X(f.u, f.v), vent = (0.09 + 0.13 * rafale) * Math.sin(2.3 * t + f.u * 3 + f.v); feuille(ctx, x0 + vent * 3, y0, f.rot + vent, f.e * s * ressort(q), f.c); }
  }

  globalThis.K = { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, fr, C, RUBC, F, txt, ligne, legende, chargerFormules, formule, largeur, cadre,
    repere, dans, axes, courbe, droite, trait, point, fleche, logo, feuille, FEUILLES, dessinerPrairie, dessinerArbre, SC, SOLPX, LU, BEC };
})();
