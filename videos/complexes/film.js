// LE FILM — « Nombres complexes », Terminale Maths expertes, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y parcourt la droite des réels sans trouver de carré négatif, puis il descend au sommet d'une parabole qui ne coupe pas l'axe.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Nombres complexes', NIVEAU = 'TERMINALE MATHS EXPERTES', LONG = 'TERMINALE MATHS EXPERTES · CHAPITRE 2', NB_EXERCICES = 37;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 112, w: 800, a: k1 });
    ligne(ctx, 'Forme algébrique, {conjugué}, équations', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const ligne2 = (ctx, ids, x0, y, fs, A) => { let x = x0; ids.forEach((id, i) => { formule(ctx, id, x, y, { fs, mil: 1, align: 'left', a: A[i], monte: 1 }); x += largeur(id, fs) + 14; }); };
  const centre = (ids, fs) => CX - (ids.reduce((s, id) => s + largeur(id, fs), 0) + 14 * (ids.length - 1)) / 2;

  // ---------- 1. un carré égal à −1 ----------
  const DR = { y: 620, X: (v) => 960 + 250 * v, ech: 2.6 };
  const posDroite = (t) => { const V = S.manque, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-2.5, 2.5, k); return { p: [DR.X(x), DR.y], x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function manque(ctx, t) { const V = S.manque;
    phase(ctx, t, 2, 6, () => { tx(ctx, t, 'Quel nombre a pour carré −1 ?', CX, 215, V.q, { size: 44 }); axeGradue(ctx, DR.X, DR.y, -3.2, 3.2, [-3, -2, -1, 0, 1, 2, 3], ap(t, V.axe, 0.8));
      const km = fen(t, V.marche[0] - 0.3, V.non, 0.3), x = posDroite(t).x; if (km > 0) { txt(ctx, `x = ${K.fr(x, 2)}`, 760, 380, { fam: F.ui, w: 600, size: 44, a: km }); txt(ctx, `x² = ${K.fr(x * x, 2)}`, 1180, 380, { fam: F.ui, w: 600, size: 44, c: VRAI, a: km }); }
      tx(ctx, t, 'Aucun réel : un carré n’est jamais négatif.', 700, 392, V.non, { size: 34, c: C.orange }); tx(ctx, t, 'On introduit', 1250, 392, V.i, { size: 34 }); fo(ctx, t, 'm_i', 1530, 380, 64, V.i); });
    legs(ctx, t, V, [['L’équation $x^2$ = −1 n’a pas de solution réelle.'], ['Sur toute la droite des réels, le carré de $x$ reste positif.'], ['On décide d’ajouter aux réels un nombre nouveau, noté $i$, dont le carré vaut −1.']]); }

  // ---------- 2. l'ensemble des nombres complexes ----------
  function ensemble(ctx, t) { const V = S.ensemble;
    phase(ctx, t, 6, 10, () => { const kp = ap(t, V.prop); carte(ctx, 310, 165, 1300, 560, 'PROPOSITION', kp); txt(ctx, 'Il existe un ensemble, celui des nombres complexes, tel que :', CX, 250, { fam: F.ui, w: 600, size: 30, a: kp });
      [['e_1', 'il contient tous les réels ;'], ['e_2', 'il contient un élément i dont le carré vaut −1 ;'], ['e_3', 'on y additionne et on y multiplie avec les règles des réels ;'], ['e_4', 'tout élément s’écrit ainsi, avec a et b réels.']].forEach(([id, s], i) => { const k = ap(t, V.l[i]), y = 340 + i * 90; formule(ctx, id, 560, y, { fs: 36, mil: 1, a: k }); txt(ctx, s, 760, y + 10, { fam: F.ui, w: 500, size: 26, align: 'left', a: k }); });
      tx(ctx, t, 'Admis ici : construire cet ensemble relève de l’enseignement supérieur.', CX, 690, V.adm, { c: C.encre2, w: 500, size: 24 }); });
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.def); carte(ctx, 460, 165, 1000, 150, 'DÉFINITION', kd); formule(ctx, 'e_def', CX, 250, { fs: 44, mil: 1, a: kd });
      tx(ctx, t, 'partie réelle', 520, 420, V.re, { c: C.bleu }); fo(ctx, t, 'e_re', 800, 408, 42, V.re); tx(ctx, t, 'partie imaginaire', 1180, 420, V.im, { c: C.orange }); fo(ctx, t, 'e_im', 1500, 408, 42, V.im);
      fo(ctx, t, 'e_ex', CX, 550, 42, V.ex); fo(ctx, t, 'e_eg', CX, 690, 36, V.eg); });
    legs(ctx, t, V, [['On appelle cet ensemble l’ensemble des [nombres complexes].'], ['Il contient les réels et le nombre $i$ ; les règles de calcul ne changent pas.'], ['Son existence est admise au lycée.'], ['Cette écriture est la [forme algébrique] du nombre complexe $z$.'], ['Elle fait apparaître la [partie réelle] et la [partie imaginaire] de $z$ : deux nombres réels.'], ['Deux nombres complexes sont égaux quand ils ont', 'même partie réelle et même partie imaginaire.']]); }

  // ---------- 3. calculer avec i ----------
  function calcul(ctx, t) { const V = S.calcul;
    phase(ctx, t, 14, 18, () => { tx(ctx, t, 'On développe comme dans les réels, puis on remplace i² par −1.', CX, 215, V.regle, { size: 34 }); const ids = ['c_p1', 'c_p2']; ligne2(ctx, ids, centre(ids, 46), 360, 46, [ap(t, V.p1), ap(t, V.p2)]);
      const ki = ap(t, V.id); carte(ctx, 310, 490, 1300, 190, 'PROPOSITION', ki); formule(ctx, 'c_i1', 660, 598, { fs: 38, mil: 1, a: ki }); formule(ctx, 'c_i2', 1250, 598, { fs: 38, mil: 1, a: ki }); });
    phase(ctx, t, 18, 22, () => { const kn = ap(t, V.newton); carte(ctx, 460, 165, 1000, 210, 'BINÔME DE NEWTON', kn); formule(ctx, 'c_n', CX, 282, { fs: 40, mil: 1, a: kn });
      const ids = ['c_c1', 'c_c2', 'c_c3']; ligne2(ctx, ids, centre(ids, 42), 540, 42, [ap(t, V.c1), ap(t, V.c2), ap(t, V.c3)]); tx(ctx, t, 'les coefficients 1, 3, 3, 1 du triangle de Pascal', CX, 660, V.c1, { c: C.encre2, w: 500, size: 28 }); });
    legs(ctx, t, V, [['Les règles de calcul sont celles des réels.'], ['Chaque fois que $i^2$ apparaît, on le remplace par −1.'], ['Les identités remarquables changent de visage :', 'un produit devient une somme de deux carrés.'], ['La formule du [binôme de Newton] vaut pour deux nombres complexes.'], ['Les puissances de $i$ se réduisent : $i^2$ vaut −1, et $i^3$ vaut −$i$.']]); }

  // ---------- 4. le conjugué ----------
  function conjugue(ctx, t) { const V = S.conjugue;
    phase(ctx, t, 22, 26, () => { const kd = ap(t, V.def); carte(ctx, 560, 165, 800, 150, 'DÉFINITION', kd); formule(ctx, 'j_def', CX, 250, { fs: 50, mil: 1, a: kd }); fo(ctx, t, 'j_ex', CX, 400, 44, V.ex);
      [['j_1', 520, 550], ['j_2', 1400, 550], ['j_3', 520, 690], ['j_4', 1400, 690]].forEach(([id, x, y], i) => fo(ctx, t, id, x, y, 44, V.p[i])); });
    legs(ctx, t, V, [['Le [conjugué] de $z$ : même partie réelle, partie imaginaire opposée.'], ['La somme d’un nombre et de son conjugué est réelle ; leur différence est imaginaire pure.'], ['Leur produit est un réel positif ; un nombre est réel quand il est égal à son conjugué.']]); }

  // ---------- 5. quotients et conjugaison ----------
  function quotient(ctx, t) { const V = S.quotient;
    phase(ctx, t, 26, 31, () => { tx(ctx, t, 'On multiplie le numérateur et le dénominateur par le conjugué du dénominateur.', CX, 215, V.q[1], { size: 30, c: C.encre2, w: 500 });
      const i1 = ['q_0', 'q_1', 'q_2'], i2 = ['q_3', 'q_4']; ligne2(ctx, i1, centre(i1, 44), 390, 44, [ap(t, V.q[0]), ap(t, V.q[1]), ap(t, V.q[2])]); ligne2(ctx, i2, centre(i2, 50), 600, 50, [ap(t, V.q[3]), ap(t, V.alg)]); });
    phase(ctx, t, 31, 34, () => { const kp = ap(t, V.prop); carte(ctx, 210, 165, 1500, 560, 'PROPOSITION', kp); txt(ctx, 'Le conjugué traverse les opérations :', CX, 250, { fam: F.ui, w: 600, size: 30, a: kp });
      [['q_a', 620, 390], ['q_b', 1300, 390], ['q_c', 620, 590], ['q_d', 1300, 590]].forEach(([id, x, y], i) => fo(ctx, t, id, x, y, 44, V.l[i])); });
    legs(ctx, t, V, [['Comment écrire ce quotient sous forme algébrique ?'], ['Le produit d’un nombre par son conjugué est réel : le $i$ disparaît du dénominateur.'], ['Il reste à développer le numérateur, puis à séparer partie réelle et partie imaginaire.'], ['Le conjugué d’une somme, d’un produit, d’une puissance ou d’un quotient', 'se calcule terme à terme.']]); }

  // ---------- 6. équations et polynômes ----------
  const RP = K.repere({ x: 140, y: 250, w: 760, h: 500 }, { x0: -0.6, x1: 4.6, y0: -0.8, y1: 5.6 }), fp = (x) => x * x - 4 * x + 5;
  const posPara = (t) => { const V = S.equations, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])), x = lerp(3.7, 2, k), m = k > 0 && k < 1; return { p: XY(RP, x, fp(x)), an: m ? borne(Math.atan(-(2 * x - 4) * RP.ky / RP.kx), -0.8, 0.8) : 0, marche: m, face: -1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function equations(ctx, t) { const V = S.equations;
    phase(ctx, t, 34, 37, () => { const kp = ap(t, V.prop); carte(ctx, 210, 165, 1500, 330, 'PROPOSITION', kp); formule(ctx, 'x_eq', CX, 258, { fs: 40, mil: 1, a: kp }); formule(ctx, 'x_cas', CX, 400, { fs: 36, mil: 1, a: ap(t, V.cas) });
      tx(ctx, t, 'Si le discriminant est positif ou nul, les solutions sont celles de la classe de Première.', CX, 620, V.cas, { c: C.encre2, w: 500, size: 28 }); });
    phase(ctx, t, 37, 42, () => { const kf = ap(t, V.fig, 0.9); K.axes(ctx, RP, kf, { gx: [1, 2, 3, 4], gy: [1, 3, 5] }); K.courbe(ctx, RP, fp, -0.1, lerp(-0.1, 4.1, kf)); formule(ctx, 'x_f', RP.X(1.0), RP.Y(5.2), { fs: 32, mil: 1, a: kf });
      const km = ap(t, V.min); K.trait(ctx, RP, 2, 0, 2, 1, { c: C.cours, dash: [6, 8], a: km }); formule(ctx, 'x_S', RP.X(2) + 96, RP.Y(1) + 40, { fs: 32, mil: 1, a: km }); tx(ctx, t, 'le minimum vaut 1 :', RP.X(2), RP.Y(4.2), V.min, { c: C.cours, size: 28 }); tx(ctx, t, 'aucune solution réelle', RP.X(2), RP.Y(3.7), V.min, { c: C.cours, size: 28 });
      fo(ctx, t, 'x_e', 1400, 230, 46, V.ex); fo(ctx, t, 'x_d', 1400, 370, 36, V.delta); fo(ctx, t, 'x_z1', 1400, 510, 38, V.z1); fo(ctx, t, 'x_z2', 1400, 650, 44, V.z2); });
    phase(ctx, t, 42, 46, () => { const kp = ap(t, V.poly); carte(ctx, 360, 165, 1200, 150, 'PROPOSITION', kp); formule(ctx, 'p_th', CX, 250, { fs: 42, mil: 1, a: kp }); fo(ctx, t, 'p_zn', CX, 410, 38, V.zn);
      fo(ctx, t, 'p_e', 520, 560, 40, V.ex3); tx(ctx, t, '1 est une solution évidente', 1160, 572, V.ex3, { c: C.encre2, w: 500 }); fo(ctx, t, 'p_f', CX, 690, 44, V.fac); });
    legs(ctx, t, V, [['Une équation du second degré à coefficients réels a toujours des solutions complexes.'], ['La parabole ne coupe pas l’axe des abscisses…'], ['… son sommet est au-dessus : l’équation n’a pas de solution réelle.'], ['Le discriminant vaut −4 : deux solutions complexes, conjuguées l’une de l’autre.'], ['Si $a$ est une racine d’un polynôme, celui-ci se factorise par $z$ moins $a$.'], ['Une solution évidente ramène une équation de degré 3 à un trinôme.']]); }

  const ACTES_DEF = () => [acte(0, S.manque, DR.ech, posDroite, S.manque.sortie), acte(5, S.equations, 2.8, posPara, S.equations.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1080, y: 250, w: 720, h: 540 }, { x0: -0.4, x1: 4.4, y0: -0.8, y1: 5.4 }); seg(ctx, XY(Rv, -0.4, 0), XY(Rv, 4.4, 0), { c: C.gm, lw: 4 }); K.courbe(ctx, Rv, fp, 0, 4, { lw: 9 }); const p = XY(Rv, 2, 1); K.chienSur(ctx, p[0], p[1] - 4, 0, 4.4, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'm_i', 480, 700, { fs: 110, mil: 1 }); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois réflexes", ["b_i", "b_c", "b_d"], [60, 44, 34], [440, 560, 640], [["Un nombre nouveau,", "des règles de calcul inchangées."], ["Le conjugué,", "pour chasser i d’un dénominateur."], ["Discriminant négatif :", "deux solutions conjuguées."]], "Avec $i$, toute équation du second degré {a des solutions}."); }

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
    txt(ctx, "Nombres", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "complexes", 76, 506, { size: 150, w: 800, align: 'left' });
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
    manque(ctx, ts); ensemble(ctx, ts); calcul(ctx, ts); conjugue(ctx, ts); quotient(ctx, ts); equations(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
