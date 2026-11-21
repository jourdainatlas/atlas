// LE FILM — « Probabilités », Terminale spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y parcourt un chemin de l'arbre du schéma de Bernoulli, puis il dépose trois billes dans cinq tasses.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Probabilités', NIVEAU = 'TERMINALE SPÉCIALITÉ', LONG = 'TERMINALE SPÉCIALITÉ · CHAPITRE 2', NB_EXERCICES = 42;

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
    ligne(ctx, 'Variables aléatoires et {loi binomiale}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const cellule = (ctx, s, x, y, w, h, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; cadre(ctx, x, y, w, h, { fill: o.fill || C.surface, stroke: o.stroke || C.filet, lw: 2, r: 10, a }); if (s) txt(ctx, s, x, y + (o.size || 40) * 0.36, { fam: F.main, w: 400, size: o.size || 40, c: o.c || C.encre, a }); };
  // diagramme en bâtons : X(valeur) en pixels, y0 la ligne de base, H la hauteur d'une probabilité 1
  function batons(ctx, X, y0, H, L3, k, o = {}) { if (k <= 0) return; seg(ctx, [o.x0, y0], [o.x1, y0], { c: C.gm, lw: 3, a: k }); for (const [x, p, c, s] of L3) { seg(ctx, [X(x), y0], [X(x), y0 - H * p], { c: c || C.bleu, lw: o.lw || 14, k }); if (s !== undefined) txt(ctx, s, X(x), y0 + 40, { fam: F.main, w: 400, size: 28, c: C.encre3, a: k }); } }
  const triangle = (ctx, x, y, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.cours; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 20, y + 34); ctx.lineTo(x + 20, y + 34); ctx.closePath(); ctx.fill(); ctx.restore(); };

  // ---------- 1. une variable aléatoire ----------
  const LOI = [[-2, 1 / 2, C.orange, '−2'], [0, 1 / 3, C.gm, '0'], [6, 1 / 6, C.cours, '6']];
  function variable(ctx, t) { const V = S.variable;
    phase(ctx, t, 2, 6, () => { tx(ctx, t, 'Mise : 2 €. Un 6 rapporte 8 € ; un 4 ou un 5 rapporte 2 € ; sinon, rien.', CX, 215, V.jeu, { size: 32 }); tx(ctx, t, 'X : le gain du joueur, mise déduite', CX, 268, V.jeu, { size: 28, c: C.encre2, w: 500 });
      const kf = ap(t, V.faces); [1, 2, 3, 4, 5, 6].forEach((n, i) => { const x = 250 + i * 120; cellule(ctx, String(n), x, 400, 96, 96, { a: kf }); const j = i < 3 ? 0 : i < 5 ? 1 : 2, k = ap(t, V.X[j]); fl(ctx, [x, 460], [x, 520], { c: C.gm, lw: 3, a: k }); formule(ctx, ['x_m2', 'x_0', 'x_6'][j], x, 560, { fs: 44, mil: 1, a: k }); });
      const kd = ap(t, V.def); carte(ctx, 1080, 340, 700, 170, 'DÉFINITION', kd); txt(ctx, 'Une variable aléatoire associe', 1430, 420, { fam: F.ui, w: 600, size: 28, a: kd }); txt(ctx, 'un réel à chaque issue.', 1430, 462, { fam: F.ui, w: 600, size: 28, a: kd });
      const kl = ap(t, V.loi), X = [1160, 1380, 1530, 1680], y1 = 600, y2 = 690; ctx.save(); ctx.globalAlpha *= kl; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(1050, 560, 710, 180); ctx.beginPath(); ctx.moveTo(1050, 640); ctx.lineTo(1760, 640); ctx.moveTo(1290, 560); ctx.lineTo(1290, 740); ctx.stroke(); ctx.restore();
      [['x_xi', 0, y1], ['x_P', 0, y2], ['x_m2', 1, y1], ['x_0', 2, y1], ['x_6', 3, y1], ['x_12', 1, y2], ['x_13', 2, y2], ['x_16', 3, y2]].forEach(([id, i, y]) => formule(ctx, id, X[i], y, { fs: y === y2 && i ? 30 : 36, mil: 1, a: kl })); });
    legs(ctx, t, V, [['Un jeu de fête foraine : on mise, on lance un dé.'], ['À chaque face du dé, on associe le gain du joueur : c’est une [variable aléatoire].'], ['Sa [loi de probabilité] donne la probabilité de chaque valeur : la somme fait 1.']]); }

  // ---------- 2. espérance, variance, écart-type ----------
  const XB = (v) => 300 + 62 * v;
  function esperance(ctx, t) { const V = S.esperance;
    phase(ctx, t, 6, 14, () => { const kf = ap(t, V.fig, 0.8); batons(ctx, XB, 640, 380, LOI, kf, { x0: 130, x1: 740 }); [['x_12', -2, 1 / 2], ['x_13', 0, 1 / 3], ['x_16', 6, 1 / 6]].forEach(([id, x, p]) => formule(ctx, id, XB(x), 640 - 380 * p - 44, { fs: 28, mil: 1, a: kf }));
      const kz = ap(t, V.zero); triangle(ctx, XB(0), 692, kz); formule(ctx, 'e_l', XB(0), 752, { fs: 30, mil: 1, a: kz });
      phase(ctx, t, 6, 10, () => { const kd = ap(t, V.def); carte(ctx, 860, 165, 960, 150, 'DÉFINITION', kd); formule(ctx, 'e_def', 1340, 250, { fs: 40, mil: 1, a: kd }); fo(ctx, t, 'e_c', 1340, 430, 32, V.calc); fo(ctx, t, 'e_0', 1200, 560, 50, V.zero); tx(ctx, t, 'le jeu est équitable', 1520, 572, V.zero, { c: C.cours, size: 32 }); });
      phase(ctx, t, 10, 14, () => { fo(ctx, t, 'v_def', 1340, 215, 34, V.vdef); const kk = ap(t, V.kh); carte(ctx, 960, 300, 760, 140, 'FORMULE DE KÖNIG-HUYGENS', kk); formule(ctx, 'v_kh', 1340, 382, { fs: 40, mil: 1, a: kk });
        fo(ctx, t, 'v_e2', 1340, 520, 28, V.e2); fo(ctx, t, 'v_v', 1130, 640, 40, V.v); fo(ctx, t, 'v_s', 1560, 640, 40, V.sig); }); });
    legs(ctx, t, V, [['Le diagramme en bâtons de la loi de $X$ : la somme des hauteurs vaut 1.'], ['L’[espérance] est la moyenne des valeurs, pondérée par leurs probabilités.'], ['C’est le point d’équilibre du diagramme : ici 0, le jeu est équitable.'], ['La [variance] et l’[écart-type] mesurent la dispersion autour de l’espérance.'], ['En pratique, on calcule l’espérance de $X^2$.'], ['L’écart-type s’exprime en euros : les gains s’écartent de près de 3 euros de la moyenne.']]); }

  // ---------- 3. transformer une variable aléatoire ----------
  function lineaire(ctx, t) { const V = S.lineaire;
    phase(ctx, t, 14, 18, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 1600, 150, 'PROPOSITION', kp); ['l_1', 'l_2', 'l_3'].forEach((id, i) => formule(ctx, id, 460 + i * 500, 250, { fs: 34, mil: 1, a: kp }));
      tx(ctx, t, 'On double les gains, la mise augmente de 1 € :', 760, 432, V.Y, { c: C.encre2, w: 500 }); fo(ctx, t, 'l_Y', 1280, 420, 48, V.Y);
      fo(ctx, t, 'l_e', 430, 590, 40, V.e); fo(ctx, t, 'l_v', 960, 590, 40, V.v); fo(ctx, t, 'l_s', 1500, 590, 40, V.s); tx(ctx, t, 'Le joueur perd en moyenne 1 € par partie.', CX, 710, V.s, { c: C.cours, size: 32 }); });
    legs(ctx, t, V, [['Ajouter une constante déplace la moyenne sans changer la dispersion ;', 'multiplier par $a$ multiplie l’écart-type par la valeur absolue de $a$.'], ['Pour le nouveau gain $Y$, aucun tableau à refaire.']]); }

  // ---------- 4. le schéma de Bernoulli ----------
  const AR = { r: [200, 470], x: [470, 740, 1010], ech: 2.0 };
  const noeud = (s) => { const n = s.length; if (!n) return AR.r; let y = 470, d = 150; for (const c of s) { y += c === 'S' ? -d : d; d /= 2; } return [AR.x[n - 1], y + (n === 3 ? 0 : 0)]; };
  const FEUILLES = ['SSS', 'SSE', 'SES', 'SEE', 'ESS', 'ESE', 'EES', 'EEE'], DEUX = ['SSE', 'SES', 'ESS'];
  function branche(ctx, s, k, o = {}) { const p = noeud(s.slice(0, -1)), q = noeud(s); seg(ctx, p, q, { c: o.c || C.gm, lw: o.lw || 3, k, a: o.a }); }
  const posArbre = (t) => { const V = S.bernoulli, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = 3 * k, i = Math.min(2, Math.floor(s)), f = borne(s - i), ch = 'SSE', p = noeud(ch.slice(0, i)), q = noeud(ch.slice(0, i + 1));
    return { p: k >= 1 ? noeud(ch) : [lerp(p[0], q[0], f), lerp(p[1], q[1], f)], k, an: k > 0 && k < 1 ? Math.atan2(q[1] - p[1], q[0] - p[0]) * 0.8 : 0, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function bernoulli(ctx, t) { const V = S.bernoulli;
    phase(ctx, t, 18, 21, () => { const kd = ap(t, V.def); carte(ctx, 360, 165, 1200, 190, 'DÉFINITION', kd); txt(ctx, 'Une épreuve de Bernoulli n’a que deux issues :', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'le succès, de probabilité p, et l’échec, de probabilité 1 − p.', CX, 298, { fam: F.ui, w: 600, size: 30, a: kd });
      tx(ctx, t, 'X vaut 1 en cas de succès, 0 en cas d’échec :', 620, 512, V.ev, { c: C.encre2, w: 500 }); fo(ctx, t, 'n_ev', 1380, 500, 44, V.ev); });
    phase(ctx, t, 21, 26, () => { const ka = pr(t, V.arbre[0], V.arbre[1] - V.arbre[0]), kc = t > V.marche[0] ? posArbre(t).k : 0, k3 = ap(t, V.trois);
      for (const s of ['S', 'E', 'SS', 'SE', 'ES', 'EE', ...FEUILLES]) branche(ctx, s, borne(ka * 3 - (s.length - 1)));
      ['S', 'SS', 'SSE'].forEach((s, i) => branche(ctx, s, borne(kc * 3 - i), { c: C.cours, lw: 6 })); for (const ch of DEUX.slice(1)) for (let i = 1; i <= 3; i++) branche(ctx, ch.slice(0, i), 1, { c: C.cours, lw: 6, a: k3 });
      const kn = borne(ka * 3 - 2.5); for (const s of ['S', 'E', 'SS', 'SE', 'ES', 'EE']) { const p = noeud(s); ctx.save(); ctx.globalAlpha *= borne(ka * 3 - (s.length - 0.5)); ctx.fillStyle = C.papier; ctx.beginPath(); ctx.arc(p[0], p[1], 22, 0, 6.3); ctx.fill(); ctx.restore(); formule(ctx, s.endsWith('S') ? 'n_S' : 'n_E', p[0], p[1], { fs: 34, mil: 1, a: borne(ka * 3 - (s.length - 0.5)) }); }
      FEUILLES.forEach((s, i) => { const p = noeud(s); formule(ctx, `n_f${i}`, p[0] + 70, p[1], { fs: 30, mil: 1, a: kn * (k3 > 0 && !DEUX.includes(s) ? 1 - 0.6 * k3 : 1) }); });
      formule(ctx, 'n_p', 310, 370, { fs: 32, mil: 1, a: borne(ka * 3) }); formule(ctx, 'n_q', 300, 580, { fs: 32, mil: 1, a: borne(ka * 3) });
      tx(ctx, t, 'un chemin à deux succès :', 1520, 300, V.un, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'n_un', 1520, 370, 34, V.un); tx(ctx, t, 'trois chemins à deux succès :', 1520, 520, V.trois, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'n_3', 1520, 600, 40, V.p2); });
    legs(ctx, t, V, [['Une [épreuve de Bernoulli] : deux issues seulement, le succès et l’échec.'], ['La variable qui vaut 1 pour un succès suit la [loi de Bernoulli] de paramètre $p$.'], ['Un [schéma de Bernoulli] répète la même épreuve, de façon indépendante : ici trois fois.'], ['Le long d’un chemin, les probabilités se multiplient.'], ['Trois chemins comptent exactement deux succès : on ajoute leurs probabilités.']]); }

  // ---------- 5. les combinaisons ----------
  const TA = { x: (i) => 250 + i * 150, y: 640, ech: 2.4 }, CHOIX = [0, 2, 3];
  const posTasses = (t) => { const V = S.combi, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(TA.x(0) - 90, TA.x(4) + 110, k); return { p: [x, TA.y], x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tasse(ctx, x, y, n, bille, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gd; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 44, y - 90); ctx.lineTo(x - 34, y - 4); ctx.lineTo(x + 34, y - 4); ctx.lineTo(x + 44, y - 90); ctx.stroke(); ctx.restore(); txt(ctx, String(n), x, y + 44, { fam: F.main, w: 400, size: 28, c: C.encre3, a }); if (bille > 0) pt(ctx, [x, y - 30 - (1 - bille) * 90], { c: VIOLET, r: 20, a: a * bille }); }
  const COMB = []; for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) for (let c = b + 1; c < 5; c++) COMB.push([a, b, c]);
  const PASCAL = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]];
  function combi(ctx, t) { const V = S.combi;
    phase(ctx, t, 26, 30, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); formule(ctx, 'c_def', 420, 262, { fs: 40, mil: 1, a: kd }); txt(ctx, '« k parmi n » : le nombre de façons de choisir k éléments parmi n,', 1080, 244, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'sans tenir compte de l’ordre.', 1080, 290, { fam: F.ui, w: 600, size: 30, a: kd });
      const kt = ap(t, V.tasses), x = t > V.marche[0] ? posTasses(t).x : -1e9; for (let i = 0; i < 5; i++) tasse(ctx, TA.x(i), TA.y, i + 1, CHOIX.includes(i) ? borne((x - TA.x(i)) / 40) : 0, kt); seg(ctx, [120, TA.y], [1010, TA.y], { c: C.gm, lw: 3, a: kt });
      const g = COMB.length * pr(t, V.grille[0], V.grille[1] - V.grille[0]); COMB.forEach((cb, j) => { const a = borne(g - j), x0 = 1160 + (j % 2) * 330, y0 = 400 + Math.floor(j / 2) * 50; for (let i = 0; i < 5; i++) pt(ctx, [x0 + i * 46, y0], { c: cb.includes(i) ? VIOLET : C.gl, r: cb.includes(i) ? 13 : 8, a }); });
      fo(ctx, t, 'c_53', 1420, 705, 38, V.dix); });
    phase(ctx, t, 30, 34, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 880, 170, 'PROPOSITION', kp); formule(ctx, 'c_sym', 400, 262, { fs: 34, mil: 1, a: kp }); formule(ctx, 'c_pas', 780, 262, { fs: 34, mil: 1, a: kp });
      const n = 6 * pr(t, V.tri[0], V.tri[1] - V.tri[0]), kq = ap(t, V.pascal); PASCAL.forEach((l, i) => l.forEach((v, j) => { const x = 1240 + j * 96, y = 230 + i * 84, sel = (i === 4 && (j === 1 || j === 2)) ? C.orange : (i === 5 && j === 2) ? C.cours : null; cellule(ctx, String(v), x, y, 82, 70, { a: borne(n - i), size: 34, stroke: sel && kq > 0.5 ? sel : C.filet, c: sel && kq > 0.5 ? sel : C.encre }); }));
      tx(ctx, t, 'le triangle de Pascal', 1480, 740, V.tri[0], { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'c_ex', 600, 470, 34, V.pascal); fo(ctx, t, 'c_f', 600, 650, 36, V.fact); });
    legs(ctx, t, V, [['Une [combinaison] : un choix de $k$ éléments parmi $n$, sans ordre.'], ['Trois billes identiques dans cinq tasses, une au plus par tasse : voici une répartition.'], ['En les énumérant toutes, on en trouve dix : c’est « 3 parmi 5 ».'], ['Deux relations : la symétrie, et la relation de Pascal.'], ['Dans le triangle de Pascal, chaque nombre est la somme de celui du dessus et de son voisin de gauche.'], ['Pour de grandes valeurs, une formule avec des factorielles, ou la calculatrice.']]); }

  // ---------- 6. la loi binomiale ----------
  const BIN = [0.2181, 0.3372, 0.2555, 0.1264, 0.0459, 0.0131, 0.0030, 0.0006, 0.0001], XK = (k) => 240 + 78 * k;
  function binomiale(ctx, t) { const V = S.binomiale;
    phase(ctx, t, 34, 38, () => { const kt = ap(t, V.th); carte(ctx, 310, 165, 1300, 200, 'THÉORÈME', kt); formule(ctx, 'b_n', 620, 275, { fs: 38, mil: 1, a: kt }); formule(ctx, 'b_th', 1150, 275, { fs: 44, mil: 1, a: kt });
      [['où placer les k succès parmi les n épreuves ?', VIOLET], ['quelle probabilité pour ces k succès ?', C.bleu], ['quelle probabilité pour les n − k échecs ?', C.orange]].forEach(([s, c], i) => tx(ctx, t, s, CX, 470 + i * 90, V.lec[i], { c, size: 34 })); });
    phase(ctx, t, 38, 42, () => { tx(ctx, t, 'Une usine : 3 % de pièces défectueuses. On prélève un lot de 50 pièces.', CX, 205, V.ex, { size: 32 }); tx(ctx, t, 'X : le nombre de pièces défectueuses du lot', 760, 282, V.ex, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'b_X', 1330, 270, 40, V.ex);
      ['b_0', 'b_1', 'b_2'].forEach((id, i) => fo(ctx, t, id, CX, 385 + i * 105, 36, V.p[i])); fo(ctx, t, 'b_c', CX, 715, 40, V.cum); });
    phase(ctx, t, 42, 46, () => { const kf = ap(t, V.fig, 0.8); batons(ctx, XK, 660, 1000, BIN.map((p, k) => [k, p, C.bleu, String(k)]), kf, { x0: 180, x1: 920, lw: 22 }); const ke = ap(t, V.e); triangle(ctx, XK(1.5), 716, ke); formule(ctx, 'b_l', XK(1.5) + 150, 734, { fs: 30, mil: 1, a: ke });
      fo(ctx, t, 'b_X', 620, 230, 36, V.fig); const kp = ap(t, V.prop); carte(ctx, 1040, 200, 760, 150, 'PROPOSITION', kp); formule(ctx, 'b_p', 1420, 285, { fs: 38, mil: 1, a: kp }); fo(ctx, t, 'b_E', 1420, 470, 40, V.e); fo(ctx, t, 'b_S', 1420, 600, 36, V.s); });
    legs(ctx, t, V, [['$X$ compte les succès d’un schéma de Bernoulli : elle suit la [loi binomiale].'], ['La formule se lit en trois questions.'], ['Les 50 prélèvements sont des épreuves de Bernoulli identiques et indépendantes.'], ['On applique la formule pour 0, 1, puis 2 pièces défectueuses.'], ['« Au plus deux » : on ajoute les trois probabilités.'], ['Le diagramme en bâtons de cette loi : les plus hauts entourent l’espérance.'], ['On attend en moyenne $n$ fois $p$ succès : ici, une pièce et demie par lot.']]); }

  const ACTES_DEF = () => [acte(3, S.bernoulli, AR.ech, posArbre, S.bernoulli.sortie), acte(4, S.combi, TA.ech, posTasses, S.combi.sortie)];
  function vignetteFig(ctx) { const X = (k) => 1060 + 86 * k; batons(ctx, X, 760, 1250, BIN.slice(0, 8).map((p, k) => [k, p, C.bleu, String(k)]), 1, { x0: 1000, x1: 1730, lw: 30 }); K.chienSur(ctx, X(4.6), 756, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_b', 500, 620, { fs: 46, mil: 1 }); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois formules", ["b_e", "b_v", "b_b"], [40, 36, 34], [480, 560, 680], [["L’espérance :", "la moyenne des valeurs, pondérée."], ["La variance,", "par la formule de König-Huygens."], ["La loi binomiale :", "compter les chemins, puis multiplier."]], "Répéter une même épreuve : {tout se ramène à compter}."); }

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
    txt(ctx, "Probabilités", 76, 400, { size: 130, w: 800, align: 'left' });
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
    variable(ctx, ts); esperance(ctx, ts); lineaire(ctx, ts); bernoulli(ctx, ts); combi(ctx, ts); binomiale(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
