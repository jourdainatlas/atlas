  const PREMIERS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
  const cell = (ctx, s, x, y, w, h, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; cadre(ctx, x, y, w, h, { fill: o.fill || C.surface, stroke: o.stroke || C.filet, lw: o.lw || 2, r: 8, a }); txt(ctx, s, x, y + (o.size || 28) * 0.36, { fam: F.main, w: 400, size: o.size || 28, c: o.c || C.encre, a }); };

  // ---------- 1. diviser, être un multiple ----------
  function divise(ctx, t) { const V = S.divise;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 460, 165, 1000, 150, 'DÉFINITION', kd); formule(ctx, 'd_def', CX, 250, { fs: 48, mil: 1, a: kd });
      fo(ctx, t, 'd_1', CX, 410, 46, V.ex1); fo(ctx, t, 'd_2', CX, 530, 42, V.ex2); const kr = ap(t, V.regle); cadre(ctx, CX, 680, 1000, 100, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kr }); formule(ctx, 'd_r', CX, 680, { fs: 42, mil: 1, a: kr }); });
    legs(ctx, t, V, [['Dire que $a$ [divise] $b$, c’est dire que $b$ est un [multiple] de $a$.'], ['Un diviseur commun à deux entiers divise toutes leurs combinaisons à coefficients entiers.']]); }

  // ---------- 2. la division euclidienne ----------
  const X2 = (v) => 150 + v * 33, Y2 = 560;
  const posDiv = (t) => { const V = S.euclide, s = 9 * pr(t, V.sauts[0], V.sauts[1] - V.sauts[0]), i = Math.min(8, Math.floor(s)), k = s >= 9 ? 1 : s - i, r = 2 * doux(pr(t, V.reste[0], V.reste[1] - V.reste[0])), enl = s > 0 && s < 9;
    return { p: [X2(5 * (i + k) + r), Y2 - (enl ? 46 * Math.sin(Math.PI * k) : 0)], q: s >= 9 ? 9 : i + (k > 0.98 ? 1 : 0), r, pose: enl ? { t, allure: 'vol', vol: Math.sin(Math.PI * k), tang: 0.25 * Math.cos(Math.PI * k) } : undefined, marche: r > 0 && r < 2, assis: r >= 2 ? doux(pr(t, V.reste[1], 0.4)) : undefined }; };
  function euclide(ctx, t) { const V = S.euclide;
    phase(ctx, t, 6, 14, () => { const kt = ap(t, V.th); carte(ctx, 460, 165, 1000, 150, 'THÉORÈME', kt); formule(ctx, 'e_th', CX, 250, { fs: 50, mil: 1, a: kt });
      phase(ctx, t, 6, 12.1, () => { const ka = ap(t, V.axe, 0.8), c = posDiv(t), go = t > V.sauts[0]; axeGradue(ctx, X2, Y2, -1, 51, [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50], ka, { size: 26 });
        pt(ctx, [X2(47), Y2], { c: C.encre, r: 9, a: ka }); txt(ctx, '47', X2(47), Y2 - 150, { fam: F.main, w: 400, size: 40, a: ka }); seg(ctx, [X2(47), Y2 - 130], [X2(47), Y2 - 14], { c: C.gm, lw: 2.5, dash: [6, 8], a: ka });
        if (go) { for (let i = 0; i < c.q; i++) { ctx.save(); ctx.strokeStyle = C.cours; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(X2(5 * i + 2.5), Y2, 82.5, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.restore(); } seg(ctx, [X2(45), Y2], [X2(45 + c.r), Y2], { c: C.orange, lw: 9 }); }
        txt(ctx, `quotient : ${c.q}`, 700, 720, { fam: F.ui, w: 600, size: 36, c: C.cours, a: ap(t, V.sauts[0]) }); txt(ctx, `reste : ${K.fr(c.r, 0)}`, 1000, 720, { fam: F.ui, w: 600, size: 36, c: C.orange, a: ap(t, V.reste[0]) }); fo(ctx, t, 'e_47', 1420, 708, 48, V.egal); });
      phase(ctx, t, 12.1, 14, () => { fo(ctx, t, 'e_n', CX, 450, 60, V.neg); fo(ctx, t, 'e_n2', CX, 610, 50, V.negr); }); });
    legs(ctx, t, V, [['Diviser $a$ par $b$, c’est l’encadrer par deux multiples consécutifs de $b$.'], ['On avance de 5 en 5 tant que l’on ne dépasse pas 47 : neuf bonds.'], ['Ce qui manque est le [reste] : il est toujours plus petit que le diviseur.'], ['Même pour un entier négatif, le reste est positif : le quotient est alors −10, et non −9.']]); }

  // ---------- 3. les nombres premiers ----------
  function crible(ctx, t) { const V = S.crible;
    phase(ctx, t, 14, 22, () => { const kg = ap(t, V.grille, 0.8), kp = ap(t, V.premiers);
      for (let n = 1; n <= 100; n++) { const i = (n - 1) % 10, j = Math.floor((n - 1) / 10), x = 170 + i * 76, y = 196 + j * 60, k = borne(kg * 2.5 - j * 0.12); if (k <= 0) continue;
        let raye = n === 1 ? ap(t, V.def) : 0, coul = C.encre3; [2, 3, 5, 7].forEach((p, q) => { if (n > p && n % p === 0 && !raye) { raye = ap(t, V.raye[q] + ((n / p) % 10) * 0.05, 0.3); coul = [C.bleu, C.orange, VRAI, VIOLET][q]; } });
        const prem = PREMIERS.includes(n); cell(ctx, String(n), x, y, 68, 52, { a: k * (1 - 0.72 * raye), size: 26, stroke: prem && kp > 0 ? C.cours : raye > 0 ? coul : C.filet, fill: prem && kp > 0.5 ? 'rgba(53,202,164,0.20)' : C.surface, c: prem ? C.encre : C.encre2, lw: prem && kp > 0 ? 3 : 2 }); }
      const kd = ap(t, V.def); carte(ctx, 1010, 180, 850, 190, 'DÉFINITION', kd); txt(ctx, 'Un nombre premier est un entier naturel', 1440, 262, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'qui a exactement deux diviseurs.', 1440, 310, { fam: F.ui, w: 600, size: 30, c: C.rouge, a: kd });
      ['multiples de 2', 'multiples de 3', 'multiples de 5', 'multiples de 7'].forEach((s, q) => tx(ctx, t, s, 1230 + (q % 2) * 420, 450 + Math.floor(q / 2) * 60, V.raye[q], { c: [C.bleu, C.orange, VRAI, VIOLET][q] }));
      tx(ctx, t, '25 nombres premiers jusqu’à 100', 1440, 610, V.premiers, { c: C.cours, size: 36 }); fo(ctx, t, 'k_r', 1230, 700, 40, V.racine); tx(ctx, t, ': on s’arrête à 7', 1560, 712, V.racine, { size: 32 }); });
    legs(ctx, t, V, [['Un [nombre premier] n’a que deux diviseurs : 1 et lui-même. Le nombre 1 n’en est pas un.'], ['Le crible d’Ératosthène : on raye les multiples de chaque nombre premier trouvé.'], ['Ceux qui restent sont les nombres premiers.'], ['Un entier qui n’est pas premier a un diviseur premier inférieur ou égal à sa racine carrée.']]); }

  // ---------- 4. une infinité de nombres premiers ----------
  function infinite(ctx, t) { const V = S.infinite;
    phase(ctx, t, 22, 26, () => { const kp = ap(t, V.prop); carte(ctx, 510, 165, 900, 140, 'PROPRIÉTÉ', kp); txt(ctx, 'Il existe une infinité de nombres premiers.', CX, 254, { fam: F.ui, w: 600, size: 36, a: kp });
      fo(ctx, t, 'i_1', CX, 400, 50, V.n1); fo(ctx, t, 'i_2', CX, 510, 34, V.r); tx(ctx, t, 'divisible par aucun d’eux : c’est un nouveau nombre premier', CX, 580, V.r, { c: C.cours, size: 28 }); fo(ctx, t, 'i_3', CX, 700, 36, V.n2); });
    legs(ctx, t, V, [['L’idée d’Euclide : multiplier tous les nombres premiers d’une liste, et ajouter 1.'], ['Le résultat n’est pas toujours premier, mais ses diviseurs premiers sont hors de la liste.']]); }

  // ---------- 5. la décomposition en facteurs premiers ----------
  function tfa(ctx, t) { const V = S.tfa;
    phase(ctx, t, 26, 34, () => { const kl = ap(t, V.lemme); carte(ctx, 110, 165, 840, 150, 'LEMME D’EUCLIDE', kl); formule(ctx, 't_l', 540, 252, { fs: 34, mil: 1, a: kl });
      const kt = ap(t, V.th); carte(ctx, 990, 165, 820, 240, 'THÉORÈME FONDAMENTAL', kt); txt(ctx, 'Tout entier au moins égal à 2 s’écrit de façon unique', 1400, 250, { fam: F.ui, w: 500, size: 27, a: kt }); txt(ctx, 'comme un produit de nombres premiers.', 1400, 290, { fam: F.ui, w: 500, size: 27, a: kt }); formule(ctx, 't_g', 1400, 352, { fs: 34, mil: 1, a: kt });
      const A = V.arbre, N0 = [540, 400], n = (s, p, k, c) => cell(ctx, s, p[0], p[1], 84, 60, { a: k, size: 34, stroke: c || C.gm, lw: c ? 3 : 2 }), br = (p, q, k) => seg(ctx, [p[0], p[1] + 30], [q[0], q[1] - 30], { c: C.gm, lw: 3, k });
      const k0 = ap(t, A[0] - 0.8), k1 = ap(t, A[0]), k2 = ap(t, A[1]), k3 = ap(t, A[2]), P = { a: [420, 500], b: [660, 500], c: [540, 600], d: [780, 600], e: [660, 700], f: [900, 700] };
      br(N0, P.a, k1); br(N0, P.b, k1); br(P.b, P.c, k2); br(P.b, P.d, k2); br(P.d, P.e, k3); br(P.d, P.f, k3);
      n('84', N0, k0); n('2', P.a, k1, C.bleu); n('42', P.b, k1); n('2', P.c, k2, C.bleu); n('21', P.d, k2); n('3', P.e, k3, C.orange); n('7', P.f, k3, VIOLET);
      fo(ctx, t, 't_84', 1400, 600, 64, V.dec); });
    legs(ctx, t, V, [['Un nombre premier qui divise un produit divise l’un de ses facteurs.'], ['On en tire l’unicité de la [décomposition en facteurs premiers].'], ['On divise par le plus petit nombre premier possible, autant de fois qu’il le faut.'], ['Quel que soit le chemin suivi, les facteurs obtenus sont les mêmes.']]); }

  // ---------- 6. compter les diviseurs ----------
  function diviseurs(ctx, t) { const V = S.diviseurs;
    phase(ctx, t, 34, 42, () => { formule(ctx, 't_84', CX, 200, { fs: 50, mil: 1, a: ap(t, V.t1 - 0.3) });
      [[0, V.t1, 'h70'], [1, V.t2, 'h71']].forEach(([s, t0, hid]) => { const x0 = 250 + s * 760, k = ap(t, t0); formule(ctx, hid, x0 + 250, 290, { fs: 38, mil: 1, a: k });
        ['h20', 'h21', 'h22'].forEach((id, i) => formule(ctx, id, x0 + 150 + i * 150, 360, { fs: 34, mil: 1, a: k })); ['h30', 'h31'].forEach((id, j) => formule(ctx, id, x0 + 30, 440 + j * 90, { fs: 34, mil: 1, a: k }));
        for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) cell(ctx, String(2 ** i * 3 ** j * 7 ** s), x0 + 150 + i * 150, 440 + j * 90, 130, 72, { a: ap(t, t0 + 0.3 + (j * 3 + i) * 0.35), size: 36, stroke: s ? VIOLET : C.gm }); });
      fo(ctx, t, 'v_c', 680, 690, 46, V.compte); tx(ctx, t, 'diviseurs', 1160, 702, V.compte, { size: 34, c: C.cours }); fo(ctx, t, 'v_g2', 1560, 678, 30, V.gen); tx(ctx, t, 'en général', 1560, 740, V.gen, { size: 24, c: C.encre2, w: 500 }); });
    phase(ctx, t, 42, 46, () => { const kg = 1; carte(ctx, 310, 165, 1300, 200, 'PROPRIÉTÉ', kg); formule(ctx, 'b_t', 660, 268, { fs: 38, mil: 1 }); txt(ctx, 'possède', 1010, 280, { fam: F.ui, w: 600, size: 28 }); formule(ctx, 'v_g2', 1340, 268, { fs: 32, mil: 1 }); txt(ctx, 'diviseurs positifs', 1340, 336, { fam: F.ui, w: 600, size: 26, c: C.cours });
      ['v_f1', 'v_f2', 'v_f3'].reduce((x, id, i) => { const fs = i === 2 ? 64 : 52; formule(ctx, id, x, 570, { fs, mil: 1, align: 'left', a: ap(t, V.frac[i]), monte: 1 }); return x + largeur(id, fs) + 22; }, 560); });
    legs(ctx, t, V, [['Un diviseur de 84 n’utilise que les facteurs premiers de 84 :', 'on choisit combien de fois prendre chacun.'], ['Avec ou sans le facteur 7 : deux tableaux de six diviseurs.'], ['Trois choix pour l’exposant de 2, deux pour celui de 3, deux pour celui de 7.'], ['La règle vaut pour tout entier : on ajoute 1 à chaque exposant, puis on multiplie.'], ['La décomposition fait aussi apparaître les facteurs communs : on simplifie d’un coup d’œil.']]); }

  const ACTES_DEF = () => [acte(1, S.euclide, 2.6, posDiv, S.euclide.sortie)];
  function vignetteFig(ctx) { const n = (s, x, y, c) => cell(ctx, s, x, y, 150, 104, { size: 62, stroke: c || C.gm, lw: 5 }), br = (a, b) => seg(ctx, [a[0], a[1] + 52], [b[0], b[1] - 52], { c: C.gm, lw: 5 }), P = [[1360, 270], [1180, 440], [1540, 440], [1360, 610], [1720, 610]];
    br(P[0], P[1]); br(P[0], P[2]); br(P[2], P[3]); br(P[2], P[4]); n('12', ...P[0]); n('2', ...P[1], C.bleu); n('6', ...P[2]); n('2', ...P[3], C.bleu); n('3', ...P[4], C.orange); K.chienSur(ctx, 1020, 760, 0, 4.6, { t: 0.4, assis: 1, tete: -0.25 }); formule(ctx, 'b_d', 520, 700, { fs: 60, mil: 1 }); }

