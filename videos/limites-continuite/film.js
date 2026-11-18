// LE FILM — « Limites et continuité », MPSI, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y est le milieu du segment dans la dichotomie des valeurs intermédiaires, puis il va s'asseoir au point
// où la fonction atteint son maximum.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Limites et continuité', NIVEAU = 'MPSI', LONG = 'MPSI · CHAPITRE 8', NB_EXERCICES = 57;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 116, w: 800, a: k1 });
    ligne(ctx, 'Des inégalités, puis {trois grands théorèmes}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const bandeH = (ctx, R, y0, y1, c, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.fillRect(R.b.x, R.Y(y1), R.b.w, R.Y(y0) - R.Y(y1)); ctx.restore(); };
  const bandeV = (ctx, R, x0, x1, c, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c; ctx.fillRect(R.X(x0), R.b.y, R.X(x1) - R.X(x0), R.b.h); ctx.restore(); };
  const ORANGE_P = 'rgba(255,162,74,0.20)', TURQ_P = 'rgba(53,202,164,0.20)';
  // courbe d'une fonction qui oscille près de 0 (sin(1/x), x sin(1/x)) : on échantillonne régulièrement en u = 1/x
  function oscille(ctx, R, f, x1, signe = 1, o = {}) { K.dans(ctx, R, () => { ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.bleu; ctx.lineWidth = o.lw || 3.5; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let u = 1 / x1, i = 0; u <= 150; u += 0.04, i++) { const x = signe / u; if (i) ctx.lineTo(R.X(x), R.Y(f(x))); else ctx.moveTo(R.X(x), R.Y(f(x))); } ctx.stroke(); }); }

  // ---------- 1. ce que l'œil ne démontre pas ----------
  const R1 = K.repere({ x: 510, y: 170, w: 900, h: 270 }, { x0: 0, x1: 6, y0: -1.5, y1: 1.5 }), f0 = (x) => 0.9 * Math.sin(0.75 * (x - 3)) + 0.12 * (x - 3);
  function histoire(ctx, t) {
    const V = S.histoire, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kc = doux(pr(t, V.courbe, 2.2)), kp = ap(t, V.point);
    seg(ctx, XY(R1, 0, 0), XY(R1, 6, 0), { c: C.gm, lw: 3, k: ap(t, V.courbe, 0.6) }); K.courbe(ctx, R1, f0, 0.3, lerp(0.3, 5.7, kc));
    K.point(ctx, R1, 3, 0, { k: kp, r: 12, c: C.orange }); txt(ctx, '?', R1.X(3) + 34, R1.Y(0) - 26, { size: 64, w: 700, c: C.orange, a: kp });
    const kf = ap(t, V.frise, 0.8), X = (an) => 260 + (an - 1810) / 80 * 1400, Y = 615;
    seg(ctx, [X(1810), Y], [X(1890), Y], { c: C.gm, lw: 3, k: kf }); for (const an of [1810, 1830, 1850, 1870, 1890]) { seg(ctx, [X(an), Y - 8], [X(an), Y + 8], { c: C.gm, lw: 3, a: kf }); txt(ctx, String(an), X(an), Y + 42, { fam: F.mono, w: 500, size: 22, c: C.encre3, a: kf }); }
    [[1817, 'Bolzano', 'valeurs intermédiaires', -1], [1821, 'Cauchy', 'Cours d’analyse', 1], [1863, 'Weierstrass', 'ε et δ', -1], [1872, 'Heine', 'continuité uniforme', 1]].forEach(([an, nom, quoi, haut], i) => { const k = ap(t, V.dates[i]); if (k <= 0) return; const x = X(an), dx = i === 1 ? 46 : i === 2 ? -46 : 0;
      pt(ctx, [x, Y], { c: C.cours, r: 9, a: k }); seg(ctx, [x, Y], [x + dx, Y + haut * 70], { c: C.cours, lw: 2.5, a: k });
      txt(ctx, `${i === 2 ? 'années 1860' : an} · ${nom}`, x + dx, Y + haut * 98 + (haut > 0 ? 22 : -22), { size: 32, w: 700, a: k }); txt(ctx, quoi, x + dx, Y + haut * 98 + (haut > 0 ? 58 : 14), { fam: F.ui, w: 500, size: 25, c: C.encre2, a: k }); });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une courbe tracée sans lever le crayon qui passe d’un côté à l’autre d’une droite', 'la coupe : longtemps, personne ne songe à le démontrer.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['De Bolzano à Weierstrass, l’intuition du tracé cède la place à des inégalités.']);
  }

  // ---------- 2. la limite en un point ----------
  const R2 = K.repere({ x: 110, y: 170, w: 800, h: 555 }, { x0: 0.6, x1: 3.6, y0: 0, y1: 1.3 }), inv = (x) => 1 / x;
  const epsA = (t) => { const [a, b, c] = S.limite.eps; return lerp(lerp(0.2, 0.1, doux(pr(t, b, 0.7))), 0.05, doux(pr(t, c, 0.7))); };
  function limite(ctx, t) {
    const V = S.limite, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const e = epsA(t), d = Math.min(1, 2 * e), kh = ap(t, V.eps[0], 0.6), kv = ap(t, V.bandeV, 0.6);
    bandeH(ctx, R2, 0.5 - e, 0.5 + e, ORANGE_P, kh); bandeV(ctx, R2, 2 - d, 2 + d, TURQ_P, kv);
    K.axes(ctx, R2, ap(t, V.fig, 0.8), { gx: [1, 3], gy: [1], sansO: 1 });
    const kc = doux(pr(t, V.courbe, 1.2)); K.courbe(ctx, R2, inv, 0.77, lerp(0.77, 3.6, kc)); if (kv > 0) K.courbe(ctx, R2, inv, 2 - d, 2 + d, { c: C.cours, lw: 8, a: kv });
    K.trait(ctx, R2, 0.6, 0.5, 2, 0.5, { c: C.orange, dash: [6, 8], a: kc }); K.trait(ctx, R2, 2, 0, 2, 0.5, { c: C.cours, dash: [6, 8], a: kc }); K.point(ctx, R2, 2, 0.5, { k: kc, r: 8 });
    formule(ctx, 'l_l', R2.X(0.6) + 62, R2.Y(0.5) - 30, { fs: 36, mil: 1, a: kc }); formule(ctx, 'l_a2', R2.X(2), R2.Y(0) + 36, { fs: 34, mil: 1, a: kc }); formule(ctx, 'l_fx', R2.X(1.28), R2.Y(1.12), { fs: 36, mil: 1, a: kc });
    const kd = ap(t, V.def); carte(ctx, 960, 170, 910, 170, 'DÉFINITION', kd); formule(ctx, 'd_lim', 1420, 268, { fs: 33, mil: 1, a: kd });
    txt(ctx, `ε = ${K.fr(e, 2)}`, 1265, 420, { fam: F.ui, w: 600, size: 44, c: C.orange, a: kh }); txt(ctx, `δ = ${K.fr(d, 2)}`, 1575, 420, { fam: F.ui, w: 600, size: 44, c: C.cours, a: kv });
    formule(ctx, 'd_maj', 1420, 540, { fs: 34, mil: 1, a: ap(t, V.maj), monte: 1 }); formule(ctx, 'd_del', 1420, 640, { fs: 46, mil: 1, a: ap(t, V.delta), monte: 1 });
    txt(ctx, 'δ est choisi après ε, mais avant x.', 1420, 728, { fam: F.ui, w: 600, size: 30, c: FAUX, a: ap(t, V.piege) });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Dire que $f(x)$ tend vers une limite quand $x$ tend vers $a$, c’est relever un défi.']);
    legende(ctx, t, V.leg[1], ['On fixe une bande horizontale, de demi-largeur ε, autour de la limite…']);
    legende(ctx, t, V.leg[2], ['… et l’on trouve une bande verticale, de demi-largeur δ, où la courbe', 'ne sort pas de la première, même quand ε diminue.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Sur cet exemple, une majoration fournit un δ qui convient pour chaque ε.']);
    legende(ctx, t, V.leg[4], ['L’erreur la plus répandue est de faire dépendre δ de $x$ :', 'il doit convenir pour tous les $x$ de la bande à la fois.'], { size: 40 });
  }

  // ---------- 3. le pont avec les suites ----------
  const R3 = K.repere({ x: 110, y: 420, w: 890, h: 340 }, { x0: -0.02, x1: 0.72, y0: -1.3, y1: 1.3 }), s1x = (x) => Math.sin(1 / x);
  function suites(ctx, t) {
    const V = S.suites, a = fen(t, L(14) + 0.1, L(18), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kt = ap(t, V.th); carte(ctx, 260, 165, 1400, 200, 'THÉORÈME', kt); txt(ctx, '⋆', 432, 210, { size: 30, w: 700, c: C.encre, a: kt });
    const fs = 36, w1 = largeur('s_g', fs), w2 = largeur('s_ssi', fs), w3 = largeur('s_d', fs), x0 = CX - (w1 + w2 + w3 + 60) / 2; formule(ctx, 's_g', x0, 262, { fs, mil: 1, align: 'left', a: kt }); formule(ctx, 's_ssi', x0 + w1 + 30, 262, { fs, mil: 1, align: 'left', a: kt }); formule(ctx, 's_d', x0 + w1 + w2 + 60, 262, { fs, mil: 1, align: 'left', a: kt });
    txt(ctx, '⋆', CX - 292, 343, { size: 24, w: 700, c: C.encre2, a: kt }); txt(ctx, 'La réciproque utilise l’axiome du choix dénombrable.', CX, 342, { fam: F.ui, w: 500, size: 22, c: C.encre2, a: kt });
    const kf = ap(t, V.fig, 0.8), kx = ap(t, V.xn), ky = ap(t, V.yn);
    K.axes(ctx, R3, kf, { gx: [], gy: [-1, 1] }); if (kf > 0) { oscille(ctx, R3, s1x, 0.72, 1, { a: kf, lw: 3 }); bandeV(ctx, R3, 0, 0.022, 'rgba(163,168,177,0.35)', kf); formule(ctx, 's_f', R3.X(0.6), R3.Y(0.45), { fs: 34, mil: 1, a: kf }); }
    for (let n = 0; n < 9; n++) { K.point(ctx, R3, 1 / (2 * n * Math.PI + Math.PI / 2), 1, { k: borne(kx * 3 - n * 0.2), r: 8, c: C.cours }); if (n) { const p = XY(R3, 1 / (n * Math.PI), 0); pt(ctx, p, { c: C.orange, r: 8, creux: 1, a: borne(ky * 3 - n * 0.2) }); } }
    formule(ctx, 's_x', 1450, 500, { fs: 36, mil: 1, a: kx, monte: 1 }); formule(ctx, 's_y', 1450, 620, { fs: 36, mil: 1, a: ky, monte: 1 });
    txt(ctx, 'pas de limite en 0', 1450, 735, { size: 42, w: 800, c: FAUX, a: ap(t, V.verdict) });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['La limite d’une fonction se lit sur les suites : c’est le pont avec le chapitre 7.']);
    legende(ctx, t, V.leg[1], ['Deux suites qui tendent vers 0, deux limites différentes pour leurs images.']);
  }

  // ---------- 4. la continuité en un point ----------
  const R4a = K.repere({ x: 200, y: 370, w: 600, h: 390 }, { x0: 0.3, x1: 3.3, y0: -0.35, y1: 2.4 }), R4b = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -0.45, x1: 0.45, y0: -0.3, y1: 0.3 }), xs = (x) => x * Math.sin(1 / x);
  function continu(ctx, t) {
    const V = S.continu, a = fen(t, L(18) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(18) + 0.1, L(22), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def), ke = ap(t, V.esc, 0.8), kg = ap(t, V.gauche);
      carte(ctx, 380, 165, 1160, 170, 'DÉFINITION', kd); formule(ctx, 'c_def', CX, 262, { fs: 34, mil: 1, a: kd });
      K.axes(ctx, R4a, ke, { gx: [1, 2, 3], gy: [1, 2] });
      [[1, 2, 1], [2, 3, 2]].forEach(([x0, x1, y]) => { seg(ctx, XY(R4a, x0, y), XY(R4a, x1, y), { c: C.bleu, lw: 6, k: ke }); pt(ctx, XY(R4a, x0, y), { c: C.bleu, r: 9, a: ke }); pt(ctx, XY(R4a, x1, y), { c: C.bleu, r: 9, creux: 1, a: ke }); });
      seg(ctx, XY(R4a, 2, 1), XY(R4a, 2, 2), { c: C.orange, lw: 3, dash: [6, 8], a: kg });
      txt(ctx, 'la partie entière, près de 2', 1380, 440, { fam: F.ui, w: 600, size: 30, c: C.bleu, a: ke }); formule(ctx, 'c_dr', 1380, 540, { fs: 40, mil: 1, a: ke, monte: 1 }); formule(ctx, 'c_g', 1380, 660, { fs: 40, mil: 1, a: kg, monte: 1 }); marque(ctx, 1700, 660, 18, false, ap(t, V.gauche + 0.3)); ctx.restore(); }
    k = fen(t, L(22) + 0.1, L(26), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig2, 0.8), ke = ap(t, V.enc), kp = ap(t, V.pro);
      K.axes(ctx, R4b, kf, { gx: [], gy: [], sansO: 1 });
      K.courbe(ctx, R4b, (x) => Math.abs(x), -0.45, 0.45, { c: VIOLET, lw: 3.5, a: ke }); K.courbe(ctx, R4b, (x) => -Math.abs(x), -0.45, 0.45, { c: VIOLET, lw: 3.5, a: ke });
      if (kf > 0) { oscille(ctx, R4b, xs, 0.45, 1, { a: kf, lw: 3 }); oscille(ctx, R4b, xs, 0.45, -1, { a: kf, lw: 3 }); }
      formule(ctx, 'c_h', R4b.X(0.12), R4b.Y(0.245), { fs: 34, mil: 1, a: ke }); formule(ctx, 'c_b', R4b.X(0.13), R4b.Y(-0.245), { fs: 34, mil: 1, a: ke });
      K.point(ctx, R4b, 0, 0, { k: kp, r: 11, c: C.cours });
      formule(ctx, 'c_f', 1455, 225, { fs: 48, mil: 1, a: kf, monte: 1 }); formule(ctx, 'c_enc', 1455, 390, { fs: 44, mil: 1, a: ke, monte: 1 });
      cadre(ctx, 1455, 540, 620, 96, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kp }); txt(ctx, 'on pose', 1330, 552, { fam: F.ui, w: 600, size: 32, a: kp }); formule(ctx, 'c_pro', 1540, 538, { fs: 46, mil: 1, a: kp });
      txt(ctx, 'sin(1/x), elle, n’a aucun prolongement continu en 0.', 1455, 690, { fam: F.ui, w: 500, size: 27, c: FAUX, a: ap(t, V.contre) }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['[Continue] en $a$ : la limite en $a$ existe, et c’est alors forcément $f(a)$.']);
    legende(ctx, t, V.leg[1], ['La partie entière est continue à droite en 2, mais pas à gauche.']);
    legende(ctx, t, V.leg[2], ['Cette fonction n’est pas définie en 0, mais elle y a une limite.']);
    legende(ctx, t, V.leg[3], ['Lui donner cette limite pour valeur, c’est la [prolonger par continuité].']);
  }

  // ---------- 5. le théorème des valeurs intermédiaires ----------
  const R5 = K.repere({ x: 110, y: 170, w: 890, h: 400 }, { x0: -0.25, x1: 2.25, y0: -2.5, y1: 2.5 }), f5 = (x) => x * x - 2, P5 = { ech: 2.6, m: [1, 1.5, 1.25, 1.375], seg: [[0, 2], [1, 2], [1, 1.5], [1.25, 1.5], [1.375, 1.5]] };
  const xChien5 = (t) => { let x = P5.m[0]; S.tvi.marches.forEach(([a, b], i) => { x = lerp(x, P5.m[i + 1], doux(pr(t, a, b - a))); }); return x; };
  function tvi(ctx, t) {
    const V = S.tvi, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kf = ap(t, V.fig, 0.8);
    K.axes(ctx, R5, kf, { gx: [1, 2], gy: [-2, 2], sansO: 1 }); K.courbe(ctx, R5, f5, 0, lerp(0, 2, doux(pr(t, V.fig + 0.3, 1.2))));
    formule(ctx, 'v_f', R5.X(0.62), R5.Y(1.7), { fs: 38, mil: 1, a: kf });
    P5.seg.forEach(([x0, x1], n) => { const k = n ? ap(t, V.etapes[n - 1], 0.5) : kf, y = 606 + n * 32; seg(ctx, [R5.X(x0), y], [R5.X(x1), y], { c: C.orange, lw: 7, k }); txt(ctx, `[a${'₀₁₂₃₄'[n]} , b${'₀₁₂₃₄'[n]}]`, R5.X(0) - 70, y + 9, { fam: F.main, w: 400, size: 24, c: C.encre2, a: k }); });
    P5.m.forEach((m, n) => { const k = ap(t, V.etapes[n]); K.trait(ctx, R5, m, 0, m, f5(m), { c: f5(m) > 0 ? C.cours : C.orange, lw: 3, dash: [5, 6], a: k * (n === 3 || t < V.etapes[Math.min(3, n + 1)] ? 1 : 0.35) }); K.point(ctx, R5, m, f5(m), { k, r: 7, c: f5(m) > 0 ? C.cours : C.orange }); });
    const kr = ap(t, V.concl); K.trait(ctx, R5, Math.SQRT2, 0, Math.SQRT2, -2.5, { c: C.cours, lw: 2.5, dash: [4, 7], a: kr }); K.point(ctx, R5, Math.SQRT2, 0, { k: kr, r: 9, c: C.cours });
    const kt = ap(t, V.th); carte(ctx, 1050, 165, 810, 200, 'THÉORÈME', kt); formule(ctx, 'v_th1', 1455, 252, { fs: 31, mil: 1, a: kt }); formule(ctx, 'v_th2', 1455, 318, { fs: 38, mil: 1, a: kt });
    let k = 1 - ap(t, V.adj - 0.3, 0.3);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ['v_e0', 'v_e1', 'v_e2', 'v_e3'].forEach((id, n) => { const kk = ap(t, V.etapes[n]); formule(ctx, id, 1380, 440 + n * 74, { fs: 38, mil: 1, a: kk, monte: 1 }); }); ctx.restore(); }
    formule(ctx, 'v_adj', 1455, 470, { fs: 36, mil: 1, a: ap(t, V.adj), monte: 1 }); formule(ctx, 'v_c', 1455, 590, { fs: 38, mil: 1, a: kr, monte: 1 }); formule(ctx, 'v_r', 1455, 700, { fs: 56, mil: 1, a: ap(t, V.concl + 0.6), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une fonction continue sur un segment prend toutes les valeurs', 'comprises entre ses valeurs aux extrémités.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Par [dichotomie] : à chaque étape, on garde la moitié du segment', 'aux extrémités de laquelle $f$ change de signe.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Les extrémités forment deux suites adjacentes ;', 'par continuité, leur limite commune $c$ annule $f$.'], { size: 40 });
  }

  // ---------- 6. le théorème des bornes atteintes ----------
  const R6 = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -0.4, x1: 6, y0: -0.3, y1: 4.3 }), f6 = (x) => 2.1 + 1.3 * Math.sin(1.45 * x - 0.2) - 0.12 * (x - 3), P6 = { a: 0.5, b: 5.5, ech: 2.8 };
  { let M = -1e9, m = 1e9; for (let x = P6.a; x <= P6.b; x += 0.0005) { const y = f6(x); if (y > M) { M = y; P6.d = x; } if (y < m) { m = y; P6.c = x; } } P6.M = M; P6.m = m; }
  const d6 = (x) => 1.3 * 1.45 * Math.cos(1.45 * x - 0.2) - 0.12, xChien6 = (t) => lerp(P6.a, P6.d, doux(pr(t, S.bornes.marche[0], S.bornes.marche[1] - S.bornes.marche[0])));
  function bornes(ctx, t) {
    const V = S.bornes, a = fen(t, L(34) + 0.1, L(38), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kf = ap(t, V.fig, 0.8), kM = ap(t, V.max), km = ap(t, V.min), ki = ap(t, V.image, 0.7);
    K.axes(ctx, R6, kf, { gx: [], gy: [], sansO: 1 }); K.courbe(ctx, R6, f6, P6.a, lerp(P6.a, P6.b, doux(pr(t, V.fig + 0.3, 1.2))));
    K.trait(ctx, R6, P6.a, 0, P6.a, f6(P6.a), { dash: [6, 8], a: kf }); K.trait(ctx, R6, P6.b, 0, P6.b, f6(P6.b), { dash: [6, 8], a: kf }); formule(ctx, 'l_a', R6.X(P6.a), R6.Y(0) + 36, { fs: 38, mil: 1, a: kf }); formule(ctx, 'l_b', R6.X(P6.b), R6.Y(0) + 36, { fs: 38, mil: 1, a: kf });
    K.point(ctx, R6, P6.a, f6(P6.a), { k: kf, r: 7, c: C.bleu }); K.point(ctx, R6, P6.b, f6(P6.b), { k: kf, r: 7, c: C.bleu });
    K.trait(ctx, R6, 0, P6.M, P6.d, P6.M, { c: VRAI, dash: [8, 8], a: kM }); K.trait(ctx, R6, P6.d, 0, P6.d, P6.M, { c: C.cours, dash: [6, 8], a: kM }); formule(ctx, 'l_d', R6.X(P6.d), R6.Y(0) + 36, { fs: 38, mil: 1, a: kM }); formule(ctx, 'l_M', R6.X(0) - 36, R6.Y(P6.M), { fs: 38, mil: 1, a: kM });
    K.trait(ctx, R6, 0, P6.m, P6.c, P6.m, { c: VRAI, dash: [8, 8], a: km }); K.trait(ctx, R6, P6.c, 0, P6.c, P6.m, { c: C.cours, dash: [6, 8], a: km }); formule(ctx, 'l_c', R6.X(P6.c), R6.Y(0) + 36, { fs: 38, mil: 1, a: km }); formule(ctx, 'l_m', R6.X(0) - 36, R6.Y(P6.m), { fs: 38, mil: 1, a: km });
    K.point(ctx, R6, P6.d, P6.M, { k: kM, r: 9, c: C.cours }); K.point(ctx, R6, P6.c, P6.m, { k: km, r: 9, c: C.cours });
    seg(ctx, XY(R6, 0, P6.m), XY(R6, 0, P6.M), { c: VRAI, lw: 9, k: ki });
    const kt = ap(t, V.th); carte(ctx, 1050, 185, 810, 250, 'THÉORÈME', kt); formule(ctx, 'm_th1', 1455, 280, { fs: 34, mil: 1, a: kt }); formule(ctx, 'm_th2', 1455, 368, { fs: 29, mil: 1, a: kt });
    etiq(ctx, 'l’image du segment est un segment', 1455, 560, ki); formule(ctx, 'm_im', 1455, 640, { fs: 50, mil: 1, a: ki, monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Sur un segment, une fonction continue est bornée, et elle {atteint} ses bornes.']);
    legende(ctx, t, V.leg[1], ['Le maximum est atteint en $d$, le minimum en $c$.']);
    legende(ctx, t, V.leg[2], ['Sur un intervalle qui n’est pas fermé, c’est faux : la fonction inverse', 'n’est pas majorée près de 0.'], { size: 40 });
  }

  // ---------- 7. continuité uniforme et théorème de Heine ----------
  const R7 = K.repere({ x: 110, y: 170, w: 760, h: 520 }, { x0: -0.2, x1: 2.6, y0: -0.4, y1: 5.2 }), carre = (x) => x * x;
  function bande7(ctx, a0, k) { if (k <= 0) return; const e = 0.5, x0 = Math.sqrt(Math.max(0, a0 * a0 - e)), x1 = Math.sqrt(a0 * a0 + e), d = Math.min(a0 - x0, x1 - a0);
    ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = ORANGE_P; ctx.fillRect(R7.X(0), R7.Y(a0 * a0 + e), R7.X(x1) - R7.X(0), R7.Y(a0 * a0 - e) - R7.Y(a0 * a0 + e)); ctx.fillStyle = TURQ_P; ctx.fillRect(R7.X(a0 - d), R7.Y(a0 * a0 + e), R7.X(a0 + d) - R7.X(a0 - d), R7.Y(0) - R7.Y(a0 * a0 + e));
    seg(ctx, [R7.X(a0 - d), R7.Y(0) + 46], [R7.X(a0 + d), R7.Y(0) + 46], { c: C.cours, lw: 6 }); txt(ctx, `2δ = ${K.fr(2 * d, 2)}`, R7.X(a0), R7.Y(0) + 86, { fam: F.ui, w: 600, size: 26, c: C.cours });
    formule(ctx, 'u_e', R7.X(x1) + 70, R7.Y(a0 * a0), { fs: 30, mil: 1 }); K.point(ctx, R7, a0, a0 * a0, { r: 8 }); ctx.restore(); }
  function heine(ctx, t) {
    const V = S.heine, a = fen(t, L(38) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(38) + 0.1, L(42), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const k1 = ap(t, V.c1), k2 = ap(t, V.c2), kq = ap(t, V.quant);
      txt(ctx, 'f est continue sur I', CX, 222, { fam: F.ui, w: 600, size: 32, c: C.encre2, a: k1 }); formule(ctx, 'u_c', CX, 300, { fs: 34, mil: 1, a: k1, monte: 1 });
      carte(ctx, 180, 400, 1560, 210, 'DÉFINITION', k2); txt(ctx, 'f est uniformément continue sur I', CX, 470, { fam: F.ui, w: 600, size: 32, a: k2 }); formule(ctx, 'u_u', CX, 548, { fs: 34, mil: 1, a: k2 });
      txt(ctx, 'Seule la place d’un quantificateur change : δ ne dépend plus du point.', CX, 700, { fam: F.ui, w: 600, size: 30, c: C.orange, a: kq }); ctx.restore(); }
    k = fen(t, L(42) + 0.1, L(46), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig, 0.8);
      bande7(ctx, 0.5, ap(t, V.b1)); bande7(ctx, 2, ap(t, V.b2));
      K.axes(ctx, R7, kf, { gx: [1, 2], gy: [1, 2, 3, 4, 5], muetX: 1 }); K.courbe(ctx, R7, carre, 0, lerp(0, 2.3, doux(pr(t, V.fig + 0.3, 1.2)))); formule(ctx, 'u_f', R7.X(1.55), R7.Y(4.6), { fs: 36, mil: 1, a: kf });
      formule(ctx, 'u_s1', 1400, 205, { fs: 36, mil: 1, a: ap(t, V.suites), monte: 1 }); formule(ctx, 'u_s2', 1400, 290, { fs: 34, mil: 1, a: ap(t, V.suites + 0.4), monte: 1 }); txt(ctx, 'La fonction carré n’est pas uniformément continue sur ℝ.', 1400, 378, { fam: F.ui, w: 600, size: 28, c: FAUX, a: ap(t, V.suites + 0.6) });
      const kh = ap(t, V.heine); carte(ctx, 960, 450, 880, 250, 'THÉORÈME DE HEINE', kh); formule(ctx, 'u_h1', 1400, 550, { fs: 36, mil: 1, a: kh }); txt(ctx, '⟹  f est uniformément continue sur [a , b]', 1400, 640, { fam: F.ui, w: 600, size: 32, c: C.cours, a: kh }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Dans la continuité sur un intervalle, δ peut dépendre du point considéré.']);
    legende(ctx, t, V.leg[1], ['Dans la [continuité uniforme], un même δ convient pour tous les points à la fois.']);
    legende(ctx, t, V.leg[2], ['Pour la fonction carré, à ε fixé, δ se resserre quand le point s’éloigne :', 'aucun ne convient sur ℝ tout entier.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Sur un segment, la difficulté disparaît : c’est le [théorème de Heine].']);
  }

  // ---------- bilan : l'enchaînement des théorèmes (schéma du cours, simplifié) ----------
  function bilan(ctx, t) {
    const Bi = S.bilan, a = fen(t, L(S.BILAN) + 0.2, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ND = [[960, 705, 'Axiome de la borne supérieure (chapitre 7)', -1, C.rouge], [520, 575, 'Suites adjacentes', 0], [1400, 575, 'Bolzano-Weierstrass', 0], [520, 440, 'Valeurs intermédiaires', 1, C.cours, 1], [1150, 440, 'Bornes atteintes', 2, C.cours, 1], [1650, 440, 'Heine', 2, C.cours, 1], [520, 300, 'Bijection continue', 3], [1650, 300, 'Chapitre 18 : intégration', 5]];
    ND.forEach(([x, y, , p], i) => { if (p < 0) return; const k = doux(pr(t, Bi.noeuds[i] - 0.5, 0.6)); if (k <= 0) return; const [xp, yp] = ND[p];
      ctx.save(); ctx.strokeStyle = C.gm; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.setLineDash(i === 7 ? [6, 10] : [800 * k, 2000]); ctx.globalAlpha *= i === 7 ? k : 1; ctx.beginPath(); ctx.moveTo(xp, yp - 34); ctx.bezierCurveTo(xp, yp - 34 - (yp - y - 68) * 0.6, x, y + 34 + (yp - y - 68) * 0.6, x, y + 34); ctx.stroke(); ctx.restore(); });
    ND.forEach(([x, y, nom, p, c, gras], i) => { const k = ap(t, Bi.noeuds[i]); if (k <= 0) return; ctx.save(); ctx.font = `600 30px ${F.titre}`; const w = ctx.measureText(nom).width + 56; ctx.restore();
      ctx.save(); ctx.translate(0, (1 - k) * 14); cadre(ctx, x, y, w, 64, { fill: gras ? 'rgba(53,202,164,0.14)' : C.surface, stroke: c || C.gl, lw: i && !gras ? 2.5 : 3.5, a: k }); txt(ctx, nom, x, y + 10, { size: 30, w: 600, a: k, c: i === 7 ? C.encre2 : C.encre }); ctx.restore(); });
    ctx.restore();
    legende(ctx, t, Bi.leg[0], ['Trois grands théorèmes, un seul {axiome}.']);
  }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 92, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (250 + 215 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
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
  // Le chien est l'acteur de deux scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 5. valeurs intermédiaires — il bondit sous l'écran et retombe du haut sur l'axe, au milieu du segment [0 ; 2] ; il
  //    trotte ensuite de milieu en milieu (1 ; 1,5 ; 1,25 ; 1,375), puis redescend au jardin d'un saut vertical ;
  // 6. bornes atteintes — même entrée, à l'extrémité gauche de la courbe ; il monte s'asseoir au point où le maximum
  //    est atteint, puis redescend de la même façon.
  const AT = S.tvi, AB = S.bornes, T1 = S.CH.map((c) => c.t1);
  const X5 = R5.X(P5.m[3]) + 60, tX5 = T1[4] - 1.4, X6 = R6.X(P6.d) + 60, tX6 = T1[5] - 1.4;
  const EN_SCENE = [[AT.bond + 0.2, tX5 + 1.55], [AB.bond + 0.2, tX6 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX5 + 1.55, tX5 + 2.45, X5 / SC, DS[4]], [tX6 + 1.55, tX6 + 2.45, X6 / SC, DS[5]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 5. la dichotomie
    const y5 = R5.Y(0);
    if (!bond(ctx, t, AT.bond, DS[4] * SC, AT.chute[0]) && !chute(ctx, t, AT.chute[0], AT.chute[1], R5.X(1), y5, P5.ech) && t >= AT.chute[1]) {
      if (t < tX5) { const x = xChien5(t), xs = xChien5(t + 0.05), u = t - AT.atterrit, marche = AT.marches.some(([a, b]) => t > a && t < b), dernier = AT.marches[2][1];
        K.chienSur(ctx, R5.X(x), y5, 0, P5.ech, { ...(u < 0.35 ? K.poseChoc(t, u) : marche ? trot(t, R5.X(x) * 1.3, P5.ech) : t > dernier ? assisP(t, doux(pr(t, dernier, 0.4)), -0.1) : { t, tete: 0.25 }), face: marche ? (xs >= x ? 1 : -1) : 1 }); }
      else sautJardin(ctx, t, tX5, R5.X(P5.m[3]), y5, P5.ech, X5); }
    // 6. le maximum
    const p6 = XY(R6, P6.a, f6(P6.a));
    if (!bond(ctx, t, AB.bond, DS[5] * SC, AB.chute[0]) && !chute(ctx, t, AB.chute[0], AB.chute[1], p6[0], p6[1], P6.ech) && t >= AB.chute[1]) {
      if (t < tX6) { const x = xChien6(t), p = XY(R6, x, f6(x)), u = t - AB.atterrit, marche = t > AB.marche[0] && t < AB.marche[1];
        K.chienSur(ctx, p[0], p[1] - 2, borne(Math.atan(-d6(x) * R6.ky / R6.kx), -0.8, 0.8), P6.ech, u < 0.35 ? K.poseChoc(t, u) : marche ? trot(t, p[0] * 1.3, P6.ech) : t < AB.marche[0] ? { t } : assisP(t, doux(pr(t, AB.marche[1], 0.4)), -0.1)); }
      else sautJardin(ctx, t, tX6, R6.X(P6.d), R6.Y(P6.M), P6.ech, X6); }
  }
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
  // plus 100 s). Le titre, les deux bandes de la définition de la limite autour de la courbe, le chien, le jardin.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'Limites', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'et continuité', 76, 506, { size: 150, w: 800, align: 'left' });
    const Rv = K.repere({ x: 1060, y: 230, w: 780, h: 560 }, { x0: 0.75, x1: 3.4, y0: 0.1, y1: 1.2 }), e = 0.14, d = 0.42;
    bandeH(ctx, Rv, 0.5 - e, 0.5 + e, 'rgba(255,162,74,0.26)', 1); bandeV(ctx, Rv, 2 - d, 2 + d, 'rgba(53,202,164,0.26)', 1);
    K.courbe(ctx, Rv, inv, 0.84, 3.4, { lw: 9 }); K.courbe(ctx, Rv, inv, 2 - d, 2 + d, { c: C.cours, lw: 12 });
    const x = 2, p = XY(Rv, x, inv(x)); K.chienSur(ctx, p[0], p[1] - 4, Math.atan(0.25 * Rv.ky / Rv.kx), 4.6, { t: 0.4, allure: 'trot', phase: 1.1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    histoire(ctx, ts); limite(ctx, ts); suites(ctx, ts); continu(ctx, ts); tvi(ctx, ts); bornes(ctx, ts); heine(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
