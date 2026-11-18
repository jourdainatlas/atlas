// LE FILM — « Divisibilité et primalité », Terminale Maths expertes, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y fait la division euclidienne de 47 par 5 : neuf bonds de longueur 5 sur la droite graduée, puis deux pas.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Divisibilité et primalité', NIVEAU = 'MATHS EXPERTES', LONG = 'TERMINALE MATHS EXPERTES · CHAPITRE 1', NB_EXERCICES = 41;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 110, w: 800, a: k1 });
    ligne(ctx, 'Diviser, puis {décomposer}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- outils de figure ----------
  const VIOLET = '#b58cff';
  function seg(ctx, p, q, o = {}) { const k = o.k ?? 1; if (k <= 0 || (o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.gm; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round'; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], k), lerp(p[1], q[1], k)); ctx.stroke(); ctx.restore(); }
  function pt(ctx, p, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre; ctx.beginPath(); ctx.arc(p[0], p[1], o.r || 7, 0, 6.3); ctx.fill(); if (o.creux) { ctx.fillStyle = C.papier; ctx.beginPath(); ctx.arc(p[0], p[1], (o.r || 7) - 3, 0, 6.3); ctx.fill(); } ctx.restore(); }
  const fl = (ctx, p, q, o = {}) => fleche(ctx, p[0], p[1], q[0], q[1], o);
  const trot = (t, x, ech) => ({ t, allure: 'trot', phase: x / ech * 0.33 }), assisP = (t, k, tete = -0.2) => ({ t, assis: k, tete, queue: { a: -0.35, amp: 0.4, f: 8, courbe: -0.12 } });
  const etiq = (ctx, s, x, y, a, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 500, size: 28, c: C.encre2, a, ...o });
  const XY = (R, x, y) => [R.X(x), R.Y(y)];
  // les trois mouvements motivés du chien entre le jardin et une figure (MEMO_atlas_videos.md, §9, règle 5)
  function bond(ctx, t, tJ, xg, tA) { if (t < tJ + 0.2 || t >= tA) return false; const u = t - tJ - 0.2, y = SOLPX - 430 * u + 1250 * u * u;
    if (y < H + 130) K.chienSur(ctx, xg, y, 0, SC, u < 0.17 ? { t, face: -1, allure: 'vol', vol: u / 0.17, tang: 0.3 } : { ...K.poseChute(t), face: -1 }); return true; }
  function chute(ctx, t, tA, tL, x, y, ech) { if (t < tA || t >= tL) return false; K.chienSur(ctx, x, -60 + (y + 60) * Math.pow((t - tA) / (tL - tA), 1.6), 0, ech, K.poseChute(t)); return true; }
  function sautJardin(ctx, t, tX, x0, y0, ech0, xS) { const tS = tX + 1.2, tR = tX + 1.55; if (t < tX || t >= tR) return false;
    const D = tS - tX - 0.2, u = pr(t, tX + 0.2, D), v0 = -450, g = 2 * (SOLPX - y0 - v0 * D) / (D * D), tv = u * D;
    K.chienSur(ctx, lerp(x0, xS, u), Math.min(SOLPX, y0 + v0 * tv + g * tv * tv / 2), 0, lerp(ech0, SC, u), u <= 0 ? { t, bas: 2.2 * pr(t, tX, 0.2) } : u < 0.22 ? { t, allure: 'vol', vol: u / 0.22, tang: 0.35 } : u < 1 ? K.poseChute(t) : K.poseChoc(t, t - tS)); return true; }
  // bilan en trois cartes : B.cartes (instants), ID (formules), FS (corps), LC (largeurs), TX (deux lignes par carte)
  function bilanCartes(ctx, t, titre, ID, FS, LC, TX, phrase) {
    const B = S.bilan, a = fen(t, L(S.BILAN) + 0.1, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    txt(ctx, titre, CX, 215, { size: 56, w: 700, a: ap(t, B.titre) });
    const tot = LC.reduce((s, w) => s + w, 0) + 40 * (LC.length - 1); let x = CX - tot / 2;
    B.cartes.forEach((tc, i) => { const k = ap(t, tc), cx = x + LC[i] / 2; x += LC[i] + 40; if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, LC[i], 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      formule(ctx, ID[i], cx, 395, { fs: FS[i], mil: 1 });
      txt(ctx, TX[i][0], cx, 560, { size: 26, w: 600 }); txt(ctx, TX[i][1], cx, 600, { size: 25, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, phrase, CX, 745 + (1 - kp) * 20, { size: 50, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- raccourcis d'écriture des scènes ----------
  const phase = (ctx, t, m0, m1, f) => { const k = fen(t, L(m0) + 0.1, L(m1), 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; f(k); ctx.restore(); } };
  const legs = (ctx, t, V, T) => T.forEach((l, i) => legende(ctx, t, V.leg[i], l, l.length > 1 ? { size: 40 } : {}));
  const fo = (ctx, t, id, x, y, fs, t0, o = {}) => formule(ctx, id, x, y, { fs, mil: 1, a: ap(t, t0), monte: 1, ...o });
  const tx = (ctx, t, s, x, y, t0, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 600, size: 30, a: ap(t, t0), ...o });
  // Un acte du chien : il bondit sous l'écran (V.bond), retombe du haut (V.chute) sur la figure au point pos(V.chute[1]).p,
  // y joue (pos(t) : { p, an, marche, assis, tete, face, pose }), puis redescend au jardin 1,4 s avant la fin de la partie k.
  function acte(k, V, ech, pos, tSortie) { const tX = tSortie ?? S.CH[k].t1 - 1.4, p0 = pos(V.chute[1]).p, pf = pos(tX).p, xS = pf[0] + 60;
    return { en: [V.bond + 0.2, tX + 1.55], trajet: [tX + 1.55, tX + 2.45, xS / SC, DS[k]],
      joue(ctx, t) { if (bond(ctx, t, V.bond, DS[k] * SC, V.chute[0]) || chute(ctx, t, V.chute[0], V.chute[1], p0[0], p0[1], ech) || t < V.chute[1]) return;
        if (t >= tX) return void sautJardin(ctx, t, tX, pf[0], pf[1], ech, xS);
        const c = pos(t), u = t - V.chute[1];
        K.chienSur(ctx, c.p[0], c.p[1] - 2, c.an || 0, ech, { ...(u < 0.35 ? K.poseChoc(t, u) : c.pose ? c.pose : c.marche ? trot(t, c.p[0] * 1.25, ech) : c.assis !== undefined ? assisP(t, c.assis, c.tete ?? -0.15) : { t, tete: c.tete || 0 }), face: c.face || 1 }); } }; }
  // droite graduée : y en pixels, X(valeur) ; ticks : valeurs chiffrées
  function axeGradue(ctx, X, y, a, b, ticks, k = 1, o = {}) { if (k <= 0) return; seg(ctx, [X(a), y], [X(b), y], { c: C.gm, lw: 3, k }); const kk = borne(k * 2 - 1);
    for (const v of ticks) { seg(ctx, [X(v), y - 9], [X(v), y + 9], { c: C.gm, lw: 3, a: kk }); if (!o.muet) txt(ctx, K.fr(v, 0), X(v), y + 44, { fam: F.main, w: 400, size: o.size || 28, c: C.encre3, a: kk }); } }

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

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois résultats", ["b_d", "b_e", "b_t"], [38, 34, 38], [540, 580, 560], [["La division euclidienne :", "un quotient et un reste, uniques."], ["Le lemme d’Euclide,", "pour un nombre premier p."], ["Une décomposition unique,", "à l’ordre des facteurs près."]], "Les nombres premiers sont les {briques} de tous les entiers."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 90, w: 800, a: k1 });
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
  // Le chien joue les scènes décrites par ACTES_DEF (scenes.js) : il bondit sous l'écran, retombe du haut sur la figure,
  // y tient son rôle, puis redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const ACTES = ACTES_DEF(), EN_SCENE = ACTES.map((a) => a.en), T1 = S.CH.map((c) => c.t1);
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]), ...ACTES.map((a) => a.trajet)].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) { for (const a of ACTES) a.joue(ctx, t); }
  function chienA(t) {
    let x = DEHORS, bouge = 0, face = -1;
    for (const [a, b, xa, xb] of TRAJETS) { if (t >= a) x = lerp(xa, xb, doux(pr(t, a, b - a))); bouge = Math.max(bouge, Math.min(pr(t, a - 0.35, 0.3), 1 - pr(t, b, 0.3))); if (xb > xa) face += 2 * (doux(pr(t, a - 0.3, 0.3)) - doux(pr(t, b, 0.3))); }
    face = borne(face, -1, 1);                                                // deux trajets vers la droite qui se suivent ne doivent pas s'additionner
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
    if (!VIGNETTE && ch.x < LU + 28 && ch.x > -32 && !EN_SCENE.some(([a, b]) => t >= a && t < b)) globalThis.CHIEN.dessiner(ctx, ch);
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
  // plus 100 s). Le titre, la figure de vignetteFig (scenes.js), le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, "Divisibilité", 76, 352, { size: 140, w: 800, align: 'left' }); txt(ctx, "et primalité", 76, 506, { size: 140, w: 800, align: 'left' });
    vignetteFig(ctx);
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    divise(ctx, ts); euclide(ctx, ts); crible(ctx, ts); infinite(ctx, ts); tfa(ctx, ts); diviseurs(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
