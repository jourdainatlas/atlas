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
