  const cell = (ctx, s, x, y, w, h, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; cadre(ctx, x, y, w, h, { fill: o.fill || C.surface, stroke: o.stroke || C.filet, lw: o.lw || 2, r: 8, a }); txt(ctx, s, x, y + (o.size || 28) * 0.36, { fam: F.main, w: 400, size: o.size || 28, c: o.c || C.encre, a }); };

  // ---------- 1. un problème de Sunzi ----------
  function sunzi(ctx, t) { const V = S.sunzi;
    phase(ctx, t, 2, 6, () => { tx(ctx, t, 'Comptés par 3, il en reste 2 ; par 5, il en reste 3 ; par 7, il en reste 2.', CX, 220, V.enonce, { size: 36 }); tx(ctx, t, 'Combien sont-ils ?', CX, 280, V.enonce, { size: 32, c: C.encre2, w: 500 });
      ['s_r1', 's_r2', 's_r3'].forEach((id, i) => fo(ctx, t, id, 480 + i * 480, 420, 44, V.rep)); ['par 3', 'par 5', 'par 7'].forEach((s, i) => tx(ctx, t, s, 480 + i * 480, 360, V.restes[i], { size: 26, c: C.encre2, w: 500 }));
      tx(ctx, t, 'La règle du manuel :', CX, 560, V.regle, { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 's_reg', CX, 640, 46, V.calc); });
    legs(ctx, t, V, [['Un manuel chinois, rédigé entre le troisième et le cinquième siècle, pose ce problème.'], ['Il donne 23, et une règle sans justification : ce chapitre l’explique.']]); }

  // ---------- 2. le groupe Z/nZ et ses générateurs ----------
  const HO = { c: [500, 465], r: 215 }, hp = (k, r = HO.r) => [HO.c[0] + r * Math.sin(k * Math.PI / 6), HO.c[1] - r * Math.cos(k * Math.PI / 6)];
  function etoile(ctx, pas, n, prog, col) { for (let i = 0; i < n; i++) { const k = borne(prog * n - i); if (k > 0) seg(ctx, hp(i * pas), hp((i + 1) * pas), { c: col, lw: 4, k }); } }
  function horloge(ctx, k, marques = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.gl; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(HO.c[0], HO.c[1], HO.r, 0, 6.3); ctx.stroke();
    for (let i = 0; i < 12; i++) { const p = hp(i), q = hp(i, HO.r + 46), m = marques[i]; pt(ctx, p, { c: m || C.gm, r: m ? 11 : 7 }); txt(ctx, String(i), q[0], q[1] + 12, { fam: F.main, w: 400, size: 32, c: m || C.encre }); seg(ctx, [q[0] - 14, q[1] - 16], [q[0] + 14, q[1] - 16], { c: m || C.encre, lw: 2 }); } ctx.restore(); }
  function znz(ctx, t) { const V = S.znz;
    phase(ctx, t, 6, 14, () => { const k5 = pr(t, V.cinq[0], V.cinq[1] - V.cinq[0]), k4 = pr(t, V.quatre[0], V.quatre[1] - V.quatre[0]), a5 = 1 - 0.75 * ap(t, V.quatre[0] - 0.3), M = {};
      if (k4 > 0) [0, 4, 8].forEach((i, j) => { if (k4 * 3 >= j) M[i] = C.orange; });
      ctx.save(); ctx.globalAlpha *= a5; etoile(ctx, 5, 12, k5, C.cours); ctx.restore(); etoile(ctx, 4, 3, k4, C.orange); horloge(ctx, ap(t, V.horloge, 0.8), M);
      fo(ctx, t, 'z_def', 1400, 215, 40, V.def); tx(ctx, t, 'on ajoute 5, encore 5, encore 5…', 1400, 310, V.cinq[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'z_5', 1400, 380, 46, V.v5); tx(ctx, t, 'de 4 en 4', 1400, 470, V.quatre[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'z_4', 1400, 530, 42, V.v4);
      const kp = ap(t, V.prop); cadre(ctx, 1400, 650, 800, 86, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kp }); formule(ctx, 'z_p', 1400, 650, { fs: 36, mil: 1, a: kp }); fo(ctx, t, 'z_g', 1400, 740, 40, V.gens); });
    legs(ctx, t, V, [['Les classes modulo 12 se disposent comme les heures d’une horloge.'], ['En ajoutant 5 indéfiniment, on passe par toutes les classes : 5 est un [générateur].'], ['En ajoutant 4, on tourne en rond sur trois classes seulement.'], ['Tout dépend du PGCD : les générateurs sont les classes des entiers premiers avec 12.']]); }

  // ---------- 3. l'ordre d'un élément ----------
  function ordre(ctx, t) { const V = S.ordre;
    phase(ctx, t, 14, 22, () => { const kd = ap(t, V.def); carte(ctx, 110, 165, 820, 190, 'DÉFINITION', kd); txt(ctx, 'L’ordre de x est le plus petit entier n ⩾ 1 tel que', 520, 246, { fam: F.ui, w: 500, size: 27, a: kd }); formule(ctx, 'o_def', 520, 304, { fs: 44, mil: 1, a: kd });
      [['o_1', 'ordre 3'], ['o_2', 'ordre 4'], ['o_3', 'ordre 12']].forEach(([id, s], i) => { fo(ctx, t, id, 400, 450 + i * 100, 42, V.ex[i]); tx(ctx, t, s, 700, 462 + i * 100, V.ex[i], { c: C.cours, size: 32 }); });
      const kt = ap(t, V.th); carte(ctx, 990, 165, 820, 190, 'THÉORÈME', kt); txt(ctx, 'Dans un groupe fini G,', 1400, 246, { fam: F.ui, w: 500, size: 27, a: kt }); txt(ctx, 'l’ordre de tout élément divise le cardinal de G.', 1400, 296, { fam: F.ui, w: 600, size: 29, a: kt });
      fo(ctx, t, 'o_c', 1400, 460, 60, V.cor); tx(ctx, t, '3, 4 et 12 divisent bien 12', 1400, 540, V.cor, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'o_m', 1400, 660, 40, V.mono); tx(ctx, t, 'un groupe monogène', 1400, 730, V.mono, { size: 26, c: C.encre2, w: 500 }); });
    legs(ctx, t, V, [['L’[ordre] d’un élément est le cardinal du sous-groupe qu’il engendre.'], ['Dans le groupe des classes modulo 12, noté additivement, on compte les additions.'], ['L’ordre divise toujours le cardinal du groupe.'], ['Un groupe engendré par un seul élément est une copie de ℤ, ou d’un ℤ/nℤ.']]); }

  // ---------- 4. les idéaux de Z ----------
  const X4 = (v) => 200 + v * 78, Y4 = 560;
  const posId = (t) => { const V = S.ideaux, k1 = doux(pr(t, V.m1[0], V.m1[1] - V.m1[0])), k2 = doux(pr(t, V.m2[0], V.m2[1] - V.m2[0])), x = lerp(lerp(0, 18, k1), 6, k2), m1 = k1 > 0 && k1 < 1, m2 = k2 > 0 && k2 < 1;
    return { p: [X4(x), Y4], x, k1, k2, marche: m1 || m2, face: m2 || k2 >= 1 ? -1 : 1, assis: k2 >= 1 ? doux(pr(t, V.m2[1], 0.4)) : undefined }; };
  function ideaux(ctx, t) { const V = S.ideaux;
    phase(ctx, t, 22, 26, () => { const kt = ap(t, V.th), c = posId(t); carte(ctx, 110, 165, 760, 150, 'THÉORÈME', kt); txt(ctx, 'Les idéaux de ℤ sont les', 420, 250, { fam: F.ui, w: 600, size: 30, a: kt }); formule(ctx, 'i_n', 680, 238, { fs: 44, mil: 1, a: kt });
      fo(ctx, t, 'i_f', 1400, 240, 54, V.six); axeGradue(ctx, X4, Y4, -1, 20.5, [0, 6, 12, 18], kt); for (let v = 1; v <= 20; v++) if (v % 6) seg(ctx, [X4(v), Y4 - 5], [X4(v), Y4 + 5], { c: C.gl, lw: 2, a: kt });
      if (c.k1 > 0) { seg(ctx, [X4(0), Y4 - 90], [X4(18 * c.k1), Y4 - 90], { c: C.bleu, lw: 6 }); txt(ctx, '+ 18', X4(9), Y4 - 110, { fam: F.ui, w: 600, size: 30, c: C.bleu, a: borne(c.k1 * 3) }); }
      if (c.k2 > 0) { seg(ctx, [X4(18), Y4 - 160], [X4(18 - 12 * c.k2), Y4 - 160], { c: C.orange, lw: 6 }); txt(ctx, '− 12', X4(12), Y4 - 180, { fam: F.ui, w: 600, size: 30, c: C.orange, a: borne(c.k2 * 3) }); }
      pt(ctx, [X4(6), Y4], { c: C.cours, r: 13, a: ap(t, V.six) }); fo(ctx, t, 'i_c', 760, 720, 50, V.six); fo(ctx, t, 'i_p', 1240, 720, 50, V.pgcd); });
    legs(ctx, t, V, [['Un [idéal] de ℤ est l’ensemble des multiples d’un entier.'], ['En combinant 12 et 18, on atteint 6, et rien de plus petit : c’est leur PGCD.']]); }

  // ---------- 5. les inversibles de Z/nZ ----------
  function inversibles(ctx, t) { const V = S.inversibles;
    phase(ctx, t, 26, 34, () => { const kt = ap(t, V.th); carte(ctx, 110, 165, 840, 130, 'THÉORÈME', kt); formule(ctx, 'n_th', 530, 240, { fs: 34, mil: 1, a: kt }); const kc = ap(t, V.corps); carte(ctx, 990, 165, 820, 130, 'COROLLAIRE', kc); formule(ctx, 'n_c', 1400, 240, { fs: 34, mil: 1, a: kc });
      tx(ctx, t, 'L’inverse de 17 modulo 60', 500, 380, V.div[0], { size: 32, c: C.cours }); ['n_d1', 'n_d2', 'n_d3'].forEach((id, i) => fo(ctx, t, id, 500, 460 + i * 80, 42, V.div[i]));
      tx(ctx, t, 'on remonte', 1400, 380, V.rem[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'n_r1', 1400, 460, 42, V.rem[0]); fo(ctx, t, 'n_r2', 1400, 540, 42, V.rem[1]);
      const ki = ap(t, V.inv); cadre(ctx, 1400, 660, 560, 100, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: ki }); formule(ctx, 'n_i', 1400, 660, { fs: 46, mil: 1, a: ki }); fo(ctx, t, 'n_v', 500, 730, 34, V.ver); });
    legs(ctx, t, V, [['Les inversibles de l’anneau sont les générateurs du groupe : même condition.'], ['Quand $n$ est premier, toute classe non nulle est inversible.'], ['Pour calculer un inverse : l’algorithme d’Euclide, puis on remonte les divisions.'], ['La relation de Bézout, lue modulo 60, donne l’inverse.'], ['On vérifie toujours le résultat.']]); }

  // ---------- 6. le théorème chinois, le théorème d'Euler ----------
  function chinois(ctx, t) { const V = S.chinois;
    phase(ctx, t, 34, 40, () => { const kt = ap(t, V.th); carte(ctx, 990, 165, 830, 200, 'THÉORÈME CHINOIS', kt); formule(ctx, 'c_th', 1405, 262, { fs: 32, mil: 1, a: kt }); tx(ctx, t, 'un isomorphisme d’anneaux', 1405, 330, V.th, { size: 24, c: C.encre2, w: 500 });
      const kg = ap(t, V.grille[0] - 0.8), n = 15 * pr(t, V.grille[0], V.grille[1] - V.grille[0]), x0 = 290, y0 = 330, w = 124, h = 104;
      for (let j = 0; j < 5; j++) txt(ctx, String(j), x0 + j * w, y0 - 80, { fam: F.main, w: 400, size: 30, c: C.orange, a: kg }); for (let i = 0; i < 3; i++) txt(ctx, String(i), x0 - 110, y0 + i * h + 10, { fam: F.main, w: 400, size: 30, c: C.bleu, a: kg });
      txt(ctx, 'reste modulo 5', x0 + 2 * w, y0 - 130, { fam: F.ui, w: 500, size: 24, c: C.orange, a: kg }); txt(ctx, 'modulo 3', x0 - 150, y0 + 3 * h + 0, { fam: F.ui, w: 500, size: 24, c: C.bleu, a: kg });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) cell(ctx, '', x0 + j * w, y0 + i * h, w - 10, h - 10, { a: kg }); for (let k = 0; k < 15; k++) { const a = borne(n - k); if (a > 0) cell(ctx, String(k), x0 + (k % 5) * w, y0 + (k % 3) * h, w - 10, h - 10, { a, size: 40, stroke: C.cours, fill: 'rgba(53,202,164,0.14)', lw: 3 }); }
      const kx = ap(t, V.ex); if (kx > 0) cadre(ctx, x0 + 3 * w, y0 + 2 * h, w - 4, h - 4, { stroke: C.orange, fill: 'rgba(0,0,0,0)', lw: 5, r: 10, a: kx });
      fo(ctx, t, 'c_t', 1405, 470, 44, V.grille[0]); tx(ctx, t, 'Chaque case reçoit exactement une classe.', 1405, 585, V.bij, { c: C.cours, size: 32 }); fo(ctx, t, 'c_s', 1405, 680, 34, V.ex); });
    phase(ctx, t, 40, 44, () => { tx(ctx, t, 'D’où viennent 70, 21 et 15 ?', CX, 205, V.dou, { size: 34, c: C.cours });
      [['module 3', 'produit des deux autres : 5 × 7', 'c_a1'], ['module 5', 'produit des deux autres : 3 × 7', 'c_a2'], ['module 7', 'produit des deux autres : 3 × 5', 'c_a3']].forEach(([m, s, id], i) => { const y = 320 + i * 140; tx(ctx, t, m, 300, y + 10, V.a[i], { size: 32 }); tx(ctx, t, s, 300, y + 52, V.a[i], { size: 22, c: C.encre2, w: 500 }); fo(ctx, t, id, 820, y + 18, 42, V.a[i]); });
      fl(ctx, [1075, 338], [1175, 338], { c: C.violet, lw: 3, a: ap(t, V.b[0]) }); tx(ctx, t, 'reste 2 : on multiplie par 2, inverse de 2 modulo 3', 1420, 400, V.b[0], { size: 22, c: C.encre2, w: 500 }); fo(ctx, t, 'c_b1', 1500, 338, 42, V.b[0]);
      tx(ctx, t, 'reste 1 : rien à corriger', 1300, 488, V.b[1], { size: 26, c: C.encre2, w: 500 }); tx(ctx, t, 'reste 1 : rien à corriger', 1300, 628, V.b[2], { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 44, 47, () => { tx(ctx, t, 'Le secret de la règle de Sunzi', CX, 215, V.sun, { size: 34, c: C.cours }); ['c_e1', 'c_e2', 'c_e3'].forEach((id, i) => fo(ctx, t, id, CX, 310 + i * 90, 42, V.e[i])); fo(ctx, t, 'c_x', CX, 650, 44, V.x); });
    phase(ctx, t, 47, 50, () => { fo(ctx, t, 'c_phi', CX, 230, 40, V.phi); const ke = ap(t, V.euler); carte(ctx, 460, 340, 1000, 170, 'THÉORÈME D’EULER', ke); formule(ctx, 'c_eu', CX, 440, { fs: 48, mil: 1, a: ke });
      tx(ctx, t, 'pour n = p premier, le petit théorème de Fermat :', 800, 652, V.fermat, { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'c_fe', 1360, 640, 48, V.fermat); });
    legs(ctx, t, V, [['Quand $m$ et $n$ sont premiers entre eux, connaître une classe modulo $mn$,', 'c’est connaître ses deux restes.'], ['Les classes modulo 15 remplissent le tableau en diagonale, sans jamais se rencontrer.'], ['Se donner un reste modulo 3 et un reste modulo 5, c’est désigner une case :', 'ce système de congruences a une seule solution modulo 15.'], ['Pour chaque module, on part du produit des deux autres,', 'puis on le multiplie pour que son reste soit 1.'], ['Le produit 21 a déjà pour reste 1 modulo 5, et le produit 15 a déjà pour reste 1 modulo 7.'], ['Chacun des nombres 70, 21 et 15 a pour reste 1 modulo un seul module,', 'et 0 modulo les deux autres.'], ['On multiplie 70, 21 et 15 par les restes voulus, puis on ajoute :', 'la somme a les trois bons restes.'], ['Dans le groupe des inversibles, l’ordre de chaque élément divise le cardinal.']]); }

  const ACTES_DEF = () => [acte(3, S.ideaux, 2.6, posId)];
  function vignetteFig(ctx) { const s = { c: HO.c.slice(), r: HO.r }; HO.c = [1440, 520]; HO.r = 230; etoile(ctx, 5, 12, 1, C.cours); horloge(ctx, 1, {}); HO.c = s.c; HO.r = s.r; }

