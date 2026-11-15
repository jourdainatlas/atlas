// LE FILM — « La géométrie dans l'espace », Terminale spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y est tour à tour un point que l'on repère, un point du plan, le point de paramètre t, puis le point M
// qui saute sur son projeté orthogonal.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'La géométrie dans l’espace', NIVEAU = 'TERMINALE SPÉCIALITÉ', LONG = 'TERMINALE SPÉCIALITÉ · CHAPITRE 4', NB_EXERCICES = 38;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 112, w: 800, a: k1 });
    ligne(ctx, 'Des figures aux {coordonnées}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- outils de figure : une vue en perspective cavalière, des segments, des points, des lettres ----------
  // vue(ox, oy, s) : l'axe des x vient vers l'avant-gauche, l'axe des y part à droite, l'axe des z monte.
  const vue = (ox, oy, s, ax = -0.5, ay = 0.35) => (x, y, z = 0) => [ox + s * (y + ax * x), oy + s * (ay * x - z)];
  function seg(ctx, p, q, o = {}) { const k = o.k ?? 1; if (k <= 0 || (o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.gm; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round'; if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], k), lerp(p[1], q[1], k)); ctx.stroke(); ctx.restore(); }
  const fl = (ctx, p, q, o = {}) => fleche(ctx, p[0], p[1], q[0], q[1], o);
  function pt(ctx, p, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre; ctx.beginPath(); ctx.arc(p[0], p[1], o.r || 7, 0, 6.3); ctx.fill(); ctx.restore(); }
  function poly(ctx, P, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
    ctx.fillStyle = o.fill || 'rgba(53,202,164,0.16)'; ctx.fill(); ctx.strokeStyle = o.stroke || C.cours; ctx.lineWidth = o.lw || 2.5; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
  const lettre = (ctx, id, p, dx, dy, a = 1, fs = 36) => formule(ctx, 'l_' + id, p[0] + dx, p[1] + dy, { fs, mil: 1, a });
  function angleDroit(ctx, p, u, v, s = 20, o = {}) { if ((o.a ?? 1) <= 0) return; ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = o.c || C.encre2; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(p[0] + u[0] * s, p[1] + u[1] * s); ctx.lineTo(p[0] + (u[0] + v[0]) * s, p[1] + (u[1] + v[1]) * s); ctx.lineTo(p[0] + v[0] * s, p[1] + v[1] * s); ctx.stroke(); ctx.restore(); }
  const unit = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1; return [(q[0] - p[0]) / d, (q[1] - p[1]) / d]; };
  const trot = (t, x, ech) => ({ t, allure: 'trot', phase: x / ech * 0.33 }), assisP = (t, k, tete = -0.2) => ({ t, assis: k, tete, queue: { a: -0.35, amp: 0.4, f: 8, courbe: -0.12 } });
  // les trois mouvements motivés du chien entre le jardin et une figure (MEMO_atlas_videos.md, §9, règle 5)
  function bond(ctx, t, tJ, xg, tA) { if (t < tJ + 0.2 || t >= tA) return false; const u = t - tJ - 0.2, y = SOLPX - 430 * u + 1250 * u * u;
    if (y < H + 130) K.chienSur(ctx, xg, y, 0, SC, u < 0.17 ? { t, face: -1, allure: 'vol', vol: u / 0.17, tang: 0.3 } : { ...K.poseChute(t), face: -1 }); return true; }
  function chute(ctx, t, tA, tL, x, y, ech) { if (t < tA || t >= tL) return false; K.chienSur(ctx, x, -60 + (y + 60) * Math.pow((t - tA) / (tL - tA), 1.6), 0, ech, K.poseChute(t)); return true; }
  function sautJardin(ctx, t, tX, x0, y0, ech0, xS) { const tS = tX + 1.2, tR = tX + 1.55; if (t < tX || t >= tR) return false;
    const D = tS - tX - 0.2, u = pr(t, tX + 0.2, D), v0 = -450, g = 2 * (SOLPX - y0 - v0 * D) / (D * D), tv = u * D;
    K.chienSur(ctx, lerp(x0, xS, u), Math.min(SOLPX, y0 + v0 * tv + g * tv * tv / 2), 0, lerp(ech0, SC, u), u <= 0 ? { t, bas: 2.2 * pr(t, tX, 0.2) } : u < 0.22 ? { t, allure: 'vol', vol: u / 0.22, tang: 0.35 } : u < 1 ? K.poseChute(t) : K.poseChoc(t, t - tS)); return true; }

  // ---------- 1. le repère ----------
  const V1 = vue(820, 560, 105), R1 = { O: V1(0, 0), X: V1(2, 0), XY: V1(2, 3), M: V1(2, 3, 2), ech: 3.2 };
  function repere(ctx, t) {
    const V = S.repere, a = fen(t, L(2) + 0.1, L(6), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ka = ap(t, V.axes, 0.8);
    [[V1(3.4, 0), 'x', -26, 22], [V1(0, 4.15), 'y', 30, 4], [V1(0, 0, 3.3), 'z', 0, -30]].forEach(([p, l, dx, dy]) => { fl(ctx, R1.O, p, { c: C.gm, lw: 3, k: ka }); lettre(ctx, l, p, dx, dy, ka, 32); });
    [[V1(1, 0), 'i', -30, -14], [V1(0, 1), 'j', 0, -30], [V1(0, 0, 1), 'k', -28, 6]].forEach(([p, l, dx, dy]) => { fl(ctx, R1.O, p, { c: C.encre, lw: 5, k: ka }); lettre(ctx, l, p, dx, dy, ka, 34); });
    lettre(ctx, 'O', R1.O, 26, -22, ka, 30);
    const kx = pr(t, V.x[0], V.x[1] - V.x[0]), ky = pr(t, V.y[0], V.y[1] - V.y[0]), kz = doux(pr(t, V.z[0], V.z[1] - V.z[0]));
    seg(ctx, R1.O, R1.X, { c: C.bleu, lw: 6, k: doux(kx) }); seg(ctx, R1.X, R1.XY, { c: C.orange, lw: 6, k: doux(ky) }); seg(ctx, R1.XY, R1.M, { c: C.cours, lw: 5, dash: [10, 9], k: kz });
    const Mz = [R1.XY[0], lerp(R1.XY[1], R1.M[1], kz)]; if (kz > 0) pt(ctx, Mz, { r: 9 });
    const kM = ap(t, V.M); lettre(ctx, 'M', R1.M, 34, -20, kM, 40);
    [['abscisse : 2', C.bleu, V.x[1]], ['ordonnée : 3', C.orange, V.y[1]], ['cote : 2', C.cours, V.z[1]]].forEach(([s, c, tt], i) => txt(ctx, s, 1540, 196 + i * 54, { fam: F.ui, w: 600, size: 34, c, a: ap(t, tt) }));
    formule(ctx, 'r_M', 1540, 395, { fs: 62, mil: 1, a: kM, monte: 1 }); formule(ctx, 'r_OM', 1540, 492, { fs: 44, mil: 1, a: ap(t, V.OM), monte: 1 });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Dans l’espace, un [repère] a trois axes :', 'un point se repère par trois coordonnées.']);
    legende(ctx, t, V.leg[1], ['L’abscisse, l’ordonnée, puis la [cote] : la hauteur du point.']);
  }

  // ---------- 2. le produit scalaire ----------
  const V2 = vue(380, 520, 78), T2 = { A: V2(1, 0, 2), B: V2(3, 1, -1), C: V2(2, 4, 3) };
  function scalaire(ctx, t) {
    const V = S.scalaire, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(6) + 0.1, L(10), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      formule(ctx, 's_uv', CX, 235, { fs: 50, mil: 1, a: ap(t, V.uv), monte: 1 }); formule(ctx, 's_ps', 600, 430, { fs: 58, mil: 1, a: ap(t, V.ps), monte: 1 }); formule(ctx, 's_no', 1360, 430, { fs: 54, mil: 1, a: ap(t, V.no), monte: 1 });
      const ko = ap(t, V.or); carte(ctx, 430, 545, 1060, 190, 'PROPRIÉTÉ', ko); formule(ctx, 's_or', CX, 652, { fs: 58, mil: 1, a: ko }); ctx.restore(); }
    k = fen(t, L(10) + 0.1, L(14), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      const kf = ap(t, V.fig, 0.6), kv = ap(t, V.v, 0.6);
      seg(ctx, T2.B, T2.C, { c: C.gl, lw: 3, dash: [8, 8], a: kf }); fl(ctx, T2.A, T2.B, { c: C.bleu, lw: 5, k: kf }); fl(ctx, T2.A, T2.C, { c: C.orange, lw: 5, k: kf });
      for (const [l, dx, dy] of [['A', -30, -8], ['B', -30, 8], ['C', 28, -10]]) { pt(ctx, T2[l], { a: kf }); lettre(ctx, l, T2[l], dx, dy, kf); }
      const ua = unit(T2.A, T2.B), uc = unit(T2.A, T2.C), a0 = Math.atan2(uc[1], uc[0]), a1 = Math.atan2(ua[1], ua[0]), kg = ap(t, V.ang);
      if (kg > 0) { ctx.save(); ctx.globalAlpha *= kg; ctx.strokeStyle = C.cours; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(T2.A[0], T2.A[1], 52, a0, a1); ctx.stroke(); ctx.restore(); txt(ctx, '79°', T2.A[0] + 92, T2.A[1] + 62, { fam: F.ui, w: 600, size: 32, c: C.cours, a: kg }); }
      formule(ctx, 's_pts', 1270, 195, { fs: 38, mil: 1, a: kf }); formule(ctx, 's_v', 1270, 330, { fs: 42, mil: 1, a: kv, monte: 1 }); formule(ctx, 's_c', 1270, 470, { fs: 40, mil: 1, a: ap(t, V.c), monte: 1 });
      txt(ctx, 'Il n’est pas nul : pas d’angle droit en A.', 1270, 552, { fam: F.ui, w: 600, size: 30, c: FAUX, a: ap(t, V.non) });
      formule(ctx, 's_cos', 1130, 665, { fs: 40, mil: 1, a: ap(t, V.cos), monte: 1 }); formule(ctx, 's_ang', 1640, 665, { fs: 48, mil: 1, a: kg, monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Dans un repère {orthonormé}, le produit scalaire et la norme', 'se calculent avec les coordonnées.']);
    legende(ctx, t, V.leg[1], ['Deux vecteurs sont [orthogonaux] si, et seulement si, leur produit scalaire est nul.']);
    legende(ctx, t, V.leg[2], ['Sur l’exemple du cours : les coordonnées des deux vecteurs, puis leur produit scalaire.']);
    legende(ctx, t, V.leg[3], ['Le triangle $ABC$ n’est pas rectangle en $A$ ; le produit scalaire donne même l’angle.']);
  }

  // ---------- 3. le plan et son vecteur normal ----------
  const V3 = vue(470, 590, 120, -0.5, 0.5), P3 = { A: V3(0, 0), n: V3(0, 0, 2.05), coins: [V3(-1.6, -1.8), V3(-1.6, 2.4), V3(1.8, 2.4), V3(1.8, -1.8)], ech: 2.4 };
  const promenade = (t) => { const [a, b] = S.plan.promenade, th = 1.25 + 2 * Math.PI * 1.25 * doux(pr(t, a, b - a)); return { p: V3(0.1 + 0.95 * Math.cos(th), 0.35 + 1.45 * Math.sin(th)), th }; };
  function plan(ctx, t) {
    const V = S.plan, a = fen(t, L(14) + 0.1, L(22), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kf = ap(t, V.fig, 0.7), kn = ap(t, V.n, 0.6);
    poly(ctx, P3.coins, { a: kf }); lettre(ctx, 'P', P3.coins[3], 70, -26, kf, 40);
    fl(ctx, P3.A, P3.n, { c: C.orange, lw: 6, k: kn }); lettre(ctx, 'n', P3.n, 34, 6, kn, 42); pt(ctx, P3.A, { a: kf }); lettre(ctx, 'A', P3.A, -28, 22, kf);
    if (t >= V.atterrit) { const { p } = promenade(t), km = ap(t, V.atterrit, 0.5), u = unit(P3.A, p);
      fl(ctx, P3.A, p, { c: C.bleu, lw: 5, a: km }); angleDroit(ctx, P3.A, u, [0, -1], 22, { a: km }); lettre(ctx, 'M', p, 0, 34, km, 34); }
    let k = fen(t, V.eq - 0.1, L(20), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      formule(ctx, 'p_eq', 1340, 235, { fs: 50, mil: 1, a: ap(t, V.eq), monte: 1 });
      const kd = ap(t, V.dev); carte(ctx, 900, 350, 880, 330, 'PROPRIÉTÉ', kd); formule(ctx, 'p_dev', 1340, 465, { fs: 38, mil: 1, a: kd });
      const kc = ap(t, V.car); formule(ctx, 'p_car', 1230, 590, { fs: 52, mil: 1, a: kc, monte: 1 }); formule(ctx, 'p_n', 1650, 580, { fs: 40, mil: 1, a: kc }); ctx.restore(); }
    k = fen(t, L(20) + 0.1, L(22), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      formule(ctx, 'p_ex', 1340, 230, { fs: 44, mil: 1, a: ap(t, V.ex), monte: 1 });
      ['p_e1', 'p_e2', 'p_e3'].forEach((id, i) => formule(ctx, id, 1340, 390 + i * 82, { fs: 42, mil: 1, a: ap(t, V.e[i]), monte: 1 }));
      const kr = ap(t, V.e[3]); cadre(ctx, 1340, 680, 560, 92, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kr }); formule(ctx, 'p_e4', 1340, 680, { fs: 54, mil: 1, a: kr }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Un vecteur [normal] à un plan est orthogonal à tous les vecteurs de ce plan.']);
    legende(ctx, t, V.leg[1], ['Où que soit $M$ dans le plan, le vecteur $AM$ reste orthogonal au vecteur normal.']);
    legende(ctx, t, V.leg[2], ['En coordonnées, on obtient une [équation cartésienne] du plan.']);
    legende(ctx, t, V.leg[3], ['Les coefficients de $x$, $y$ et $z$ sont les coordonnées du vecteur normal.']);
  }

  // ---------- 4. la droite et son paramètre ----------
  const D4 = { A: [250, 575], U: [150, -75], ech: 2.6, an: Math.atan2(-75, 150) }, Dt = (s) => [D4.A[0] + s * D4.U[0], D4.A[1] + s * D4.U[1]];
  const paramChien = (t) => { const V = S.droite; return t < V.va[0] ? lerp(-2.6, 0, doux(pr(t, V.entree[0], V.entree[1] - V.entree[0]))) : t < V.revient[0] ? 3 * doux(pr(t, V.va[0], V.va[1] - V.va[0])) : t < V.sortie ? 3 - doux(pr(t, V.revient[0], V.revient[1] - V.revient[0])) : lerp(2, -2.8, doux(pr(t, V.sortie, 1.5))); };
  function droite(ctx, t) {
    const V = S.droite, a = fen(t, L(22) + 0.1, L(26), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kf = ap(t, V.fig, 0.7);
    seg(ctx, Dt(-2), Dt(4.3), { c: C.gm, lw: 3, k: kf }); lettre(ctx, 'Dr', Dt(4.3), 30, -8, kf, 40);
    fl(ctx, D4.A, Dt(1), { c: C.bleu, lw: 7, k: kf }); lettre(ctx, 'u', Dt(0.5), 22, 40, kf, 40); lettre(ctx, 'A', D4.A, -6, 44, kf);
    const s = paramChien(t);
    [0, 1, 2, 3].forEach((n) => { const p = Dt(n), k = n === 0 ? kf : ap(t, V.va[0] + (V.va[1] - V.va[0]) * [0, 0.33, 0.6, 0.95][n], 0.3); pt(ctx, p, { a: k, r: 8, c: n === 2 && t >= V.deux ? C.cours : C.encre });
      ligne(ctx, `$t$ = ${n}`, p[0] - 84, p[1] - 52, { size: 28, w: 500, c: n === 2 && t >= V.deux ? C.cours : C.encre2, a: k }); });
    if (t >= V.va[0] && t < V.sortie + 0.2) ligne(ctx, `$t$ = ${s.toFixed(2).replace('.', ',')}`, 520, 690, { size: 46, w: 600, a: fen(t, V.va[0], V.sortie + 0.2, 0.3) });
    let k = fen(t, V.eq - 0.1, V.ex, 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'd_eq', 1400, 230, { fs: 58, mil: 1, a: ap(t, V.eq), monte: 1 }); formule(ctx, 'd_sys', 1270, 480, { fs: 50, mil: 1, a: ap(t, V.sys), monte: 1 }); formule(ctx, 'd_u', 1660, 480, { fs: 44, mil: 1, a: ap(t, V.sys) }); ctx.restore(); }
    k = fen(t, V.ex, L(26), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'd_ex', 1400, 235, { fs: 44, mil: 1, a: ap(t, V.ex + 0.2), monte: 1 }); formule(ctx, 'd_s2', 1400, 455, { fs: 50, mil: 1, a: ap(t, V.s2), monte: 1 }); formule(ctx, 'd_t2', 1400, 665, { fs: 54, mil: 1, a: ap(t, V.deux), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Partir de $A$ et avancer de $t$ fois le vecteur directeur : on décrit toute la droite.']);
    legende(ctx, t, V.leg[1], ['C’est une [représentation paramétrique] : à chaque valeur de $t$ correspond un point.']);
  }

  // ---------- 5. positions relatives ----------
  function croquis(ctx, cx, cy, genre, a) {                                               // un plan et une droite, en petit
    if (a <= 0) return; const v = vue(cx, cy, 70, -0.5, 0.5), Q = [v(-1, -1.5), v(-1, 1.5), v(1, 1.5), v(1, -1.5)];
    ctx.save(); ctx.globalAlpha *= a; poly(ctx, Q);
    if (genre === 0) seg(ctx, v(0.3, -1.25), v(-0.3, 1.25), { c: C.bleu, lw: 5 });
    if (genre === 1) seg(ctx, v(0.3, -1.6, 1.1), v(-0.3, 1.6, 1.1), { c: C.bleu, lw: 5 });
    if (genre === 2) { const I = v(0, 0), h = v(-0.2, 0.5, 1.5), b = v(0.13, -0.33, -1); seg(ctx, [I[0], I[1] + 36], b, { c: C.bleu, lw: 5, a: 0.35 }); seg(ctx, h, I, { c: C.bleu, lw: 5 }); pt(ctx, I, { c: C.cours, r: 8 }); }
    ctx.restore();
  }
  const V5 = vue(560, 600, 220, -0.45, 0.4), CU = Object.fromEntries(Object.entries({ A: [1, 0, 0], B: [1, 1, 0], C: [0, 1, 0], D: [0, 0, 0], E: [1, 0, 1], F: [1, 1, 1], G: [0, 1, 1], H: [0, 0, 1] }).map(([l, p]) => [l, V5(...p)]));
  function positions(ctx, t) {
    const V = S.positions, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    let k = fen(t, L(26) + 0.1, L(30), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      [['contenue dans le plan', 330], ['strictement parallèle', 960], ['sécante : un seul point', 1590]].forEach(([nom, cx], i) => { const q = ap(t, V.cas[i]); croquis(ctx, cx, 280, i, q); txt(ctx, nom, cx, 425, { fam: F.ui, w: 500, size: 28, c: C.encre2, a: q }); });
      { const q = ap(t, V.cr); formule(ctx, 'q_cr', 600, 505, { fs: 46, mil: 1, align: 'right', a: q }); txt(ctx, ': la droite est parallèle au plan, ou contenue dans le plan.', 624, 517, { fam: F.ui, w: 500, size: 32, align: 'left', a: q }); }
      const ke = ap(t, V.ex); formule(ctx, 'q_P', 310, 610, { fs: 34, mil: 1, a: ke }); formule(ctx, 'q_D', 310, 705, { fs: 30, mil: 1, a: ke });
      formule(ctx, 'q_un', 1000, 610, { fs: 34, mil: 1, a: ap(t, V.un), monte: 1 }); formule(ctx, 'q_t', 1000, 705, { fs: 32, mil: 1, a: ap(t, V.tI), monte: 1 });
      formule(ctx, 'q_I', 1660, 660, { fs: 48, mil: 1, a: ap(t, V.I), monte: 1 }); ctx.restore(); }
    k = fen(t, L(30) + 0.1, L(34), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      const kc = ap(t, V.cube, 0.7), kab = ap(t, V.ab, 0.6), kcg = ap(t, V.cg, 0.6), kn = ap(t, V.non);
      for (const [p, q, cache] of [['A', 'B'], ['B', 'C'], ['A', 'E'], ['B', 'F'], ['C', 'G'], ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'], ['D', 'A', 1], ['D', 'C', 1], ['D', 'H', 1]]) seg(ctx, CU[p], CU[q], { c: cache ? C.gl : C.gm, lw: 3, dash: cache ? [7, 8] : null, a: kc });
      const dAB = unit(CU.A, CU.B), ext = (p, d, s) => [p[0] + d[0] * s, p[1] + d[1] * s];
      seg(ctx, ext(CU.A, dAB, -150), ext(CU.B, dAB, 190), { c: C.bleu, lw: 6, k: kab }); seg(ctx, ext(CU.G, [0, -1], 90), ext(CU.C, [0, 1], 130), { c: C.orange, lw: 6, k: kcg });
      for (const [l, dx, dy] of [['A', -22, 30], ['B', -8, 34], ['C', 30, 6], ['D', -26, -10], ['E', -28, -8], ['F', 26, 22], ['G', 30, -8], ['H', -26, -12]]) lettre(ctx, l, CU[l], dx, dy, kc, 32);
      formule(ctx, 'q_AB', CU.A[0] - 200, CU.A[1] - 4, { fs: 36, mil: 1, a: kab }); formule(ctx, 'q_CG', CU.G[0] + 62, CU.G[1] - 86, { fs: 36, mil: 1, a: kcg });
      txt(ctx, 'Elles ne sont pas parallèles.', 1340, 300, { fam: F.ui, w: 500, size: 36, a: ap(t, V.cg + 1) });
      txt(ctx, 'Elles n’ont aucun point commun.', 1340, 380, { fam: F.ui, w: 500, size: 36, a: kn });
      ctx.save(); ctx.translate(1340, 540); ctx.scale(ressort(kn), ressort(kn)); txt(ctx, 'non coplanaires', 0, 0, { size: 76, w: 800, c: FAUX, a: Math.min(1, kn * 2) }); ctx.restore();
      ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une droite peut être contenue dans un plan, lui être strictement parallèle,', 'ou le couper en un seul point.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Sinon, la droite et le plan sont {sécants} : on calcule leur point d’intersection.']);
    legende(ctx, t, V.leg[2], ['Dans l’espace, deux droites peuvent n’être ni parallèles ni sécantes.']);
    legende(ctx, t, V.leg[3], ['Sur ce cube, $(AB)$ et $(CG)$ sont [non coplanaires] :', 'aucun plan ne les contient toutes les deux.'], { size: 40 });
  }

  // ---------- 6. le projeté orthogonal ----------
  const V6 = vue(430, 620, 110, -0.5, 0.5), P6 = { H: V6(0, 0), M: V6(0, 0, 2.5), N: V6(0.9, 1.7), coins: [V6(-1.4, -1.6), V6(-1.4, 2.6), V6(1.6, 2.6), V6(1.6, -1.6)], ech: 2.4 };
  function projete(ctx, t) {
    const V = S.projete, a = fen(t, L(34) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const kf = ap(t, V.fig, 0.7), kh = ap(t, V.H, 0.6), kN = ap(t, V.N, 0.6);
    poly(ctx, P6.coins, { a: kf }); lettre(ctx, 'P', P6.coins[3], 66, -24, kf, 40);
    seg(ctx, [P6.M[0] - 62, P6.M[1] + 2], [P6.M[0] + 62, P6.M[1] + 2], { c: C.gm, lw: 5, a: kf * (1 - ap(t, V.surH + 0.6)) });           // le perchoir
    seg(ctx, P6.M, P6.H, { c: C.cours, lw: 5, dash: [10, 9], k: kh }); pt(ctx, P6.H, { c: C.cours, r: 8, a: kh }); lettre(ctx, 'H', P6.H, -30, 22, kh); angleDroit(ctx, P6.H, [0, -1], unit(P6.H, P6.N), 20, { a: kh });
    pt(ctx, P6.M, { r: 6, a: kf }); lettre(ctx, 'M', P6.M, -86, -6, kf);
    seg(ctx, P6.H, P6.N, { c: C.gm, lw: 4, k: kN }); seg(ctx, P6.M, P6.N, { c: C.orange, lw: 4, k: kN }); pt(ctx, P6.N, { a: kN }); lettre(ctx, 'N', P6.N, 26, 16, kN);
    let k = fen(t, V.py - 0.1, L(38), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k; formule(ctx, 'h_py', 1350, 320, { fs: 58, mil: 1, a: ap(t, V.py), monte: 1 }); formule(ctx, 'h_in', 1350, 500, { fs: 84, mil: 1, a: ap(t, V.ineg), monte: 1 }); ctx.restore(); }
    k = fen(t, L(38) + 0.1, L(42), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      formule(ctx, 'h_M', 1350, 195, { fs: 40, mil: 1, a: ap(t, V.ex), monte: 1 }); formule(ctx, 'h_n', 1040, 365, { fs: 40, mil: 1, a: ap(t, V.m[0]), monte: 1 }); formule(ctx, 'h_d', 1500, 365, { fs: 40, mil: 1, a: ap(t, V.m[1]), monte: 1 });
      formule(ctx, 'h_e', 1350, 520, { fs: 40, mil: 1, a: ap(t, V.m[2]), monte: 1 }); formule(ctx, 'h_t', 1350, 610, { fs: 38, mil: 1, a: ap(t, V.m[3]), monte: 1 }); formule(ctx, 'h_H', 1350, 716, { fs: 42, mil: 1, a: ap(t, V.m[4]), monte: 1 }); ctx.restore(); }
    k = fen(t, L(42) + 0.1, L(46), 0.4);
    if (k > 0) { ctx.save(); ctx.globalAlpha *= k;
      formule(ctx, 'h_MH', 1350, 215, { fs: 46, mil: 1, a: ap(t, V.MH), monte: 1 });
      const kc = ap(t, V.f); carte(ctx, 880, 320, 940, 220, 'PROPRIÉTÉ', kc); formule(ctx, 'h_f', 1350, 450, { fs: 44, mil: 1, a: kc }); formule(ctx, 'h_v', 1350, 660, { fs: 42, mil: 1, a: ap(t, V.v), monte: 1 }); ctx.restore(); }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Le [projeté orthogonal] de $M$ sur le plan est le point $H$ du plan', 'tel que le vecteur $MH$ soit normal au plan.'], { size: 40 });
    legende(ctx, t, V.leg[1], ['Le triangle $MHN$ est rectangle en $H$ : $MH$ est le plus court chemin,', 'c’est la [distance] de $M$ au plan.'], { size: 40 });
    legende(ctx, t, V.leg[2], ['Méthode : la droite qui passe par $M$ et que dirige le vecteur normal', 'coupe le plan en $H$.'], { size: 40 });
    legende(ctx, t, V.leg[3], ['On reporte dans l’équation du plan : on trouve $t$, puis les coordonnées de $H$.']);
    legende(ctx, t, V.leg[4], ['Le vecteur $MH$ vaut $t$ fois le vecteur normal : la distance en découle.']);
    legende(ctx, t, V.leg[5], ['Une formule donne directement la distance d’un point à un plan.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    const B = S.bilan, a = fen(t, L(S.BILAN) + 0.1, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    txt(ctx, 'Trois outils', CX, 215, { size: 56, w: 700, a: ap(t, B.titre) });
    const XC = [400, 960, 1520], ID = ['b_ps', 'b_pl', 'b_dr'], TX = [['Le produit scalaire :', 'nul quand les vecteurs sont orthogonaux.'], ['Un plan : son équation cartésienne', 'se lit sur un vecteur normal.'], ['Une droite : un point, un vecteur', 'directeur et un paramètre.']];
    B.cartes.forEach((tc, i) => { const k = ap(t, tc); if (k <= 0) return; const cx = XC[i];
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, 500, 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      formule(ctx, ID[i], cx, 395, { fs: 46, mil: 1 });
      txt(ctx, TX[i][0], cx, 560, { size: 27, w: 600 }); txt(ctx, TX[i][1], cx, 602, { size: 27, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, 'Dans l’espace, une question de géométrie devient un {calcul}.', CX, 745 + (1 - kp) * 20, { size: 50, w: 700, a: kp });
    ctx.restore();
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
  // Le chien est l'acteur de quatre scènes (voir acteur), et chaque déplacement a une raison que l'on voit :
  // 1. repère — il sort du jardin par la gauche pendant l'intertitre, entre par la gauche le long de l'axe des y,
  //    marche 2 le long de l'axe des x puis 3 parallèlement à l'axe des y, regarde M monter, repart au galop par la
  //    droite et rentre au jardin par la droite ;
  // 3. plan — il bondit sous l'écran, retombe du haut sur le plan, s'y promène (il est le point M), puis en saute
  //    presque à la verticale et regagne sa place au trot ;
  // 4. droite — il sort par la gauche, entre par la gauche sur la droite elle-même, va jusqu'à t = 3, revient à t = 2,
  //    repart par la gauche et rentre au jardin par la gauche ;
  // 6. projeté — il bondit sous l'écran, retombe sur un perchoir (le point M), saute à la verticale sur H, puis
  //    redescend au jardin d'un saut vertical.
  const AR = S.repere, AP = S.plan, AD = S.droite, AJ = S.projete, T1 = S.CH.map((c) => c.t1);
  const X3 = P3.A[0] + 70, X6 = P6.H[0] + 70, tX3 = T1[2] - 1.4, tX6 = T1[5] - 1.4;
  const EN_SCENE = [[AP.bond + 0.2, tX3 + 1.55], [AJ.bond + 0.2, tX6 + 1.55]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], [L(2) - S.INTER + 0.6, L(2) - S.INTER + 2.4, DS[0], -45],
    ...J.marche.map(([a, b], k) => k === 0 ? [T1[0] + 1.0, T1[0] + 2.8, DEHORS, DS[1]] : k === 3 ? [T1[3] + 1.0, T1[3] + 2.8, -45, DS[4]] : k === 5 ? [tX6 + 1.55, tX6 + 4.1, X6 / SC, DS[6]] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [tX3 + 1.55, tX3 + 2.45, X3 / SC, DS[2]], [L(22) - 1.2, L(22) + 0.1, DS[3], -45]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    // 1. le repère
    if (t >= AR.entree[0] && t < T1[0] + 0.6) { const e = R1.ech; let x, y, face = 1, pose;
      if (t < AR.x[0]) { const k = doux(pr(t, AR.entree[0], AR.entree[1] - AR.entree[0] - 0.4)); x = lerp(-130, R1.O[0], k); y = R1.O[1]; pose = k < 1 ? trot(t, x, e) : { t }; }
      else if (t < AR.y[0]) { const k = doux(pr(t, AR.x[0], AR.x[1] - AR.x[0])); x = lerp(R1.O[0], R1.X[0], k); y = lerp(R1.O[1], R1.X[1], k); face = -1; pose = k < 1 ? trot(t, x * 1.3, e) : { t }; }
      else if (t < AR.sortie) { const k = doux(pr(t, AR.y[0], AR.y[1] - AR.y[0])); x = lerp(R1.X[0], R1.XY[0], k); y = R1.XY[1]; pose = k < 1 ? trot(t, x, e) : assisP(t, doux(pr(t, AR.y[1], 0.4)), -0.2 - 0.5 * doux(pr(t, AR.z[0], 1))); }
      else { x = lerp(R1.XY[0], W + 160, Math.pow(pr(t, AR.sortie, T1[0] + 0.5 - AR.sortie), 1.6)); y = R1.XY[1]; pose = { t, allure: 'galop', phase: x / e * 0.21 }; }
      K.chienSur(ctx, x, y, 0, e, { ...pose, face }); }
    // 3. le plan
    if (!bond(ctx, t, AP.bond, DS[2] * SC, AP.chute[0])) { const p0 = promenade(AP.promenade[0]).p;
      if (!chute(ctx, t, AP.chute[0], AP.chute[1], p0[0], p0[1], P3.ech) && t >= AP.chute[1] && t < tX3) {
        const { p } = promenade(t), q = promenade(t + 0.05).p, marche = t > AP.promenade[0] && t < AP.promenade[1], u = t - AP.atterrit;
        K.chienSur(ctx, p[0], p[1], 0, P3.ech, { ...(u < 0.35 ? K.poseChoc(t, u) : marche ? trot(t, (t - AP.promenade[0]) * 190, P3.ech) : assisP(t, doux(pr(t, AP.promenade[1], 0.4)))), face: q[0] >= p[0] ? 1 : -1 }); }
      else { const p = promenade(tX3).p; sautJardin(ctx, t, tX3, p[0], p[1], P3.ech, X3); } }
    // 4. la droite
    if (t >= AD.entree[0] && t < AD.sortie + 1.6) { const s = paramChien(t), p = Dt(s), va = t < AD.va[1], bouge = (t < AD.va[1] && t > AD.entree[0]) || (t >= AD.revient[0] && t < AD.revient[1]) || t >= AD.sortie;
      K.chienSur(ctx, p[0], p[1] - 2, D4.an, D4.ech, { ...(bouge ? trot(t, p[0] * 1.1, D4.ech) : assisP(t, doux(pr(t, t < AD.revient[0] ? AD.va[1] : AD.revient[1], 0.4)))), face: va ? 1 : -1 }); }
    // 6. le projeté orthogonal
    if (!bond(ctx, t, AJ.bond, DS[5] * SC, AJ.chute[0]) && !chute(ctx, t, AJ.chute[0], AJ.chute[1], P6.M[0], P6.M[1], P6.ech) && t >= AJ.chute[1]) {
      if (t < AJ.saut[0] - 0.25) { const u = t - AJ.perche; K.chienSur(ctx, P6.M[0], P6.M[1], 0, P6.ech, u < 0.35 ? K.poseChoc(t, u) : assisP(t, doux(pr(u, 0.35, 0.4)), 0.15)); }
      else if (t < AJ.saut[1]) { const k = pr(t, AJ.saut[0], AJ.saut[1] - AJ.saut[0]), y = lerp(P6.M[1], P6.H[1], k * k) - 26 * Math.sin(Math.PI * Math.min(1, k * 3)) * (k < 0.34 ? 1 : 0);
        K.chienSur(ctx, P6.M[0], y, 0, P6.ech, k <= 0 ? { t, bas: 2.2 * pr(t, AJ.saut[0] - 0.25, 0.25) } : k < 0.3 ? { t, allure: 'vol', vol: k / 0.3, tang: 0.3 } : K.poseChute(t)); }
      else if (t < tX6) { const u = t - AJ.surH; K.chienSur(ctx, P6.H[0], P6.H[1], 0, P6.ech, u < 0.35 ? K.poseChoc(t, u) : assisP(t, doux(pr(u, 0.35, 0.4)))); }
      else sautJardin(ctx, t, tX6, P6.H[0], P6.H[1], P6.ech, X6); }
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
  // plus 100 s). Le titre, la figure du projeté orthogonal avec le chien perché en M, le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    const v = vue(1440, 730, 128, -0.5, 0.5), Hh = v(0, 0), M = v(0, 0, 2.6), N = v(0.9, 1.5);
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'La géométrie', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'dans l’espace', 76, 506, { size: 150, w: 800, align: 'left' });
    poly(ctx, [v(-1.3, -1.5), v(-1.3, 2.3), v(1.4, 2.3), v(1.4, -1.5)], { lw: 4 });
    seg(ctx, [M[0] - 74, M[1] + 2], [M[0] + 74, M[1] + 2], { c: C.gm, lw: 6 }); seg(ctx, M, Hh, { c: C.cours, lw: 6, dash: [12, 10] }); seg(ctx, Hh, N, { c: C.gm, lw: 5 }); seg(ctx, M, N, { c: C.orange, lw: 5 });
    angleDroit(ctx, Hh, [0, -1], unit(Hh, N), 24); pt(ctx, Hh, { c: C.cours, r: 10 }); pt(ctx, N, { r: 9 });
    lettre(ctx, 'H', Hh, -36, 24, 1, 46); lettre(ctx, 'N', N, 32, 18, 1, 46); lettre(ctx, 'M', M, -110, -8, 1, 46);
    K.chienSur(ctx, M[0], M[1], 0, 2.9, { t: 0.4, tete: 0.25, queue: { a: -0.35, amp: 0.45, f: 8, courbe: 0.06 } });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    repere(ctx, ts); scalaire(ctx, ts); plan(ctx, ts); droite(ctx, ts); positions(ctx, ts); projete(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
