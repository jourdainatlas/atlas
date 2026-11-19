// LE FILM — « Les suites numériques », Terminale spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y fait tomber le premier domino de la récurrence, puis il gravit les premiers termes d'une suite qui converge.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Les suites numériques', NIVEAU = 'TERMINALE SPÉCIALITÉ', LONG = 'TERMINALE SPÉCIALITÉ · CHAPITRE 1', NB_EXERCICES = 33;

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
    ligne(ctx, 'Récurrence et {limites}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const un = (n) => 6 - 5 / Math.pow(2, n);
  // nuage des termes d'une suite (points bleus) dans un repère
  function nuage(ctx, R, u, n0, n1, k, o = {}) { for (let n = n0; n <= n1; n++) K.point(ctx, R, n, u(n), { k: borne(k * (n1 - n0 + 3) - (n - n0)), r: o.r || 8, c: o.c || C.bleu }); }

  // ---------- 1. le principe de récurrence ----------
  const DO = { x0: 420, pas: 108, sol: 640, h: 170, w: 28, n: 13, ech: 3.2 };
  function recurrence(ctx, t) { const V = S.recurrence;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.dominos, 0.8); seg(ctx, [120, DO.sol], [1800, DO.sol], { c: C.gl, lw: 3, k: kd });
      for (let i = 0; i < DO.n; i++) { const k = borne(kd * 3 - i * 0.12), an = 1.13 * doux(pr(t, V.pousse + i * 0.2, 0.42)), x = DO.x0 + i * DO.pas; if (k <= 0) continue;
        ctx.save(); ctx.globalAlpha *= k; ctx.translate(x + DO.w / 2, DO.sol); ctx.rotate(i === DO.n - 1 ? an * 1.39 : an); ctx.fillStyle = i ? C.encre : C.cours; ctx.beginPath(); ctx.roundRect(-DO.w, -DO.h, DO.w, DO.h, 5); ctx.fill(); ctx.restore(); }
      tx(ctx, t, 'Initialisation : le premier domino tombe.', CX, 270, V.init, { size: 40, c: C.cours }); tx(ctx, t, 'Hérédité : chaque domino fait tomber le suivant.', CX, 350, V.hered, { size: 40 }); });
    legs(ctx, t, V, [['Démontrer une propriété pour tous les entiers, c’est faire tomber une file infinie de dominos.'], ['Deux étapes suffisent : c’est le [principe de récurrence].']]); }
  // il s'approche, se dresse sur ses pattes arrière, pose les pattes avant sur le domino et pousse ; puis il retombe et s'assoit
  const posDomino = (t) => { const V = S.recurrence, tp = V.pousse, leve = doux(pr(t, tp - 1.0, 0.6)) * (1 - doux(pr(t, tp + 0.7, 0.5))), pous = doux(pr(t, tp - 0.25, 0.3)) * (1 - doux(pr(t, tp + 0.7, 0.5)));
    return { p: [DO.x0 - 150 + 62 * doux(pr(t, tp - 1.6, 0.6)) + 40 * pous, DO.sol], pose: t > tp - 1.6 && t < tp + 1.2 ? (leve > 0.02 ? { t, allure: 'vol', vol: 0.2 + 0.8 * pous, tang: 1.2 * leve - 0.14 * pous, tete: 0.4 * leve } : trot(t, t * 300, DO.ech)) : undefined, assis: t >= tp + 1.2 ? doux(pr(t, tp + 1.2, 0.4)) : undefined, tete: 0.1 }; };

  // ---------- 2. rédiger une récurrence ----------
  function rediger(ctx, t) { const V = S.rediger;
    phase(ctx, t, 6, 12, () => { const ke = ap(t, V.enonce); cadre(ctx, CX, 215, 900, 110, { fill: C.surface, stroke: C.filet, lw: 2, a: ke }); formule(ctx, 'r_P', CX, 215, { fs: 44, mil: 1, a: ke });
      tx(ctx, t, 'Initialisation', 330, 372, V.init[0], { c: C.cours, size: 32 }); fo(ctx, t, 'r_i', 900, 360, 42, V.init[0]); marque(ctx, 1210, 360, 18, true, ap(t, V.init[1]));
      tx(ctx, t, 'Hérédité', 330, 512, V.hered[0], { c: C.cours, size: 32 }); tx(ctx, t, 'on suppose P vraie au rang k', 330, 556, V.hered[0], { c: C.orange, size: 24, w: 500 });
      fo(ctx, t, 'r_h1', 1060, 500, 40, V.hered[0]); const w = largeur('r_h2', 40), x0 = 1060 - (w + largeur('r_h3', 44) + 16) / 2; formule(ctx, 'r_h2', x0, 610, { fs: 40, mil: 1, align: 'left', a: ap(t, V.hered[1]), monte: 1 }); formule(ctx, 'r_h3', x0 + w + 16, 610, { fs: 44, mil: 1, align: 'left', a: ap(t, V.hered[2]), monte: 1 });
      tx(ctx, t, 'Conclusion : la propriété est vraie pour tout entier n ⩾ 1.', CX, 730, V.concl, { size: 32 }); });
    phase(ctx, t, 12, 14, () => { fo(ctx, t, 'r_p1', CX, 250, 50, V.piege[0]); fo(ctx, t, 'r_p2', 640, 440, 44, V.piege[1]); tx(ctx, t, 'héréditaire…', 640, 530, V.piege[1], { c: C.cours });
      fo(ctx, t, 'r_p3', 1320, 440, 50, V.piege[2]); tx(ctx, t, '… mais fausse dès le rang 0', 1320, 530, V.piege[2], { c: C.orange }); tx(ctx, t, 'Aucun domino n’est jamais tombé.', CX, 680, V.piege[2] + 0.6, { size: 38 }); });
    legs(ctx, t, V, [['On énonce d’abord clairement la propriété à démontrer.'], ['L’[initialisation] : on vérifie la propriété au premier rang.'], ['L’[hérédité] : on la suppose vraie à un rang $k$, et on la démontre au rang suivant.'], ['On conclut par le principe de récurrence.'], ['Les deux étapes sont indispensables : une hérédité sans initialisation ne démontre rien.']]); }

  // ---------- 3. la limite d'une suite ----------
  const R3 = K.repere({ x: 110, y: 170, w: 890, h: 560 }, { x0: -0.6, x1: 12.6, y0: 0, y1: 7 });
  const posTermes = (t) => { const V = S.limite, s = 5 * pr(t, V.marche[0], V.marche[1] - V.marche[0]), i = Math.min(4, Math.floor(s)), k = s - i, a = XY(R3, i, un(i)), b = XY(R3, i + 1, un(i + 1)), m = s > 0 && s < 5;
    return { p: [lerp(a[0], b[0], k), lerp(a[1], b[1], k)], an: m ? borne(Math.atan((b[1] - a[1]) / (b[0] - a[0])), -0.8, 0.8) : 0, marche: m, assis: s >= 5 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figU(ctx, t, kf, e, ke, N0) { if (ke > 0) { ctx.save(); ctx.globalAlpha *= ke; ctx.fillStyle = 'rgba(255,162,74,0.20)'; ctx.fillRect(R3.b.x, R3.Y(6 + e), R3.b.w, R3.Y(6 - e) - R3.Y(6 + e)); ctx.restore(); if (N0) K.trait(ctx, R3, N0, 0, N0, 6 + e, { c: C.orange, lw: 3, dash: [8, 8], a: ke }); }
    K.axes(ctx, R3, kf, { gx: [2, 4, 6, 8, 10, 12], gy: [1, 2, 3, 4, 5, 6] }); K.trait(ctx, R3, -0.6, 6, 12.6, 6, { c: C.cours, lw: 3, dash: [12, 10], a: kf }); formule(ctx, 'l_6', R3.X(11.6), R3.Y(6) - 28, { fs: 34, mil: 1, a: kf }); nuage(ctx, R3, un, 0, 12, kf); }
  function limite(ctx, t) { const V = S.limite;
    phase(ctx, t, 14, 22, () => { const e = lerp(0.5, 0.1, doux(pr(t, V.bande[1], 0.8))), k2 = t >= V.bande[1] + 0.8;
      figU(ctx, t, ap(t, V.fig, 0.9), e, ap(t, V.bande[0], 0.6), t >= V.rang[1] ? 6 : t >= V.rang[0] && t < V.bande[1] ? 4 : 0);
      fo(ctx, t, 'l_u', 1450, 215, 44, V.fig); const kd = ap(t, V.def); carte(ctx, 1040, 300, 830, 160, 'DÉFINITION', kd); formule(ctx, 'l_def', 1455, 394, { fs: 30, mil: 1, a: kd });
      const kb = ap(t, V.bande[0]); txt(ctx, `ε = ${K.fr(e, 2)}`, 1280, 560, { fam: F.ui, w: 600, size: 44, c: C.orange, a: kb });
      tx(ctx, t, 'N = 4', 1620, 560, V.rang[0], { size: 44, c: C.cours, a: ap(t, V.rang[0]) * (t < V.bande[1] ? 1 : 0) }); tx(ctx, t, 'N = 6', 1620, 560, V.rang[1], { size: 44, c: C.cours });
      tx(ctx, t, 'À partir du rang N, tous les termes sont dans la bande.', 1455, 680, V.rang[0], { size: 28, c: C.encre2 }); });
    legs(ctx, t, V, [['Une suite définie par récurrence : chaque terme se calcule à partir du précédent.'], ['Ses termes montent vers 6, sans jamais l’atteindre.'], ['On choisit un intervalle ouvert autour de 6 : à partir d’un certain rang, tous les termes y sont.'], ['Si c’est vrai aussi étroit que soit l’intervalle, la suite [converge] vers 6.']]); }

  // ---------- 4. lever une indétermination ----------
  function operations(ctx, t) { const V = S.operations;
    phase(ctx, t, 22, 26, () => { [['u_n', 'u_n2', 'u_rn'], ['u_in', 'u_in2', 'u_irn']].forEach((l, j) => l.forEach((id, i) => { const k = ap(t, V.ref[j] + i * 0.35), x = 440 + i * 520, y = 240 + j * 150; cadre(ctx, x, y, 470, 120, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); formule(ctx, id, x, y, { fs: 40, mil: 1, a: k }); }));
      fo(ctx, t, 'u_g', CX, 540, 40, V.gen); fo(ctx, t, 'u_o1', 620, 690, 40, V.ops); fo(ctx, t, 'u_o2', 1320, 690, 40, V.ops + 0.5); });
    phase(ctx, t, 26, 30, () => { fo(ctx, t, 'o_e', 760, 260, 54, V.ex); const kf = ap(t, V.fi); cadre(ctx, 1280, 260, 250, 150, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kf }); formule(ctx, 'o_fi', 1280, 260, { fs: 50, mil: 1, a: kf });
      tx(ctx, t, 'forme indéterminée', 1280, 372, V.fi, { c: C.orange, size: 26 }); fo(ctx, t, 'o_f', CX, 510, 44, V.fact); fo(ctx, t, 'o_r', CX, 700, 54, V.res); });
    legs(ctx, t, V, [['Les [limites usuelles] : les puissances de $n$ tendent vers plus l’infini…'], ['… et leurs inverses tendent vers 0.'], ['Elles se combinent par somme, produit et quotient, tant que le résultat a un sens.'], ['Ici, numérateur et dénominateur tendent vers l’infini : les règles ne concluent pas.'], ['On factorise par le terme dominant : il ne reste que des limites usuelles.']]); }

  // ---------- 5. comparer, encadrer, majorer ----------
  const R5c = K.repere({ x: 110, y: 420, w: 800, h: 330 }, { x0: -0.6, x1: 12.6, y0: -1.5, y1: 13.5 });
  const R5 = K.repere({ x: 110, y: 330, w: 890, h: 400 }, { x0: 0, x1: 41, y0: -1.1, y1: 1.1 }), vn = (n) => Math.sin(n) / n;
  function theoremes(ctx, t) { const V = S.theoremes;
    phase(ctx, t, 30, 34, () => { [['k_1', 'MINORATION', 520], ['k_2', 'MAJORATION', 1400]].forEach(([id, nom, x], i) => { const k = ap(t, V.comp[i]); carte(ctx, x - 415, 165, 830, 170, 'THÉORÈME DE COMPARAISON · ' + nom, k); formule(ctx, id, x, 266, { fs: 29, mil: 1, a: k }); });
      const kf = ap(t, V.cfig, 0.9); K.axes(ctx, R5c, kf, { gx: [2, 4, 6, 8, 10, 12], gy: [4, 8, 12] }); K.droite(ctx, R5c, 0, -1, 1, { c: VIOLET, lw: 3.5, k: kf }); nuage(ctx, R5c, (n) => n + Math.sin(n), 0, 12, kf, { r: 7 }); formule(ctx, 'k_l', R5c.X(10.6), R5c.Y(7.4), { fs: 30, mil: 1, a: kf });
      fo(ctx, t, 'k_ex', 1400, 480, 50, V.cfig); fo(ctx, t, 'k_res', 1400, 650, 50, V.cres); });
    phase(ctx, t, 34, 38, () => { const kg = ap(t, V.gend); carte(ctx, 210, 165, 1500, 130, 'THÉORÈME DES GENDARMES', kg); formule(ctx, 'g_th', 840, 240, { fs: 36, mil: 1, a: kg }); tx(ctx, t, '⟹', 1340, 252, V.gend, { size: 36 }); formule(ctx, 'g_c', 1520, 240, { fs: 40, mil: 1, a: kg });
      const kf = ap(t, V.fig, 0.9); K.axes(ctx, R5, kf, { gx: [10, 20, 30, 40], gy: [-1, 1] }); K.courbe(ctx, R5, (x) => 1 / x, 0.92, lerp(0.92, 41, kf), { c: VIOLET, lw: 3.5 }); K.courbe(ctx, R5, (x) => -1 / x, 0.92, lerp(0.92, 41, kf), { c: VIOLET, lw: 3.5 }); nuage(ctx, R5, vn, 1, 40, kf, { r: 6 });
      fo(ctx, t, 'g_enc', 1450, 440, 48, V.enc); fo(ctx, t, 'g_lim', 1450, 630, 52, V.lim); });
    phase(ctx, t, 38, 42, () => { const km = ap(t, V.mono); carte(ctx, 1040, 170, 830, 200, 'THÉORÈME DE CONVERGENCE MONOTONE', km); txt(ctx, 'Toute suite croissante et majorée converge.', 1455, 262, { fam: F.ui, w: 600, size: 30, a: km }); txt(ctx, 'Toute suite décroissante et minorée converge.', 1455, 312, { fam: F.ui, w: 600, size: 30, a: km });
      figU(ctx, t, ap(t, V.fig2, 0.9), 0, 0, 0); tx(ctx, t, 'Il affirme que la limite existe, sans la donner.', 1455, 450, V.fig2, { size: 28, c: C.encre2 }); fo(ctx, t, 'm_ell', 1455, 560, 40, V.ell); fo(ctx, t, 'l_lim', 1455, 690, 50, V.six); });
    legs(ctx, t, V, [['Une suite plus grande qu’une suite qui tend vers plus l’infini y tend aussi ;', 'et de même vers moins l’infini pour une suite plus petite.'], ['Le sinus est au moins égal à −1 : cette minoration suffit.'], ['Une suite prise entre deux suites de même limite a cette limite.'], ['Le sinus reste entre −1 et 1 : les deux gendarmes tendent vers 0.'], ['Le [théorème de convergence monotone] : croissante et majorée par 6, la suite converge.'], ['Pour trouver sa limite, on passe à la limite dans la relation de récurrence.']]); }

  // ---------- 6. les suites géométriques ----------
  function geometriques(ctx, t) { const V = S.geometriques, CAS = [[1.3, 'q_1', 'vers plus l’infini', C.orange], [0.8, 'q_2', 'vers 0', C.cours], [-0.8, 'q_3', 'vers 0, en alternant', C.cours], [-1.2, 'q_4', 'pas de limite', C.orange]];
    phase(ctx, t, 42, 48, () => { CAS.forEach(([q, id, s, c], i) => { const k = ap(t, V.cas[i], 0.8), x = 130 + i * 440, neg = q < 0, R = K.repere({ x, y: 250, w: 380, h: 340 }, { x0: -0.5, x1: 10.5, y0: q < -1 ? -6.5 : neg ? -1.1 : 0, y1: q < -1 ? 6.5 : q > 1 ? 14 : 1.1 }); if (k <= 0) return;
        formule(ctx, id, x + 190, 205, { fs: 40, mil: 1, a: k }); seg(ctx, XY(R, -0.5, 0), XY(R, 10.5, 0), { c: C.gm, lw: 2.5, k }); K.dans(ctx, R, () => nuage(ctx, R, (n) => Math.pow(q, n), 0, 10, k, { r: 7 })); txt(ctx, s, x + 190, 650, { fam: F.ui, w: 600, size: 28, c, a: k }); }); });
    phase(ctx, t, 48, 54, () => { const kp = ap(t, V.prop); carte(ctx, 260, 165, 1400, 210, 'PROPRIÉTÉ', kp);
      [['q_4', 520], ['q_m', 960], ['q_1', 1400]].forEach(([id, x]) => formule(ctx, id, x, 250, { fs: 38, mil: 1, a: kp })); txt(ctx, 'pas de limite', 520, 322, { fam: F.ui, w: 600, size: 30, c: C.orange, a: kp }); formule(ctx, 'q_r2', 960, 318, { fs: 34, mil: 1, a: kp }); formule(ctx, 'q_r1', 1400, 318, { fs: 34, mil: 1, a: kp });
      fo(ctx, t, 'q_b', CX, 470, 42, V.bern); tx(ctx, t, 'l’inégalité de Bernoulli, démontrée par récurrence, donne le cas q > 1', CX, 540, V.bern, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'q_e', 620, 680, 48, V.ex); fo(ctx, t, 'q_er', 1300, 680, 40, V.res); });
    legs(ctx, t, V, [['Une suite géométrique de raison plus grande que 1 dépasse tout nombre.'], ['Si la raison est entre 0 et 1, les termes s’écrasent sur 0.'], ['Entre −1 et 0, ils changent de signe à chaque rang, mais tendent encore vers 0.'], ['Au-delà de −1, ils s’écartent en alternant : la suite n’a pas de limite.'], ['Tout dépend de la raison $q$.'], ['Le premier cas repose sur une inégalité que l’on démontre par récurrence.'], ['Ici la raison vaut 0,8 : la suite tend vers 0.']]); }

  const ACTES_DEF = () => [acte(0, S.recurrence, DO.ech, posDomino), acte(2, S.limite, 2.6, posTermes, S.limite.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1000, y: 250, w: 860, h: 520 }, { x0: -0.6, x1: 9.6, y0: 0, y1: 7 }); seg(ctx, XY(Rv, -0.6, 6), XY(Rv, 9.6, 6), { c: C.cours, lw: 5, dash: [16, 14] }); for (let n = 0; n <= 9; n++) pt(ctx, XY(Rv, n, un(n)), { c: C.bleu, r: 13 });
    const a = XY(Rv, 2, un(2)); K.chienSur(ctx, a[0], a[1] - 14, -0.35, 4.4, { t: 0.4, allure: 'trot', phase: 1.1 }); formule(ctx, 'b_l', 500, 700, { fs: 80, mil: 1 }); }

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois idées", ["b_r", "b_l", "b_q"], [50, 46, 40], [520, 560, 560], [["La récurrence :", "initialisation, puis hérédité."], ["La limite : tous les termes dans la bande,", "à partir d’un certain rang."], ["Une suite géométrique :", "tout dépend de la raison."]], "Croissante et majorée : la suite {converge}."); }

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
    txt(ctx, "Les suites", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "numériques", 76, 506, { size: 150, w: 800, align: 'left' });
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
    recurrence(ctx, ts); rediger(ctx, ts); limite(ctx, ts); operations(ctx, ts); theoremes(ctx, ts); geometriques(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
