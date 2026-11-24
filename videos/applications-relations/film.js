// LE FILM — « Applications et relations binaires », MPSI, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y range quatre objets dans trois tiroirs, puis il descend la diagonale du tableau de Cantor.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Applications et relations binaires', NIVEAU = 'MPSI', LONG = 'MPSI · CHAPITRE 2', NB_EXERCICES = 48;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 88, w: 800, a: k1 });
    ligne(ctx, 'Relier les ensembles, {comparer} leurs éléments', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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
  // Une légende d'une ligne qui dépasserait 1780 px est coupée en deux, à l'espace le plus proche du milieu (de préférence après
  // une ponctuation), jamais à l'intérieur d'une balise ni devant un signe double : aucune phrase ne peut sortir de l'écran.
  const COUPES = new Map();
  function coupe(ctx, l) { if (l.length > 1) return l; const s = l[0]; if (COUPES.has(s)) return COUPES.get(s); let r = l;
    if (ligne(ctx, s, 0, -999, { size: 44, a: 0 }) > 1780) { let best = -1, sc = 1e9, d = 0, m = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '$') m ^= 1; else if (c === '[' || c === '{') d++; else if (c === ']' || c === '}') d--;
        else if (c === ' ' && !d && !m && !':;?!»'.includes(s[i + 1]) && s[i - 1] !== '«') { const v = Math.abs(i - s.length / 2) - (':;,.?'.includes(s[i - 1]) ? 14 : 0); if (v < sc) { sc = v; best = i; } } }
      if (best > 0) r = [s.slice(0, best), s.slice(best + 1)]; }
    COUPES.set(s, r); return r; }
  const legs = (ctx, t, V, T) => T.forEach((l0, i) => { const l = coupe(ctx, l0); legende(ctx, t, V.leg[i], l, l.length > 1 ? { size: 40 } : {}); });
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

  function ovale(ctx, cx, cy, rx, ry, a, id) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.fillStyle = C.surface; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3); ctx.fill(); ctx.stroke(); ctx.restore(); if (id) formule(ctx, id, cx, cy - ry - 28, { fs: 32, mil: 1, a }); }
  const colonne = (cx, cy, n, pas) => Array.from({ length: n }, (_, i) => [cx, cy + (i - (n - 1) / 2) * pas]);
  const enclos = (ctx, P, c, a) => { if (a <= 0) return; const ys = P.map((p) => p[1]), y0 = Math.min(...ys) - 24, y1 = Math.max(...ys) + 24; cadre(ctx, P[0][0], (y0 + y1) / 2, 64, y1 - y0, { stroke: c, fill: 'rgba(0,0,0,0)', lw: 4, r: 28, a }); };
  const rond = (ctx, p, c, a, r = 24) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 6.3); ctx.stroke(); ctx.restore(); };

  // ---------- 1. de la formule à la correspondance ----------
  function histoire(ctx, t) { const V = S.histoire;
    phase(ctx, t, 2, 6, () => { seg(ctx, [240, 400], [1680, 400], { c: C.gm, lw: 3, k: pr(t, V.d[0] - 0.4, 2) });
      [['1748', 'Euler', 'une fonction est', 'une formule'], ['1837', 'Dirichlet', 'toute correspondance,', 'avec ou sans formule'], ['1888', 'Dedekind', 'l’application, entre', 'ensembles quelconques'], ['1891', 'Cantor', 'l’argument', 'diagonal']].forEach(([an, nom, l1, l2], i) => { const k = ap(t, V.d[i]), x = 380 + i * 390; pt(ctx, [x, 400], { c: C.cours, r: 11, a: k });
        txt(ctx, an, x, 350, { fam: F.mono, w: 500, size: 40, c: C.cours, a: k }); txt(ctx, nom, x, 480, { size: 44, w: 700, a: k }); txt(ctx, l1, x, 550, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); txt(ctx, l2, x, 588, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); }); });
    legs(ctx, t, V, [['Pour Euler, une fonction est une expression analytique : une formule.'], ['Dirichlet appelle fonction toute correspondance, qu’une formule la décrive ou non.'], ['Dedekind fait de l’application un objet de base ; Cantor démontre', 'qu’aucun ensemble n’est en bijection avec l’ensemble de ses parties.']]); }

  // ---------- 2. image directe, image réciproque ----------
  const FL5 = [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]];
  function panneau(ctx, cx, ko, o) { const E = colonne(cx - 150, 520, 5, 58), Fp = colonne(cx + 150, 520, 4, 58); ovale(ctx, cx - 150, 520, 66, 172, ko, 'l_E'); ovale(ctx, cx + 150, 520, 66, 172, ko, 'l_F');
    FL5.forEach(([i, j]) => fl(ctx, [E[i][0] + 14, E[i][1]], [Fp[j][0] - 16, Fp[j][1]], { c: o.sel(i, j) ? o.c : C.gl, lw: 3, a: ko })); for (const p of [...E, ...Fp]) pt(ctx, p, { r: 8, a: ko }); return [E, Fp]; }
  function imagesP(ctx, t) { const V = S.imagesP;
    phase(ctx, t, 6, 10, () => { const kA = ap(t, V.A), kfA = ap(t, V.fA), kB = ap(t, V.B), kfB = ap(t, V.fB); fo(ctx, t, 'm_d', 500, 230, 36, V.dir); fo(ctx, t, 'm_r', 1420, 230, 36, V.rec);
      const [E1, F1] = panneau(ctx, 500, ap(t, V.dir), { c: C.bleu, sel: (i) => kA > 0.5 && i < 3 }); enclos(ctx, E1.slice(0, 3), C.bleu, kA); formule(ctx, 'l_A', E1[0][0] - 80, E1[1][1], { fs: 34, mil: 1, a: kA }); enclos(ctx, F1.slice(0, 2), C.cours, kfA); formule(ctx, 'l_fA', F1[0][0] + 110, (F1[0][1] + F1[1][1]) / 2, { fs: 34, mil: 1, a: kfA });
      const [E2, F2] = panneau(ctx, 1420, ap(t, V.rec), { c: VIOLET, sel: (i, j) => kfB > 0.5 && j >= 1 }); enclos(ctx, F2.slice(1), C.orange, kB); formule(ctx, 'l_B', F2[0][0] + 80, F2[2][1], { fs: 34, mil: 1, a: kB }); enclos(ctx, E2.slice(2), VIOLET, kfB); formule(ctx, 'l_fB', E2[0][0] - 120, E2[3][1], { fs: 34, mil: 1, a: kfB }); });
    phase(ctx, t, 10, 14, () => { const kp = ap(t, V.prop); carte(ctx, 160, 165, 1600, 290, 'PROPOSITION', kp); [['p_1', 440, 250], ['p_2', 960, 250], ['p_3', 1470, 250]].forEach(([id, x, y]) => formule(ctx, id, x, y, { fs: 28, mil: 1, a: ap(t, V.l[0]) }));
      formule(ctx, 'p_4', 620, 370, { fs: 34, mil: 1, a: ap(t, V.l[1]) }); formule(ctx, 'p_5', 1300, 370, { fs: 34, mil: 1, a: ap(t, V.l[2]) });
      fo(ctx, t, 'p_c1', CX, 550, 36, V.ce[0]); fo(ctx, t, 'p_c2', 620, 680, 40, V.ce[1]); fo(ctx, t, 'p_c3', 1300, 680, 40, V.ce[2]); });
    legs(ctx, t, V, [['L’[image directe] de $A$ : les extrémités des flèches issues de $A$.'], ['L’[image réciproque] de $B$ : les origines des flèches qui aboutissent dans $B$.'], ['L’image réciproque respecte toutes les opérations.'], ['L’image directe respecte la réunion ; pour l’intersection, elle ne donne qu’une inclusion.'], ['Deux parties disjointes peuvent avoir la même image : l’inclusion est alors stricte.']]); }

  // ---------- 3. composer : ce qui se transmet ----------
  function transmet(ctx, t) { const V = S.transmet;
    phase(ctx, t, 14, 18, () => { const kd = ap(t, V.dia), X = [420, 960, 1500], y = 270; [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => ovale(ctx, X[i], y, 120, 62, kd, null)); [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => formule(ctx, id, X[i], y, { fs: 38, mil: 1, a: kd }));
      fl(ctx, [X[0] + 130, y], [X[1] - 132, y], { c: C.bleu, lw: 4, a: kd }); formule(ctx, 'l_f', (X[0] + X[1]) / 2, y - 30, { fs: 36, mil: 1, a: kd }); fl(ctx, [X[1] + 130, y], [X[2] - 132, y], { c: C.orange, lw: 4, a: kd }); formule(ctx, 'l_g', (X[1] + X[2]) / 2, y - 30, { fs: 36, mil: 1, a: kd });
      tx(ctx, t, 'La composée de deux injections est une injection ; de même pour les surjections et les bijections.', CX, 420, V.p[0], { size: 28 }); fo(ctx, t, 't_1', 520, 530, 38, V.p[1]); fo(ctx, t, 't_2', 1400, 530, 38, V.p[2]); fo(ctx, t, 't_pr', CX, 680, 34, V.pr); });
    legs(ctx, t, V, [['L’injectivité et la surjectivité passent à la composée.'], ['Dans l’autre sens, l’injectivité de la composée ne se transmet qu’à $f$,', 'et sa surjectivité ne se transmet qu’à $g$.']]); }

  // ---------- 4. bijections et ensembles finis ----------
  const TI = { x: [330, 560, 790], y: 690, ech: 2.4 };
  const posTir = (t) => { const V = S.bij, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), a = borne(k / 0.58), r = borne((k - 0.7) / 0.3), x = k < 0.7 ? lerp(TI.x[0] - 130, TI.x[2] + 120, a) : lerp(TI.x[2] + 120, TI.x[1] + 60, r);
    return { p: [x, TI.y], x, k, marche: (k > 0 && a < 1) || (r > 0 && r < 1), face: k >= 0.64 ? -1 : 1, tete: a >= 1 && r <= 0 ? -0.3 : 0, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tiroir(ctx, x, y, n, a) { if (a <= 0) return; cadre(ctx, x, y - 52, 170, 100, { fill: C.surface, stroke: C.gm, lw: 3, r: 8, a }); for (let i = 0; i < n; i++) pt(ctx, [x + (n > 1 ? (i - 0.5) * 56 : 0), y - 52], { c: n > 1 ? C.orange : C.bleu, r: 20, a }); }
  function bij(ctx, t) { const V = S.bij;
    phase(ctx, t, 18, 22, () => { const kt = ap(t, V.th); carte(ctx, 260, 165, 1400, 210, 'THÉORÈME', kt); txt(ctx, 'f : E → F est bijective si et seulement s’il existe g : F → E telle que', CX, 250, { fam: F.ui, w: 600, size: 28, a: kt }); formule(ctx, 'j_th', CX, 318, { fs: 40, mil: 1, a: kt });
      fo(ctx, t, 'j_f', 560, 480, 38, V.f); fo(ctx, t, 'j_g', 1320, 480, 38, V.g); fo(ctx, t, 'j_gf', 560, 620, 44, V.gf); fo(ctx, t, 'j_fg', 1220, 620, 44, V.fg); tx(ctx, t, 'f n’est pas bijective', 1620, 632, V.fg, { c: C.orange, size: 28 }); });
    phase(ctx, t, 22, 26, () => { const kt = ap(t, V.th2); carte(ctx, 160, 165, 1600, 210, 'THÉORÈME', kt); txt(ctx, 'E et F finis, à n et p éléments, et f : E → F. Si f est injective, n ⩽ p ; si f est surjective, n ⩾ p.', CX, 250, { fam: F.ui, w: 600, size: 27, a: kt }); formule(ctx, 'j_2', CX, 318, { fs: 34, mil: 1, a: kt });
      const ki = ap(t, V.tir), on = t > V.marche[0], { x, k } = posTir(t); TI.x.forEach((u, i) => tiroir(ctx, u, TI.y, !on ? 0 : (x > u + 40 || k > 0.6 ? 1 : 0) + (i === 1 && k >= 1 ? 1 : 0), ki)); seg(ctx, [160, TI.y], [1000, TI.y], { c: C.gm, lw: 3, a: ki });
      tx(ctx, t, 'Le principe des tiroirs', 1400, 470, V.tir, { size: 34, c: C.cours }); tx(ctx, t, 'quatre objets, trois tiroirs :', 1400, 550, V.np, { c: C.encre2, w: 500 }); tx(ctx, t, 'deux objets partagent un tiroir', 1400, 600, V.np, { size: 30 }); fo(ctx, t, 'j_np', 1400, 690, 46, V.np); });
    legs(ctx, t, V, [['Une bijection est une application qui possède une réciproque.'], ['Ajouter 1 dans les entiers naturels : $g$ défait bien ce que fait $f$…'], ['… mais pas l’inverse : les deux égalités sont indispensables.'], ['Entre deux ensembles finis de même taille, injective, surjective et bijective sont synonymes.'], ['Avec plus d’objets que de tiroirs, aucune application n’est injective.']]); }

  // ---------- 5. le théorème de Cantor ----------
  const TB = { x: 380, y: 412, dx: 104, dy: 54, ech: 2.0 }, FX = [[0, 2, 4], [1, 2], [0, 3], [3, 4], [1, 2, 3]], DD = [0, 1, 2, 3, 4].filter((i) => !FX[i].includes(i));
  const cel = (i, j) => [TB.x + j * TB.dx, TB.y + i * TB.dy];
  const posDiag = (t) => { const V = S.cantor, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), s = lerp(-0.45, 4.45, k), p = cel(s, s); return { p: [p[0], p[1] + 14], s, an: k > 0 && k < 1 ? 0.42 : 0, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function tableau(ctx, n, s, o = {}) { for (let j = 0; j < 5; j++) formule(ctx, `k_c${j}`, cel(0, j)[0], TB.y - 62, { fs: 30, mil: 1, a: borne(n) });
    for (let i = 0; i < 5; i++) { const a = borne(n - i); formule(ctx, `k_f${i}`, TB.x - 130, cel(i, 0)[1], { fs: 30, mil: 1, a }); for (let j = 0; j < 5; j++) { const p = cel(i, j), d = i === j && s > i - 0.2; if (d) cadre(ctx, p[0], p[1], TB.dx - 12, TB.dy - 10, { stroke: VIOLET, fill: 'rgba(199,147,230,0.14)', lw: 3, r: 8, a }); pt(ctx, p, FX[i].includes(j) ? { c: C.bleu, r: 13, a } : { c: C.gl, r: 13, creux: 1, a }); } }
    formule(ctx, 'k_pts', TB.x - 130, cel(5, 0)[1] - 6, { fs: 28, mil: 1, a: borne(n - 4) }); const yD = cel(6, 0)[1] + 4; formule(ctx, 'k_D', TB.x - 130, yD, { fs: 34, mil: 1, a: borne(s + 0.2) }); for (let j = 0; j < 5; j++) if (s > j - 0.2) { const p = [cel(0, j)[0], yD]; pt(ctx, p, DD.includes(j) ? { c: VIOLET, r: 13 } : { c: VIOLET, r: 13, creux: 1 }); } }
  function cantor(ctx, t) { const V = S.cantor;
    phase(ctx, t, 26, 34, () => { const kt = ap(t, V.th); carte(ctx, 260, 165, 1400, 116, 'THÉORÈME DE CANTOR', kt); txt(ctx, 'Pour tout ensemble E, il n’existe aucune surjection de E sur l’ensemble de ses parties.', CX, 246, { fam: F.ui, w: 600, size: 28, a: kt });
      tableau(ctx, 6 * pr(t, V.tab[0], V.tab[1] - V.tab[0]), t > V.marche[0] ? posDiag(t).s : -9);
      tx(ctx, t, 'ligne x : un point plein quand la colonne appartient à f(x)', 590, 318, V.tab[0], { c: C.encre2, w: 500, size: 22 });
      fo(ctx, t, 'k_def', 1380, 400, 40, V.D); tx(ctx, t, 'D diffère de chaque f(x), au moins en x.', 1380, 490, V.dif, { size: 30, c: C.cours }); fo(ctx, t, 'k_abs', 1160, 590, 38, V.abs); fo(ctx, t, 'k_c', 1500, 590, 34, V.contra); tx(ctx, t, 'D n’a pas d’antécédent : f n’est pas surjective.', 1380, 700, V.concl, { size: 30, c: C.cours }); });
    legs(ctx, t, V, [['Un ensemble a toujours strictement plus de parties que d’éléments.'], ['Soit $f$ une application de $E$ dans l’ensemble de ses parties :', 'chaque $f(x)$ est une partie de $E$.'], ['Sur la diagonale, le chien lit si $x$ appartient à $f(x)$ :', 'la partie $D$ prend chaque fois le contraire.'], ['C’est l’argument diagonal.'], ['Si $D$ était l’image d’un élément $a$, cet élément serait dans $D$ et n’y serait pas.'], ['Quelle que soit $f$, une partie lui échappe.']]); }

  // ---------- 6. les relations d'équivalence ----------
  const C3 = [C.bleu, C.orange, VIOLET];
  function equiv(ctx, t) { const V = S.equiv;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); [['réflexive', 'e_1', 480], ['symétrique', 'e_2', 920], ['transitive', 'e_3', 1440]].forEach(([s, id, x]) => { txt(ctx, s, x, 244, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, id, x, 296, { fs: 32, mil: 1, a: kd }); });
      const ka = ap(t, V.axe), X = (v) => 250 + 102 * (v + 5); seg(ctx, [200, 480], [1720, 480], { c: C.gm, lw: 3, a: ka }); for (let v = -5; v <= 8; v++) { const r = ((v % 3) + 3) % 3, k = ap(t, V.cl[r]); pt(ctx, [X(v), 480], { c: k > 0.5 ? C3[r] : C.gl, r: 16, a: ka }); txt(ctx, String(v).replace('-', '−'), X(v), 540, { fam: F.main, w: 400, size: 28, c: C.encre3, a: ka }); }
      ['e_c0', 'e_c1', 'e_c2'].forEach((id, r) => fo(ctx, t, id, 500 + r * 460, 410, 36, V.cl[r])); const kt = ap(t, V.th); carte(ctx, 260, 600, 1400, 130, 'THÉORÈME', kt); formule(ctx, 'e_th', CX, 672, { fs: 34, mil: 1, a: kt }); });
    legs(ctx, t, V, [['Une [relation d’équivalence] sert à identifier des objets.'], ['La congruence modulo 3 range les entiers en trois [classes d’équivalence].'], ['Deux classes sont égales ou disjointes : les classes forment une partition.']]); }

  // ---------- 7. les relations d'ordre ----------
  const HA = { 1: [470, 720], 2: [360, 600], 3: [600, 600], 4: [300, 470], 6: [540, 470], 12: [420, 340] }, AR = [[1, 2], [1, 3], [2, 4], [2, 6], [3, 6], [4, 12], [6, 12]];
  function hasse(ctx, n, o = {}) { AR.forEach(([a, b], i) => seg(ctx, HA[a], HA[b], { c: C.gm, lw: 3, k: borne(n - i) })); Object.entries(HA).forEach(([v, p]) => { const sel = o.sel && o.sel.includes(+v) ? o.c : null; cadre(ctx, p[0], p[1], 76, 60, { fill: C.surface, stroke: sel || C.filet, lw: sel ? 4 : 2, r: 10, a: borne(n) }); txt(ctx, v, p[0], p[1] + 12, { fam: F.main, w: 400, size: 34, c: sel || C.encre, a: borne(n) }); }); }
  function ordre(ctx, t) { const V = S.ordre;
    phase(ctx, t, 38, 42, () => { const kd = ap(t, V.def); carte(ctx, 160, 165, 1600, 170, 'DÉFINITION', kd); [['réflexive', 'o_1', 440], ['antisymétrique', 'o_2', 900], ['transitive', 'o_3', 1450]].forEach(([s, id, x]) => { txt(ctx, s, x, 244, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, id, x, 296, { fs: 30, mil: 1, a: kd }); });
      tx(ctx, t, 'ordre total : deux éléments sont toujours comparables', CX, 450, V.tot, { size: 32 }); tx(ctx, t, 'l’ordre usuel sur les réels', CX, 500, V.tot, { c: C.encre2, w: 500, size: 28 });
      tx(ctx, t, 'ordre partiel : certains éléments ne le sont pas', CX, 620, V.par, { size: 32 }); tx(ctx, t, 'la divisibilité sur les entiers naturels : 2 ne divise pas 3, et 3 ne divise pas 2', CX, 670, V.par, { c: C.encre2, w: 500, size: 28 }); });
    phase(ctx, t, 42, 46, () => { const kn = ap(t, V.nc); hasse(ctx, 8 * pr(t, V.hasse[0], V.hasse[1] - V.hasse[0]), { sel: kn > 0.5 ? [4, 6] : null, c: C.orange }); if (ap(t, V.maj) > 0.5) rond(ctx, HA[12], C.cours, ap(t, V.maj), 52);
      tx(ctx, t, 'les diviseurs de 12, ordonnés par la divisibilité', 450, 245, V.hasse[0], { c: C.encre2, w: 500, size: 26 });
      tx(ctx, t, '4 et 6 ne sont pas comparables.', 1330, 300, V.nc, { size: 32, c: C.orange }); tx(ctx, t, '12 est un majorant de la partie {4, 6}.', 1330, 410, V.maj, { size: 32, c: C.cours }); tx(ctx, t, 'Mais {4, 6} n’a pas de plus grand élément :', 1330, 520, V.pg, { size: 30 }); tx(ctx, t, 'un plus grand élément doit appartenir à la partie.', 1330, 566, V.pg, { c: C.encre2, w: 500, size: 28 });
      const kp = ap(t, V.prop); carte(ctx, 900, 620, 860, 110, 'PROPOSITION', kp); txt(ctx, 'Une partie a au plus un plus grand élément.', 1330, 692, { fam: F.ui, w: 600, size: 28, a: kp }); });
    legs(ctx, t, V, [['Une [relation d’ordre] sert à comparer : la symétrie cède la place à l’antisymétrie.'], ['Quand deux éléments quelconques se comparent toujours, l’ordre est [total].'], ['Sinon il est [partiel] : c’est le cas de la divisibilité, ou de l’inclusion.'], ['Le diagramme de Hasse : on monte d’un élément à ceux qu’il divise.'], ['Aucun chemin montant ne relie 4 et 6 ; 12 les majore tous les deux.'], ['Un [majorant] n’est un [plus grand élément] que s’il appartient à la partie.']]); }

  const ACTES_DEF = () => [acte(3, S.bij, TI.ech, posTir, S.bij.sortie), acte(4, S.cantor, TB.ech, posDiag, S.cantor.sortie)];
  function vignetteFig(ctx) { const s = { ...TB }; Object.assign(TB, { x: 1240, y: 380, dx: 110, dy: 72 }); tableau(ctx, 6, 9); const p = cel(2.3, 2.3); K.chienSur(ctx, p[0], p[1] + 10, 0.42, 3.2, { t: 0.3, allure: 'trot', phase: 0.2 }); Object.assign(TB, s); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois théorèmes", ["b_1", "b_2", "b_3"], [32, 32, 40], [620, 620, 500], [["Bijective : exactement quand", "une réciproque existe."], ["Le théorème de Cantor :", "l’argument diagonal."], ["Les classes d’équivalence", "forment une partition."]], "Relier les ensembles, puis {comparer leurs éléments}."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 76, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (250 + 215 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
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
    txt(ctx, "Applications", 76, 352, { size: 124, w: 800, align: 'left' }); txt(ctx, "et relations", 76, 506, { size: 124, w: 800, align: 'left' });
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
    histoire(ctx, ts); imagesP(ctx, ts); transmet(ctx, ts); bij(ctx, ts); cantor(ctx, ts); equiv(ctx, ts); ordre(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
