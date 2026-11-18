  // ---------- 1. les fractions ----------
  function fractions(ctx, t) { const V = S.fractions;
    phase(ctx, t, 2, 6, () => {
      [['f_a1', 380], ['f_a2', 0], ['f_a3', 0]].reduce((x, [id], i) => { const fs = i === 2 ? 60 : 50; formule(ctx, id, x, 310, { fs, mil: 1, align: 'left', a: ap(t, V.a[i]), monte: 1 }); return x + largeur(id, fs) + 18; }, 330);
      [['f_b1'], ['f_b2'], ['f_b3']].reduce((x, [id], i) => { const fs = i === 2 ? 60 : 50; formule(ctx, id, x, 580, { fs, mil: 1, align: 'left', a: ap(t, V.b[i]), monte: 1 }); return x + largeur(id, fs) + 18; }, 330); });
    legs(ctx, t, V, [['Pour additionner deux fractions, on les réduit au même dénominateur,', 'le plus petit possible.'], ['Pour multiplier, on simplifie avant de calculer.']]); }

  // ---------- 2. les puissances ----------
  function puissances(ctx, t) { const V = S.puissances;
    phase(ctx, t, 6, 12, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 190, 'DÉFINITION', kd); formule(ctx, 'p_def', CX, 270, { fs: 44, mil: 1, a: kd });
      ['p_r1', 'p_r2', 'p_r3'].forEach((id, i) => { const k = ap(t, V.regles[i]); cadre(ctx, 440 + i * 520, 480, 470, 130, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); formule(ctx, id, 440 + i * 520, 480, { fs: 46, mil: 1, a: k }); });
      ['p_e1', 'p_e2', 'p_e3'].reduce((x, id, i) => { formule(ctx, id, x, 670, { fs: 46, mil: 1, align: 'left', a: ap(t, V.ex[i]), monte: 1 }); return x + largeur(id, 46) + 18; }, 500); });
    phase(ctx, t, 12, 13, () => { fo(ctx, t, 'p_p1', 640, 420, 80, V.piege[0]); fo(ctx, t, 'p_p2', 1280, 420, 80, V.piege[1]); tx(ctx, t, 'le carré de −3', 640, 540, V.piege[0], { c: C.encre2 }); tx(ctx, t, 'l’opposé du carré de 3', 1280, 540, V.piege[1], { c: C.orange }); });
    phase(ctx, t, 13, 14, () => { fo(ctx, t, 'p_s1', CX, 360, 64, V.sci[0]); fo(ctx, t, 'p_s2', CX, 560, 64, V.sci[1]); });
    legs(ctx, t, V, [['Une [puissance] est un produit de facteurs égaux.'], ['On ajoute les exposants pour un produit, on les retranche pour un quotient.'], ['Les règles s’enchaînent : ici, tout se ramène à une seule puissance de 2.'], ['Sans parenthèses, la puissance ne porte que sur le 3.'], ['L’[écriture scientifique] : un nombre entre 1 et 10, fois une puissance de 10.']]); }

  // ---------- 3. les racines carrées ----------
  const Q3 = { A: [240, 720], B: [560, 400], ech: 3.0 };
  const posDiag = (t) => { const V = S.racines, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { p: [lerp(Q3.A[0], Q3.B[0], k), lerp(Q3.A[1], Q3.B[1], k)], an: t > V.marche[0] && t < V.marche[1] ? -Math.PI / 4 : 0, marche: t > V.marche[0] && t < V.marche[1], assis: t >= V.marche[1] ? doux(pr(t, V.marche[1], 0.4)) : undefined, k }; };
  function racines(ctx, t) { const V = S.racines;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.def); carte(ctx, 460, 165, 1000, 170, 'DÉFINITION', kd); formule(ctx, 'r_def', CX, 262, { fs: 50, mil: 1, a: kd });
      const kp = ap(t, V.prop); carte(ctx, 360, 380, 1200, 170, 'PROPRIÉTÉ', kp); formule(ctx, 'r_p', CX, 478, { fs: 46, mil: 1, a: kp });
      fo(ctx, t, 'r_c1', 600, 660, 50, V.contre[0]); fo(ctx, t, 'r_c2', 1320, 660, 50, V.contre[1]); tx(ctx, t, '≠', CX, 674, V.contre[1], { size: 56, c: C.orange }); });
    phase(ctx, t, 18, 22, () => { const kc = ap(t, V.carre, 0.7), { k } = posDiag(t), [x0, y1] = Q3.A, [x1, y0] = Q3.B;
      ctx.save(); ctx.globalAlpha *= kc; ctx.fillStyle = C.surface; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.strokeStyle = C.gm; ctx.lineWidth = 3.5; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); ctx.restore();
      formule(ctx, 'l_1', (x0 + x1) / 2, y1 + 34, { fs: 40, mil: 1, a: kc }); formule(ctx, 'l_1', x1 + 30, (y0 + y1) / 2, { fs: 40, mil: 1, a: kc });
      seg(ctx, Q3.A, Q3.B, { c: C.cours, lw: 6, k }); fo(ctx, t, 'r_d', 350, 520, 54, V.diag); fo(ctx, t, 'r_py', 400, 300, 40, V.diag);
      fo(ctx, t, 'r_s1', 1300, 360, 52, V.simp[0]); fo(ctx, t, 'r_s2', 1300, 560, 38, V.simp[1]); });
    legs(ctx, t, V, [['La [racine carrée] de $a$ est le nombre positif dont le carré vaut $a$.'], ['Elle se partage sur un produit et sur un quotient…'], ['… mais pas sur une somme : le contre-exemple à retenir.'], ['La diagonale d’un carré de côté 1 mesure racine de 2 : c’est le théorème de Pythagore.'], ['On simplifie une racine en en sortant le plus grand carré parfait.']]); }

  // ---------- 4. les ensembles de nombres ----------
  const BO = [['N', ['0', '17']], ['Z', ['m3', 'm125']], ['D', ['025', 'm175']], ['Q', ['13', '227']], ['R', ['r2', 'pi']]];
  function emboite(ctx, t, V, cx = 600) { const cols = [C.bleu, C.cours, VRAI, C.orange, VIOLET];
    for (let i = 4; i >= 0; i--) { const [n, ex] = BO[i], k = ap(t, V.boites[i]); if (k <= 0) continue; const w = 500 + 100 * i, x = cx - w / 2, y = 585 - 100 * i, h = 80 + 120 * i, ym = y + (i ? 50 : 40);
      ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = C.surface; ctx.strokeStyle = cols[i]; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.stroke(); ctx.restore();
      formule(ctx, 'e_' + n, x + 44, ym, { fs: 40, mil: 1, a: k }); formule(ctx, 'x_' + ex[0], cx - 50, ym, { fs: 36, mil: 1, a: k }); formule(ctx, 'x_' + ex[1], cx + 110, ym, { fs: 36, mil: 1, a: k }); } }
  function ensembles(ctx, t) { const V = S.ensembles;
    phase(ctx, t, 22, 26, () => { emboite(ctx, t, V); fo(ctx, t, 'e_incl', 1440, 250, 48, V.incl); fo(ctx, t, 'e_x1', 1440, 400, 38, V.ex[0]); fo(ctx, t, 'e_x2', 1440, 520, 38, V.ex[1]); fo(ctx, t, 'e_x3', 1440, 650, 34, V.ex[2]); });
    legs(ctx, t, V, [['Entiers naturels, entiers relatifs, décimaux, rationnels, réels :', 'chaque ensemble contient le précédent.'], ['C’est l’écriture simplifiée d’un nombre qui décide de sa place.']]); }

  // ---------- 5. rationnel ou irrationnel ? ----------
  function irrationnel(ctx, t) { const V = S.irrationnel;
    phase(ctx, t, 26, 28, () => { fo(ctx, t, 'i_p', CX, 380, 72, V.per[0]); tx(ctx, t, 'un même bloc de chiffres se répète : l’écriture est périodique', CX, 560, V.per[1], { c: C.cours, size: 34 }); });
    phase(ctx, t, 28, 34, () => { const ke = ap(t, V.enonce); carte(ctx, 610, 165, 700, 150, 'PROPRIÉTÉ', ke); formule(ctx, 'i_th', CX, 250, { fs: 56, mil: 1, a: ke });
      const E = V.etapes, y = 430; fo(ctx, t, 'i_1', 300, y, 50, E[0]); tx(ctx, t, 'fraction irréductible', 300, y + 90, E[0], { c: C.encre2, size: 26 });
      [['i_2', 660, 1], ['i_3', 980, 2], ['i_4', 1300, 3]].forEach(([id, x, i]) => { fo(ctx, t, id, x, y, 50, E[i]); fl(ctx, [x - 200, y], [x - 130, y], { c: C.gm, lw: 3, a: ap(t, E[i]) }); });
      tx(ctx, t, 'a est pair', 980, y + 90, E[2], { c: C.orange, size: 26 }); tx(ctx, t, 'b est pair', 1300, y + 90, E[3], { c: C.orange, size: 26 });
      fl(ctx, [1470, y], [1540, y], { c: C.gm, lw: 3, a: ap(t, E[4]) }); tx(ctx, t, 'a et b divisibles par 2', 1700, y + 10, E[4], { c: C.orange, size: 28 });
      const ka = ap(t, V.absurde); cadre(ctx, CX, 650, 980, 96, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: ka }); txt(ctx, 'La fraction n’était donc pas irréductible : contradiction.', CX, 662, { fam: F.ui, w: 600, size: 32, a: ka }); });
    legs(ctx, t, V, [['L’écriture décimale d’un rationnel s’arrête, ou bien se répète indéfiniment.'], ['Celle de racine de 2 ne fait ni l’un ni l’autre : ce nombre est [irrationnel].'], ['On raisonne par l’absurde : supposons qu’il s’écrive comme une fraction irréductible.'], ['L’hypothèse mène à une contradiction : elle est donc fausse.']]); }

  // ---------- 6. les intervalles ----------
  const X6 = (v) => 960 + v * 150, Y6 = 470;
  function inter6(ctx, y, a, b, fa, fb, c, k, lw = 10) { if (k <= 0) return; const xa = X6(a), xb = Math.min(X6(b), 1830); seg(ctx, [xa, y], [xb, y], { c, lw, k });
    pt(ctx, [xa, y], { c, r: 12, creux: !fa, a: k }); if (b < 20) pt(ctx, [xb, y], { c, r: 12, creux: !fb, a: borne(k * 2 - 1) }); }
  const posX = (t) => { const V = S.intervalles, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])), x = lerp(1, 4, k); return { p: [X6(x), Y6], x, marche: t > V.marche[0] && t < V.marche[1], assis: t >= V.marche[1] ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function intervalles(ctx, t) { const V = S.intervalles;
    phase(ctx, t, 34, 38, () => { ['fermé', 'ouvert', 'semi-ouvert', 'non borné'].forEach((nom, i) => { const k = ap(t, V.tab[i]), y = 250 + i * 120; cadre(ctx, CX, y, 1200, 96, { fill: C.surface, stroke: C.filet, lw: 2, a: k });
      formule(ctx, 'v_n' + (i + 1), 560, y, { fs: 48, mil: 1, a: k }); formule(ctx, 'v_e' + (i + 1), 960, y, { fs: 44, mil: 1, a: k }); txt(ctx, nom, 1380, y + 11, { fam: F.ui, w: 600, size: 30, c: i ? C.encre2 : C.bleu, a: k }); }); });
    phase(ctx, t, 38, 42, () => { const ka = ap(t, V.axe, 0.8), { x } = posX(t); axeGradue(ctx, X6, Y6, -1.5, 5.5, [-1, 0, 1, 2, 3, 4, 5], ka); inter6(ctx, Y6, 1, 4, 1, 1, C.bleu, ka);
      formule(ctx, 'v_14', X6(2.5), Y6 + 110, { fs: 54, mil: 1, a: ka }); const km = ap(t, V.marche[0] - 0.3);
      txt(ctx, `x = ${K.fr(x, 2)}`, X6(0) - 400, 260, { fam: F.ui, w: 600, size: 40, c: C.cours, a: km }); formule(ctx, 'v_x', X6(0) + 60, 250, { fs: 50, mil: 1, a: km });
      tx(ctx, t, 'crochets tournés vers l’intérieur : 1 et 4 appartiennent à l’intervalle', CX, 680, V.borne, { c: C.bleu }); });
    phase(ctx, t, 42, 46, () => { const kI = ap(t, V.I, 0.7), kJ = ap(t, V.J, 0.7), ki = ap(t, V.inter, 0.6), ku = ap(t, V.union, 0.6), X = (v) => 420 + (v + 2) * 110;
      const row = (y, a, b, fa, fb, c, k) => { seg(ctx, [X(a), y], [X(b), y], { c, lw: 10, k }); pt(ctx, [X(a), y], { c, r: 12, creux: !fa, a: k }); pt(ctx, [X(b), y], { c, r: 12, creux: !fb, a: borne(k * 2 - 1) }); };
      row(250, -1, 3, 1, 1, C.bleu, kI); row(330, 1, 5, 0, 1, C.orange, kJ); row(430, 1, 3, 0, 1, C.cours, ki); row(530, -1, 5, 1, 1, VIOLET, ku);
      seg(ctx, [X(-2), 630], [X(6), 630], { c: C.gm, lw: 3, k: kI }); for (let v = -2; v <= 6; v++) { seg(ctx, [X(v), 621], [X(v), 639], { c: C.gm, lw: 3, a: kI }); txt(ctx, K.fr(v, 0), X(v), 676, { fam: F.main, w: 400, size: 28, c: C.encre3, a: kI }); }
      formule(ctx, 'v_I', 1560, 250, { fs: 44, mil: 1, a: kI }); formule(ctx, 'v_J', 1560, 330, { fs: 44, mil: 1, a: kJ }); formule(ctx, 'v_in', 1560, 430, { fs: 46, mil: 1, a: ki }); formule(ctx, 'v_un', 1560, 530, { fs: 46, mil: 1, a: ku }); });
    legs(ctx, t, V, [['Un [intervalle] : tous les réels compris entre deux bornes.'], ['Le crochet est tourné vers l’intérieur quand la borne est comprise, vers l’extérieur sinon.'], ['Le nombre $x$ parcourt l’intervalle, bornes comprises.'], ['Deux intervalles, $I$ et $J$, sur la même droite graduée.'], ['L’[intersection] : les réels qui sont dans $I$ et dans $J$. Elle restreint.'], ['La [réunion] : ceux qui sont dans l’un au moins des deux. Elle élargit.']]); }

  const ACTES_DEF = () => [acte(2, S.racines, Q3.ech, posDiag), acte(5, S.intervalles, 3.0, posX, S.intervalles.sortie)];
  function vignetteFig(ctx) { const A = [1230, 780], B = [1730, 280]; ctx.fillStyle = C.surface; ctx.fillRect(A[0], B[1], 500, 500); ctx.strokeStyle = C.gm; ctx.lineWidth = 5; ctx.strokeRect(A[0], B[1], 500, 500);
    seg(ctx, A, B, { c: C.cours, lw: 9 }); K.chienSur(ctx, 1480, 528, -Math.PI / 4, 4.6, { t: 0.4, allure: 'trot', phase: 1.1 }); formule(ctx, 'r_d', 1620, 600, { fs: 84, mil: 1 }); formule(ctx, 'e_incl', 560, 700, { fs: 58, mil: 1 }); }

