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

