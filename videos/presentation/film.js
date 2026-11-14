// LE FILM — « Présentation d'ATLAS », 1080 × 1920. Chaque image est une fonction pure de t.
// Dessins repris du site : symboles de la planche sym-sprite, miniature de l'édifice (data.js, engendré par
// gen-data.js), jardinier, arbres, herbe et labrador de accueilJardin (gabarit.html, §73 du mémo À propos).
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio, D = globalThis.ATLAS_DATA;
  const { T, BEAT } = S;
  const W = G.W, H = G.H, CX = 540;                    // CX : milieu de l'image
  const borne = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), doux = (x) => x * x * (3 - 2 * x);
  const ressort = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const pr = (t, t0, d) => borne((t - t0) / d), sortie = (x) => 1 - Math.pow(1 - x, 3);
  const lerp = (a, b, k) => a + (b - a) * k;
  const alea = (g) => () => { g |= 0; g = g + 0x6D2B79F5 | 0; let t = Math.imul(g ^ g >>> 15, 1 | g); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // ---------- couleurs : thème sombre de gabarit.html ----------
  const C = { papier: '#121418', surface: '#191c22', encre: '#e7e9ed', encre2: '#aeb4be', encre3: '#90979f', filet: '#2b2f37', trame: '#1f2329', rouge: '#ff6d7d', noeud: '#1d2027', arete: '#5b616b',
    edifice: '#55aaff', cours: '#35caa4', exercices: '#c793e6', annales: '#ffa24a', activites: '#b6ca4c', gd: '#d6d9de', gm: '#a3a8b1', gl: '#4a505b' };
  const RUBC = [C.edifice, C.cours, C.exercices, C.annales, C.activites];
  const SYC = { 'sy-bd': '#a9cbec', 'sy-bb': '#7fb0de', 'sy-b1': '#55aaff', 'sy-b2': '#2f7cc4', 'sy-b3': '#a9d2fa', 'sy-vd': '#ead6f6', 'sy-vm': '#c793e6', 'sy-vl': '#56366c',
    'sy-td': '#c6f0e5', 'sy-tm': '#35caa4', 'sy-tl': '#1d5649', 'sy-od': '#ffdcb3', 'sy-om': '#ffa24a', 'sy-ol': '#6a4218', 'sy-gd': '#d6d9de', 'sy-gm': '#a3a8b1', 'sy-gl': '#4a505b',
    'activites-sy1': ['#b6ca4c', 1], 'activites-sy2': ['#b6ca4c', 0.55], 'activites-sy3': ['#b6ca4c', 0.25] };
  const F = { titre: 'Spectral', ui: '"IBM Plex Sans"', mono: '"IBM Plex Mono"' };

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
  // une ligne faite de segments de couleurs différentes, centrée
  function ligne(ctx, segs, x, y, o = {}) {
    if (typeof segs === 'string') return txt(ctx, segs, x, y, o);
    ctx.save();
    const f = (g) => `${g.it ? 'italic ' : ''}${g.w || o.w || 600} ${o.size || 48}px ${o.fam || F.titre}`;
    let total = 0; for (const g of segs) { ctx.font = f(g); total += ctx.measureText(g.s).width; }
    let cx = x - total / 2; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha *= o.a ?? 1;
    for (const g of segs) { ctx.font = f(g); ctx.fillStyle = g.c || o.c || C.encre; ctx.fillText(g.s, cx, y); cx += ctx.measureText(g.s).width; }
    ctx.restore();
  }
  // légende : lignes qui montent une à une, puis s'effacent ensemble
  function legende(ctx, t, { t0, t1, lignes, y = 300, size = 56, lh = 74, sur, w, debuts }) {
    if (t < t0 || t > t1 + 0.3) return;
    const out = 1 - pr(t, t1, 0.25);
    if (sur) { const a = sortie(pr(t, t0, 0.3)) * out; txt(ctx, sur, CX, y - lh + 6, { fam: F.mono, w: 500, size: 26, ls: 4, c: C.encre3, a }); }
    lignes.forEach((l, i) => { const d = debuts ? debuts[i] : t0 + i * 0.12, k = sortie(pr(t, d, 0.35)); if (k <= 0) return; ligne(ctx, l, CX, y + i * lh + (1 - k) * 26, { size, w: w || 600, a: k * out }); });
  }
  const pilule = (ctx, x, y, w, h, o = {}) => { ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, o.r ?? h / 2); if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); } if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 3; ctx.stroke(); } ctx.restore(); };

  // ---------- symboles du site ----------
  const FE = new Path2D('M-1 0 C-0.55 -0.66 0.5 -0.62 1 0 C0.52 0.44 -0.5 0.52 -1 0 Z');
  const P2 = new Map(), p2 = (d) => { if (!P2.has(d)) P2.set(d, new Path2D(d)); return P2.get(d); };
  const appliquer = (ctx, tf) => { for (const m of tf.matchAll(/(translate|rotate|scale)\(([^)]*)\)/g)) { const v = m[2].trim().split(/[\s,]+/).map(Number); if (m[1] === 'translate') ctx.translate(v[0], v[1] || 0); else if (m[1] === 'rotate') ctx.rotate(v[0] * Math.PI / 180); else ctx.scale(v[0], v[1] ?? v[0]); } };
  const coulSym = (cls) => { for (const c of cls.split(' ').reverse()) if (SYC[c]) return Array.isArray(SYC[c]) ? SYC[c] : [SYC[c], 1]; return [C.gm, 1]; };
  // a : secondes écoulées depuis l'apparition (les pièces p-… s'animent comme au survol sur le site, §70)
  function symbole(ctx, nom, cx, cy, taille, a) {
    const k = taille / 24;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-12, -12);
    for (const it of D.SYM[nom]) {
      const cls = it.cls, [coul, op] = coulSym(cls), i = +(it.i ?? 0);
      if (cls.includes('p-tourne')) continue;
      ctx.save(); for (const g of it.gtf) appliquer(ctx, g);
      let alpha = op;
      if (cls.includes('p-l')) { const q = sortie(pr(a, 0.35 + i * 0.14, 0.3)); ctx.translate(i < 2 ? 5 : 14.4, 0); ctx.scale(q, 1); ctx.translate(-(i < 2 ? 5 : 14.4), 0); }
      if (cls.includes('p-fe')) { const q = ressort(pr(a, 0.25 + i * 0.09, 0.4)); if (q <= 0) { ctx.restore(); continue; } const mm = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(it.tf); ctx.translate(+mm[1], +mm[2]); ctx.scale(q, q); ctx.translate(-mm[1], -mm[2]); }
      if (cls.includes('p-trace')) { const q = pr(a, 0.35, 0.7); ctx.beginPath(); ctx.rect(5.5, 11, 6.2 * q, 6); ctx.clip(); }
      if (cls.includes('p-crayon')) { const q = pr(a, 0.35, 0.7), r = q < 1 ? 1 : 1 - sortie(pr(a, 1.15, 0.3)); ctx.translate((-5.6 + 4.9 * q) * r, (-0.4 + 0.7 * Math.sin(q * 9.4)) * r); }
      if (cls.includes('p-devant')) { const q = ressort(pr(a, 0.3, 0.45)); ctx.translate(-3.4 * (1 - q), 3.2 * (1 - q)); alpha *= borne(pr(a, 0.3, 0.2)); }
      if (cls.includes('p-curseur')) { const q = doux(pr(a, 0.35, 0.8)); ctx.translate(lerp(-5.5, 0, q), 0); }
      if (cls.includes('p-point')) { const q = ressort(pr(a, 1.05, 0.35)); ctx.translate(11.1, 11.4); ctx.scale(q, q); ctx.translate(-11.1, -11.4); }
      ctx.globalAlpha *= alpha;
      if (it.nom === 'use') { appliquer(ctx, it.tf); ctx.fillStyle = coul; ctx.fill(FE); }
      else if (it.trait) { ctx.strokeStyle = SYC[it.trait.replace('--', '')] || C.gm; ctx.lineWidth = it.lw; ctx.beginPath(); if (it.nom === 'circle') ctx.arc(it.cx, it.cy, it.r, 0, 6.3); else ctx.stroke(p2(it.d)); if (it.nom === 'circle') ctx.stroke(); }
      else if (it.nom === 'circle') { ctx.fillStyle = coul; ctx.beginPath(); ctx.arc(it.cx, it.cy, it.r, 0, 6.3); ctx.fill(); }
      else { ctx.fillStyle = coul; ctx.fill(p2(it.d)); }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---------- logo complet (identite/fabriquer-icones.mjs, « grand format, avec lettres ») ----------
  // k : alpha, flèche alpha → point, point, flèches vers oméga, oméga (chacun de 0 à 1)
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

  // ---------- le jardin (unités de accueilJardin : le sol est en y = 0 ; 1 unité = SC pixels) ----------
  const SC = 5.2, SOLPX = 1492, LU = W / SC, XE = CX / SC, BEC = 18, PASM = 120;   // XE : abscisse (unités) où tout pousse ; PASM : avance du monde par étape
  const TRONC = new Path2D('M8.7 21.8 C8.6 16.4 10.9 12 16.6 8.2 C12.9 12.3 11.9 16.6 12.7 21.8 Z');
  const BRANCHE = new Path2D('M9.9 14.6 C9.3 12.1 8 10.1 6.4 8.3 C8.6 9.2 10.4 10.9 11.4 13.1 Z');
  const FEUILLES = [[17, 12.9, 12, 2.55], [5.9, 10.8, -14, 1.85], [16.4, 8.6, -36, 3.25], [6.3, 7.9, 28, 2.25], [11.7, 7.8, 67, 3], [8.7, 6.5, 66, 1.85], [14.4, 5.1, -74, 2.55]];
  const GXA = 33, GXB = XE - BEC;                       // le jardinier : à gauche de l'édifice, ou l'arrosoir au-dessus de l'arbre
  const MARCHES = [...S.RUB.map((r) => r.marche), S.partage.marche, S.ambition.marche];
  const AVANCE = [PASM, PASM, PASM, PASM, PASM, 175], XAMB = XE + AVANCE.reduce((a, b) => a + b, 0);   // la dernière étape est plus longue : le grand arbre sort du champ
  const cam = (t) => MARCHES.reduce((s, [a, b], i) => s + AVANCE[i] * doux(pr(t, a, b - a)), 0);
  const ARROSE = [[T(2) + 0.1, T(3, 3)], ...S.RUB.map((r) => r.arrose), S.partage.arrose, S.ambition.arrose];
  function jardinierA(t) {
    const [e0, e1] = S.entree.jardinier, ue = pr(t, e0, e1 - e0), m1 = S.RUB[0].marche, m2 = S.ambition.marche;
    let x = lerp(-60, GXA, ue < 0.85 ? ue * 1.06 : 0.901 + 0.099 * sortie((ue - 0.85) / 0.15));
    x += (GXB - GXA) * doux(pr(t, m1[0], m1[1] - m1[0])) - (GXB - GXA) * doux(pr(t, m2[0], m2[1] - m2[0]));
    const dans = (a, b) => Math.min(doux(pr(t, a, 0.15)), 1 - doux(pr(t, b - 0.15, 0.15)));
    const entre = dans(e0, e1), court = Math.max(...MARCHES.map(([a, b]) => dans(a, b)));
    let arrose = 0; for (const [a, b] of ARROSE) arrose = Math.max(arrose, Math.min(doux(pr(t, a, 0.3)), 1 - doux(pr(t, b - 0.3, 0.3))));
    let verse = false; for (const [a, b] of ARROSE) if (t > a + 0.25 && t < b - 0.25) verse = true;
    // gestes : il suit des yeux l'édifice qui monte, s'essuie le front, salue les messages, regarde l'arbre fleurir
    const fen = (a, b) => Math.min(doux(pr(t, a, 0.35)), 1 - doux(pr(t, b - 0.35, 0.35))), R1 = S.RUB[1];
    const gestes = [['regard', fen(T(3, 3) + 0.2, T(6) - 0.2), -0.3], ['front', fen(R1.arrose[1] + 0.1, R1.arrose[1] + 1.2), 0.08], ['salut', fen(S.retours[0].t - 0.4, S.retours[7].t + 0.5), -0.12], ['regard', fen(S.ambition.arrose[1] + 0.2, S.fin.t0 + 0.2), -0.3]];
    let geste = { nom: '', k: 0 }, tete = 0.1 * arrose; for (const [nom, k, tt] of gestes) if (k > geste.k) { geste = { nom, k }; tete = tt * k; }
    return { x, t, marche: Math.max(entre, court), phase: court > 0 ? t * 12 : x * globalThis.JARDINIER.PAS_MARCHE, elan: court, arrose, verse, tete, geste, chapeau: Math.sin(Math.PI * pr(t, S.fin.chapeau, 1.3)) };
  }
  // ----- l'herbe : des brins pleins, larges au pied et effilés, sur trois plans (fond sombre, touffes, premier plan),
  // avec des épis, des trèfles et des fleurs ; le vent courbe surtout les pointes, et les brins s'écartent sous les pas -----
  const VERTS = { fond: ['#1d5649', '#3d5a1a', '#1f6b58'], milieu: ['#35caa4', '#b6ca4c', '#2aa888', '#93a83a'], clair: '#c6f0e5' };
  function prairie() {
    if (prairie.l) return prairie.l; const r = alea(4242), l = [], fin = XAMB + LU;
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
  const feuille = (ctx, x, y, rot, ech, c, alpha = 1) => { if (ech <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(ech, ech); ctx.globalAlpha *= alpha; ctx.fillStyle = c; ctx.fill(FE); ctx.restore(); };
  // plans : [0, 1] avant les personnages, [2] après eux ; pieds : abscisses (écran) où l'on marche
  function dessinerPrairie(ctx, t, cm, plans, pieds) {
    ctx.save(); ctx.lineCap = 'round';
    for (const b of prairie()) {
      if (!plans.includes(b.plan)) continue; const x = b.x - cm; if (x < -14 || x > LU + 14) continue;
      const tp = b.x < LU + 4 ? T(2) + 0.35 + Math.abs(b.x - 52) / 75 + (b.ph - 3) * 0.05 : -10, age = t - tp; if (age < 0) continue;   // l'herbe lève autour du premier arrosage
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
  // un arbre du symbole de l'édifice ; a = { x (unités, écran), ne, ech, miroir, coul: [7 couleurs], extra: [{u, v, rot, e, c, t}] }
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
  function dessinerJardinier(ctx, t, j) {
    if (j.x < -30 || j.x > LU + 30) return;
    const { bec } = globalThis.JARDINIER.dessiner(ctx, j);
    if (!j.verse) return;                                 // l'arrosoir verse des symboles
    ctx.save(); ctx.fillStyle = C.edifice;
    G.decor(() => { ctx.font = `700 8.5px ${F.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i < 5; i++) { const ph = (t * 1.15 + i / 5) % 1, ec = (i % 3 - 1) * 3.2; ctx.globalAlpha = 0.95 - ph * 0.4; ctx.fillText('+×π=∑'[(i + Math.floor(t * 1.15 + i / 5)) % 5], bec[0] + 1.5 + ec + ph * (1.5 + ec * 0.4), bec[1] + 2 + ph * ph * (-bec[1] - 5)); } });
    ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.ellipse(bec[0] + 2, 0.5, 9, 1.8, 0, 0, 6.3); ctx.fill(); ctx.restore();
  }
  // ---------- le labrador : position et posture, fonctions de t ----------
  const XD = 158;                                         // où il attend, à droite de l'édifice
  function chienA(t) {
    const [c0, c1] = S.entree.chien, m1 = S.RUB[0].marche, m2 = S.ambition.marche;
    const u0 = pr(t, c0, c1 - c0), u1 = doux(pr(t, m1[0], m1[1] - m1[0])), u2 = doux(pr(t, m2[0] + 0.1, m2[1] - m2[0] - 0.1));
    const x = lerp(-22, XD, u0 < 0.8 ? u0 * 1.1 : 0.88 + 0.12 * sortie((u0 - 0.8) / 0.2)) + (GXB - 32 - XD) * u1 + (XD - (GXB - 32)) * u2;
    const galope = (t > c0 && t < c1 - 0.15) || MARCHES.slice(1).some(([a, b]) => t > a && t < b - 0.1), trotte = t > m1[0] && t < m1[1];
    const bouge = galope || trotte;
    // il regarde vers la gauche quand il attend à droite de l'édifice
    const face = 1 - 2 * doux(pr(t, c1 + 0.05, 0.3)) + 2 * doux(pr(t, m1[0] - 0.05, 0.3)) - 2 * doux(pr(t, m2[1] + 0.05, 0.3));
    // assis : un peu après chaque arrêt, debout un peu avant chaque départ
    const arrets = [[S.entree.papillon[1] - 0.3, m1[0]], ...MARCHES.map(([, b], i) => [b, i + 1 < MARCHES.length ? MARCHES[i + 1][0] : 99])];
    let assis = 0; for (const [a, b] of arrets) assis = Math.max(assis, Math.min(doux(pr(t, a + 0.15, 0.3)), 1 - doux(pr(t, b - 0.3, 0.25))));
    const [p0, p1] = S.entree.papillon; const jeu = Math.min(doux(pr(t, p0, 0.3)), 1 - doux(pr(t, p1 - 0.3, 0.3)));
    assis *= 1 - jeu;
    for (const ts of [S.partage.saut]) assis *= 1 - Math.min(doux(pr(t, ts - 0.75, 0.3)), 1 - doux(pr(t, ts + 0.75, 0.3)));   // il se lève pour sauter
    const P = { x, face, t, assis, tang: 0, tete: -0.42 * jeu, cou: 0.15 * jeu, bas: 0, saut: 0, queue: { a: lerp(-1.15, -0.35, assis) + 1.0 * jeu * (1 - assis), amp: lerp(0.06, 0.4, assis) + 0.45 * jeu, f: 8, courbe: lerp(0.1, -0.12, assis) }, allure: 'pose', vol: 0, phase: 0 };
    if (t > S.fin.t0) P.queue.amp = 0.7;
    const sauter = (k, haut) => { if (k <= 0 || k >= 1) return;
      if (k < 0.2) { const u = doux(k / 0.2); P.bas = 2.4 * u; P.tang = -0.14 * u; }
      else if (k < 0.86) { const u = (k - 0.2) / 0.66; P.saut = haut * 4 * u * (1 - u); P.tang = 0.5 - 0.85 * doux(u); P.allure = 'vol'; P.vol = u; P.tete = -0.25 + 0.35 * u; P.queue = { a: 0.3 - 0.5 * u, amp: 0.1, f: 8, courbe: 0.05 }; }
      else { const u = (k - 0.86) / 0.14; P.bas = 2.6 * (1 - u); P.tang = -0.2 * (1 - u); } };
    for (const ts of [...S.entree.sauts, S.partage.saut]) sauter((t - ts + 0.16) / 0.78, 11);   // le haut du saut tombe sur le temps
    if (bouge && P.allure === 'pose') {
      if (galope) { P.phase = t < c1 ? x * 0.21 : t * 14; P.allure = 'galop'; P.queue = { a: -0.05, amp: 0.1, f: 8, courbe: 0.04 }; P.tete = -0.05; }
      else { P.phase = t * 9; P.allure = 'trot'; P.queue = { a: -0.35, amp: 0.25, f: 8, courbe: 0.06 }; }
    }
    P.jeu = jeu; return P;
  }
  // ---------- l'édifice (positions, arêtes et couleurs de la miniature du site) ----------
  const ED = (() => {
    const nds = D.EDIFICE.nds.map((n) => ({ ...n, fond: (() => { const m = /srgb ([\d.]+) ([\d.]+) ([\d.]+)/.exec(n.fill); return m ? `rgb(${Math.round(m[1] * 255)},${Math.round(m[2] * 255)},${Math.round(m[3] * 255)})` : C.noeud; })() }));
    const ys = [...new Set(nds.map((n) => n.y))].sort((a, b) => b - a), par = {};
    nds.forEach((n) => { n.rang = ys.indexOf(n.y); par[n.t] = n; });
    [...nds].sort((a, b) => b.y - a.y || a.x - b.x).forEach((n, j) => { n.ordre = j; });
    const mes = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const ar = D.EDIFICE.ar.map((a) => { mes.setAttribute('d', a.d); return { ...a, p: new Path2D(a.d), L: mes.getTotalLength() }; });
    const fil = S.fil.map((f, k) => ({ ...f, n: par[f.id], ar: k ? ar.find((a) => a.de === S.FIL[k - 1] && a.vers === f.id) : null }));
    fil.forEach((f, k) => { if (!f.n || (k && !f.ar)) console.error('fil : arête absente', f.id); });
    return { nds, ar, par, fil, bas: par.log };
  })();
  const EDS = 0.53, EDY = 1440;                          // échelle, et ordonnée (pixels) du bas de la logique
  // mode 'monte' : rang par rang, puis le fil ; mode 'fleurit' : pâle, puis chaque théorie reçoit trois feuilles
  function edifice(ctx, t, xpx, mode, alpha) {
    if (alpha <= 0) return;
    const monte = mode === 'monte', tn = (n) => monte ? S.rangs[n.rang].t : S.ambition.arbre;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(xpx, EDY); ctx.scale(EDS, EDS); ctx.translate(-ED.bas.x, -(ED.bas.y + ED.bas.h / 2));
    ctx.save(); ctx.strokeStyle = C.gd; ctx.lineWidth = 7; ctx.lineCap = 'round'; const tige = monte ? pr(t, T(2) - 0.2, 0.3) : pr(t, S.ambition.arbre, 0.3);   // la tige sort du sol
    if (tige > 0) { const y1 = ED.bas.y + ED.bas.h / 2 + (SOLPX - EDY) / EDS; ctx.beginPath(); ctx.moveTo(ED.bas.x, y1); ctx.lineTo(ED.bas.x, y1 - tige * (SOLPX - EDY) / EDS); ctx.stroke(); } ctx.restore();
    const fleuri = (n) => mode === 'fleurit' ? pr(t, S.fleurs[n.ordre].t, 0.3) : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const a of ED.ar) { const v = ED.par[a.vers], q = monte ? pr(t, tn(v) - 0.22, 0.3) : pr(t, tn(v), 0.5); if (q <= 0) continue;
      ctx.save(); ctx.globalAlpha *= mode === 'fleurit' ? lerp(0.4, 0.9, Math.min(fleuri(v), fleuri(ED.par[a.de]))) : 0.9; ctx.strokeStyle = C.arete; ctx.lineWidth = 4.2; ctx.setLineDash([a.L * q, a.L]); ctx.stroke(a.p); ctx.restore(); }
    if (monte) {                                          // le fil lumineux, de la logique au théorème
      ED.fil.forEach((f, k) => { if (!k) return; const q = pr(t, ED.fil[k - 1].t, f.t - ED.fil[k - 1].t); if (q <= 0) return;
        ctx.save(); ctx.strokeStyle = '#ffffff'; ctx.shadowColor = C.edifice; ctx.shadowBlur = 22; ctx.lineWidth = 7.5; ctx.setLineDash([f.ar.L * q, f.ar.L]); ctx.stroke(f.ar.p); ctx.restore(); });
    }
    for (const n of ED.nds) {
      const q = monte ? ressort(pr(t, tn(n), 0.32)) : sortie(pr(t, tn(n), 0.5)); if (q <= 0) continue;
      const fl = fleuri(n), f = monte ? ED.fil.find((g) => g.n === n) : null, allume = f ? pr(t, f.t, 0.12) : 0, choc = f ? Math.max(0, 1 - (t - f.t) / 0.35) * (t >= f.t ? 1 : 0) : (mode === 'fleurit' ? Math.max(0, 1 - (t - S.fleurs[n.ordre].t) / 0.3) * (t >= S.fleurs[n.ordre].t ? 1 : 0) : 0);
      ctx.save(); ctx.translate(n.x, n.y); const e = (monte ? q : 1) * (1 + 0.16 * choc); ctx.scale(e, e); ctx.globalAlpha *= (monte ? 1 : q) * (mode === 'fleurit' ? lerp(0.5, 1, fl) : 1);
      if (allume > 0) { ctx.shadowColor = n.stroke; ctx.shadowBlur = 30; }
      ctx.beginPath(); ctx.roundRect(-n.w / 2, -n.h / 2, n.w, n.h, n.w <= 50 ? n.w / 2 : 13); ctx.fillStyle = allume > 0 ? n.stroke : n.fond; ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = n.stroke; ctx.lineWidth = 5.5; ctx.stroke();
      ctx.fillStyle = allume > 0 ? C.papier : n.stroke; ctx.beginPath(); ctx.arc(n.w <= 50 ? 0 : -n.w / 2 + 19, 0, 7.5, 0, 6.3); ctx.fill();
      ctx.restore();
      if (mode === 'fleurit') [[-0.27, C.cours, -2.5], [0, C.exercices, -1.57], [0.27, C.activites, -0.64]].forEach(([dx, c, rot], i) => {      // cours, exercices, activités
        const k = pr(t, S.fleurs[n.ordre].t + i * 0.06, 0.35); if (k <= 0) return; const lx = n.x + dx * Math.max(n.w, 70), ly = n.y - n.h / 2 - 9 - (i === 1 ? 7 : 0), vent = 0.16 * Math.sin(2.3 * t + n.x * 0.05 + i);
        feuille(ctx, lx, ly, rot + vent, 15 * ressort(k), c); });
    }
    ctx.restore();
  }

  // ---------- décor ----------
  const GLY = (() => { const r = alea(77), l = []; for (let i = 0; i < 16; i++) l.push({ x: r() * W, y: r() * 1500, s: 34 + r() * 40, c: '+×π=∑∞√∫'[Math.floor(r() * 8)], v: 8 + r() * 14, ph: r() * 6.28, k: Math.floor(r() * 5) }); return l; })();
  function fond(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    [[C.edifice, 0.2, 0.25, 0.11, 0], [C.cours, 0.85, 0.45, 0.09, 2], [C.exercices, 0.3, 0.7, 0.09, 4], [C.annales, 0.8, 0.12, 0.06, 1]].forEach(([c, fx, fy, a, ph]) => {     // halos de couleur, lents
      const x = (fx + 0.06 * Math.sin(t * 0.21 + ph)) * W, y = (fy + 0.04 * Math.cos(t * 0.17 + ph)) * H, R = 620, g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, c); g.addColorStop(1, 'rgba(18,20,24,0)'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - R, y - R, 2 * R, 2 * R); ctx.restore(); });
    G.decor(() => { for (const g of GLY) { const y = ((g.y - t * g.v) % 1500 + 1500) % 1500 - 40; txt(ctx, g.c, g.x + 14 * Math.sin(t * 0.5 + g.ph), y, { size: g.s, w: 500, c: RUBC[g.k], a: 0.075 * Math.min(1, y / 200, (1440 - y) / 200) }); } });
    const g = ctx.createLinearGradient(0, SOLPX, 0, H); g.addColorStop(0, '#171a20'); g.addColorStop(1, '#0e1013'); ctx.fillStyle = g; ctx.fillRect(0, SOLPX, W, H - SOLPX);
    G.decor(() => { GLY.forEach((g, i) => { txt(ctx, g.c, ((g.x * 1.7 + t * (i % 2 ? 9 : -7)) % W + W) % W, SOLPX + 120 + (g.y % 280), { size: g.s * 0.9, w: 500, c: C.gm, a: 0.06 }); }); });
    ctx.strokeStyle = C.filet; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, SOLPX + 2); ctx.lineTo(W * sortie(pr(t, 0, 0.7)), SOLPX + 2); ctx.stroke();
  }

  // ---------- les arbres du jardin ----------
  const melange = (dom, g) => { const r = alea(g); return FEUILLES.map(() => r() < 0.62 ? dom : RUBC[Math.floor(r() * 5)]); };
  const ARBRES = S.RUB.map((r, k) => ({ xm: XE + PASM * (k + 1), ne: r.plante, ech: 3.1, miroir: k % 2 ? -1 : 1, coul: melange(C[r.id], 31 + k) }));
  const GRAND = { xm: XE + PASM * 5, ne: S.partage.plante, ech: 5.4, miroir: 1, lent: true, coul: melange(C.cours, 99),
    extra: S.retours.map((n, i) => { const r = alea(500 + i); return { u: [3.6, 19.2, 9.8, 13.2, 4.6, 18.6, 11.4, 7.4][i], v: [12.6, 10.2, 3.4, 10.6, 5.2, 5.6, 1.6, 10.2][i], rot: (r() - 0.5) * 2.4, e: 2.3 + r() * 0.7, c: RUBC[(i * 2 + 1) % 5], t: n.t }; }) };

  // ---------- scènes ----------
  function ouverture(ctx, t) {
    const out = 1 - pr(t, T(2) - 0.35, 0.4); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out; ctx.translate(0, -50 * (1 - out));
    const L = S.logo, k = [pr(t, L[0].t, 0.3), pr(t, L[0].t + 0.1, 0.38), pr(t, L[1].t, 0.3), pr(t, L[1].t + 0.1, 0.38), pr(t, L[2].t, 0.3)];
    const choc = t >= L[2].t ? Math.max(0, 1 - (t - L[2].t) / 0.6) : 0;
    if (choc > 0) { ctx.save(); ctx.globalAlpha *= 0.5 * choc; ctx.strokeStyle = C.rouge; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(CX, 518, 40 + 260 * (1 - choc), 0, 6.3); ctx.stroke(); ctx.restore(); }
    logo(ctx, CX, 600, 380 * (1 + 0.05 * choc), k, ressort(pr(t, 0.08, 0.4)));
    const a = sortie(pr(t, S.titre, 0.4)); if (a > 0) txt(ctx, 'ATLAS', CX, 960 + (1 - a) * 30, { size: 176, w: 700, ls: 22, a });
    const b = sortie(pr(t, S.sousTitre, 0.4));
    if (b > 0) txt(ctx, 'MATHÉMATIQUES · DE LA LOGIQUE AUX GRANDES THÉORIES', CX, 1052 + (1 - b) * 24, { fam: F.mono, w: 500, size: 25, ls: 2.5, c: C.encre2, a: b });
    ctx.restore();
  }
  function sceneEdifice(ctx, t, cm) {
    const a = 1 - pr(t, T(6), 0.3); if (t < T(2) - 0.3 || a <= 0) return;
    edifice(ctx, t, (XE - cm) * SC, 'monte', a);
    legende(ctx, t, { t0: T(2, 0.5), t1: T(4) - 0.2, y: 300, size: 60, lh: 78, lignes: ['L’architecture', 'des mathématiques,', [{ s: 'de l’axiome au théorème', c: C.rouge, w: 700, it: true }]] });
    legende(ctx, t, { t0: T(4), t1: T(6) - 0.15, y: 306, size: 52, lh: 66, sur: 'L’ÉDIFICE', lignes: [[{ s: '38 théories', c: C.edifice, w: 700 }, { s: ', 982 définitions,' }], 'axiomes et théorèmes,', 'démontrés dans l’ordre.'] });
    // le nom de la théorie que le fil traverse, puis le théorème atteint
    const out = 1 - pr(t, T(6) - 0.15, 0.25);
    if (t >= ED.fil[0].t && t < S.theoreme) { let f = ED.fil[0]; for (const g of ED.fil) if (t >= g.t) f = g; txt(ctx, f.n.titre, CX, 548, { fam: F.ui, w: 600, size: 36, c: f.n.stroke }); }
    else if (t >= S.theoreme) { const k = ressort(pr(t, S.theoreme, 0.35)); ctx.save(); ctx.translate(CX, 536); ctx.scale(k, k); ctx.globalAlpha = out;
      pilule(ctx, 0, 0, 652, 68, { fill: C.surface, stroke: C.encre, lw: 2.5, r: 14 }); pilule(ctx, 0, 0, 638, 54, { stroke: C.encre, lw: 2.5, r: 9 });      // double filet : un théorème
      txt(ctx, 'Théorème des nombres premiers', 0, 13, { size: 39, w: 700 }); ctx.restore(); }
  }
  function carte(ctx, t, r) {
    const fin = r.k < 3 ? S.RUB[r.k + 1].t0 : S.partage.t0, e = sortie(pr(t, r.t0 + 0.28, 0.5)), s = pr(t, fin - 0.05, 0.4); if (e <= 0 || s >= 1) return;
    const coul = C[r.id], dx = (1 - e) * 620 - doux(s) * 620, EC = globalThis.ECRANS, x0 = CX - EC.LW / 2, y0 = 296;
    ctx.save(); ctx.globalAlpha = e * (1 - s); ctx.translate(dx, 0);
    // le nom de la rubrique, précédé de son symbole
    { ctx.save(); ctx.font = `500 30px ${F.mono}`; ctx.letterSpacing = '7px'; const w = ctx.measureText(r.nom.toUpperCase()).width; ctx.restore();
      symbole(ctx, r.id, CX - w / 2 - 20, 252, 46, t - r.t0 - 0.3); txt(ctx, r.nom.toUpperCase(), CX + 26, 263, { fam: F.mono, w: 500, size: 30, ls: 7, c: coul }); }
    // l'écran : ce qu'on fait dans la rubrique
    ctx.save(); ctx.translate(x0, y0); ctx.beginPath(); ctx.roundRect(0, 0, EC.LW, EC.LH, 26); ctx.save(); ctx.clip(); G.decor(() => EC[r.id](ctx, t - r.t0, S.ECR[r.id])); ctx.restore(); ctx.strokeStyle = C.filet; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    // le chiffre et ce qu'il compte, sur une ligne
    const v = Math.round(r.n * sortie(pr(t, r.compte[0], r.compte[1] - r.compte[0]))), choc = t >= r.plante ? Math.max(0, 1 - (t - r.plante) / 0.3) : 0, nbr = v.toLocaleString('fr-FR').replace(/\s/g, '\u2009');
    ctx.save(); ctx.font = `700 128px ${F.titre}`; const w1 = ctx.measureText(r.n.toLocaleString('fr-FR').replace(/\s/g, '\u2009')).width; ctx.font = `600 50px ${F.ui}`; const w2 = ctx.measureText(r.quoi).width; ctx.restore();
    const xg = CX - (w1 + 26 + w2) / 2;
    ctx.save(); ctx.translate(xg + w1, 934); ctx.scale(1 + 0.08 * choc, 1 + 0.08 * choc); txt(ctx, nbr, 0, 0, { size: 128, w: 700, c: coul, align: 'right' }); ctx.restore();
    txt(ctx, r.quoi, xg + w1 + 26, 928, { fam: F.ui, w: 600, size: 50, align: 'left' });
    txt(ctx, r.sous, CX, 1000, { fam: F.ui, w: 400, size: 37, c: C.encre2 });
    ctx.restore();
  }
  // petits pictogrammes des messages : drapeau du bouton « Signaler une erreur », coche, point d'interrogation, crayon
  const DRAPEAU = new Path2D('M5 21V4M5 4.5c2.2-1.3 4.4-1.3 6.6 0s4.4 1.3 6.6 0v8.4c-2.2 1.3-4.4 1.3-6.6 0s-4.4-1.3-6.6 0');
  function picto(ctx, i, c) {
    ctx.save(); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (i % 4 === 0) { ctx.translate(-11.5, -12.5); ctx.stroke(DRAPEAU); }
    else if (i % 4 === 1) { ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-2.5, 6); ctx.lineTo(8.5, -6.5); ctx.lineWidth = 3; ctx.stroke(); }
    else if (i % 4 === 2) G.decor(() => txt(ctx, '?', 0, 9, { fam: F.ui, w: 600, size: 27, c }));
    else { ctx.rotate(0.78); ctx.beginPath(); ctx.roundRect(-2.6, -11, 5.2, 15, 1.2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-2.6, 6); ctx.lineTo(2.6, 6); ctx.lineTo(0, 11.5); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function scenePartage(ctx, t, cm) {
    const P = S.partage; if (t < P.t0 || t > T(17) + 0.6) return; const out = 1 - pr(t, T(17) - 0.05, 0.35);
    legende(ctx, t, { t0: T(14, 0.5), t1: P.signaler - 0.25, y: 318, size: 58, lh: 76, sur: 'OUVERT À TOUS', lignes: ['Un site gratuit,', 'fait pour être partagé.'] });
    legende(ctx, t, { t0: P.signaler, t1: T(17) - 0.15, y: 318, size: 54, lh: 72, sur: 'AMÉLIORÉ AVEC VOUS', lignes: ['Il progresse grâce', 'aux retours des élèves', 'et des étudiants.'] });
    // le bouton « Partager » de l'en-tête, d'où partent des liens
    { const k = ressort(pr(t, P.pastille, 0.35)), s = 1 - pr(t, P.signaler - 0.3, 0.25);
      if (k > 0 && s > 0) { for (let i = 0; i < 7; i++) { const u = ((t - P.pastille) * 0.75 + i / 7) % 1, ang = -2.75 + i * 0.4, d = 70 + u * 330; ctx.save(); ctx.globalAlpha = s * Math.sin(Math.PI * u) * 0.95; ctx.fillStyle = RUBC[i % 5]; ctx.beginPath(); ctx.arc(CX + Math.cos(ang) * d * 1.25, 600 + Math.sin(ang) * d * 0.45 - 30 * Math.sin(Math.PI * u), 11 - 5 * u, 0, 6.3); ctx.fill(); ctx.restore(); }
        ctx.save(); ctx.translate(CX, 600); ctx.scale(k, k); ctx.globalAlpha = s; pilule(ctx, 0, 0, 286, 88, { fill: C.surface, stroke: C.encre3, lw: 3 }); txt(ctx, 'Partager', 0, 15, { fam: F.ui, w: 500, size: 44 }); ctx.restore(); } }
    // le bouton « Signaler une erreur »
    { const k = ressort(pr(t, P.signaler + 0.1, 0.35));
      if (k > 0) { ctx.save(); ctx.translate(CX, 640); ctx.scale(k, k); ctx.globalAlpha = out; pilule(ctx, 0, 0, 506, 88, { fill: C.surface, stroke: C.encre3, lw: 3 });
        ctx.save(); ctx.translate(-196, 0); ctx.scale(1.9, 1.9); picto(ctx, 0, C.encre); ctx.restore(); txt(ctx, 'Signaler une erreur', 30, 15, { fam: F.ui, w: 500, size: 42 }); ctx.restore(); } }
    // les messages : ils arrivent des deux côtés et deviennent des feuilles de l'arbre
    const ax = (GRAND.xm - cm) * SC, s = GRAND.ech * SC;
    S.retours.forEach((n, i) => {
      const u = pr(t, n.t - 0.95, 0.95); if (u <= 0 || u >= 1) return;
      const f = GRAND.extra[i], bx = ax + (f.u - 10.7) * s, by = SOLPX + (f.v - 21.8) * s, cote = i % 2 ? 1 : -1, x0 = CX + cote * 640, y0 = 760 + (i % 3) * 70;
      const e = doux(u), x = lerp(x0, bx, e), y = lerp(y0, by, e) - 150 * Math.sin(Math.PI * e), k = u > 0.86 ? 1 - (u - 0.86) / 0.14 : 1, c = f.c;
      ctx.save(); ctx.translate(x, y); ctx.rotate(cote * 0.25 * (1 - e)); ctx.scale(k, k);
      ctx.beginPath(); ctx.roundRect(-46, -36, 92, 66, 20); ctx.fillStyle = C.surface; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-cote * 14, 30); ctx.lineTo(-cote * 26, 48); ctx.lineTo(-cote * 30, 30); ctx.fillStyle = C.surface; ctx.fill(); ctx.stroke(); ctx.fillRect(-cote * 14 - (cote > 0 ? 15 : 0) - 0.5, 25, 16, 6);
      ctx.translate(0, -3); ctx.scale(1.45, 1.45); picto(ctx, i, c); ctx.restore();
    });
  }
  function sceneAmbition(ctx, t, cm) {
    const A = S.ambition; if (t < A.t0) return;
    const fin = pr(t, S.fin.t0, 0.25);
    edifice(ctx, t, (XAMB - cm) * SC, 'fleurit', lerp(1, 0.1, fin));
    legende(ctx, t, { t0: T(17, 1), t1: T(21) - 0.2, y: 318, size: 56, lh: 74, sur: 'ET DEMAIN', debuts: [T(17, 1), T(18, 1.5), T(18, 1.75)],
      lignes: ['Couvrir tout l’arbre', [{ s: 'de ' }, { s: 'cours', c: C.cours, w: 700 }, { s: ', d’' }, { s: 'exercices', c: C.exercices, w: 700 }], [{ s: 'et d’' }, { s: 'activités', c: C.activites, w: 700 }, { s: '.' }]] });
  }
  function sceneFin(ctx, t) {
    const E = S.fin; if (t < E.t0) return;
    const k = pr(t, E.t0, 0.45), choc = Math.max(0, 1 - (t - E.t0) / 0.6);
    ctx.save(); ctx.globalAlpha = 0.45 * choc; ctx.strokeStyle = C.rouge; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(CX, 478, 60 + 300 * (1 - choc), 0, 6.3); ctx.stroke(); ctx.restore();
    logo(ctx, CX, 540, 280, [1, 1, 1, 1, 1], ressort(k));
    const a = sortie(pr(t, E.t0 + 0.3, 0.4)); if (a > 0) txt(ctx, 'ATLAS', CX, 850 + (1 - a) * 30, { size: 164, w: 700, ls: 22, a });
    const b = ressort(pr(t, E.adresse, 0.35)); if (b > 0) { ctx.save(); ctx.translate(CX, 962); ctx.scale(b, b); pilule(ctx, 0, 0, 640, 100, { fill: C.surface, stroke: C.edifice, lw: 3.5 }); txt(ctx, 'atlasjourdain.fr', 0, 19, { fam: F.mono, w: 500, size: 56 }); ctx.restore(); }
    const c = sortie(pr(t, E.signature, 0.4)); if (c > 0) txt(ctx, 'Gratuit, à partager, à améliorer ensemble.', CX, 1082 + (1 - c) * 20, { fam: F.ui, w: 500, size: 38, c: C.encre, a: c });
    const d = sortie(pr(t, E.signature + 0.5, 0.4)); if (d > 0) txt(ctx, 'Armand Jourdain, professeur agrégé de mathématiques', CX, 1140 + (1 - d) * 20, { fam: F.ui, w: 400, size: 31, c: C.encre2, a: d });
  }

  function draw(ctx, t) {
    const cm = cam(t), j = jardinierA(t), ch = chienA(t);
    fond(ctx, t);
    ouverture(ctx, t);
    sceneEdifice(ctx, t, cm);
    sceneAmbition(ctx, t, cm);
    for (const r of S.RUB) carte(ctx, t, r);
    // le jardin
    ctx.save(); ctx.translate(0, SOLPX); ctx.scale(SC, SC);
    const pieds = [j.x - 1.5, j.x + 2, ch.x - 7, ch.x + 7];
    dessinerPrairie(ctx, t, cm, [0, 1], pieds);
    for (const a of [...ARBRES, GRAND]) { const x = a.xm - cm; if (x > -60 && x < LU + 60) dessinerArbre(ctx, t, { ...a, x }); }
    if (ch.x > -24) globalThis.CHIEN.dessiner(ctx, ch);
    if (ch.jeu > 0.02) { const u = t - S.entree.papillon[0], part = pr(t, S.entree.papillon[1] - 0.6, 0.6);                     // le symbole papillon
      ctx.save(); ctx.globalAlpha = ch.jeu * (1 - part); ctx.translate(ch.x - 19 - 4 * Math.sin(u * 1.9) - part * 18, -33 - 5 * Math.sin(u * 3.3) - 3 * Math.sin(u * 7.1) - part * 46); ctx.rotate(0.25 * Math.sin(u * 5)); ctx.scale(0.45 + 0.55 * Math.abs(Math.cos(u * 13)), 1);
      G.decor(() => txt(ctx, 'π', 0, 5, { size: 15, w: 700, c: C.exercices })); ctx.restore(); }
    dessinerJardinier(ctx, t, j);
    dessinerPrairie(ctx, t, cm, [2], pieds);
    ctx.restore();
    scenePartage(ctx, t, cm);
    sceneFin(ctx, t);
    // éclair bref sur les trois temps forts (l'oméga, le théorème, la fin) : l'image frappe à l'instant où le son frappe
    for (const [te, c, f] of [[S.logo[2].t, '255,109,125', 0.13], [S.theoreme, '231,233,237', 0.11], [S.fin.t0, '231,233,237', 0.16]]) { const u = t - te; if (u >= 0 && u < 0.3) { ctx.fillStyle = `rgba(${c},${f * (1 - u / 0.3)})`; ctx.fillRect(0, 0, W, H); } }
    // fondu final
    const f = pr(t, S.DURATION - 0.7, 0.6); if (f > 0) { ctx.fillStyle = `rgba(18,20,24,${f})`; ctx.fillRect(0, 0, W, H); }
  }

  Studio.film({
    draw, fadeOut: 0, post: { paper: 0, grain: 0, vignette: 0 },
    init: async () => {
      const charge = async (fam, f, weight, style = 'normal') => { const ff = new FontFace(fam, `url(fonts/${f})`, { weight, style }); document.fonts.add(ff); await ff.load(); };
      for (const w of [400, 500, 600, 700, 800]) await charge('Spectral', `spectral-latin-${w}-normal.woff2`, String(w));
      await charge('GFS Didot', 'gfs-didot-greek-400-normal.woff2', '400'); await charge('Spectral', 'spectral-latin-700-italic.woff2', '700', 'italic'); await charge('Spectral', 'spectral-latin-500-italic.woff2', '500', 'italic');
      for (const w of [400, 500, 600]) await charge('IBM Plex Sans', `ibm-plex-sans-latin-${w}-normal.woff2`, String(w));
      await charge('KaTeX_Main', 'KaTeX_Main-Regular.woff2', '400'); await charge('KaTeX_Math', 'KaTeX_Math-Italic.woff2', '400', 'italic'); await charge('KaTeX_AMS', 'KaTeX_AMS-Regular.woff2', '400');
      for (const w of [500, 700]) await charge('IBM Plex Mono', `ibm-plex-mono-latin-${w}-normal.woff2`, String(w));
    },
  });
})();
