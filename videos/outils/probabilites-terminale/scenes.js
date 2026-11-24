  const cellule = (ctx, s, x, y, w, h, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; cadre(ctx, x, y, w, h, { fill: o.fill || C.surface, stroke: o.stroke || C.filet, lw: 2, r: 10, a }); if (s) txt(ctx, s, x, y + (o.size || 40) * 0.36, { fam: F.main, w: 400, size: o.size || 40, c: o.c || C.encre, a }); };
  // diagramme en bâtons : X(valeur) en pixels, y0 la ligne de base, H la hauteur d'une probabilité 1
  function batons(ctx, X, y0, H, L3, k, o = {}) { if (k <= 0) return; seg(ctx, [o.x0, y0], [o.x1, y0], { c: C.gm, lw: 3, a: k }); for (const [x, p, c, s] of L3) { seg(ctx, [X(x), y0], [X(x), y0 - H * p], { c: c || C.bleu, lw: o.lw || 14, k }); if (s !== undefined) txt(ctx, s, X(x), y0 + 40, { fam: F.main, w: 400, size: 28, c: C.encre3, a: k }); } }
  const triangle = (ctx, x, y, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = C.cours; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 20, y + 34); ctx.lineTo(x + 20, y + 34); ctx.closePath(); ctx.fill(); ctx.restore(); };

  // ---------- 1. une variable aléatoire ----------
  const LOI = [[-2, 1 / 2, C.orange, '−2'], [0, 1 / 3, C.gm, '0'], [6, 1 / 6, C.cours, '6']];
  function variable(ctx, t) { const V = S.variable;
    phase(ctx, t, 2, 6, () => { tx(ctx, t, 'Mise : 2 €. Un 6 rapporte 8 € ; un 4 ou un 5 rapporte 2 € ; sinon, rien.', CX, 215, V.jeu, { size: 32 }); tx(ctx, t, 'X : le gain du joueur, mise déduite', CX, 268, V.jeu, { size: 28, c: C.encre2, w: 500 });
      const kf = ap(t, V.faces); [1, 2, 3, 4, 5, 6].forEach((n, i) => { const x = 250 + i * 120; cellule(ctx, String(n), x, 400, 96, 96, { a: kf }); const j = i < 3 ? 0 : i < 5 ? 1 : 2, k = ap(t, V.X[j]); fl(ctx, [x, 460], [x, 520], { c: C.gm, lw: 3, a: k }); formule(ctx, ['x_m2', 'x_0', 'x_6'][j], x, 560, { fs: 44, mil: 1, a: k }); });
      const kd = ap(t, V.def); carte(ctx, 1080, 340, 700, 170, 'DÉFINITION', kd); txt(ctx, 'Une variable aléatoire associe', 1430, 420, { fam: F.ui, w: 600, size: 28, a: kd }); txt(ctx, 'un réel à chaque issue.', 1430, 462, { fam: F.ui, w: 600, size: 28, a: kd });
      const kl = ap(t, V.loi), X = [1160, 1380, 1530, 1680], y1 = 600, y2 = 690; ctx.save(); ctx.globalAlpha *= kl; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(1050, 560, 710, 180); ctx.beginPath(); ctx.moveTo(1050, 640); ctx.lineTo(1760, 640); ctx.moveTo(1290, 560); ctx.lineTo(1290, 740); ctx.stroke(); ctx.restore();
      [['x_xi', 0, y1], ['x_P', 0, y2], ['x_m2', 1, y1], ['x_0', 2, y1], ['x_6', 3, y1], ['x_12', 1, y2], ['x_13', 2, y2], ['x_16', 3, y2]].forEach(([id, i, y]) => formule(ctx, id, X[i], y, { fs: y === y2 && i ? 30 : 36, mil: 1, a: kl })); });
    legs(ctx, t, V, [['Un jeu de fête foraine : on mise, on lance un dé.'], ['À chaque face du dé, on associe le gain du joueur : c’est une [variable aléatoire].'], ['Sa [loi de probabilité] donne la probabilité de chaque valeur : la somme fait 1.']]); }

  // ---------- 2. espérance, variance, écart-type ----------
  const XB = (v) => 300 + 62 * v;
  function esperance(ctx, t) { const V = S.esperance;
    phase(ctx, t, 6, 14, () => { const kf = ap(t, V.fig, 0.8); batons(ctx, XB, 640, 380, LOI, kf, { x0: 130, x1: 740 }); [['x_12', -2, 1 / 2], ['x_13', 0, 1 / 3], ['x_16', 6, 1 / 6]].forEach(([id, x, p]) => formule(ctx, id, XB(x), 640 - 380 * p - 44, { fs: 28, mil: 1, a: kf }));
      const kz = ap(t, V.zero); triangle(ctx, XB(0), 692, kz); formule(ctx, 'e_l', XB(0), 752, { fs: 30, mil: 1, a: kz });
      phase(ctx, t, 6, 10, () => { const kd = ap(t, V.def); carte(ctx, 860, 165, 960, 150, 'DÉFINITION', kd); formule(ctx, 'e_def', 1340, 250, { fs: 40, mil: 1, a: kd }); fo(ctx, t, 'e_c', 1340, 430, 32, V.calc); fo(ctx, t, 'e_0', 1200, 560, 50, V.zero); tx(ctx, t, 'le jeu est équitable', 1520, 572, V.zero, { c: C.cours, size: 32 }); });
      phase(ctx, t, 10, 14, () => { fo(ctx, t, 'v_def', 1340, 215, 34, V.vdef); const kk = ap(t, V.kh); carte(ctx, 960, 300, 760, 140, 'FORMULE DE KÖNIG-HUYGENS', kk); formule(ctx, 'v_kh', 1340, 382, { fs: 40, mil: 1, a: kk });
        fo(ctx, t, 'v_e2', 1340, 520, 28, V.e2); fo(ctx, t, 'v_v', 1130, 640, 40, V.v); fo(ctx, t, 'v_s', 1560, 640, 40, V.sig); }); });
    legs(ctx, t, V, [['Le diagramme en bâtons de la loi de $X$ : la somme des hauteurs vaut 1.'], ['L’[espérance] est la moyenne des valeurs, pondérée par leurs probabilités.'], ['C’est le point d’équilibre du diagramme : ici 0, le jeu est équitable.'], ['La [variance] et l’[écart-type] mesurent la dispersion autour de l’espérance.'], ['En pratique, on calcule l’espérance de $X^2$.'], ['L’écart-type s’exprime en euros : les gains s’écartent de près de 3 euros de la moyenne.']]); }

  // ---------- 3. transformer une variable aléatoire ----------
  function lineaire(ctx, t) { const V = S.lineaire;
    phase(ctx, t, 14, 18, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 1600, 150, 'PROPOSITION', kp); ['l_1', 'l_2', 'l_3'].forEach((id, i) => formule(ctx, id, 460 + i * 500, 250, { fs: 34, mil: 1, a: kp }));
      tx(ctx, t, 'On double les gains, la mise augmente de 1 € :', 760, 432, V.Y, { c: C.encre2, w: 500 }); fo(ctx, t, 'l_Y', 1280, 420, 48, V.Y);
      fo(ctx, t, 'l_e', 430, 590, 40, V.e); fo(ctx, t, 'l_v', 960, 590, 40, V.v); fo(ctx, t, 'l_s', 1500, 590, 40, V.s); tx(ctx, t, 'Le joueur perd en moyenne 1 € par partie.', CX, 710, V.s, { c: C.cours, size: 32 }); });
    legs(ctx, t, V, [['Ajouter une constante déplace la moyenne sans changer la dispersion ;', 'multiplier par $a$ multiplie l’écart-type par la valeur absolue de $a$.'], ['Pour le nouveau gain $Y$, aucun tableau à refaire.']]); }

  // ---------- 4. le schéma de Bernoulli ----------
  const AR = { r: [200, 470], x: [470, 740, 1010], ech: 2.0 };
  const noeud = (s) => { const n = s.length; if (!n) return AR.r; let y = 470, d = 150; for (const c of s) { y += c === 'S' ? -d : d; d /= 2; } return [AR.x[n - 1], y + (n === 3 ? 0 : 0)]; };
  const FEUILLES = ['SSS', 'SSE', 'SES', 'SEE', 'ESS', 'ESE', 'EES', 'EEE'], DEUX = ['SSE', 'SES', 'ESS'];
  function branche(ctx, s, k, o = {}) { const p = noeud(s.slice(0, -1)), q = noeud(s); seg(ctx, p, q, { c: o.c || C.gm, lw: o.lw || 3, k, a: o.a }); }
  const posArbre = (t) => { const V = S.bernoulli, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = 3 * k, i = Math.min(2, Math.floor(s)), f = borne(s - i), ch = 'SSE', p = noeud(ch.slice(0, i)), q = noeud(ch.slice(0, i + 1));
    return { p: k >= 1 ? noeud(ch) : [lerp(p[0], q[0], f), lerp(p[1], q[1], f)], k, an: k > 0 && k < 1 ? Math.atan2(q[1] - p[1], q[0] - p[0]) * 0.8 : 0, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function bernoulli(ctx, t) { const V = S.bernoulli;
    phase(ctx, t, 18, 21, () => { const kd = ap(t, V.def); carte(ctx, 360, 165, 1200, 190, 'DÉFINITION', kd); txt(ctx, 'Une épreuve de Bernoulli n’a que deux issues :', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'le succès, de probabilité p, et l’échec, de probabilité 1 − p.', CX, 298, { fam: F.ui, w: 600, size: 30, a: kd });
      tx(ctx, t, 'X vaut 1 en cas de succès, 0 en cas d’échec :', 620, 512, V.ev, { c: C.encre2, w: 500 }); fo(ctx, t, 'n_ev', 1380, 500, 44, V.ev); });
    phase(ctx, t, 21, 26, () => { const ka = pr(t, V.arbre[0], V.arbre[1] - V.arbre[0]), kc = t > V.marche[0] ? posArbre(t).k : 0, k3 = ap(t, V.trois);
      for (const s of ['S', 'E', 'SS', 'SE', 'ES', 'EE', ...FEUILLES]) branche(ctx, s, borne(ka * 3 - (s.length - 1)));
      ['S', 'SS', 'SSE'].forEach((s, i) => branche(ctx, s, borne(kc * 3 - i), { c: C.cours, lw: 6 })); for (const ch of DEUX.slice(1)) for (let i = 1; i <= 3; i++) branche(ctx, ch.slice(0, i), 1, { c: C.cours, lw: 6, a: k3 });
      const kn = borne((ka * 3 - 2.5) * 2); for (const s of ['S', 'E', 'SS', 'SE', 'ES', 'EE']) { const p = noeud(s); ctx.save(); ctx.globalAlpha *= borne(ka * 3 - (s.length - 0.5)); ctx.fillStyle = C.papier; ctx.beginPath(); ctx.arc(p[0], p[1], 22, 0, 6.3); ctx.fill(); ctx.restore(); formule(ctx, s.endsWith('S') ? 'n_S' : 'n_E', p[0], p[1], { fs: 34, mil: 1, a: borne(ka * 3 - (s.length - 0.5)) }); }
      FEUILLES.forEach((s, i) => { const p = noeud(s); formule(ctx, `n_f${i}`, p[0] + 70, p[1], { fs: 30, mil: 1, a: kn * (k3 > 0 && !DEUX.includes(s) ? 1 - 0.55 * k3 : 1) }); });
      formule(ctx, 'n_p', 310, 370, { fs: 32, mil: 1, a: borne(ka * 3) }); formule(ctx, 'n_q', 300, 580, { fs: 32, mil: 1, a: borne(ka * 3) });
      tx(ctx, t, 'un chemin à deux succès :', 1520, 300, V.un, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'n_un', 1520, 370, 34, V.un); tx(ctx, t, 'trois chemins à deux succès :', 1520, 520, V.trois, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'n_3', 1520, 600, 40, V.p2); });
    legs(ctx, t, V, [['Une [épreuve de Bernoulli] : deux issues seulement, le succès et l’échec.'], ['La variable qui vaut 1 pour un succès suit la [loi de Bernoulli] de paramètre $p$.'], ['Un [schéma de Bernoulli] répète la même épreuve, de façon indépendante : ici trois fois.'], ['Le long d’un chemin, les probabilités se multiplient.'], ['Trois chemins comptent exactement deux succès : on ajoute leurs probabilités.']]); }

  // ---------- 5. les combinaisons ----------
  const TA = { x: (i) => 250 + i * 150, y: 640, ech: 2.4 }, CHOIX = [0, 2, 3];
  const posTasses = (t) => { const V = S.combi, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(TA.x(0) - 90, TA.x(4) + 110, k); return { p: [x, TA.y], x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tasse(ctx, x, y, n, bille, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gd; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x - 44, y - 90); ctx.lineTo(x - 34, y - 4); ctx.lineTo(x + 34, y - 4); ctx.lineTo(x + 44, y - 90); ctx.stroke(); ctx.restore(); txt(ctx, String(n), x, y + 44, { fam: F.main, w: 400, size: 28, c: C.encre3, a }); if (bille > 0) pt(ctx, [x, y - 30 - (1 - bille) * 90], { c: VIOLET, r: 20, a: a * bille }); }
  const COMB = []; for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) for (let c = b + 1; c < 5; c++) COMB.push([a, b, c]);
  const PASCAL = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]];
  function combi(ctx, t) { const V = S.combi;
    phase(ctx, t, 26, 30, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); formule(ctx, 'c_def', 420, 262, { fs: 40, mil: 1, a: kd }); txt(ctx, '« k parmi n » : le nombre de façons de choisir k éléments parmi n,', 1080, 244, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'sans tenir compte de l’ordre.', 1080, 290, { fam: F.ui, w: 600, size: 30, a: kd });
      const kt = ap(t, V.tasses), x = t > V.marche[0] ? posTasses(t).x : -1e9; for (let i = 0; i < 5; i++) tasse(ctx, TA.x(i), TA.y, i + 1, CHOIX.includes(i) ? borne((x - TA.x(i)) / 40) : 0, kt); seg(ctx, [120, TA.y], [1010, TA.y], { c: C.gm, lw: 3, a: kt });
      const g = COMB.length * pr(t, V.grille[0], V.grille[1] - V.grille[0]); COMB.forEach((cb, j) => { const a = borne(g - j), x0 = 1160 + (j % 2) * 330, y0 = 400 + Math.floor(j / 2) * 50; for (let i = 0; i < 5; i++) pt(ctx, [x0 + i * 46, y0], { c: cb.includes(i) ? VIOLET : C.gl, r: cb.includes(i) ? 13 : 8, a }); });
      fo(ctx, t, 'c_53', 1420, 705, 38, V.dix); });
    phase(ctx, t, 30, 34, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 880, 170, 'PROPOSITION', kp); formule(ctx, 'c_sym', 400, 262, { fs: 34, mil: 1, a: kp }); formule(ctx, 'c_pas', 780, 262, { fs: 34, mil: 1, a: kp });
      const n = 6 * pr(t, V.tri[0], V.tri[1] - V.tri[0]), kq = ap(t, V.pascal); PASCAL.forEach((l, i) => l.forEach((v, j) => { const x = 1240 + j * 96, y = 230 + i * 84, sel = (i === 4 && (j === 1 || j === 2)) ? C.orange : (i === 5 && j === 2) ? C.cours : null; cellule(ctx, String(v), x, y, 82, 70, { a: borne(n - i), size: 34, stroke: sel && kq > 0.5 ? sel : C.filet, c: sel && kq > 0.5 ? sel : C.encre }); }));
      tx(ctx, t, 'le triangle de Pascal', 1480, 740, V.tri[0], { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'c_ex', 600, 470, 34, V.pascal); fo(ctx, t, 'c_f', 600, 650, 36, V.fact); });
    legs(ctx, t, V, [['Une [combinaison] : un choix de $k$ éléments parmi $n$, sans ordre.'], ['Trois billes identiques dans cinq tasses, une au plus par tasse : voici une répartition.'], ['En les énumérant toutes, on en trouve dix : c’est « 3 parmi 5 ».'], ['Deux relations : la symétrie, et la relation de Pascal.'], ['Dans le triangle de Pascal, chaque nombre est la somme de celui du dessus et de son voisin de gauche.'], ['Pour de grandes valeurs, une formule avec des factorielles, ou la calculatrice.']]); }

  // ---------- 6. la loi binomiale ----------
  const BIN = [0.2181, 0.3372, 0.2555, 0.1264, 0.0459, 0.0131, 0.0030, 0.0006, 0.0001], XK = (k) => 240 + 78 * k;
  function binomiale(ctx, t) { const V = S.binomiale;
    phase(ctx, t, 34, 38, () => { const kt = ap(t, V.th); carte(ctx, 310, 165, 1300, 200, 'THÉORÈME', kt); formule(ctx, 'b_n', 620, 275, { fs: 38, mil: 1, a: kt }); formule(ctx, 'b_th', 1150, 275, { fs: 44, mil: 1, a: kt });
      [['où placer les k succès parmi les n épreuves ?', VIOLET], ['quelle probabilité pour ces k succès ?', C.bleu], ['quelle probabilité pour les n − k échecs ?', C.orange]].forEach(([s, c], i) => tx(ctx, t, s, CX, 470 + i * 90, V.lec[i], { c, size: 34 })); });
    phase(ctx, t, 38, 42, () => { tx(ctx, t, 'Une usine : 3 % de pièces défectueuses. On prélève un lot de 50 pièces.', CX, 205, V.ex, { size: 32 }); tx(ctx, t, 'X : le nombre de pièces défectueuses du lot', 760, 282, V.ex, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'b_X', 1330, 270, 40, V.ex);
      ['b_0', 'b_1', 'b_2'].forEach((id, i) => fo(ctx, t, id, CX, 385 + i * 105, 36, V.p[i])); fo(ctx, t, 'b_c', CX, 715, 40, V.cum); });
    phase(ctx, t, 42, 46, () => { const kf = ap(t, V.fig, 0.8); batons(ctx, XK, 660, 1000, BIN.map((p, k) => [k, p, C.bleu, String(k)]), kf, { x0: 180, x1: 920, lw: 22 }); const ke = ap(t, V.e); triangle(ctx, XK(1.5), 716, ke); formule(ctx, 'b_l', XK(1.5) + 150, 734, { fs: 30, mil: 1, a: ke });
      fo(ctx, t, 'b_X', 620, 230, 36, V.fig); const kp = ap(t, V.prop); carte(ctx, 1040, 200, 760, 150, 'PROPOSITION', kp); formule(ctx, 'b_p', 1420, 285, { fs: 38, mil: 1, a: kp }); fo(ctx, t, 'b_E', 1420, 470, 40, V.e); fo(ctx, t, 'b_S', 1420, 600, 36, V.s); });
    legs(ctx, t, V, [['$X$ compte les succès d’un schéma de Bernoulli : elle suit la [loi binomiale].'], ['La formule se lit en trois questions.'], ['Les 50 prélèvements sont des épreuves de Bernoulli identiques et indépendantes.'], ['On applique la formule pour 0, 1, puis 2 pièces défectueuses.'], ['« Au plus deux » : on ajoute les trois probabilités.'], ['Le diagramme en bâtons de cette loi : les plus hauts entourent l’espérance.'], ['On attend en moyenne $n$ fois $p$ succès : ici, une pièce et demie par lot.']]); }

  const ACTES_DEF = () => [acte(3, S.bernoulli, AR.ech, posArbre, S.bernoulli.sortie), acte(4, S.combi, TA.ech, posTasses, S.combi.sortie)];
  function vignetteFig(ctx) { const X = (k) => 1060 + 86 * k; batons(ctx, X, 760, 1250, BIN.slice(0, 8).map((p, k) => [k, p, C.bleu, String(k)]), 1, { x0: 1000, x1: 1730, lw: 30 }); K.chienSur(ctx, X(4.6), 756, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_b', 500, 620, { fs: 46, mil: 1 }); }
