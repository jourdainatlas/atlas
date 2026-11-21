// LE FILM — « Applications », Maths approfondies, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y parcourt une droite horizontale qui coupe plusieurs fois la sinusoïde, puis il est le x qui parcourt A pendant que son image dessine f(A).
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Applications', NIVEAU = 'MATHS APPROFONDIES', LONG = 'MATHS APPROFONDIES · CHAPITRE 2', NB_EXERCICES = 25;

  // coche (vrai) ou croix (faux)
  function marque(ctx, x, y, r, ok, k) {
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2); ctx.translate(x, y); ctx.scale(ressort(k), ressort(k)); ctx.strokeStyle = ok ? VRAI : FAUX; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); if (ok) { ctx.moveTo(-r * 0.8, 0); ctx.lineTo(-r * 0.2, r * 0.6); ctx.lineTo(r * 0.9, -r * 0.7); } else { ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7); ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.7, r * 0.7); }
    ctx.stroke(); ctx.restore();
  }
  // carte de définition (filet rouge, comme sur le site) ou de propriété (filet turquoise)
  function carte(ctx, x, y, w, h, genre, a) {
    if (a <= 0) return; const c = genre === 'DÉFINITION' ? C.rouge : C.cours;
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fillStyle = C.surface; ctx.fill(); ctx.fillStyle = c; ctx.fillRect(x, y, 5, h);
    txt(ctx, genre, x + 32, y + 42, { fam: F.mono, w: 700, size: 20, ls: 3, c, align: 'left' }); ctx.restore();
  }

  // ---------- intertitre : avant chaque partie, une mesure (quatre secondes) où son titre occupe seul l'écran. ----------
  // Trois temps qui ne se recouvrent pas : la scène précédente s'efface (0 à 0,5 s), le titre paraît, tient, puis
  // s'efface (0,6 à 3,5 s), et la scène suivante se découvre (3,6 à 4 s). Le jardin reste visible tout du long.
  function intertitre(ctx, t) {
    for (const it of S.intertitres) { const u = t - it.t; if (u <= 0 || u >= S.INTER) continue;
      const voile = Math.min(doux(pr(u, 0, 0.5)), 1 - doux(pr(u, S.INTER - 0.4, 0.4))), k = Math.min(sortie(pr(u, 0.6, 0.5)), 1 - doux(pr(u, S.INTER - 0.9, 0.4)));
      ctx.save(); ctx.globalAlpha = voile; ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, 884); ctx.restore();
      if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha = k;
      if (it.rang) txt(ctx, it.rang, CX, 372, { fam: F.mono, w: 500, size: 28, ls: 6, c: C.encre3 });
      txt(ctx, it.nom, CX, 478 + (1 - sortie(pr(u, 0.6, 0.6))) * 22, { size: 84, w: 800 });
      ctx.restore(); }
  }

  // ---------- en-tête ----------
  function entete(ctx, t) {
    const a = fen(t, L(2) + 0.2, L(S.FIN) - 0.1, 0.5); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.logo(ctx, 78, 74, 60);
    txt(ctx, `${TITRE.toUpperCase()} · ${NIVEAU}`, 126, 62, { fam: F.mono, w: 500, size: 20, ls: 3, c: C.encre3, align: 'left' });
    for (const [nom, t0, t1] of [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(S.BILAN), L(S.FIN)]]) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(2) - 0.6, 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 300, 210, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, LONG, CX, 478, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Injections, surjections, {bijections}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- outils de figure ----------
  const VIOLET = '#b58cff';
  function seg(ctx, p, q, o = {}) { const k = o.k ?? 1; if (k <= 0 || (o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.gm; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round'; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], k), lerp(p[1], q[1], k)); ctx.stroke(); ctx.restore(); }
  function pt(ctx, p, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre; ctx.beginPath(); ctx.arc(p[0], p[1], o.r || 7, 0, 6.3); ctx.fill(); if (o.creux) { ctx.fillStyle = C.papier; ctx.beginPath(); ctx.arc(p[0], p[1], (o.r || 7) - 3, 0, 6.3); ctx.fill(); } ctx.restore(); }
  const fl = (ctx, p, q, o = {}) => fleche(ctx, p[0], p[1], q[0], q[1], o);
  const trot = (t, x, ech) => ({ t, allure: 'trot', phase: x / ech * 0.33 }), assisP = (t, k, tete = -0.2) => ({ t, assis: k, tete, queue: { a: -0.35, amp: 0.4, f: 8, courbe: -0.12 } });
  const etiq = (ctx, s, x, y, a, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 500, size: 28, c: C.encre2, a, ...o });
  const XY = (R, x, y) => [R.X(x), R.Y(y)];
  // les trois mouvements motivés du chien entre le jardin et une figure (MEMO_atlas_videos.md, §9, règle 5)
  function bond(ctx, t, tJ, xg, tA) { if (t < tJ + 0.2 || t >= tA) return false; const u = t - tJ - 0.2, y = SOLPX - 430 * u + 1250 * u * u;
    if (y < H + 130) K.chienSur(ctx, xg, y, 0, SC, u < 0.17 ? { t, face: -1, allure: 'vol', vol: u / 0.17, tang: 0.3 } : { ...K.poseChute(t), face: -1 }); return true; }
  function chute(ctx, t, tA, tL, x, y, ech) { if (t < tA || t >= tL) return false; K.chienSur(ctx, x, -60 + (y + 60) * Math.pow((t - tA) / (tL - tA), 1.6), 0, ech, K.poseChute(t)); return true; }
  function sautJardin(ctx, t, tX, x0, y0, ech0, xS) { const tS = tX + 1.2, tR = tX + 1.55; if (t < tX || t >= tR) return false;
    const D = tS - tX - 0.2, u = pr(t, tX + 0.2, D), v0 = -450, g = 2 * (SOLPX - y0 - v0 * D) / (D * D), tv = u * D;
    K.chienSur(ctx, lerp(x0, xS, u), Math.min(SOLPX, y0 + v0 * tv + g * tv * tv / 2), 0, lerp(ech0, SC, u), u <= 0 ? { t, bas: 2.2 * pr(t, tX, 0.2) } : u < 0.22 ? { t, allure: 'vol', vol: u / 0.22, tang: 0.35 } : u < 1 ? K.poseChute(t) : K.poseChoc(t, t - tS)); return true; }
  // bilan en trois cartes : B.cartes (instants), ID (formules), FS (corps), LC (largeurs), TX (deux lignes par carte)
  function bilanCartes(ctx, t, titre, ID, FS, LC, TX, phrase) {
    const B = S.bilan, a = fen(t, L(S.BILAN) + 0.1, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    txt(ctx, titre, CX, 215, { size: 56, w: 700, a: ap(t, B.titre) });
    const tot = LC.reduce((s, w) => s + w, 0) + 40 * (LC.length - 1); let x = CX - tot / 2;
    B.cartes.forEach((tc, i) => { const k = ap(t, tc), cx = x + LC[i] / 2; x += LC[i] + 40; if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, LC[i], 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      formule(ctx, ID[i], cx, 395, { fs: FS[i], mil: 1 });
      txt(ctx, TX[i][0], cx, 560, { size: 26, w: 600 }); txt(ctx, TX[i][1], cx, 600, { size: 25, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, phrase, CX, 745 + (1 - kp) * 20, { size: 50, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- raccourcis d'écriture des scènes ----------
  const phase = (ctx, t, m0, m1, f) => { const k = fen(t, L(m0) + 0.1, L(m1), 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; f(k); ctx.restore(); } };
  const legs = (ctx, t, V, T) => T.forEach((l, i) => legende(ctx, t, V.leg[i], l, l.length > 1 ? { size: 40 } : {}));
  const fo = (ctx, t, id, x, y, fs, t0, o = {}) => formule(ctx, id, x, y, { fs, mil: 1, a: ap(t, t0), monte: 1, ...o });
  const tx = (ctx, t, s, x, y, t0, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 600, size: 30, a: ap(t, t0), ...o });
  // Un acte du chien : il bondit sous l'écran (V.bond), retombe du haut (V.chute) sur la figure au point pos(V.chute[1]).p,
  // y joue (pos(t) : { p, an, marche, assis, tete, face, pose }), puis redescend au jardin 1,4 s avant la fin de la partie k.
  function acte(k, V, ech, pos, tSortie) { const tX = tSortie ?? S.CH[k].t1 - 1.4, p0 = pos(V.chute[1]).p, pf = pos(tX).p, xS = pf[0] + 60;
    return { en: [V.bond + 0.2, tX + 1.55], trajet: [tX + 1.55, tX + 2.45, xS / SC, DS[k]],
      joue(ctx, t) { if (bond(ctx, t, V.bond, DS[k] * SC, V.chute[0]) || chute(ctx, t, V.chute[0], V.chute[1], p0[0], p0[1], ech) || t < V.chute[1]) return;
        if (t >= tX) return void sautJardin(ctx, t, tX, pf[0], pf[1], ech, xS);
        const c = pos(t), u = t - V.chute[1];
        K.chienSur(ctx, c.p[0], c.p[1] - 2, c.an || 0, ech, { ...(u < 0.35 ? K.poseChoc(t, u) : c.pose ? c.pose : c.marche ? trot(t, c.p[0] * 1.25, ech) : c.assis !== undefined ? assisP(t, c.assis, c.tete ?? -0.15) : { t, tete: c.tete || 0 }), face: c.face || 1 }); } }; }
  // droite graduée : y en pixels, X(valeur) ; ticks : valeurs chiffrées
  function axeGradue(ctx, X, y, a, b, ticks, k = 1, o = {}) { if (k <= 0) return; seg(ctx, [X(a), y], [X(b), y], { c: C.gm, lw: 3, k }); const kk = borne(k * 2 - 1);
    for (const v of ticks) { seg(ctx, [X(v), y - 9], [X(v), y + 9], { c: C.gm, lw: 3, a: kk }); if (!o.muet) txt(ctx, K.fr(v, 0), X(v), y + 44, { fam: F.main, w: 400, size: o.size || 28, c: C.encre3, a: kk }); } }

  // ---------- diagrammes sagittaux ----------
  function ovale(ctx, cx, cy, rx, ry, a, id) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.fillStyle = C.surface; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3); ctx.fill(); ctx.stroke(); ctx.restore(); if (id) formule(ctx, id, cx, cy - ry - 30, { fs: 34, mil: 1, a }); }
  const pts = (cx, cy, n, pas = 62) => Array.from({ length: n }, (_, i) => [cx, cy + (i - (n - 1) / 2) * pas]);
  // D : { cx, cy, d (demi-écart), nE, nF, fl : [[i, j, couleur]], an : [[côté, i]] points entourés en orange } ; A : opacités [ovales, flèches…]
  function sagittal(ctx, D, ko, kf, o = {}) { const E = pts(D.cx - D.d, D.cy, D.nE, D.pas), Fp = pts(D.cx + D.d, D.cy, D.nF, D.pas), ry = o.ry || 150;
    ovale(ctx, D.cx - D.d, D.cy, 70, ry, ko, o.sans ? null : 'l_E'); ovale(ctx, D.cx + D.d, D.cy, 70, ry, ko, o.sans ? null : 'l_F');
    D.fl.forEach(([i, j, c], n) => { const k = typeof kf === 'function' ? kf(n) : kf; fl(ctx, [E[i][0] + 14, E[i][1]], [Fp[j][0] - 16, Fp[j][1]], { c: c || C.bleu, lw: 3, a: k }); if (o.retour) fl(ctx, [Fp[j][0] - 14, Fp[j][1]], [E[i][0] + 16, E[i][1]], { c: c || C.bleu, lw: 3, a: k }); });
    for (const p of E) pt(ctx, p, { c: C.encre, r: 8, a: ko }); for (const p of Fp) pt(ctx, p, { c: C.encre, r: 8, a: ko });
    for (const [cote, i] of D.an || []) { const p = (cote ? Fp : E)[i]; ctx.save(); ctx.globalAlpha *= (o.kan ?? ko); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 20, 0, 6.3); ctx.stroke(); ctx.restore(); } }

  // ---------- 1. une flèche et une seule ----------
  const D1 = { cx: 520, cy: 560, d: 170, pas: 54, nE: 3, nF: 4, fl: [[0, 0], [1, 0], [2, 2]] }, D2 = { cx: 1400, cy: 560, d: 170, pas: 54, nE: 3, nF: 4, fl: [[0, 0, C.orange], [0, 1, C.orange], [2, 3]], an: [[0, 1]] };
  function appli(ctx, t) { const V = S.appli;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 170, 'DÉFINITION', kd); txt(ctx, 'Une application de E dans F est un triplet (E, F, G), où G est une partie de E × F telle que :', CX, 250, { fam: F.ui, w: 600, size: 26, a: kd }); formule(ctx, 'a_def', CX, 300, { fs: 36, mil: 1, a: kd });
      sagittal(ctx, D1, ap(t, V.oui), (n) => ap(t, V.fl[n]), { ry: 125 }); tx(ctx, t, 'une application', D1.cx, 740, V.oui, { c: C.cours, size: 28 });
      sagittal(ctx, D2, ap(t, V.non), (n) => ap(t, n < 2 ? V.d2 : V.non), { kan: ap(t, V.d0), ry: 125 }); tx(ctx, t, 'pas une application', D2.cx, 740, V.non, { c: C.orange, size: 28 });
      tx(ctx, t, 'deux images', D2.cx, 462, V.d2, { c: C.orange, size: 24, w: 500 }); tx(ctx, t, 'aucune image', D2.cx - 330, 568, V.d0, { c: C.orange, size: 24, w: 500 }); });
    legs(ctx, t, V, [['Une [application] se donne par trois choses :', 'un ensemble de départ, un ensemble d’arrivée, un graphe.'], ['De chaque élément de départ part une flèche, et une seule : son [image].'], ['Deux images pour un même élément, ou aucune : ce n’est plus une application.']]); }

  // ---------- 2. égalité, identité, composition ----------
  function composer(ctx, t) { const V = S.composer;
    phase(ctx, t, 6, 10, () => { tx(ctx, t, 'Deux applications sont égales quand elles ont', CX, 205, V.eg, { size: 32 }); tx(ctx, t, 'même départ, même arrivée, et la même image pour chaque x.', CX, 252, V.eg, { size: 32 });
      fo(ctx, t, 'c_1', 560, 400, 42, V.a1); fo(ctx, t, 'c_2', 1360, 400, 42, V.a2); fo(ctx, t, 'c_ne', 960, 400, 60, V.diff); tx(ctx, t, 'même formule, mais deux applications distinctes', CX, 500, V.diff, { c: C.orange, size: 28 });
      const ki = ap(t, V.id); carte(ctx, 510, 570, 900, 150, 'DÉFINITION', ki); txt(ctx, 'l’identité de E', 750, 668, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: ki }); formule(ctx, 'c_id', 1120, 656, { fs: 38, mil: 1, a: ki }); });
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.dia), X = [330, 760, 1190], y = 330; [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => ovale(ctx, X[i], y, 110, 100, kd, id));
      pt(ctx, [X[0], y], { r: 9, a: kd }); formule(ctx, 'l_x', X[0], y + 40, { fs: 32, mil: 1, a: kd }); const kf = ap(t, V.f), kg = ap(t, V.g), kc = ap(t, V.gf);
      fl(ctx, [X[0] + 20, y], [X[1] - 22, y], { c: C.bleu, lw: 4, a: kf }); formule(ctx, 'l_f', (X[0] + X[1]) / 2, y - 30, { fs: 34, mil: 1, a: kf }); pt(ctx, [X[1], y], { r: 9, a: kf }); formule(ctx, 'l_fx', X[1], y + 40, { fs: 32, mil: 1, a: kf });
      fl(ctx, [X[1] + 20, y], [X[2] - 22, y], { c: C.orange, lw: 4, a: kg }); formule(ctx, 'l_g', (X[1] + X[2]) / 2, y - 30, { fs: 34, mil: 1, a: kg }); pt(ctx, [X[2], y], { r: 9, a: kg }); formule(ctx, 'l_gfx', X[2], y + 44, { fs: 30, mil: 1, a: kg });
      if (kc > 0) { ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = VIOLET; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X[0], y + 104); ctx.quadraticCurveTo(X[1], y + 210, X[2] - 14, y + 108); ctx.stroke(); ctx.restore(); fl(ctx, [X[2] - 34, y + 122], [X[2] - 6, y + 104], { c: VIOLET, lw: 4, a: kc }); formule(ctx, 'l_gf', X[1], y + 188, { fs: 34, mil: 1, a: kc }); }
      fo(ctx, t, 'c_gf', 1560, 250, 30, V.gf); tx(ctx, t, 'f agit en premier :', 1560, 340, V.gf, { c: C.encre2, w: 500, size: 26 }); tx(ctx, t, 'on lit de droite à gauche', 1560, 380, V.gf, { c: C.encre2, w: 500, size: 26 });
      fo(ctx, t, 'c_e1', 620, 640, 36, V.ex[0]); fo(ctx, t, 'c_e2', 620, 720, 36, V.ex[1]); fo(ctx, t, 'c_as', 1500, 680, 36, V.asso); });
    legs(ctx, t, V, [['L’égalité de deux applications porte sur trois données, pas sur la seule formule.'], ['Le carré, de l’ensemble des réels dans lui-même ou dans les réels positifs : deux applications.'], ['L’[identité] ne déplace aucun élément.'], ['La [composée] : on applique $f$, puis $g$ au résultat.'], ['L’ordre compte : la composition n’est pas commutative.'], ['Mais elle est associative : les parenthèses sont inutiles.']]); }

  // ---------- 3. injective, surjective, bijective ----------
  const DI = [{ cx: 380, cy: 400, d: 120, nE: 3, nF: 4, fl: [[0, 0], [1, 1], [2, 3]], an: [[1, 2]] }, { cx: 960, cy: 400, d: 120, nE: 4, nF: 3, fl: [[0, 0], [1, 1, C.orange], [2, 1, C.orange], [3, 2]], an: [[1, 1]] }, { cx: 1540, cy: 400, d: 120, nE: 3, nF: 3, fl: [[0, 1], [1, 0], [2, 2]] }];
  function inj(ctx, t) { const V = S.inj;
    phase(ctx, t, 14, 19, () => { [['injective', 'tout élément d’arrivée a', 'au plus un antécédent', 'un élément sans antécédent'], ['surjective', 'tout élément d’arrivée a', 'au moins un antécédent', 'un élément a deux antécédents'], ['bijective', 'tout élément d’arrivée a', 'exactement un antécédent', '']].forEach(([n, l1, l2, d], i) => { const k = ap(t, V.d[i]), D = DI[i];
        sagittal(ctx, D, k, k, { ry: 135 }); txt(ctx, n, D.cx, 610, { fam: F.ui, w: 700, size: 36, c: C.rouge, a: k }); txt(ctx, l1, D.cx, 660, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); txt(ctx, l2, D.cx, 700, { fam: F.ui, w: 600, size: 28, a: k }); if (d) txt(ctx, d, D.cx, 192, { fam: F.ui, w: 500, size: 24, c: C.orange, a: k }); }); });
    phase(ctx, t, 19, 22, () => { [['Pour démontrer que f est injective', 'i_r1', 'i_r2', 500], ['Pour démontrer que f est surjective', 'i_s1', 'i_s2', 1420]].forEach(([s, a, b, x], i) => { const k = ap(t, V.m[i]); carte(ctx, x - 410, 200, 820, 420, 'MÉTHODE', k); txt(ctx, s, x, 300, { fam: F.ui, w: 600, size: 30, a: k }); formule(ctx, a, x, 400, { fs: 32, mil: 1, a: k }); formule(ctx, b, x, 500, { fs: 32, mil: 1, a: k }); }); });
    legs(ctx, t, V, [['[Injective] : deux éléments distincts n’ont jamais la même image.'], ['[Surjective] : tout élément de l’ensemble d’arrivée est atteint.'], ['[Bijective] : injective et surjective à la fois, un appariement parfait.'], ['Pour l’injectivité, on part d’une égalité entre deux images.'], ['Pour la surjectivité, on se donne un élément d’arrivée et l’on exhibe un antécédent.']]); }

  // ---------- 4. trois versions du sinus ----------
  const RS = K.repere({ x: 120, y: 330, w: 1680, h: 400 }, { x0: -4.6, x1: 9.9, y0: -1.7, y1: 2.5 }), CROIS = [-7 * Math.PI / 6, Math.PI / 6, 5 * Math.PI / 6, 13 * Math.PI / 6, 17 * Math.PI / 6];
  const posSin = (t) => { const V = S.sinus, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-4.3, 9.5, k); return { p: XY(RS, x, 0.5), x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figSin(ctx, kf, o = {}) { K.axes(ctx, RS, kf, { gx: [], gy: [-1, 1] }); K.courbe(ctx, RS, Math.sin, -4.5, lerp(-4.5, 9.8, kf), o.c ? { c: o.c } : {}); }
  function sinus(ctx, t) { const V = S.sinus;
    phase(ctx, t, 22, 30, () => { const kf = ap(t, V.fig, 0.9), kc = ap(t, V.c), kb = ap(t, V.b), k2 = ap(t, V.deux) * (1 - kb);
      if (kb > 0) { ctx.save(); ctx.globalAlpha *= kb * 0.16; ctx.fillStyle = C.cours; ctx.fillRect(RS.X(-4.6), RS.Y(1), RS.X(9.9) - RS.X(-4.6), RS.Y(-1) - RS.Y(1)); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= 1 - 0.7 * kc; figSin(ctx, kf); ctx.restore(); if (kc > 0) { K.courbe(ctx, RS, Math.sin, -Math.PI / 2, Math.PI / 2, { c: C.cours, lw: 8, a: kc }); seg(ctx, XY(RS, -Math.PI / 2, 0), XY(RS, Math.PI / 2, 0), { c: C.cours, lw: 7, a: kc }); }
      formule(ctx, 's_f', RS.X(8.6), RS.Y(1.45), { fs: 32, mil: 1, a: kf });
      const km = fen(t, V.marche[0] - 0.4, V.deux + 0.2, 0.4), x = t > V.marche[0] ? posSin(t).x : -9; seg(ctx, XY(RS, -4.6, 0.5), XY(RS, 9.9, 0.5), { c: C.cours, lw: 3, dash: [8, 8], a: km }); formule(ctx, 's_12', RS.X(-4.2), RS.Y(0.5) - 30, { fs: 28, mil: 1, a: km }); for (const u of CROIS) if (x > u) pt(ctx, XY(RS, u, 0.5), { c: C.cours, r: 11, a: km });
      seg(ctx, XY(RS, -4.6, 2), XY(RS, 9.9, 2), { c: C.orange, lw: 3, dash: [8, 8], a: k2 }); formule(ctx, 's_2', RS.X(-4.2), RS.Y(2) - 28, { fs: 28, mil: 1, a: k2 });
      const A = [fen(t, V.fig, V.b, 0.4), fen(t, V.b, V.c, 0.4), kc]; ['s_a', 's_b', 's_c'].forEach((id, i) => formule(ctx, id, 520, 235, { fs: 42, mil: 1, a: A[i] }));
      const n = CROIS.filter((u) => x > u).length; txt(ctx, n ? `${n} antécédent${n > 1 ? 's' : ''} de 1/2` : '', 1300, 247, { fam: F.ui, w: 600, size: 32, c: C.cours, a: fen(t, V.marche[0], V.ninj, 0.3) });
      txt(ctx, 'ni injective, ni surjective', 1300, 247, { fam: F.ui, w: 600, size: 34, c: C.orange, a: fen(t, V.ninj, V.b, 0.3) }); txt(ctx, 'surjective, non injective', 1300, 247, { fam: F.ui, w: 600, size: 34, c: C.cours, a: A[1] }); txt(ctx, 'bijective', 1300, 247, { fam: F.ui, w: 600, size: 38, c: C.cours, a: kc }); });
    legs(ctx, t, V, [['Le sinus, de l’ensemble des réels dans lui-même.'], ['La droite horizontale de hauteur un demi coupe la courbe plusieurs fois :', 'pas d’injectivité.'], ['La droite de hauteur 2 ne la coupe jamais : pas de surjectivité non plus.'], ['En réduisant l’ensemble d’arrivée aux valeurs atteintes, on obtient une surjection.'], ['En réduisant aussi l’ensemble de départ,', 'chaque valeur n’est atteinte qu’une fois : une bijection.']]); }

  // ---------- 5. la bijection réciproque ----------
  function reciproque(ctx, t) { const V = S.reciproque;
    phase(ctx, t, 30, 34, () => { const kd = ap(t, V.def); carte(ctx, 760, 165, 1000, 170, 'DÉFINITION', kd); txt(ctx, 'À chaque y de F, on associe son unique antécédent.', 1260, 250, { fam: F.ui, w: 600, size: 28, a: kd }); formule(ctx, 'r_def', 1260, 300, { fs: 38, mil: 1, a: kd });
      sagittal(ctx, { cx: 400, cy: 440, d: 130, nE: 3, nF: 3, fl: [[0, 1], [1, 0], [2, 2]] }, kd, kd, { retour: 1, ry: 140 }); tx(ctx, t, 'chaque flèche se parcourt dans les deux sens', 400, 660, V.def, { c: C.encre2, w: 500, size: 24 });
      fo(ctx, t, 'r_eq', 1260, 430, 42, V.eq); fo(ctx, t, 'r_p', 1260, 550, 38, V.prop); fo(ctx, t, 'r_arc', 1260, 680, 40, V.arc); });
    legs(ctx, t, V, [['Une bijection se renverse : c’est sa [bijection réciproque].'], ['Composer une bijection et sa réciproque redonne l’identité.'], ['La réciproque de la troisième version du sinus est la fonction arcsinus.']]); }

  // ---------- 6. image directe, image réciproque ----------
  const RI = K.repere({ x: 160, y: 200, w: 760, h: 540 }, { x0: -2.6, x1: 2.6, y0: -0.7, y1: 4.7 }), car = (x) => x * x;
  const posIm = (t) => { const V = S.images, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-1, 2, k); return { p: XY(RI, x, 0), x, k, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function images(ctx, t) { const V = S.images;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.dir); carte(ctx, 260, 165, 1400, 150, 'DÉFINITION', kd); txt(ctx, 'image directe', 520, 262, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, 'm_d', 1130, 250, { fs: 36, mil: 1, a: kd });
      const kr = ap(t, V.rec); carte(ctx, 260, 370, 1400, 150, 'DÉFINITION', kr); txt(ctx, 'image réciproque', 540, 467, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kr }); formule(ctx, 'm_r', 1150, 455, { fs: 36, mil: 1, a: kr });
      tx(ctx, t, 'L’image réciproque d’une partie a un sens même si f n’est pas bijective.', CX, 640, V.rem, { c: C.cours, size: 30 }); });
    phase(ctx, t, 38, 46, () => { const kf = ap(t, V.fig, 0.9), kA = ap(t, V.A), kB = ap(t, V.B), kfB = ap(t, V.fB), on = t > V.marche[0], { x, k } = posIm(t);
      K.axes(ctx, RI, kf, { gx: [-2, -1, 1, 2], gy: [1, 4] }); K.courbe(ctx, RI, car, -2.15, lerp(-2.15, 2.15, kf), { c: C.gd }); formule(ctx, 'm_f', RI.X(1.7), RI.Y(4.4), { fs: 30, mil: 1, a: kf });
      seg(ctx, XY(RI, -1, 0), XY(RI, 2, 0), { c: C.bleu, lw: 9, a: kA }); if (on) { const lo = x < 0 ? x * x : 0, hi = Math.max(1, x * x); seg(ctx, XY(RI, 0, lo), XY(RI, 0, hi), { c: C.cours, lw: 9 }); if (k < 1) { K.trait(ctx, RI, x, 0, x, x * x, { c: C.gm, dash: [5, 7] }); K.trait(ctx, RI, x, x * x, 0, x * x, { c: C.gm, dash: [5, 7] }); K.point(ctx, RI, x, x * x, { r: 8, c: C.encre }); K.point(ctx, RI, 0, x * x, { r: 9, c: C.cours }); } }
      seg(ctx, XY(RI, 0.06, 1), XY(RI, 0.06, 4), { c: C.orange, lw: 9, a: kB }); for (const [u, w] of [[-2, -1], [1, 2]]) { seg(ctx, XY(RI, u, -0.12), XY(RI, w, -0.12), { c: VIOLET, lw: 9, a: kfB }); for (const z of [u, w]) K.trait(ctx, RI, z, 0, z, z * z, { c: VIOLET, dash: [5, 7], a: kfB }); } for (const y of [1, 4]) K.trait(ctx, RI, -Math.sqrt(y), y, Math.sqrt(y), y, { c: C.orange, dash: [5, 7], a: kfB });
      fo(ctx, t, 'm_A', 1420, 240, 44, V.A); const km = fen(t, V.marche[0], V.fA, 0.3); txt(ctx, `x = ${K.fr(x, 2)}        x² = ${K.fr(x * x, 2)}`, 1420, 350, { fam: F.ui, w: 600, size: 36, a: km }); fo(ctx, t, 'm_fA', 1420, 350, 48, V.fA); tx(ctx, t, 'et non [1 ; 4] : les carrés des nombres', 1420, 416, V.fA, { c: C.encre2, w: 500, size: 25 }); tx(ctx, t, 'proches de 0 sont proches de 0', 1420, 450, V.fA, { c: C.encre2, w: 500, size: 25 });
      fo(ctx, t, 'm_B', 1420, 540, 44, V.B); fo(ctx, t, 'm_fB', 1420, 625, 42, V.fB); fo(ctx, t, 'm_v', 1420, 715, 40, V.vide); });
    legs(ctx, t, V, [['L’[image directe] d’une partie $A$ : l’ensemble des images de ses éléments.'], ['L’[image réciproque] d’une partie $B$ : les éléments dont l’image tombe dans $B$.'], ['Elle se note comme la réciproque, mais existe pour toute application.'], ['La fonction carré, et la partie $A$ : les réels compris entre −1 et 2.'], ['Le chien parcourt $A$ : son image descend jusqu’à 0, puis remonte jusqu’à 4.'], ['L’image directe de $A$ commence donc à 0, et non à 1.'], ['L’image réciproque de $B$ se lit à contre-courant :', 'deux intervalles ont leurs carrés entre 1 et 4.'], ['Aucun carré n’est négatif : cette image réciproque est vide.']]); }

  const ACTES_DEF = () => [acte(3, S.sinus, 2.3, posSin, S.sinus.sortie), acte(5, S.images, 2.4, posIm, S.images.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1000, y: 330, w: 840, h: 380 }, { x0: -1.2, x1: 8.2, y0: -1.5, y1: 1.7 }); seg(ctx, XY(Rv, -1.2, 0), XY(Rv, 8.2, 0), { c: C.gm, lw: 4 }); K.courbe(ctx, Rv, Math.sin, -1.1, 8.1, { lw: 9 }); seg(ctx, XY(Rv, -1.2, 0.5), XY(Rv, 8.2, 0.5), { c: C.cours, lw: 4, dash: [10, 10] }); for (const u of CROIS.slice(1, 4)) pt(ctx, XY(Rv, u, 0.5), { c: C.cours, r: 14 }); const p = XY(Rv, 4.6, 0.5); K.chienSur(ctx, p[0], p[1] - 4, 0, 3.8, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_2', 480, 640, { fs: 50, mil: 1 }); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois définitions", ["b_1", "b_2", "b_3"], [30, 34, 30], [600, 520, 600], [["Une application :", "une image, et une seule."], ["Injective :", "au plus un antécédent."], ["Surjective :", "au moins un antécédent."]], "Injective et surjective : {bijective}, donc réversible."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 100, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (300 + 250 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
  const melange = (dom, g) => { const r = alea(g); return K.FEUILLES.map(() => (r() < 0.6 ? dom : RUBC[Math.floor(r() * 5)])); };
  const ARBRES = S.CH.map((c, k) => ({ x: XS[k], ne: c.plante, ech: 2.05, miroir: k % 2 ? -1 : 1, coul: melange(C.cours, 57 + k) }));
  function jardinierA(t) {
    const fd = (a, b) => Math.min(doux(pr(t, a, 0.15)), 1 - doux(pr(t, b - 0.15, 0.15)));
    let x = lerp(-40, STAND[0], doux(pr(t, J.entree[0], J.entree[1] - J.entree[0]))), marche = fd(...J.entree), arrose = 0, verse = false;
    J.marche.forEach(([a, b], k) => { x += (STAND[k + 1] - STAND[k]) * doux(pr(t, a, b - a)); marche = Math.max(marche, fd(a, b)); });
    for (const [a, b] of J.arrose) { arrose = Math.max(arrose, Math.min(doux(pr(t, a, 0.3)), 1 - doux(pr(t, b - 0.3, 0.3)))); if (t > a + 0.25 && t < b - 0.25) verse = true; }
    const libre = (1 - marche) * (1 - arrose) * doux(pr(t, J.entree[1], 0.5)) * (1 - doux(pr(t, S.fin.t0 - 0.5, 0.5)));      // il regarde la leçon
    return { x, t, marche, phase: x * globalThis.JARDINIER.PAS_MARCHE, elan: 0, arrose, verse, tete: 0.1 * arrose - 0.3 * libre, geste: { nom: 'regard', k: libre }, chapeau: Math.sin(Math.PI * pr(t, S.fin.chapeau, 1.4)) };
  }
  // le chien : il arrive par la droite pendant l'ouverture, puis suit le jardinier d'arbre en arbre
  const DEHORS = LU + 34;
  // Le chien joue les scènes décrites par ACTES_DEF (scenes.js) : il bondit sous l'écran, retombe du haut sur la figure,
  // y tient son rôle, puis redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const ACTES = ACTES_DEF(), EN_SCENE = ACTES.map((a) => a.en), T1 = S.CH.map((c) => c.t1);
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]), ...ACTES.map((a) => a.trajet)].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) { for (const a of ACTES) a.joue(ctx, t); }
  function chienA(t) {
    let x = DEHORS, bouge = 0, face = -1;
    for (const [a, b, xa, xb] of TRAJETS) { if (t >= a) x = lerp(xa, xb, doux(pr(t, a, b - a))); bouge = Math.max(bouge, Math.min(pr(t, a - 0.35, 0.3), 1 - pr(t, b, 0.3))); if (xb > xa) face += 2 * (doux(pr(t, a - 0.3, 0.3)) - doux(pr(t, b, 0.3))); }
    face = borne(face, -1, 1);                                                // deux trajets vers la droite qui se suivent ne doivent pas s'additionner
    const assis = 1 - doux(bouge), trotte = TRAJETS.some(([a, b]) => t > a && t < b);
    const P = { x, face, t, assis, tang: 0, tete: 0, cou: 0, bas: 0, saut: 0, vol: 0, phase: 0, allure: 'pose', queue: { a: lerp(-1.15, -0.35, assis), amp: lerp(0.06, 0.4, assis), f: 8, courbe: lerp(0.1, -0.12, assis) } };
    if (trotte) { P.allure = 'trot'; P.phase = x * 0.33; P.queue = { a: -0.35, amp: 0.25, f: 8, courbe: 0.06 }; }
    if (t > S.fin.t0) P.queue.amp = 0.7;
    return P;
  }
  function jardin(ctx, t) {
    const j = jardinierA(t), ch = chienA(t);
    ctx.save(); ctx.translate(0, SOLPX); ctx.scale(SC, SC);
    const pieds = [j.x - 1.5, j.x + 2, ch.x - 7, ch.x + 7];
    K.dessinerPrairie(ctx, t, 0, [0, 1], pieds);
    for (const a of ARBRES) K.dessinerArbre(ctx, t, a);
    if (!VIGNETTE && ch.x < LU + 28 && ch.x > -32 && !EN_SCENE.some(([a, b]) => t >= a && t < b)) globalThis.CHIEN.dessiner(ctx, ch);
    const { bec } = globalThis.JARDINIER.dessiner(ctx, j);
    if (j.verse) { ctx.save(); ctx.fillStyle = C.edifice;                                       // l'arrosoir verse des symboles
      G.decor(() => { ctx.font = `700 8.5px ${F.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i < 5; i++) { const ph = (t * 1.15 + i / 5) % 1, ec = (i % 3 - 1) * 3.2; ctx.globalAlpha = 0.95 - ph * 0.4; ctx.fillText('+×π=∑'[(i + Math.floor(t * 1.15 + i / 5)) % 5], bec[0] + 1.5 + ec + ph * (1.5 + ec * 0.4), bec[1] + 2 + ph * ph * (-bec[1] - 5)); } });
      ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.ellipse(bec[0] + 2, 0.5, 9, 1.8, 0, 0, 6.3); ctx.fill(); ctx.restore(); }
    K.dessinerPrairie(ctx, t, 0, [2], pieds);
    ctx.restore();
  }

  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, la figure de vignetteFig (scenes.js), le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, "Applications", 76, 400, { size: 130, w: 800, align: 'left' });
    vignetteFig(ctx);
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    appli(ctx, ts); composer(ctx, ts); inj(ctx, ts); sinus(ctx, ts); reciproque(ctx, ts); images(ctx, ts); bilan(ctx, ts); fin(ctx, t);
    intertitre(ctx, t);
    jardin(ctx, t);
    acteur(ctx, t);
    // éclair bref sur les deux temps forts (l'oméga du logo, la fin) : l'image frappe à l'instant où le son frappe
    for (const [te, c, f] of [[S.ouverture.logo[2], '255,109,125', 0.13], [S.fin.t0, '231,233,237', 0.14]]) { const u = t - te; if (u >= 0 && u < 0.3) { ctx.fillStyle = `rgba(${c},${f * (1 - u / 0.3)})`; ctx.fillRect(0, 0, W, H); } }
    const f = pr(t, S.DURATION - 0.9, 0.8); if (f > 0) { ctx.fillStyle = `rgba(18,20,24,${f})`; ctx.fillRect(0, 0, W, H); }
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
      await K.chargerFormules();
    },
  });
})();
