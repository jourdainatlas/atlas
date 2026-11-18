// LE FILM — « Géométrie cartésienne », Première spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y parcourt le vecteur qui mène de A à B, puis il est le point M qui se déplace sur la droite d.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Géométrie cartésienne', NIVEAU = 'PREMIÈRE SPÉCIALITÉ', LONG = 'PREMIÈRE SPÉCIALITÉ · CHAPITRE 3', NB_EXERCICES = 34;

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
    ligne(ctx, 'Des vecteurs aux {équations de droites}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  // ---------- 1. les vecteurs ----------
  const R1 = K.repere({ x: 110, y: 170, w: 860, h: 580 }, { x0: -0.5, x1: 5.5, y0: -0.5, y1: 3.55 }), P1 = { A: XY(R1, 1, 1), B: XY(R1, 4, 3), C: XY(R1, 4, 1), ech: 3.0 };
  P1.an = Math.atan((P1.B[1] - P1.A[1]) / (P1.B[0] - P1.A[0]));
  const posV = (t) => { const V = S.vecteurs, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { k, p: [lerp(P1.A[0], P1.B[0], k), lerp(P1.A[1], P1.B[1], k)] }; };
  function vecteurs(ctx, t) {
    const V = S.vecteurs, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R1, ap(t, V.axes, 0.8), { gx: [1, 2, 3, 4, 5], gy: [1, 2, 3] });
    const kp = ap(t, V.points), { k } = posV(t), kc = ap(t, V.coord), kc2 = ap(t, V.coord + 0.5);
    seg(ctx, P1.A, P1.C, { c: C.orange, lw: 4, dash: [10, 9], k: kc }); seg(ctx, P1.C, P1.B, { c: C.orange, lw: 4, dash: [10, 9], k: kc2 });
    formule(ctx, 'n3', (P1.A[0] + P1.C[0]) / 2, P1.A[1] + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'n2', P1.C[0] + 32, (P1.C[1] + P1.B[1]) / 2, { fs: 38, mil: 1, a: kc2 });
    if (k > 0) fl(ctx, P1.A, P1.B, { c: C.bleu, lw: 6, tp: 22, k });
    pt(ctx, P1.A, { a: kp, r: 8 }); pt(ctx, P1.B, { a: kp, r: 8 }); formule(ctx, 'l_A', P1.A[0] - 30, P1.A[1] + 32, { fs: 40, mil: 1, a: kp }); formule(ctx, 'l_B', P1.B[0] + 40, P1.B[1] + 26, { fs: 40, mil: 1, a: kp });
    const kf = ap(t, V.fleche); formule(ctx, 'v_nom', (P1.A[0] + P1.B[0]) / 2 - 56, (P1.A[1] + P1.B[1]) / 2 - 62, { fs: 44, mil: 1, a: kf, monte: 1 });
    etiq(ctx, 'le vecteur qui mène de A à B', 1440, 200, kc); formule(ctx, 'v_AB', 1440, 290, { fs: 48, mil: 1, a: kc, monte: 1 });
    formule(ctx, 'v_num', 1440, 440, { fs: 48, mil: 1, a: ap(t, V.num), monte: 1 });
    const kn = ap(t, V.norme); etiq(ctx, 'sa norme : la longueur AB', 1440, 560, kn); formule(ctx, 'v_norme', 1440, 640, { fs: 46, mil: 1, a: ap(t, V.val), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Un [vecteur] décrit un déplacement : une direction, un sens, une longueur.']);
    legende(ctx, t, V.leg[1], ['Ses [coordonnées] : la différence des abscisses, puis celle des ordonnées.']);
    legende(ctx, t, V.leg[2], ['Dans un repère orthonormé, le théorème de Pythagore donne sa [norme].']);
  }

  // ---------- 2. colinéarité et déterminant ----------
  const R2 = K.repere({ x: 330, y: 165, w: 350, h: 600 }, { x0: -2, x1: 5, y0: -10, y1: 2 }), O2 = XY(R2, 0, 0);
  function colineaires(ctx, t) {
    const V = S.colineaires, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.axes(ctx, R2, ap(t, V.fig, 0.8), { gx: [1, 2, 3, 4], gy: [-9, -6, -3], sansO: 1 });
    const ku = ap(t, V.u, 0.6), kv = ap(t, V.v, 0.7), kw = ap(t, V.w, 0.6);
    K.droite(ctx, R2, 0, 0, -3, { c: C.gl, lw: 2.5, dash: [8, 10], a: ap(t, V.ex) });
    if (kv > 0) fl(ctx, O2, XY(R2, 3, -9), { c: C.cours, lw: 9, tp: 24, k: kv }); if (ku > 0) fl(ctx, O2, XY(R2, 1, -3), { c: C.bleu, lw: 5, tp: 18, k: ku }); if (kw > 0) fl(ctx, O2, XY(R2, 2, 1), { c: C.orange, lw: 5, tp: 18, k: kw });
    formule(ctx, 'l_u', R2.X(1) + 40, R2.Y(-3) - 14, { fs: 44, mil: 1, a: ku }); formule(ctx, 'l_v', R2.X(3) + 40, R2.Y(-9) + 4, { fs: 44, mil: 1, a: kv }); formule(ctx, 'l_w', R2.X(2) + 36, R2.Y(1) - 10, { fs: 44, mil: 1, a: kw });
    let k = fen(t, L(6) + 0.1, L(10), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.def); carte(ctx, 900, 170, 920, 200, 'DÉFINITION', kd); formule(ctx, 'c_def', 1360, 290, { fs: 60, mil: 1, a: kd });
      formule(ctx, 'c_u', 1180, 480, { fs: 48, mil: 1, a: ku, monte: 1 }); formule(ctx, 'c_v', 1540, 480, { fs: 48, mil: 1, a: kv, monte: 1 }); formule(ctx, 'c_ex', 1360, 660, { fs: 46, mil: 1, a: ap(t, V.ex), monte: 1 }); ctx.restore(); }
    k = fen(t, L(10) + 0.1, L(14), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; const kd = ap(t, V.det); carte(ctx, 900, 170, 920, 150, 'DÉFINITION', kd); formule(ctx, 'c_det', 1360, 258, { fs: 50, mil: 1, a: kd });
      const w = largeur('c_calc', 38), x0 = 1360 - (w + 16 + largeur('c_zero', 46)) / 2; formule(ctx, 'c_calc', x0, 388, { fs: 38, mil: 1, align: 'left', a: ap(t, V.calc), monte: 1 }); formule(ctx, 'c_zero', x0 + w + 16, 388, { fs: 46, mil: 1, align: 'left', a: ap(t, V.zero), monte: 1 });
      const kp = ap(t, V.prop); carte(ctx, 900, 458, 920, 140, 'PROPRIÉTÉ', kp); formule(ctx, 'c_uv', 1130, 544, { fs: 42, mil: 1, align: 'right', a: kp }); txt(ctx, 'colinéaires', 1242, 556, { fam: F.ui, w: 500, size: 32, a: kp }); formule(ctx, 'c_ssi', 1350, 544, { fs: 42, mil: 1, align: 'left', a: kp });
      formule(ctx, 'c_w', 1360, 690, { fs: 36, mil: 1, a: ap(t, V.contre), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Deux vecteurs sont [colinéaires] quand l’un est un multiple de l’autre :', 'ils ont alors la même direction.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Ici, le second vecteur vaut trois fois le premier :', 'une même droite porte les deux.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Le [déterminant] de deux vecteurs se calcule en croix sur leurs coordonnées.']);
    legende(ctx, t, V.leg[3], ['Deux vecteurs sont colinéaires si, et seulement si, leur déterminant est {nul}.']);
    legende(ctx, t, V.leg[4], ['Un déterminant non nul : ces deux vecteurs ne sont pas colinéaires.']);
  }

  // ---------- 3. l'équation cartésienne ----------
  const R3 = K.repere({ x: 60, y: 170, w: 940, h: 590 }, { x0: -1.6, x1: 5.57, y0: -0.6, y1: 3.9 }), D3 = (x) => (8 - 2 * x) / 3, P3 = { ech: 3.0 };
  P3.an = Math.atan((R3.Y(D3(1)) - R3.Y(D3(0))) / (R3.X(1) - R3.X(0)));
  const xChien3 = (t) => { const V = S.cartes; return t < V.revient[0] ? lerp(1, 4, doux(pr(t, V.va[0], V.va[1] - V.va[0]))) : lerp(4, 1, doux(pr(t, V.revient[0], V.revient[1] - V.revient[0]))); };
  function figDroite(ctx, ka, kd) { K.axes(ctx, R3, ka, { gx: [-1, 1, 2, 3, 4, 5], gy: [1, 2, 3] }); K.droite(ctx, R3, 1, 2, -2 / 3, { c: C.bleu, lw: 5, k: kd }); formule(ctx, 'e_d', R3.X(3.55), R3.Y(2.65), { fs: 42, mil: 1, a: borne(kd * 2 - 1) }); }
  function cartes(ctx, t) {
    const V = S.cartes, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figDroite(ctx, ap(t, V.axes, 0.8), ap(t, V.droite, 0.9));
    const kA = ap(t, V.A), kB = ap(t, V.B), kd = doux(pr(t, V.revient[0], V.revient[1] - V.revient[0]));
    if (kd > 0) fl(ctx, XY(R3, 4, 0), XY(R3, 1, 2), { c: C.cours, lw: 7, tp: 22, k: kd }); formule(ctx, 'l_ud', R3.X(2.75), R3.Y(1.2) + 46, { fs: 42, mil: 1, a: ap(t, V.revient[1]) });
    K.point(ctx, R3, 1, 2, { k: kA, r: 9 }); formule(ctx, 'l_A', R3.X(1) + 26, R3.Y(2) - 34, { fs: 40, mil: 1, a: kA });
    K.point(ctx, R3, 2, 1, { k: kB, r: 9, c: C.orange }); formule(ctx, 'l_Bo', R3.X(2) - 30, R3.Y(1) + 30, { fs: 40, mil: 1, a: kB });
    const kp = ap(t, V.prop); carte(ctx, 1080, 170, 780, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'e_gen', 1470, 258, { fs: 52, mil: 1, a: kp });
    formule(ctx, 'e_A', 1450, 386, { fs: 38, mil: 1, a: kA, monte: 1 }); marque(ctx, 1820, 386, 18, true, ap(t, V.A + 0.3));
    const km = fen(t, V.va[0] - 0.3, V.B - 0.2, 0.35); if (km > 0) { const x = xChien3(t); txt(ctx, `M ( ${K.fr(x, 2)} ; ${K.fr(D3(x), 2)} )`, 1290, 498, { fam: F.ui, w: 600, size: 34, c: C.cours, a: km }); formule(ctx, 'e_M', 1640, 486, { fs: 40, mil: 1, a: km }); }
    formule(ctx, 'e_B', 1450, 486, { fs: 38, mil: 1, a: ap(t, V.Bcalc), monte: 1 }); marque(ctx, 1830, 486, 18, false, ap(t, V.Bcalc + 0.3));
    const ku = ap(t, V.dir); etiq(ctx, 'un vecteur directeur de d', 1470, 590, ku); formule(ctx, 'e_u', 1470, 680, { fs: 46, mil: 1, a: ku, monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Les points d’une droite sont ceux dont les coordonnées vérifient', 'une même égalité : son [équation cartésienne].'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Tant que le point $M$ reste sur la droite, ses coordonnées vérifient l’équation.']);
    legende(ctx, t, V.leg[2], ['Le point $B$ ne vérifie pas l’équation : il n’est pas sur la droite.']);
    legende(ctx, t, V.leg[3], ['Un [vecteur directeur] donne la direction de la droite : il se lit sur l’équation.']);
  }

  // ---------- 4. l'équation réduite ----------
  function reduite(ctx, t) {
    const V = S.reduite, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figDroite(ctx, 1, 1);
    const kp = ap(t, V.p), k1 = ap(t, V.pas, 0.5), k2 = ap(t, V.pas + 0.5, 0.5);
    K.point(ctx, R3, 0, 8 / 3, { k: kp, r: 10, c: C.cours }); formule(ctx, 'l_p', R3.X(0) - 34, R3.Y(8 / 3) + 4, { fs: 44, mil: 1, a: kp });
    seg(ctx, XY(R3, 1, 2), XY(R3, 2, 2), { c: C.orange, lw: 5, k: k1 }); seg(ctx, XY(R3, 2, 2), XY(R3, 2, 4 / 3), { c: VIOLET, lw: 5, k: k2 });
    formule(ctx, 'l_1', R3.X(1.5), R3.Y(2) - 30, { fs: 36, mil: 1, a: k1 }); formule(ctx, 'l_m', R3.X(2) + 34, R3.Y(1.67), { fs: 42, mil: 1, a: k2 });
    formule(ctx, 'r1', 1470, 215, { fs: 44, mil: 1, a: ap(t, V.r1), monte: 1 }); formule(ctx, 'r2', 1470, 295, { fs: 44, mil: 1, a: ap(t, V.r2), monte: 1 }); formule(ctx, 'r3', 1470, 400, { fs: 50, mil: 1, a: ap(t, V.r3), monte: 1 });
    const kg = ap(t, V.gen); carte(ctx, 1080, 480, 780, 140, 'PROPRIÉTÉ', kg); formule(ctx, 'r_gen', 1470, 562, { fs: 52, mil: 1, a: kg });
    const km = ap(t, V.m); etiq(ctx, 'coefficient directeur', 1280, 668, km, { size: 26 }); etiq(ctx, 'ordonnée à l’origine', 1660, 668, kp, { size: 26 }); formule(ctx, 'r_m', 1280, 724, { fs: 40, mil: 1, a: km }); formule(ctx, 'r_p', 1660, 724, { fs: 40, mil: 1, a: kp });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Quand le coefficient de $y$ n’est pas nul, on isole $y$ :', 'on obtient l’[équation réduite] de la droite.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Quand on avance de 1, on monte de $m$. Ici $m$ est négatif : la droite descend.']);
  }

  // ---------- 5. deux droites sécantes ----------
  const R5 = K.repere({ x: 110, y: 170, w: 860, h: 590 }, { x0: -3.3, x1: 4.7, y0: 0.6, y1: 0.6 + 590 * 8 / 860 });
  function figSecantes(ctx, k1, k2, kI) {
    K.axes(ctx, R5, k1, { gx: [-3, -2, -1, 1, 2, 3, 4], gy: [1, 2, 3, 4, 5], sansO: 1 });
    K.droite(ctx, R5, 1, 3, 0.5, { c: C.bleu, lw: 5, k: k1 }); K.droite(ctx, R5, 1, 3, 2 / 3, { c: C.orange, lw: 5, k: k2 });
    formule(ctx, 'l_d1', R5.X(4.2), R5.Y(4.6) + 40, { fs: 40, mil: 1, a: borne(k1 * 2 - 1) }); formule(ctx, 'l_d2', R5.X(3.6), R5.Y(4.73) - 40, { fs: 40, mil: 1, a: borne(k2 * 2 - 1) });
    K.point(ctx, R5, 1, 3, { k: kI, r: 11, c: C.cours }); formule(ctx, 'l_I', R5.X(1) - 6, R5.Y(3) - 42, { fs: 44, mil: 1, a: kI });
  }
  function secantes(ctx, t) {
    const V = S.secantes, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    figSecantes(ctx, ap(t, V.d1, 0.9), ap(t, V.d2, 0.9), ap(t, V.point));
    formule(ctx, 'd_e1', 1440, 200, { fs: 42, mil: 1, a: ap(t, V.d1), monte: 1 }); formule(ctx, 'd_e2', 1440, 262, { fs: 42, mil: 1, a: ap(t, V.d2), monte: 1 });
    formule(ctx, 'sys', 1440, 390, { fs: 46, mil: 1, a: ap(t, V.sys), monte: 1 });
    const kv = ap(t, V.vect); etiq(ctx, 'vecteurs directeurs', 1440, 486, kv, { size: 26 }); formule(ctx, 'd_u', 1440, 556, { fs: 40, mil: 1, a: kv, monte: 1 });
    formule(ctx, 'd_det', 1440, 656, { fs: 34, mil: 1, a: ap(t, V.det), monte: 1 });
    const kn = ap(t, V.verdict); if (kn > 0) { ctx.save(); ctx.translate(1440, 740); ctx.scale(ressort(kn), ressort(kn)); txt(ctx, 'droites sécantes', 0, 0, { size: 50, w: 800, c: C.cours, a: Math.min(1, kn * 2) }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Deux droites, deux équations cartésiennes.']);
    legende(ctx, t, V.leg[1], ['Un point commun vérifie les deux équations à la fois : c’est un [système].']);
    legende(ctx, t, V.leg[2], ['Avant de chercher ce point, on s’assure qu’il existe :', 'les vecteurs directeurs ne sont pas colinéaires.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['Les droites se coupent en un seul point $I$ : il reste à le calculer.']);
  }

  // ---------- 6. résoudre le système : substitution, puis combinaison linéaire ----------
  function systeme(ctx, t) {
    const V = S.systeme, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ks = ap(t, V.sys); formule(ctx, 'sys', CX, 215, { fs: 44, mil: 1, a: ks }); formule(ctx, 'E1', CX + 270, 190, { fs: 32, mil: 1, a: ks }); formule(ctx, 'E2', CX + 270, 242, { fs: 32, mil: 1, a: ks });
    txt(ctx, 'Par substitution', 480, 330, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.sub[0] - 0.6) });
    ['s1', 's2', 's3', 's4', 's5'].forEach((id, i) => formule(ctx, id, 480, 400 + i * 68, { fs: i === 3 ? 46 : 40, mil: 1, a: ap(t, V.sub[i]), monte: 1 }));
    txt(ctx, 'Par combinaison linéaire', 1440, 330, { fam: F.ui, w: 600, size: 32, c: C.cours, a: ap(t, V.titre2) });
    ['k1', 'k2', 'k3', 'k4'].forEach((id, i) => formule(ctx, id, 1440, 408 + i * 82, { fs: 40, mil: 1, a: ap(t, V.comb[i]), monte: 1 }));
    seg(ctx, [CX, 320], [CX, 690], { c: C.filet, lw: 2, k: ap(t, V.titre2) });
    const kf = ap(t, V.sol); cadre(ctx, CX, 742, 330, 84, { stroke: C.cours, fill: 'rgba(53,202,164,0.12)', a: kf }); formule(ctx, 'sol', CX, 742, { fs: 50, mil: 1, a: kf });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Par [substitution] : on isole une inconnue dans l’une des équations…']);
    legende(ctx, t, V.leg[1], ['… et l’on remplace cette inconnue par son expression, en violet, dans l’autre.']);
    legende(ctx, t, V.leg[2], ['On reprend l’expression isolée pour obtenir la seconde inconnue.']);
    legende(ctx, t, V.leg[3], ['Par [combinaison linéaire] : on ajoute les équations', 'de façon à éliminer une inconnue.'], { size: 40 });
    legende(ctx, t, V.leg[4], ['Les deux méthodes conduisent au même couple.']);
    legende(ctx, t, V.leg[5], ['Les deux droites se coupent au point de coordonnées {(1 ; 3)}.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    bilanCartes(ctx, t, 'Trois outils', ['b_d', 'b_c', 'b_r'], [36, 42, 46], [600, 500, 500], [['Le déterminant :', 'nul quand les vecteurs sont colinéaires.'], ['L’équation cartésienne :', 'vérifiée par chaque point de la droite.'], ['L’équation réduite :', 'pente et ordonnée à l’origine.']],
      'Chercher un point d’intersection, c’est résoudre un {système}.');
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
  // 1. les vecteurs — il bondit sous l'écran, retombe du haut sur le point A, parcourt le vecteur jusqu'à B (la flèche
  //    se trace sous ses pattes), puis saute presque à la verticale dans l'herbe et regagne sa place au trot ;
  // 3. l'équation cartésienne — même entrée, sur le point A de la droite ; il est le point M, va jusqu'à (4 ; 0),
  //    revient en A le long du vecteur directeur, puis redescend au jardin d'un saut vertical.
  const AV = S.vecteurs, AC = S.cartes, T1 = S.CH.map((c) => c.t1);
  const X1 = P1.B[0] + 60, X3 = R3.X(1) + 60, tX1 = T1[0] - 1.4, tX3 = T1[2] - 1.4;
  const EN_SCENE = [[AV.bond + 0.2, tX1 + 1.55], [AC.bond + 0.2, tX3 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX1 + 1.55, tX1 + 2.3, X1 / SC, DS[0]], [tX3 + 1.55, tX3 + 2.3, X3 / SC, DS[2]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. le vecteur
    if (!bond(ctx, t, AV.bond, DS[0] * SC, AV.chute[0]) && !chute(ctx, t, AV.chute[0], AV.chute[1], P1.A[0], P1.A[1], P1.ech) && t >= AV.chute[1]) {
      if (t < tX1) { const { k, p } = posV(t), u = t - AV.atterrit, marche = t > AV.marche[0] && t < AV.marche[1];
        K.chienSur(ctx, p[0], p[1], marche ? P1.an : 0, P1.ech, u < 0.35 ? K.poseChoc(t, u) : marche ? trot(t, p[0] * 1.2, P1.ech) : k < 1 ? { t } : assisP(t, doux(pr(t, AV.marche[1], 0.4)), -0.15)); }
      else sautJardin(ctx, t, tX1, P1.B[0], P1.B[1], P1.ech, X1); }
    // 3. le point M de la droite
    const A3 = XY(R3, 1, 2);
    if (!bond(ctx, t, AC.bond, DS[2] * SC, AC.chute[0]) && !chute(ctx, t, AC.chute[0], AC.chute[1], A3[0], A3[1], P3.ech) && t >= AC.chute[1]) {
      if (t < tX3) { const x = xChien3(t), p = XY(R3, x, D3(x)), u = t - AC.atterrit, va = t > AC.va[0] && t < AC.va[1], rev = t > AC.revient[0] && t < AC.revient[1];
        K.chienSur(ctx, p[0], p[1] - 2, va || rev ? P3.an : 0, P3.ech, { ...(u < 0.35 ? K.poseChoc(t, u) : va || rev ? trot(t, p[0] * 1.2, P3.ech) : assisP(t, doux(pr(t, t < AC.revient[0] ? Math.max(AC.va[1], 0) : AC.revient[1], 0.4)) * (t > AC.va[1] ? 1 : 0), -0.15)), face: t >= AC.revient[0] ? -1 : 1 }); }
      else sautJardin(ctx, t, tX3, A3[0], A3[1], P3.ech, X3); }
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
  // plus 100 s). Le titre, la droite d avec le chien en M et son équation, le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'Géométrie', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'cartésienne', 76, 506, { size: 150, w: 800, align: 'left' });
    const p = [1010, 300], q = [1840, 780], an = Math.atan((q[1] - p[1]) / (q[0] - p[0])), m = [lerp(p[0], q[0], 0.42), lerp(p[1], q[1], 0.42)];
    seg(ctx, p, q, { c: C.bleu, lw: 9 }); K.chienSur(ctx, m[0], m[1] - 3, an, 5.0, { t: 0.4, allure: 'trot', phase: 1.1 });
    formule(ctx, 'r1', 560, 690, { fs: 84, mil: 1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    vecteurs(ctx, ts); colineaires(ctx, ts); cartes(ctx, ts); reduite(ctx, ts); secantes(ctx, ts); systeme(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
