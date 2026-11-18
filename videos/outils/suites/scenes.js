  const un = (n) => 6 - 5 / Math.pow(2, n);
  // nuage des termes d'une suite (points bleus) dans un repère
  function nuage(ctx, R, u, n0, n1, k, o = {}) { for (let n = n0; n <= n1; n++) K.point(ctx, R, n, u(n), { k: borne(k * (n1 - n0 + 3) - (n - n0)), r: o.r || 8, c: o.c || C.bleu }); }

  // ---------- 1. le principe de récurrence ----------
  const DO = { x0: 420, pas: 108, sol: 640, h: 170, w: 28, n: 13, ech: 3.2 };
  function recurrence(ctx, t) { const V = S.recurrence;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.dominos, 0.8); seg(ctx, [120, DO.sol], [1800, DO.sol], { c: C.gl, lw: 3, k: kd });
      for (let i = 0; i < DO.n; i++) { const k = borne(kd * 3 - i * 0.12), an = 1.13 * doux(pr(t, V.pousse + i * 0.2, 0.42)), x = DO.x0 + i * DO.pas; if (k <= 0) continue;
        ctx.save(); ctx.globalAlpha *= k; ctx.translate(x + DO.w / 2, DO.sol); ctx.rotate(i === DO.n - 1 ? an * 1.39 : an); ctx.fillStyle = i ? C.encre : C.cours; ctx.beginPath(); ctx.roundRect(-DO.w, -DO.h, DO.w, DO.h, 5); ctx.fill(); ctx.restore(); }
      tx(ctx, t, 'Initialisation : le premier domino tombe.', CX, 270, V.init, { size: 40, c: C.cours }); tx(ctx, t, 'Hérédité : chaque domino fait tomber le suivant.', CX, 350, V.hered, { size: 40 }); });
    legs(ctx, t, V, [['Démontrer une propriété pour tous les entiers, c’est faire tomber une file infinie de dominos.'], ['Deux étapes suffisent : c’est le [principe de récurrence].']]); }
  const posDomino = (t) => { const V = S.recurrence, k = Math.sin(Math.PI * pr(t, V.pousse - 0.35, 0.8)); return { p: [DO.x0 - 128 + 30 * k, DO.sol], pose: t > V.pousse - 0.35 && t < V.pousse + 0.45 ? { t, tete: 0.1 + 0.5 * k, bas: 0.8 * k } : undefined, assis: t > V.pousse + 0.45 ? doux(pr(t, V.pousse + 0.45, 0.4)) : undefined, tete: 0.1 }; };

  // ---------- 2. rédiger une récurrence ----------
  function rediger(ctx, t) { const V = S.rediger;
    phase(ctx, t, 6, 12, () => { const ke = ap(t, V.enonce); cadre(ctx, CX, 215, 900, 110, { fill: C.surface, stroke: C.filet, lw: 2, a: ke }); formule(ctx, 'r_P', CX, 215, { fs: 44, mil: 1, a: ke });
      tx(ctx, t, 'Initialisation', 330, 372, V.init[0], { c: C.cours, size: 32 }); fo(ctx, t, 'r_i', 900, 360, 42, V.init[0]); marque(ctx, 1210, 360, 18, true, ap(t, V.init[1]));
      tx(ctx, t, 'Hérédité', 330, 512, V.hered[0], { c: C.cours, size: 32 }); tx(ctx, t, 'on suppose P vraie au rang k', 330, 556, V.hered[0], { c: C.orange, size: 24, w: 500 });
      fo(ctx, t, 'r_h1', 1060, 500, 40, V.hered[0]); const w = largeur('r_h2', 40), x0 = 1060 - (w + largeur('r_h3', 44) + 16) / 2; formule(ctx, 'r_h2', x0, 610, { fs: 40, mil: 1, align: 'left', a: ap(t, V.hered[1]), monte: 1 }); formule(ctx, 'r_h3', x0 + w + 16, 610, { fs: 44, mil: 1, align: 'left', a: ap(t, V.hered[2]), monte: 1 });
      tx(ctx, t, 'Conclusion : la propriété est vraie pour tout entier n ⩾ 1.', CX, 730, V.concl, { size: 32 }); });
    phase(ctx, t, 12, 14, () => { fo(ctx, t, 'r_p1', CX, 250, 50, V.piege[0]); fo(ctx, t, 'r_p2', 640, 440, 44, V.piege[1]); tx(ctx, t, 'héréditaire…', 640, 530, V.piege[1], { c: C.cours });
      fo(ctx, t, 'r_p3', 1320, 440, 50, V.piege[2]); tx(ctx, t, '… mais fausse dès le rang 0', 1320, 530, V.piege[2], { c: C.orange }); tx(ctx, t, 'Aucun domino n’est jamais tombé.', CX, 680, V.piege[2] + 0.6, { size: 38 }); });
    legs(ctx, t, V, [['On énonce d’abord clairement la propriété à démontrer.'], ['L’[initialisation] : on vérifie la propriété au premier rang.'], ['L’[hérédité] : on la suppose vraie à un rang $k$, et on la démontre au rang suivant.'], ['On conclut par le principe de récurrence.'], ['Les deux étapes sont indispensables : une hérédité sans initialisation ne démontre rien.']]); }

  // ---------- 3. la limite d'une suite ----------
  const R3 = K.repere({ x: 110, y: 170, w: 890, h: 560 }, { x0: -0.6, x1: 12.6, y0: 0, y1: 7 });
  const posTermes = (t) => { const V = S.limite, s = 5 * pr(t, V.marche[0], V.marche[1] - V.marche[0]), i = Math.min(4, Math.floor(s)), k = s - i, a = XY(R3, i, un(i)), b = XY(R3, i + 1, un(i + 1)), m = s > 0 && s < 5;
    return { p: [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], an: m ? borne(Math.atan((b[1] - a[1]) / (b[0] - a[0])), -0.8, 0.8) : 0, marche: m, assis: s >= 5 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figU(ctx, t, kf, e, ke, N0) { if (ke > 0) { ctx.save(); ctx.globalAlpha *= ke; ctx.fillStyle = 'rgba(255,162,74,0.20)'; ctx.fillRect(R3.b.x, R3.Y(6 + e), R3.b.w, R3.Y(6 - e) - R3.Y(6 + e)); ctx.restore(); if (N0) K.trait(ctx, R3, N0, 0, N0, 6 + e, { c: C.orange, lw: 3, dash: [8, 8], a: ke }); }
    K.axes(ctx, R3, kf, { gx: [2, 4, 6, 8, 10, 12], gy: [1, 2, 3, 4, 5, 6] }); K.trait(ctx, R3, -0.6, 6, 12.6, 6, { c: C.cours, lw: 3, dash: [12, 10], a: kf }); formule(ctx, 'l_6', R3.X(11.6), R3.Y(6) - 28, { fs: 34, mil: 1, a: kf }); nuage(ctx, R3, un, 0, 12, kf); }
  function limite(ctx, t) { const V = S.limite;
    phase(ctx, t, 14, 22, () => { const e = lerp(0.5, 0.1, doux(pr(t, V.bande[1], 0.8))), k2 = t >= V.bande[1] + 0.8;
      figU(ctx, t, ap(t, V.fig, 0.9), e, ap(t, V.bande[0], 0.6), t >= V.rang[1] ? 6 : t >= V.rang[0] && t < V.bande[1] ? 4 : 0);
      fo(ctx, t, 'l_u', 1450, 215, 44, V.fig); const kd = ap(t, V.def); carte(ctx, 1040, 300, 830, 160, 'DÉFINITION', kd); formule(ctx, 'l_def', 1455, 394, { fs: 30, mil: 1, a: kd });
      const kb = ap(t, V.bande[0]); txt(ctx, `ε = ${K.fr(e, 2)}`, 1280, 560, { fam: F.ui, w: 600, size: 44, c: C.orange, a: kb });
      tx(ctx, t, 'N = 4', 1620, 560, V.rang[0], { size: 44, c: C.cours, a: ap(t, V.rang[0]) * (t < V.bande[1] ? 1 : 0) }); tx(ctx, t, 'N = 6', 1620, 560, V.rang[1], { size: 44, c: C.cours });
      tx(ctx, t, 'À partir du rang N, tous les termes sont dans la bande.', 1455, 680, V.rang[0], { size: 28, c: C.encre2 }); });
    legs(ctx, t, V, [['Une suite définie par récurrence : chaque terme se calcule à partir du précédent.'], ['Ses termes montent vers 6, sans jamais l’atteindre.'], ['On choisit un intervalle ouvert autour de 6 : à partir d’un certain rang, tous les termes y sont.'], ['Si c’est vrai aussi étroit que soit l’intervalle, la suite [converge] vers 6.']]); }

  // ---------- 4. lever une indétermination ----------
  function operations(ctx, t) { const V = S.operations;
    phase(ctx, t, 22, 26, () => { fo(ctx, t, 'o_e', 760, 260, 54, V.ex); const kf = ap(t, V.fi); cadre(ctx, 1280, 260, 250, 150, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kf }); formule(ctx, 'o_fi', 1280, 260, { fs: 50, mil: 1, a: kf });
      tx(ctx, t, 'forme indéterminée', 1280, 372, V.fi, { c: C.orange, size: 26 }); fo(ctx, t, 'o_f', CX, 510, 44, V.fact); fo(ctx, t, 'o_r', CX, 700, 54, V.res); });
    legs(ctx, t, V, [['Numérateur et dénominateur tendent vers l’infini : les règles de calcul ne concluent pas.'], ['On factorise par le terme dominant : il ne reste que des limites connues.']]); }

  // ---------- 5. deux théorèmes de convergence ----------
  const R5 = K.repere({ x: 110, y: 330, w: 890, h: 400 }, { x0: 0, x1: 41, y0: -1.1, y1: 1.1 }), vn = (n) => Math.sin(n) / n;
  function theoremes(ctx, t) { const V = S.theoremes;
    phase(ctx, t, 26, 30, () => { const kg = ap(t, V.gend); carte(ctx, 210, 165, 1500, 130, 'THÉORÈME DES GENDARMES', kg); formule(ctx, 'g_th', 840, 240, { fs: 36, mil: 1, a: kg }); tx(ctx, t, '⟹', 1340, 252, V.gend, { size: 36 }); formule(ctx, 'g_c', 1520, 240, { fs: 40, mil: 1, a: kg });
      const kf = ap(t, V.fig, 0.9); K.axes(ctx, R5, kf, { gx: [10, 20, 30, 40], gy: [-1, 1] }); K.courbe(ctx, R5, (x) => 1 / x, 0.92, lerp(0.92, 41, kf), { c: VIOLET, lw: 3.5 }); K.courbe(ctx, R5, (x) => -1 / x, 0.92, lerp(0.92, 41, kf), { c: VIOLET, lw: 3.5 }); nuage(ctx, R5, vn, 1, 40, kf, { r: 6 });
      fo(ctx, t, 'g_enc', 1450, 440, 48, V.enc); fo(ctx, t, 'g_lim', 1450, 630, 52, V.lim); });
    phase(ctx, t, 30, 34, () => { const km = ap(t, V.mono); carte(ctx, 1040, 170, 830, 190, 'THÉORÈME', km); txt(ctx, 'Une suite croissante et majorée', 1455, 250, { fam: F.ui, w: 600, size: 32, a: km }); txt(ctx, 'converge.', 1455, 302, { fam: F.ui, w: 600, size: 36, c: C.cours, a: km });
      figU(ctx, t, ap(t, V.fig2, 0.9), 0, 0, 0); tx(ctx, t, 'Il affirme que la limite existe, sans la donner.', 1455, 440, V.fig2, { size: 28, c: C.encre2 }); fo(ctx, t, 'm_ell', 1455, 560, 40, V.ell); fo(ctx, t, 'l_lim', 1455, 690, 50, V.six); });
    legs(ctx, t, V, [['Une suite prise entre deux suites de même limite a cette limite.'], ['Le sinus reste entre −1 et 1 : les deux gendarmes tendent vers 0.'], ['La suite de tout à l’heure est croissante et majorée par 6 : elle converge.'], ['Pour trouver sa limite, on passe à la limite dans la relation de récurrence.']]); }

  // ---------- 6. les suites géométriques ----------
  function geometriques(ctx, t) { const V = S.geometriques, CAS = [[1.3, 'q_1', 'vers plus l’infini', C.orange], [0.8, 'q_2', 'vers 0', C.cours], [-0.8, 'q_3', 'vers 0, en alternant', C.cours], [-1.2, 'q_4', 'pas de limite', C.orange]];
    phase(ctx, t, 34, 40, () => { CAS.forEach(([q, id, s, c], i) => { const k = ap(t, V.cas[i], 0.8), x = 130 + i * 440, neg = q < 0, R = K.repere({ x, y: 250, w: 380, h: 340 }, { x0: -0.5, x1: 10.5, y0: q < -1 ? -6.5 : neg ? -1.1 : 0, y1: q < -1 ? 6.5 : q > 1 ? 14 : 1.1 }); if (k <= 0) return;
        formule(ctx, id, x + 190, 205, { fs: 40, mil: 1, a: k }); seg(ctx, XY(R, -0.5, 0), XY(R, 10.5, 0), { c: C.gm, lw: 2.5, k }); K.dans(ctx, R, () => nuage(ctx, R, (n) => Math.pow(q, n), 0, 10, k, { r: 7 })); txt(ctx, s, x + 190, 650, { fam: F.ui, w: 600, size: 28, c, a: k }); }); });
    phase(ctx, t, 40, 46, () => { const kp = ap(t, V.prop); carte(ctx, 260, 165, 1400, 210, 'PROPRIÉTÉ', kp);
      [['q_4', 520], ['q_m', 960], ['q_1', 1400]].forEach(([id, x]) => formule(ctx, id, x, 250, { fs: 38, mil: 1, a: kp })); txt(ctx, 'pas de limite', 520, 322, { fam: F.ui, w: 600, size: 30, c: C.orange, a: kp }); formule(ctx, 'q_r2', 960, 318, { fs: 34, mil: 1, a: kp }); formule(ctx, 'q_r1', 1400, 318, { fs: 34, mil: 1, a: kp });
      fo(ctx, t, 'q_b', CX, 470, 42, V.bern); tx(ctx, t, 'l’inégalité de Bernoulli, démontrée par récurrence, donne le cas q > 1', CX, 540, V.bern, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'q_e', 620, 680, 48, V.ex); fo(ctx, t, 'q_er', 1300, 680, 40, V.res); });
    legs(ctx, t, V, [['Une suite géométrique de raison plus grande que 1 dépasse tout nombre.'], ['Si la raison est entre 0 et 1, les termes s’écrasent sur 0.'], ['Entre −1 et 0, ils changent de signe à chaque rang, mais tendent encore vers 0.'], ['Au-delà de −1, ils s’écartent en alternant : la suite n’a pas de limite.'], ['Tout dépend de la raison $q$.'], ['Le premier cas repose sur une inégalité que l’on démontre par récurrence.'], ['Ici la raison vaut 0,8 : la suite tend vers 0.']]); }

  const ACTES_DEF = () => [acte(0, S.recurrence, DO.ech, posDomino), acte(2, S.limite, 2.6, posTermes, S.limite.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1000, y: 250, w: 860, h: 520 }, { x0: -0.6, x1: 9.6, y0: 0, y1: 7 }); seg(ctx, XY(Rv, -0.6, 6), XY(Rv, 9.6, 6), { c: C.cours, lw: 5, dash: [16, 14] }); for (let n = 0; n <= 9; n++) pt(ctx, XY(Rv, n, un(n)), { c: C.bleu, r: 13 });
    const a = XY(Rv, 2, un(2)); K.chienSur(ctx, a[0], a[1] - 14, -0.35, 4.4, { t: 0.4, allure: 'trot', phase: 1.1 }); formule(ctx, 'b_l', 500, 700, { fs: 80, mil: 1 }); }

