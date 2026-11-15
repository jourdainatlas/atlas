// LE FILM — « La dérivation », Première spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js, les formules de formules.js.
// Trois fonctions seulement : f(x) = x² (taux de variation, nombre dérivé, fonction dérivée, tangente) et
// f(x) = −x³ + 3x² + 2 (la colline, l'exemple de dérivation, les variations), celle du cours du site.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, fr, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre,
    repere, dans, axes, courbe, droite, trait, point, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const carre = (x) => x * x, cub = (x) => -x * x * x + 3 * x * x + 2, cubP = (x) => -3 * x * x + 6 * x;
  const POS = C.activites, NEG = C.orange;                 // signe de f′ : positif en vert, négatif en orange

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

  // ---------- en-tête : le logo, le titre du cours, la partie en cours ----------
  function entete(ctx, t) {
    const a = fen(t, L(2) + 0.2, L(54) - 0.1, 0.5); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    K.logo(ctx, 78, 74, 60);
    txt(ctx, 'LA DÉRIVATION · PREMIÈRE SPÉCIALITÉ', 126, 62, { fam: F.mono, w: 500, size: 20, ls: 3, c: C.encre3, align: 'left' });
    const parties = [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(50), L(54)]];
    for (const [nom, t0, t1] of parties) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(1, 2.2), 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 300, 210, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, 'PREMIÈRE SPÉCIALITÉ · CHAPITRE 4', CX, 478, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, 'La dérivation', CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Mesurer la {pente} d’une courbe', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- le chien, posé sur une courbe : (px, py) le point d'appui, an l'inclinaison ----------
  function chienSur(ctx, px, py, an, ech, p) {
    ctx.save(); ctx.translate(px, py); ctx.rotate(an); ctx.scale(ech, ech);
    globalThis.CHIEN.dessiner(ctx, { x: 0, face: 1, t: p.t, assis: 0, tang: 0, tete: 0, cou: 0, bas: 0, saut: 0, vol: 0, phase: 0, allure: 'pose', queue: { a: -0.35, amp: 0.25, f: 8, courbe: 0.06 }, ...p });
    ctx.restore();
  }

  // ---------- 1. la colline ----------
  const XH = (x) => (x + 0.75) / 3.9 * W, YH = (y) => 770 - (y - 0.5) / 6 * 520, KXH = W / 3.9, KYH = 520 / 6;
  function colline(ctx, t) {
    const P = S.pente, [c0, c1] = S.ouverture.colline, a = 1 - pr(t, L(6) - 0.1, 0.1); if (t < c0 || a <= 0) return;
    const k = doux(pr(t, c0, c1 - c0)), xf = lerp(-0.8, 3.2, k);
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 290, 0, 790); g.addColorStop(0, 'rgba(53,202,164,0.20)'); g.addColorStop(1, 'rgba(53,202,164,0)');
    ctx.beginPath(); ctx.moveTo(XH(-0.8), 790); for (let x = -0.8; x <= xf + 1e-9; x += 0.02) ctx.lineTo(XH(x), YH(cub(x))); ctx.lineTo(XH(xf), 790); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); for (let x = -0.8; x <= xf + 1e-9; x += 0.02) ctx.lineTo(XH(x), YH(cub(x))); ctx.strokeStyle = C.bleu; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();
    // le chien : sous ses pattes, un morceau de tangente ; au-dessus de lui, ce que fait la pente
    const [d0, d1] = P.chien, u = (t - d0) / (d1 - d0);
    if (u > 0 && u < 1) {
      const px = lerp(-130, W + 130, u), x = px / KXH - 0.75, py = YH(cub(x)), p = cubP(x), sv = -p * KYH / KXH, an = Math.atan(sv);
      const coul = Math.abs(p) < 0.35 ? C.encre : p > 0 ? POS : NEG, mot = Math.abs(p) < 0.35 ? 'elle est nulle' : p > 0 ? 'elle monte' : 'elle descend';
      ctx.strokeStyle = coul; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(px - 150 * Math.cos(an), py - 150 * Math.sin(an)); ctx.lineTo(px + 150 * Math.cos(an), py + 150 * Math.sin(an)); ctx.stroke();
      chienSur(ctx, px, py - 2, an, 5, { t, allure: 'trot', phase: px / 5 * 0.33 });
      txt(ctx, 'la pente', px, py - 178, { fam: F.mono, w: 500, size: 22, ls: 2, c: C.encre3 });
      txt(ctx, mot, px, py - 142, { fam: F.ui, w: 600, size: 30, c: coul });
    }
    ctx.restore();
    legende(ctx, t, P.leg[0], ['Sur une colline, la pente change à chaque pas :', 'elle descend, s’annule au creux, remonte, s’annule au sommet.'], { size: 40 });
    legende(ctx, t, P.leg[1], ['La {dérivée} est l’outil qui mesure cette pente,', 'en chaque point d’une courbe.']);
  }

  // ---------- 2 et 3. le taux de variation et le nombre dérivé, sur la parabole y = x² ----------
  const BP = { x: 110, y: 150, w: 760, h: 610 }, FP = { x0: -0.6, x1: 2.8, y0: -1.2, y1: 5.6 };
  const RP = repere(BP, FP), PX = 1400;                   // PX : milieu du panneau de droite
  function hDe(t) {
    const N = S.nombre; let h = 1;
    for (let i = 1; i < N.HS.length; i++) { const k = doux(pr(t, N.arrets[i] - N.glisse, N.glisse)); if (k > 0) h = Math.exp(lerp(Math.log(N.HS[i - 1]), Math.log(N.HS[i]), k)); }
    return h;
  }
  function parabole(ctx, t) {
    const Tx = S.taux, N = S.nombre, a = fen(t, L(6) + 0.1, L(18), 0.4); if (a <= 0) return;
    const R = RP, h = hDe(t), kt = doux(pr(t, N.tangente, 0.8)), gros = borne((h - 0.25) / 0.2);
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, R, pr(t, L(6) + 0.1, 0.9), { gx: [1, 2], gy: [1, 2, 3, 4, 5] });
    courbe(ctx, R, carre, FP.x0, lerp(FP.x0, FP.x1, doux(pr(t, Tx.courbe[0], Tx.courbe[1] - Tx.courbe[0]))));
    formule(ctx, 'cf2', 610, 192, { fs: 34, a: ap(t, Tx.courbe[1]) });
    const kA = ap(t, Tx.A), kB = ap(t, Tx.B), kS = doux(pr(t, Tx.secante[0], Tx.secante[1] - Tx.secante[0]));
    // projections de A et de B sur les axes
    const tir = { dash: [7, 9], c: C.gl };
    trait(ctx, R, 1, 0, 1, 1, { ...tir, a: kA }); trait(ctx, R, 0, 1, 1, 1, { ...tir, a: kA });
    trait(ctx, R, 1 + h, 0, 1 + h, carre(1 + h), { ...tir, a: kB * (1 - kt) }); trait(ctx, R, 0, carre(1 + h), 1 + h, carre(1 + h), { ...tir, a: kB * (1 - kt) });
    formule(ctx, 'la', R.X(1), R.Y(0) + 76, { fs: 30, a: kA }); formule(ctx, 'lfa', R.X(0) - 46, R.Y(1) + 9, { fs: 28, a: kA, align: 'right' });
    formule(ctx, 'lah', R.X(1 + h), R.Y(0) + 76, { fs: 30, a: kB * gros }); formule(ctx, 'lfah', R.X(0) - 46, R.Y(carre(1 + h)) + 9, { fs: 28, a: kB * gros, align: 'right' });
    // la sécante (orange), qui devient la tangente (turquoise)
    droite(ctx, R, 1, 1, 2 + h, { c: C.orange, k: kS, a: 1 - kt });
    droite(ctx, R, 1, 1, 2, { c: C.cours, a: kt, lw: 5 });
    // le triangle : h à l'horizontale, f(a + h) − f(a) à la verticale
    const kh = ap(t, Tx.h), kd = ap(t, Tx.df);
    trait(ctx, R, 1, 1, lerp(1, 1 + h, kh), 1, { c: C.violet, lw: 5, a: Math.min(1, kh * 3) * (1 - kt) });
    trait(ctx, R, 1 + h, 1, 1 + h, lerp(1, carre(1 + h), kd), { c: C.orange, lw: 5, a: Math.min(1, kd * 3) * (1 - kt) });
    formule(ctx, 'lh', R.X(1 + h / 2), R.Y(1) + 36, { fs: 32, a: kh * gros });
    formule(ctx, 'ldf', R.X(1 + h) + 18, (R.Y(1) + R.Y(carre(1 + h))) / 2 + 10, { fs: 26, a: kd * gros, align: 'left' });
    point(ctx, R, 1 + h, carre(1 + h), { c: C.orange, k: kB, a: 1 - kt });
    point(ctx, R, 1, 1, { k: kA });
    formule(ctx, 'A', R.X(1) - 30, R.Y(1) - 16, { fs: 34, a: kA }); formule(ctx, 'B', R.X(1 + h) - 30, R.Y(carre(1 + h)) - 16, { fs: 34, a: kB * gros });
    ligne(ctx, 'pente $2$', R.X(1.78) + 34, R.Y(2.56) + 44, { size: 32, c: C.cours, a: ap(t, N.tangente + 0.6), align: 'left' });
    ctx.restore();

    // --- panneau de droite, temps 1 : la formule du taux de variation ---
    let p = a * (1 - pr(t, L(10) - 0.4, 0.4));
    if (p > 0) { ctx.save(); ctx.globalAlpha = p;
      formule(ctx, 'fx2', PX, 215, { fs: 54, a: ap(t, Tx.courbe[0]), monte: 1 });
      let k = ap(t, Tx.formule); ligne(ctx, '[Taux de variation] de $f$ entre $a$ et $a + h$ :', PX, 350, { size: 34, w: 500, a: k }); formule(ctx, 'taux_gen', PX, 450, { fs: 56, mil: 1, a: k, monte: 1 });
      k = ap(t, Tx.valeur); ligne(ctx, 'Ici, avec $a = 1$ et $h = 1$ :', PX, 585, { size: 34, w: 500, a: k }); formule(ctx, 'taux_num', PX, 675, { fs: 46, mil: 1, a: k, monte: 1 });
      ctx.restore(); }
    // --- temps 2 : h rétrécit, le taux s'approche de 2 ---
    p = fen(t, L(10), L(14) - 0.1, 0.4);
    if (p > 0) { ctx.save(); ctx.globalAlpha = p;
      const n = h < 0.1 - 1e-9 ? 3 : 2, x1 = 1230, x2 = 1580;
      ctx.save(); ctx.globalAlpha *= 1 - kt; ligne(ctx, `$h = ${fr(h, n)}$`, x1, 222, { size: 52, c: C.violet }); ligne(ctx, `taux : $${fr(2 + h, n)}$`, x2, 222, { size: 52, c: C.orange }); ctx.restore();
      ctx.save(); ctx.globalAlpha *= kt; ligne(ctx, '$h$ tend vers $0$', x1, 222, { size: 46, c: C.violet }); ligne(ctx, 'le taux tend vers $2$', x2 + 10, 222, { size: 46, c: C.cours }); ctx.restore();
      ligne(ctx, '$h$', x1, 312, { size: 30, c: C.encre3 }); txt(ctx, 'taux de variation', x2, 310, { fam: F.ui, w: 500, size: 24, c: C.encre3 });
      ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1060, 332); ctx.lineTo(1750, 332); ctx.stroke();
      const HT = ['1', '0,5', '0,1', '0,01'], TT = ['3', '2,5', '2,1', '2,01'];
      N.arrets.forEach((ta, i) => { const k = ap(t, ta + (i ? 0 : 0.2)); if (k <= 0) return; const y = 392 + i * 72 + (1 - k) * 14;
        ligne(ctx, `$${HT[i]}$`, x1, y, { size: 44, c: C.violet, a: k }); ligne(ctx, `$${TT[i]}$`, x2, y, { size: 44, c: C.orange, a: k }); });
      const kl = ap(t, N.tangente); txt(ctx, '⋮', x1, 654, { fam: F.main, w: 400, size: 34, c: C.encre3, a: kl }); txt(ctx, '⋮', x2, 654, { fam: F.main, w: 400, size: 34, c: C.encre3, a: kl });
      ligne(ctx, '$0$', x1, 716, { size: 50, c: C.violet, a: kl }); ligne(ctx, '$2$', x2, 716, { size: 50, c: C.cours, a: kl });
      ctx.restore(); }
    // --- temps 3 : la définition, puis le calcul ---
    p = fen(t, L(14), L(18), 0.4);
    if (p > 0) { ctx.save(); ctx.globalAlpha = p;
      let k = ap(t, N.def);
      ctx.save(); ctx.globalAlpha *= k; ctx.beginPath(); ctx.roundRect(980, 150, 850, 276, 10); ctx.fillStyle = C.surface; ctx.fill(); ctx.fillStyle = C.rouge; ctx.fillRect(980, 150, 5, 276);
      txt(ctx, 'DÉFINITION', 1012, 190, { fam: F.mono, w: 700, size: 20, ls: 3, c: C.rouge, align: 'left' });
      ligne(ctx, 'Si le taux de variation de $f$ entre $a$ et $a + h$ a une limite', 1012, 232, { size: 28, w: 500, align: 'left' });
      ligne(ctx, 'quand $h$ tend vers $0$, on dit que $f$ est dérivable en $a$.', 1012, 270, { size: 28, w: 500, align: 'left' });
      ligne(ctx, 'Cette limite est le [nombre dérivé] de $f$ en $a$, noté $f′(a)$ :', 1012, 308, { size: 28, w: 500, align: 'left' });
      ctx.restore();
      formule(ctx, 'def', PX, 368, { fs: 40, mil: 1, a: ap(t, N.defFormule) });
      formule(ctx, 'calc1', 1000, 495, { fs: 36, mil: 1, align: 'left', a: ap(t, N.calcul[0]), monte: 1 });
      const w2 = formule(ctx, 'calc2', 1270, 592, { fs: 36, mil: 1, align: 'left', a: ap(t, N.calcul[1]), monte: 1 });
      formule(ctx, 'calc3', 1270 + largeur('calc2', 36) + 18, 592, { fs: 36, mil: 1, align: 'left', a: ap(t, N.calcul[2]), monte: 1 });
      ligne(ctx, 'Quand $h$ tend vers $0$, $2 + h$ tend vers $2$.', 1000, 672, { size: 30, w: 500, align: 'left', a: ap(t, N.calcul[3]) });
      k = ap(t, N.resultat); cadre(ctx, PX, 730, 250, 70, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'res1', PX, 730, { fs: 44, mil: 1, a: k });
      ctx.restore(); }
    legende(ctx, t, Tx.leg[0], ['Par deux points $A$ et $B$ de la courbe passe une droite : la sécante.']);
    legende(ctx, t, Tx.leg[1], ['Sa pente est le [taux de variation] de $f$ entre $a$ et $a + h$.']);
    legende(ctx, t, N.leg[0], ['Rapprochons $B$ de $A$ : l’écart $h$ devient de plus en plus petit.']);
    legende(ctx, t, N.leg[1], ['Le taux de variation se rapproche de $2$,', 'et la sécante devient la {tangente} à la courbe en $A$.']);
    legende(ctx, t, N.leg[2], ['Le nombre dérivé $f′(a)$ est la pente de la tangente', 'à la courbe au point d’abscisse $a$.']);
  }

  // ---------- 4. la fonction dérivée ----------
  const RF = repere({ x: 110, y: 150, w: 700, h: 610 }, { x0: -2.3, x1: 2.3, y0: -0.8, y1: 4.8 });
  const RD = repere({ x: 1010, y: 150, w: 760, h: 390 }, { x0: -2.3, x1: 2.3, y0: -4.6, y1: 4.6 });
  function fonction(ctx, t) {
    const Fo = S.fonction, a = fen(t, L(18) + 0.1, L(22), 0.4); if (a <= 0) return;
    const [b0, b1] = Fo.balaie, u = pr(t, b0, b1 - b0), x = lerp(-1.5, 1.5, u), kp = ap(t, b0 - 0.5);
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, RF, pr(t, L(18) + 0.1, 0.7), { gx: [-2, -1, 1, 2], gy: [1, 2, 3, 4] });
    axes(ctx, RD, pr(t, L(18) + 0.3, 0.7), { gx: [-2, -1, 1, 2], gy: [-4, -2, 2, 4] });
    courbe(ctx, RF, carre, -2.3, lerp(-2.3, 2.3, doux(pr(t, L(18) + 0.1, 0.8))));
    formule(ctx, 'cf2', RF.X(1.45), RF.Y(4.2), { fs: 32, a: ap(t, L(18) + 0.8) });
    formule(ctx, 'tf', RF.X(0) + 50, 176, { fs: 26, a: kp }); formule(ctx, 'tfp', RD.X(0) + 54, 176, { fs: 26, a: kp });
    // à gauche : le point et sa tangente (un segment de longueur constante à l'écran)
    const p = 2 * x, dx = 150 / Math.hypot(RF.kx, p * RF.ky);
    dans(ctx, RF, () => { ctx.globalAlpha *= kp; ctx.strokeStyle = C.cours; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(RF.X(x - dx), RF.Y(x * x - p * dx)); ctx.lineTo(RF.X(x + dx), RF.Y(x * x + p * dx)); ctx.stroke(); });
    point(ctx, RF, x, x * x, { k: kp });
    ligne(ctx, `$x = ${fr(x, 1)}$`, RF.X(0) - 118, 300, { size: 34, a: kp, c: C.encre2 }); ligne(ctx, `pente : $${fr(p, 1)}$`, RF.X(0) + 128, 300, { size: 34, a: kp, c: C.cours });
    // à droite : on reporte la pente au-dessus de x ; les points s'alignent sur la droite y = 2x
    const kf = doux(pr(t, Fo.formule - 0.2, 0.7)), xa = lerp(-1.5, -2.3, kf), xb = lerp(x, 2.3, kf);
    if (u > 0) { courbe(ctx, RD, (v) => 2 * v, xa, xb, { c: C.cours });
      trait(ctx, RD, x, 0, x, p, { dash: [7, 9], c: C.gl, a: 1 - kf }); }
    for (const r of Fo.reperes) { const k = ap(t, r.t, 0.3); if (k <= 0) continue; point(ctx, RD, r.x, 2 * r.x, { c: C.cours, k, r: 8 });
      ligne(ctx, `$(${fr(r.x, 0)} ; ${fr(2 * r.x, 0)})$`, RD.X(r.x) + 16, RD.Y(2 * r.x) + 40, { size: 26, c: C.encre2, a: k, align: 'left' }); }
    if (u > 0) point(ctx, RD, x, p, { c: C.cours, a: 1 - kf });
    formule(ctx, 'cd2', RD.X(1.55) - 80, RD.Y(3.9), { fs: 32, a: kf });
    formule(ctx, 'fd_calc', 1390, 612, { fs: 30, mil: 1, a: ap(t, Fo.formule), monte: 1 });
    ligne(ctx, 'Quand $h$ tend vers $0$, $2x + h$ tend vers $2x$.', 1390, 682, { size: 28, w: 500, a: ap(t, Fo.calcul) });
    const k = ap(t, Fo.resultat); cadre(ctx, 1390, 734, 560, 62, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'fd_res', 1390, 734, { fs: 36, mil: 1, a: k });
    ctx.restore();
    legende(ctx, t, Fo.leg[0], ['En chaque point, la courbe a sa pente.', 'Reportons-la à droite, au-dessus de l’abscisse $x$.']);
    legende(ctx, t, Fo.leg[1], ['La fonction qui, à chaque $x$, associe le nombre dérivé $f′(x)$', 'est la [fonction dérivée] de $f$ : on la note $f′$.']);
  }

  // ---------- 5. les formules ----------
  function formules(ctx, t) {
    const Fm = S.formules; let a = fen(t, L(22) + 0.1, L(30) - 0.1, 0.4);
    const yl = (i) => 306 + i * 82, fu = 28;
    if (a > 0) { ctx.save(); ctx.globalAlpha = a;
      // dérivées usuelles
      let k = ap(t, L(22) + 0.2); txt(ctx, 'Dérivées usuelles', 130, 190, { size: 40, w: 700, align: 'left', a: k });
      formule(ctx, 'tf', 290, 248, { fs: 28, a: k }); formule(ctx, 'tfp', 560, 248, { fs: 28, a: k }); txt(ctx, 'pour', 790, 246, { fam: F.ui, w: 500, size: 22, c: C.encre3, a: k });
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(130, 268); ctx.lineTo(900, 268); ctx.stroke(); ctx.restore();
      Fm.usuelles.forEach((tu, i) => { const q = ap(t, tu); if (q <= 0) return; const y = yl(i);
        formule(ctx, `u${i}l`, 290, y, { fs: fu, mil: 1, a: q }); fleche(ctx, 400, y, 450, y, { c: C.gl, lw: 3, tp: 10, a: q, k: q }); formule(ctx, `u${i}r`, 560, y, { fs: fu, mil: 1, a: q, monte: 1 });
        if (globalThis.FORMULES[`u${i}c`]) formule(ctx, `u${i}c`, 790, y, { fs: 26, mil: 1, a: q }); else ligne(ctx, 'tout réel $x$', 790, y + 9, { size: 24, w: 500, c: C.encre3, a: q }); });
      // opérations
      k = ap(t, L(26) - 0.3); txt(ctx, 'Opérations', 1010, 190, { size: 40, w: 700, align: 'left', a: k });
      ligne(ctx, '$u$, $v$ et $g$ dérivables, $k$, $a$ et $b$ réels ;', 1010, 232, { size: 23, w: 500, c: C.encre3, a: k, align: 'left' }); ligne(ctx, 'au dénominateur, $v$ ne s’annule pas.', 1010, 260, { size: 23, w: 500, c: C.encre3, a: k, align: 'left' });
      Fm.operations.forEach((to, i) => formule(ctx, `o${i}`, 1030, yl(i), { fs: fu, mil: 1, align: 'left', a: ap(t, to), monte: 1 }));
      const kp = fen(t, Fm.piege[0], Fm.piege[1], 0.3);
      if (kp > 0) { cadre(ctx, 1030 + largeur('o2', fu) / 2, yl(2), largeur('o2', fu) + 36, 62, { stroke: C.orange, a: kp }); txt(ctx, 'et non', 1500, yl(2) + 9, { fam: F.ui, w: 500, size: 24, c: C.orange, a: kp }); formule(ctx, 'piege', 1660, yl(2), { fs: fu, mil: 1, a: kp }); }
      ctx.restore(); }
    // l'exemple : terme à terme
    a = fen(t, L(30) + 0.1, L(34), 0.4);
    if (a > 0) { const E = Fm.exemple, XT = [800, 1060, 1300], fs = 62; ctx.save(); ctx.globalAlpha = a;
      let k = ap(t, E.f); formule(ctx, 'e_f', 660, 330, { fs, align: 'right', a: k }); ['e_1', 'e_2', 'e_3'].forEach((id, i) => formule(ctx, id, XT[i], 330, { fs, a: k }));
      formule(ctx, 'e_fp', 660, 560, { fs, align: 'right', a: ap(t, E.termes[0] - 0.4) });
      const R = [['puissance'], ['constante', '× puissance'], ['constante']];
      E.termes.forEach((te, i) => { const q = ap(t, te); if (q <= 0) return; fleche(ctx, XT[i], 372, XT[i], 478, { c: C.cours, lw: 4, k: q }); R[i].forEach((mot, j) => txt(ctx, mot, XT[i] + 20, 432 + (j - (R[i].length - 1) / 2) * 28, { fam: F.ui, w: 500, size: 22, c: C.encre3, align: 'left', a: q }));
        formule(ctx, `e_d${i + 1}`, XT[i], 560, { fs, a: q, monte: 1 }); });
      k = ap(t, E.resultat); cadre(ctx, CX, 705, largeur('e_res', 56) + 80, 96, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'e_res', CX, 705, { fs: 56, mil: 1, a: k });
      ctx.restore(); }
    legende(ctx, t, Fm.leg[0], ['Ce calcul de limite, mené une fois pour toutes, donne les dérivées usuelles.']);
    legende(ctx, t, Fm.leg[1], ['Quelques règles suffisent ensuite pour dériver', 'les sommes, les produits et les quotients.']);
    legende(ctx, t, Fm.leg[2], ['L’erreur la plus répandue : la dérivée d’un produit', 'n’est pas le produit des dérivées.']);
    legende(ctx, t, Fm.leg[3], ['Un exemple : un polynôme se dérive terme à terme.']);
    legende(ctx, t, Fm.leg[4], ['Gardons cette fonction : elle reviendra pour l’étude des variations.']);
  }

  // ---------- 6. la tangente ----------
  function tangente(ctx, t) {
    const Tg = S.tangente, a = fen(t, L(34) + 0.1, L(38), 0.4); if (a <= 0) return;
    const z = doux(pr(t, Tg.zoom[0], Tg.zoom[1] - Tg.zoom[0])), s = Math.exp(-z * Math.log(8));       // agrandissement de centre A, jusqu'à 8
    const R = repere(BP, { x0: 1 + (FP.x0 - 1) * s, x1: 1 + (FP.x1 - 1) * s, y0: 1 + (FP.y0 - 1) * s, y1: 1 + (FP.y1 - 1) * s });
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, R, 1, { gx: [1, 2], gy: [1, 2, 3, 4, 5], chiffres: 1 - z, a: 1 - 0.75 * z });
    courbe(ctx, R, carre, R.r.x0, R.r.x1);
    droite(ctx, R, 1, 1, 2, { c: C.cours, k: doux(pr(t, Tg.trace[0], Tg.trace[1] - Tg.trace[0])), lw: 5 });
    point(ctx, R, 1, 1); formule(ctx, 'A', R.X(1) - 30, R.Y(1) - 16, { fs: 34 });
    formule(ctx, 'cf2', 610, 192, { fs: 34, a: 1 - z }); formule(ctx, 'tan_T', R.X(1.9) + 34, R.Y(2.8) + 30, { fs: 36, a: ap(t, Tg.trace[1]) * (1 - z) });
    const kr = ap(t, Tg.resultat) * (1 - z); point(ctx, R, 0, -1, { c: C.cours, k: kr, a: 1 - z, r: 8 }); ligne(ctx, '$−1$', R.X(0) + 18, R.Y(-1) + 10, { size: 28, c: C.cours, a: kr, align: 'left' });
    ligne(ctx, 'La figure est agrandie 8 fois autour de $A$.', BP.x + 20, BP.y + 44, { size: 28, w: 500, c: C.encre2, a: ap(t, Tg.zoom[1] - 0.4), align: 'left' });
    let k = ap(t, L(34) + 0.3);
    ligne(ctx, 'La tangente à la courbe en $A$ est la droite qui passe', 1000, 215, { size: 32, w: 500, align: 'left', a: k }); ligne(ctx, 'par $A$ et dont la pente est le nombre dérivé $f′(a)$.', 1000, 260, { size: 32, w: 500, align: 'left', a: k });
    k = ap(t, Tg.formule); cadre(ctx, PX, 365, largeur('tan_gen', 48) + 70, 90, { fill: C.surface, a: k }); formule(ctx, 'tan_gen', PX, 365, { fs: 48, mil: 1, a: k });
    k = ap(t, Tg.remplace); ligne(ctx, 'Ici $a = 1$, $f(1) = 1$ et $f′(1) = 2$ :', 1000, 482, { size: 32, w: 500, align: 'left', a: k }); formule(ctx, 'tan_a', PX, 560, { fs: 46, mil: 1, a: ap(t, Tg.remplace + 0.5), monte: 1 });
    k = ap(t, Tg.resultat); cadre(ctx, PX, 680, 330, 84, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'tan_res', PX, 680, { fs: 52, mil: 1, a: k });
    ctx.restore();
    legende(ctx, t, Tg.leg[0], ['Connaître $f′(a)$, c’est connaître la tangente : on écrit son équation.']);
    legende(ctx, t, Tg.leg[1], ['Vues de près, la courbe et sa tangente se confondent presque.']);
  }

  // ---------- 7. les variations ----------
  const RV = repere({ x: 110, y: 150, w: 760, h: 350 }, { x0: -1.1, x1: 3.2, y0: -0.6, y1: 7.2 });
  const RW = repere({ x: 110, y: 540, w: 760, h: 225 }, { x0: -1.1, x1: 3.2, y0: -4.5, y1: 4 });
  function variations(ctx, t) {
    const V = S.variations, a = fen(t, L(38) + 0.1, L(50), 0.4); if (a <= 0) return;
    const [d0, d1] = V.chien, u = pr(t, d0, d1 - d0), xd = lerp(-1, 2, u), xp = t < d1 ? xd : lerp(2, 3.2, doux(pr(t, d1, 1.5)));
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, RV, pr(t, L(38) + 0.1, 0.8), { gx: [-1, 1, 2, 3], gy: [2, 4, 6] });
    courbe(ctx, RV, cub, -1.1, lerp(-1.1, 3.2, doux(pr(t, V.courbe[0], V.courbe[1] - V.courbe[0]))));
    formule(ctx, 'cf', RV.X(2.85), RV.Y(5.3), { fs: 34, a: ap(t, V.courbe[1]) });
    // le signe de f′ colore la courbe au passage du chien
    if (t > d0) { courbe(ctx, RV, cub, -1.1, Math.min(xp, 0), { c: NEG, lw: 7 }); courbe(ctx, RV, cub, 0, Math.min(xp, 2), { c: POS, lw: 7 }); courbe(ctx, RV, cub, 2, xp, { c: NEG, lw: 7 }); }
    // la courbe de f′, ses zéros, son signe
    const kw = pr(t, V.courbeD[0] - 0.5, 0.6);
    if (kw > 0) {
      const ks = V.signes.map((ts) => ap(t, ts)), zones = [[-1.1, 0, NEG], [0, 2, POS], [2, 3.2, NEG]];
      dans(ctx, RW, () => zones.forEach(([xa, xb, c], i) => { if (ks[i] <= 0) return; ctx.save(); ctx.globalAlpha *= 0.22 * ks[i]; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(RW.X(xa), RW.Y(0));
        for (let x = xa; x <= xb + 1e-9; x += 0.02) ctx.lineTo(RW.X(x), RW.Y(cubP(x))); ctx.lineTo(RW.X(xb), RW.Y(0)); ctx.closePath(); ctx.fill(); ctx.restore(); }));
      axes(ctx, RW, kw, { gx: [-1, 1, 2, 3], gy: [-3, 3] });
      courbe(ctx, RW, cubP, -1.1, lerp(-1.1, 3.2, doux(pr(t, V.courbeD[0], V.courbeD[1] - V.courbeD[0]))), { c: C.cours });
      formule(ctx, 'cfp', RW.X(1) + 78, RW.Y(3) + 2, { fs: 30, a: ap(t, V.courbeD[1]) });
      [0, 2].forEach((x0, i) => { const k = ap(t, V.zeros[i]); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; trait(ctx, RV, x0, cub(x0), x0, 0, { dash: [7, 9], c: C.gm }); ctx.restore();
        ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.setLineDash([7, 9]); ctx.beginPath(); ctx.moveTo(RV.X(x0), RV.Y(0)); ctx.lineTo(RW.X(x0), RW.Y(0)); ctx.stroke(); ctx.restore();
        point(ctx, RW, x0, 0, { c: C.encre, k, r: 8 }); point(ctx, RV, x0, cub(x0), { c: C.encre, k, r: 8 }); });
      formule(ctx, 'moins', RW.X(-0.55), RW.Y(-1.5), { fs: 46, mil: 1, a: ks[0] }); formule(ctx, 'plus', RW.X(1), RW.Y(1.3), { fs: 46, mil: 1, a: ks[1] }); formule(ctx, 'moins', RW.X(2.62), RW.Y(-1.5), { fs: 46, mil: 1, a: ks[2] });
    }
    // le chien : il descend, remonte, et s'assoit au sommet
    const kc = t >= d0 && t < ACT.tX ? 1 : 0;                 // avant et après, c'est acteur() qui le dessine
    if (kc > 0) { const p = cubP(xd), an = Math.atan(-p * RV.ky / RV.kx), px = RV.X(xd), py = RV.Y(cub(xd)), assis = doux(pr(t, d1, 0.5));
      ctx.save(); ctx.globalAlpha *= kc;
      if (u < 1) { const c = Math.abs(p) < 0.35 ? C.encre : p > 0 ? POS : NEG; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px - 80 * Math.cos(an), py - 80 * Math.sin(an)); ctx.lineTo(px + 80 * Math.cos(an), py + 80 * Math.sin(an)); ctx.stroke(); }
      chienSur(ctx, px, py - 2, an, 2.6, u < 1 ? { t, allure: 'trot', phase: px / 2.6 * 0.33 } : { t, assis, queue: { a: lerp(-0.35, -0.35, assis), amp: 0.35, f: 8, courbe: -0.1 } });
      ctx.restore(); }
    // extremums
    let k = ap(t, V.min); ligne(ctx, 'minimum local', RV.X(0) + 16, RV.Y(2) + 44, { size: 24, w: 500, c: C.encre2, a: k, align: 'left' }); formule(ctx, 'f0', RV.X(0) + 16, RV.Y(2) + 78, { fs: 26, a: k, align: 'left' });
    k = ap(t, V.max); ligne(ctx, 'maximum local', RV.X(2) - 232, RV.Y(6) - 34, { size: 24, w: 500, c: C.encre2, a: k, align: 'left' }); formule(ctx, 'f2', RV.X(2) - 232, RV.Y(6), { fs: 26, a: k, align: 'left' });

    // --- panneau de droite ---
    formule(ctx, 'var_f', PX, 212, { fs: 42, mil: 1, a: ap(t, V.courbe[0]), monte: 1 });
    const regles = fen(t, d0, L(42) - 0.3, 0.4), t0c = d0 + (d1 - d0) / 3;
    if (regles > 0) { ctx.save(); ctx.globalAlpha *= regles;
      [[d0, NEG, 'Tant que $f′$ est négative, la courbe descend.'], [t0c, POS, 'Dès que $f′$ est positive, elle monte.'], [d1, C.encre, 'Au sommet, la tangente est horizontale : $f′(2) = 0$.']].forEach(([tr, c, s], i) => { const q = ap(t, tr); if (q <= 0) return;
        ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(1012, 330 + i * 76, 9, 0, 6.3); ctx.fill(); ctx.restore(); ligne(ctx, s, 1040, 341 + i * 76, { size: 32, w: 500, align: 'left', a: q }); });
      ctx.restore(); }
    formule(ctx, 'var_d', PX, 292, { fs: 42, mil: 1, a: ap(t, V.derivee), monte: 1 }); formule(ctx, 'var_fact', PX, 372, { fs: 42, mil: 1, a: ap(t, V.facteur), monte: 1 });
    // le tableau de variations
    const kt = ap(t, V.tableau);
    if (kt > 0) { const x0 = 1000, x1 = 1830, xl = 1130, ya = 440, yb = 510, yc = 580, yd = 756, COL = [1190, 1385, 1590, 1775];
      ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = C.gl; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(x0, ya, (x1 - x0) * kt, yd - ya, 8); ctx.stroke();
      for (const y of [yb, yc]) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, kt), y); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(xl, ya); ctx.lineTo(xl, yd); ctx.stroke();
      formule(ctx, 'x', (x0 + xl) / 2, (ya + yb) / 2, { fs: 32, mil: 1 }); formule(ctx, 'tfp', (x0 + xl) / 2, (yb + yc) / 2, { fs: 30, mil: 1 }); formule(ctx, 'tf', (x0 + xl) / 2, (yc + yd) / 2, { fs: 30, mil: 1 });
      ['minf', 'n0', 'n2', 'pinf'].forEach((id, i) => formule(ctx, id, COL[i], (ya + yb) / 2, { fs: 32, mil: 1, a: ap(t, V.tableau + 0.3 + i * 0.15) }));
      ctx.restore();
      const ym = (yb + yc) / 2, XD = [(COL[0] + COL[1]) / 2 + 10, COL[1], (COL[1] + COL[2]) / 2, COL[2], (COL[2] + COL[3]) / 2 - 8], ID = ['moins', 'zero', 'plus', 'zero', 'moins'];
      V.ligneD.forEach((tl, i) => formule(ctx, ID[i], XD[i], ym, { fs: 36, mil: 1, a: ap(t, tl, 0.3), monte: 1 }));
      for (const i of [1, 3]) { const q = ap(t, V.ligneD[i], 0.3); ctx.save(); ctx.globalAlpha *= q * 0.8; ctx.strokeStyle = C.gl; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(XD[i], yb); ctx.lineTo(XD[i], ym - 22); ctx.moveTo(XD[i], ym + 22); ctx.lineTo(XD[i], yc); ctx.stroke(); ctx.restore(); }
      const haut = yc + 42, bas = yd - 40, FL = [[COL[0] + 30, haut, COL[1] - 42, bas, NEG], [COL[1] + 42, bas, COL[2] - 42, haut, POS], [COL[2] + 42, haut, COL[3] - 30, bas, NEG]];
      V.fleches.forEach((tf, i) => { const [xa, ya2, xb, yb2, c] = FL[i]; fleche(ctx, xa, ya2, xb, yb2, { c, lw: 4, k: doux(pr(t, tf, 0.5)) }); });
      formule(ctx, 'n2', COL[1], bas + 4, { fs: 36, mil: 1, a: ap(t, V.valeurs[0]) }); formule(ctx, 'n6', COL[2], haut - 4, { fs: 36, mil: 1, a: ap(t, V.valeurs[1]) });
      let q = ap(t, V.min); cadre(ctx, COL[1], bas + 4, 58, 52, { stroke: C.encre, a: q, r: 26 }); q = ap(t, V.max); cadre(ctx, COL[2], haut - 4, 58, 52, { stroke: C.encre, a: q, r: 26 });
    }
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Revoici la colline : c’est la courbe de la fonction $f$ de l’exemple.']);
    legende(ctx, t, V.leg[1], ['Si $f′$ est strictement positive sur un intervalle, $f$ y est strictement croissante ;', 'si $f′$ est strictement négative, $f$ y est strictement décroissante.'], { size: 38 });
    legende(ctx, t, V.leg[2], ['Pour connaître les variations de $f$, on étudie donc le {signe} de $f′$.']);
    legende(ctx, t, V.leg[3], ['$f′$ s’annule en $0$ et en $2$ : elle est positive entre les deux, négative ailleurs.']);
    legende(ctx, t, V.leg[4], ['Le tableau de variations résume tout : le signe de $f′$, puis le sens de variation de $f$.'], { size: 40 });
    legende(ctx, t, V.leg[5], ['Là où $f′$ s’annule en changeant de signe, $f$ atteint un extremum local.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    const B = S.bilan, a = fen(t, L(50) + 0.2, L(54), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const k0 = ap(t, B.titre); txt(ctx, 'À quoi sert la dérivée ?', CX, 222 + (1 - k0) * 20, { size: 62, w: 700, a: k0 });
    const XC = [400, 960, 1520], TX = [['Écrire l’équation d’une tangente,', 'approcher une courbe par une droite.'], ['Étudier les variations,', 'trouver un maximum ou un minimum.'], ['Décrire un mouvement : la vitesse', 'est la dérivée de la position.']];
    B.cartes.forEach((tc, i) => { const k = ap(t, tc); if (k <= 0) return; const cx = XC[i];
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, 500, 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      if (i === 0) { const R = repere({ x: cx - 170, y: 300, w: 340, h: 190 }, { x0: -0.3, x1: 2.1, y0: -0.6, y1: 4 }); courbe(ctx, R, carre, -0.3, 2.1, { lw: 4 }); droite(ctx, R, 1, 1, 2, { c: C.cours, lw: 4 }); point(ctx, R, 1, 1, { r: 7 }); }
      if (i === 1) { const R = repere({ x: cx - 170, y: 300, w: 340, h: 190 }, { x0: -0.9, x1: 3.1, y0: 0.4, y1: 7 }); courbe(ctx, R, cub, -0.9, 0, { lw: 4, c: NEG }); courbe(ctx, R, cub, 0, 2, { lw: 4, c: POS }); courbe(ctx, R, cub, 2, 3.1, { lw: 4, c: NEG });
        droite(ctx, R, 2, 6, 0, { c: C.gm, lw: 2.5, dash: [6, 8], k: 0.3 }); point(ctx, R, 2, 6, { r: 7 }); point(ctx, R, 0, 2, { r: 7 }); }
      if (i === 2) { formule(ctx, 'vit', cx, 345, { fs: 40, mil: 1 });
        ctx.strokeStyle = C.gl; ctx.lineWidth = 3; ctx.lineCap = 'round'; for (let j = 0; j < 3; j++) { const ph = (t * 1.6 + j / 3) % 1; ctx.globalAlpha = k * a * (1 - ph); ctx.beginPath(); ctx.moveTo(cx - 60 - ph * 90, 430 + j * 18); ctx.lineTo(cx - 100 - ph * 90, 430 + j * 18); ctx.stroke(); } ctx.globalAlpha = k * a;
        ctx.strokeStyle = C.filet; ctx.beginPath(); ctx.moveTo(cx - 190, 490); ctx.lineTo(cx + 190, 490); ctx.stroke();
        ctx.save(); ctx.translate(cx + 30, 488); ctx.scale(3, 3); globalThis.CHIEN.dessiner(ctx, { x: 0, face: 1, t, assis: 0, tang: 0, tete: -0.05, cou: 0, bas: 0, saut: 0, vol: 0, allure: 'galop', phase: t * 14, queue: { a: -0.05, amp: 0.1, f: 8, courbe: 0.04 } }); ctx.restore(); }
      txt(ctx, TX[i][0], cx, 560, { size: 29, w: 600 }); txt(ctx, TX[i][1], cx, 602, { size: 29, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, 'Dériver, c’est mesurer une {pente}.', CX, 745 + (1 - kp) * 20, { size: 58, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- fin ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, 'PREMIÈRE SPÉCIALITÉ · CHAPITRE 4', CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, 'La dérivation', CX, 556 + (1 - k1) * 20, { size: 100, w: 800, a: k1 });
    ligne(ctx, 'Le cours complet et 36 exercices corrigés : {atlasjourdain.fr}', CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const XS = S.CH.map((c, k) => (280 + 210 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[6] + 36], DS = XS.map((x, k) => x + (k === 6 ? 70 : 30)), J = S.jardin;
  const melange = (dom, g) => { const r = alea(g); return K.FEUILLES.map(() => (r() < 0.6 ? dom : RUBC[Math.floor(r() * 5)])); };
  const ARBRES = S.CH.map((c, k) => ({ x: XS[k], ne: c.plante, ech: 2.05, miroir: k % 2 ? -1 : 1, coul: melange(C.cours, 31 + k) }));
  function jardinierA(t) {
    const fd = (a, b) => Math.min(doux(pr(t, a, 0.15)), 1 - doux(pr(t, b - 0.15, 0.15)));
    let x = lerp(-40, STAND[0], doux(pr(t, J.entree[0], J.entree[1] - J.entree[0]))), marche = fd(...J.entree), arrose = 0, verse = false;
    J.marche.forEach(([a, b], k) => { if (k >= STAND.length - 1) return; x += (STAND[k + 1] - STAND[k]) * doux(pr(t, a, b - a)); marche = Math.max(marche, fd(a, b)); });
    for (const [a, b] of J.arrose) { arrose = Math.max(arrose, Math.min(doux(pr(t, a, 0.3)), 1 - doux(pr(t, b - 0.3, 0.3)))); if (t > a + 0.25 && t < b - 0.25) verse = true; }
    const libre = (1 - marche) * (1 - arrose) * doux(pr(t, J.entree[1], 0.5)) * (1 - doux(pr(t, S.fin.t0 - 0.5, 0.5)));      // il regarde la leçon
    return { x, t, marche, phase: x * globalThis.JARDINIER.PAS_MARCHE, elan: 0, arrose, verse, tete: 0.1 * arrose - 0.3 * libre, geste: { nom: 'regard', k: libre }, chapeau: Math.sin(Math.PI * pr(t, S.fin.chapeau, 1.4)) };
  }
  // le chien du bas : il arrive après la colline, suit le jardinier, repart sur la colline des variations, puis revient
  const DEHORS = LU + 34;
  const FINP = S.CH.map((c) => c.t1);                    // fins de partie
  // Le chien est l'acteur des scènes, et chacun de ses déplacements a une raison que l'on voit. Sur la colline du
  // début, il traverse l'écran de gauche à droite, puis rentre au jardin par la droite. Pour les variations, il saute
  // sous l'écran, retombe du haut sur la courbe, la parcourt, s'assoit au sommet, et saute enfin rejoindre le jardinier.
  const ACT = (() => { const d0 = S.variations.chien[0]; return { tJ: L(38) + 0.05, tA: d0 - 1.05, tL: d0 - 0.25, tX: FINP[6] - 0.7 }; })();
  const EN_SCENE = [[ACT.tJ + 0.2, ACT.tX + 1.5]];
  const TRAJETS = [[FINP[0] + 0.4, FINP[0] + 2.6, DEHORS, DS[1]], ...[1, 2, 3, 4, 5].map((k) => [J.marche[k][0] + 0.15, J.marche[k][1] + 0.15, DS[k], DS[k + 1]])];
  function acteur(ctx, t) {
    const { tJ, tA, tL, tX } = ACT, d0 = S.variations.chien[0], ECH = 2.6, x5 = DS[5] * SC, x6 = DS[6] * SC;
    const pente = (x) => Math.atan(-cubP(x) * RV.ky / RV.kx);
    if (t >= tJ + 0.2 && t < tA) { const u = t - tJ - 0.2, y = SOLPX - 430 * u + 1250 * u * u;                       // petit bond, puis il tombe sous l'écran
      if (y < H + 130) K.chienSur(ctx, x6, y, 0, SC, u < 0.17 ? { t, face: -1, allure: 'vol', vol: u / 0.17, tang: 0.3 } : { ...K.poseChute(t), face: -1 }); }
    else if (t >= tA && t < tL) { const u = (t - tA) / (tL - tA), yb = RV.Y(cub(-1)) - 2; K.chienSur(ctx, RV.X(-1), -60 + (yb + 60) * Math.pow(u, 1.6), pente(-1) * u * u, ECH, K.poseChute(t)); }   // il retombe du haut, sur la courbe
    else if (t >= tL && t < d0) K.chienSur(ctx, RV.X(-1), RV.Y(cub(-1)) - 2, pente(-1), ECH, K.poseChoc(t, t - tL));
    else if (t >= tX && t < tX + 1.5) { const u = pr(t, tX + 0.2, 0.8), x = lerp(RV.X(2), x6, u), y = lerp(RV.Y(6) - 2, SOLPX, u * u) - 170 * Math.sin(Math.PI * u) * (1 - u), ech = lerp(ECH, SC, u), fin = t - (tX + 1.0);
      K.chienSur(ctx, x, y, 0, ech, u <= 0 ? { t, assis: 1 - pr(t, tX, 0.2), bas: 2 * pr(t, tX, 0.2) } : u < 0.3 ? { t, allure: 'vol', vol: u / 0.3, tang: 0.35 } : u < 1 ? K.poseChute(t) : { ...K.poseChoc(t, fin), face: lerp(1, -1, doux(pr(fin, 0.1, 0.3))), assis: doux(pr(fin, 0.15, 0.35)) }); }
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

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    colline(ctx, ts); parabole(ctx, ts); fonction(ctx, ts); formules(ctx, ts); tangente(ctx, ts); variations(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
