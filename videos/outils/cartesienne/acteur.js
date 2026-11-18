  // Le chien est l'acteur de deux scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 1. les vecteurs — il bondit sous l'écran, retombe du haut sur le point A, parcourt le vecteur jusqu'à B (la flèche
  //    se trace sous ses pattes), puis saute presque à la verticale dans l'herbe et regagne sa place au trot ;
  // 3. l'équation cartésienne — même entrée, sur le point A de la droite ; il est le point M, va jusqu'à (4 ; 0),
  //    revient en A le long du vecteur directeur, puis redescend au jardin d'un saut vertical.
  const AV = S.vecteurs, AC = S.cartes, T1 = S.CH.map((c) => c.t1);
  const X1 = P1.B[0] + 60, X3 = R3.X(1) + 60, tX1 = T1[0] - 1.4, tX3 = T1[2] - 1.4;
  const EN_SCENE = [[AV.bond + 0.2, tX1 + 1.55], [AC.bond + 0.2, tX3 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX1 + 1.55, tX1 + 2.3, X1 / SC, DS[0]], [tX3 + 1.55, tX3 + 2.3, X3 / SC, DS[2]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. le vecteur
    if (!bond(ctx, t, AV.bond, DS[0] * SC, AV.chute[0]) && !chute(ctx, t, AV.chute[0], AV.chute[1], P1.A[0], P1.A[1], P1.ech) && t >= AV.chute[1]) {
      if (t < tX1) { const { k, p } = posV(t), u = t - AV.atterrit, marche = t > AV.marche[0] && t < AV.marche[1];
        K.chienSur(ctx, p[0], p[1], marche ? P1.an : 0, P1.ech, u < 0.35 ? K.poseChoc(t, u) : marche ? trot(t, p[0] * 1.2, P1.ech) : k < 1 ? { t } : assisP(t, doux(pr(t, AV.marche[1], 0.4)), -0.15)); }
      else sautJardin(ctx, t, tX1, P1.B[0], P1.B[1], P1.ech, X1); }
    // 3. le point M de la droite
    const A3 = XY(R3, 1, 2);
    if (!bond(ctx, t, AC.bond, DS[2] * SC, AC.chute[0]) && !chute(ctx, t, AC.chute[0], AC.chute[1], A3[0], A3[1], P3.ech) && t >= AC.chute[1]) {
      if (t < tX3) { const x = xChien3(t), p = XY(R3, x, D3(x)), u = t - AC.atterrit, va = t > AC.va[0] && t < AC.va[1], rev = t > AC.revient[0] && t < AC.revient[1];
        K.chienSur(ctx, p[0], p[1] - 2, va || rev ? P3.an : 0, P3.ech, { ...(u < 0.35 ? K.poseChoc(t, u) : va || rev ? trot(t, p[0] * 1.2, P3.ech) : assisP(t, doux(pr(t, t < AC.revient[0] ? Math.max(AC.va[1], 0) : AC.revient[1], 0.4)) * (t > AC.va[1] ? 1 : 0), -0.15)), face: t >= AC.revient[0] ? -1 : 1 }); }
      else sautJardin(ctx, t, tX3, A3[0], A3[1], P3.ech, X3); }
  }
