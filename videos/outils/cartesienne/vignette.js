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

