// LE FILM — « Ensembles et logique », Maths approfondies, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y est un élément x : dans A, donc dans B (condition suffisante, condition nécessaire), puis dans E privé de F,
// dans l'intersection, et enfin dans F seul.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Ensembles et logique', NIVEAU = 'MATHS APPROFONDIES', LONG = 'MATHS APPROFONDIES · CHAPITRE 1', NB_EXERCICES = 30;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 116, w: 800, a: k1 });
    ligne(ctx, 'Le langage de tout le {supérieur}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  // table de vérité : colonnes (identifiants de formules), lignes de 'V' / 'F' ; kr(i) : apparition de la ligne i ; hi : ligne mise en valeur
  function tableV(ctx, x, y, cols, lignes, kr, o = {}) { const w = o.w || 190, h = o.h || 74;
    cols.forEach((id, j) => { cadre(ctx, x + j * w, y, w - 8, h - 8, { fill: C.trame, stroke: C.filet, lw: 2, r: 8, a: kr(-1) }); formule(ctx, id, x + j * w, y, { fs: o.fs || 34, mil: 1, a: kr(-1) }); });
    lignes.forEach((l, i) => { const k = kr(i), hi = o.hi === i ? o.khi : 0; [...l].forEach((v, j) => { cadre(ctx, x + j * w, y + (i + 1) * h, w - 8, h - 8, { fill: hi > 0 && j === l.length - 1 ? 'rgba(255,162,74,0.22)' : C.surface, stroke: hi > 0 ? C.orange : C.filet, lw: hi > 0 ? 3 : 2, r: 8, a: k }); txt(ctx, v, x + j * w, y + (i + 1) * h + 12, { fam: F.ui, w: 600, size: 34, c: v === 'V' ? VRAI : C.orange, a: k }); }); }); }
  // deux disques E (bleu) et F (orange) qui se chevauchent ; mode : 'diff', 'inter', 'union', 'hors' (complémentaire de la réunion)
  const VE = { cx: 560, cy: 470, r: 190, d: 210 };
  function venn(ctx, k, modes = {}, o = {}) { if (k <= 0) return; const { cx, cy, r, d } = { ...VE, ...o }, E = [cx - d / 2, cy], Fc = [cx + d / 2, cy], cer = (c) => { ctx.moveTo(c[0] + r, c[1]); ctx.arc(c[0], c[1], r, 0, 2 * Math.PI); };
    ctx.save(); ctx.globalAlpha *= k;
    if (modes.hors > 0) { ctx.save(); ctx.globalAlpha *= modes.hors; ctx.fillStyle = 'rgba(181,140,255,0.38)'; ctx.fillRect(cx - d / 2 - r - 60, cy - r - 50, d + 2 * r + 120, 2 * r + 100); ctx.fillStyle = C.papier; ctx.beginPath(); cer(E); cer(Fc); ctx.fill(); ctx.restore(); ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(cx - d / 2 - r - 60, cy - r - 50, d + 2 * r + 120, 2 * r + 100); }
    if (modes.union > 0) { ctx.save(); ctx.globalAlpha *= modes.union; ctx.fillStyle = 'rgba(181,140,255,0.38)'; ctx.beginPath(); cer(E); cer(Fc); ctx.fill('nonzero'); ctx.restore(); }
    if (modes.diff > 0) { ctx.save(); ctx.globalAlpha *= modes.diff; ctx.beginPath(); cer(E); ctx.clip(); ctx.fillStyle = 'rgba(85,170,255,0.38)'; ctx.beginPath(); ctx.rect(0, 0, W, H); cer(Fc); ctx.fill('evenodd'); ctx.restore(); }
    if (modes.inter > 0) { ctx.save(); ctx.globalAlpha *= modes.inter; ctx.beginPath(); cer(E); ctx.clip(); ctx.fillStyle = 'rgba(53,202,164,0.45)'; ctx.beginPath(); cer(Fc); ctx.fill(); ctx.restore(); }
    ctx.lineWidth = 4; ctx.strokeStyle = C.bleu; ctx.beginPath(); cer(E); ctx.stroke(); ctx.strokeStyle = C.orange; ctx.beginPath(); cer(Fc); ctx.stroke();
    formule(ctx, o.ids ? o.ids[0] : 'l_E', E[0] - r * 0.72, cy - r * 0.86, { fs: 44, mil: 1 }); formule(ctx, o.ids ? o.ids[1] : 'l_F', Fc[0] + r * 0.72, cy - r * 0.86, { fs: 44, mil: 1 }); ctx.restore(); }
  // A (bleu) inclus dans B (orange)
  const NI = { B: [560, 470, 240], A: [470, 500, 110] };
  function inclus(ctx, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.lineWidth = 4; for (const [c, col, fill] of [[NI.B, C.orange, 'rgba(255,162,74,0.10)'], [NI.A, C.bleu, 'rgba(85,170,255,0.22)']]) { ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, 6.3); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = col; ctx.stroke(); }
    formule(ctx, 'l_A', NI.A[0] - 70, NI.A[1] - 60, { fs: 44, mil: 1 }); formule(ctx, 'l_B', NI.B[0] + 150, NI.B[1] - 150, { fs: 44, mil: 1 }); ctx.restore(); }

  // ---------- 1. propositions et connecteurs ----------
  function propositions(ctx, t) { const V = S.propositions;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 110, 180, 800, 170, 'DÉFINITION', kd); txt(ctx, 'Une proposition est une affirmation', 510, 258, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'qui est soit vraie, soit fausse.', 510, 304, { fam: F.ui, w: 600, size: 30, c: C.rouge, a: kd });
      tx(ctx, t, '« 2 > 3 » : fausse        « π est irrationnel » : vraie', 510, 460, V.ex[0], { size: 28 }); tx(ctx, t, '« x + 1 » n’est pas une proposition : c’est une expression.', 510, 560, V.ex[1], { size: 28, c: C.orange });
      tableV(ctx, 1150, 215, ['l_A', 'l_B', 'p_et', 'p_ou'], ['VVVV', 'VFFV', 'FVFV', 'FFFF'], (i) => ap(t, V.tab + (i + 1) * 0.5)); });
    legs(ctx, t, V, [['Une [proposition] est une affirmation dont on peut dire si elle est vraie ou fausse.'], ['Les connecteurs en fabriquent de nouvelles. Le « ou » des mathématiques est inclusif.']]); }

  // ---------- 2. implication et équivalence ----------
  const posImp = (t) => { const V = S.implication, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { p: [lerp(470, 700, k), 540], marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : t < V.marche[0] ? doux(pr(t, V.chute[1] + 0.4, 0.4)) * (1 - pr(t, V.marche[0] - 0.3, 0.3)) : undefined }; };
  function implication(ctx, t) { const V = S.implication;
    phase(ctx, t, 6, 9, () => { tableV(ctx, 560, 230, ['l_A', 'l_B', 'p_imp'], ['VVV', 'VFF', 'FVV', 'FFV'], (i) => ap(t, V.tab + (i + 1) * 0.45), { w: 230, hi: 1, khi: ap(t, V.faux) });
      tx(ctx, t, 'Une implication n’est fausse', 1440, 400, V.faux, { size: 34 }); tx(ctx, t, 'que si A est vraie et B fausse.', 1440, 450, V.faux, { size: 34, c: C.orange }); });
    phase(ctx, t, 9, 12.1, () => { inclus(ctx, ap(t, V.fig, 0.8)); tx(ctx, t, 'A : « n est un multiple de 4 »', 1440, 220, V.fig, { c: C.bleu, size: 32 }); tx(ctx, t, 'B : « n est pair »', 1440, 280, V.fig, { c: C.orange, size: 32 }); formule(ctx, 'p_imp', 1440, 380, { fs: 60, mil: 1, a: ap(t, V.fig) });
      const ks = ap(t, V.suff), kn = ap(t, V.nec); cadre(ctx, 1440, 520, 760, 96, { stroke: C.bleu, fill: 'rgba(85,170,255,0.10)', a: ks }); txt(ctx, 'A est une condition suffisante pour B.', 1440, 531, { fam: F.ui, w: 600, size: 30, a: ks });
      cadre(ctx, 1440, 650, 760, 96, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kn }); txt(ctx, 'B est une condition nécessaire pour A.', 1440, 661, { fam: F.ui, w: 600, size: 30, a: kn }); tx(ctx, t, 'n = 6', 760, 600, V.nec, { size: 28, c: C.orange }); });
    phase(ctx, t, 12.1, 14, () => { fo(ctx, t, 'i_eq', CX, 300, 90, V.equiv); fo(ctx, t, 'i_eq2', CX, 480, 50, V.equiv); tx(ctx, t, 'condition nécessaire et suffisante', CX, 650, V.cns, { size: 40, c: C.cours }); });
    legs(ctx, t, V, [['L’[implication] « si A, alors B » se définit elle aussi par sa table de vérité.'], ['Du faux, on peut déduire n’importe quoi : les deux dernières lignes sont vraies.'], ['Si $x$ est dans A, alors il est dans B : A suffit.'], ['Mais on peut être dans B sans être dans A : la réciproque est fausse.'], ['Quand l’implication et sa réciproque sont vraies, c’est une [équivalence].']]); }

  // ---------- 3. trois façons de raisonner ----------
  function raisonner(ctx, t) { const V = S.raisonner;
    phase(ctx, t, 14, 18, () => { const kc = ap(t, V.contra); carte(ctx, 410, 165, 1100, 170, 'LA CONTRAPOSÉE', kc); formule(ctx, 'r_c', CX, 262, { fs: 46, mil: 1, a: kc });
      tx(ctx, t, 'A : « pour tout ε > 0, x ⩽ ε »        B : « x = 0 »        (x est un réel positif)', CX, 420, V.cex[0], { size: 28, w: 500 });
      [['r_1', 520], ['r_2', 960], ['r_3', 1400]].forEach(([id, x], i) => { fo(ctx, t, id, x, 560, 46, V.cex[i]); if (i) fl(ctx, [x - 260, 560], [x - 180, 560], { c: C.gm, lw: 3, a: ap(t, V.cex[i]) }); }); tx(ctx, t, 'donc non A', 1400, 650, V.cex[2], { c: C.cours, size: 32 }); });
    phase(ctx, t, 18, 22, () => { const ka = ap(t, V.absurde); carte(ctx, 110, 180, 820, 200, 'PAR L’ABSURDE', ka); txt(ctx, 'On suppose le contraire de ce que l’on veut', 520, 262, { fam: F.ui, w: 600, size: 28, a: ka }); txt(ctx, 'démontrer, et l’on aboutit à une contradiction.', 520, 306, { fam: F.ui, w: 600, size: 28, a: ka });
      fo(ctx, t, 'r_a', 360, 520, 50, V.abs2); tx(ctx, t, 'sans facteur commun…', 680, 512, V.abs2, { size: 26, c: C.encre2 }); tx(ctx, t, '… et pourtant p et q sont pairs.', 520, 640, V.abs2 + 1.2, { size: 30, c: C.orange });
      const kx = ap(t, V.contre); carte(ctx, 990, 180, 820, 200, 'LE CONTRE-EXEMPLE', kx); txt(ctx, 'Un seul élément suffit à démontrer', 1400, 262, { fam: F.ui, w: 600, size: 28, a: kx }); txt(ctx, 'qu’une propriété universelle est fausse.', 1400, 306, { fam: F.ui, w: 600, size: 28, a: kx });
      tx(ctx, t, '« 2x + 1 est strictement positif pour tout réel x »', 1400, 480, V.contre, { size: 26, w: 500 }); fo(ctx, t, 'r_f', 1400, 600, 42, V.cval); });
    legs(ctx, t, V, [['Une implication et sa [contraposée] sont équivalentes : on démontre celle qui est la plus commode.'], ['Si $x$ est strictement positif, sa moitié le met en défaut.'], ['Le raisonnement par l’absurde est celui de l’irrationalité de racine de 2.'], ['Mais attention : mille exemples ne démontrent pas une propriété universelle.']]); }

  // ---------- 4. les quantificateurs ----------
  function quantif(ctx, t) { const V = S.quantif;
    phase(ctx, t, 22, 26, () => { [['q_1', 'pour tout x de E', V.d1, 520], ['q_2', 'il existe au moins un x de E', V.d2, 1400]].forEach(([id, s, t0, x]) => { const k = ap(t, t0); cadre(ctx, x, 260, 760, 170, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); formule(ctx, id, x, 240, { fs: 50, mil: 1, a: k }); txt(ctx, s, x, 316, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); });
      fo(ctx, t, 'q_v', 520, 460, 44, V.ex); marque(ctx, 820, 460, 18, true, ap(t, V.ex + 0.3)); fo(ctx, t, 'q_f', 1400, 460, 44, V.ex + 0.6); marque(ctx, 1660, 460, 18, false, ap(t, V.ex + 0.9));
      const kn = ap(t, V.neg); cadre(ctx, CX, 650, 1200, 120, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kn }); formule(ctx, 'q_n', CX, 650, { fs: 42, mil: 1, a: kn }); });
    legs(ctx, t, V, [['Deux [quantificateurs] : « pour tout » et « il existe ».'], ['Une proposition quantifiée est vraie ou fausse, comme les autres.'], ['Nier « pour tout », c’est affirmer « il existe » : la négation échange les deux.']]); }

  // ---------- 5. ensembles et inclusion ----------
  function inclusion(ctx, t) { const V = S.inclusion;
    phase(ctx, t, 26, 30, () => { fo(ctx, t, 'e_ext', 1440, 220, 46, V.ext); tx(ctx, t, 'en extension', 1440, 290, V.ext, { size: 24, c: C.encre2, w: 500 }); fo(ctx, t, 'e_comp', 1440, 380, 46, V.comp); tx(ctx, t, 'en compréhension', 1440, 450, V.comp, { size: 24, c: C.encre2, w: 500 });
      const ki = ap(t, V.incl); carte(ctx, 1040, 530, 800, 150, 'DÉFINITION', ki); formule(ctx, 'e_incl', 1440, 616, { fs: 38, mil: 1, a: ki }); inclus(ctx, ap(t, V.fig, 0.8)); });
    phase(ctx, t, 30, 34, () => { const kd = ap(t, V.dbl); carte(ctx, 410, 180, 1100, 170, 'DOUBLE INCLUSION', kd); formule(ctx, 'e_dbl', CX, 278, { fs: 46, mil: 1, a: kd });
      fo(ctx, t, 'e_vide', 520, 500, 60, V.vide); tx(ctx, t, 'l’ensemble vide est inclus dans tout ensemble', 520, 600, V.vide, { size: 26, c: C.encre2, w: 500 });
      fo(ctx, t, 'e_E', 1400, 450, 44, V.symb); fo(ctx, t, 'e_s1', 1260, 560, 50, V.symb); fo(ctx, t, 'e_s2', 1560, 560, 50, V.symb); tx(ctx, t, '∈ : un élément et un ensemble        ⊂ : deux ensembles', 1400, 670, V.symb, { size: 26, c: C.orange, w: 500 }); });
    legs(ctx, t, V, [['Un [ensemble] se décrit par la liste de ses éléments…'], ['… ou par une propriété qui les caractérise.'], ['A est [inclus] dans B quand tout élément de A est un élément de B.'], ['Pour démontrer que deux ensembles sont égaux, on démontre deux inclusions.'], ['L’appartenance et l’inclusion ne relient pas les mêmes objets : ne les confondez pas.']]); }

  // ---------- 6. opérations sur les ensembles ----------
  const posOp = (t) => { const V = S.operations, k1 = doux(pr(t, V.m1[0], V.m1[1] - V.m1[0])), k2 = doux(pr(t, V.m2[0], V.m2[1] - V.m2[0])), x = lerp(lerp(VE.cx - 190, VE.cx, k1), VE.cx + 190, k2), m = (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1);
    return { p: [x, VE.cy + 50], marche: m, tete: 0.1 }; };
  function operations(ctx, t) { const V = S.operations;
    phase(ctx, t, 34, 42, () => { venn(ctx, ap(t, V.fig, 0.8), { diff: fen(t, V.diff, V.m1[0] + 0.3, 0.3), inter: fen(t, V.inter, V.m2[0] + 0.3, 0.3), union: ap(t, V.union, 0.5) });
      [['o_d', V.diff, 'le complémentaire de F dans E', 250], ['o_i', V.inter, 'l’intersection', 430], ['o_u', V.union, 'la réunion', 610]].forEach(([id, t0, s, y]) => { tx(ctx, t, s, 1440, y - 54, t0, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, id, 1440, y, 38, t0); }); });
    phase(ctx, t, 42, 46, () => { const km = ap(t, V.morgan); carte(ctx, 1040, 170, 800, 230, 'LOIS DE DE MORGAN', km); formule(ctx, 'o_m1', 1440, 262, { fs: 46, mil: 1, a: km }); formule(ctx, 'o_m2', 1440, 340, { fs: 46, mil: 1, a: km });
      venn(ctx, ap(t, V.mfig, 0.7), { hors: ap(t, V.mfig + 0.5) }, { r: 150, d: 170, cy: 450, ids: ['l_Fb', 'l_G'] });
      fo(ctx, t, 'o_p', 1440, 520, 34, V.parties); const k2 = ap(t, V.deux); txt(ctx, 'Un ensemble à n éléments possède', 1370, 650, { fam: F.ui, w: 600, size: 30, a: k2 }); formule(ctx, 'o_2n', 1668, 636, { fs: 50, mil: 1, a: k2 }); txt(ctx, 'parties.', 1770, 650, { fam: F.ui, w: 600, size: 30, a: k2 }); });
    legs(ctx, t, V, [['Chaque opération sur les ensembles traduit un connecteur logique.'], ['L’élément $x$ entre dans l’[intersection] : il est dans E et dans F.'], ['Il quitte E, mais reste dans F.'], ['Dans tous ces cas, il est dans la [réunion] : dans E ou dans F.'], ['Être hors de la réunion, c’est être à la fois hors de l’un et hors de l’autre.'], ['Les parties d’un ensemble forment elles-mêmes un ensemble.']]); }

  const ACTES_DEF = () => [acte(1, S.implication, 2.6, posImp, S.implication.sortie), acte(5, S.operations, 2.6, posOp, S.operations.sortie)];
  function vignetteFig(ctx) { venn(ctx, 1, { inter: 1 }, { cx: 1420, cy: 520, r: 230, d: 250 }); K.chienSur(ctx, 1420, 590, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); }

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois réflexes", ["b_c", "b_n", "b_m"], [30, 28, 44], [580, 600, 460], [["La contraposée :", "équivalente à l’implication."], ["Nier « pour tout » :", "exhiber un contre-exemple."], ["Les lois de De Morgan,", "pour les ensembles aussi."]], "La négation échange {et} et {ou}, {pour tout} et {il existe}."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 92, w: 800, a: k1 });
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
    txt(ctx, "Ensembles", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "et logique", 76, 506, { size: 150, w: 800, align: 'left' });
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
    propositions(ctx, ts); implication(ctx, ts); raisonner(ctx, ts); quantif(ctx, ts); inclusion(ctx, ts); operations(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
