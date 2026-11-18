  // ---------- la vignette (image d'attente du lecteur, miniature YouTube) ----------
  // Elle n'appartient pas au film : `node engine/render.js stills 1000` la dessine (tout instant au-delà de la durée
  // plus 100 s). Le titre, les deux bandes de la définition de la limite autour de la courbe, le chien, le jardin.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, 'Limites', 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, 'et continuité', 76, 506, { size: 150, w: 800, align: 'left' });
    const Rv = K.repere({ x: 1060, y: 230, w: 780, h: 560 }, { x0: 0.75, x1: 3.4, y0: 0.1, y1: 1.2 }), e = 0.14, d = 0.42;
    bandeH(ctx, Rv, 0.5 - e, 0.5 + e, 'rgba(255,162,74,0.26)', 1); bandeV(ctx, Rv, 2 - d, 2 + d, 'rgba(53,202,164,0.26)', 1);
    K.courbe(ctx, Rv, inv, 0.84, 3.4, { lw: 9 }); K.courbe(ctx, Rv, inv, 2 - d, 2 + d, { c: C.cours, lw: 12 });
    const x = 2, p = XY(Rv, x, inv(x)); K.chienSur(ctx, p[0], p[1] - 4, Math.atan(0.25 * Rv.ky / Rv.kx), 4.6, { t: 0.4, allure: 'trot', phase: 1.1 });
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

