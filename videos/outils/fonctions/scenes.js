  const pente = (R, d) => Math.atan(-d * R.ky / R.kx), incl = (an) => borne(an, -0.85, 0.85);      // le chien ne se penche pas au-delà de 49°                                    // angle à l'écran d'une pente d du repère
  const poly = (ctx, P, fill) => { ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.restore(); };

  // ---------- 1. une limite en l'infini ----------
  const R1 = K.repere({ x: 110, y: 185, w: 1750, h: 535 }, { x0: 0, x1: 14, y0: 0, y1: 6.5 }), f1 = (x) => 2 + 3 / (x - 1), P1 = { x0: 2, x1: 15.6, ech: 3.0, eps: 0.5 };
  const xChien1 = (t) => lerp(P1.x0, P1.x1, pr(t, S.limite.course[0], S.limite.course[1] - S.limite.course[0]));
  function limite(ctx, t) {
    const V = S.limite, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kb = ap(t, V.bande, 0.6), ks = ap(t, V.seuil);
    if (kb > 0) { poly(ctx, [XY(R1, 0, 2 + P1.eps), XY(R1, 14, 2 + P1.eps), XY(R1, 14, 2 - P1.eps), XY(R1, 0, 2 - P1.eps)], `rgba(255,162,74,${0.13 * kb})`);
      if (ks > 0) poly(ctx, [XY(R1, 7, 2 + P1.eps), XY(R1, 14, 2 + P1.eps), XY(R1, 14, 2 - P1.eps), XY(R1, 7, 2 - P1.eps)], `rgba(53,202,164,${0.16 * ks})`);
      K.trait(ctx, R1, 0, 2 + P1.eps, 14, 2 + P1.eps, { c: C.orange, lw: 2, a: kb }); K.trait(ctx, R1, 0, 2 - P1.eps, 14, 2 - P1.eps, { c: C.orange, lw: 2, a: kb }); }
    K.axes(ctx, R1, ap(t, V.axes, 0.8), { gx: [2, 4, 6, 8, 10, 12], gy: [1, 2, 3, 4, 5, 6] });
    K.trait(ctx, R1, 0, 2, 14, 2, { c: C.cours, lw: 3, dash: [12, 10], a: kb });
    const kc = doux(pr(t, V.courbe, 1.3)); K.courbe(ctx, R1, f1, 1.667, lerp(1.667, 14, kc));
    if (ks > 0) { K.trait(ctx, R1, 7, 0, 7, 2 + P1.eps, { c: C.orange, lw: 3, dash: [8, 8], a: ks }); K.point(ctx, R1, 7, f1(7), { k: ks, r: 8, c: C.orange });
      txt(ctx, 'dès que x > 7, f(x) reste dans la bande', R1.X(10.5), R1.Y(1.5) + 46, { fam: F.ui, w: 600, size: 28, c: C.cours, a: ks }); }
    formule(ctx, 'm_f', 1180, 262, { fs: 52, mil: 1, a: ap(t, V.courbe + 0.5), monte: 1 }); formule(ctx, 'm_lim', 1180, 400, { fs: 56, mil: 1, a: ap(t, V.lim), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Que deviennent les valeurs de $f$ quand $x$ devient très grand ?']);
    legende(ctx, t, V.leg[1], ['On choisit un intervalle ouvert autour de 2, aussi étroit que l’on veut.']);
    legende(ctx, t, V.leg[2], ['Dès que $x$ est assez grand, $f(x)$ n’en sort plus :', 'la [limite] de $f$ en plus l’infini est 2.'], { size: 40 });
  }

  // ---------- 2. limites infinies et asymptotes ----------
  const R2 = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -4, x1: 6, y0: -4, y1: 8 });
  function asymptotes(ctx, t) {
    const V = S.asymptotes, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R2, ap(t, V.fig, 0.8), { gx: [-3, -2, -1, 1, 2, 3, 4, 5], gy: [-2, 2, 4, 6], sansO: 1 });
    const kav = ap(t, V.av, 0.6), kah = ap(t, V.ah, 0.6), kc = doux(pr(t, V.courbe, 1.2));
    K.trait(ctx, R2, 1, -4, 1, lerp(-4, 8, kav), { c: C.orange, lw: 3.5, dash: [12, 10], a: kav }); formule(ctx, 'a_x1', R2.X(1) + 62, R2.Y(-3.3), { fs: 36, mil: 1, a: kav });
    K.trait(ctx, R2, -4, 2, lerp(-4, 6, kah), 2, { c: C.cours, lw: 3.5, dash: [12, 10], a: kah }); formule(ctx, 'a_y2', R2.X(-3.2), R2.Y(2) - 30, { fs: 36, mil: 1, a: kah });
    K.courbe(ctx, R2, f1, lerp(0.5, -4, kc), 0.5); K.courbe(ctx, R2, f1, 1.5, lerp(1.5, 6, kc));
    const kd = ap(t, V.droite), kg = ap(t, V.gauche); if (kd > 0) fl(ctx, XY(R2, 1.32, 4.6), XY(R2, 1.32, 7.6), { c: C.orange, lw: 5, k: kd }); if (kg > 0) fl(ctx, XY(R2, 0.68, -0.6), XY(R2, 0.68, -3.6), { c: C.orange, lw: 5, k: kg });
    if (kah > 0 && ap(t, V.pos) > 0) { const kp = ap(t, V.pos); ctx.save(); ctx.globalAlpha *= kp; K.dans(ctx, R2, () => { ctx.fillStyle = 'rgba(53,202,164,0.16)'; ctx.beginPath(); ctx.moveTo(R2.X(1.5), R2.Y(2)); for (let x = 1.5; x <= 6.001; x += 0.05) ctx.lineTo(R2.X(x), R2.Y(f1(x))); ctx.lineTo(R2.X(6), R2.Y(2)); ctx.closePath(); ctx.fill(); }); ctx.restore(); }
    let k = fen(t, L(6) + 0.1, L(10), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'a_f', 1440, 225, { fs: 52, mil: 1, a: ap(t, V.courbe), monte: 1 }); formule(ctx, 'a_d', 1440, 380, { fs: 50, mil: 1, a: kd, monte: 1 }); formule(ctx, 'a_g', 1440, 510, { fs: 50, mil: 1, a: kg, monte: 1 });
      const kv = ap(t, V.av); cadre(ctx, 1440, 660, 640, 96, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kv }); txt(ctx, 'asymptote verticale :', 1350, 672, { fam: F.ui, w: 600, size: 32, a: kv }); formule(ctx, 'a_x1', 1630, 660, { fs: 44, mil: 1, a: kv }); ctx.restore(); }
    k = fen(t, L(10) + 0.1, L(14), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'a_f2', 1440, 225, { fs: 52, mil: 1, a: ap(t, V.autre), monte: 1 }); formule(ctx, 'a_inf', 1440, 370, { fs: 50, mil: 1, a: ap(t, V.inf), monte: 1 });
      cadre(ctx, 1440, 510, 680, 96, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kah }); txt(ctx, 'asymptote horizontale :', 1340, 522, { fam: F.ui, w: 600, size: 32, a: kah }); formule(ctx, 'a_y2', 1650, 510, { fs: 44, mil: 1, a: kah });
      formule(ctx, 'a_pos', 1440, 670, { fs: 40, mil: 1, a: ap(t, V.pos), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quand $x$ s’approche de 1, le dénominateur s’approche de 0.']);
    legende(ctx, t, V.leg[1], ['À droite de 1, les valeurs de $f$ dépassent tout nombre ;', 'à gauche, elles plongent vers moins l’infini.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Limite infinie en un réel : la courbe a une [asymptote verticale].']);
    legende(ctx, t, V.leg[3], ['Une autre écriture de $f(x)$ montre ce qui se passe à l’infini.']);
    legende(ctx, t, V.leg[4], ['Limite finie à l’infini : la courbe a une [asymptote horizontale].']);
    legende(ctx, t, V.leg[5], ['Le signe de la différence dit de quel côté de l’asymptote passe la courbe.']);
  }

  // ---------- 3. formes indéterminées, puis théorème des gendarmes ----------
  const R3 = K.repere({ x: 110, y: 190, w: 880, h: 540 }, { x0: 0, x1: 31, y0: -1.15, y1: 1.15 });
  function indet(ctx, t) {
    const V = S.indet, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(14) + 0.1, L(18), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      txt(ctx, 'FORMES INDÉTERMINÉES', 400, 205, { fam: F.mono, w: 700, size: 20, ls: 3, c: C.orange, a: ap(t, V.fi[0]) });
      ['i_1', 'i_2', 'i_3', 'i_4'].forEach((id, i) => { const kk = ap(t, V.fi[i]), cx = 250 + (i % 2) * 300, cy = 330 + Math.floor(i / 2) * 230; cadre(ctx, cx, cy, 270, 190, { fill: C.surface, stroke: C.filet, lw: 2, a: kk }); formule(ctx, id, cx, cy, { fs: i ? 50 : 36, mil: 1, a: kk }); });
      formule(ctx, 'i_ex', 1330, 240, { fs: 46, mil: 1, a: ap(t, V.ex), monte: 1 }); formule(ctx, 'i_fact', 1330, 430, { fs: 42, mil: 1, a: ap(t, V.fact), monte: 1 }); formule(ctx, 'i_res', 1330, 640, { fs: 42, mil: 1, a: ap(t, V.res), monte: 1 }); ctx.restore(); }
    k = fen(t, L(18) + 0.1, L(22), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kg = doux(pr(t, V.gend, 1.2)), ks = doux(pr(t, V.sinc, 1.6));
      K.axes(ctx, R3, ap(t, V.fig, 0.8), { gx: [10, 20, 30], gy: [-1, 1] });
      K.courbe(ctx, R3, (x) => 1 / x, 0.87, lerp(0.87, 31, kg), { c: VIOLET, lw: 4 }); K.courbe(ctx, R3, (x) => -1 / x, 0.87, lerp(0.87, 31, kg), { c: VIOLET, lw: 4 });
      K.courbe(ctx, R3, (x) => Math.sin(x) / x, 0.9, lerp(0.9, 31, ks), { lw: 5 });
      formule(ctx, 'g_h', R3.X(5.4), R3.Y(0.52), { fs: 34, mil: 1, a: kg }); formule(ctx, 'g_b', R3.X(5.6), R3.Y(-0.52), { fs: 34, mil: 1, a: kg });
      formule(ctx, 'g_enc', 1440, 320, { fs: 52, mil: 1, a: ap(t, V.enc), monte: 1 }); formule(ctx, 'g_lim', 1440, 560, { fs: 56, mil: 1, a: ap(t, V.lim), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quatre cas où les règles de calcul ne permettent pas de conclure :', 'les [formes indéterminées].'], { size: 40 });
    legende(ctx, t, V.leg[1], ['On lève l’indétermination en factorisant par le terme de plus haut degré.']);
    legende(ctx, t, V.leg[2], ['Le sinus n’a pas de limite à l’infini, mais il reste compris entre −1 et 1.']);
    legende(ctx, t, V.leg[3], ['Prise entre deux fonctions de même limite, la troisième les suit :', 'c’est le [théorème des gendarmes].'], { size: 40 });
  }

  // ---------- 4. la dérivée d'une fonction composée ----------
  function composee(ctx, t) {
    const V = S.composee, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kt = ap(t, V.th); carte(ctx, 410, 180, 1100, 190, 'THÉORÈME', kt); formule(ctx, 'k_th', CX, 292, { fs: 56, mil: 1, a: kt });
    const w1 = largeur('k_e1', 44), w2 = largeur('k_r1', 44), x1 = CX - (w1 + w2 + 14) / 2; formule(ctx, 'k_e1', x1, 500, { fs: 44, mil: 1, align: 'left', a: ap(t, V.ex1), monte: 1 }); formule(ctx, 'k_r1', x1 + w1 + 14, 500, { fs: 44, mil: 1, align: 'left', a: ap(t, V.r1), monte: 1 });
    const w3 = largeur('k_e2', 48), w4 = largeur('k_r2', 48), x2 = CX - (w3 + w4 + 14) / 2; formule(ctx, 'k_e2', x2, 650, { fs: 48, mil: 1, align: 'left', a: ap(t, V.ex2), monte: 1 }); formule(ctx, 'k_r2', x2 + w3 + 14, 650, { fs: 48, mil: 1, align: 'left', a: ap(t, V.r2), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['On dérive la fonction extérieure, puis on multiplie par la dérivée de l’intérieur.']);
    legende(ctx, t, V.leg[1], ['L’erreur la plus fréquente est d’oublier ce second facteur, écrit ici en orange.']);
  }

  // ---------- 5. la convexité ----------
  const R5 = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -1.3, x1: 3.3, y0: -2.7, y1: 2.7 }), f5 = (x) => x * x * x - 3 * x * x + 2, d5 = (x) => 3 * x * x - 6 * x, P5 = { x0: -0.9, x1: 2.9, ech: 3.0 };
  const xChien5 = (t) => lerp(P5.x0, P5.x1, pr(t, S.convexe.course[0], S.convexe.course[1] - S.convexe.course[0]));
  function tangente5(ctx, x, a, demi = 190) { const p = XY(R5, x, f5(x)), an = pente(R5, d5(x)), u = [Math.cos(an), Math.sin(an)]; seg(ctx, [p[0] - u[0] * demi, p[1] - u[1] * demi], [p[0] + u[0] * demi, p[1] + u[1] * demi], { c: C.cours, lw: 4.5, a }); }
  function convexe(ctx, t) {
    const V = S.convexe, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R5, ap(t, V.axes, 0.8), { gx: [-1, 1, 2, 3], gy: [-2, -1, 1, 2] });
    const kc = doux(pr(t, V.courbe, 1.3)); K.courbe(ctx, R5, f5, -1.3, lerp(-1.3, 3.3, kc));
    const x = xChien5(t), kt = fen(t, V.atterrit + 0.4, S.CH[4].t1 - 1.5, 0.4); K.dans(ctx, R5, () => tangente5(ctx, x, kt));
    const ki = ap(t, V.inflexion); K.point(ctx, R5, 1, 0, { k: ki, r: 10, c: C.cours }); txt(ctx, 'point d’inflexion', R5.X(0.5), R5.Y(0) + 82, { fam: F.ui, w: 600, size: 26, c: C.cours, a: ki });
    formule(ctx, 'x_f', 1450, 205, { fs: 46, mil: 1, a: ap(t, V.courbe), monte: 1 }); formule(ctx, 'x_d1', 1450, 285, { fs: 44, mil: 1, a: ap(t, V.d1), monte: 1 }); formule(ctx, 'x_d2', 1450, 365, { fs: 44, mil: 1, a: ap(t, V.d2), monte: 1 });
    let k = 1 - ap(t, V.th - 0.3, 0.3);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const k1 = ap(t, V.concave), k2 = ap(t, V.convexe);
      formule(ctx, 'x_neg', 1450, 490, { fs: 40, mil: 1, a: k1, monte: 1 }); txt(ctx, 'concave : la courbe est sous sa tangente', 1450, 552, { fam: F.ui, w: 600, size: 27, c: C.orange, a: k1 });
      formule(ctx, 'x_pos', 1450, 650, { fs: 40, mil: 1, a: k2, monte: 1 }); txt(ctx, 'convexe : la courbe est au-dessus', 1450, 712, { fam: F.ui, w: 600, size: 27, c: C.cours, a: k2 }); ctx.restore(); }
    const kh = ap(t, V.th); carte(ctx, 1100, 450, 700, 270, 'THÉORÈME', kh); formule(ctx, 'x_th1', 1450, 555, { fs: 46, mil: 1, a: kh }); formule(ctx, 'x_th2', 1450, 650, { fs: 46, mil: 1, a: kh });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une fonction est [concave] quand sa courbe est sous ses tangentes,', '[convexe] quand elle est au-dessus.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['La dérivée seconde est négative : la tangente reste au-dessus de la courbe.']);
    legende(ctx, t, V.leg[2], ['Au [point d’inflexion], la courbe traverse sa tangente.']);
    legende(ctx, t, V.leg[3], ['La dérivée seconde est positive : la courbe passe au-dessus de ses tangentes.']);
    legende(ctx, t, V.leg[4], ['Le signe de la dérivée seconde donne la convexité ;', 'là où il change, la courbe a un point d’inflexion.'], { size: 40 });
  }

  // ---------- 6. continuité et valeurs intermédiaires ----------
  const R6a = K.repere({ x: 160, y: 190, w: 700, h: 540 }, { x0: -0.6, x1: 3.6, y0: -0.4, y1: 3.4 }), R6b = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -0.6, x1: 6.6, y0: -2, y1: 7 }), R6c = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -0.25, x1: 1.35, y0: -1.4, y1: 1.7 });
  const g6 = (x) => 0.25 * (x - 1) * (x - 3) * (x - 5) + 2.5, h6 = (x) => x * x * x + x - 1, ALPHA = 0.6823278;
  function tvi(ctx, t) {
    const V = S.tvi, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(34) + 0.1, L(38), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def), ke = ap(t, V.esc, 0.8), ks = ap(t, V.sauts);
      carte(ctx, 1040, 200, 800, 210, 'DÉFINITION', kd); formule(ctx, 't_def', 1440, 318, { fs: 58, mil: 1, a: kd });
      K.axes(ctx, R6a, ke, { gx: [1, 2, 3], gy: [1, 2, 3] });
      for (let n = 0; n < 4; n++) { const kk = borne(ke * 4 - n); if (kk <= 0) continue; const x1 = Math.min(n + 1, 3.6); seg(ctx, XY(R6a, n, n), XY(R6a, x1, n), { c: C.bleu, lw: 6, k: kk }); pt(ctx, XY(R6a, n, n), { c: C.bleu, r: 9, a: kk }); if (n < 3) pt(ctx, XY(R6a, n + 1, n), { c: C.bleu, r: 9, creux: 1, a: kk });
        if (n > 0) seg(ctx, XY(R6a, n, n - 1), XY(R6a, n, n), { c: C.orange, lw: 3, dash: [6, 8], a: ks }); }
      txt(ctx, 'la partie entière', 1440, 560, { fam: F.ui, w: 600, size: 32, c: C.bleu, a: ke }); txt(ctx, 'un saut à chaque entier : elle n’y est pas continue', 1440, 624, { fam: F.ui, w: 500, size: 28, c: C.orange, a: ks }); ctx.restore(); }
    k = fen(t, L(38) + 0.1, L(42), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig, 0.8), kk = ap(t, V.k, 0.7), kt = ap(t, V.th);
      K.axes(ctx, R6b, kf, { gx: [], gy: [], sansO: 1 }); K.courbe(ctx, R6b, g6, 0, lerp(0, 6, doux(pr(t, V.fig + 0.3, 1.3))));
      K.point(ctx, R6b, 0, g6(0), { k: kf, r: 8, c: C.bleu }); K.point(ctx, R6b, 6, g6(6), { k: borne(kf * 2 - 1), r: 8, c: C.bleu });
      K.trait(ctx, R6b, 0, 0, 0, g6(0), { dash: [6, 8], a: kf }); K.trait(ctx, R6b, 6, 0, 6, g6(6), { dash: [6, 8], a: kf }); formule(ctx, 'l_a', R6b.X(0) - 30, R6b.Y(0) - 30, { fs: 38, mil: 1, a: kf }); formule(ctx, 'l_b', R6b.X(6), R6b.Y(0) + 36, { fs: 38, mil: 1, a: kf });
      K.trait(ctx, R6b, -0.6, 2.5, lerp(-0.6, 6.6, kk), 2.5, { c: C.cours, lw: 3.5, dash: [12, 10], a: kk }); formule(ctx, 'l_k', R6b.X(-0.6) + 30, R6b.Y(2.5) - 28, { fs: 40, mil: 1, a: kk });
      [1, 3, 5].forEach((c, i) => { const kc = ap(t, V.c[i]); K.trait(ctx, R6b, c, 2.5, c, 0, { c: C.cours, dash: [6, 8], a: kc }); K.point(ctx, R6b, c, 2.5, { k: kc, r: 10, c: C.cours }); formule(ctx, 'l_c' + (i + 1), R6b.X(c), R6b.Y(0) + 36, { fs: 38, mil: 1, a: kc }); });
      carte(ctx, 1040, 220, 820, 250, 'THÉORÈME', kt); formule(ctx, 't_th1', 1450, 320, { fs: 32, mil: 1, a: kt }); formule(ctx, 't_th2', 1450, 400, { fs: 38, mil: 1, a: kt });
      txt(ctx, 'ici, trois solutions', 1450, 580, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.c[2]) }); ctx.restore(); }
    k = fen(t, L(42) + 0.1, L(46), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig3, 0.8), ku = ap(t, V.unique), k1 = ap(t, V.b1), k2 = ap(t, V.b2);
      K.axes(ctx, R6c, kf, { gx: [1], gy: [-1, 1] }); K.courbe(ctx, R6c, h6, -0.25, lerp(-0.25, 1.3, doux(pr(t, V.fig3 + 0.3, 1.2))));
      K.point(ctx, R6c, ALPHA, 0, { k: ku, r: 10, c: C.cours }); formule(ctx, 'l_al', R6c.X(ALPHA) - 26, R6c.Y(0) - 34, { fs: 44, mil: 1, a: ku });
      K.trait(ctx, R6c, 0.6, 0, 0.6, h6(0.6), { c: C.orange, lw: 4, a: k1 }); K.point(ctx, R6c, 0.6, h6(0.6), { k: k1, r: 7, c: C.orange }); txt(ctx, '0,6', R6c.X(0.6) - 34, R6c.Y(0) + 34, { fam: F.main, w: 400, size: 26, c: C.orange, a: k1 });
      K.trait(ctx, R6c, 0.7, 0, 0.7, h6(0.7), { c: C.orange, lw: 4, a: k2 }); K.point(ctx, R6c, 0.7, h6(0.7), { k: k2, r: 7, c: C.orange }); txt(ctx, '0,7', R6c.X(0.7) + 36, R6c.Y(0) + 34, { fam: F.main, w: 400, size: 26, c: C.orange, a: k2 });
      formule(ctx, 't_f', 1450, 205, { fs: 46, mil: 1, a: kf, monte: 1 }); formule(ctx, 't_der', 1450, 290, { fs: 44, mil: 1, a: ap(t, V.der), monte: 1 });
      cadre(ctx, 1450, 400, 720, 90, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: ku }); formule(ctx, 't_eq', 1210, 400, { fs: 40, mil: 1, a: ku }); txt(ctx, 'a une unique solution', 1500, 411, { fam: F.ui, w: 600, size: 30, a: ku }); formule(ctx, 'l_al', 1760, 402, { fs: 44, mil: 1, a: ku });
      formule(ctx, 't_b1', 1450, 520, { fs: 40, mil: 1, a: k1, monte: 1 }); formule(ctx, 't_b2', 1450, 595, { fs: 40, mil: 1, a: k2, monte: 1 }); formule(ctx, 't_enc', 1450, 700, { fs: 52, mil: 1, a: ap(t, V.enc), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une fonction est [continue] en $a$ quand sa limite en $a$ est $f(a)$.']);
    legende(ctx, t, V.leg[1], ['Sa courbe se trace alors sans lever le crayon : ce n’est pas le cas ici.']);
    legende(ctx, t, V.leg[2], ['Une fonction continue ne passe pas d’une valeur à une autre', 'sans prendre toutes les [valeurs intermédiaires].'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Le théorème affirme qu’une solution existe ; il ne dit ni combien, ni où.']);
    legende(ctx, t, V.leg[4], ['Si de plus la fonction est strictement monotone, la solution est {unique}.']);
    legende(ctx, t, V.leg[5], ['On l’encadre par balayage : la fonction change de signe entre 0,6 et 0,7.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    bilanCartes(ctx, t, 'Trois réflexes', ['b_l', 'b_x', 'b_t'], [44, 52, 52], [540, 540, 540], [['Une limite finie à l’infini :', 'une asymptote horizontale.'], ['Dérivée seconde positive :', 'la fonction est convexe.'], ['Continue, strictement monotone :', 'une solution, et une seule.']],
      'Derrière chaque dérivée, il y a une {limite}.');
  }

