  function ovale(ctx, cx, cy, rx, ry, a, id) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.fillStyle = C.surface; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3); ctx.fill(); ctx.stroke(); ctx.restore(); if (id) formule(ctx, id, cx, cy - ry - 28, { fs: 32, mil: 1, a }); }
  const colonne = (cx, cy, n, pas) => Array.from({ length: n }, (_, i) => [cx, cy + (i - (n - 1) / 2) * pas]);
  const enclos = (ctx, P, c, a) => { if (a <= 0) return; const ys = P.map((p) => p[1]), y0 = Math.min(...ys) - 24, y1 = Math.max(...ys) + 24; cadre(ctx, P[0][0], (y0 + y1) / 2, 64, y1 - y0, { stroke: c, fill: 'rgba(0,0,0,0)', lw: 4, r: 28, a }); };
  const rond = (ctx, p, c, a, r = 24) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.3); ctx.stroke(); ctx.restore(); };

  // ---------- 1. de la formule à la correspondance ----------
  function histoire(ctx, t) { const V = S.histoire;
    phase(ctx, t, 2, 6, () => { seg(ctx, [240, 400], [1680, 400], { c: C.gm, lw: 3, k: pr(t, V.d[0] - 0.4, 2) });
      [['1748', 'Euler', 'une fonction est', 'une formule'], ['1837', 'Dirichlet', 'toute correspondance,', 'avec ou sans formule'], ['1888', 'Dedekind', 'l’application, entre', 'ensembles quelconques'], ['1891', 'Cantor', 'l’argument', 'diagonal']].forEach(([an, nom, l1, l2], i) => { const k = ap(t, V.d[i]), x = 380 + i * 390; pt(ctx, [x, 400], { c: C.cours, r: 11, a: k });
        txt(ctx, an, x, 350, { fam: F.mono, w: 500, size: 40, c: C.cours, a: k }); txt(ctx, nom, x, 480, { size: 44, w: 700, a: k }); txt(ctx, l1, x, 550, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); txt(ctx, l2, x, 588, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); }); });
    legs(ctx, t, V, [['Pour Euler, une fonction est une expression analytique : une formule.'], ['Dirichlet appelle fonction toute correspondance, qu’une formule la décrive ou non.'], ['Dedekind fait de l’application un objet de base ; Cantor démontre', 'qu’aucun ensemble n’est en bijection avec l’ensemble de ses parties.']]); }

  // ---------- 2. image directe, image réciproque ----------
  const FL5 = [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]];
  function panneau(ctx, cx, ko, o) { const E = colonne(cx - 150, 520, 5, 58), Fp = colonne(cx + 150, 520, 4, 58); ovale(ctx, cx - 150, 520, 66, 172, ko, 'l_E'); ovale(ctx, cx + 150, 520, 66, 172, ko, 'l_F');
    FL5.forEach(([i, j]) => fl(ctx, [E[i][0] + 14, E[i][1]], [Fp[j][0] - 16, Fp[j][1]], { c: o.sel(i, j) ? o.c : C.gl, lw: 3, a: ko })); for (const p of [...E, ...Fp]) pt(ctx, p, { r: 8, a: ko }); return [E, Fp]; }
  function imagesP(ctx, t) { const V = S.imagesP;
    phase(ctx, t, 6, 10, () => { const kA = ap(t, V.A), kfA = ap(t, V.fA), kB = ap(t, V.B), kfB = ap(t, V.fB); fo(ctx, t, 'm_d', 500, 230, 36, V.dir); fo(ctx, t, 'm_r', 1420, 230, 36, V.rec);
      const [E1, F1] = panneau(ctx, 500, ap(t, V.dir), { c: C.bleu, sel: (i) => kA > 0.5 && i < 3 }); enclos(ctx, E1.slice(0, 3), C.bleu, kA); formule(ctx, 'l_A', E1[0][0] - 80, E1[1][1], { fs: 34, mil: 1, a: kA }); enclos(ctx, F1.slice(0, 2), C.cours, kfA); formule(ctx, 'l_fA', F1[0][0] + 110, (F1[0][1] + F1[1][1]) / 2, { fs: 34, mil: 1, a: kfA });
      const [E2, F2] = panneau(ctx, 1420, ap(t, V.rec), { c: VIOLET, sel: (i, j) => kfB > 0.5 && j >= 1 }); enclos(ctx, F2.slice(1), C.orange, kB); formule(ctx, 'l_B', F2[0][0] + 80, F2[2][1], { fs: 34, mil: 1, a: kB }); enclos(ctx, E2.slice(2), VIOLET, kfB); formule(ctx, 'l_fB', E2[0][0] - 120, E2[3][1], { fs: 34, mil: 1, a: kfB }); });
    phase(ctx, t, 10, 14, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 1600, 290, 'PROPOSITION', kp); [['p_1', 440, 250], ['p_2', 960, 250], ['p_3', 1470, 250]].forEach(([id, x, y]) => formule(ctx, id, x, y, { fs: 28, mil: 1, a: ap(t, V.l[0]) }));
      formule(ctx, 'p_4', 620, 370, { fs: 34, mil: 1, a: ap(t, V.l[1]) }); formule(ctx, 'p_5', 1300, 370, { fs: 34, mil: 1, a: ap(t, V.l[2]) });
      fo(ctx, t, 'p_c1', CX, 550, 36, V.ce[0]); fo(ctx, t, 'p_c2', 620, 680, 40, V.ce[1]); fo(ctx, t, 'p_c3', 1300, 680, 40, V.ce[2]); });
    legs(ctx, t, V, [['L’[image directe] de $A$ : les extrémités des flèches issues de $A$.'], ['L’[image réciproque] de $B$ : les origines des flèches qui aboutissent dans $B$.'], ['L’image réciproque respecte toutes les opérations.'], ['L’image directe respecte la réunion ; pour l’intersection, elle ne donne qu’une inclusion.'], ['Deux parties disjointes peuvent avoir la même image : l’inclusion est alors stricte.']]); }

  // ---------- 3. composer : ce qui se transmet ----------
  function transmet(ctx, t) { const V = S.transmet;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.dia), X = [420, 960, 1500], y = 270; [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => ovale(ctx, X[i], y, 120, 62, kd, null)); [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => formule(ctx, id, X[i], y, { fs: 38, mil: 1, a: kd }));
      fl(ctx, [X[0] + 130, y], [X[1] - 132, y], { c: C.bleu, lw: 4, a: kd }); formule(ctx, 'l_f', (X[0] + X[1]) / 2, y - 30, { fs: 36, mil: 1, a: kd }); fl(ctx, [X[1] + 130, y], [X[2] - 132, y], { c: C.orange, lw: 4, a: kd }); formule(ctx, 'l_g', (X[1] + X[2]) / 2, y - 30, { fs: 36, mil: 1, a: kd });
      tx(ctx, t, 'La composée de deux injections est une injection ; de même pour les surjections et les bijections.', CX, 420, V.p[0], { size: 28 }); fo(ctx, t, 't_1', 520, 530, 38, V.p[1]); fo(ctx, t, 't_2', 1400, 530, 38, V.p[2]); fo(ctx, t, 't_pr', CX, 680, 34, V.pr); });
    legs(ctx, t, V, [['L’injectivité et la surjectivité passent à la composée.'], ['Dans l’autre sens, l’injectivité de la composée ne se transmet qu’à $f$,', 'et sa surjectivité ne se transmet qu’à $g$.']]); }

  // ---------- 4. bijections et ensembles finis ----------
  const TI = { x: [330, 560, 790], y: 690, ech: 2.4 };
  const posTir = (t) => { const V = S.bij, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), a = borne(k / 0.58), r = borne((k - 0.7) / 0.3), x = k < 0.7 ? lerp(TI.x[0] - 130, TI.x[2] + 120, a) : lerp(TI.x[2] + 120, TI.x[1] + 60, r);
    return { p: [x, TI.y], x, k, marche: (k > 0 && a < 1) || (r > 0 && r < 1), face: k >= 0.64 ? -1 : 1, tete: a >= 1 && r <= 0 ? -0.3 : 0, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tiroir(ctx, x, y, n, a) { if (a <= 0) return; cadre(ctx, x, y - 52, 170, 100, { fill: C.surface, stroke: C.gm, lw: 3, r: 8, a }); for (let i = 0; i < n; i++) pt(ctx, [x + (n > 1 ? (i - 0.5) * 56 : 0), y - 52], { c: n > 1 ? C.orange : C.bleu, r: 20, a }); }
  function bij(ctx, t) { const V = S.bij;
    phase(ctx, t, 18, 22, () => { const kt = ap(t, V.th); carte(ctx, 260, 165, 1400, 210, 'THÉORÈME', kt); txt(ctx, 'f : E → F est bijective si et seulement s’il existe g : F → E telle que', CX, 250, { fam: F.ui, w: 600, size: 28, a: kt }); formule(ctx, 'j_th', CX, 318, { fs: 40, mil: 1, a: kt });
      fo(ctx, t, 'j_f', 560, 480, 38, V.f); fo(ctx, t, 'j_g', 1320, 480, 38, V.g); fo(ctx, t, 'j_gf', 560, 620, 44, V.gf); fo(ctx, t, 'j_fg', 1220, 620, 44, V.fg); tx(ctx, t, 'f n’est pas bijective', 1620, 632, V.fg, { c: C.orange, size: 28 }); });
    phase(ctx, t, 22, 26, () => { const kt = ap(t, V.th2); carte(ctx, 160, 165, 1600, 210, 'THÉORÈME', kt); txt(ctx, 'E et F finis, à n et p éléments, et f : E → F. Si f est injective, n ⩽ p ; si f est surjective, n ⩾ p.', CX, 250, { fam: F.ui, w: 600, size: 27, a: kt }); formule(ctx, 'j_2', CX, 318, { fs: 34, mil: 1, a: kt });
      const ki = ap(t, V.tir), on = t > V.marche[0], { x, k } = posTir(t); TI.x.forEach((u, i) => tiroir(ctx, u, TI.y, !on ? 0 : (x > u + 40 || k > 0.6 ? 1 : 0) + (i === 1 && k >= 1 ? 1 : 0), ki)); seg(ctx, [160, TI.y], [1000, TI.y], { c: C.gm, lw: 3, a: ki });
      tx(ctx, t, 'Le principe des tiroirs', 1400, 470, V.tir, { size: 34, c: C.cours }); tx(ctx, t, 'quatre objets, trois tiroirs :', 1400, 550, V.np, { c: C.encre2, w: 500 }); tx(ctx, t, 'deux objets partagent un tiroir', 1400, 600, V.np, { size: 30 }); fo(ctx, t, 'j_np', 1400, 690, 46, V.np); });
    legs(ctx, t, V, [['Une bijection est une application qui possède une réciproque.'], ['Ajouter 1 dans les entiers naturels : $g$ défait bien ce que fait $f$…'], ['… mais pas l’inverse : les deux égalités sont indispensables.'], ['Entre deux ensembles finis de même taille, injective, surjective et bijective sont synonymes.'], ['Avec plus d’objets que de tiroirs, aucune application n’est injective.']]); }

  // ---------- 5. le théorème de Cantor ----------
  const TB = { x: 380, y: 412, dx: 104, dy: 54, ech: 2.0 }, FX = [[0, 2, 4], [1, 2], [0, 3], [3, 4], [1, 2, 3]], DD = [0, 1, 2, 3, 4].filter((i) => !FX[i].includes(i));
  const cel = (i, j) => [TB.x + j * TB.dx, TB.y + i * TB.dy];
  const posDiag = (t) => { const V = S.cantor, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = lerp(-0.45, 4.45, k), p = cel(s, s); return { p: [p[0], p[1] + 14], s, an: k > 0 && k < 1 ? 0.42 : 0, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tableau(ctx, n, s, o = {}) { for (let j = 0; j < 5; j++) formule(ctx, `k_c${j}`, cel(0, j)[0], TB.y - 62, { fs: 30, mil: 1, a: borne(n) });
    for (let i = 0; i < 5; i++) { const a = borne(n - i); formule(ctx, `k_f${i}`, TB.x - 130, cel(i, 0)[1], { fs: 30, mil: 1, a }); for (let j = 0; j < 5; j++) { const p = cel(i, j), d = i === j && s > i - 0.2; if (d) cadre(ctx, p[0], p[1], TB.dx - 12, TB.dy - 10, { stroke: VIOLET, fill: 'rgba(199,147,230,0.14)', lw: 3, r: 8, a }); pt(ctx, p, FX[i].includes(j) ? { c: C.bleu, r: 13, a } : { c: C.gl, r: 13, creux: 1, a }); } }
    formule(ctx, 'k_pts', TB.x - 130, cel(5, 0)[1] - 6, { fs: 28, mil: 1, a: borne(n - 4) }); const yD = cel(6, 0)[1] + 4; formule(ctx, 'k_D', TB.x - 130, yD, { fs: 34, mil: 1, a: borne(s + 0.2) }); for (let j = 0; j < 5; j++) if (s > j - 0.2) { const p = [cel(0, j)[0], yD]; pt(ctx, p, DD.includes(j) ? { c: VIOLET, r: 13 } : { c: VIOLET, r: 13, creux: 1 }); } }
  function cantor(ctx, t) { const V = S.cantor;
    phase(ctx, t, 26, 34, () => { const kt = ap(t, V.th); carte(ctx, 260, 165, 1400, 116, 'THÉORÈME DE CANTOR', kt); txt(ctx, 'Pour tout ensemble E, il n’existe aucune surjection de E sur l’ensemble de ses parties.', CX, 246, { fam: F.ui, w: 600, size: 28, a: kt });
      tableau(ctx, 6 * pr(t, V.tab[0], V.tab[1] - V.tab[0]), t > V.marche[0] ? posDiag(t).s : -9);
      tx(ctx, t, 'ligne x : un point plein quand la colonne appartient à f(x)', 590, 318, V.tab[0], { c: C.encre2, w: 500, size: 22 });
      fo(ctx, t, 'k_def', 1380, 400, 40, V.D); tx(ctx, t, 'D diffère de chaque f(x), au moins en x.', 1380, 490, V.dif, { size: 30, c: C.cours }); fo(ctx, t, 'k_abs', 1160, 590, 38, V.abs); fo(ctx, t, 'k_c', 1500, 590, 34, V.contra); tx(ctx, t, 'D n’a pas d’antécédent : f n’est pas surjective.', 1380, 700, V.concl, { size: 30, c: C.cours }); });
    legs(ctx, t, V, [['Un ensemble a toujours strictement plus de parties que d’éléments.'], ['Soit $f$ une application de $E$ dans l’ensemble de ses parties :', 'chaque $f(x)$ est une partie de $E$.'], ['Sur la diagonale, le chien lit si $x$ appartient à $f(x)$ :', 'la partie $D$ prend chaque fois le contraire.'], ['C’est l’argument diagonal.'], ['Si $D$ était l’image d’un élément $a$, cet élément serait dans $D$ et n’y serait pas.'], ['Quelle que soit $f$, une partie lui échappe.']]); }

  // ---------- 6. les relations d'équivalence ----------
  const C3 = [C.bleu, C.orange, VIOLET];
  function equiv(ctx, t) { const V = S.equiv;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); [['réflexive', 'e_1', 480], ['symétrique', 'e_2', 920], ['transitive', 'e_3', 1440]].forEach(([s, id, x]) => { txt(ctx, s, x, 244, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, id, x, 296, { fs: 32, mil: 1, a: kd }); });
      const ka = ap(t, V.axe), X = (v) => 250 + 102 * (v + 5); seg(ctx, [200, 480], [1720, 480], { c: C.gm, lw: 3, a: ka }); for (let v = -5; v <= 8; v++) { const r = ((v % 3) + 3) % 3, k = ap(t, V.cl[r]); pt(ctx, [X(v), 480], { c: k > 0.5 ? C3[r] : C.gl, r: 16, a: ka }); txt(ctx, String(v).replace('-', '−'), X(v), 540, { fam: F.main, w: 400, size: 28, c: C.encre3, a: ka }); }
      ['e_c0', 'e_c1', 'e_c2'].forEach((id, r) => fo(ctx, t, id, 500 + r * 460, 410, 36, V.cl[r])); const kt = ap(t, V.th); carte(ctx, 260, 600, 1400, 130, 'THÉORÈME', kt); formule(ctx, 'e_th', CX, 672, { fs: 34, mil: 1, a: kt }); });
    legs(ctx, t, V, [['Une [relation d’équivalence] sert à identifier des objets.'], ['La congruence modulo 3 range les entiers en trois [classes d’équivalence].'], ['Deux classes sont égales ou disjointes : les classes forment une partition.']]); }

  // ---------- 7. les relations d'ordre ----------
  const HA = { 1: [470, 720], 2: [360, 600], 3: [600, 600], 4: [300, 470], 6: [540, 470], 12: [420, 340] }, AR = [[1, 2], [1, 3], [2, 4], [2, 6], [3, 6], [4, 12], [6, 12]];
  function hasse(ctx, n, o = {}) { AR.forEach(([a, b], i) => seg(ctx, HA[a], HA[b], { c: C.gm, lw: 3, k: borne(n - i) })); Object.entries(HA).forEach(([v, p]) => { const sel = o.sel && o.sel.includes(+v) ? o.c : null; cadre(ctx, p[0], p[1], 76, 60, { fill: C.surface, stroke: sel || C.filet, lw: sel ? 4 : 2, r: 10, a: borne(n) }); txt(ctx, v, p[0], p[1] + 12, { fam: F.main, w: 400, size: 34, c: sel || C.encre, a: borne(n) }); }); }
  function ordre(ctx, t) { const V = S.ordre;
    phase(ctx, t, 38, 42, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); [['réflexive', 'o_1', 440], ['antisymétrique', 'o_2', 900], ['transitive', 'o_3', 1450]].forEach(([s, id, x]) => { txt(ctx, s, x, 244, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, id, x, 296, { fs: 30, mil: 1, a: kd }); });
      tx(ctx, t, 'ordre total : deux éléments sont toujours comparables', CX, 450, V.tot, { size: 32 }); tx(ctx, t, 'l’ordre usuel sur les réels', CX, 500, V.tot, { c: C.encre2, w: 500, size: 28 });
      tx(ctx, t, 'ordre partiel : certains éléments ne le sont pas', CX, 620, V.par, { size: 32 }); tx(ctx, t, 'la divisibilité sur les entiers naturels : 2 ne divise pas 3, et 3 ne divise pas 2', CX, 670, V.par, { c: C.encre2, w: 500, size: 28 }); });
    phase(ctx, t, 42, 46, () => { const kn = ap(t, V.nc); hasse(ctx, 8 * pr(t, V.hasse[0], V.hasse[1] - V.hasse[0]), { sel: kn > 0.5 ? [4, 6] : null, c: C.orange }); if (ap(t, V.maj) > 0.5) rond(ctx, HA[12], C.cours, ap(t, V.maj), 52);
      tx(ctx, t, 'les diviseurs de 12, ordonnés par la divisibilité', 450, 245, V.hasse[0], { c: C.encre2, w: 500, size: 26 });
      tx(ctx, t, '4 et 6 ne sont pas comparables.', 1330, 300, V.nc, { size: 32, c: C.orange }); tx(ctx, t, '12 est un majorant de la partie {4, 6}.', 1330, 410, V.maj, { size: 32, c: C.cours }); tx(ctx, t, 'Mais {4, 6} n’a pas de plus grand élément :', 1330, 520, V.pg, { size: 30 }); tx(ctx, t, 'un plus grand élément doit appartenir à la partie.', 1330, 566, V.pg, { c: C.encre2, w: 500, size: 28 });
      const kp = ap(t, V.prop); carte(ctx, 900, 620, 860, 110, 'PROPOSITION', kp); txt(ctx, 'Une partie a au plus un plus grand élément.', 1330, 692, { fam: F.ui, w: 600, size: 28, a: kp }); });
    legs(ctx, t, V, [['Une [relation d’ordre] sert à comparer : la symétrie cède la place à l’antisymétrie.'], ['Quand deux éléments quelconques se comparent toujours, l’ordre est [total].'], ['Sinon il est [partiel] : c’est le cas de la divisibilité, ou de l’inclusion.'], ['Le diagramme de Hasse : on monte d’un élément à ceux qu’il divise.'], ['Aucun chemin montant ne relie 4 et 6 ; 12 les majore tous les deux.'], ['Un [majorant] n’est un [plus grand élément] que s’il appartient à la partie.']]); }

  const ACTES_DEF = () => [acte(3, S.bij, TI.ech, posTir, S.bij.sortie), acte(4, S.cantor, TB.ech, posDiag, S.cantor.sortie)];
  function vignetteFig(ctx) { const s = { ...TB }; Object.assign(TB, { x: 1240, y: 380, dx: 110, dy: 72 }); tableau(ctx, 6, 9); const p = cel(2.3, 2.3); K.chienSur(ctx, p[0], p[1] + 10, 0.42, 3.2, { t: 0.3, allure: 'trot', phase: 0.2 }); Object.assign(TB, s); }
