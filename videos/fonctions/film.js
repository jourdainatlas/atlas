// LE FILM — « Fonctions numériques », Terminale spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y court sur une courbe vers son asymptote, puis parcourt une cubique avec la tangente sous ses pattes :
// on la voit passer d'un côté à l'autre de la courbe au point d'inflexion.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Fonctions numériques', NIVEAU = 'TERMINALE SPÉCIALITÉ', LONG = 'TERMINALE SPÉCIALITÉ · CHAPITRE 3', NB_EXERCICES = 45;

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
    ligne(ctx, 'Limites, convexité, {continuité}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const pente = (R, d) => Math.atan(-d * R.ky / R.kx), incl = (an) => borne(an, -0.85, 0.85);      // le chien ne se penche pas au-delà de 49°                                    // angle à l'écran d'une pente d du repère
  const poly = (ctx, P, fill) => { ctx.save(); ctx.fillStyle = fill; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.restore(); };

  // ---------- 1. une limite en l'infini ----------
  const R1 = K.repere({ x: 110, y: 185, w: 1750, h: 535 }, { x0: 0, x1: 14, y0: 0, y1: 6.5 }), f1 = (x) => 2 + 3 / (x - 1), P1 = { x0: 2, x1: 15.6, ech: 3.0, eps: 0.5 };
  const xChien1 = (t) => lerp(P1.x0, P1.x1, pr(t, S.limite.course[0], S.limite.course[1] - S.limite.course[0]));
  function limite(ctx, t) {
    const V = S.limite, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kb = ap(t, V.bande, 0.6), ks = ap(t, V.seuil);
    if (kb > 0) { poly(ctx, [XY(R1, 0, 2 + P1.eps), XY(R1, 14, 2 + P1.eps), XY(R1, 14, 2 - P1.eps), XY(R1, 0, 2 - P1.eps)], `rgba(255,162,74,${0.13 * kb})`);
      if (ks > 0) poly(ctx, [XY(R1, 7, 2 + P1.eps), XY(R1, 14, 2 + P1.eps), XY(R1, 14, 2 - P1.eps), XY(R1, 7, 2 - P1.eps)], `rgba(53,202,164,${0.16 * ks})`);
      K.trait(ctx, R1, 0, 2 + P1.eps, 14, 2 + P1.eps, { c: C.orange, lw: 2, a: kb }); K.trait(ctx, R1, 0, 2 - P1.eps, 14, 2 - P1.eps, { c: C.orange, lw: 2, a: kb }); }
    K.axes(ctx, R1, ap(t, V.axes, 0.8), { gx: [2, 4, 6, 8, 10, 12], gy: [1, 2, 3, 4, 5, 6] });
    K.trait(ctx, R1, 0, 2, 14, 2, { c: C.cours, lw: 3, dash: [12, 10], a: kb });
    const kc = doux(pr(t, V.courbe, 1.3)); K.courbe(ctx, R1, f1, 1.667, lerp(1.667, 14, kc));
    if (ks > 0) { K.trait(ctx, R1, 7, 0, 7, 2 + P1.eps, { c: C.orange, lw: 3, dash: [8, 8], a: ks }); K.point(ctx, R1, 7, f1(7), { k: ks, r: 8, c: C.orange });
      txt(ctx, 'dès que x > 7, f(x) reste dans la bande', R1.X(10.5), R1.Y(1.5) + 46, { fam: F.ui, w: 600, size: 28, c: C.cours, a: ks }); }
    formule(ctx, 'm_f', 1180, 262, { fs: 52, mil: 1, a: ap(t, V.courbe + 0.5), monte: 1 }); formule(ctx, 'm_lim', 1180, 400, { fs: 56, mil: 1, a: ap(t, V.lim), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Que deviennent les valeurs de $f$ quand $x$ devient très grand ?']);
    legende(ctx, t, V.leg[1], ['On choisit un intervalle ouvert autour de 2, aussi étroit que l’on veut.']);
    legende(ctx, t, V.leg[2], ['Dès que $x$ est assez grand, $f(x)$ n’en sort plus :', 'la [limite] de $f$ en plus l’infini est 2.'], { size: 40 });
  }

  // ---------- 2. limites infinies et asymptotes ----------
  const R2 = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -4, x1: 6, y0: -4, y1: 8 });
  function asymptotes(ctx, t) {
    const V = S.asymptotes, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R2, ap(t, V.fig, 0.8), { gx: [-3, -2, -1, 1, 2, 3, 4, 5], gy: [-2, 2, 4, 6], sansO: 1 });
    const kav = ap(t, V.av, 0.6), kah = ap(t, V.ah, 0.6), kc = doux(pr(t, V.courbe, 1.2));
    K.trait(ctx, R2, 1, -4, 1, lerp(-4, 8, kav), { c: C.orange, lw: 3.5, dash: [12, 10], a: kav }); formule(ctx, 'a_x1', R2.X(1) + 62, R2.Y(-3.3), { fs: 36, mil: 1, a: kav });
    K.trait(ctx, R2, -4, 2, lerp(-4, 6, kah), 2, { c: C.cours, lw: 3.5, dash: [12, 10], a: kah }); formule(ctx, 'a_y2', R2.X(-3.2), R2.Y(2) - 30, { fs: 36, mil: 1, a: kah });
    K.courbe(ctx, R2, f1, lerp(0.5, -4, kc), 0.5); K.courbe(ctx, R2, f1, 1.5, lerp(1.5, 6, kc));
    const kd = ap(t, V.droite), kg = ap(t, V.gauche); if (kd > 0) fl(ctx, XY(R2, 1.32, 4.6), XY(R2, 1.32, 7.6), { c: C.orange, lw: 5, k: kd }); if (kg > 0) fl(ctx, XY(R2, 0.68, -0.6), XY(R2, 0.68, -3.6), { c: C.orange, lw: 5, k: kg });
    if (kah > 0 && ap(t, V.pos) > 0) { const kp = ap(t, V.pos); ctx.save(); ctx.globalAlpha *= kp; K.dans(ctx, R2, () => { ctx.fillStyle = 'rgba(53,202,164,0.16)'; ctx.beginPath(); ctx.moveTo(R2.X(1.5), R2.Y(2)); for (let x = 1.5; x <= 6.001; x += 0.05) ctx.lineTo(R2.X(x), R2.Y(f1(x))); ctx.lineTo(R2.X(6), R2.Y(2)); ctx.closePath(); ctx.fill(); }); ctx.restore(); }
    let k = fen(t, L(6) + 0.1, L(10), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'a_f', 1440, 225, { fs: 52, mil: 1, a: ap(t, V.courbe), monte: 1 }); formule(ctx, 'a_d', 1440, 380, { fs: 50, mil: 1, a: kd, monte: 1 }); formule(ctx, 'a_g', 1440, 510, { fs: 50, mil: 1, a: kg, monte: 1 });
      const kv = ap(t, V.av); cadre(ctx, 1440, 660, 640, 96, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kv }); txt(ctx, 'asymptote verticale :', 1350, 672, { fam: F.ui, w: 600, size: 32, a: kv }); formule(ctx, 'a_x1', 1630, 660, { fs: 44, mil: 1, a: kv }); ctx.restore(); }
    k = fen(t, L(10) + 0.1, L(14), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'a_f2', 1440, 225, { fs: 52, mil: 1, a: ap(t, V.autre), monte: 1 }); formule(ctx, 'a_inf', 1440, 370, { fs: 50, mil: 1, a: ap(t, V.inf), monte: 1 });
      cadre(ctx, 1440, 510, 680, 96, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kah }); txt(ctx, 'asymptote horizontale :', 1340, 522, { fam: F.ui, w: 600, size: 32, a: kah }); formule(ctx, 'a_y2', 1650, 510, { fs: 44, mil: 1, a: kah });
      formule(ctx, 'a_pos', 1440, 670, { fs: 40, mil: 1, a: ap(t, V.pos), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quand $x$ s’approche de 1, le dénominateur s’approche de 0.']);
    legende(ctx, t, V.leg[1], ['À droite de 1, les valeurs de $f$ dépassent tout nombre ;', 'à gauche, elles plongent vers moins l’infini.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Limite infinie en un réel : la courbe a une [asymptote verticale].']);
    legende(ctx, t, V.leg[3], ['Une autre écriture de $f(x)$ montre ce qui se passe à l’infini.']);
    legende(ctx, t, V.leg[4], ['Limite finie à l’infini : la courbe a une [asymptote horizontale].']);
    legende(ctx, t, V.leg[5], ['Le signe de la différence dit de quel côté de l’asymptote passe la courbe.']);
  }

  // ---------- 3. formes indéterminées, puis théorème des gendarmes ----------
  const R3 = K.repere({ x: 110, y: 190, w: 880, h: 540 }, { x0: 0, x1: 31, y0: -1.15, y1: 1.15 });
  function indet(ctx, t) {
    const V = S.indet, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(14) + 0.1, L(18), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      txt(ctx, 'FORMES INDÉTERMINÉES', 400, 205, { fam: F.mono, w: 700, size: 20, ls: 3, c: C.orange, a: ap(t, V.fi[0]) });
      ['i_1', 'i_2', 'i_3', 'i_4'].forEach((id, i) => { const kk = ap(t, V.fi[i]), cx = 250 + (i % 2) * 300, cy = 330 + Math.floor(i / 2) * 230; cadre(ctx, cx, cy, 270, 190, { fill: C.surface, stroke: C.filet, lw: 2, a: kk }); formule(ctx, id, cx, cy, { fs: i ? 50 : 36, mil: 1, a: kk }); });
      formule(ctx, 'i_ex', 1330, 240, { fs: 46, mil: 1, a: ap(t, V.ex), monte: 1 }); formule(ctx, 'i_fact', 1330, 430, { fs: 42, mil: 1, a: ap(t, V.fact), monte: 1 }); formule(ctx, 'i_res', 1330, 640, { fs: 42, mil: 1, a: ap(t, V.res), monte: 1 }); ctx.restore(); }
    k = fen(t, L(18) + 0.1, L(22), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kg = doux(pr(t, V.gend, 1.2)), ks = doux(pr(t, V.sinc, 1.6));
      K.axes(ctx, R3, ap(t, V.fig, 0.8), { gx: [10, 20, 30], gy: [-1, 1] });
      K.courbe(ctx, R3, (x) => 1 / x, 0.87, lerp(0.87, 31, kg), { c: VIOLET, lw: 4 }); K.courbe(ctx, R3, (x) => -1 / x, 0.87, lerp(0.87, 31, kg), { c: VIOLET, lw: 4 });
      K.courbe(ctx, R3, (x) => Math.sin(x) / x, 0.9, lerp(0.9, 31, ks), { lw: 5 });
      formule(ctx, 'g_h', R3.X(5.4), R3.Y(0.52), { fs: 34, mil: 1, a: kg }); formule(ctx, 'g_b', R3.X(5.6), R3.Y(-0.52), { fs: 34, mil: 1, a: kg });
      formule(ctx, 'g_enc', 1440, 320, { fs: 52, mil: 1, a: ap(t, V.enc), monte: 1 }); formule(ctx, 'g_lim', 1440, 560, { fs: 56, mil: 1, a: ap(t, V.lim), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quatre cas où les règles de calcul ne permettent pas de conclure :', 'les [formes indéterminées].'], { size: 40 });
    legende(ctx, t, V.leg[1], ['On lève l’indétermination en factorisant par le terme de plus haut degré.']);
    legende(ctx, t, V.leg[2], ['Le sinus n’a pas de limite à l’infini, mais il reste compris entre −1 et 1.']);
    legende(ctx, t, V.leg[3], ['Prise entre deux fonctions de même limite, la troisième les suit :', 'c’est le [théorème des gendarmes].'], { size: 40 });
  }

  // ---------- 4. la dérivée d'une fonction composée ----------
  function composee(ctx, t) {
    const V = S.composee, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kt = ap(t, V.th); carte(ctx, 410, 180, 1100, 190, 'THÉORÈME', kt); formule(ctx, 'k_th', CX, 292, { fs: 56, mil: 1, a: kt });
    const w1 = largeur('k_e1', 44), w2 = largeur('k_r1', 44), x1 = CX - (w1 + w2 + 14) / 2; formule(ctx, 'k_e1', x1, 500, { fs: 44, mil: 1, align: 'left', a: ap(t, V.ex1), monte: 1 }); formule(ctx, 'k_r1', x1 + w1 + 14, 500, { fs: 44, mil: 1, align: 'left', a: ap(t, V.r1), monte: 1 });
    const w3 = largeur('k_e2', 48), w4 = largeur('k_r2', 48), x2 = CX - (w3 + w4 + 14) / 2; formule(ctx, 'k_e2', x2, 650, { fs: 48, mil: 1, align: 'left', a: ap(t, V.ex2), monte: 1 }); formule(ctx, 'k_r2', x2 + w3 + 14, 650, { fs: 48, mil: 1, align: 'left', a: ap(t, V.r2), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['On dérive la fonction extérieure, puis on multiplie par la dérivée de l’intérieur.']);
    legende(ctx, t, V.leg[1], ['L’erreur la plus fréquente est d’oublier ce second facteur, écrit ici en orange.']);
  }

  // ---------- 5. la convexité ----------
  const R5 = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -1.3, x1: 3.3, y0: -2.7, y1: 2.7 }), f5 = (x) => x * x * x - 3 * x * x + 2, d5 = (x) => 3 * x * x - 6 * x, P5 = { x0: -0.9, x1: 2.9, ech: 3.0 };
  const xChien5 = (t) => lerp(P5.x0, P5.x1, pr(t, S.convexe.course[0], S.convexe.course[1] - S.convexe.course[0]));
  function tangente5(ctx, x, a, demi = 190) { const p = XY(R5, x, f5(x)), an = pente(R5, d5(x)), u = [Math.cos(an), Math.sin(an)]; seg(ctx, [p[0] - u[0] * demi, p[1] - u[1] * demi], [p[0] + u[0] * demi, p[1] + u[1] * demi], { c: C.cours, lw: 4.5, a }); }
  function convexe(ctx, t) {
    const V = S.convexe, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R5, ap(t, V.axes, 0.8), { gx: [-1, 1, 2, 3], gy: [-2, -1, 1, 2] });
    const kc = doux(pr(t, V.courbe, 1.3)); K.courbe(ctx, R5, f5, -1.3, lerp(-1.3, 3.3, kc));
    const x = xChien5(t), kt = fen(t, V.atterrit + 0.4, S.CH[4].t1 - 1.5, 0.4); K.dans(ctx, R5, () => tangente5(ctx, x, kt));
    const ki = ap(t, V.inflexion); K.point(ctx, R5, 1, 0, { k: ki, r: 10, c: C.cours }); txt(ctx, 'point d’inflexion', R5.X(0.5), R5.Y(0) + 82, { fam: F.ui, w: 600, size: 26, c: C.cours, a: ki });
    formule(ctx, 'x_f', 1450, 205, { fs: 46, mil: 1, a: ap(t, V.courbe), monte: 1 }); formule(ctx, 'x_d1', 1450, 285, { fs: 44, mil: 1, a: ap(t, V.d1), monte: 1 }); formule(ctx, 'x_d2', 1450, 365, { fs: 44, mil: 1, a: ap(t, V.d2), monte: 1 });
    let k = 1 - ap(t, V.th - 0.3, 0.3);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const k1 = ap(t, V.concave), k2 = ap(t, V.convexe);
      formule(ctx, 'x_neg', 1450, 490, { fs: 40, mil: 1, a: k1, monte: 1 }); txt(ctx, 'concave : la courbe est sous sa tangente', 1450, 552, { fam: F.ui, w: 600, size: 27, c: C.orange, a: k1 });
      formule(ctx, 'x_pos', 1450, 650, { fs: 40, mil: 1, a: k2, monte: 1 }); txt(ctx, 'convexe : la courbe est au-dessus', 1450, 712, { fam: F.ui, w: 600, size: 27, c: C.cours, a: k2 }); ctx.restore(); }
    const kh = ap(t, V.th); carte(ctx, 1100, 450, 700, 270, 'THÉORÈME', kh); formule(ctx, 'x_th1', 1450, 555, { fs: 46, mil: 1, a: kh }); formule(ctx, 'x_th2', 1450, 650, { fs: 46, mil: 1, a: kh });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une fonction est [concave] quand sa courbe est sous ses tangentes,', '[convexe] quand elle est au-dessus.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['La dérivée seconde est négative : la tangente reste au-dessus de la courbe.']);
    legende(ctx, t, V.leg[2], ['Au [point d’inflexion], la courbe traverse sa tangente.']);
    legende(ctx, t, V.leg[3], ['La dérivée seconde est positive : la courbe passe au-dessus de ses tangentes.']);
    legende(ctx, t, V.leg[4], ['Le signe de la dérivée seconde donne la convexité ;', 'là où il change, la courbe a un point d’inflexion.'], { size: 40 });
  }

  // ---------- 6. continuité et valeurs intermédiaires ----------
  const R6a = K.repere({ x: 160, y: 190, w: 700, h: 540 }, { x0: -0.6, x1: 3.6, y0: -0.4, y1: 3.4 }), R6b = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -0.6, x1: 6.6, y0: -2, y1: 7 }), R6c = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -0.25, x1: 1.35, y0: -1.4, y1: 1.7 });
  const g6 = (x) => 0.25 * (x - 1) * (x - 3) * (x - 5) + 2.5, h6 = (x) => x * x * x + x - 1, ALPHA = 0.6823278;
  function tvi(ctx, t) {
    const V = S.tvi, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(34) + 0.1, L(38), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def), ke = ap(t, V.esc, 0.8), ks = ap(t, V.sauts);
      carte(ctx, 1040, 200, 800, 210, 'DÉFINITION', kd); formule(ctx, 't_def', 1440, 318, { fs: 58, mil: 1, a: kd });
      K.axes(ctx, R6a, ke, { gx: [1, 2, 3], gy: [1, 2, 3] });
      for (let n = 0; n < 4; n++) { const kk = borne(ke * 4 - n); if (kk <= 0) continue; const x1 = Math.min(n + 1, 3.6); seg(ctx, XY(R6a, n, n), XY(R6a, x1, n), { c: C.bleu, lw: 6, k: kk }); pt(ctx, XY(R6a, n, n), { c: C.bleu, r: 9, a: kk }); if (n < 3) pt(ctx, XY(R6a, n + 1, n), { c: C.bleu, r: 9, creux: 1, a: kk });
        if (n > 0) seg(ctx, XY(R6a, n, n - 1), XY(R6a, n, n), { c: C.orange, lw: 3, dash: [6, 8], a: ks }); }
      txt(ctx, 'la partie entière', 1440, 560, { fam: F.ui, w: 600, size: 32, c: C.bleu, a: ke }); txt(ctx, 'un saut à chaque entier : elle n’y est pas continue', 1440, 624, { fam: F.ui, w: 500, size: 28, c: C.orange, a: ks }); ctx.restore(); }
    k = fen(t, L(38) + 0.1, L(42), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig, 0.8), kk = ap(t, V.k, 0.7), kt = ap(t, V.th);
      K.axes(ctx, R6b, kf, { gx: [], gy: [], sansO: 1 }); K.courbe(ctx, R6b, g6, 0, lerp(0, 6, doux(pr(t, V.fig + 0.3, 1.3))));
      K.point(ctx, R6b, 0, g6(0), { k: kf, r: 8, c: C.bleu }); K.point(ctx, R6b, 6, g6(6), { k: borne(kf * 2 - 1), r: 8, c: C.bleu });
      K.trait(ctx, R6b, 0, 0, 0, g6(0), { dash: [6, 8], a: kf }); K.trait(ctx, R6b, 6, 0, 6, g6(6), { dash: [6, 8], a: kf }); formule(ctx, 'l_a', R6b.X(0) - 30, R6b.Y(0) - 30, { fs: 38, mil: 1, a: kf }); formule(ctx, 'l_b', R6b.X(6), R6b.Y(0) + 36, { fs: 38, mil: 1, a: kf });
      K.trait(ctx, R6b, -0.6, 2.5, lerp(-0.6, 6.6, kk), 2.5, { c: C.cours, lw: 3.5, dash: [12, 10], a: kk }); formule(ctx, 'l_k', R6b.X(-0.6) + 30, R6b.Y(2.5) - 28, { fs: 40, mil: 1, a: kk });
      [1, 3, 5].forEach((c, i) => { const kc = ap(t, V.c[i]); K.trait(ctx, R6b, c, 2.5, c, 0, { c: C.cours, dash: [6, 8], a: kc }); K.point(ctx, R6b, c, 2.5, { k: kc, r: 10, c: C.cours }); formule(ctx, 'l_c' + (i + 1), R6b.X(c), R6b.Y(0) + 36, { fs: 38, mil: 1, a: kc }); });
      carte(ctx, 1040, 220, 820, 250, 'THÉORÈME', kt); formule(ctx, 't_th1', 1450, 320, { fs: 32, mil: 1, a: kt }); formule(ctx, 't_th2', 1450, 400, { fs: 38, mil: 1, a: kt });
      txt(ctx, 'ici, trois solutions', 1450, 580, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.c[2]) }); ctx.restore(); }
    k = fen(t, L(42) + 0.1, L(46), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kf = ap(t, V.fig3, 0.8), ku = ap(t, V.unique), k1 = ap(t, V.b1), k2 = ap(t, V.b2);
      K.axes(ctx, R6c, kf, { gx: [1], gy: [-1, 1] }); K.courbe(ctx, R6c, h6, -0.25, lerp(-0.25, 1.3, doux(pr(t, V.fig3 + 0.3, 1.2))));
      K.point(ctx, R6c, ALPHA, 0, { k: ku, r: 10, c: C.cours }); formule(ctx, 'l_al', R6c.X(ALPHA) - 26, R6c.Y(0) - 34, { fs: 44, mil: 1, a: ku });
      K.trait(ctx, R6c, 0.6, 0, 0.6, h6(0.6), { c: C.orange, lw: 4, a: k1 }); K.point(ctx, R6c, 0.6, h6(0.6), { k: k1, r: 7, c: C.orange }); txt(ctx, '0,6', R6c.X(0.6) - 34, R6c.Y(0) + 34, { fam: F.main, w: 400, size: 26, c: C.orange, a: k1 });
      K.trait(ctx, R6c, 0.7, 0, 0.7, h6(0.7), { c: C.orange, lw: 4, a: k2 }); K.point(ctx, R6c, 0.7, h6(0.7), { k: k2, r: 7, c: C.orange }); txt(ctx, '0,7', R6c.X(0.7) + 36, R6c.Y(0) + 34, { fam: F.main, w: 400, size: 26, c: C.orange, a: k2 });
      formule(ctx, 't_f', 1450, 205, { fs: 46, mil: 1, a: kf, monte: 1 }); formule(ctx, 't_der', 1450, 290, { fs: 44, mil: 1, a: ap(t, V.der), monte: 1 });
      cadre(ctx, 1450, 400, 720, 90, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: ku }); formule(ctx, 't_eq', 1210, 400, { fs: 40, mil: 1, a: ku }); txt(ctx, 'a une unique solution', 1500, 411, { fam: F.ui, w: 600, size: 30, a: ku }); formule(ctx, 'l_al', 1760, 402, { fs: 44, mil: 1, a: ku });
      formule(ctx, 't_b1', 1450, 520, { fs: 40, mil: 1, a: k1, monte: 1 }); formule(ctx, 't_b2', 1450, 595, { fs: 40, mil: 1, a: k2, monte: 1 }); formule(ctx, 't_enc', 1450, 700, { fs: 52, mil: 1, a: ap(t, V.enc), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une fonction est [continue] en $a$ quand sa limite en $a$ est $f(a)$.']);
    legende(ctx, t, V.leg[1], ['Sa courbe se trace alors sans lever le crayon : ce n’est pas le cas ici.']);
    legende(ctx, t, V.leg[2], ['Une fonction continue ne passe pas d’une valeur à une autre', 'sans prendre toutes les [valeurs intermédiaires].'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Le théorème affirme qu’une solution existe ; il ne dit ni combien, ni où.']);
    legende(ctx, t, V.leg[4], ['Si de plus la fonction est strictement monotone, la solution est {unique}.']);
    legende(ctx, t, V.leg[5], ['On l’encadre par balayage : la fonction change de signe entre 0,6 et 0,7.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    bilanCartes(ctx, t, 'Trois réflexes', ['b_l', 'b_x', 'b_t'], [44, 52, 52], [540, 540, 540], [['Une limite finie à l’infini :', 'une asymptote horizontale.'], ['Dérivée seconde positive :', 'la fonction est convexe.'], ['Continue, strictement monotone :', 'une solution, et une seule.']],
      'Derrière chaque dérivée, il y a une {limite}.');
  }

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
  // Le chien est l'acteur de deux scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 1. la limite — il bondit sous l'écran, retombe du haut sur la courbe au point d'abscisse 2, court sur elle vers la
  //    droite, sort par le bord droit de l'écran et rentre au jardin par la droite ;
  // 5. la convexité — même entrée, au point d'abscisse −0,9 ; il parcourt la courbe, la tangente sous ses pattes, puis
  //    redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const AL = S.limite, AX = S.convexe, T1 = S.CH.map((c) => c.t1);
  const X5 = R5.X(P5.x1) + 50, tX5 = T1[4] - 1.4;
  const EN_SCENE = [[AL.bond + 0.2, T1[0] + 1.0], [AX.bond + 0.2, tX5 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => k === 0 ? [T1[0] + 1.0, T1[0] + 2.8, DEHORS, DS[1]] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX5 + 1.55, tX5 + 2.45, X5 / SC, DS[4]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. la course vers l'asymptote
    const p1 = XY(R1, P1.x0, f1(P1.x0));
    if (!bond(ctx, t, AL.bond, DS[0] * SC, AL.chute[0]) && !chute(ctx, t, AL.chute[0], AL.chute[1], p1[0], p1[1], P1.ech) && t >= AL.chute[1] && t < AL.course[1] + 0.1) {
      const x = xChien1(t), p = XY(R1, x, f1(x)), u = t - AL.atterrit, court = t > AL.course[0];
      K.chienSur(ctx, p[0], p[1] - 2, incl(pente(R1, -3 / ((x - 1) * (x - 1)))), P1.ech, u < 0.35 ? K.poseChoc(t, u) : court ? { t, allure: 'galop', phase: p[0] / P1.ech * 0.21 } : { t, tete: 0.1 }); }
    // 5. la tangente sous les pattes
    const p5 = XY(R5, P5.x0, f5(P5.x0));
    if (!bond(ctx, t, AX.bond, DS[4] * SC, AX.chute[0]) && !chute(ctx, t, AX.chute[0], AX.chute[1], p5[0], p5[1], P5.ech) && t >= AX.chute[1]) {
      if (t < tX5) { const x = xChien5(t), p = XY(R5, x, f5(x)), u = t - AX.atterrit, court = t > AX.course[0] && t < AX.course[1];
        K.chienSur(ctx, p[0], p[1] - 2, incl(pente(R5, d5(x))), P5.ech, u < 0.35 ? K.poseChoc(t, u) : court ? trot(t, (t - AX.course[0]) * 150, P5.ech) : t < AX.course[0] ? { t } : assisP(t, doux(pr(t, AX.course[1], 0.4)), -0.1)); }
      else { const p = XY(R5, P5.x1, f5(P5.x1)); sautJardin(ctx, t, tX5, p[0], p[1], P5.ech, X5); } }
  }
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
  // plus 100 s). Le titre, la cubique du chapitre avec le chien et la tangente, le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'Fonctions', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'numériques', 76, 506, { size: 150, w: 800, align: 'left' });
    const Rv = K.repere({ x: 980, y: 210, w: 880, h: 590 }, { x0: -1.25, x1: 3.25, y0: -2.9, y1: 2.9 }), x = 0.45, p = XY(Rv, x, f5(x)), an = pente(Rv, d5(x)), u = [Math.cos(an), Math.sin(an)];
    K.courbe(ctx, Rv, f5, -1.1, 3.1, { lw: 9 }); seg(ctx, [p[0] - u[0] * 220, p[1] - u[1] * 220], [p[0] + u[0] * 260, p[1] + u[1] * 260], { c: C.cours, lw: 7 });
    K.chienSur(ctx, p[0], p[1] - 3, an, 5.0, { t: 0.4, allure: 'trot', phase: 1.1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    limite(ctx, ts); asymptotes(ctx, ts); indet(ctx, ts); composee(ctx, ts); convexe(ctx, ts); tvi(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
