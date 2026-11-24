// LE FILM — « Notion de suite », Première spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y avance à pas égaux sur la droite graduée (suite arithmétique), puis il gravit l'escalier 1 + 2 + … + 6.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Notion de suite', NIVEAU = 'PREMIÈRE SPÉCIALITÉ', LONG = 'PREMIÈRE SPÉCIALITÉ · CHAPITRE 2', NB_EXERCICES = 30;

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
    ligne(ctx, 'Arithmétiques, {géométriques}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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
      if (Array.isArray(ID[i])) { formule(ctx, ID[i][0], cx, 350, { fs: FS[i], mil: 1 }); formule(ctx, ID[i][1], cx, 462, { fs: FS[i], mil: 1 }); }      // deux formules dans une même carte
      else formule(ctx, ID[i], cx, 395, { fs: FS[i], mil: 1 });
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
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Arithmétique, géométrique", [["t_a1", "t_g1"], ["t_a2", "t_g2"], ["b_s", "b_sg"]], [40, 40, 30], [470, 470, 640], [["Les relations de récurrence :", "ajouter r, ou multiplier par q."], ["Les formules explicites,", "à partir du rang 0."], ["Les sommes : celle des entiers,", "celle des puissances de q."]], "Une formule explicite donne {n’importe quel terme}, directement."); }

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
    txt(ctx, "Notion", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "de suite", 76, 506, { size: 150, w: 800, align: 'left' });
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
    suite(ctx, ts); definir(ctx, ts); variations(ctx, ts); arith(ctx, ts); geom(ctx, ts); sommes(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
