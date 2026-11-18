  // Le chien est l'acteur de deux scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 1. la limite — il bondit sous l'écran, retombe du haut sur la courbe au point d'abscisse 2, court sur elle vers la
  //    droite, sort par le bord droit de l'écran et rentre au jardin par la droite ;
  // 5. la convexité — même entrée, au point d'abscisse −0,9 ; il parcourt la courbe, la tangente sous ses pattes, puis
  //    redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const AL = S.limite, AX = S.convexe, T1 = S.CH.map((c) => c.t1);
  const X5 = R5.X(P5.x1) + 50, tX5 = T1[4] - 1.4;
  const EN_SCENE = [[AL.bond + 0.2, T1[0] + 1.0], [AX.bond + 0.2, tX5 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => k === 0 ? [T1[0] + 1.0, T1[0] + 2.8, DEHORS, DS[1]] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX5 + 1.55, tX5 + 2.45, X5 / SC, DS[4]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. la course vers l'asymptote
    const p1 = XY(R1, P1.x0, f1(P1.x0));
    if (!bond(ctx, t, AL.bond, DS[0] * SC, AL.chute[0]) && !chute(ctx, t, AL.chute[0], AL.chute[1], p1[0], p1[1], P1.ech) && t >= AL.chute[1] && t < AL.course[1] + 0.1) {
      const x = xChien1(t), p = XY(R1, x, f1(x)), u = t - AL.atterrit, court = t > AL.course[0];
      K.chienSur(ctx, p[0], p[1] - 2, incl(pente(R1, -3 / ((x - 1) * (x - 1)))), P1.ech, u < 0.35 ? K.poseChoc(t, u) : court ? { t, allure: 'galop', phase: p[0] / P1.ech * 0.21 } : { t, tete: 0.1 }); }
    // 5. la tangente sous les pattes
    const p5 = XY(R5, P5.x0, f5(P5.x0));
    if (!bond(ctx, t, AX.bond, DS[4] * SC, AX.chute[0]) && !chute(ctx, t, AX.chute[0], AX.chute[1], p5[0], p5[1], P5.ech) && t >= AX.chute[1]) {
      if (t < tX5) { const x = xChien5(t), p = XY(R5, x, f5(x)), u = t - AX.atterrit, court = t > AX.course[0] && t < AX.course[1];
        K.chienSur(ctx, p[0], p[1] - 2, incl(pente(R5, d5(x))), P5.ech, u < 0.35 ? K.poseChoc(t, u) : court ? trot(t, (t - AX.course[0]) * 150, P5.ech) : t < AX.course[0] ? { t } : assisP(t, doux(pr(t, AX.course[1], 0.4)), -0.1)); }
      else { const p = XY(R5, P5.x1, f5(P5.x1)); sautJardin(ctx, t, tX5, p[0], p[1], P5.ech, X5); } }
  }
