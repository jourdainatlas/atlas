  const teinte = (c, a) => { const n = parseInt(c.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const bloc = (ctx, x, y, w, h, c, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = teinte(c, 0.28); ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); ctx.restore(); };
  const suiteLigne = (ctx, i1, i2, y, fs, a1, a2) => { const w = largeur(i1, fs), x = CX - (w + largeur(i2, fs) + 16) / 2; formule(ctx, i1, x, y, { fs, mil: 1, align: 'left', a: a1, monte: 1 }); formule(ctx, i2, x + w + 16, y, { fs, mil: 1, align: 'left', a: a2, monte: 1 }); };
  // une chaîne de termes reliés par des flèches étiquetées
  function chaine(ctx, t, ids, T, op, x0, pas, y) { ids.forEach((id, i) => { const k = ap(t, T[i]); formule(ctx, id, x0 + i * pas, y, { fs: 50, mil: 1, a: k }); if (i) { fl(ctx, [x0 + (i - 1) * pas + 50, y], [x0 + i * pas - 50, y], { c: C.gm, lw: 3, a: k }); formule(ctx, op, x0 + (i - 0.5) * pas, y - 34, { fs: 30, mil: 1, a: k }); } }); }

  // ---------- 1. une suite de nombres ----------
  function suite(ctx, t) { const V = S.suite;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 460, 165, 1000, 170, 'DÉFINITION', kd); txt(ctx, 'Une suite associe à chaque entier n un réel.', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 's_def', CX, 302, { fs: 38, mil: 1, a: kd });
      [0, 1, 2, 3, 4].forEach((i) => { const k = ap(t, V.termes[i]), x = 460 + i * 200; formule(ctx, `s_u${i}`, x, 440, { fs: 40, mil: 1, a: k }); cadre(ctx, x, 540, 130, 100, { fill: C.surface, stroke: C.filet, lw: 2, r: 10, a: k }); formule(ctx, `s_v${i}`, x, 540, { fs: 54, mil: 1, a: k }); });
      formule(ctx, 's_pts', 1440, 540, { fs: 54, mil: 1, a: ap(t, V.termes[4]) }); tx(ctx, t, 'le terme de rang 6 :', 800, 702, V.u6, { c: C.encre2, w: 500 }); fo(ctx, t, 's_u6', 1100, 690, 50, V.u6); });
    legs(ctx, t, V, [['Une [suite] est une liste infinie de nombres, rangés dans un ordre.'], ['Chaque nombre est un [terme] de la suite ; sa place dans la liste est son [rang].'], ['Dans la suite des entiers impairs, le terme de rang 6 vaut 13.']]); }

  // ---------- 2. deux façons de définir une suite ----------
  function definir(ctx, t) { const V = S.definir;
    phase(ctx, t, 6, 10, () => { const kd = ap(t, V.rec); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); txt(ctx, 'par récurrence', 760, 262, { fam: F.ui, w: 600, size: 30, c: C.encre2, a: kd }); formule(ctx, 'r_def', 1100, 250, { fs: 46, mil: 1, a: kd });
      fo(ctx, t, 'r_u', 520, 420, 40, V.uex); chaine(ctx, t, ['r_1', 'r_3', 'r_5', 'r_7'], V.ch, 'r_p2', 1010, 220, 420);
      fo(ctx, t, 'r_v', 520, 620, 40, V.v); fo(ctx, t, 'r_v2', 1100, 620, 40, V.v2); fo(ctx, t, 'r_v3', 1520, 620, 40, V.v3); });
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.exp); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); txt(ctx, 'de manière explicite', 790, 262, { fam: F.ui, w: 600, size: 30, c: C.encre2, a: kd }); formule(ctx, 'x_def', 1130, 250, { fs: 46, mil: 1, a: kd });
      fo(ctx, t, 'x_u', CX, 410, 50, V.un); fo(ctx, t, 'x_w', 620, 560, 46, V.w); fo(ctx, t, 'x_w9', 1250, 560, 46, V.w9); tx(ctx, t, 'On obtient n’importe quel terme sans calculer les précédents.', CX, 710, V.rem, { c: C.cours, size: 32 }); });
    legs(ctx, t, V, [['Par [récurrence] : chaque terme se calcule à partir du précédent.'], ['Il faut donner le premier terme : ici 1, puis on ajoute 2 à chaque rang.'], ['Tout calcul convient : à partir de 2, on obtient deux cinquièmes, puis deux dix-septièmes.'], ['De manière [explicite] : chaque terme se calcule à partir de son rang.'], ['La suite des entiers impairs s’écrit aussi 2$n$ plus 1.'], ['Le terme de rang 9 s’obtient en remplaçant $n$ par 9.']]); }

  // ---------- 3. le sens de variation ----------
  const R3 = K.repere({ x: 150, y: 370, w: 760, h: 380 }, { x0: -0.6, x1: 8.6, y0: -2.4, y1: 3.4 }), u3 = (n) => (3 * n - 2) / (n + 1);
  function variations(ctx, t) { const V = S.variations;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 150, 'DÉFINITION', kd); txt(ctx, 'croissante :', 500, 262, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'v_c', 760, 250, { fs: 42, mil: 1, a: kd }); txt(ctx, 'décroissante :', 1150, 262, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'v_d', 1430, 250, { fs: 42, mil: 1, a: kd });
      const kf = ap(t, V.fig, 0.8); K.axes(ctx, R3, kf, { gx: [2, 4, 6, 8], gy: [-2, 2] }); const n = 9 * pr(t, V.pts[0], V.pts[1] - V.pts[0]); for (let i = 0; i < 9; i++) K.point(ctx, R3, i, u3(i), { k: borne(n - i), r: 9, c: C.bleu });
      formule(ctx, 'v_u', 730, 695, { fs: 38, mil: 1, a: kf });
      const km = ap(t, V.meth); carte(ctx, 1040, 420, 760, 250, 'MÉTHODE', km); txt(ctx, 'On étudie le', 1420, 500, { fam: F.ui, w: 600, size: 30, a: km }); formule(ctx, 'v_m', 1420, 560, { fs: 42, mil: 1, a: km }); txt(ctx, 'positif : croissante ; négatif : décroissante', 1420, 630, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: km }); });
    phase(ctx, t, 18, 22, () => { fo(ctx, t, 'v_1', CX, 230, 42, V.calc[0]); fo(ctx, t, 'v_2', CX, 360, 42, V.calc[1]); fo(ctx, t, 'v_3', 700, 490, 46, V.calc[2]); tx(ctx, t, 'la suite est strictement croissante', 1320, 502, V.concl, { c: C.cours, size: 32 });
      fo(ctx, t, 'v_q', 800, 670, 40, V.quot); tx(ctx, t, 'strictement décroissante', 1470, 682, V.quot, { c: C.cours, size: 32 }); });
    legs(ctx, t, V, [['Une suite est [croissante] quand chaque terme est au moins égal au précédent.'], ['Les termes de cette suite montent : il reste à le démontrer.'], ['La méthode : étudier le signe de la différence de deux termes consécutifs.'], ['On remplace $n$ par $n$ plus 1, entre parenthèses, puis on réduit au même dénominateur.'], ['La différence est positive pour tout $n$ : la suite est strictement croissante.'], ['Pour une suite à termes positifs, on peut comparer le quotient à 1.']]); }

  // ---------- 4. les suites arithmétiques ----------
  const AX = { y: 640, X: (v) => 260 + 280 * v, ech: 2.4 };
  const posAr = (t) => { const V = S.arith, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = 8 * k, i = Math.min(7, Math.floor(s)), f = k >= 1 ? 1 : doux(borne((s - i) / 0.7)), x = 0.75 + 0.5 * (i + f);
    return { p: [AX.X(x), AX.y], n: k >= 1 ? 8 : i + (f >= 1 ? 1 : 0), marche: k > 0 && k < 1 && f < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function arith(ctx, t) { const V = S.arith;
    phase(ctx, t, 22, 26, () => { const kd = ap(t, V.def); carte(ctx, 460, 165, 1000, 170, 'DÉFINITION', kd); txt(ctx, 'On passe d’un terme au suivant en ajoutant la raison r.', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'a_def', CX, 302, { fs: 40, mil: 1, a: kd });
      const ka = ap(t, V.axe, 0.8), n = t > V.marche[0] ? posAr(t).n : 0; axeGradue(ctx, AX.X, AX.y, -0.1, 5.1, [0, 1, 2, 3, 4, 5], ka); formule(ctx, 'a_u0', AX.X(0.75), AX.y + 110, { fs: 34, mil: 1, a: ka });
      for (let i = 0; i <= n; i++) { pt(ctx, [AX.X(0.75 + 0.5 * i), AX.y], { c: C.bleu, r: 10, a: ka }); if (i) { const xm = AX.X(0.5 + 0.5 * i); ctx.save(); ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(xm, AX.y + 6, 70, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); ctx.restore(); if (i % 2) formule(ctx, 'a_p', xm, AX.y - 104, { fs: 28, mil: 1 }); } } });
    phase(ctx, t, 26, 30, () => { fo(ctx, t, 'a_m', CX, 220, 40, V.meth); const kp = ap(t, V.prop); carte(ctx, 360, 320, 1200, 150, 'PROPOSITION', kp); formule(ctx, 'a_f1', 700, 405, { fs: 44, mil: 1, a: kp }); formule(ctx, 'a_f2', 1230, 405, { fs: 44, mil: 1, a: kp });
      fo(ctx, t, 'a_e', CX, 580, 40, V.ex); fo(ctx, t, 'a_20', CX, 700, 46, V.u20); });
    legs(ctx, t, V, [['Une suite [arithmétique] : on ajoute toujours le même nombre, la [raison].'], ['Partant de trois quarts, le chien avance toujours d’un demi : ses arrêts sont les termes.'], ['Pour reconnaître une suite arithmétique :', 'la différence de deux termes consécutifs est constante.'], ['La formule explicite : pour aller du rang 0 au rang $n$, on ajoute $n$ fois la raison.'], ['Le terme de rang 20 se calcule sans passer par les dix-neuf précédents.']]); }

  // ---------- 5. les suites géométriques ----------
  function geom(ctx, t) { const V = S.geom;
    phase(ctx, t, 30, 34, () => { const kd = ap(t, V.def); carte(ctx, 410, 165, 1100, 170, 'DÉFINITION', kd); txt(ctx, 'On passe d’un terme au suivant en multipliant par la raison q.', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'g_def', CX, 302, { fs: 40, mil: 1, a: kd });
      fo(ctx, t, 'g_v0', 360, 470, 38, V.ch[0]); chaine(ctx, t, ['g_c0', 'g_c1', 'g_c2', 'g_c3', 'g_c4'], V.ch, 'g_x5', 720, 240, 470); fo(ctx, t, 'g_m', CX, 660, 42, V.meth); });
    phase(ctx, t, 34, 38, () => { const kp = ap(t, V.prop); carte(ctx, 360, 165, 1200, 150, 'PROPOSITION', kp); formule(ctx, 'g_f1', 700, 250, { fs: 44, mil: 1, a: kp }); formule(ctx, 'g_f2', 1230, 250, { fs: 44, mil: 1, a: kp });
      const kt = ap(t, V.tab), X = [560, 980, 1420], Y = [420, 520, 640]; ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(330, 370, 1310, 330); ctx.beginPath(); ctx.moveTo(330, 470); ctx.lineTo(1640, 470); ctx.moveTo(330, 580); ctx.lineTo(1640, 580); ctx.moveTo(760, 370); ctx.lineTo(760, 700); ctx.moveTo(1200, 370); ctx.lineTo(1200, 700); ctx.stroke(); ctx.restore();
      [['suite arithmétique', 1, 0], ['suite géométrique', 2, 0], ['relation de récurrence', 0, 1], ['formule explicite', 0, 2]].forEach(([s, i, j]) => txt(ctx, s, X[i], Y[j] + 10, { fam: F.ui, w: 600, size: 28, c: i ? C.encre : C.encre2, a: kt }));
      [['t_a1', 1, 1], ['t_g1', 2, 1], ['t_a2', 1, 2], ['t_g2', 2, 2]].forEach(([id, i, j]) => formule(ctx, id, X[i], Y[j], { fs: 40, mil: 1, a: kt })); });
    legs(ctx, t, V, [['Une suite [géométrique] : on multiplie toujours par le même nombre, la [raison].'], ['Partant de 1 avec la raison 5 : les termes sont les puissances de 5.'], ['Pour reconnaître une suite géométrique :', 'le quotient de deux termes consécutifs est constant.'], ['La formule explicite : du rang 0 au rang $n$, on multiplie $n$ fois par la raison.'], ['Les deux familles se répondent : l’addition pour l’une, la multiplication pour l’autre.']]); }

  // ---------- 6. calculer des sommes ----------
  const ES = { x: 230, y: 740, u: 72, ech: 2.6 };
  const posEsc = (t) => { const V = S.sommes, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = 5 * k, i = Math.min(4, Math.floor(s)), f = k >= 1 ? 1 : doux(borne((s - i) / 0.75)), h = 4 * f * (1 - f) * 22;
    return { p: [ES.x + ES.u * (0.5 + i + f), ES.y - ES.u * (1 + i + f) - h], marche: k > 0 && k < 1 && f < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function escalier(ctx, ke, kc) { const { x, y, u } = ES; for (let i = 1; i <= 6; i++) { for (let j = 0; j < i; j++) bloc(ctx, x + (i - 1) * u, y - (j + 1) * u, u, u, C.bleu, ke); const d = (1 - doux(kc)) * 200; for (let j = i; j < 7; j++) bloc(ctx, x + (i - 1) * u, y - (j + 1) * u - d, u, u, C.orange, borne(kc * 2)); } }
  function sommes(ctx, t) { const V = S.sommes;
    phase(ctx, t, 38, 43, () => { escalier(ctx, ap(t, V.esc, 0.8), pr(t, V.copie[0], V.copie[1] - V.copie[0])); fo(ctx, t, 'm_S', 1300, 250, 44, V.esc); fo(ctx, t, 'm_2S', 1120, 370, 44, V.deux); fo(ctx, t, 'm_21', 1560, 370, 50, V.deux);
      const kp = ap(t, V.prop); carte(ctx, 900, 480, 800, 190, 'PROPOSITION', kp); formule(ctx, 'm_p', 1300, 590, { fs: 44, mil: 1, a: kp }); });
    phase(ctx, t, 43, 46, () => { fo(ctx, t, 'm_15', CX, 250, 46, V.ex15); suiteLigne(ctx, 'm_ar', 'm_ar2', 450, 46, ap(t, V.ar), ap(t, V.ar2));
      tx(ctx, t, 'nombre de termes × moyenne du premier et du dernier', CX, 610, V.ar2, { c: C.encre2, w: 500, size: 30 }); tx(ctx, t, 'onze termes, de 1 à 31, de raison 3', CX, 540, V.ar, { c: C.encre2, w: 500, size: 28 }); });
    phase(ctx, t, 46, 50, () => { const kp = ap(t, V.gprop); carte(ctx, 360, 165, 1200, 190, 'PROPOSITION', kp); formule(ctx, 'm_g', CX, 272, { fs: 42, mil: 1, a: kp });
      fo(ctx, t, 'm_g1', CX, 470, 42, V.g1); suiteLigne(ctx, 'm_g2', 'm_g3', 640, 40, ap(t, V.g2[0]), ap(t, V.g2[1])); });
    legs(ctx, t, V, [['Un escalier de six marches : 1 carré, puis 2, puis 3, jusqu’à 6.'], ['Combien de carrés en tout ? Le chien les gravit, mais il y a plus rapide que de compter.'], ['Deux escaliers font un rectangle de 6 sur 7 : la somme est la moitié de 42.'], ['La formule vaut pour tout entier $n$.'], ['Elle donne la somme des termes de toute suite arithmétique.'], ['Pour les puissances successives d’un nombre $q$ différent de 1, une autre formule.'], ['Elle donne la somme des termes de toute suite géométrique :', 'on met le premier terme en facteur.']]); }

  const ACTES_DEF = () => [acte(3, S.arith, AX.ech, posAr, S.arith.sortie), acte(5, S.sommes, ES.ech, posEsc, S.sommes.sortie)];
  function vignetteFig(ctx) { const s = { ...ES }; Object.assign(ES, { x: 1180, y: 760, u: 78 }); for (let i = 1; i <= 6; i++) for (let j = 0; j < i; j++) bloc(ctx, ES.x + (i - 1) * ES.u, ES.y - (j + 1) * ES.u, ES.u, ES.u, C.bleu, 1); K.chienSur(ctx, ES.x + 5.5 * ES.u, ES.y - 6 * ES.u - 4, 0, 3.4, { t: 0.4, assis: 1, tete: -0.1 }); Object.assign(ES, s); formule(ctx, 'b_s', 520, 720, { fs: 52, mil: 1 }); }
