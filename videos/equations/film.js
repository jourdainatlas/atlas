// LE FILM — « Les équations », Seconde, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le fil conducteur est celui du cours : une équation est une balance en équilibre.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Les équations', NIVEAU = 'SECONDE', NB_EXERCICES = 33;

  // une équation : les deux membres de part et d'autre du signe =, placé en x
  function eq(ctx, l, r, x, y, o = {}) {
    const fs = o.fs || 44, a = o.a ?? 1, d = 0.72 * fs;
    formule(ctx, l, x - d, y, { fs, mil: 1, align: 'right', a, monte: o.monte }); formule(ctx, 'eg', x, y, { fs, mil: 1, a }); formule(ctx, r, x + d, y, { fs, mil: 1, align: 'left', a, monte: o.monte });
  }
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
    for (const [nom, t0, t1] of [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(82), L(S.FIN)]]) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(2) - 0.6, 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 300, 210, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, `${NIVEAU} · CHAPITRE 4`, CX, 478, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Retrouver un nombre {inconnu}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- 1. le vocabulaire ----------
  function vocab(ctx, t) {
    const V = S.vocab, a = fen(t, L(2) + 0.1, L(10), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const fs = 88, xe = CX, y = 290, k = ap(t, V.eq); eq(ctx, 'v_l', 'v_r', xe, y, { fs, a: k, monte: 1 });
    const d = 0.72 * fs, wl = largeur('v_l', fs), wr = largeur('v_r', fs);
    [[xe - d - wl, wl, 'premier membre', C.bleu], [xe + d, wr, 'second membre', C.orange]].forEach(([x, w, nom, c], i) => { const q = ap(t, V.membres[i]); if (q <= 0) return;
      ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + 62); ctx.lineTo(x + w * q, y + 62); ctx.stroke(); ctx.restore();
      txt(ctx, nom, x + w / 2, y + 104, { fam: F.ui, w: 500, size: 28, c, a: q }); });
    ligne(ctx, 'inconnue : $x$', xe, y - 96, { size: 30, w: 500, c: C.encre2, a: ap(t, V.membres[1] + 0.8) });
    V.tests.forEach((T, i) => { const yy = 530 + i * 100, v = i ? 4 : 1;
      ligne(ctx, `Pour $x = ${v}$ :`, 300, yy + 12, { size: 36, w: 500, align: 'left', a: ap(t, T.l - 0.3) });
      formule(ctx, `t${v}l`, 800, yy, { fs: 42, mil: 1, a: ap(t, T.l), monte: 1 }); txt(ctx, 'et', 1035, yy + 12, { size: 34, w: 500, c: C.encre2, a: ap(t, T.r) }); formule(ctx, `t${v}r`, 1270, yy, { fs: 42, mil: 1, a: ap(t, T.r), monte: 1 });
      const q = ap(t, T.v); marque(ctx, 1500, yy, 20, !!i, q); txt(ctx, i ? '4 est une solution' : '1 n’est pas solution', 1540, yy + 11, { fam: F.ui, w: 500, size: 28, c: i ? VRAI : FAUX, align: 'left', a: q }); });
    ctx.restore();
    legende(ctx, t, V.leg[0], ['Une [équation] est une égalité qui contient un nombre inconnu : l’[inconnue].']);
    legende(ctx, t, V.leg[1], ['Une [solution] est une valeur de l’inconnue qui rend l’égalité vraie.']);
    legende(ctx, t, V.leg[2], ['Pour $x = 4$, les deux membres valent $17$ : $4$ est une solution.']);
    legende(ctx, t, V.leg[3], ['Résoudre l’équation, c’est trouver toutes ses solutions.', 'Essayer des nombres un par un ne suffit pas : il faut une méthode.']);
  }

  // ---------- la balance : pivot (cx, cy), échelle s, inclinaison th (positive : le plateau droit descend) ----------
  function balanceD(ctx, cx, cy, s, th, gauche, droite, k = 1) {
    if (k <= 0) return; const Lb = 250 * s, hc = 190 * s, pw = 165 * s, ex = Lb * Math.cos(th), ey = Lb * Math.sin(th);
    ctx.save(); ctx.globalAlpha *= k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = C.gl; ctx.beginPath(); ctx.moveTo(cx, cy - 6 * s); ctx.lineTo(cx - 44 * s, cy + 262 * s); ctx.lineTo(cx + 44 * s, cy + 262 * s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.roundRect(cx - 120 * s, cy + 256 * s, 240 * s, 14 * s, 7 * s); ctx.fill();
    for (const c of [-1, 1]) { const X = cx + c * ex, Y = cy + c * ey, Yp = Y + hc;
      ctx.strokeStyle = C.gl; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(X - pw, Yp); ctx.lineTo(X, Y); ctx.lineTo(X + pw, Yp); ctx.stroke();
      ctx.strokeStyle = C.gd; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(X - pw - 8 * s, Yp); ctx.lineTo(X + pw + 8 * s, Yp); ctx.stroke();
      (c < 0 ? gauche : droite)(X, Yp - 6 * s); }
    ctx.strokeStyle = C.gd; ctx.lineWidth = 11 * s; ctx.beginPath(); ctx.moveTo(cx - ex, cy - ey); ctx.lineTo(cx + ex, cy + ey); ctx.stroke();
    ctx.fillStyle = C.encre; ctx.beginPath(); ctx.arc(cx, cy, 14 * s, 0, 6.3); ctx.fill(); ctx.fillStyle = C.papier; ctx.beginPath(); ctx.arc(cx, cy, 5 * s, 0, 6.3); ctx.fill();
    ctx.restore();
  }
  // un objet posé (sac de graines de poids x, ou poids de 1) : il arrive à tin, s'envole à tout
  function objet(ctx, t, genre, x, y, tin, tout) {
    const ki = ap(t, tin, 0.4), ko = tout ? doux(pr(t, tout, 0.6)) : 0; if (ki <= 0 || ko >= 1) return;
    ctx.save(); ctx.translate(x, y - ko * 70); ctx.globalAlpha *= (1 - ko); ctx.scale(ressort(ki), ressort(ki)); ctx.lineJoin = 'round';
    if (genre === 'sac') { ctx.beginPath(); ctx.moveTo(-20, -56); ctx.quadraticCurveTo(-36, -30, -31, -7); ctx.quadraticCurveTo(-29, 0, -19, 0); ctx.lineTo(19, 0); ctx.quadraticCurveTo(29, 0, 31, -7); ctx.quadraticCurveTo(36, -30, 20, -56); ctx.closePath();
      ctx.fillStyle = '#3a2f4a'; ctx.fill(); ctx.strokeStyle = C.violet; ctx.lineWidth = 3; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-20, -56); ctx.lineTo(-13, -70); ctx.lineTo(0, -61); ctx.lineTo(13, -70); ctx.lineTo(20, -56); ctx.closePath(); ctx.fill(); ctx.stroke();
      formule(ctx, 'sx', 0, -24, { fs: 30, mil: 1 }); }
    else { ctx.beginPath(); ctx.roundRect(-14, -29, 28, 28, 5); ctx.fillStyle = C.surface; ctx.fill(); ctx.strokeStyle = C.gd; ctx.lineWidth = 2.5; ctx.stroke(); formule(ctx, 'un', 0, -15, { fs: 17, mil: 1 }); }
    ctx.restore();
  }

  // ---------- 2. le principe de la balance ----------
  function balance(ctx, t) {
    const B = S.balance, a = fen(t, L(10) + 0.1, L(22), 0.4); if (a <= 0) return;
    const osc = (t0) => { const u = t - t0; return u > 0 ? 0.035 * Math.exp(-2.6 * u) * Math.sin(9 * u) : 0; };
    const th = 0.12 * (doux(pr(t, B.faute + 0.15, 0.7)) - doux(pr(t, B.sac + 0.15, 0.7))) + osc(B.faute + 0.5) - osc(B.sac + 0.5) + osc(B.poids + 0.3) * 0.4 + osc(B.moitie + 0.3) * 0.4;
    ctx.save(); ctx.globalAlpha = a;
    const o = B.objets;
    balanceD(ctx, 495, 310, 1.1, th,
      (X, Y) => { objet(ctx, t, 'sac', X - 110, Y, o); objet(ctx, t, 'sac', X - 40, Y, o + 0.1, B.moitie); objet(ctx, t, 'sac', X + 30, Y, o + 0.2, B.faute);
        objet(ctx, t, 'poids', X + 100, Y, o + 0.3, B.poids); objet(ctx, t, 'poids', X + 100, Y - 32, o + 0.4, B.poids); },
      (X, Y) => { objet(ctx, t, 'sac', X - 112, Y, o + 0.2, B.sac);
        for (let i = 0; i < 10; i++) objet(ctx, t, 'poids', X - 40 + (i % 5) * 34, Y - Math.floor(i / 5) * 32, o + 0.3 + i * 0.04, i >= 8 ? B.poids : i >= 4 ? B.moitie : 0); },
      doux(pr(t, B.trace[0], B.trace[1] - B.trace[0])));
    ligne(ctx, 'D’un seul côté : l’équilibre est rompu.', 495, 720, { size: 32, w: 500, c: FAUX, a: fen(t, B.faute + 0.4, B.sac + 0.2, 0.3) });
    // le calcul, ligne à ligne
    const LG = [['b0l', 'b0r', B.ligne0, ''], ['b1l', 'b1r', B.ligne1, 'un sac de moins de chaque côté'], ['b2l', 'b2r', B.ligne2, 'deux poids de moins de chaque côté'], ['b3l', 'b3r', B.ligne3, 'la moitié de chaque plateau']];
    LG.forEach(([l, r, tl, note], i) => { const k = ap(t, tl); if (k <= 0) return; const y = 205 + i * 78;
      if (i === 3) cadre(ctx, 1190, y, 220, 66, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k });
      eq(ctx, l, r, 1190, y, { fs: 44, a: k, monte: 1 }); if (note) txt(ctx, note, 1370, y + 9, { fam: F.ui, w: 500, size: 25, c: C.cours, align: 'left', a: k }); });
    // la propriété
    let k = ap(t, B.prop); carte(ctx, 990, 520, 860, 245, 'PROPRIÉTÉ', k);
    ligne(ctx, 'On ne change pas les solutions d’une équation lorsque l’on :', 1022, 606, { size: 27, w: 500, align: 'left', a: k });
    ['ajoute ou retranche un même nombre aux deux membres ;', 'multiplie ou divise les deux membres par un même nombre non nul.'].forEach((s, i) => { const q = ap(t, B.puces[i]); if (q <= 0) return;
      ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = C.cours; ctx.beginPath(); ctx.arc(1034, 652 + i * 50, 6, 0, 6.3); ctx.fill(); ctx.restore(); ligne(ctx, s, 1056, 661 + i * 50, { size: 25, w: 500, align: 'left', a: q }); });
    ctx.restore();
    legende(ctx, t, B.leg[0], ['Une équation, c’est une balance en équilibre.', 'Ici, chaque sac pèse le même poids inconnu $x$.']);
    legende(ctx, t, B.leg[1], ['Tout ce que l’on fait à gauche, on doit le faire à droite.']);
    legende(ctx, t, B.leg[2], ['On retire deux poids de chaque côté, puis on garde la moitié', 'de chaque plateau : un sac pèse $4$.']);
    legende(ctx, t, B.leg[3], ['C’est le {principe de la balance} : il va nous servir à isoler l’inconnue.']);
  }

  // ---------- 3. la méthode ----------
  function methode(ctx, t) {
    const M = S.methode, a = fen(t, L(22) + 0.1, L(34), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const LG = [['v_l', 'v_r', ''], ['m1l', 'm1r', 'on retranche $2x$ aux deux membres'], ['m2l', 'm2r', 'on réduit chaque membre'], ['m3l', 'm3r', 'on ajoute $3$ aux deux membres'], ['m4l', 'm4r', 'on réduit'], ['m5l', 'm5r', 'on divise les deux membres par $3$'], ['m6l', 'm6r', 'l’inconnue est isolée']];
    LG.forEach(([l, r, note], i) => { const k = ap(t, M.lignes[i]); if (k <= 0) return; const y = 178 + i * 82 + (i === 6 ? 6 : 0);
      if (i === 6) cadre(ctx, 470, y, 210, 62, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k });
      eq(ctx, l, r, 470, y, { fs: 38, a: k, monte: 1 }); if (note) ligne(ctx, note, 800, y + 10, { size: 28, w: 500, c: i % 2 ? C.cours : C.encre3, align: 'left', a: k }); });
    // la balance, à droite : elle reste à l'horizontale, ses plateaux portent les deux membres
    const ET = [['v_l', 'v_r', M.lignes[0]], ['m2l', 'm2r', M.lignes[2]], ['m4l', 'm4r', M.lignes[4]], ['m6l', 'm6r', M.lignes[6]]];
    const plateau = (j) => (X, Y) => ET.forEach((e, i) => { const k = ap(t, e[2]) * (i < 3 ? 1 - ap(t, ET[i + 1][2], 0.3) : 1); formule(ctx, e[j], X, Y - 34, { fs: 34, mil: 1, a: k }); });
    balanceD(ctx, 1600, 250, 0.62, 0.02 * Math.sin(t * 1.3), plateau(0), plateau(1), ap(t, L(22) + 0.3));
    ligne(ctx, 'Vérification, pour $x = 4$ :', 150, 748, { size: 30, w: 500, align: 'left', c: C.encre2, a: ap(t, M.verif[0] - 0.3) });
    formule(ctx, 't4l', 760, 738, { fs: 36, mil: 1, a: ap(t, M.verif[0]), monte: 1 }); txt(ctx, 'et', 955, 748, { size: 30, w: 500, c: C.encre2, a: ap(t, M.verif[1]) }); formule(ctx, 't4r', 1150, 738, { fs: 36, mil: 1, a: ap(t, M.verif[1]), monte: 1 });
    marque(ctx, 1350, 738, 18, true, ap(t, M.verif[2]));
    ctx.restore();
    legende(ctx, t, M.leg[0], ['On regroupe les termes en $x$ dans un membre, les nombres dans l’autre.']);
    legende(ctx, t, M.leg[1], ['On réduit, puis on divise les deux membres par le coefficient de $x$.']);
    legende(ctx, t, M.leg[2], ['On vérifie toujours : pour $x = 4$, les deux membres valent $17$.']);
    legende(ctx, t, M.leg[3], ['« Changer de membre en changeant de signe » n’est qu’un raccourci :', 'en réalité, on retranche le terme des deux côtés.'], { size: 40 });
  }

  // ---------- 4. deux cas particuliers ----------
  function cas(ctx, t) {
    const Ca = S.cas, a = fen(t, L(34) + 0.1, L(42), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const xg = 500, xd = 1420, fs = 50, note = (s, x, y, k) => ligne(ctx, s, x, y, { size: 26, w: 500, c: C.cours, a: k });
    eq(ctx, 'c1l', 'c1r', xg, 250, { fs, a: ap(t, Ca.g[0]), monte: 1 }); note('on retranche $2x$ aux deux membres', xg, 338, ap(t, Ca.g[1])); eq(ctx, 'c5', 'c1', xg, 410, { fs, a: ap(t, Ca.g[1]), monte: 1 });
    let k = ap(t, Ca.g[2]); marque(ctx, xg - 250, 560, 20, false, k); txt(ctx, 'Égalité fausse : aucune solution.', xg - 210, 571, { fam: F.ui, w: 500, size: 30, c: FAUX, align: 'left', a: k });
    ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(CX, 200); ctx.lineTo(CX, 700); ctx.stroke();
    eq(ctx, 'c2l', 'c2r', xd, 250, { fs, a: ap(t, Ca.d[0]), monte: 1 }); note('on développe le premier membre', xd, 338, ap(t, Ca.d[1])); eq(ctx, 'c2r', 'c2r', xd, 410, { fs, a: ap(t, Ca.d[1]), monte: 1 });
    note('on retranche $3x$, puis $6$', xd, 498, ap(t, Ca.d[2])); eq(ctx, 'c0', 'c0', xd, 570, { fs, a: ap(t, Ca.d[2]), monte: 1 });
    k = ap(t, Ca.d[3]); marque(ctx, xd - 375, 690, 20, true, k); txt(ctx, 'Égalité toujours vraie : tous les réels sont solutions.', xd - 335, 701, { fam: F.ui, w: 500, size: 30, c: VRAI, align: 'left', a: k });
    ctx.restore();
    legende(ctx, t, Ca.leg[0], ['Il arrive que l’inconnue disparaisse en cours de route.']);
    legende(ctx, t, Ca.leg[1], ['Ici, il reste une égalité fausse : aucun nombre ne convient.']);
    legende(ctx, t, Ca.leg[2], ['Ce n’est pas le signe d’une erreur : c’est l’égalité restante qu’il faut regarder.']);
    legende(ctx, t, Ca.leg[3], ['Là, elle est toujours vraie : tous les nombres réels conviennent.']);
  }

  // deux branches qui partent de (x, y) vers (xa, yb) et (xb, yb)
  function branches(ctx, x, y, xa, xb, yb, k) {
    if (k <= 0) return; ctx.save(); ctx.strokeStyle = C.gm; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.setLineDash([900 * k, 2000]);
    for (const xe of [xa, xb]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x, y + (yb - y) * 0.7, xe, y + (yb - y) * 0.3, xe, yb); ctx.stroke(); } ctx.restore();
  }

  // ---------- 5. les équations produit ----------
  function produit(ctx, t) {
    const P = S.produit; let a = fen(t, L(42) + 0.1, L(50) - 0.1, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a;
      let k = ap(t, P.prop); carte(ctx, 110, 180, 800, 290, 'PROPRIÉTÉ', k);
      ligne(ctx, 'Un produit de facteurs est nul si et seulement si', 142, 270, { size: 30, w: 500, align: 'left', a: k }); ligne(ctx, 'l’un au moins de ses facteurs est nul.', 142, 312, { size: 30, w: 500, align: 'left', a: k });
      formule(ctx, 'p_prop', 510, 395, { fs: 36, mil: 1, a: ap(t, P.formule), monte: 1 });
      formule(ctx, 'p_n1', 1230, 250, { fs: 52, mil: 1, a: ap(t, P.nuls[0]), monte: 1 }); formule(ctx, 'p_n2', 1600, 250, { fs: 52, mil: 1, a: ap(t, P.nuls[1]), monte: 1 });
      ligne(ctx, 'C’est une propriété du nombre $0$, et de lui seul :', 142, 560, { size: 34, w: 500, align: 'left', a: ap(t, P.douze[0] - 0.4) });
      let x = 1040; ['p_12a', 'p_12b', 'p_12c', 'p_12d'].forEach((id, i) => { formule(ctx, id, x, 540, { fs: 40, mil: 1, align: 'left', a: ap(t, P.douze[i]), monte: 1 }); x += largeur(id, 40) + 14; });
      ligne(ctx, 'Un produit égal à $12$ ne dit rien de ses facteurs.', PX, 650, { size: 30, w: 500, c: C.encre2, a: ap(t, P.douze[3] + 0.3) });
      ctx.restore(); }
    a = fen(t, L(50) + 0.1, L(58) - 0.1, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const xa = 560, xb = 1360;
      formule(ctx, 'p_e', CX, 215, { fs: 62, mil: 1, a: ap(t, P.ex), monte: 1 });
      branches(ctx, CX, 268, xa, xb, 350, doux(pr(t, P.branches, 0.8))); txt(ctx, 'ou', CX, 412, { size: 46, w: 700, it: true, c: C.cours, a: ap(t, P.branches + 0.5) });
      formule(ctx, 'p_a1', xa, 400, { fs: 46, mil: 1, a: ap(t, P.ga[0]), monte: 1 }); formule(ctx, 'p_a2', xa, 490, { fs: 46, mil: 1, a: ap(t, P.ga[1]), monte: 1 });
      let k = ap(t, P.ga[2]); cadre(ctx, xa, 590, 220, 72, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'p_a3', xa, 590, { fs: 48, mil: 1, a: k });
      formule(ctx, 'p_b1', xb, 400, { fs: 46, mil: 1, a: ap(t, P.dr[0]), monte: 1 });
      k = ap(t, P.dr[1]); cadre(ctx, xb, 590, 250, 72, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'p_b3', xb, 590, { fs: 48, mil: 1, a: k });
      const kp = fen(t, P.piege[0], P.piege[1], 0.3); ligne(ctx, 'Développer mènerait à une équation que l’on ne sait pas résoudre en Seconde :', CX, 694, { size: 28, w: 500, c: FAUX, a: kp }); formule(ctx, 'p_dev', CX, 742, { fs: 34, mil: 1, a: kp * ap(t, P.dev) });
      ctx.restore(); }
    a = fen(t, L(58) + 0.1, L(66), 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const xa = 700, xb = 1220;
      formule(ctx, 'q0', CX, 200, { fs: 60, mil: 1, a: ap(t, P.carre[0]), monte: 1 });
      let k = ap(t, P.carre[1]); formule(ctx, 'q1', CX, 300, { fs: 50, mil: 1, a: k, monte: 1 }); ligne(ctx, 'on retranche $9$ aux deux membres', 1180, 310, { size: 27, w: 500, c: C.cours, align: 'left', a: k });
      k = ap(t, P.carre[2]); formule(ctx, 'q2', CX, 400, { fs: 50, mil: 1, a: k, monte: 1 }); ligne(ctx, 'identité remarquable :', 1250, 396, { size: 27, w: 500, c: C.cours, align: 'left', a: k }); formule(ctx, 'ident', 1250, 436, { fs: 26, align: 'left', a: k });
      branches(ctx, CX, 446, xa, xb, 540, doux(pr(t, P.carre[3], 0.8))); txt(ctx, 'ou', CX, 612, { size: 46, w: 700, it: true, c: C.cours, a: ap(t, P.carre[3] + 0.5) });
      [['qa', xa], ['qb', xb]].forEach(([id, x], i) => { const q = ap(t, P.sol[i]); cadre(ctx, x, 600, 250, 76, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: q }); formule(ctx, id, x, 600, { fs: 50, mil: 1, a: q }); });
      ctx.restore(); }
    legende(ctx, t, P.leg[0], ['Une [équation produit] est un produit de facteurs égal à zéro.']);
    legende(ctx, t, P.leg[1], ['Il faut donc toujours se ramener à la forme « $… = 0$ » avant de conclure.']);
    legende(ctx, t, P.leg[2], ['Chaque facteur donne une équation du premier degré ;', 'on les relie par le mot « ou ».']);
    legende(ctx, t, P.leg[3], ['L’équation a donc deux solutions : $3$ et $−5$.']);
    legende(ctx, t, P.leg[4], ['L’erreur à éviter : développer. La forme factorisée est la forme utile.']);
    legende(ctx, t, P.leg[5], ['Pour $x^2 = 9$ : on ramène tout dans un membre, puis on factorise.']);
    legende(ctx, t, P.leg[6], ['L’oubli le plus courant : cette équation a deux solutions, $−3$ et $3$.']);
  }

  // ---------- 6. les équations quotient ----------
  function quotient(ctx, t) {
    const Q = S.quotient; let a = fen(t, L(66) + 0.1, L(74) - 0.1, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a;
      let k = ap(t, Q.def); carte(ctx, 110, 180, 800, 400, 'DÉFINITION', k);
      ligne(ctx, 'Une [équation quotient] est une équation de la forme', 142, 270, { size: 30, w: 500, align: 'left', a: k }); formule(ctx, 'r_def', 510, 350, { fs: 42, mil: 1, a: k });
      ligne(ctx, 'Les valeurs de l’inconnue qui annulent le dénominateur $B$', 142, 450, { size: 30, w: 500, align: 'left', a: k }); ligne(ctx, 'sont les [valeurs interdites] : elles ne peuvent pas', 142, 492, { size: 30, w: 500, align: 'left', a: k }); ligne(ctx, 'être solutions.', 142, 534, { size: 30, w: 500, align: 'left', a: k });
      k = ap(t, Q.prop); carte(ctx, 980, 180, 850, 290, 'PROPRIÉTÉ', k);
      ligne(ctx, 'Un quotient est nul si et seulement si son numérateur', 1012, 270, { size: 30, w: 500, align: 'left', a: k }); ligne(ctx, 'est nul, sans que son dénominateur le soit.', 1012, 312, { size: 30, w: 500, align: 'left', a: k });
      formule(ctx, 'r_prop', 1405, 395, { fs: 36, mil: 1, a: ap(t, Q.prop + 0.6), monte: 1 });
      ligne(ctx, 'Produit nul : $A = 0$ {ou} $B = 0$.', 1012, 560, { size: 36, w: 600, align: 'left', a: ap(t, Q.contraste[0]) }); ligne(ctx, 'Quotient nul : $A = 0$ {et} $B ≠ 0$.', 1012, 630, { size: 36, w: 600, align: 'left', a: ap(t, Q.contraste[1]) });
      ctx.restore(); }
    a = fen(t, L(74) + 0.1, L(82), 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const xt = 720, x1 = 1210, x2 = 1560, fs = 42, etape = (s, y, k) => txt(ctx, s, xt, y + 11, { size: 32, w: 600, align: 'left', a: k });
      formule(ctx, 'r_e', 370, 400, { fs: 68, mil: 1, a: ap(t, Q.ex), monte: 1 });
      ctx.strokeStyle = C.filet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(660, 180); ctx.lineTo(660, 750); ctx.stroke();
      let k = ap(t, Q.e1[0]); etape('1. Valeur interdite', 215, k); formule(ctx, 'r_v1', x1, 215, { fs, mil: 1, a: k, monte: 1 });
      k = ap(t, Q.e1[1]); fleche(ctx, x1 + 130, 215, x1 + 190, 215, { c: C.gl, lw: 3, tp: 10, k }); formule(ctx, 'r_v2', x2, 215, { fs, mil: 1, a: k, monte: 1 }); txt(ctx, 'interdite', x2 + 86, 226, { fam: F.ui, w: 500, size: 26, c: FAUX, align: 'left', a: k });
      k = ap(t, Q.e2[0]); etape('2. Numérateur nul', 350, k); formule(ctx, 'r_n1', x1, 350, { fs, mil: 1, a: k, monte: 1 });
      formule(ctx, 'r_n2', x1 + 60, 430, { fs, mil: 1, a: ap(t, Q.e2[1]), monte: 1 });
      k = ap(t, Q.e2[2]); formule(ctx, 'r_na', x1 - 60, 510, { fs, mil: 1, a: k, monte: 1 }); txt(ctx, 'ou', x1 + 80, 522, { size: 34, w: 700, it: true, c: C.cours, a: k }); formule(ctx, 'r_nb', x1 + 220, 510, { fs, mil: 1, a: k, monte: 1 });
      k = ap(t, Q.e3); etape('3. Comparaison', 640, ap(t, Q.e3 - 0.5));
      if (k > 0) { ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2); ctx.strokeStyle = FAUX; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1 + 150, 524); ctx.lineTo(x1 + 150 + 140 * k, 496); ctx.stroke(); ctx.restore(); }
      ligne(ctx, '$2$ est interdite : rejetée.', x1 - 110, 651, { size: 30, w: 500, c: FAUX, align: 'left', a: k });
      k = ap(t, Q.sol); ligne(ctx, 'Une seule solution :', x1 - 110, 735, { size: 32, w: 600, align: 'left', a: k }); cadre(ctx, x2 - 40, 724, 250, 70, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'r_sol', x2 - 40, 724, { fs: 46, mil: 1, a: k });
      ctx.restore(); }
    legende(ctx, t, Q.leg[0], ['On ne divise jamais par zéro : le dénominateur impose des valeurs interdites.']);
    legende(ctx, t, Q.leg[1], ['Pour un produit nul, « ou » ; pour un quotient nul, « et ».', 'Le dénominateur ne fournit jamais de solution : il en retire.']);
    legende(ctx, t, Q.leg[2], ['D’abord la valeur interdite, ensuite le numérateur.']);
    legende(ctx, t, Q.leg[3], ['Enfin, on compare : cette troisième étape n’est jamais facultative.']);
  }

  // ---------- bilan ----------
  function bilan(ctx, t) {
    const B = S.bilan, a = fen(t, L(82) + 0.2, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const k0 = ap(t, B.titre); txt(ctx, 'Trois réflexes pour résoudre', CX, 222 + (1 - k0) * 20, { size: 62, w: 700, a: k0 });
    const XC = [400, 960, 1520], TX = [['Premier degré : la même opération', 'sur les deux membres.'], ['Produit nul : un facteur est nul,', 'ou bien l’autre.'], ['Quotient nul : le numérateur est nul', 'et le dénominateur ne l’est pas.']];
    B.cartes.forEach((tc, i) => { const k = ap(t, tc); if (k <= 0) return; const cx = XC[i];
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - k) * 24);
      cadre(ctx, cx, 465, 500, 370, { fill: C.surface, stroke: C.filet, lw: 2 });
      if (i === 0) balanceD(ctx, cx, 345, 0.4, 0.03 * Math.sin(t * 1.4), (X, Y) => formule(ctx, 'bl', X, Y - 24, { fs: 26, mil: 1 }), (X, Y) => formule(ctx, 'br', X, Y - 24, { fs: 26, mil: 1 }));
      if (i === 1) { formule(ctx, 'bp', cx, 370, { fs: 50, mil: 1 }); txt(ctx, 'ou', cx, 462, { size: 44, w: 700, it: true, c: C.cours }); }
      if (i === 2) { formule(ctx, 'bq', cx, 365, { fs: 46, mil: 1 }); txt(ctx, 'et', cx, 474, { size: 44, w: 700, it: true, c: C.cours }); }
      txt(ctx, TX[i][0], cx, 560, { size: 29, w: 600 }); txt(ctx, TX[i][1], cx, 602, { size: 29, w: 500, c: C.encre2 });
      ctx.restore(); });
    const kp = ap(t, B.phrase); ligne(ctx, 'Résoudre, c’est trouver {toutes} les solutions.', CX, 745 + (1 - kp) * 20, { size: 58, w: 700, a: kp });
    ctx.restore();
  }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, `${NIVEAU} · CHAPITRE 4`, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 100, w: 800, a: k1 });
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
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]])];
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
    if (ch.x < LU + 28) globalThis.CHIEN.dessiner(ctx, ch);
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
    vocab(ctx, ts); balance(ctx, ts); methode(ctx, ts); cas(ctx, ts); produit(ctx, ts); quotient(ctx, ts); bilan(ctx, ts); fin(ctx, t);
    intertitre(ctx, t);
    jardin(ctx, t);
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
