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

