// LE FILM — « Calcul littéral », Seconde, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y arpente le côté a + b du carré que l'on découpe, puis il parcourt la droite graduée en sautant les deux valeurs interdites.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Calcul littéral', NIVEAU = 'SECONDE', LONG = 'SECONDE · CHAPITRE 2', NB_EXERCICES = 35;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 124, w: 800, a: k1 });
    ligne(ctx, 'Développer, {factoriser}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  // ---------- raccourcis d'écriture des scènes ----------
  const phase = (ctx, t, m0, m1, f) => { const k = fen(t, L(m0) + 0.1, L(m1), 0.4); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; f(k); ctx.restore(); } };
  const legs = (ctx, t, V, T) => T.forEach((l, i) => legende(ctx, t, V.leg[i], l, l.length > 1 ? { size: 40 } : {}));
  const fo = (ctx, t, id, x, y, fs, t0, o = {}) => formule(ctx, id, x, y, { fs, mil: 1, a: ap(t, t0), monte: 1, ...o });
  const tx = (ctx, t, s, x, y, t0, o = {}) => txt(ctx, s, x, y, { fam: F.ui, w: 600, size: 30, a: ap(t, t0), ...o });
  // Un acte du chien : il bondit sous l'écran (V.bond), retombe du haut (V.chute) sur la figure au point pos(V.chute[1]).p,
  // y joue (pos(t) : { p, an, marche, assis, tete, face, pose }), puis redescend au jardin 1,4 s avant la fin de la partie k.
  function acte(k, V, ech, pos, tSortie) { const tX = tSortie ?? S.CH[k].t1 - 1.4, p0 = pos(V.chute[1]).p, pf = pos(tX).p, xS = pf[0] + 60;
    return { en: [V.bond + 0.2, tX + 1.55], trajet: [tX + 1.55, tX + 2.45, xS / SC, DS[k]],
      joue(ctx, t) { if (bond(ctx, t, V.bond, DS[k] * SC, V.chute[0]) || chute(ctx, t, V.chute[0], V.chute[1], p0[0], p0[1], ech) || t < V.chute[1]) return;
        if (t >= tX) return void sautJardin(ctx, t, tX, pf[0], pf[1], ech, xS);
        const c = pos(t), u = t - V.chute[1];
        K.chienSur(ctx, c.p[0], c.p[1] - 2, c.an || 0, ech, { ...(u < 0.35 ? K.poseChoc(t, u) : c.pose ? c.pose : c.marche ? trot(t, c.p[0] * 1.25, ech) : c.assis !== undefined ? assisP(t, c.assis, c.tete ?? -0.15) : { t, tete: c.tete || 0 }), face: c.face || 1 }); } }; }
  // droite graduée : y en pixels, X(valeur) ; ticks : valeurs chiffrées
  function axeGradue(ctx, X, y, a, b, ticks, k = 1, o = {}) { if (k <= 0) return; seg(ctx, [X(a), y], [X(b), y], { c: C.gm, lw: 3, k }); const kk = borne(k * 2 - 1);
    for (const v of ticks) { seg(ctx, [X(v), y - 9], [X(v), y + 9], { c: C.gm, lw: 3, a: kk }); if (!o.muet) txt(ctx, K.fr(v, 0), X(v), y + 44, { fam: F.main, w: 400, size: o.size || 28, c: C.encre3, a: kk }); } }

  const teinte = (c, a) => { const n = parseInt(c.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const rect = (ctx, x, y, w, h, c, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = teinte(c, 0.22); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); ctx.restore(); };

  // ---------- 1. une expression littérale ----------
  function expression(ctx, t) { const V = S.expression;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 560, 165, 800, 150, 'DÉFINITION', kd); formule(ctx, 'e_A', CX, 250, { fs: 52, mil: 1, a: kd });
      fo(ctx, t, 'e_4', CX, 400, 42, V.v4); fo(ctx, t, 'e_m', CX, 500, 42, V.vm);
      fo(ctx, t, 'e_s', 600, 640, 46, V.nat[0]); tx(ctx, t, 'une somme', 600, 715, V.nat[0], { c: C.cours }); fo(ctx, t, 'e_p', 1320, 640, 46, V.nat[1]); tx(ctx, t, 'un produit', 1320, 715, V.nat[1], { c: C.cours }); });
    legs(ctx, t, V, [['Une [expression littérale] contient des lettres, qui représentent des nombres.'], ['On calcule sa valeur en remplaçant $x$ par un nombre :', 'un nombre négatif se met entre parenthèses.'], ['La dernière opération à effectuer dit si l’expression est une somme ou un produit.']]); }

  // ---------- 2. développer ----------
  function developper(ctx, t) { const V = S.developper;
    phase(ctx, t, 6, 10, () => { const kp = ap(t, V.prop); carte(ctx, 260, 165, 1400, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'd_s', 620, 250, { fs: 42, mil: 1, a: kp }); formule(ctx, 'd_d', 1250, 250, { fs: 42, mil: 1, a: kp });
      const x0 = 330, y0 = 390, wa = 300, wb = 190, hd = 140, hc = 200, K4 = V.rect.map((u) => ap(t, u));        // d en haut, c en bas, comme sur la figure du cours
      rect(ctx, x0, y0 + hd, wa, hc, C.bleu, K4[0]); rect(ctx, x0, y0, wa, hd, C.bleu, K4[1]); rect(ctx, x0 + wa, y0 + hd, wb, hc, C.orange, K4[2]); rect(ctx, x0 + wa, y0, wb, hd, C.orange, K4[3]);
      [['r_ac', x0 + wa / 2, y0 + hd + hc / 2], ['r_ad', x0 + wa / 2, y0 + hd / 2], ['r_bc', x0 + wa + wb / 2, y0 + hd + hc / 2], ['r_bd', x0 + wa + wb / 2, y0 + hd / 2]].forEach(([id, x, y], i) => formule(ctx, id, x, y, { fs: 40, mil: 1, a: K4[i] }));
      const kl = ap(t, V.rect[0] - 0.6); formule(ctx, 'l_a', x0 + wa / 2, y0 + hd + hc + 36, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_b', x0 + wa + wb / 2, y0 + hd + hc + 36, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_c', x0 - 34, y0 + hd + hc / 2, { fs: 38, mil: 1, a: kl }); formule(ctx, 'l_d', x0 - 34, y0 + hd / 2, { fs: 38, mil: 1, a: kl });
      tx(ctx, t, 'aire du grand rectangle', 1330, 450, V.rect[0] - 0.6, { c: C.encre2, w: 500, size: 28 }); tx(ctx, t, '(a + b)(c + d)', 1330, 510, V.rect[0] - 0.6, { size: 44, fam: F.main, w: 400 });
      tx(ctx, t, 'somme des quatre aires', 1330, 610, V.aire, { c: C.encre2, w: 500, size: 28 }); tx(ctx, t, 'ac + ad + bc + bd', 1330, 670, V.aire, { size: 44, fam: F.main, w: 400, c: C.cours }); });
    phase(ctx, t, 10, 14, () => { fo(ctx, t, 'd_A', CX, 230, 44, V.A); const w = largeur('d_B1', 44), x = CX - (w + largeur('d_B2', 44) + 16) / 2; formule(ctx, 'd_B1', x, 370, { fs: 44, mil: 1, align: 'left', a: ap(t, V.B1), monte: 1 }); formule(ctx, 'd_B2', x + w + 16, 370, { fs: 44, mil: 1, align: 'left', a: ap(t, V.B2), monte: 1 });
      const kp = ap(t, V.piege); carte(ctx, 460, 500, 1000, 190, 'PIÈGE', kp); formule(ctx, 'd_m', 800, 610, { fs: 46, mil: 1, a: kp }); tx(ctx, t, 'et non', 1090, 620, V.faux, { c: C.encre2, w: 500 }); fo(ctx, t, 'd_f', 1240, 610, 46, V.faux); });
    legs(ctx, t, V, [['Développer, c’est transformer un produit en somme : on distribue.'], ['La [double distributivité] se lit sur des aires : le rectangle se découpe en quatre.'], ['La simple distributivité : le facteur 5 multiplie chaque terme.'], ['La double : chaque terme de la première parenthèse multiplie chaque terme de la seconde.'], ['Un signe moins devant une parenthèse change le signe de tous ses termes.']]); }

  // ---------- 3. les identités remarquables ----------
  const CA = { x: 250, y: 300, a: 250, b: 160, ech: 2.5 };
  const posCarre = (t) => { const V = S.identites, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { p: [CA.x + (CA.a + CA.b) * k, CA.y], k, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figCarre(ctx, K3, kc, av) { const { x, y, a, b } = CA, c = a + b; ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = C.gm; ctx.lineWidth = 3; ctx.strokeRect(x, y, c, c); ctx.restore();
    rect(ctx, x, y + b, a, a, C.bleu, K3[0]); formule(ctx, 'i_a2', x + a / 2, y + b + a / 2, { fs: 44, mil: 1, a: K3[0] });
    rect(ctx, x, y, a, b, VIOLET, K3[1]); formule(ctx, 'i_ab', x + a / 2, y + b / 2, { fs: 40, mil: 1, a: K3[1] }); rect(ctx, x + a, y + b, b, a, VIOLET, K3[1]); formule(ctx, 'i_ab', x + a + b / 2, y + b + a / 2, { fs: 40, mil: 1, a: K3[1] });
    rect(ctx, x + a, y, b, b, C.orange, K3[2]); formule(ctx, 'i_b2', x + a + b / 2, y + b / 2, { fs: 44, mil: 1, a: K3[2] });
    seg(ctx, [x, y - 6], [x + c, y - 6], { c: C.cours, lw: 6, k: av, a: kc });
    formule(ctx, 'l_a', x + a / 2, y + c + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_b', x + a + b / 2, y + c + 36, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_b', x - 34, y + b / 2, { fs: 38, mil: 1, a: kc }); formule(ctx, 'l_a', x - 34, y + b + a / 2, { fs: 38, mil: 1, a: kc }); }
  function identites(ctx, t) { const V = S.identites;
    phase(ctx, t, 14, 18, () => { figCarre(ctx, V.aires.map((u) => ap(t, u)), ap(t, V.carre), t > V.marche[0] ? posCarre(t).k : 0);
      tx(ctx, t, 'un carré de côté a + b', 1330, 300, V.carre, { c: C.encre2, w: 500 }); tx(ctx, t, 'un carré, deux rectangles, un carré', 1330, 420, V.aires[2], { size: 32 }); fo(ctx, t, 'i_1', 1330, 570, 50, V.f1); });
    phase(ctx, t, 18, 22, () => { const kt = ap(t, V.tab); carte(ctx, 160, 165, 1600, 150, 'PROPRIÉTÉ', kt); ['i_1', 'i_2', 'i_3'].forEach((id, i) => formule(ctx, id, 440 + i * 520, 250, { fs: 30, mil: 1, a: kt }));
      const w = largeur('i_E1', 42), x = CX - (w + largeur('i_E2', 42) + 16) / 2; formule(ctx, 'i_E1', x, 410, { fs: 42, mil: 1, align: 'left', a: ap(t, V.E[0]), monte: 1 }); formule(ctx, 'i_E2', x + w + 16, 410, { fs: 42, mil: 1, align: 'left', a: ap(t, V.E[1]), monte: 1 });
      tx(ctx, t, 'le carré porte sur 3x tout entier :', 800, 522, V.att, { c: C.encre2, w: 500, size: 28 }); fo(ctx, t, 'i_att', 1180, 510, 40, V.att);
      const w2 = largeur('i_m1', 44), x2 = CX - (w2 + largeur('i_m2', 44) + 16) / 2; formule(ctx, 'i_m1', x2, 660, { fs: 44, mil: 1, align: 'left', a: ap(t, V.mental[0]), monte: 1 }); formule(ctx, 'i_m2', x2 + w2 + 16, 660, { fs: 44, mil: 1, align: 'left', a: ap(t, V.mental[1]), monte: 1 }); });
    legs(ctx, t, V, [['Un carré dont le côté mesure $a$ plus $b$.'], ['Il se découpe en un carré de côté $a$, un carré de côté $b$', 'et deux rectangles de côtés $a$ et $b$.'], ['Les deux rectangles donnent le double produit : c’est la première [identité remarquable].'], ['Les trois identités remarquables se démontrent par la double distributivité.'], ['Dans chaque calcul, on commence par repérer ce qui joue le rôle de $a$ et celui de $b$.'], ['Elles servent aussi à calculer de tête.']]); }

  // ---------- 4. factoriser : le facteur commun ----------
  function commun(ctx, t) { const V = S.commun;
    phase(ctx, t, 22, 26, () => { const kd = ap(t, V.def); carte(ctx, 410, 165, 1100, 190, 'DÉFINITION', kd); txt(ctx, 'Factoriser, c’est transformer une somme en produit.', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); formule(ctx, 'f_p', CX, 308, { fs: 40, mil: 1, a: kd });
      fo(ctx, t, 'f_A', CX, 440, 44, V.A); fo(ctx, t, 'f_C', CX, 550, 42, V.C);
      const w = largeur('f_D1', 42), x = CX - (w + largeur('f_D2', 42) + 16) / 2; formule(ctx, 'f_D1', x, 660, { fs: 42, mil: 1, align: 'left', a: ap(t, V.D[0]), monte: 1 }); formule(ctx, 'f_D2', x + w + 16, 660, { fs: 42, mil: 1, align: 'left', a: ap(t, V.D[1]), monte: 1 }); });
    legs(ctx, t, V, [['[Factoriser] : on met en évidence le [facteur commun] à tous les termes.'], ['Le facteur commun peut être une expression entière, ici $x$ plus 2.'], ['Quand un terme est le facteur commun lui-même, il reste 1 : on ne l’oublie pas.']]); }

  // ---------- 5. factoriser : les identités remarquables ----------
  function identfact(ctx, t) { const V = S.identfact;
    phase(ctx, t, 26, 30, () => { const kt = ap(t, V.tab); carte(ctx, 160, 165, 1600, 150, 'PROPRIÉTÉ', kt); ['g_1', 'g_2', 'g_3'].forEach((id, i) => formule(ctx, id, 440 + i * 520, 250, { fs: 30, mil: 1, a: kt }));
      fo(ctx, t, 'g_E', CX, 400, 44, V.E); fo(ctx, t, 'g_G', CX, 500, 40, V.G);
      const kn = ap(t, V.non); formule(ctx, 'g_n', 560, 620, { fs: 44, mil: 1, a: kn }); txt(ctx, 'ne se factorise pas', 830, 632, { fam: F.ui, w: 600, size: 30, c: C.orange, a: kn }); fo(ctx, t, 'g_I', 1350, 620, 40, V.I); });
    phase(ctx, t, 30, 34, () => { const kp = ap(t, V.prop); carte(ctx, 460, 165, 1000, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'p_p', CX, 250, { fs: 46, mil: 1, a: kp });
      [['p_1a', 'p_1b', V.e1, 440], ['p_2a', 'p_2b', V.e2, 620]].forEach(([i1, i2, T2, y]) => { const w = largeur(i1, 42), x = CX - (w + largeur(i2, 42) + 16) / 2; formule(ctx, i1, x, y, { fs: 42, mil: 1, align: 'left', a: ap(t, T2[0]), monte: 1 }); formule(ctx, i2, x + w + 16, y, { fs: 42, mil: 1, align: 'left', a: ap(t, T2[1]), monte: 1 }); }); });
    legs(ctx, t, V, [['Lues de droite à gauche, les identités remarquables factorisent.'], ['On reconnaît deux carrés, puis on vérifie le double produit.'], ['Une somme de deux carrés ne se factorise pas ;', 'un facteur commun peut cacher une différence de deux carrés.'], ['Un produit est nul quand l’un de ses facteurs est nul, et seulement dans ce cas.'], ['Pour résoudre une équation, on factorise : chaque facteur donne une solution.']]); }

  // ---------- 6. les expressions rationnelles ----------
  const AX = { y: 660, X: (v) => 960 + 140 * v, ech: 2.4 }, INT = [-3, 3];
  const posAxe = (t) => { const V = S.rationnelles, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-5, 5, k); let h = 0, u = -1; for (const z of INT) if (Math.abs(x - z) < 0.5) { u = (x - z + 0.5); h = 80 * 4 * u * (1 - u); }
    return { p: [AX.X(x), AX.y - h], x, marche: k > 0 && k < 1 && u < 0, pose: u >= 0 && k < 1 ? { t, allure: 'vol', vol: Math.min(1, u * 5), tang: 0.3 * (1 - 2 * u) } : undefined, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function rationnelles(ctx, t) { const V = S.rationnelles;
    phase(ctx, t, 34, 39, () => { const kd = ap(t, V.def); carte(ctx, 360, 165, 1200, 170, 'DÉFINITION', kd); txt(ctx, 'Les valeurs interdites d’un quotient', CX, 250, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'sont celles qui annulent son dénominateur.', CX, 294, { fam: F.ui, w: 600, size: 30, a: kd });
      fo(ctx, t, 'q_Q', 420, 420, 46, V.Q); fo(ctx, t, 'q_z', 1220, 420, 38, V.zero);
      const ka = ap(t, V.axe, 0.8), xa = t > V.marche[0] ? posAxe(t).x : -5; axeGradue(ctx, AX.X, AX.y, -5.4, 5.4, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], ka);
      [[-5, -3], [-3, 3], [3, 5]].forEach(([u, w]) => { if (xa > u) seg(ctx, [AX.X(u), AX.y], [AX.X(Math.min(xa, w)), AX.y], { c: C.cours, lw: 7 }); });
      for (const z of INT) { pt(ctx, [AX.X(z), AX.y], { c: C.orange, r: 12, creux: 1, a: ka }); txt(ctx, 'valeur interdite', AX.X(z), AX.y + 92, { fam: F.ui, w: 500, size: 24, c: C.orange, a: ka }); } });
    phase(ctx, t, 39, 43, () => { fo(ctx, t, 'q_R', 470, 300, 46, V.R); fo(ctx, t, 'q_Rf', 960, 300, 46, V.fact); fo(ctx, t, 'q_Rr', 1400, 300, 50, V.res); tx(ctx, t, 'pour x ≠ −2', 1660, 312, V.res, { c: C.encre2, w: 500, size: 28 });
      const ke = ap(t, V.err); carte(ctx, 360, 480, 1200, 230, 'PIÈGE', ke); formule(ctx, 'q_e', 640, 610, { fs: 46, mil: 1, a: ke }); fo(ctx, t, 'q_t', 1180, 610, 40, V.test); });
    phase(ctx, t, 43, 46, () => { fo(ctx, t, 'q_S', 480, 400, 48, V.S); fo(ctx, t, 'q_S2', 1010, 400, 44, V.dc); fo(ctx, t, 'q_S3', 1540, 400, 48, V.som); tx(ctx, t, 'pour x ≠ 0 et x ≠ −1', CX, 580, V.S, { c: C.encre2, w: 500, size: 28 }); });
    legs(ctx, t, V, [['Une [expression rationnelle] est un quotient : son dénominateur ne doit pas s’annuler.'], ['Pour trouver les [valeurs interdites], on factorise le dénominateur.'], ['L’expression $Q$ est définie partout, sauf en −3 et en 3.'], ['Pour simplifier, on factorise le numérateur et le dénominateur…'], ['… puis on supprime le facteur commun, ici $x$ plus 2.'], ['On ne simplifie que des facteurs, jamais les termes d’une somme.'], ['Pour ajouter deux quotients, il faut d’abord un dénominateur commun.'], ['Ici, c’est le produit des deux dénominateurs.']]); }

  const ACTES_DEF = () => [acte(2, S.identites, CA.ech, posCarre, S.identites.sortie), acte(5, S.rationnelles, AX.ech, posAxe, S.rationnelles.sortie)];
  function vignetteFig(ctx) { const s = { ...CA }; Object.assign(CA, { x: 1130, y: 330, a: 280, b: 180 }); figCarre(ctx, [1, 1, 1], 1, 1); K.chienSur(ctx, CA.x + 330, CA.y - 8, 0, 3.6, { t: 0.4, assis: 1, tete: -0.1 }); Object.assign(CA, s); formule(ctx, 'b_1', 500, 720, { fs: 54, mil: 1 }); }
  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois réflexes", ["b_1", "b_2", "b_3"], [38, 38, 34], [560, 560, 600], [["Le carré d’une somme :", "ne pas oublier le double produit."], ["Une différence de deux carrés", "se factorise toujours."], ["Le produit nul :", "la raison d’être de la factorisation."]], "Développer et factoriser : {deux lectures} d’une même égalité."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
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
  // Le chien joue les scènes décrites par ACTES_DEF (scenes.js) : il bondit sous l'écran, retombe du haut sur la figure,
  // y tient son rôle, puis redescend au jardin d'un saut presque vertical et regagne sa place au trot.
  const ACTES = ACTES_DEF(), EN_SCENE = ACTES.map((a) => a.en), T1 = S.CH.map((c) => c.t1);
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => [a + 0.15, b + 0.15, DS[k], DS[k + 1]]), ...ACTES.map((a) => a.trajet)].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) { for (const a of ACTES) a.joue(ctx, t); }
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
  // plus 100 s). Le titre, la figure de vignetteFig (scenes.js), le jardin planté.
  let VIGNETTE = false;
  function vignette(ctx) {
    K.logo(ctx, 128, 126, 104);
    txt(ctx, LONG, 212, 140, { fam: F.mono, w: 500, size: 38, ls: 7, c: C.encre2, align: 'left' });
    txt(ctx, "Calcul", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "littéral", 76, 506, { size: 150, w: 800, align: 'left' });
    vignetteFig(ctx);
    VIGNETTE = true; jardin(ctx, S.fin.t0 - 0.3); VIGNETTE = false;
  }

  function draw(ctx, t) {
    ctx.fillStyle = C.papier; ctx.fillRect(0, 0, W, H);
    if (t > S.DURATION + 100) return vignette(ctx);
    // Pendant un intertitre, une fois le voile fermé, les scènes sont dessinées à l'instant où la partie suivante
    // commence : la précédente a alors tout à fait disparu et ne peut pas reparaître quand le voile se rouvre.
    let ts = t; for (const it of S.intertitres) { const u = t - it.t; if (u > 1 && u < S.INTER) ts = it.t + S.INTER; }
    ouverture(ctx, ts); entete(ctx, ts);
    expression(ctx, ts); developper(ctx, ts); identites(ctx, ts); commun(ctx, ts); identfact(ctx, ts); rationnelles(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
