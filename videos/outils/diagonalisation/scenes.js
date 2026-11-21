  const suiteL = (ctx, i1, i2, y, fs, a1, a2, cx = CX) => { const w = largeur(i1, fs), x = cx - (w + largeur(i2, fs) + 16) / 2; formule(ctx, i1, x, y, { fs, mil: 1, align: 'left', a: a1, monte: 1 }); formule(ctx, i2, x + w + 16, y, { fs, mil: 1, align: 'left', a: a2, monte: 1 }); };

  // ---------- 1. une direction que l'on étire ----------
  const FG = { c: [520, 480], u: 104, ech: 1.7 }, rad = (d) => d * Math.PI / 180, pv = (x, y, F0 = FG) => [F0.c[0] + F0.u * x, F0.c[1] - F0.u * y];
  const theta = (k) => rad(k < 0.2 ? lerp(20, 45, doux(k / 0.2)) : k < 0.4 ? 45 : k < 0.75 ? lerp(45, 135, doux((k - 0.4) / 0.35)) : k < 0.92 ? 135 : lerp(135, 160, doux((k - 0.92) / 0.08)));
  const posCercle = (t) => { const V = S.direction, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), th = theta(k), m = k > 0 && k < 1 && !(k >= 0.2 && k < 0.4) && !(k >= 0.75 && k < 0.92);
    return { p: pv(Math.cos(th), Math.sin(th)), th, an: borne(Math.atan(Math.cos(th) / Math.sin(th)), -0.8, 0.8), marche: m, face: -1, tete: m ? 0 : -0.1 }; };
  function figA(ctx, kf, th, o = {}) { const F0 = o.F || FG; if (kf <= 0) return; ctx.save(); ctx.globalAlpha *= kf; seg(ctx, pv(-3.6, 0, F0), pv(3.6, 0, F0), { c: C.gl, lw: 2 }); seg(ctx, pv(0, -2.6, F0), pv(0, 2.6, F0), { c: C.gl, lw: 2 });
    seg(ctx, pv(-2.5, -2.5, F0), pv(2.5, 2.5, F0), { c: C.cours, lw: 2.5, dash: [8, 8] }); seg(ctx, pv(1.9, -1.9, F0), pv(-1.9, 1.9, F0), { c: C.cours, lw: 2.5, dash: [8, 8] });
    ctx.lineWidth = o.lw || 4; ctx.strokeStyle = C.bleu; ctx.beginPath(); ctx.arc(F0.c[0], F0.c[1], F0.u, 0, 6.3); ctx.stroke(); ctx.strokeStyle = C.orange; ctx.beginPath(); for (let i = 0; i <= 90; i++) { const a = i / 90 * 2 * Math.PI, p = pv(2 * Math.cos(a) + Math.sin(a), Math.cos(a) + 2 * Math.sin(a), F0); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.restore();
    if (th !== undefined) { const x = Math.cos(th), y = Math.sin(th); fl(ctx, F0.c, pv(2 * x + y, x + 2 * y, F0), { c: C.orange, lw: 5, a: kf }); fl(ctx, F0.c, pv(x, y, F0), { c: C.bleu, lw: 5, a: kf }); } }
  function direction(ctx, t) { const V = S.direction;
    phase(ctx, t, 2, 10, () => { const kf = ap(t, V.fig, 0.9), on = t > V.chute[1], th = on ? posCercle(t).th : rad(20); figA(ctx, kf, on ? th : undefined);
      fo(ctx, t, 'd_A', 1380, 250, 46, V.A); tx(ctx, t, 'le cercle des vecteurs unitaires x', 1380, 370, V.fig, { c: C.bleu, size: 28 }); tx(ctx, t, 'l’ellipse de leurs images Ax', 1380, 415, V.fig, { c: C.orange, size: 28 });
      const x = Math.cos(th), y = Math.sin(th), km = fen(t, V.marche[0], V.dir, 0.3); txt(ctx, `x = (${K.fr(x, 2)} ; ${K.fr(y, 2)})`, 1380, 510, { fam: F.ui, w: 600, size: 32, c: C.bleu, a: km }); txt(ctx, `Ax = (${K.fr(2 * x + y, 2)} ; ${K.fr(x + 2 * y, 2)})`, 1380, 560, { fam: F.ui, w: 600, size: 32, c: C.orange, a: km });
      fo(ctx, t, 'd_3', 1180, 670, 50, V.e3); fo(ctx, t, 'd_1', 1580, 670, 50, V.e1); tx(ctx, t, 'deux directions propres', 1380, 510, V.dir, { size: 36, c: C.cours }); tx(ctx, t, 'Hilbert, 1904 : la valeur « propre » à la transformation', 1380, 565, V.mot, { size: 26, c: C.encre2, w: 500 }); });
    legs(ctx, t, V, [['Une matrice transforme chaque vecteur $x$ en un vecteur $A x$ :', 'ici, le cercle devient une ellipse.'], ['Le chien est le vecteur $x$ : en général, son image n’a pas la même direction que lui.'], ['Sur la première diagonale, l’image est alignée avec $x$ : elle vaut trois fois $x$.'], ['Puis l’image tourne de nouveau, plus vite ou moins vite que $x$.'], ['Sur la seconde diagonale, l’image est $x$ lui-même.'], ['Ces deux droites, que la matrice se contente d’étirer, sont ses directions propres.']]); }

  // ---------- 2. valeurs propres, vecteurs propres ----------
  function propres(ctx, t) { const V = S.propres;
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.def); carte(ctx, 310, 165, 1300, 190, 'DÉFINITION', kd); formule(ctx, 'p_def', 660, 270, { fs: 44, mil: 1, a: kd }); txt(ctx, 'λ est une valeur propre de u,', 1260, 250, { fam: F.ui, w: 600, size: 28, a: kd }); txt(ctx, 'x un vecteur propre associé.', 1260, 294, { fam: F.ui, w: 600, size: 28, a: kd });
      tx(ctx, t, 'le sous-espace propre :', 640, 422, V.E, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'p_E', 1140, 410, 40, V.E); tx(ctx, t, 'le spectre, ensemble des valeurs propres :', 760, 497, V.sp, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'p_sp', 1160, 485, 40, V.sp);
      const kt = ap(t, V.th); carte(ctx, 310, 540, 1300, 190, 'THÉORÈME', kt); txt(ctx, 'Des sous-espaces propres associés à des valeurs propres distinctes sont en somme directe.', CX, 620, { fam: F.ui, w: 600, size: 26, a: kt }); formule(ctx, 'p_th', 820, 680, { fs: 34, mil: 1, a: kt }); formule(ctx, 'p_card', 1380, 680, { fs: 32, mil: 1, a: ap(t, V.card) }); });
    legs(ctx, t, V, [['Une [valeur propre] et un [vecteur propre] : $u$ multiplie $x$ par un scalaire.'], ['Les vecteurs propres associés à une même valeur forment,', 'avec le vecteur nul, un [sous-espace propre].'], ['Un endomorphisme a donc au plus $n$ valeurs propres en dimension $n$.']]); }

  // ---------- 3. le polynôme caractéristique ----------
  function caract(ctx, t) { const V = S.caract;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.def); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); formule(ctx, 'c_def', CX, 250, { fs: 46, mil: 1, a: kd });
      const kt = ap(t, V.th); carte(ctx, 510, 380, 900, 150, 'THÉORÈME', kt); formule(ctx, 'c_th', CX, 465, { fs: 42, mil: 1, a: kt }); fo(ctx, t, 'c_dev', CX, 660, 40, V.dev); });
    phase(ctx, t, 18, 22, () => { fo(ctx, t, 'c_2', CX, 220, 42, V.d2); suiteL(ctx, 'c_ex', 'c_fac', 380, 42, ap(t, V.ex), ap(t, V.fac));
      tx(ctx, t, 'multiplicité d’une valeur propre : sa multiplicité comme racine', 620, 562, V.mult, { c: C.encre2, w: 500, size: 26 }); fo(ctx, t, 'c_m', 1380, 550, 40, V.mult); tx(ctx, t, 'pour deux matrices carrées de même taille :', 720, 702, V.ab, { c: C.encre2, w: 500, size: 26 }); fo(ctx, t, 'c_ab', 1280, 690, 42, V.ab); });
    legs(ctx, t, V, [['Le [polynôme caractéristique] : un déterminant', 'où l’indéterminée $X$ remplace la valeur propre.'], ['Ses racines sont exactement les valeurs propres.'], ['Il est unitaire, de degré $n$ ; la trace et le déterminant s’y lisent.'], ['En taille 2, il s’écrit donc sans calcul.'], ['Pour la matrice du début : on retrouve les valeurs propres 1 et 3.'], ['La dimension d’un sous-espace propre ne dépasse jamais la multiplicité.']]); }

  // ---------- 4. diagonaliser ----------
  function diago(ctx, t) { const V = S.diago;
    phase(ctx, t, 22, 25, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 130, 'DÉFINITION', kd); txt(ctx, 'u est diagonalisable s’il existe une base dans laquelle sa matrice est diagonale : une base de vecteurs propres.', CX, 250, { fam: F.ui, w: 600, size: 25, a: kd });
      const kt = ap(t, V.th); carte(ctx, 260, 360, 1400, 190, 'THÉORÈME', kt); txt(ctx, 'u est diagonalisable si et seulement si', CX, 440, { fam: F.ui, w: 600, size: 28, a: kt }); formule(ctx, 'g_th', CX, 500, { fs: 32, mil: 1, a: kt });
      tx(ctx, t, 'En particulier : n valeurs propres distinctes en dimension n, donc diagonalisable.', CX, 660, V.cor, { c: C.cours, size: 30 }); });
    phase(ctx, t, 25, 30, () => { fo(ctx, t, 'g_A', 400, 280, 40, V.A); fo(ctx, t, 'g_chi', 400, 470, 40, V.chi); fo(ctx, t, 'g_E1', 1280, 230, 40, V.E1); tx(ctx, t, 'un plan : dimension 2, comme la multiplicité', 1280, 292, V.E1, { c: C.encre2, w: 500, size: 24 });
      fo(ctx, t, 'g_E4', 1280, 380, 40, V.E4); tx(ctx, t, 'une droite', 1280, 438, V.E4, { c: C.encre2, w: 500, size: 24 }); fo(ctx, t, 'g_P', 1280, 570, 36, V.P); fo(ctx, t, 'g_c', 500, 660, 44, V.ctrl); });
    legs(ctx, t, V, [['[Diagonaliser], c’est trouver une base formée de vecteurs propres.'], ['Deux conditions : assez de racines, et pour chacune assez de vecteurs propres.'], ['On calcule d’abord le polynôme caractéristique, sous forme factorisée.'], ['Pour chaque valeur propre, on résout un système : il donne le sous-espace propre.'], ['On range les vecteurs propres en colonnes, les valeurs propres dans le même ordre.']]); }

  // ---------- 5. trois issues possibles ----------
  function issues(ctx, t) { const V = S.issues;
    phase(ctx, t, 30, 34, () => { fo(ctx, t, 'i_C', 420, 300, 42, V.C); fo(ctx, t, 'i_chi', 420, 500, 44, V.chi); tx(ctx, t, 'scindé : une seule valeur propre, triple', 420, 570, V.chi, { c: C.encre2, w: 500, size: 26 });
      fo(ctx, t, 'i_E', 1300, 280, 36, V.E2); fo(ctx, t, 'i_non', 1300, 440, 44, V.non); tx(ctx, t, 'C n’est pas diagonalisable : il manque une direction propre.', 1300, 560, V.non, { c: C.orange, size: 30 }); });
    phase(ctx, t, 34, 38, () => { fo(ctx, t, 'i_R', 420, 260, 44, V.R); tx(ctx, t, 'le quart de tour', 420, 350, V.R, { c: C.encre2, w: 500, size: 26 }); const kr = ap(t, V.R), o = [420, 600]; seg(ctx, [o[0] - 150, o[1]], [o[0] + 150, o[1]], { c: C.gl, lw: 2, a: kr }); seg(ctx, [o[0], o[1] + 40], [o[0], o[1] - 170], { c: C.gl, lw: 2, a: kr });
      fl(ctx, o, [o[0] + 130, o[1]], { c: C.bleu, lw: 5, a: kr }); formule(ctx, 'i_e1', o[0] + 140, o[1] + 36, { fs: 30, mil: 1, a: kr }); fl(ctx, o, [o[0], o[1] - 130], { c: C.orange, lw: 5, a: kr }); formule(ctx, 'i_Re1', o[0] + 56, o[1] - 130, { fs: 30, mil: 1, a: kr });
      fo(ctx, t, 'i_chiR', 1300, 240, 44, V.chiR); tx(ctx, t, 'aucune racine réelle : R n’est pas diagonalisable sur les réels', 1300, 330, V.nonR, { c: C.orange, size: 28 }); fo(ctx, t, 'i_C2', 1300, 440, 44, V.surC); tx(ctx, t, 'deux racines simples : R est diagonalisable sur les complexes', 1300, 530, V.surC, { c: C.cours, size: 28 });
      const ke = ap(t, V.err); carte(ctx, 860, 600, 880, 130, 'PIÈGE', ke); txt(ctx, 'Une valeur propre multiple n’empêche pas de diagonaliser :', 1300, 668, { fam: F.ui, w: 600, size: 24, a: ke }); txt(ctx, 'seule compte la dimension du sous-espace propre.', 1300, 702, { fam: F.ui, w: 600, size: 24, a: ke }); });
    legs(ctx, t, V, [['Deuxième issue : un polynôme caractéristique scindé, à une seule racine.'], ['Le sous-espace propre n’est qu’un plan : sa dimension est inférieure à la multiplicité.'], ['Troisième issue : un quart de tour ne laisse stable aucune droite du plan.'], ['Tout dépend du corps : sur les complexes, le polynôme est scindé à racines simples.'], ['La matrice du premier exemple avait une valeur propre double,', 'et elle était diagonalisable.']]); }

  // ---------- 6. les puissances d'une matrice ----------
  const FB = { y: 690, X: (v) => 200 + 27 * v, ech: 2.2 }, FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55];
  const posFib = (t) => { const V = S.puissances, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])), x = lerp(0, 55, k); return { p: [FB.X(x), FB.y], x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function puissances(ctx, t) { const V = S.puissances;
    phase(ctx, t, 38, 46, () => { const kp = ap(t, V.prop); carte(ctx, 410, 165, 1100, 130, 'PROPRIÉTÉ', kp); formule(ctx, 'u_p', CX, 240, { fs: 40, mil: 1, a: kp });
      fo(ctx, t, 'u_F', 560, 400, 34, V.F); fo(ctx, t, 'u_chi', 1360, 400, 30, V.chi); fo(ctx, t, 'u_b', 720, 540, 40, V.binet); fo(ctx, t, 'u_10', 1300, 540, 50, V.f10);
      const ka = ap(t, V.axe, 0.8), x = t > V.marche[0] ? posFib(t).x : -1; axeGradue(ctx, FB.X, FB.y, -1, 57, [0, 10, 20, 30, 40, 50], ka, { size: 24 }); for (const v of FIB) if (x >= v - 0.3) { pt(ctx, [FB.X(v), FB.y], { c: C.cours, r: 10 }); txt(ctx, String(v), FB.X(v), FB.y - 26 - (v < 4 ? (v % 2 ? 0 : 26) : 0), { fam: F.main, w: 400, size: 26, c: C.cours }); } });
    legs(ctx, t, V, [['Une fois la matrice diagonalisée, ses puissances se calculent sur la diagonale.'], ['La suite de Fibonacci s’obtient par les puissances d’une matrice de taille 2.'], ['Son polynôme caractéristique a deux racines réelles distinctes : elle est diagonalisable.'], ['Chaque terme est la somme des deux précédents ;', 'la diagonalisation en donne une formule directe.'], ['Le dixième terme vaut 55.']]); }

  // ---------- 7. trigonaliser ; les nilpotents ----------
  function trigo(ctx, t) { const V = S.trigo;
    phase(ctx, t, 46, 50, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 110, 'DÉFINITION', kd); txt(ctx, 'u est trigonalisable s’il existe une base dans laquelle sa matrice est triangulaire supérieure.', CX, 240, { fam: F.ui, w: 600, size: 26, a: kd });
      const kt = ap(t, V.th); carte(ctx, 460, 320, 1000, 130, 'THÉORÈME', kt); formule(ctx, 't_th', CX, 396, { fs: 38, mil: 1, a: kt }); tx(ctx, t, 'Sur le corps des complexes, toute matrice est donc trigonalisable.', CX, 510, V.surC, { c: C.cours, size: 30 });
      fo(ctx, t, 't_tr', CX, 610, 34, V.tr); fo(ctx, t, 't_ex', CX, 710, 30, V.ex); });
    phase(ctx, t, 50, 54, () => { const kd = ap(t, V.nil); carte(ctx, 260, 165, 620, 150, 'DÉFINITION', kd); txt(ctx, 'u est nilpotent :', 440, 262, { fam: F.ui, w: 600, size: 28, a: kd }); formule(ctx, 't_nil', 700, 250, { fs: 44, mil: 1, a: kd });
      const kt = ap(t, V.th7); carte(ctx, 940, 165, 720, 150, 'THÉORÈME', kt); formule(ctx, 't_7', 1220, 250, { fs: 36, mil: 1, a: kt }); formule(ctx, 't_n', 1560, 250, { fs: 36, mil: 1, a: kt });
      fo(ctx, t, 't_J', 520, 520, 44, V.J); const X = [1000, 1220, 1440, 1660], y = 520; fo(ctx, t, 't_e3', X[0], y, 46, V.J); ['t_e2', 't_e1', 't_0'].forEach((id, i) => { const k = ap(t, V.ch[i]); fl(ctx, [X[i] + 50, y], [X[i + 1] - 50, y], { c: C.orange, lw: 4, a: k }); formule(ctx, 't_Jf', (X[i] + X[i + 1]) / 2, y - 32, { fs: 30, mil: 1, a: k }); formule(ctx, id, X[i + 1], y, { fs: 46, mil: 1, a: k }); });
      tx(ctx, t, 'trois crans, puis zéro : l’indice de nilpotence de J vaut 3', 1330, 640, V.ch[2], { c: C.cours, size: 28 }); });
    legs(ctx, t, V, [['À défaut de diagonale, on vise une matrice triangulaire : c’est [trigonaliser].'], ['C’est possible exactement quand le polynôme caractéristique est scindé.'], ['La trace est alors la somme des valeurs propres, et le déterminant leur produit.'], ['Un endomorphisme [nilpotent] s’annule quand on le compose assez de fois avec lui-même.'], ['Sa seule valeur propre est 0, et il s’annule au plus tard à la puissance $n$.'], ['Cette matrice fait descendre chaque vecteur de base d’un cran.']]); }

  const ACTES_DEF = () => [acte(0, S.direction, FG.ech, posCercle, S.direction.sortie), acte(5, S.puissances, FB.ech, posFib, S.puissances.sortie)];
  function vignetteFig(ctx) { const F0 = { c: [1400, 500], u: 96 }; figA(ctx, 1, rad(45), { F: F0, lw: 6 }); const p = pv(Math.cos(rad(60)), Math.sin(rad(60)), F0); K.chienSur(ctx, p[0], p[1] - 2, 0.5, 2.6, { t: 0.3, allure: 'trot', phase: 0.2, face: -1 }); }
