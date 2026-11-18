  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, le vecteur de A à B parcouru par le chien, ses coordonnées, le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'Géométrie', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'cartésienne', 76, 506, { size: 150, w: 800, align: 'left' });
    // à droite : le vecteur de A à B dans son quadrillage, ses coordonnées en pointillé, le chien qui le parcourt
    const u = 150, O = [1010, 760], P = (x, y) => [O[0] + x * u, O[1] - y * u], A = P(0.6, 0.5), B = P(4.5, 3.1), Cc = [B[0], A[1]];
    for (let i = 0; i <= 5; i++) seg(ctx, P(i, 0), P(i, 3.6), { c: C.trame, lw: 2.5 }); for (let j = 0; j <= 3; j++) seg(ctx, P(0, j), P(5.4, j), { c: C.trame, lw: 2.5 });
    seg(ctx, A, Cc, { c: C.orange, lw: 6, dash: [16, 14] }); seg(ctx, Cc, B, { c: C.orange, lw: 6, dash: [16, 14] });
    fl(ctx, A, B, { c: C.bleu, lw: 11, tp: 40 }); pt(ctx, A, { r: 13 });
    const m = [lerp(A[0], B[0], 0.5), lerp(A[1], B[1], 0.5)]; K.chienSur(ctx, m[0], m[1] - 5, Math.atan((B[1] - A[1]) / (B[0] - A[0])), 5.0, { t: 0.4, allure: 'trot', phase: 1.1 });
    formule(ctx, 'l_A', A[0] - 44, A[1] + 30, { fs: 62, mil: 1 }); formule(ctx, 'l_B', B[0] + 48, B[1] + 34, { fs: 62, mil: 1 });
    formule(ctx, 'v_vig', 500, 690, { fs: 92, mil: 1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

