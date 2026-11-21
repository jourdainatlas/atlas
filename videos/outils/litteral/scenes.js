  const teinte = (c, a) => { const n = parseInt(c.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const rect = (ctx, x, y, w, h, c, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = teinte(c, 0.22); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); ctx.restore(); };

  // ---------- 1. une expression littérale ----------
  function expression(ctx, t) { const V = S.expression;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 560, 165, 800, 150, 'DÉFINITION', kd); formule(ctx, 'e_A', CX, 250, { fs: 52, mil: 1, a: kd });
      fo(ctx, t, 'e_4', CX, 400, 42, V.v4); fo(ctx, t, 'e_m', CX, 500, 42, V.vm);
      fo(ctx, t, 'e_s', 600, 640, 46, V.nat[0]); tx(ctx, t, 'une somme', 600, 715, V.nat[0], { c: C.cours }); fo(ctx, t, 'e_p', 1320, 640, 46, V.nat[1]); tx(ctx, t, 'un produit', 1320, 715, V.nat[1], { c: C.cours }); });
    legs(ctx, t, V, [['Une [expression littérale] contient des lettres, qui représentent des nombres.'], ['On calcule sa valeur en remplaçant $x$ par un nombre :', 'un nombre négatif se met entre parenthèses.'], ['La dernière opération à effectuer dit si l’expression est une somme ou un produit.']]); }

  // ---------- 2. développer ----------
  function developper(ctx, t) { const V = S.developper;
    phase(ctx, t, 6, 10, () => { const kp = ap(t, V.prop); carte(ctx, 260, 165, 1400, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'd_s', 620, 250, { fs: 42, mil: 1, a: kp }); formule(ctx, 'd_d', 1250, 250, { fs: 42, mil: 1, a: kp });
      const x0 = 330, y0 = 390, wa = 300, wb = 190, hd = 140, hc = 200, K4 = V.rect.map((u) => ap(t, u));        // d en haut, c en bas, comme sur la figure du cours
      rect(ctx, x0, y0 + hd, wa, hc, C.bleu, K4[0]); rect(ctx, x0, y0, wa, hd, C.bleu, K4[1]); rect(ctx, x0 + wa, y0 + hd, wb, hc, C.orange, K4[2]); rect(ctx, x0 + wa, y0, wb, hd, C.orange, K4[3]);
      [['r_ac', x0 + wa / 2, y0 + hd + hc / 2], ['r_ad', x0 + wa / 2, y0 + hd / 2], ['r_bc', x0 + wa + wb / 2, y0 + hd + hc / 2], ['r_bd', x0 + wa + wb / 2, y0 + hd / 2]].forEach(([id, x, y], i) => formule(ctx, id, x, y, { fs: 40, mil: 1, a: K4[i] }));
      const kl = ap(t, V.rect[0] - 0.6); formule(ctx, 'l_a', x0 + wa / 2, y0 + hd + hc + 36, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_b', x0 + wa + wb / 2, y0 + hd + hc + 36, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_c', x0 - 34, y0 + hd + hc / 2, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_d', x0 - 34, y0 + hd / 2, { fs: 38, mil: 1, a: kl });
      tx(ctx, t, 'aire du grand rectangle', 1330, 450, V.rect[0] - 0.6, { c: C.encre2, w: 500, size: 28 }); tx(ctx, t, '(a + b)(c + d)', 1330, 510, V.rect[0] - 0.6, { size: 44, fam: F.main, w: 400 });
      tx(ctx, t, 'somme des quatre aires', 1330, 610, V.aire, { c: C.encre2, w: 500, size: 28 }); tx(ctx, t, 'ac + ad + bc + bd', 1330, 670, V.aire, { size: 44, fam: F.main, w: 400, c: C.cours }); });
    phase(ctx, t, 10, 14, () => { fo(ctx, t, 'd_A', CX, 230, 44, V.A); const w = largeur('d_B1', 44), x = CX - (w + largeur('d_B2', 44) + 16) / 2; formule(ctx, 'd_B1', x, 370, { fs: 44, mil: 1, align: 'left', a: ap(t, V.B1), monte: 1 }); formule(ctx, 'd_B2', x + w + 16, 370, { fs: 44, mil: 1, align: 'left', a: ap(t, V.B2), monte: 1 });
      const kp = ap(t, V.piege); carte(ctx, 460, 500, 1000, 190, 'PIÈGE', kp); formule(ctx, 'd_m', 800, 610, { fs: 46, mil: 1, a: kp }); tx(ctx, t, 'et non', 1090, 620, V.faux, { c: C.encre2, w: 500 }); fo(ctx, t, 'd_f', 1240, 610, 46, V.faux); });
    legs(ctx, t, V, [['Développer, c’est transformer un produit en somme : on distribue.'], ['La [double distributivité] se lit sur des aires : le rectangle se découpe en quatre.'], ['La simple distributivité : le facteur 5 multiplie chaque terme.'], ['La double : chaque terme de la première parenthèse multiplie chaque terme de la seconde.'], ['Un signe moins devant une parenthèse change le signe de tous ses termes.']]); }

  // ---------- 3. les identités remarquables ----------
  const CA = { x: 250, y: 300, a: 250, b: 160, ech: 2.5 };
  const posCarre = (t) => { const V = S.identites, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { p: [CA.x + (CA.a + CA.b) * k, CA.y], k, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figCarre(ctx, K3, kc, av) { const { x, y, a, b } = CA, c = a + b; ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = C.gm; ctx.lineWidth = 3; ctx.strokeRect(x, y, c, c); ctx.restore();
    rect(ctx, x, y + b, a, a, C.bleu, K3[0]); formule(ctx, 'i_a2', x + a / 2, y + b + a / 2, { fs: 44, mil: 1, a: K3[0] });
    rect(ctx, x, y, a, b, VIOLET, K3[1]); formule(ctx, 'i_ab', x + a / 2, y + b / 2, { fs: 40, mil: 1, a: K3[1] }); rect(ctx, x + a, y + b, b, a, VIOLET, K3[1]); formule(ctx, 'i_ab', x + a + b / 2, y + b + a / 2, { fs: 40, mil: 1, a: K3[1] });
    rect(ctx, x + a, y, b, b, C.orange, K3[2]); formule(ctx, 'i_b2', x + a + b / 2, y + b / 2, { fs: 44, mil: 1, a: K3[2] });
    seg(ctx, [x, y - 6], [x + c, y - 6], { c: C.cours, lw: 6, k: av, a: kc });
    formule(ctx, 'l_a', x + a / 2, y + c + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_b', x + a + b / 2, y + c + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_b', x - 34, y + b / 2, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_a', x - 34, y + b + a / 2, { fs: 38, mil: 1, a: kc }); }
  function identites(ctx, t) { const V = S.identites;
    phase(ctx, t, 14, 18, () => { figCarre(ctx, V.aires.map((u) => ap(t, u)), ap(t, V.carre), t > V.marche[0] ? posCarre(t).k : 0);
      tx(ctx, t, 'un carré de côté a + b', 1330, 300, V.carre, { c: C.encre2, w: 500 }); tx(ctx, t, 'un carré, deux rectangles, un carré', 1330, 420, V.aires[2], { size: 32 }); fo(ctx, t, 'i_1', 1330, 570, 50, V.f1); });
    phase(ctx, t, 18, 22, () => { const kt = ap(t, V.tab); carte(ctx, 160, 165, 1600, 150, 'PROPRIÉTÉ', kt); ['i_1', 'i_2', 'i_3'].forEach((id, i) => formule(ctx, id, 440 + i * 520, 250, { fs: 30, mil: 1, a: kt }));
      const w = largeur('i_E1', 42), x = CX - (w + largeur('i_E2', 42) + 16) / 2; formule(ctx, 'i_E1', x, 410, { fs: 42, mil: 1, align: 'left', a: ap(t, V.E[0]), monte: 1 }); formule(ctx, 'i_E2', x + w + 16, 410, { fs: 42, mil: 1, align: 'left', a: ap(t, V.E[1]), monte: 1 });
      tx(ctx, t, 'le carré porte sur 3x tout entier :', 800, 522, V.att, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'i_att', 1180, 510, 40, V.att);
      const w2 = largeur('i_m1', 44), x2 = CX - (w2 + largeur('i_m2', 44) + 16) / 2; formule(ctx, 'i_m1', x2, 660, { fs: 44, mil: 1, align: 'left', a: ap(t, V.mental[0]), monte: 1 }); formule(ctx, 'i_m2', x2 + w2 + 16, 660, { fs: 44, mil: 1, align: 'left', a: ap(t, V.mental[1]), monte: 1 }); });
    legs(ctx, t, V, [['Un carré dont le côté mesure $a$ plus $b$.'], ['Il se découpe en un carré de côté $a$, un carré de côté $b$', 'et deux rectangles de côtés $a$ et $b$.'], ['Les deux rectangles donnent le double produit : c’est la première [identité remarquable].'], ['Les trois identités remarquables se démontrent par la double distributivité.'], ['Dans chaque calcul, on commence par repérer ce qui joue le rôle de $a$ et celui de $b$.'], ['Elles servent aussi à calculer de tête.']]); }

  // ---------- 4. factoriser : le facteur commun ----------
  function commun(ctx, t) { const V = S.commun;
    phase(ctx, t, 22, 26, () => { const kd = ap(t, V.def); carte(ctx, 410, 165, 1100, 190, 'DÉFINITION', kd); txt(ctx, 'Factoriser, c’est transformer une somme en produit.', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'f_p', CX, 308, { fs: 40, mil: 1, a: kd });
      fo(ctx, t, 'f_A', CX, 440, 44, V.A); fo(ctx, t, 'f_C', CX, 550, 42, V.C);
      const w = largeur('f_D1', 42), x = CX - (w + largeur('f_D2', 42) + 16) / 2; formule(ctx, 'f_D1', x, 660, { fs: 42, mil: 1, align: 'left', a: ap(t, V.D[0]), monte: 1 }); formule(ctx, 'f_D2', x + w + 16, 660, { fs: 42, mil: 1, align: 'left', a: ap(t, V.D[1]), monte: 1 }); });
    legs(ctx, t, V, [['[Factoriser] : on met en évidence le [facteur commun] à tous les termes.'], ['Le facteur commun peut être une expression entière, ici $x$ plus 2.'], ['Quand un terme est le facteur commun lui-même, il reste 1 : on ne l’oublie pas.']]); }

  // ---------- 5. factoriser : les identités remarquables ----------
  function identfact(ctx, t) { const V = S.identfact;
    phase(ctx, t, 26, 30, () => { const kt = ap(t, V.tab); carte(ctx, 160, 165, 1600, 150, 'PROPRIÉTÉ', kt); ['g_1', 'g_2', 'g_3'].forEach((id, i) => formule(ctx, id, 440 + i * 520, 250, { fs: 30, mil: 1, a: kt }));
      fo(ctx, t, 'g_E', CX, 400, 44, V.E); fo(ctx, t, 'g_G', CX, 500, 40, V.G);
      const kn = ap(t, V.non); formule(ctx, 'g_n', 560, 620, { fs: 44, mil: 1, a: kn }); txt(ctx, 'ne se factorise pas', 830, 632, { fam: F.ui, w: 600, size: 30, c: C.orange, a: kn }); fo(ctx, t, 'g_I', 1350, 620, 40, V.I); });
    phase(ctx, t, 30, 34, () => { const kp = ap(t, V.prop); carte(ctx, 460, 165, 1000, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'p_p', CX, 250, { fs: 46, mil: 1, a: kp });
      [['p_1a', 'p_1b', V.e1, 440], ['p_2a', 'p_2b', V.e2, 620]].forEach(([i1, i2, T2, y]) => { const w = largeur(i1, 42), x = CX - (w + largeur(i2, 42) + 16) / 2; formule(ctx, i1, x, y, { fs: 42, mil: 1, align: 'left', a: ap(t, T2[0]), monte: 1 }); formule(ctx, i2, x + w + 16, y, { fs: 42, mil: 1, align: 'left', a: ap(t, T2[1]), monte: 1 }); }); });
    legs(ctx, t, V, [['Lues de droite à gauche, les identités remarquables factorisent.'], ['On reconnaît deux carrés, puis on vérifie le double produit.'], ['Une somme de deux carrés ne se factorise pas ;', 'un facteur commun peut cacher une différence de deux carrés.'], ['Un produit est nul quand l’un de ses facteurs est nul, et seulement dans ce cas.'], ['Pour résoudre une équation, on factorise : chaque facteur donne une solution.']]); }

  // ---------- 6. les expressions rationnelles ----------
  const AX = { y: 660, X: (v) => 960 + 140 * v, ech: 2.4 }, INT = [-3, 3];
  const posAxe = (t) => { const V = S.rationnelles, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-5, 5, k); let h = 0, u = -1; for (const z of INT) if (Math.abs(x - z) < 0.5) { u = (x - z + 0.5); h = 80 * 4 * u * (1 - u); }
    return { p: [AX.X(x), AX.y - h], x, marche: k > 0 && k < 1 && u < 0, pose: u >= 0 && k < 1 ? { t, allure: 'vol', vol: Math.min(1, u * 5), tang: 0.3 * (1 - 2 * u) } : undefined, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function rationnelles(ctx, t) { const V = S.rationnelles;
    phase(ctx, t, 34, 39, () => { const kd = ap(t, V.def); carte(ctx, 360, 165, 1200, 170, 'DÉFINITION', kd); txt(ctx, 'Les valeurs interdites d’un quotient', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'sont celles qui annulent son dénominateur.', CX, 294, { fam: F.ui, w: 600, size: 30, a: kd });
      fo(ctx, t, 'q_Q', 420, 420, 46, V.Q); fo(ctx, t, 'q_z', 1220, 420, 38, V.zero);
      const ka = ap(t, V.axe, 0.8), xa = t > V.marche[0] ? posAxe(t).x : -5; axeGradue(ctx, AX.X, AX.y, -5.4, 5.4, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], ka);
      [[-5, -3], [-3, 3], [3, 5]].forEach(([u, w]) => { if (xa > u) seg(ctx, [AX.X(u), AX.y], [AX.X(Math.min(xa, w)), AX.y], { c: C.cours, lw: 7 }); });
      for (const z of INT) { pt(ctx, [AX.X(z), AX.y], { c: C.orange, r: 12, creux: 1, a: ka }); txt(ctx, 'valeur interdite', AX.X(z), AX.y + 92, { fam: F.ui, w: 500, size: 24, c: C.orange, a: ka }); } });
    phase(ctx, t, 39, 43, () => { fo(ctx, t, 'q_R', 470, 300, 46, V.R); fo(ctx, t, 'q_Rf', 960, 300, 46, V.fact); fo(ctx, t, 'q_Rr', 1400, 300, 50, V.res); tx(ctx, t, 'pour x ≠ −2', 1660, 312, V.res, { c: C.encre2, w: 500, size: 28 });
      const ke = ap(t, V.err); carte(ctx, 360, 480, 1200, 230, 'PIÈGE', ke); formule(ctx, 'q_e', 640, 610, { fs: 46, mil: 1, a: ke }); fo(ctx, t, 'q_t', 1180, 610, 40, V.test); });
    phase(ctx, t, 43, 46, () => { fo(ctx, t, 'q_S', 480, 400, 48, V.S); fo(ctx, t, 'q_S2', 1010, 400, 44, V.dc); fo(ctx, t, 'q_S3', 1540, 400, 48, V.som); tx(ctx, t, 'pour x ≠ 0 et x ≠ −1', CX, 580, V.S, { c: C.encre2, w: 500, size: 28 }); });
    legs(ctx, t, V, [['Une [expression rationnelle] est un quotient : son dénominateur ne doit pas s’annuler.'], ['Pour trouver les [valeurs interdites], on factorise le dénominateur.'], ['L’expression $Q$ est définie partout, sauf en −3 et en 3.'], ['Pour simplifier, on factorise le numérateur et le dénominateur…'], ['… puis on supprime le facteur commun, ici $x$ plus 2.'], ['On ne simplifie que des facteurs, jamais les termes d’une somme.'], ['Pour ajouter deux quotients, il faut d’abord un dénominateur commun.'], ['Ici, c’est le produit des deux dénominateurs.']]); }

  const ACTES_DEF = () => [acte(2, S.identites, CA.ech, posCarre, S.identites.sortie), acte(5, S.rationnelles, AX.ech, posAxe, S.rationnelles.sortie)];
  function vignetteFig(ctx) { const s = { ...CA }; Object.assign(CA, { x: 1130, y: 330, a: 280, b: 180 }); figCarre(ctx, [1, 1, 1], 1, 1); K.chienSur(ctx, CA.x + 330, CA.y - 8, 0, 3.6, { t: 0.4, assis: 1, tete: -0.1 }); Object.assign(CA, s); formule(ctx, 'b_1', 500, 720, { fs: 54, mil: 1 }); }
