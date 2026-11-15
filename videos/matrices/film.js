// LE FILM — « Les matrices », Terminale Maths expertes, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le produit est le cœur du chapitre : le chien y porte chaque coefficient calculé jusqu'à sa case.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Les matrices', NIVEAU = 'MATHS EXPERTES', LONG = 'TERMINALE MATHS EXPERTES · CHAPITRE 3', NB_EXERCICES = 28;

  // coche (vrai) ou croix (faux)
  function marque(ctx, x, y, r, ok, k) {
    if (k <= 0) return; ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2); ctx.translate(x, y); ctx.scale(ressort(k), ressort(k)); ctx.strokeStyle = ok ? VRAI : FAUX; ctx.lineWidth = r * 0.3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); if (ok) { ctx.moveTo(-r * 0.8, 0); ctx.lineTo(-r * 0.2, r * 0.6); ctx.lineTo(r * 0.9, -r * 0.7); } else { ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7); ctx.moveTo(r * 0.7, -r * 0.7); ctx.lineTo(-r * 0.7, r * 0.7); }
    ctx.stroke(); ctx.restore();
  }
  // carte de définition (filet rouge, comme sur le site) ou de propriété (filet turquoise)
  function carte(ctx, x, y, w, h, genre, a) {
    if (a <= 0) return; const c = genre === 'DÉFINITION' ? C.rouge : C.cours;
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fillStyle = C.surface; ctx.fill(); ctx.fillStyle = c; ctx.fillRect(x, y, 5, h);
    txt(ctx, genre, x + 32, y + 42, { fam: F.mono, w: 700, size: 20, ls: 3, c, align: 'left' }); ctx.restore();
  }

  // ---------- intertitre : avant chaque partie, une mesure (quatre secondes) où son titre occupe seul l'écran. ----------
  // Trois temps qui ne se recouvrent pas : la scène précédente s'efface (0 à 0,5 s), le titre paraît, tient, puis
  // s'efface (0,6 à 3,5 s), et la scène suivante se découvre (3,6 à 4 s). Le jardin reste visible tout du long.
  function intertitre(ctx, t) {
    for (const it of S.intertitres) { const u = t - it.t; if (u <= 0 || u >= S.INTER) continue;
      const voile = Math.min(doux(pr(u, 0, 0.5)), 1 - doux(pr(u, S.INTER - 0.4, 0.4))), k = Math.min(sortie(pr(u, 0.6, 0.5)), 1 - doux(pr(u, S.INTER - 0.9, 0.4)));
      ctx.save(); ctx.globalAlpha = voile; ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, 884); ctx.restore();
      if (k <= 0) continue;
      ctx.save(); ctx.globalAlpha = k;
      if (it.rang) txt(ctx, it.rang, CX, 372, { fam: F.mono, w: 500, size: 28, ls: 6, c: C.encre3 });
      txt(ctx, it.nom, CX, 478 + (1 - sortie(pr(u, 0.6, 0.6))) * 22, { size: 84, w: 800 });
      ctx.restore(); }
  }

  // ---------- en-tête ----------
  function entete(ctx, t) {
    const a = fen(t, L(2) + 0.2, L(S.FIN) - 0.1, 0.5); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.logo(ctx, 78, 74, 60);
    txt(ctx, `${TITRE.toUpperCase()} · ${NIVEAU}`, 126, 62, { fam: F.mono, w: 500, size: 20, ls: 3, c: C.encre3, align: 'left' });
    for (const [nom, t0, t1] of [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(S.BILAN), L(S.FIN)]]) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(2) - 0.6, 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 300, 210, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, LONG, CX, 478, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Calculer avec des {tableaux de nombres}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- 1. le vocabulaire ----------
  function vocab(ctx, t) {
    const V = S.vocab, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const x = 620, y = 320, fs = 84, kc = ap(t, V.coef);
    formule(ctx, 'v_A', x, y, { fs, mil: 1, a: ap(t, V.A) * (1 - kc), monte: 1 }); formule(ctx, 'v_A12', x, y, { fs, mil: 1, a: kc });
    txt(ctx, '2 lignes', x - 478, y + 10, { fam: F.ui, w: 600, size: 32, c: C.bleu, a: ap(t, V.lignes) });
    txt(ctx, '3 colonnes', x + 78, y - 128, { fam: F.ui, w: 600, size: 32, c: C.orange, a: ap(t, V.colonnes) });
    const kd = ap(t, V.dim); txt(ctx, 'dimension', 1340, y - 52, { fam: F.mono, w: 500, size: 24, ls: 3, c: C.encre3, a: kd }); formule(ctx, 'v_dim', 1340, y + 20, { fs: 76, mil: 1, a: kd, monte: 1 });
    formule(ctx, 'v_a12', 1340, y + 132, { fs: 50, mil: 1, a: kc, monte: 1 });
    [['v_l', 'matrice ligne', 430, 50], ['v_c', 'matrice colonne', 960, 44], ['v_i', 'matrice identité', 1480, 44]].forEach(([id, nom, cx, f], i) => { const k = ap(t, V.types[i]);
      formule(ctx, id, cx, 600, { fs: f, mil: 1, a: k, monte: 1 }); txt(ctx, nom, cx, 742, { fam: F.ui, w: 500, size: 28, c: C.encre2, a: k }); });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une [matrice] de dimension $n$ × $p$ est un tableau de nombres', 'à $n$ lignes et $p$ colonnes.']);
    legende(ctx, t, V.leg[1], ['Chaque nombre est un [coefficient], repéré par sa ligne puis par sa colonne.']);
  }

  // ---------- 2. somme et produit par un réel ----------
  function somme(ctx, t) {
    const V = S.somme, a = fen(t, L(6) + 0.1, L(10), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const w = formule(ctx, 's_ab', 80, 250, { fs: 50, mil: 1, align: 'left', a: ap(t, V.ab), monte: 1 });
    const w2 = formule(ctx, 's_i', 80 + w + 22, 250, { fs: 50, mil: 1, align: 'left', a: ap(t, V.inter), monte: 1 });
    formule(ctx, 's_r', 80 + w + 22 + w2 + 22, 250, { fs: 50, mil: 1, align: 'left', a: ap(t, V.res), monte: 1 });
    const wk = formule(ctx, 'k_a', 520, 560, { fs: 50, mil: 1, align: 'left', a: ap(t, V.ka), monte: 1 });
    formule(ctx, 'k_r', 520 + wk + 22, 560, { fs: 50, mil: 1, align: 'left', a: ap(t, V.kr), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Deux matrices de {même dimension} s’additionnent coefficient par coefficient.']);
    legende(ctx, t, V.leg[1], ['Multiplier une matrice par un réel, c’est multiplier chacun de ses coefficients.']);
  }

  // ---------- 3. le produit ----------
  // Disposition « au brouillon » du cours : B au-dessus, A à gauche, le produit à leur croisement.
  const PR = { ax: 560, bx: 1010, yh: 300, yb: 540, fs: 64, sol: 716, attente: 1560, dx: 73, dy: 38, kx: 1560, ky: 470 };
  const caseC = (i, j) => [PR.bx + (j ? PR.dx : -PR.dx), PR.yb + (i ? PR.dy : -PR.dy)];
  function etiquette(ctx, id, x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; cadre(ctx, x, y, 78, 54, { fill: C.surface, stroke: C.cours, lw: 2.5, r: 10 }); formule(ctx, id, x, y, { fs: 38, mil: 1 }); ctx.restore(); }
  function produit(ctx, t) {
    const V = S.produit, a = fen(t, L(10) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const k0 = fen(t, V.dim, V.tableau, 0.4);
    if (k0 > 0) { formule(ctx, 'p_dim', CX, 300, { fs: 84, mil: 1, a: k0 * ap(t, V.dim), monte: 1 }); formule(ctx, 'p_cij', CX, 580, { fs: 66, mil: 1, a: k0 * ap(t, V.cij), monte: 1 }); }
    const k1 = ap(t, V.tableau, 0.6);
    if (k1 > 0) {
      let s = -1; V.pas.forEach((p, q) => { if (t >= p.eclaire) s = q; }); const P = s >= 0 ? V.pas[s] : null, i = s >> 1, j = s & 1, e = P ? fen(t, P.eclaire, P.T0 + 7.6, 0.3) : 0;
      ctx.save(); ctx.globalAlpha *= k1;
      formule(ctx, 'p_nA', PR.ax - 205, PR.yb, { fs: 46, mil: 1, align: 'right' }); formule(ctx, 'p_nB', PR.bx - 150, PR.yh, { fs: 46, mil: 1, align: 'right' });
      formule(ctx, 'p_A', PR.ax, PR.yb, { fs: PR.fs, mil: 1, a: 1 - e }); formule(ctx, 'p_B', PR.bx, PR.yh, { fs: PR.fs, mil: 1, a: 1 - e });
      if (e > 0) { formule(ctx, i ? 'p_A2' : 'p_A1', PR.ax, PR.yb, { fs: PR.fs, mil: 1, a: e }); formule(ctx, j ? 'p_B2' : 'p_B1', PR.bx, PR.yh, { fs: PR.fs, mil: 1, a: e }); }
      formule(ctx, 'p_C', PR.bx, PR.yb, { fs: PR.fs, mil: 1 });
      V.pas.forEach((p, q) => { const [x, y] = caseC(q >> 1, q & 1); formule(ctx, `p_r${(q >> 1) + 1}${(q & 1) + 1}`, x, y, { fs: PR.fs, mil: 1, a: ap(t, p.pose, 0.25) }); });
      ctx.strokeStyle = C.gl; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(880, PR.sol + 2); ctx.lineTo(W + 10, PR.sol + 2); ctx.stroke();       // la tablette où trotte le chien
      if (P) { const id = `${i + 1}${j + 1}`, kc = fen(t, P.calcul, P.T0 + 7.6, 0.3), wk = largeur('p_k' + id, 40), we = largeur('p_e' + id, 40), x0 = PR.kx - (wk + we + 12) / 2;
        txt(ctx, `ligne ${i + 1} × colonne ${j + 1}`, PR.kx, PR.ky - 70, { fam: F.mono, w: 500, size: 24, ls: 2, c: C.encre3, a: kc });
        formule(ctx, 'p_k' + id, x0, PR.ky, { fs: 40, mil: 1, align: 'left', a: kc }); formule(ctx, 'p_e' + id, x0 + wk + 12, PR.ky, { fs: 40, mil: 1, align: 'left', a: kc * ap(t, P.res, 0.3) }); }
      ctx.restore();
    }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Le produit $AB$ existe quand $A$ a autant de {colonnes} que $B$ a de {lignes}.']);
    legende(ctx, t, V.leg[1], ['Chaque coefficient est le produit d’une {ligne} de $A$ par une {colonne} de $B$.']);
    legende(ctx, t, V.leg[2], ['Ligne 1 de $A$, colonne 1 de $B$ : on multiplie terme à terme, puis on additionne.']);
    legende(ctx, t, V.leg[3], ['Ligne 1, colonne 2 : le résultat se range à la ligne 1 et à la colonne 2.']);
    legende(ctx, t, V.leg[4], ['On procède de même avec la seconde ligne de $A$ : le produit est une matrice 2 × 2.']);
  }

  // ---------- 4. l'ordre compte ----------
  function ordre(ctx, t) {
    const V = S.ordre, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    [['n_AB', 'n_ab', V.ab, 270], ['n_BA', 'n_ba', V.ba, 470]].forEach(([nom, id, tt, y]) => { const k = ap(t, tt); formule(ctx, nom, 250, y, { fs: 52, mil: 1, a: k }); formule(ctx, 'eg', 345, y, { fs: 52, mil: 1, a: k }); formule(ctx, id, 400, y, { fs: 60, mil: 1, align: 'left', a: k, monte: 1 }); });
    const kn = ap(t, V.ne); ctx.save(); ctx.translate(1480, 370); ctx.scale(ressort(kn), ressort(kn)); formule(ctx, 'n_ne', 0, 0, { fs: 96, mil: 1, a: Math.min(1, kn * 2) }); ctx.restore();
    const ki = ap(t, V.id); txt(ctx, 'La matrice identité, elle, ne change rien :', 700, 668, { fam: F.ui, w: 500, size: 30, c: C.encre2, a: ki }); formule(ctx, 'n_id', 1300, 656, { fs: 52, mil: 1, a: ki, monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Changeons l’ordre des deux matrices : le résultat n’est plus le même.']);
    legende(ctx, t, V.leg[1], ['Le produit de matrices n’est {pas commutatif} : en général, $AB$ ≠ $BA$.']);
  }

  // ---------- 5. les puissances ----------
  function puissance(ctx, t) {
    const V = S.puissance, a = fen(t, L(26) + 0.1, L(30), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    formule(ctx, 'u_def', 760, 290, { fs: 72, mil: 1, a: ap(t, V.def), monte: 1 }); formule(ctx, 'u_0', 1480, 268, { fs: 60, mil: 1, a: ap(t, V.zero), monte: 1 });
    ['u_D', 'u_D2', 'u_D3', 'u_Dk'].forEach((id, i) => formule(ctx, id, 270 + i * 460, 600, { fs: 52, mil: 1, a: ap(t, V.D[i]), monte: 1 }));
    ctx.restore();
    legende(ctx, t, V.leg[0], ['La [puissance] $k$-ième d’une matrice carrée est son produit par elle-même, $k$ fois.']);
    legende(ctx, t, V.leg[1], ['Pour une matrice {diagonale}, on élève chaque coefficient de la diagonale à la puissance $k$.']);
  }

  // ---------- 6. l'inverse ----------
  function inverse(ctx, t) {
    const V = S.inverse, a = fen(t, L(30) + 0.1, L(42), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(30) + 0.1, L(34), 0.4);                                                    // définition et exemple du cours
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      const kd = ap(t, V.def); carte(ctx, 120, 170, 700, 250, 'DÉFINITION', kd); formule(ctx, 'i_def', 470, 300, { fs: 66, mil: 1, a: kd }); formule(ctx, 'i_not', 470, 378, { fs: 44, mil: 1, a: ap(t, V.not) });
      const ke = ap(t, V.ex); formule(ctx, 'i_A', 1090, 260, { fs: 54, mil: 1, a: ke, monte: 1 }); formule(ctx, 'i_B', 1560, 260, { fs: 54, mil: 1, a: ke, monte: 1 });
      const w1 = formule(ctx, 'i_p1', 330, 600, { fs: 54, mil: 1, align: 'left', a: ap(t, V.p[0]), monte: 1 }), w2 = formule(ctx, 'i_p2', 330 + w1 + 24, 600, { fs: 54, mil: 1, align: 'left', a: ap(t, V.p[1]), monte: 1 });
      formule(ctx, 'i_p3', 330 + w1 + w2 + 48, 600, { fs: 64, mil: 1, align: 'left', a: ap(t, V.p[2]), monte: 1 }); ctx.restore(); }
    k = fen(t, L(34) + 0.1, L(38), 0.4);                                                        // déterminant, puis critère et formule
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      const kd = ap(t, V.det); carte(ctx, 120, 170, 800, 250, 'DÉFINITION', kd); formule(ctx, 'd_def', 520, 318, { fs: 54, mil: 1, a: kd });
      formule(ctx, 'd_ex', 1420, 300, { fs: 46, mil: 1, a: ap(t, V.dex), monte: 1 });
      const kp = ap(t, V.prop); carte(ctx, 120, 470, 1680, 250, 'PROPRIÉTÉ', kp); formule(ctx, 'd_prop', 560, 610, { fs: 50, mil: 1, a: kp }); formule(ctx, 'd_inv', 1380, 606, { fs: 54, mil: 1, a: ap(t, V.inv), monte: 1 }); ctx.restore(); }
    k = fen(t, L(38) + 0.1, L(42), 0.4);                                                        // application, puis une matrice sans inverse
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      const w1 = formule(ctx, 'a_1', 330, 280, { fs: 58, mil: 1, align: 'left', a: ap(t, V.a[0]), monte: 1 }), w2 = formule(ctx, 'a_2', 330 + w1 + 24, 280, { fs: 58, mil: 1, align: 'left', a: ap(t, V.a[1]), monte: 1 });
      formule(ctx, 'a_3', 330 + w1 + w2 + 48, 280, { fs: 64, mil: 1, align: 'left', a: ap(t, V.a[2]), monte: 1 });
      formule(ctx, 'z_1', 480, 600, { fs: 58, mil: 1, a: ap(t, V.z[0]), monte: 1 }); txt(ctx, 'déterminant :', 800, 612, { fam: F.ui, w: 500, size: 30, c: C.encre2, a: ap(t, V.z[1]) }); formule(ctx, 'z_2', 1160, 600, { fs: 50, mil: 1, a: ap(t, V.z[1]), monte: 1 });
      const kz = ap(t, V.z[2]); marque(ctx, 1480, 600, 22, false, kz); txt(ctx, 'pas d’inverse', 1520, 611, { fam: F.ui, w: 600, size: 32, c: FAUX, align: 'left', a: kz }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une matrice carrée $A$ est [inversible] s’il existe une matrice $B$', 'telle que $AB$ = $BA$ = $I$.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Vérifions sur l’exemple du cours : le produit donne bien la matrice identité.']);
    legende(ctx, t, V.leg[2], ['Le [déterminant] d’une matrice 2 × 2 est le nombre $ad$ − $bc$.']);
    legende(ctx, t, V.leg[3], ['Une matrice 2 × 2 est inversible si, et seulement si, son déterminant n’est pas nul.']);
    legende(ctx, t, V.leg[4], ['On échange $a$ et $d$, on change le signe de $b$ et de $c$,', 'puis on divise par le déterminant.'], { size: 40 });
    legende(ctx, t, V.leg[5], ['Si le déterminant est nul, la matrice n’a pas d’inverse.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    const B = S.bilan, a = fen(t, L(S.BILAN) + 0.1, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    txt(ctx, 'Trois règles de calcul', CX, 215, { size: 56, w: 700, a: ap(t, B.titre) });
    const XC = [400, 960, 1520], ID = ['b_s', 'b_p', 'b_i'], TX = [['Somme : coefficient par coefficient,', 'entre matrices de même dimension.'], ['Produit : une ligne par une colonne.', 'L’ordre des facteurs compte.'], ['Inverse d’une matrice 2 × 2 :', 'elle existe si le déterminant n’est pas nul.']];
    B.cartes.forEach((tc, i) => { const k = ap(t, tc); if (k <= 0) return; const cx = XC[i];
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, 500, 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      formule(ctx, ID[i], cx, 395, { fs: 62, mil: 1 });
      txt(ctx, TX[i][0], cx, 560, { size: 27, w: 600 }); txt(ctx, TX[i][1], cx, 602, { size: 27, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, 'Les matrices se calculent presque comme des nombres : {presque}.', CX, 745 + (1 - kp) * 20, { size: 50, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 100, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (300 + 250 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
  const melange = (dom, g) => { const r = alea(g); return K.FEUILLES.map(() => (r() < 0.6 ? dom : RUBC[Math.floor(r() * 5)])); };
  const ARBRES = S.CH.map((c, k) => ({ x: XS[k], ne: c.plante, ech: 2.05, miroir: k % 2 ? -1 : 1, coul: melange(C.cours, 57 + k) }));
  function jardinierA(t) {
    const fd = (a, b) => Math.min(doux(pr(t, a, 0.15)), 1 - doux(pr(t, b - 0.15, 0.15)));
    let x = lerp(-40, STAND[0], doux(pr(t, J.entree[0], J.entree[1] - J.entree[0]))), marche = fd(...J.entree), arrose = 0, verse = false;
    J.marche.forEach(([a, b], k) => { x += (STAND[k + 1] - STAND[k]) * doux(pr(t, a, b - a)); marche = Math.max(marche, fd(a, b)); });
    for (const [a, b] of J.arrose) { arrose = Math.max(arrose, Math.min(doux(pr(t, a, 0.3)), 1 - doux(pr(t, b - 0.3, 0.3)))); if (t > a + 0.25 && t < b - 0.25) verse = true; }
    const libre = (1 - marche) * (1 - arrose) * doux(pr(t, J.entree[1], 0.5)) * (1 - doux(pr(t, S.fin.t0 - 0.5, 0.5)));      // il regarde la leçon
    return { x, t, marche, phase: x * globalThis.JARDINIER.PAS_MARCHE, elan: 0, arrose, verse, tete: 0.1 * arrose - 0.3 * libre, geste: { nom: 'regard', k: libre }, chapeau: Math.sin(Math.PI * pr(t, S.fin.chapeau, 1.4)) };
  }
  // le chien : il arrive par la droite pendant l'ouverture, puis suit le jardinier d'arbre en arbre
  const DEHORS = LU + 34;
  // Le chien est l'acteur du produit (voir acteur) : il quitte le jardin par la droite, entre par la droite sur la
  // tablette tracée sous le calcul, reçoit chaque coefficient calculé, le porte sous sa case et l'y dépose d'un petit
  // bond, puis repart par la droite et rentre au jardin par le même bord pendant l'intertitre suivant.
  const PP = S.produit, DERN = PP.pas[3], EN_SCENE = [];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => k === 2 ? [a + 0.3, a + 2.4, DEHORS, DS[3]] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [PP.tableau - 0.6, PP.entree, DS[2], DEHORS]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    const ECH = 3.0, tIn = PP.entree + 0.2, tOut = DERN.retour[0]; if (t < tIn || t > tOut + 2) return;
    const trot = (x) => ({ t, allure: 'trot', phase: x / ECH * 0.33 }), assis = (k) => ({ t, assis: k, tete: -0.2, queue: { a: -0.35, amp: 0.4, f: 8, courbe: -0.12 } });
    let x = PR.attente, y = PR.sol, face = -1, pose = assis(1), carte = null;
    if (t < PP.pas[0].T0) { const k = doux(pr(t, tIn, 1.5)); x = lerp(W + 130, PR.attente, k); pose = k < 1 ? trot(x) : assis(doux(pr(t, tIn + 1.5, 0.4))); }
    for (const [q, P] of PP.pas.entries()) { if (t < P.T0 || t >= P.T0 + 8) continue;
      const id = `p_r${(q >> 1) + 1}${(q & 1) + 1}`, [cx, cy] = caseC(q >> 1, q & 1), xc = cx + 62, gueule = (xx, yy) => [xx - 44, yy - 84];
      if (t < P.part) { pose = assis(1 - doux(pr(t, P.chute, 0.4))); if (t >= P.chute) { const u = doux(pr(t, P.chute, 0.4)), [gx, gy] = gueule(x, y); carte = [id, lerp(PR.kx + 60, gx, u), lerp(PR.ky, gy, u), 1]; } }
      else if (t < P.arrive) { x = lerp(PR.attente, xc, doux(pr(t, P.part, P.arrive - P.part))); pose = trot(x); carte = [id, ...gueule(x, y), 1]; }
      else if (t < P.retour[0]) { const u = pr(t, P.arrive, 0.5), h = Math.sin(Math.PI * u); x = xc; y = PR.sol - 30 * h; pose = { t, allure: 'vol', vol: h, tang: 0, tete: -0.45 };       // petit bond, la carte s'envole vers sa case
        const [gx, gy] = gueule(x, y), v = doux(u); carte = [id, lerp(gx, cx, v), lerp(gy, cy, v), 1 - pr(t, P.pose - 0.1, 0.2)]; }
      else if (q < 3) { const k = doux(pr(t, P.retour[0], P.retour[1] - P.retour[0])); x = lerp(xc, PR.attente, k); face = k < 1 ? 1 : -1; pose = k < 1 ? trot(x) : assis(doux(pr(t, P.retour[1], 0.35))); }
      else { x = lerp(xc, W + 150, doux(pr(t, tOut, 1.9))); face = 1; pose = trot(x); } }
    if (t >= tOut + 0.01 && t >= DERN.T0 + 8) return;
    K.chienSur(ctx, x, y, 0, ECH, { ...pose, face });
    if (carte) etiquette(ctx, carte[0], carte[1], carte[2], carte[3]);
  }
  function chienA(t) {
    let x = DEHORS, bouge = 0, face = -1;
    for (const [a, b, xa, xb] of TRAJETS) { if (t >= a) x = lerp(xa, xb, doux(pr(t, a, b - a))); bouge = Math.max(bouge, Math.min(pr(t, a - 0.35, 0.3), 1 - pr(t, b, 0.3))); if (xb > xa) face += 2 * (doux(pr(t, a - 0.3, 0.3)) - doux(pr(t, b, 0.3))); }
    const assis = 1 - doux(bouge), trotte = TRAJETS.some(([a, b]) => t > a && t < b);
    const P = { x, face, t, assis, tang: 0, tete: 0, cou: 0, bas: 0, saut: 0, vol: 0, phase: 0, allure: 'pose', queue: { a: lerp(-1.15, -0.35, assis), amp: lerp(0.06, 0.4, assis), f: 8, courbe: lerp(0.1, -0.12, assis) } };
    if (trotte) { P.allure = 'trot'; P.phase = x * 0.33; P.queue = { a: -0.35, amp: 0.25, f: 8, courbe: 0.06 }; }
    if (t > S.fin.t0) P.queue.amp = 0.7;
    return P;
  }
  function jardin(ctx, t) {
    const j = jardinierA(t), ch = chienA(t);
    ctx.save(); ctx.translate(0, SOLPX); ctx.scale(SC, SC);
    const pieds = [j.x - 1.5, j.x + 2, ch.x - 7, ch.x + 7];
    K.dessinerPrairie(ctx, t, 0, [0, 1], pieds);
    for (const a of ARBRES) K.dessinerArbre(ctx, t, a);
    if (ch.x < LU + 28 && ch.x > -32 && !EN_SCENE.some(([a, b]) => t >= a && t < b)) globalThis.CHIEN.dessiner(ctx, ch);
    const { bec } = globalThis.JARDINIER.dessiner(ctx, j);
    if (j.verse) { ctx.save(); ctx.fillStyle = C.edifice;                                       // l'arrosoir verse des symboles
      G.decor(() => { ctx.font = `700 8.5px ${F.mono}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let i = 0; i < 5; i++) { const ph = (t * 1.15 + i / 5) % 1, ec = (i % 3 - 1) * 3.2; ctx.globalAlpha = 0.95 - ph * 0.4; ctx.fillText('+×π=∑'[(i + Math.floor(t * 1.15 + i / 5)) % 5], bec[0] + 1.5 + ec + ph * (1.5 + ec * 0.4), bec[1] + 2 + ph * ph * (-bec[1] - 5)); } });
      ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.ellipse(bec[0] + 2, 0.5, 9, 1.8, 0, 0, 6.3); ctx.fill(); ctx.restore(); }
    K.dessinerPrairie(ctx, t, 0, [2], pieds);
    ctx.restore();
  }

  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, le produit du cours avec sa ligne et sa colonne en couleur, le jardin planté avec le chien.
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, TITRE, 76, 400, { size: 190, w: 800, align: 'left' });
    formule(ctx, 'g_p', CX, 655, { fs: 88, mil: 1 });
    jardin(ctx, S.fin.t0 - 0.3);
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    vocab(ctx, ts); somme(ctx, ts); produit(ctx, ts); ordre(ctx, ts); puissance(ctx, ts); inverse(ctx, ts); bilan(ctx, ts); fin(ctx, t);
    intertitre(ctx, t);
    jardin(ctx, t);
    acteur(ctx, t);
    // éclair bref sur les deux temps forts (l'oméga du logo, la fin) : l'image frappe à l'instant où le son frappe
    for (const [te, c, f] of [[S.ouverture.logo[2], '255,109,125', 0.13], [S.fin.t0, '231,233,237', 0.14]]) { const u = t - te; if (u >= 0 && u < 0.3) { ctx.fillStyle = `rgba(${c},${f * (1 - u / 0.3)})`; ctx.fillRect(0, 0, W, H); } }
    const f = pr(t, S.DURATION - 0.9, 0.8); if (f > 0) { ctx.fillStyle = `rgba(18,20,24,${f})`; ctx.fillRect(0, 0, W, H); }
  }

  Studio.film({
    draw, fadeOut: 0, post: { paper: 0, grain: 0, vignette: 0 },
    init: async () => {
      const charge = async (fam, f, weight, style = 'normal') => { const ff = new FontFace(fam, `url(fonts/${f})`, { weight, style }); document.fonts.add(ff); await ff.load(); };
      for (const w of [400, 500, 600, 700, 800]) await charge('Spectral', `spectral-latin-${w}-normal.woff2`, String(w));
      await charge('GFS Didot', 'gfs-didot-greek-400-normal.woff2', '400'); await charge('Spectral', 'spectral-latin-700-italic.woff2', '700', 'italic'); await charge('Spectral', 'spectral-latin-500-italic.woff2', '500', 'italic');
      for (const w of [400, 500, 600]) await charge('IBM Plex Sans', `ibm-plex-sans-latin-${w}-normal.woff2`, String(w));
      await charge('KaTeX_Main', 'KaTeX_Main-Regular.woff2', '400'); await charge('KaTeX_Math', 'KaTeX_Math-Italic.woff2', '400', 'italic'); await charge('KaTeX_AMS', 'KaTeX_AMS-Regular.woff2', '400');
      for (const w of [500, 700]) await charge('IBM Plex Mono', `ibm-plex-mono-latin-${w}-normal.woff2`, String(w));
      await K.chargerFormules();
    },
  });
})();
