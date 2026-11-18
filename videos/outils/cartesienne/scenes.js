  // ---------- 1. les vecteurs ----------
  const R1 = K.repere({ x: 110, y: 170, w: 860, h: 580 }, { x0: -0.5, x1: 5.5, y0: -0.5, y1: 3.55 }), P1 = { A: XY(R1, 1, 1), B: XY(R1, 4, 3), C: XY(R1, 4, 1), ech: 3.0 };
  P1.an = Math.atan((P1.B[1] - P1.A[1]) / (P1.B[0] - P1.A[0]));
  const posV = (t) => { const V = S.vecteurs, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { k, p: [lerp(P1.A[0], P1.B[0], k), lerp(P1.A[1], P1.B[1], k)] }; };
  function vecteurs(ctx, t) {
    const V = S.vecteurs, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R1, ap(t, V.axes, 0.8), { gx: [1, 2, 3, 4, 5], gy: [1, 2, 3] });
    const kp = ap(t, V.points), { k } = posV(t), kc = ap(t, V.coord), kc2 = ap(t, V.coord + 0.5);
    seg(ctx, P1.A, P1.C, { c: C.orange, lw: 4, dash: [10, 9], k: kc }); seg(ctx, P1.C, P1.B, { c: C.orange, lw: 4, dash: [10, 9], k: kc2 });
    formule(ctx, 'n3', (P1.A[0] + P1.C[0]) / 2, P1.A[1] + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'n2', P1.C[0] + 32, (P1.C[1] + P1.B[1]) / 2, { fs: 38, mil: 1, a: kc2 });
    if (k > 0) fl(ctx, P1.A, P1.B, { c: C.bleu, lw: 6, tp: 22, k });
    pt(ctx, P1.A, { a: kp, r: 8 }); pt(ctx, P1.B, { a: kp, r: 8 }); formule(ctx, 'l_A', P1.A[0] - 30, P1.A[1] + 32, { fs: 40, mil: 1, a: kp }); formule(ctx, 'l_B', P1.B[0] + 40, P1.B[1] + 26, { fs: 40, mil: 1, a: kp });
    const kf = ap(t, V.fleche); formule(ctx, 'v_nom', (P1.A[0] + P1.B[0]) / 2 - 56, (P1.A[1] + P1.B[1]) / 2 - 62, { fs: 44, mil: 1, a: kf, monte: 1 });
    etiq(ctx, 'le vecteur qui mène de A à B', 1440, 200, kc); formule(ctx, 'v_AB', 1440, 290, { fs: 48, mil: 1, a: kc, monte: 1 });
    formule(ctx, 'v_num', 1440, 440, { fs: 48, mil: 1, a: ap(t, V.num), monte: 1 });
    const kn = ap(t, V.norme); etiq(ctx, 'sa norme : la longueur AB', 1440, 560, kn); formule(ctx, 'v_norme', 1440, 640, { fs: 46, mil: 1, a: ap(t, V.val), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Un [vecteur] décrit un déplacement : une direction, un sens, une longueur.']);
    legende(ctx, t, V.leg[1], ['Ses [coordonnées] : la différence des abscisses, puis celle des ordonnées.']);
    legende(ctx, t, V.leg[2], ['Dans un repère orthonormé, le théorème de Pythagore donne sa [norme].']);
  }

  // ---------- 2. colinéarité et déterminant ----------
  const R2 = K.repere({ x: 330, y: 165, w: 350, h: 600 }, { x0: -2, x1: 5, y0: -10, y1: 2 }), O2 = XY(R2, 0, 0);
  function colineaires(ctx, t) {
    const V = S.colineaires, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R2, ap(t, V.fig, 0.8), { gx: [1, 2, 3, 4], gy: [-9, -6, -3], sansO: 1 });
    const ku = ap(t, V.u, 0.6), kv = ap(t, V.v, 0.7), kw = ap(t, V.w, 0.6);
    K.droite(ctx, R2, 0, 0, -3, { c: C.gl, lw: 2.5, dash: [8, 10], a: ap(t, V.ex) });
    if (kv > 0) fl(ctx, O2, XY(R2, 3, -9), { c: C.cours, lw: 9, tp: 24, k: kv }); if (ku > 0) fl(ctx, O2, XY(R2, 1, -3), { c: C.bleu, lw: 5, tp: 18, k: ku }); if (kw > 0) fl(ctx, O2, XY(R2, 2, 1), { c: C.orange, lw: 5, tp: 18, k: kw });
    formule(ctx, 'l_u', R2.X(1) + 40, R2.Y(-3) - 14, { fs: 44, mil: 1, a: ku }); formule(ctx, 'l_v', R2.X(3) + 40, R2.Y(-9) + 4, { fs: 44, mil: 1, a: kv }); formule(ctx, 'l_w', R2.X(2) + 36, R2.Y(1) - 10, { fs: 44, mil: 1, a: kw });
    let k = fen(t, L(6) + 0.1, L(10), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def); carte(ctx, 900, 170, 920, 200, 'DÉFINITION', kd); formule(ctx, 'c_def', 1360, 290, { fs: 60, mil: 1, a: kd });
      formule(ctx, 'c_u', 1180, 480, { fs: 48, mil: 1, a: ku, monte: 1 }); formule(ctx, 'c_v', 1540, 480, { fs: 48, mil: 1, a: kv, monte: 1 }); formule(ctx, 'c_ex', 1360, 660, { fs: 46, mil: 1, a: ap(t, V.ex), monte: 1 }); ctx.restore(); }
    k = fen(t, L(10) + 0.1, L(14), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.det); carte(ctx, 900, 170, 920, 150, 'DÉFINITION', kd); formule(ctx, 'c_det', 1360, 258, { fs: 50, mil: 1, a: kd });
      const w = largeur('c_calc', 38), x0 = 1360 - (w + 16 + largeur('c_zero', 46)) / 2; formule(ctx, 'c_calc', x0, 388, { fs: 38, mil: 1, align: 'left', a: ap(t, V.calc), monte: 1 }); formule(ctx, 'c_zero', x0 + w + 16, 388, { fs: 46, mil: 1, align: 'left', a: ap(t, V.zero), monte: 1 });
      const kp = ap(t, V.prop); carte(ctx, 900, 458, 920, 140, 'PROPRIÉTÉ', kp); formule(ctx, 'c_uv', 1130, 544, { fs: 42, mil: 1, align: 'right', a: kp }); txt(ctx, 'colinéaires', 1242, 556, { fam: F.ui, w: 500, size: 32, a: kp }); formule(ctx, 'c_ssi', 1350, 544, { fs: 42, mil: 1, align: 'left', a: kp });
      formule(ctx, 'c_w', 1360, 690, { fs: 36, mil: 1, a: ap(t, V.contre), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Deux vecteurs sont [colinéaires] quand l’un est un multiple de l’autre :', 'ils ont alors la même direction.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Ici, le second vecteur vaut trois fois le premier :', 'une même droite porte les deux.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Le [déterminant] de deux vecteurs se calcule en croix sur leurs coordonnées.']);
    legende(ctx, t, V.leg[3], ['Deux vecteurs sont colinéaires si, et seulement si, leur déterminant est {nul}.']);
    legende(ctx, t, V.leg[4], ['Un déterminant non nul : ces deux vecteurs ne sont pas colinéaires.']);
  }

  // ---------- 3. l'équation cartésienne ----------
  const R3 = K.repere({ x: 60, y: 170, w: 940, h: 590 }, { x0: -1.6, x1: 5.57, y0: -0.6, y1: 3.9 }), D3 = (x) => (8 - 2 * x) / 3, P3 = { ech: 3.0 };
  P3.an = Math.atan((R3.Y(D3(1)) - R3.Y(D3(0))) / (R3.X(1) - R3.X(0)));
  const xChien3 = (t) => { const V = S.cartes; return t < V.revient[0] ? lerp(1, 4, doux(pr(t, V.va[0], V.va[1] - V.va[0]))) : lerp(4, 1, doux(pr(t, V.revient[0], V.revient[1] - V.revient[0]))); };
  function figDroite(ctx, ka, kd) { K.axes(ctx, R3, ka, { gx: [-1, 1, 2, 3, 4, 5], gy: [1, 2, 3] }); K.droite(ctx, R3, 1, 2, -2 / 3, { c: C.bleu, lw: 5, k: kd }); formule(ctx, 'e_d', R3.X(3.55), R3.Y(2.65), { fs: 42, mil: 1, a: borne(kd * 2 - 1) }); }
  function cartes(ctx, t) {
    const V = S.cartes, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figDroite(ctx, ap(t, V.axes, 0.8), ap(t, V.droite, 0.9));
    const kA = ap(t, V.A), kB = ap(t, V.B), kd = doux(pr(t, V.revient[0], V.revient[1] - V.revient[0]));
    if (kd > 0) fl(ctx, XY(R3, 4, 0), XY(R3, 1, 2), { c: C.cours, lw: 7, tp: 22, k: kd }); formule(ctx, 'l_ud', R3.X(2.75), R3.Y(1.2) + 46, { fs: 42, mil: 1, a: ap(t, V.revient[1]) });
    K.point(ctx, R3, 1, 2, { k: kA, r: 9 }); formule(ctx, 'l_A', R3.X(1) + 26, R3.Y(2) - 34, { fs: 40, mil: 1, a: kA });
    K.point(ctx, R3, 2, 1, { k: kB, r: 9, c: C.orange }); formule(ctx, 'l_Bo', R3.X(2) - 30, R3.Y(1) + 30, { fs: 40, mil: 1, a: kB });
    const kp = ap(t, V.prop); carte(ctx, 1080, 170, 780, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'e_gen', 1470, 258, { fs: 52, mil: 1, a: kp });
    formule(ctx, 'e_A', 1450, 386, { fs: 38, mil: 1, a: kA, monte: 1 }); marque(ctx, 1820, 386, 18, true, ap(t, V.A + 0.3));
    const km = fen(t, V.va[0] - 0.3, V.B - 0.2, 0.35); if (km > 0) { const x = xChien3(t); txt(ctx, `M ( ${K.fr(x, 2)} ; ${K.fr(D3(x), 2)} )`, 1290, 498, { fam: F.ui, w: 600, size: 34, c: C.cours, a: km }); formule(ctx, 'e_M', 1640, 486, { fs: 40, mil: 1, a: km }); }
    formule(ctx, 'e_B', 1450, 486, { fs: 38, mil: 1, a: ap(t, V.Bcalc), monte: 1 }); marque(ctx, 1830, 486, 18, false, ap(t, V.Bcalc + 0.3));
    const ku = ap(t, V.dir); etiq(ctx, 'un vecteur directeur de d', 1470, 590, ku); formule(ctx, 'e_u', 1470, 680, { fs: 46, mil: 1, a: ku, monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Les points d’une droite sont ceux dont les coordonnées vérifient', 'une même égalité : son [équation cartésienne].'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Tant que le point $M$ reste sur la droite, ses coordonnées vérifient l’équation.']);
    legende(ctx, t, V.leg[2], ['Le point $B$ ne vérifie pas l’équation : il n’est pas sur la droite.']);
    legende(ctx, t, V.leg[3], ['Un [vecteur directeur] donne la direction de la droite : il se lit sur l’équation.']);
  }

  // ---------- 4. l'équation réduite ----------
  function reduite(ctx, t) {
    const V = S.reduite, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figDroite(ctx, 1, 1);
    const kp = ap(t, V.p), k1 = ap(t, V.pas, 0.5), k2 = ap(t, V.pas + 0.5, 0.5);
    K.point(ctx, R3, 0, 8 / 3, { k: kp, r: 10, c: C.cours }); formule(ctx, 'l_p', R3.X(0) - 34, R3.Y(8 / 3) + 4, { fs: 44, mil: 1, a: kp });
    seg(ctx, XY(R3, 1, 2), XY(R3, 2, 2), { c: C.orange, lw: 5, k: k1 }); seg(ctx, XY(R3, 2, 2), XY(R3, 2, 4 / 3), { c: VIOLET, lw: 5, k: k2 });
    formule(ctx, 'l_1', R3.X(1.5), R3.Y(2) - 30, { fs: 36, mil: 1, a: k1 }); formule(ctx, 'l_m', R3.X(2) + 34, R3.Y(1.67), { fs: 42, mil: 1, a: k2 });
    formule(ctx, 'r1', 1470, 215, { fs: 44, mil: 1, a: ap(t, V.r1), monte: 1 }); formule(ctx, 'r2', 1470, 295, { fs: 44, mil: 1, a: ap(t, V.r2), monte: 1 }); formule(ctx, 'r3', 1470, 400, { fs: 50, mil: 1, a: ap(t, V.r3), monte: 1 });
    const kg = ap(t, V.gen); carte(ctx, 1080, 480, 780, 140, 'PROPRIÉTÉ', kg); formule(ctx, 'r_gen', 1470, 562, { fs: 52, mil: 1, a: kg });
    const km = ap(t, V.m); etiq(ctx, 'coefficient directeur', 1280, 668, km, { size: 26 }); etiq(ctx, 'ordonnée à l’origine', 1660, 668, kp, { size: 26 }); formule(ctx, 'r_m', 1280, 724, { fs: 40, mil: 1, a: km }); formule(ctx, 'r_p', 1660, 724, { fs: 40, mil: 1, a: kp });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quand le coefficient de $y$ n’est pas nul, on isole $y$ :', 'on obtient l’[équation réduite] de la droite.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Quand on avance de 1, on monte de $m$. Ici $m$ est négatif : la droite descend.']);
  }

  // ---------- 5. deux droites sécantes ----------
  const R5 = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -3.3, x1: 4.7, y0: 0.6, y1: 0.6 + 590 * 8 / 860 });
  function figSecantes(ctx, k1, k2, kI) {
    K.axes(ctx, R5, k1, { gx: [-3, -2, -1, 1, 2, 3, 4], gy: [1, 2, 3, 4, 5], sansO: 1 });
    K.droite(ctx, R5, 1, 3, 0.5, { c: C.bleu, lw: 5, k: k1 }); K.droite(ctx, R5, 1, 3, 2 / 3, { c: C.orange, lw: 5, k: k2 });
    formule(ctx, 'l_d1', R5.X(4.2), R5.Y(4.6) + 40, { fs: 40, mil: 1, a: borne(k1 * 2 - 1) }); formule(ctx, 'l_d2', R5.X(3.6), R5.Y(4.73) - 40, { fs: 40, mil: 1, a: borne(k2 * 2 - 1) });
    K.point(ctx, R5, 1, 3, { k: kI, r: 11, c: C.cours }); formule(ctx, 'l_I', R5.X(1) - 6, R5.Y(3) - 42, { fs: 44, mil: 1, a: kI });
  }
  function secantes(ctx, t) {
    const V = S.secantes, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figSecantes(ctx, ap(t, V.d1, 0.9), ap(t, V.d2, 0.9), ap(t, V.point));
    formule(ctx, 'd_e1', 1440, 200, { fs: 42, mil: 1, a: ap(t, V.d1), monte: 1 }); formule(ctx, 'd_e2', 1440, 262, { fs: 42, mil: 1, a: ap(t, V.d2), monte: 1 });
    formule(ctx, 'sys', 1440, 390, { fs: 46, mil: 1, a: ap(t, V.sys), monte: 1 });
    const kv = ap(t, V.vect); etiq(ctx, 'vecteurs directeurs', 1440, 486, kv, { size: 26 }); formule(ctx, 'd_u', 1440, 556, { fs: 40, mil: 1, a: kv, monte: 1 });
    formule(ctx, 'd_det', 1440, 656, { fs: 34, mil: 1, a: ap(t, V.det), monte: 1 });
    const kn = ap(t, V.verdict); if (kn > 0) { ctx.save(); ctx.translate(1440, 740); ctx.scale(ressort(kn), ressort(kn)); txt(ctx, 'droites sécantes', 0, 0, { size: 50, w: 800, c: C.cours, a: Math.min(1, kn * 2) }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Deux droites, deux équations cartésiennes.']);
    legende(ctx, t, V.leg[1], ['Un point commun vérifie les deux équations à la fois : c’est un [système].']);
    legende(ctx, t, V.leg[2], ['Avant de chercher ce point, on s’assure qu’il existe :', 'les vecteurs directeurs ne sont pas colinéaires.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Les droites se coupent en un seul point $I$ : il reste à le calculer.']);
  }

  // ---------- 6. résoudre le système : substitution, puis combinaison linéaire ----------
  function systeme(ctx, t) {
    const V = S.systeme, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ks = ap(t, V.sys); formule(ctx, 'sys', CX, 215, { fs: 44, mil: 1, a: ks }); formule(ctx, 'E1', CX + 270, 190, { fs: 32, mil: 1, a: ks }); formule(ctx, 'E2', CX + 270, 242, { fs: 32, mil: 1, a: ks });
    txt(ctx, 'Par substitution', 480, 330, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.sub[0] - 0.6) });
    ['s1', 's2', 's3', 's4', 's5'].forEach((id, i) => formule(ctx, id, 480, 400 + i * 68, { fs: i === 3 ? 46 : 40, mil: 1, a: ap(t, V.sub[i]), monte: 1 }));
    txt(ctx, 'Par combinaison linéaire', 1440, 330, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.titre2) });
    ['k1', 'k2', 'k3', 'k4'].forEach((id, i) => formule(ctx, id, 1440, 408 + i * 82, { fs: 40, mil: 1, a: ap(t, V.comb[i]), monte: 1 }));
    seg(ctx, [CX, 320], [CX, 690], { c: C.filet, lw: 2, k: ap(t, V.titre2) });
    const kf = ap(t, V.sol); cadre(ctx, CX, 742, 330, 84, { stroke: C.cours, fill: 'rgba(53,202,164,0.12)', a: kf }); formule(ctx, 'sol', CX, 742, { fs: 50, mil: 1, a: kf });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Par [substitution] : on isole une inconnue dans l’une des équations…']);
    legende(ctx, t, V.leg[1], ['… et l’on remplace cette inconnue par son expression, en violet, dans l’autre.']);
    legende(ctx, t, V.leg[2], ['On reprend l’expression isolée pour obtenir la seconde inconnue.']);
    legende(ctx, t, V.leg[3], ['Par [combinaison linéaire] : on ajoute les équations', 'de façon à éliminer une inconnue.'], { size: 40 });
    legende(ctx, t, V.leg[4], ['Les deux méthodes conduisent au même couple.']);
    legende(ctx, t, V.leg[5], ['Les deux droites se coupent au point de coordonnées {(1 ; 3)}.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    bilanCartes(ctx, t, 'Trois outils', ['b_d', 'b_c', 'b_r'], [36, 42, 46], [600, 500, 500], [['Le déterminant :', 'nul quand les vecteurs sont colinéaires.'], ['L’équation cartésienne :', 'vérifiée par chaque point de la droite.'], ['L’équation réduite :', 'pente et ordonnée à l’origine.']],
      'Chercher un point d’intersection, c’est résoudre un {système}.');
  }

