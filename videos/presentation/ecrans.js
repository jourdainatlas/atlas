// LES ÉCRANS DES RUBRIQUES — pour chaque rubrique, une vue stylisée de ce qu'on y fait sur le site.
// Repère local : 888 × 510. a = secondes écoulées depuis le début de la rubrique ; E = SCORE.ECR[rubrique].
// Toute formule montrée ici est vérifiée : x² − 5x + 6 a pour discriminant 1 et pour racines 2 et 3 ; la sécante à
// y = x² entre les abscisses 1 et 1 + h a pour pente 2 + h ; la médiatrice passe par les deux intersections des arcs.
(function () {
  const S = globalThis.SCORE, LW = 888, LH = 510;
  const borne = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), doux = (x) => x * x * (3 - 2 * x), lerp = (a, b, k) => a + (b - a) * k;
  const pr = (t, t0, d) => borne((t - t0) / d), sortie = (x) => 1 - Math.pow(1 - x, 3);
  const ressort = (x) => { const c = 1.9; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const alea = (g) => () => { g |= 0; g = g + 0x6D2B79F5 | 0; let t = Math.imul(g ^ g >>> 15, 1 | g); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const C = { papier: '#121418', surface: '#191c22', noeud: '#1d2027', encre: '#e7e9ed', encre2: '#aeb4be', encre3: '#90979f', filet: '#2b2f37', trame: '#262a31',
    edifice: '#55aaff', cours: '#35caa4', exercices: '#c793e6', annales: '#ffa24a', activites: '#b6ca4c', corrige: '#5cbf8a', corrigeFond: '#17251e',
    page: '#ffffff', pEncre: '#1b1e24', pGris: '#c9ccd2', pBleu: '#0070c0', pVert: '#00866b' };
  const FE = new Path2D('M-1 0 C-0.55 -0.66 0.5 -0.62 1 0 C0.52 0.44 -0.5 0.52 -1 0 Z');
  const POL = { s: 'Spectral', u: '"IBM Plex Sans"', m: '"IBM Plex Mono"', n: 'KaTeX_Main', i: 'KaTeX_Math', bb: 'KaTeX_AMS' };
  function txt(ctx, s, x, y, o = {}) { ctx.save(); ctx.font = `${o.it ? 'italic ' : ''}${o.w || 400} ${o.size || 24}px ${POL[o.f || 'u']}`; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic'; ctx.letterSpacing = (o.ls || 0) + 'px'; ctx.globalAlpha *= o.a ?? 1; ctx.fillStyle = o.c || C.encre; ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w; }
  // une formule simple : suite de morceaux [police, texte], « sup » pour un exposant ; rend la largeur
  function formule(ctx, x, y, morceaux, size, c) {
    let cx = x;
    for (const [f, s] of morceaux) {
      if (f === 'sup') { cx += txt(ctx, s, cx + 1, y - size * 0.42, { f: 'n', size: size * 0.68, c }) + 2; continue; }
      if (f === 'rac') { const w0 = txt(ctx, '√', cx, y, { f: 'n', size, c }), w1 = txt(ctx, s, cx + w0, y, { f: 'n', size, c }); ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = size * 0.045; ctx.beginPath(); ctx.moveTo(cx + w0 - 0.5, y - size * 0.81); ctx.lineTo(cx + w0 + w1 + 1, y - size * 0.81); ctx.stroke(); ctx.restore(); cx += w0 + w1 + 2; continue; }
      cx += txt(ctx, s, cx, y, { f, size, c, it: f === 'i' || f === 'si', w: f === 'sg' ? 700 : 400, ...(f === 'si' || f === 'sg' ? { f: 's' } : {}) });
    }
    return cx - x;
  }
  const boite = (ctx, x, y, w, h, r, fill, stroke, lw = 2) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
  const barres = (ctx, x, y, w, n, g, c, pas = 22) => { const r = alea(g); ctx.fillStyle = c; for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.roundRect(x, y + i * pas, w * (i === n - 1 ? 0.45 + 0.3 * r() : 0.9 + 0.1 * r()), 9, 4); ctx.fill(); } };
  const feuille = (ctx, x, y, rot, e, c) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(e, e); ctx.fillStyle = c; ctx.fill(FE); ctx.restore(); };

  // ---------- Cours : la visionneuse défile ; des feuilles de l'édifice tombent sur la page et deviennent des résultats ----------
  function cours(ctx, a, E) {
    ctx.fillStyle = '#0e1013'; ctx.fillRect(0, 0, LW, LH);
    const def = E.defile, sc = 430 * doux(pr(a, def[0], def[1] - def[0])) + 26 * pr(a, def[1], 2.6), px = 124, pw = 640, py = 90 - sc;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 64, LW, LH - 64); ctx.clip();
    ctx.fillStyle = C.page; ctx.fillRect(px, py, pw, 905);
    ctx.save(); ctx.translate(px, py);
    txt(ctx, 'Chapitre 1', 60, 110, { f: 's', w: 500, size: 30, c: C.pEncre }); txt(ctx, 'Nombres et calculs', 60, 162, { f: 's', w: 700, size: 42, c: C.pEncre });
    ctx.fillStyle = C.pEncre; ctx.fillRect(60, 186, 520, 2);
    txt(ctx, '1   Introduction historique', 60, 240, { f: 's', w: 700, size: 24, c: C.pEncre }); barres(ctx, 60, 264, 520, 7, 3, C.pGris);
    txt(ctx, '3   Ensembles de nombres', 60, 468, { f: 's', w: 700, size: 24, c: C.pEncre }); barres(ctx, 60, 492, 520, 2, 5, C.pGris);
    barres(ctx, 60, 654, 520, 2, 7, C.pGris); barres(ctx, 60, 826, 520, 3, 9, C.pGris);
    // les deux résultats, là où les feuilles se posent
    const RES = [{ y: 548, c: C.pBleu, nom: 'PROPRIÉTÉ', x0: 520, f: [['bb', 'N'], ['n', ' ⊂ '], ['bb', 'Z'], ['n', ' ⊂ '], ['bb', 'D'], ['n', ' ⊂ '], ['bb', 'Q'], ['n', ' ⊂ '], ['bb', 'R']] },
      { y: 720, c: C.pVert, nom: 'THÉORÈME', x0: 180, f: [['rac', '2'], ['s', ' est irrationnel.']] }];
    RES.forEach((r, i) => {
      const tl = E.feuilles[i], u = pr(a, tl - 0.75, 0.75), k = sortie(pr(a, tl, 0.3));
      if (k > 0) { ctx.save(); ctx.globalAlpha = k; boite(ctx, 60, r.y, 60 + 460 * k, 86, 8, r.c + '14'); ctx.fillStyle = r.c; ctx.fillRect(60, r.y, 6, 86); if (i === 1) ctx.fillRect(70, r.y, 3, 86);
        txt(ctx, r.nom, 88, r.y + 30, { w: 600, size: 17, ls: 2.5, c: r.c }); formule(ctx, 88, r.y + 68, r.f, 30, C.pEncre); ctx.restore(); }
      if (u > 0) { const e = doux(u), fx = lerp(r.x0, 548, e) + 34 * Math.sin(u * 7) * (1 - u), fy = lerp(r.y - 330, r.y + 24, e * e);     // la feuille tombe en se balançant, puis reste au coin du cadre
        feuille(ctx, fx, fy, u < 1 ? -0.5 + 1.1 * Math.sin(u * 9) * (1 - u) : -0.5, 17 * (u < 1 ? 1 : 1 + 0.25 * Math.max(0, 1 - (a - tl) / 0.25)), r.c); }
    });
    ctx.restore();
    ctx.fillStyle = C.page; ctx.fillRect(px, py + 905 + 24, pw, 400); ctx.restore();
    // la barre de la visionneuse
    ctx.fillStyle = C.noeud; ctx.fillRect(0, 0, LW, 64); ctx.fillStyle = C.filet; ctx.fillRect(0, 63, LW, 2);
    txt(ctx, '‹', 30, 42, { size: 30, c: C.encre3 }); txt(ctx, 'page 1 / 6', 62, 41, { size: 24, c: C.encre2 }); txt(ctx, '›', 190, 42, { size: 30, c: C.encre3 });
    boite(ctx, 500, 13, 176, 40, 20, null, C.filet); txt(ctx, 'Ouvrir le PDF', 588, 41, { size: 22, c: C.encre2, align: 'center' });
    boite(ctx, 692, 13, 168, 40, 20, null, C.filet); txt(ctx, 'Télécharger', 776, 41, { size: 22, c: C.encre2, align: 'center' });
  }

  // ---------- Exercices : la banque défile, s'arrête sur un exercice, et le corrigé se déplie étape par étape ----------
  function jauge(ctx, x, y, n) { for (let i = 0; i < 4; i++) { ctx.fillStyle = i < n ? C.encre2 : C.trame; ctx.beginPath(); ctx.roundRect(x + i * 22, y, 18, 8, 3); ctx.fill(); } }
  function exercices(ctx, a, E) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, LW, LH);
    const def = E.defile, PAS = 112, CIBLE = 7, u = pr(a, def[0], def[1] - def[0]), sc = (CIBLE - 1) * PAS * (1 - Math.pow(1 - u, 3)), ouvre = sortie(pr(a, def[1] + 0.02, 0.3)), X = 56, Wc = LW - 112;
    const r = alea(11), niveaux = Array.from({ length: 14 }, () => 1 + Math.floor(r() * 4));
    for (let n = 1; n <= 12; n++) {
      let y = 22 + (n - 1) * PAS - sc; const cible = n === CIBLE, h = cible ? lerp(96, 466, ouvre) : 96; if (n > CIBLE) y += 370 * ouvre;
      if (y > LH || y + h < 0) continue;
      boite(ctx, X, y, Wc, h, 14, C.surface, cible && ouvre > 0 ? C.exercices : C.filet, cible && ouvre > 0 ? 3 : 2);
      txt(ctx, 'Exercice ' + n, X + 26, y + 44, { f: 's', w: 700, size: 30 }); jauge(ctx, X + 26 + (n > 9 ? 190 : 174), y + 27, cible ? 2 : niveaux[n]);
      if (!cible || ouvre < 0.05) { barres(ctx, X + 26, y + 64, Wc - 220, 1, 20 + n, C.trame); continue; }
      ctx.save(); ctx.beginPath(); ctx.rect(X, y, Wc, h); ctx.clip(); ctx.globalAlpha = ouvre;
      const w0 = txt(ctx, 'Résoudre dans ', X + 26, y + 100, { f: 's', size: 29 });
      formule(ctx, X + 26 + w0, y + 100, [['bb', 'R'], ['s', ' :   '], ['i', 'x'], ['sup', '2'], ['n', ' − 5'], ['i', 'x'], ['n', ' + 6 = 0.']], 30, C.encre);
      // le bouton « Corrigé »
      const cl = Math.max(0, 1 - Math.abs(a - E.clic) / 0.18), dep = a >= E.clic;
      boite(ctx, X + 26, y + 124 + 2 * cl, 152, 44, 8, dep ? C.corrigeFond : null, C.corrige); txt(ctx, (dep ? '− ' : '+ ') + 'Corrigé', X + 102, y + 154 + 2 * cl, { w: 500, size: 24, c: C.corrige, align: 'center' });
      const ET = [[['sg', '1.  '], ['n', 'Δ = (−5)'], ['sup', '2'], ['n', ' − 4 × 1 × 6 = 1.']],
        [['sg', '2.  '], ['i', 'x'], ['n', ' = (5 − 1)/2 = 2   ou   '], ['i', 'x'], ['n', ' = (5 + 1)/2 = 3.']],
        [['sg', '3.  '], ['i', 'S'], ['n', ' = {2 ; 3}.']]];
      ET.forEach((f, i) => { const k = sortie(pr(a, E.etapes[i], 0.3)); if (k <= 0) return; const yy = y + 190 + i * 88 + (1 - k) * 18;
        ctx.save(); ctx.globalAlpha = ouvre * k; boite(ctx, X + 26, yy, Wc - 52, 74, 8, C.corrigeFond); ctx.fillStyle = C.corrige; ctx.fillRect(X + 26, yy, 5, 74); formule(ctx, X + 52, yy + 47, f, 29, C.encre); ctx.restore(); });
      ctx.restore();
    }
  }

  // ---------- Annales : la grille des sujets défile ; le moteur éclaire les sujets qui traitent du mot tapé ----------
  function annales(ctx, a, E) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, LW, LH);
    const def = E.defile, COL = 148, G = 236, LIG = 60, sc = 620 * doux(pr(a, def[0], def[1] - def[0])), rangs = [['X-ENS', 'ABCD'], ['Mines-Ponts', '12'], ['Centrale-Supélec', '12'], ['CCINP', '12']];
    const mot = E.mot, nb = Math.floor(mot.length * pr(a, E.frappe[0], E.frappe[1] - E.frappe[0]) + 1e-6);
    ctx.save(); ctx.beginPath(); ctx.rect(G, 0, LW - G, 300); ctx.clip();
    for (let j = 0; j < 16; j++) {
      const x = G + j * COL - sc; if (x > LW || x + COL < G) continue;
      txt(ctx, String(2026 - j), x + 16, 34, { f: 'm', w: 500, size: 21, c: C.encre3 });
      rangs.forEach(([, ep], i) => { [...ep].forEach((l, q) => { const seuil = alea(j * 100 + i * 10 + q + 7)(), allume = seuil < 0.42 && nb > 0 && seuil * 26 < nb, k = allume ? sortie(pr(a, E.frappe[0] + (E.frappe[1] - E.frappe[0]) * (seuil * 26) / mot.length, 0.25)) : 0, bx = x + 14 + q * 33, by = 62 + i * LIG;
          if (k > 0) { ctx.save(); ctx.shadowColor = C.annales; ctx.shadowBlur = 16 * k; boite(ctx, bx, by, 28, 28, 6, C.annales); ctx.restore(); }
          else boite(ctx, bx, by, 28, 28, 6, C.corrigeFond, C.corrige, 1.5);
          txt(ctx, l, bx + 14, by + 21, { f: 'm', w: 500, size: 18, c: k > 0 ? C.papier : C.encre, align: 'center' }); });
      });
    }
    ctx.restore();
    ctx.fillStyle = C.filet; ctx.fillRect(0, 46, LW, 2); for (let i = 1; i <= 4; i++) ctx.fillRect(0, 46 + i * LIG, LW, 1);
    txt(ctx, 'Concours', 22, 33, { f: 'm', w: 500, size: 19, c: C.encre3 }); rangs.forEach(([n], i) => txt(ctx, n, 22, 84 + i * LIG, { w: 600, size: 22 }));
    // le moteur de recherche, sous la grille
    ctx.fillStyle = C.surface; ctx.fillRect(0, 300, LW, 210); ctx.fillStyle = C.filet; ctx.fillRect(0, 299, LW, 2);
    txt(ctx, 'Chercher un thème dans les sujets', 28, 350, { w: 600, size: 27 });
    boite(ctx, 28, 376, 470, 62, 10, C.papier, nb > 0 ? C.annales : C.filet, nb > 0 ? 3 : 2);
    const w = txt(ctx, mot.slice(0, nb), 48, 417, { size: 28 }); if (a < E.frappe[1] + 0.2 ? true : Math.floor(a * 2.5) % 2 === 0) { ctx.fillStyle = C.encre; ctx.fillRect(50 + w, 392, 2, 32); }
    if (nb === 0) txt(ctx, 'séries entières, loi de Poisson…', 48, 417, { size: 25, c: C.encre3, a: 0.7 });
    const b = sortie(pr(a, E.bilan, 0.3)); if (b > 0) { txt(ctx, '83 sujets', 528, 404, { w: 600, size: 28, c: C.annales, a: b }); txt(ctx, '138 parties concernées', 528, 436, { size: 23, c: C.encre2, a: b }); }
    txt(ctx, 'Écoles d’ingénieurs · sessions 2011 à 2026', 28, 480, { size: 21, c: C.encre3 });
  }

  // ---------- Activités : quatre activités animées en même temps ----------
  function activites(ctx, a, E) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, LW, LH);
    const TW = 424, TH = 237, tuile = (i, nom, coul, f) => { const k = ressort(pr(a, E.tuiles[i], 0.35)); if (k <= 0) return; const x = 12 + (i % 2) * (TW + 16), y = 12 + Math.floor(i / 2) * (TH + 12);
      ctx.save(); ctx.translate(x + TW / 2, y + TH / 2); ctx.scale(k, k); ctx.translate(-TW / 2, -TH / 2); boite(ctx, 0, 0, TW, TH, 14, C.surface, C.filet); ctx.fillStyle = coul; ctx.beginPath(); ctx.roundRect(0, 0, TW, 6, [14, 14, 0, 0]); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(0, 6, TW, TH - 6); ctx.clip(); f(a - E.tuiles[i]); ctx.restore(); txt(ctx, nom, 20, TH - 18, { w: 500, size: 21, c: C.encre2 }); ctx.restore(); };
    // 1. La pente en un point : la sécante de y = x² entre 1 et 1 + h a pour pente 2 + h, qui tend vers 2
    tuile(0, 'La pente en un point', C.cours, (u) => {
      const X = (x) => 190 + x * 92, Y = (y) => 178 - y * 34, h = lerp(1.15, 0.02, doux(pr(u, 0.3, 2.3)));
      ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, Y(0)); ctx.lineTo(410, Y(0)); ctx.moveTo(X(0), 190); ctx.lineTo(X(0), 20); ctx.stroke();
      ctx.strokeStyle = C.cours; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); for (let x = -0.4; x <= 2.25; x += 0.05) ctx[x === -0.4 ? 'moveTo' : 'lineTo'](X(x), Y(x * x)); ctx.stroke();
      const p = 2 + h, d = (x) => 1 + p * (x - 1); ctx.strokeStyle = C.encre; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0.62), Y(d(0.62))); ctx.lineTo(X(2.3), Y(d(2.3))); ctx.stroke();
      for (const x of [1, 1 + h]) { ctx.fillStyle = x === 1 ? C.encre : C.annales; ctx.beginPath(); ctx.arc(X(x), Y(x * x), 7, 0, 6.3); ctx.fill(); }
      txt(ctx, 'pente', 22, 62, { size: 20, c: C.encre3 }); txt(ctx, p.toFixed(2).replace('.', ','), 22, 100, { f: 'm', w: 500, size: 34, c: C.encre });
    });
    // 2. Le taquin : huit coups légaux ramènent les pièces dans l'ordre
    tuile(1, 'Le taquin', C.activites, () => {
      const but = [1, 2, 3, 4, 5, 6, 7, 8, 0], glisser = (e, d) => { const v = e.indexOf(0), c = v % 3, l = (v - c) / 3, nc = c + d[0], nl = l + d[1]; if (nc < 0 || nc > 2 || nl < 0 || nl > 2) throw new Error('coup illégal'); const w = nl * 3 + nc, f = e.slice(); f[v] = f[w]; f[w] = 0; return f; };
      const mel = [[-1, 0], [0, -1], [-1, 0], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1]]; let e = but; const etats = [but]; for (const d of mel) { e = glisser(e, d); etats.push(e); } etats.reverse();     // on mélange par huit coups, puis on les rejoue à l'envers
      const tt = (a - E.premier) / E.pas, n = Math.floor(borne(tt, 0, E.coups)), fr = doux(borne(tt - n)), A = etats[Math.min(n, E.coups)], B = etats[Math.min(n + 1, E.coups)], fini = a >= E.premier + E.coups * E.pas, c0 = 150, l0 = 22, cs = 58;
      for (let v = 1; v <= 8; v++) { const ia = A.indexOf(v), ib = B.indexOf(v), x = c0 + lerp(ia % 3, ib % 3, fr) * cs, y = l0 + lerp(Math.floor(ia / 3), Math.floor(ib / 3), fr) * cs;
        boite(ctx, x + 3, y + 3, cs - 6, cs - 6, 9, fini ? C.activites : C.noeud, fini ? null : C.activites, 2); txt(ctx, String(v), x + cs / 2, y + cs / 2 + 10, { f: 's', w: 700, size: 28, c: fini ? C.papier : C.encre, align: 'center' }); }
    });
    // 3. Tout éteindre : appuyer sur une lampe l'inverse, ainsi que ses voisines ; quatre appuis éteignent tout
    tuile(2, 'Tout éteindre', C.edifice, (u) => {
      const appuis = [4, 0, 8, 2], bascule = (e, p) => { const f = e.slice(), c = p % 3, l = (p - c) / 3; for (const [dc, dl] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const nc = c + dc, nl = l + dl; if (nc >= 0 && nc < 3 && nl >= 0 && nl < 3) f[nl * 3 + nc] ^= 1; } return f; };
      let e = Array(9).fill(0); for (const p of appuis) e = bascule(e, p); const n = Math.floor(borne((u - 0.5) / 0.5, 0, 4)); for (let i = 0; i < n; i++) e = bascule(e, appuis[i]);
      const c0 = 150, l0 = 22, cs = 58, enCours = u >= 0.3 && n < 4 ? appuis[n] : -1, ph = ((u - 0.5) / 0.5) % 1;
      e.forEach((v, i) => { const x = c0 + (i % 3) * cs, y = l0 + Math.floor(i / 3) * cs; ctx.save(); if (v) { ctx.shadowColor = C.edifice; ctx.shadowBlur = 14; } boite(ctx, x + 4, y + 4, cs - 8, cs - 8, 10, v ? C.edifice : C.noeud, v ? null : C.filet, 2); ctx.restore();
        if (i === enCours && ph > 0.55) { ctx.strokeStyle = C.encre; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + cs / 2, y + cs / 2, 10 + 22 * (ph - 0.55), 0, 6.3); ctx.stroke(); } });
    });
    // 4. Atelier de construction : la médiatrice d'un segment, à la règle et au compas
    tuile(3, 'Atelier de construction', C.exercices, (u) => {
      const ox = 212, oy = 104, d = 78, R = 112, hy = Math.sqrt(R * R - d * d), al = Math.acos(d / R) + 0.22;                            // les arcs se coupent en (0, ±√(R² − d²))
      ctx.lineCap = 'round'; ctx.strokeStyle = C.encre; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(ox - d, oy); ctx.lineTo(ox + d, oy); ctx.stroke();
      ctx.strokeStyle = C.exercices; ctx.lineWidth = 2.5; const k1 = doux(pr(u, 0.25, 0.7)), k2 = doux(pr(u, 1.0, 0.7)), k3 = doux(pr(u, 1.8, 0.5));
      if (k1 > 0) { ctx.beginPath(); ctx.arc(ox - d, oy, R, -al, -al + 2 * al * k1); ctx.stroke(); }
      if (k2 > 0) { ctx.beginPath(); ctx.arc(ox + d, oy, R, Math.PI - al, Math.PI - al + 2 * al * k2); ctx.stroke(); }
      if (k3 > 0) { ctx.strokeStyle = C.annales; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy - (hy + 14) * k3); ctx.lineTo(ox, oy + (hy + 14) * k3); ctx.stroke(); for (const s of [-1, 1]) { ctx.fillStyle = C.annales; ctx.beginPath(); ctx.arc(ox, oy + s * hy, 5.5 * k3, 0, 6.3); ctx.fill(); } }
      for (const s of [-1, 1]) { ctx.fillStyle = C.encre; ctx.beginPath(); ctx.arc(ox + s * d, oy, 6, 0, 6.3); ctx.fill(); }
    });
  }
  globalThis.ECRANS = { cours, exercices, annales, activites, LW, LH };
})();
