// LE FILM — « Logique et ensembles », MPSI, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y est le réel y qui répond à chaque x : il se place toujours un pas plus loin, puis se fait dépasser quand on
// lui demande de convenir pour tous les x à la fois.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Logique et ensembles', NIVEAU = 'MPSI', LONG = 'MPSI · CHAPITRE 1', NB_EXERCICES = 49;

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
    ligne(ctx, 'La langue dans laquelle tout le reste {s’écrit}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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
  // ---------- 1. une lettre de 1902 ----------
  function histoire(ctx, t) { const V = S.histoire;
    phase(ctx, t, 2, 6, () => { const kl = ap(t, V.lettre); cadre(ctx, CX, 290, 1200, 210, { fill: C.surface, stroke: C.filet, lw: 2, a: kl }); txt(ctx, '16 juin 1902 · Russell écrit à Frege', CX, 262, { size: 44, w: 700, a: kl });
      txt(ctx, 'Si toute propriété définit un ensemble,', CX, 322, { fam: F.ui, w: 500, size: 27, c: C.encre2, a: kl }); txt(ctx, 'alors « ne pas s’appartenir à soi-même » mène à une contradiction.', CX, 360, { fam: F.ui, w: 500, size: 27, c: C.encre2, a: kl });
      const kf = ap(t, V.frise, 0.8), X = (an) => 260 + (an - 1840) / 75 * 1400, Y = 580; seg(ctx, [X(1840), Y], [X(1915), Y], { c: C.gm, lw: 3, k: kf });
      [[1847, 'Boole, De Morgan', 'la logique devient un calcul', -1], [1879, 'Frege', 'les quantificateurs', 1], [1889, 'Peano', 'le symbole ∈', -1], [1902, 'Russell', 'le paradoxe', 1], [1908, 'Zermelo', 'des axiomes pour les ensembles', -1]].forEach(([an, nom, quoi, h], i) => { const k = ap(t, V.dates[i]); if (k <= 0) return; const x = X(an);
        pt(ctx, [x, Y], { c: i === 3 ? C.orange : C.cours, r: 9, a: k }); seg(ctx, [x, Y], [x, Y + h * 46], { c: C.gm, lw: 2.5, a: k }); txt(ctx, `${an} · ${nom}`, x, Y + h * 80 + (h > 0 ? 22 : -22), { size: 30, w: 700, a: k }); txt(ctx, quoi, x, Y + h * 80 + (h > 0 ? 56 : 12), { fam: F.ui, w: 500, size: 23, c: C.encre2, a: k }); }); });
    legs(ctx, t, V, [['Une lettre suffit à ébranler l’arithmétique que Frege vient de fonder.'], ['En un demi-siècle, la logique était devenue un calcul : il fallait désormais l’encadrer.']]); }

  // ---------- 2. les lois de la logique ----------
  function lois(ctx, t) { const V = S.lois;
    phase(ctx, t, 6, 10, () => { tableV(ctx, 420, 230, ['h_P', 'h_Q', 'h_imp', 'h_nou'], ['VVVV', 'VFFF', 'FVVV', 'FFVV'], (i) => ap(t, V.tab + (i + 1) * 0.5), { w: 300, fs: 32 });
      const ke = ap(t, V.egal); ctx.save(); ctx.globalAlpha *= ke; ctx.strokeStyle = C.cours; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(420 + 2 * 300 - 150, 190, 600, 384, 14); ctx.stroke(); ctx.restore(); tx(ctx, t, 'Les deux colonnes coïncident : les deux assertions sont équivalentes.', CX, 680, V.egal, { c: C.cours }); });
    phase(ctx, t, 10, 14, () => { [['l_m1', 'De Morgan', 520, 270], ['l_m2', 'De Morgan', 1400, 270], ['l_ni', 'négation d’une implication', 520, 560], ['l_c', 'contraposée', 1400, 560]].forEach(([id, nom, x, y], i) => { const k = ap(t, V.lois[i]); carte(ctx, x - 410, y - 100, 820, 190, nom.toUpperCase(), k); formule(ctx, id, x, y + 14, { fs: 34, mil: 1, a: k }); }); });
    legs(ctx, t, V, [['L’implication n’est fausse que si l’hypothèse est vraie et la conclusion fausse.'], ['« P implique Q » dit la même chose que « non P, ou Q ».'], ['La négation échange « et » et « ou ».'], ['Nier une implication, ce n’est pas écrire une autre implication.']]); }

  // ---------- 3. l'ordre des quantificateurs ----------
  const X3 = (v) => 760 + v * 150, Y3 = 620;
  const xPoint = (t) => { const V = S.quantif; return lerp(lerp(lerp(-3, 0, doux(pr(t, V.x1, 0.6))), 2, doux(pr(t, V.x2, 0.6))), 4.5, doux(pr(t, V.x3, 1.2))); };
  const posY = (t) => { const V = S.quantif, k1 = doux(pr(t, V.y1[0], V.y1[1] - V.y1[0])), k2 = doux(pr(t, V.y2[0], V.y2[1] - V.y2[0])), y = lerp(lerp(-2, 1, k1), 3, k2), m = (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1);
    return { p: [X3(y), Y3], y, marche: m, assis: !m && t > V.y2[1] ? doux(pr(t, V.y2[1], 0.4)) : undefined, tete: t > V.x3 ? 0.35 : 0.05 }; };
  function quantif(ctx, t) { const V = S.quantif;
    phase(ctx, t, 14, 22, () => { const kn = ap(t, V.neg); formule(ctx, 'q_a', 560, 220, { fs: 42, mil: 1, a: kn }); marque(ctx, 960, 220, 18, true, ap(t, V.vrai)); tx(ctx, t, 'sa négation :', 1090, 232, V.neg2, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'q_na', 1500, 220, 38, V.neg2);
      const ka = ap(t, V.axe, 0.8), x = xPoint(t); axeGradue(ctx, X3, Y3, -4, 6.5, [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], ka);
      pt(ctx, [X3(x), Y3], { c: C.orange, r: 13, a: ka }); formule(ctx, 'q_x', X3(x), Y3 - 40, { fs: 44, mil: 1, a: ka }); fo(ctx, t, 'q_yx', 560, 360, 46, V.x1 - 0.5); tx(ctx, t, 'le y choisi dépend de x', 560, 430, V.x1 - 0.5, { size: 26, c: C.encre2, w: 500 });
      fo(ctx, t, 'q_b', 1400, 360, 42, V.x3 - 0.3); marque(ctx, 1800, 360, 18, false, ap(t, V.faux)); tx(ctx, t, 'un même y pour tous les x : impossible', 1400, 430, V.faux, { size: 26, c: C.orange }); });
    legs(ctx, t, V, [['Pour nier une assertion quantifiée, on échange les quantificateurs et l’on nie la fin.'], ['À chaque $x$, le chien répond par un $y$ plus grand : il se place un pas plus loin.'], ['« Pour tout $x$, il existe $y$ » : l’assertion est vraie.'], ['Si $y$ doit être choisi avant $x$, il se fait dépasser : l’ordre des quantificateurs compte.']]); }

  // ---------- 4. la disjonction des cas ----------
  const R4 = K.repere({ x: 110, y: 290, w: 800, h: 460 }, { x0: -3.4, x1: 3.4, y0: 0, y1: 7 }), phi = (x) => Math.abs(x - 1) + Math.abs(x + 1);
  function cas(ctx, t) { const V = S.cas;
    phase(ctx, t, 22, 26, () => { fo(ctx, t, 'c_e', CX, 215, 48, V.enonce); const kf = ap(t, V.fig, 0.8);
      [[-3.4, -1, 'rgba(85,170,255,0.14)'], [-1, 1, 'rgba(53,202,164,0.16)'], [1, 3.4, 'rgba(255,162,74,0.14)']].forEach(([a, b, c], i) => { const k = ap(t, V.c[i], 0.5); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = c; ctx.fillRect(R4.X(a), R4.b.y, R4.X(b) - R4.X(a), R4.b.h); ctx.restore(); } });
      K.axes(ctx, R4, kf, { gx: [-3, -2, -1, 1, 2, 3], gy: [2, 4, 6] }); K.courbe(ctx, R4, phi, -3.4, lerp(-3.4, 3.4, kf)); K.trait(ctx, R4, -3.4, 2, 3.4, 2, { c: C.cours, dash: [8, 8], a: ap(t, V.concl) });
      ['c_1', 'c_2', 'c_3'].forEach((id, i) => fo(ctx, t, id, 1420, 380 + i * 110, 34, V.c[i])); tx(ctx, t, 'Les trois cas recouvrent ℝ : l’inégalité est démontrée.', 1420, 720, V.concl, { c: C.cours, size: 28 }); });
    legs(ctx, t, V, [['Les valeurs absolues changent d’expression en −1 et en 1.'], ['On traite séparément chaque cas, en vérifiant qu’ils recouvrent toutes les situations.'], ['C’est le raisonnement par [disjonction des cas].']]); }

  // ---------- 5. l'analyse-synthèse ----------
  const R5 = K.repere({ x: 110, y: 170, w: 800, h: 580 }, { x0: -2.2, x1: 2.2, y0: -4, y1: 4.2 });
  function analyse(ctx, t) { const V = S.analyse;
    phase(ctx, t, 26, 32, () => { const kt = ap(t, V.th); carte(ctx, 410, 160, 1100, 170, 'THÉORÈME', kt); txt(ctx, 'Toute fonction de ℝ dans ℝ s’écrit de manière unique', CX, 238, { fam: F.ui, w: 500, size: 27, a: kt }); formule(ctx, 'a_th', CX, 286, { fs: 34, mil: 1, a: kt });
      tx(ctx, t, 'Analyse', 300, 400, V.an[0], { c: C.cours, size: 34 }); tx(ctx, t, 'si une solution existe…', 300, 444, V.an[0], { c: C.encre2, size: 24, w: 500 }); fo(ctx, t, 'a_1', 760, 380, 38, V.an[0]); fo(ctx, t, 'a_2', 760, 450, 38, V.an[1]); fo(ctx, t, 'a_g', 1400, 414, 34, V.an[2]);
      tx(ctx, t, 'Synthèse', 300, 620, V.syn[0], { c: C.cours, size: 34 }); tx(ctx, t, '… on vérifie qu’elle convient', 300, 664, V.syn[0], { c: C.encre2, size: 24, w: 500 }); fo(ctx, t, 'a_s', 1120, 630, 34, V.syn[0]); marque(ctx, 1720, 630, 18, true, ap(t, V.syn[1])); });
    phase(ctx, t, 32, 34, () => { const kf = ap(t, V.fig, 0.8), kg = ap(t, V.gh, 0.9); K.axes(ctx, R5, kf, { gx: [-2, -1, 1, 2], gy: [-2, 2] }); K.courbe(ctx, R5, Math.exp, -2.2, lerp(-2.2, 1.44, kf));
      K.courbe(ctx, R5, Math.cosh, -2.1, lerp(-2.1, 2.1, kg), { c: C.cours, lw: 4 }); K.courbe(ctx, R5, Math.sinh, -2.1, lerp(-2.1, 2.1, kg), { c: C.orange, lw: 4 });
      formule(ctx, 'a_f', 1400, 260, { fs: 50, mil: 1, a: kf }); formule(ctx, 'a_lg', 1400, 440, { fs: 44, mil: 1, a: kg }); formule(ctx, 'a_lh', 1400, 620, { fs: 44, mil: 1, a: kg }); });
    legs(ctx, t, V, [['Pour démontrer qu’un objet existe et qu’il est unique : l’[analyse-synthèse].'], ['L’analyse : on suppose le problème résolu, et l’on trouve ce que la solution doit être.'], ['La synthèse : on vérifie que ce candidat convient.', 'L’analyse donne l’unicité, la synthèse l’existence.'], ['Pour l’exponentielle, voici sa partie paire et sa partie impaire.']]); }

  // ---------- 6. des assertions aux ensembles ----------
  function ensembles(ctx, t) { const V = S.ensembles;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.eg); carte(ctx, 410, 165, 1100, 150, 'DOUBLE INCLUSION', kd); formule(ctx, 'e_dbl', CX, 250, { fs: 42, mil: 1, a: kd }); fo(ctx, t, 'e_eg', CX, 420, 50, V.eg);
      tx(ctx, t, '⊂', 420, 562, V.i1, { size: 44, c: C.cours }); fo(ctx, t, 'e_i1', 700, 550, 42, V.i1); tx(ctx, t, '⊃', 1040, 562, V.i2[0], { size: 44, c: C.cours }); fo(ctx, t, 'e_i2', 1400, 550, 42, V.i2[0]); tx(ctx, t, 'pour tout entier n', 1400, 630, V.i2[1], { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 38, 42, () => { const kv = ap(t, V.venn, 0.8), c3 = [[470, 420, C.bleu, 'e_A', -150, -130], [650, 420, C.orange, 'e_B', 150, -130], [560, 570, C.cours, 'e_C', 0, 125]]; ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(200, 190, 720, 570); ctx.lineWidth = 4;
      c3.forEach(([x, y, c, id, dx, dy]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, 160, 0, 6.3); ctx.stroke(); formule(ctx, id, x + dx, y + dy, { fs: 40, mil: 1 }); }); formule(ctx, 'e_E', 880, 226, { fs: 36, mil: 1 }); ctx.restore();
      tx(ctx, t, 'huit régions : les huit lignes d’une table de vérité', 1440, 250, V.huit, { c: C.cours, size: 30 }); fo(ctx, t, 'e_m', 1440, 430, 46, V.huit + 1.5); fo(ctx, t, 'e_p', 1440, 630, 46, V.part); tx(ctx, t, 'une partition de ℤ', 1440, 700, V.part, { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 42, 46, () => { fo(ctx, t, 'e_r', 560, 260, 54, V.russ); fo(ctx, t, 'e_r2', 560, 400, 50, V.r2); tx(ctx, t, 'le paradoxe de Russell', 560, 480, V.r2, { c: C.orange });
      const kz = ap(t, V.zer); cadre(ctx, 1400, 320, 760, 230, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kz }); formule(ctx, 'e_z', 1400, 280, { fs: 52, mil: 1, a: kz }); txt(ctx, 'on choisit les éléments dans un ensemble déjà construit', 1400, 384, { fam: F.ui, w: 500, size: 25, a: kz });
      [['non P', 'complémentaire'], ['P et Q', 'intersection'], ['P ou Q', 'réunion'], ['P ⇒ Q', 'inclusion']].forEach(([a, b2], i) => { const k = ap(t, V.dico + i * 0.3), x = 330 + i * 420; cadre(ctx, x, 660, 380, 110, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); txt(ctx, a, x, 648, { fam: F.ui, w: 600, size: 30, a: k }); txt(ctx, b2, x, 692, { fam: F.ui, w: 500, size: 26, c: C.cours, a: k }); }); });
    legs(ctx, t, V, [['Deux ensembles sont égaux quand chacun est inclus dans l’autre.'], ['La première inclusion est claire ; pour la seconde, on écrit chaque entier sous la forme voulue.'], ['Trois parties découpent l’ensemble en huit régions.'], ['Les lois de De Morgan valent pour toute famille de parties.'], ['L’ensemble de Russell ne peut ni s’appartenir, ni ne pas s’appartenir.'], ['D’où la règle de Zermelo, et un dictionnaire entre logique et ensembles.']]); }

  const ACTES_DEF = () => [acte(2, S.quantif, 2.6, posY, S.quantif.sortie)];
  function vignetteFig(ctx) { [[1320, 440, C.bleu], [1560, 440, C.orange], [1440, 640, C.cours]].forEach(([x, y, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, 210, 0, 6.3); ctx.stroke(); }); K.chienSur(ctx, 1440, 560, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); }

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois réflexes", ["b_i", "b_q", "b_e"], [30, 30, 30], [580, 580, 580], [["Nier une implication :", "l’hypothèse sans la conclusion."], ["On ne peut pas, en général,", "échanger « pour tout » et « il existe »."], ["Une égalité d’ensembles :", "deux inclusions."]], "Chaque opération sur les ensembles traduit une opération {logique}."); }

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
    txt(ctx, "Logique", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "et ensembles", 76, 506, { size: 150, w: 800, align: 'left' });
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
    histoire(ctx, ts); lois(ctx, ts); quantif(ctx, ts); cas(ctx, ts); analyse(ctx, ts); ensembles(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
