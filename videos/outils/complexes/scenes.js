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
