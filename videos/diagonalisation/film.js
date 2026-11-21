// LE FILM — « Éléments propres et diagonalisation », MP, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y est le vecteur unitaire x qui parcourt le cercle : deux fois, son image Ax lui reste alignée. Puis il parcourt les nombres de Fibonacci.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Éléments propres et diagonalisation', NIVEAU = 'MP', LONG = 'MP · CHAPITRE 2', NB_EXERCICES = 55;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 84, w: 800, a: k1 });
    ligne(ctx, 'Trouver la base où tout est {simple}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const suiteL = (ctx, i1, i2, y, fs, a1, a2, cx = CX) => { const w = largeur(i1, fs), x = cx - (w + largeur(i2, fs) + 16) / 2; formule(ctx, i1, x, y, { fs, mil: 1, align: 'left', a: a1, monte: 1 }); formule(ctx, i2, x + w + 16, y, { fs, mil: 1, align: 'left', a: a2, monte: 1 }); };

  // ---------- 1. une direction que l'on étire ----------
  const FG = { c: [520, 480], u: 104, ech: 1.7 }, rad = (d) => d * Math.PI / 180, pv = (x, y, F0 = FG) => [F0.c[0] + F0.u * x, F0.c[1] - F0.u * y];
  const theta = (k) => rad(k < 0.2 ? lerp(20, 45, doux(k / 0.2)) : k < 0.4 ? 45 : k < 0.75 ? lerp(45, 135, doux((k - 0.4) / 0.35)) : k < 0.92 ? 135 : lerp(135, 160, doux((k - 0.92) / 0.08)));
  const posCercle = (t) => { const V = S.direction, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), th = theta(k), m = k > 0 && k < 1 && !(k >= 0.2 && k < 0.4) && !(k >= 0.75 && k < 0.92);
    return { p: pv(Math.cos(th), Math.sin(th)), th, an: borne(Math.atan(Math.cos(th) / Math.sin(th)), -0.8, 0.8), marche: m, face: -1, tete: m ? 0 : -0.1 }; };
  function figA(ctx, kf, th, o = {}) { const F0 = o.F || FG; if (kf <= 0) return; ctx.save(); ctx.globalAlpha *= kf; seg(ctx, pv(-3.6, 0, F0), pv(3.6, 0, F0), { c: C.gl, lw: 2 }); seg(ctx, pv(0, -2.6, F0), pv(0, 2.6, F0), { c: C.gl, lw: 2 });
    seg(ctx, pv(-2.5, -2.5, F0), pv(2.5, 2.5, F0), { c: C.cours, lw: 2.5, dash: [8, 8] }); seg(ctx, pv(1.9, -1.9, F0), pv(-1.9, 1.9, F0), { c: C.cours, lw: 2.5, dash: [8, 8] });
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = C.bleu; ctx.beginPath(); ctx.arc(F0.c[0], F0.c[1], F0.u, 0, 6.3); ctx.stroke(); ctx.strokeStyle = C.orange; ctx.beginPath(); for (let i = 0; i <= 90; i++) { const a = i / 90 * 2 * Math.PI, p = pv(2 * Math.cos(a) + Math.sin(a), Math.cos(a) + 2 * Math.sin(a), F0); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    if (th !== undefined) { const x = Math.cos(th), y = Math.sin(th); fl(ctx, F0.c, pv(2 * x + y, x + 2 * y, F0), { c: C.orange, lw: 5, a: kf }); fl(ctx, F0.c, pv(x, y, F0), { c: C.bleu, lw: 5, a: kf }); } }
  function direction(ctx, t) { const V = S.direction;
    phase(ctx, t, 2, 10, () => { const kf = ap(t, V.fig, 0.9), on = t > V.chute[1], th = on ? posCercle(t).th : rad(20); figA(ctx, kf, on ? th : undefined);
      fo(ctx, t, 'd_A', 1380, 250, 46, V.A); tx(ctx, t, 'le cercle des vecteurs unitaires x', 1380, 370, V.fig, { c: C.bleu, size: 28 }); tx(ctx, t, 'l’ellipse de leurs images Ax', 1380, 415, V.fig, { c: C.orange, size: 28 });
      const x = Math.cos(th), y = Math.sin(th), km = fen(t, V.marche[0], V.dir, 0.3); txt(ctx, `x = (${K.fr(x, 2)} ; ${K.fr(y, 2)})`, 1380, 510, { fam: F.ui, w: 600, size: 32, c: C.bleu, a: km }); txt(ctx, `Ax = (${K.fr(2 * x + y, 2)} ; ${K.fr(x + 2 * y, 2)})`, 1380, 560, { fam: F.ui, w: 600, size: 32, c: C.orange, a: km });
      fo(ctx, t, 'd_3', 1180, 670, 50, V.e3); fo(ctx, t, 'd_1', 1580, 670, 50, V.e1); tx(ctx, t, 'deux directions propres', 1380, 510, V.dir, { size: 36, c: C.cours }); tx(ctx, t, 'Hilbert, 1904 : la valeur « propre » à la transformation', 1380, 565, V.mot, { size: 26, c: C.encre2, w: 500 }); });
    legs(ctx, t, V, [['Une matrice transforme chaque vecteur $x$ en un vecteur $A x$ :', 'ici, le cercle devient une ellipse.'], ['Le chien est le vecteur $x$ : en général, son image n’a pas la même direction que lui.'], ['Sur la première diagonale, l’image est alignée avec $x$ : elle vaut trois fois $x$.'], ['Puis l’image tourne de nouveau, plus vite ou moins vite que $x$.'], ['Sur la seconde diagonale, l’image est $x$ lui-même.'], ['Ces deux droites, que la matrice se contente d’étirer, sont ses directions propres.']]); }

  // ---------- 2. valeurs propres, vecteurs propres ----------
  function propres(ctx, t) { const V = S.propres;
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.def); carte(ctx, 310, 165, 1300, 190, 'DÉFINITION', kd); formule(ctx, 'p_def', 660, 270, { fs: 44, mil: 1, a: kd }); txt(ctx, 'λ est une valeur propre de u,', 1260, 250, { fam: F.ui, w: 600, size: 28, a: kd }); txt(ctx, 'x un vecteur propre associé.', 1260, 294, { fam: F.ui, w: 600, size: 28, a: kd });
      tx(ctx, t, 'le sous-espace propre :', 640, 422, V.E, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'p_E', 1140, 410, 40, V.E); tx(ctx, t, 'le spectre, ensemble des valeurs propres :', 760, 497, V.sp, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'p_sp', 1160, 485, 40, V.sp);
      const kt = ap(t, V.th); carte(ctx, 310, 540, 1300, 190, 'THÉORÈME', kt); txt(ctx, 'Des sous-espaces propres associés à des valeurs propres distinctes sont en somme directe.', CX, 620, { fam: F.ui, w: 600, size: 26, a: kt }); formule(ctx, 'p_th', 820, 680, { fs: 34, mil: 1, a: kt }); formule(ctx, 'p_card', 1380, 680, { fs: 32, mil: 1, a: ap(t, V.card) }); });
    legs(ctx, t, V, [['Une [valeur propre] et un [vecteur propre] : $u$ multiplie $x$ par un scalaire.'], ['Les vecteurs propres associés à une même valeur forment,', 'avec le vecteur nul, un [sous-espace propre].'], ['Un endomorphisme a donc au plus $n$ valeurs propres en dimension $n$.']]); }

  // ---------- 3. le polynôme caractéristique ----------
  function caract(ctx, t) { const V = S.caract;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.def); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); formule(ctx, 'c_def', CX, 250, { fs: 46, mil: 1, a: kd });
      const kt = ap(t, V.th); carte(ctx, 510, 380, 900, 150, 'THÉORÈME', kt); formule(ctx, 'c_th', CX, 465, { fs: 42, mil: 1, a: kt }); fo(ctx, t, 'c_dev', CX, 660, 40, V.dev); });
    phase(ctx, t, 18, 22, () => { fo(ctx, t, 'c_2', CX, 220, 42, V.d2); suiteL(ctx, 'c_ex', 'c_fac', 380, 42, ap(t, V.ex), ap(t, V.fac));
      tx(ctx, t, 'multiplicité d’une valeur propre : sa multiplicité comme racine', 620, 562, V.mult, { c: C.encre2, w: 500, size: 26 }); fo(ctx, t, 'c_m', 1380, 550, 40, V.mult); tx(ctx, t, 'pour deux matrices carrées de même taille :', 720, 702, V.ab, { c: C.encre2, w: 500, size: 26 }); fo(ctx, t, 'c_ab', 1280, 690, 42, V.ab); });
    legs(ctx, t, V, [['Le [polynôme caractéristique] : un déterminant', 'où l’indéterminée $X$ remplace la valeur propre.'], ['Ses racines sont exactement les valeurs propres.'], ['Il est unitaire, de degré $n$ ; la trace et le déterminant s’y lisent.'], ['En taille 2, il s’écrit donc sans calcul.'], ['Pour la matrice du début : on retrouve les valeurs propres 1 et 3.'], ['La dimension d’un sous-espace propre ne dépasse jamais la multiplicité.']]); }

  // ---------- 4. diagonaliser ----------
  function diago(ctx, t) { const V = S.diago;
    phase(ctx, t, 22, 25, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 130, 'DÉFINITION', kd); txt(ctx, 'u est diagonalisable s’il existe une base dans laquelle sa matrice est diagonale : une base de vecteurs propres.', CX, 250, { fam: F.ui, w: 600, size: 25, a: kd });
      const kt = ap(t, V.th); carte(ctx, 260, 360, 1400, 190, 'THÉORÈME', kt); txt(ctx, 'u est diagonalisable si et seulement si', CX, 440, { fam: F.ui, w: 600, size: 28, a: kt }); formule(ctx, 'g_th', CX, 500, { fs: 32, mil: 1, a: kt });
      tx(ctx, t, 'En particulier : n valeurs propres distinctes en dimension n, donc diagonalisable.', CX, 660, V.cor, { c: C.cours, size: 30 }); });
    phase(ctx, t, 25, 30, () => { fo(ctx, t, 'g_A', 400, 280, 40, V.A); fo(ctx, t, 'g_chi', 400, 470, 40, V.chi); fo(ctx, t, 'g_E1', 1280, 230, 40, V.E1); tx(ctx, t, 'un plan : dimension 2, comme la multiplicité', 1280, 292, V.E1, { c: C.encre2, w: 500, size: 24 });
      fo(ctx, t, 'g_E4', 1280, 380, 40, V.E4); tx(ctx, t, 'une droite', 1280, 438, V.E4, { c: C.encre2, w: 500, size: 24 }); fo(ctx, t, 'g_P', 1280, 570, 36, V.P); fo(ctx, t, 'g_c', 500, 660, 44, V.ctrl); });
    legs(ctx, t, V, [['[Diagonaliser], c’est trouver une base formée de vecteurs propres.'], ['Deux conditions : assez de racines, et pour chacune assez de vecteurs propres.'], ['On calcule d’abord le polynôme caractéristique, sous forme factorisée.'], ['Pour chaque valeur propre, on résout un système : il donne le sous-espace propre.'], ['On range les vecteurs propres en colonnes, les valeurs propres dans le même ordre.']]); }

  // ---------- 5. trois issues possibles ----------
  function issues(ctx, t) { const V = S.issues;
    phase(ctx, t, 30, 34, () => { fo(ctx, t, 'i_C', 420, 300, 42, V.C); fo(ctx, t, 'i_chi', 420, 500, 44, V.chi); tx(ctx, t, 'scindé : une seule valeur propre, triple', 420, 570, V.chi, { c: C.encre2, w: 500, size: 26 });
      fo(ctx, t, 'i_E', 1300, 280, 36, V.E2); fo(ctx, t, 'i_non', 1300, 440, 44, V.non); tx(ctx, t, 'C n’est pas diagonalisable : il manque une direction propre.', 1300, 560, V.non, { c: C.orange, size: 30 }); });
    phase(ctx, t, 34, 38, () => { fo(ctx, t, 'i_R', 420, 260, 44, V.R); tx(ctx, t, 'le quart de tour', 420, 350, V.R, { c: C.encre2, w: 500, size: 26 }); const kr = ap(t, V.R), o = [420, 600]; seg(ctx, [o[0] - 150, o[1]], [o[0] + 150, o[1]], { c: C.gl, lw: 2, a: kr }); seg(ctx, [o[0], o[1] + 40], [o[0], o[1] - 170], { c: C.gl, lw: 2, a: kr });
      fl(ctx, o, [o[0] + 130, o[1]], { c: C.bleu, lw: 5, a: kr }); formule(ctx, 'i_e1', o[0] + 140, o[1] + 36, { fs: 30, mil: 1, a: kr }); fl(ctx, o, [o[0], o[1] - 130], { c: C.orange, lw: 5, a: kr }); formule(ctx, 'i_Re1', o[0] + 56, o[1] - 130, { fs: 30, mil: 1, a: kr });
      fo(ctx, t, 'i_chiR', 1300, 240, 44, V.chiR); tx(ctx, t, 'aucune racine réelle : R n’est pas diagonalisable sur les réels', 1300, 330, V.nonR, { c: C.orange, size: 28 }); fo(ctx, t, 'i_C2', 1300, 440, 44, V.surC); tx(ctx, t, 'deux racines simples : R est diagonalisable sur les complexes', 1300, 530, V.surC, { c: C.cours, size: 28 });
      const ke = ap(t, V.err); carte(ctx, 860, 600, 880, 130, 'PIÈGE', ke); txt(ctx, 'Une valeur propre multiple n’empêche pas de diagonaliser :', 1300, 668, { fam: F.ui, w: 600, size: 24, a: ke }); txt(ctx, 'seule compte la dimension du sous-espace propre.', 1300, 702, { fam: F.ui, w: 600, size: 24, a: ke }); });
    legs(ctx, t, V, [['Deuxième issue : un polynôme caractéristique scindé, à une seule racine.'], ['Le sous-espace propre n’est qu’un plan : sa dimension est inférieure à la multiplicité.'], ['Troisième issue : un quart de tour ne laisse stable aucune droite du plan.'], ['Tout dépend du corps : sur les complexes, le polynôme est scindé à racines simples.'], ['La matrice du premier exemple avait une valeur propre double,', 'et elle était diagonalisable.']]); }

  // ---------- 6. les puissances d'une matrice ----------
  const FB = { y: 690, X: (v) => 200 + 27 * v, ech: 2.2 }, FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55];
  const posFib = (t) => { const V = S.puissances, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])), x = lerp(0, 55, k); return { p: [FB.X(x), FB.y], x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function puissances(ctx, t) { const V = S.puissances;
    phase(ctx, t, 38, 46, () => { const kp = ap(t, V.prop); carte(ctx, 410, 165, 1100, 130, 'PROPRIÉTÉ', kp); formule(ctx, 'u_p', CX, 240, { fs: 40, mil: 1, a: kp });
      fo(ctx, t, 'u_F', 560, 400, 34, V.F); fo(ctx, t, 'u_chi', 1360, 400, 30, V.chi); fo(ctx, t, 'u_b', 720, 540, 40, V.binet); fo(ctx, t, 'u_10', 1300, 540, 50, V.f10);
      const ka = ap(t, V.axe, 0.8), x = t > V.marche[0] ? posFib(t).x : -1; axeGradue(ctx, FB.X, FB.y, -1, 57, [0, 10, 20, 30, 40, 50], ka, { size: 24 }); for (const v of FIB) if (x >= v - 0.3) { pt(ctx, [FB.X(v), FB.y], { c: C.cours, r: 10 }); txt(ctx, String(v), FB.X(v), FB.y - 26 - (v < 4 ? (v % 2 ? 0 : 26) : 0), { fam: F.main, w: 400, size: 26, c: C.cours }); } });
    legs(ctx, t, V, [['Une fois la matrice diagonalisée, ses puissances se calculent sur la diagonale.'], ['La suite de Fibonacci s’obtient par les puissances d’une matrice de taille 2.'], ['Son polynôme caractéristique a deux racines réelles distinctes : elle est diagonalisable.'], ['Chaque terme est la somme des deux précédents ;', 'la diagonalisation en donne une formule directe.'], ['Le dixième terme vaut 55.']]); }

  // ---------- 7. trigonaliser ; les nilpotents ----------
  function trigo(ctx, t) { const V = S.trigo;
    phase(ctx, t, 46, 50, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 110, 'DÉFINITION', kd); txt(ctx, 'u est trigonalisable s’il existe une base dans laquelle sa matrice est triangulaire supérieure.', CX, 240, { fam: F.ui, w: 600, size: 26, a: kd });
      const kt = ap(t, V.th); carte(ctx, 460, 320, 1000, 130, 'THÉORÈME', kt); formule(ctx, 't_th', CX, 396, { fs: 38, mil: 1, a: kt }); tx(ctx, t, 'Sur le corps des complexes, toute matrice est donc trigonalisable.', CX, 510, V.surC, { c: C.cours, size: 30 });
      fo(ctx, t, 't_tr', CX, 610, 34, V.tr); fo(ctx, t, 't_ex', CX, 710, 30, V.ex); });
    phase(ctx, t, 50, 54, () => { const kd = ap(t, V.nil); carte(ctx, 260, 165, 620, 150, 'DÉFINITION', kd); txt(ctx, 'u est nilpotent :', 440, 262, { fam: F.ui, w: 600, size: 28, a: kd }); formule(ctx, 't_nil', 700, 250, { fs: 44, mil: 1, a: kd });
      const kt = ap(t, V.th7); carte(ctx, 940, 165, 720, 150, 'THÉORÈME', kt); formule(ctx, 't_7', 1220, 250, { fs: 36, mil: 1, a: kt }); formule(ctx, 't_n', 1560, 250, { fs: 36, mil: 1, a: kt });
      fo(ctx, t, 't_J', 520, 520, 44, V.J); const X = [1000, 1220, 1440, 1660], y = 520; fo(ctx, t, 't_e3', X[0], y, 46, V.J); ['t_e2', 't_e1', 't_0'].forEach((id, i) => { const k = ap(t, V.ch[i]); fl(ctx, [X[i] + 50, y], [X[i + 1] - 50, y], { c: C.orange, lw: 4, a: k }); formule(ctx, 't_Jf', (X[i] + X[i + 1]) / 2, y - 32, { fs: 30, mil: 1, a: k }); formule(ctx, id, X[i + 1], y, { fs: 46, mil: 1, a: k }); });
      tx(ctx, t, 'trois crans, puis zéro : l’indice de nilpotence de J vaut 3', 1330, 640, V.ch[2], { c: C.cours, size: 28 }); });
    legs(ctx, t, V, [['À défaut de diagonale, on vise une matrice triangulaire : c’est [trigonaliser].'], ['C’est possible exactement quand le polynôme caractéristique est scindé.'], ['La trace est alors la somme des valeurs propres, et le déterminant leur produit.'], ['Un endomorphisme [nilpotent] s’annule quand on le compose assez de fois avec lui-même.'], ['Sa seule valeur propre est 0, et il s’annule au plus tard à la puissance $n$.'], ['Cette matrice fait descendre chaque vecteur de base d’un cran.']]); }

  const ACTES_DEF = () => [acte(0, S.direction, FG.ech, posCercle, S.direction.sortie), acte(5, S.puissances, FB.ech, posFib, S.puissances.sortie)];
  function vignetteFig(ctx) { const F0 = { c: [1400, 500], u: 96 }; figA(ctx, 1, rad(45), { F: F0, lw: 6 }); const p = pv(Math.cos(rad(60)), Math.sin(rad(60)), F0); K.chienSur(ctx, p[0], p[1] - 2, 0.5, 2.6, { t: 0.3, allure: 'trot', phase: 0.2, face: -1 }); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois théorèmes", ["b_1", "b_2", "b_3"], [32, 32, 30], [580, 580, 600], [["Les valeurs propres :", "les racines du polynôme caractéristique."], ["Diagonalisable : autant de directions", "propres que la multiplicité l’exige."], ["Les puissances", "se calculent sur la diagonale."]], "Réduire : trouver la base où la matrice est {la plus simple}."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 72, w: 800, a: k1 });
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
    txt(ctx, "Éléments propres,", 76, 352, { size: 100, w: 800, align: 'left' }); txt(ctx, "diagonalisation", 76, 506, { size: 100, w: 800, align: 'left' });
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
    direction(ctx, ts); propres(ctx, ts); caract(ctx, ts); diago(ctx, ts); issues(ctx, ts); puissances(ctx, ts); trigo(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
