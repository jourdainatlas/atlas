// LE FILM — « Structures algébriques usuelles », MP, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y montre que 12ℤ + 18ℤ = 6ℤ : sur la droite des entiers, il avance de 18, recule de 12, et s'assoit en 6.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Structures algébriques usuelles', NIVEAU = 'MP', LONG = 'MP · CHAPITRE 1', NB_EXERCICES = 79;

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
    txt(ctx, TITRE, CX, 600 + (1 - k1) * 24, { size: 96, w: 800, a: k1 });
    ligne(ctx, 'Groupes, anneaux et {congruences}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const cell = (ctx, s, x, y, w, h, o = {}) => { const a = o.a ?? 1; if (a <= 0) return; cadre(ctx, x, y, w, h, { fill: o.fill || C.surface, stroke: o.stroke || C.filet, lw: o.lw || 2, r: 8, a }); txt(ctx, s, x, y + (o.size || 28) * 0.36, { fam: F.main, w: 400, size: o.size || 28, c: o.c || C.encre, a }); };

  // ---------- 1. un problème de Sunzi ----------
  function sunzi(ctx, t) { const V = S.sunzi;
    phase(ctx, t, 2, 6, () => { tx(ctx, t, 'Comptés par 3, il en reste 2 ; par 5, il en reste 3 ; par 7, il en reste 2.', CX, 220, V.enonce, { size: 36 }); tx(ctx, t, 'Combien sont-ils ?', CX, 280, V.enonce, { size: 32, c: C.encre2, w: 500 });
      ['s_r1', 's_r2', 's_r3'].forEach((id, i) => fo(ctx, t, id, 480 + i * 480, 420, 44, V.rep)); ['par 3', 'par 5', 'par 7'].forEach((s, i) => tx(ctx, t, s, 480 + i * 480, 360, V.restes[i], { size: 26, c: C.encre2, w: 500 }));
      tx(ctx, t, 'La règle du manuel :', CX, 560, V.regle, { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 's_reg', CX, 640, 46, V.calc); });
    legs(ctx, t, V, [['Un manuel chinois, rédigé entre le troisième et le cinquième siècle, pose ce problème.'], ['Il donne 23, et une règle sans justification : ce chapitre l’explique.']]); }

  // ---------- 2. le groupe Z/nZ et ses générateurs ----------
  const HO = { c: [500, 465], r: 215 }, hp = (k, r = HO.r) => [HO.c[0] + r * Math.sin(k * Math.PI / 6), HO.c[1] - r * Math.cos(k * Math.PI / 6)];
  function etoile(ctx, pas, n, prog, col) { for (let i = 0; i < n; i++) { const k = borne(prog * n - i); if (k > 0) seg(ctx, hp(i * pas), hp((i + 1) * pas), { c: col, lw: 4, k }); } }
  function horloge(ctx, k, marques = {}) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.gl; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(HO.c[0], HO.c[1], HO.r, 0, 6.3); ctx.stroke();
    for (let i = 0; i < 12; i++) { const p = hp(i), q = hp(i, HO.r + 46), m = marques[i]; pt(ctx, p, { c: m || C.gm, r: m ? 11 : 7 }); txt(ctx, String(i), q[0], q[1] + 12, { fam: F.main, w: 400, size: 32, c: m || C.encre }); seg(ctx, [q[0] - 14, q[1] - 16], [q[0] + 14, q[1] - 16], { c: m || C.encre, lw: 2 }); } ctx.restore(); }
  function znz(ctx, t) { const V = S.znz;
    phase(ctx, t, 6, 14, () => { const k5 = pr(t, V.cinq[0], V.cinq[1] - V.cinq[0]), k4 = pr(t, V.quatre[0], V.quatre[1] - V.quatre[0]), a5 = 1 - 0.75 * ap(t, V.quatre[0] - 0.3), M = {};
      if (k4 > 0) [0, 4, 8].forEach((i, j) => { if (k4 * 3 >= j) M[i] = C.orange; });
      ctx.save(); ctx.globalAlpha *= a5; etoile(ctx, 5, 12, k5, C.cours); ctx.restore(); etoile(ctx, 4, 3, k4, C.orange); horloge(ctx, ap(t, V.horloge, 0.8), M);
      fo(ctx, t, 'z_def', 1400, 215, 40, V.def); tx(ctx, t, 'on ajoute 5, encore 5, encore 5…', 1400, 310, V.cinq[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'z_5', 1400, 380, 46, V.v5); tx(ctx, t, 'de 4 en 4', 1400, 470, V.quatre[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'z_4', 1400, 530, 42, V.v4);
      const kp = ap(t, V.prop); cadre(ctx, 1400, 650, 800, 86, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kp }); formule(ctx, 'z_p', 1400, 650, { fs: 36, mil: 1, a: kp }); fo(ctx, t, 'z_g', 1400, 740, 40, V.gens); });
    legs(ctx, t, V, [['Les classes modulo 12 se disposent comme les heures d’une horloge.'], ['En ajoutant 5 indéfiniment, on passe par toutes les classes : 5 est un [générateur].'], ['En ajoutant 4, on tourne en rond sur trois classes seulement.'], ['Tout dépend du PGCD : les générateurs sont les classes des entiers premiers avec 12.']]); }

  // ---------- 3. l'ordre d'un élément ----------
  function ordre(ctx, t) { const V = S.ordre;
    phase(ctx, t, 14, 22, () => { const kd = ap(t, V.def); carte(ctx, 110, 165, 820, 190, 'DÉFINITION', kd); txt(ctx, 'L’ordre de x est le plus petit entier n ⩾ 1 tel que', 520, 246, { fam: F.ui, w: 500, size: 27, a: kd }); formule(ctx, 'o_def', 520, 304, { fs: 44, mil: 1, a: kd });
      [['o_1', 'ordre 3'], ['o_2', 'ordre 4'], ['o_3', 'ordre 12']].forEach(([id, s], i) => { fo(ctx, t, id, 400, 450 + i * 100, 42, V.ex[i]); tx(ctx, t, s, 700, 462 + i * 100, V.ex[i], { c: C.cours, size: 32 }); });
      const kt = ap(t, V.th); carte(ctx, 990, 165, 820, 190, 'THÉORÈME', kt); txt(ctx, 'Dans un groupe fini G,', 1400, 246, { fam: F.ui, w: 500, size: 27, a: kt }); txt(ctx, 'l’ordre de tout élément divise le cardinal de G.', 1400, 296, { fam: F.ui, w: 600, size: 29, a: kt });
      fo(ctx, t, 'o_c', 1400, 460, 60, V.cor); tx(ctx, t, '3, 4 et 12 divisent bien 12', 1400, 540, V.cor, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'o_m', 1400, 660, 40, V.mono); tx(ctx, t, 'un groupe monogène', 1400, 730, V.mono, { size: 26, c: C.encre2, w: 500 }); });
    legs(ctx, t, V, [['L’[ordre] d’un élément est le cardinal du sous-groupe qu’il engendre.'], ['Dans le groupe des classes modulo 12, noté additivement, on compte les additions.'], ['L’ordre divise toujours le cardinal du groupe.'], ['Un groupe engendré par un seul élément est une copie de ℤ, ou d’un ℤ/nℤ.']]); }

  // ---------- 4. les idéaux de Z ----------
  const X4 = (v) => 200 + v * 78, Y4 = 560;
  const posId = (t) => { const V = S.ideaux, k1 = doux(pr(t, V.m1[0], V.m1[1] - V.m1[0])), k2 = doux(pr(t, V.m2[0], V.m2[1] - V.m2[0])), x = lerp(lerp(0, 18, k1), 6, k2), m1 = k1 > 0 && k1 < 1, m2 = k2 > 0 && k2 < 1;
    return { p: [X4(x), Y4], x, k1, k2, marche: m1 || m2, face: m2 || k2 >= 1 ? -1 : 1, assis: k2 >= 1 ? doux(pr(t, V.m2[1], 0.4)) : undefined }; };
  function ideaux(ctx, t) { const V = S.ideaux;
    phase(ctx, t, 22, 26, () => { const kt = ap(t, V.th), c = posId(t); carte(ctx, 110, 165, 760, 150, 'THÉORÈME', kt); txt(ctx, 'Les idéaux de ℤ sont les', 420, 250, { fam: F.ui, w: 600, size: 30, a: kt }); formule(ctx, 'i_n', 680, 238, { fs: 44, mil: 1, a: kt });
      fo(ctx, t, 'i_f', 1400, 240, 54, V.six); axeGradue(ctx, X4, Y4, -1, 20.5, [0, 6, 12, 18], kt); for (let v = 1; v <= 20; v++) if (v % 6) seg(ctx, [X4(v), Y4 - 5], [X4(v), Y4 + 5], { c: C.gl, lw: 2, a: kt });
      if (c.k1 > 0) { seg(ctx, [X4(0), Y4 - 90], [X4(18 * c.k1), Y4 - 90], { c: C.bleu, lw: 6 }); txt(ctx, '+ 18', X4(9), Y4 - 110, { fam: F.ui, w: 600, size: 30, c: C.bleu, a: borne(c.k1 * 3) }); }
      if (c.k2 > 0) { seg(ctx, [X4(18), Y4 - 160], [X4(18 - 12 * c.k2), Y4 - 160], { c: C.orange, lw: 6 }); txt(ctx, '− 12', X4(12), Y4 - 180, { fam: F.ui, w: 600, size: 30, c: C.orange, a: borne(c.k2 * 3) }); }
      pt(ctx, [X4(6), Y4], { c: C.cours, r: 13, a: ap(t, V.six) }); fo(ctx, t, 'i_c', 760, 720, 50, V.six); fo(ctx, t, 'i_p', 1240, 720, 50, V.pgcd); });
    legs(ctx, t, V, [['Un [idéal] de ℤ est l’ensemble des multiples d’un entier.'], ['En combinant 12 et 18, on atteint 6, et rien de plus petit : c’est leur PGCD.']]); }

  // ---------- 5. les inversibles de Z/nZ ----------
  function inversibles(ctx, t) { const V = S.inversibles;
    phase(ctx, t, 26, 34, () => { const kt = ap(t, V.th); carte(ctx, 110, 165, 840, 130, 'THÉORÈME', kt); formule(ctx, 'n_th', 530, 240, { fs: 34, mil: 1, a: kt }); const kc = ap(t, V.corps); carte(ctx, 990, 165, 820, 130, 'COROLLAIRE', kc); formule(ctx, 'n_c', 1400, 240, { fs: 34, mil: 1, a: kc });
      tx(ctx, t, 'L’inverse de 17 modulo 60', 500, 380, V.div[0], { size: 32, c: C.cours }); ['n_d1', 'n_d2', 'n_d3'].forEach((id, i) => fo(ctx, t, id, 500, 460 + i * 80, 42, V.div[i]));
      tx(ctx, t, 'on remonte', 1400, 380, V.rem[0], { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'n_r1', 1400, 460, 42, V.rem[0]); fo(ctx, t, 'n_r2', 1400, 540, 42, V.rem[1]);
      const ki = ap(t, V.inv); cadre(ctx, 1400, 660, 560, 100, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: ki }); formule(ctx, 'n_i', 1400, 660, { fs: 46, mil: 1, a: ki }); fo(ctx, t, 'n_v', 500, 730, 34, V.ver); });
    legs(ctx, t, V, [['Les inversibles de l’anneau sont les générateurs du groupe : même condition.'], ['Quand $n$ est premier, toute classe non nulle est inversible.'], ['Pour calculer un inverse : l’algorithme d’Euclide, puis on remonte les divisions.'], ['La relation de Bézout, lue modulo 60, donne l’inverse.'], ['On vérifie toujours le résultat.']]); }

  // ---------- 6. le théorème chinois, le théorème d'Euler ----------
  function chinois(ctx, t) { const V = S.chinois;
    phase(ctx, t, 34, 40, () => { const kt = ap(t, V.th); carte(ctx, 990, 165, 830, 200, 'THÉORÈME CHINOIS', kt); formule(ctx, 'c_th', 1405, 262, { fs: 32, mil: 1, a: kt }); tx(ctx, t, 'un isomorphisme d’anneaux', 1405, 330, V.th, { size: 24, c: C.encre2, w: 500 });
      const kg = ap(t, V.grille[0] - 0.8), n = 15 * pr(t, V.grille[0], V.grille[1] - V.grille[0]), x0 = 290, y0 = 330, w = 124, h = 104;
      for (let j = 0; j < 5; j++) txt(ctx, String(j), x0 + j * w, y0 - 80, { fam: F.main, w: 400, size: 30, c: C.orange, a: kg }); for (let i = 0; i < 3; i++) txt(ctx, String(i), x0 - 110, y0 + i * h + 10, { fam: F.main, w: 400, size: 30, c: C.bleu, a: kg });
      txt(ctx, 'reste modulo 5', x0 + 2 * w, y0 - 130, { fam: F.ui, w: 500, size: 24, c: C.orange, a: kg }); txt(ctx, 'modulo 3', x0 - 150, y0 + 3 * h + 0, { fam: F.ui, w: 500, size: 24, c: C.bleu, a: kg });
      for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) cell(ctx, '', x0 + j * w, y0 + i * h, w - 10, h - 10, { a: kg }); for (let k = 0; k < 15; k++) { const a = borne(n - k); if (a > 0) cell(ctx, String(k), x0 + (k % 5) * w, y0 + (k % 3) * h, w - 10, h - 10, { a, size: 40, stroke: C.cours, fill: 'rgba(53,202,164,0.14)', lw: 3 }); }
      const kx = ap(t, V.ex); if (kx > 0) cadre(ctx, x0 + 3 * w, y0 + 2 * h, w - 4, h - 4, { stroke: C.orange, fill: 'rgba(0,0,0,0)', lw: 5, r: 10, a: kx });
      fo(ctx, t, 'c_t', 1405, 470, 44, V.grille[0]); tx(ctx, t, 'Chaque case reçoit exactement une classe.', 1405, 585, V.bij, { c: C.cours, size: 32 }); fo(ctx, t, 'c_s', 1405, 680, 34, V.ex); });
    phase(ctx, t, 40, 44, () => { tx(ctx, t, 'D’où viennent 70, 21 et 15 ?', CX, 205, V.dou, { size: 34, c: C.cours });
      [['module 3', 'produit des deux autres : 5 × 7', 'c_a1'], ['module 5', 'produit des deux autres : 3 × 7', 'c_a2'], ['module 7', 'produit des deux autres : 3 × 5', 'c_a3']].forEach(([m, s, id], i) => { const y = 320 + i * 140; tx(ctx, t, m, 300, y + 10, V.a[i], { size: 32 }); tx(ctx, t, s, 300, y + 52, V.a[i], { size: 22, c: C.encre2, w: 500 }); fo(ctx, t, id, 820, y + 18, 42, V.a[i]); });
      fl(ctx, [1075, 338], [1175, 338], { c: C.violet, lw: 3, a: ap(t, V.b[0]) }); tx(ctx, t, 'reste 2 : on multiplie par 2, inverse de 2 modulo 3', 1420, 400, V.b[0], { size: 22, c: C.encre2, w: 500 }); fo(ctx, t, 'c_b1', 1500, 338, 42, V.b[0]);
      tx(ctx, t, 'reste 1 : rien à corriger', 1300, 488, V.b[1], { size: 26, c: C.encre2, w: 500 }); tx(ctx, t, 'reste 1 : rien à corriger', 1300, 628, V.b[2], { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 44, 47, () => { tx(ctx, t, 'Le secret de la règle de Sunzi', CX, 215, V.sun, { size: 34, c: C.cours }); ['c_e1', 'c_e2', 'c_e3'].forEach((id, i) => fo(ctx, t, id, CX, 310 + i * 90, 42, V.e[i])); fo(ctx, t, 'c_x', CX, 650, 44, V.x); });
    phase(ctx, t, 47, 50, () => { fo(ctx, t, 'c_phi', CX, 230, 40, V.phi); const ke = ap(t, V.euler); carte(ctx, 460, 340, 1000, 170, 'THÉORÈME D’EULER', ke); formule(ctx, 'c_eu', CX, 440, { fs: 48, mil: 1, a: ke });
      tx(ctx, t, 'pour n = p premier, le petit théorème de Fermat :', 800, 652, V.fermat, { size: 28, c: C.encre2, w: 500 }); fo(ctx, t, 'c_fe', 1360, 640, 48, V.fermat); });
    legs(ctx, t, V, [['Quand $m$ et $n$ sont premiers entre eux, connaître une classe modulo $mn$,', 'c’est connaître ses deux restes.'], ['Les classes modulo 15 remplissent le tableau en diagonale, sans jamais se rencontrer.'], ['Se donner un reste modulo 3 et un reste modulo 5, c’est désigner une case :', 'ce système de congruences a une seule solution modulo 15.'], ['Pour chaque module, on part du produit des deux autres,', 'puis on le multiplie pour que son reste soit 1.'], ['Le produit 21 a déjà pour reste 1 modulo 5, et le produit 15 a déjà pour reste 1 modulo 7.'], ['Chacun des nombres 70, 21 et 15 a pour reste 1 modulo un seul module,', 'et 0 modulo les deux autres.'], ['On multiplie 70, 21 et 15 par les restes voulus, puis on ajoute :', 'la somme a les trois bons restes.'], ['Dans le groupe des inversibles, l’ordre de chaque élément divise le cardinal.']]); }

  const ACTES_DEF = () => [acte(3, S.ideaux, 2.6, posId)];
  function vignetteFig(ctx) { const s = { c: HO.c.slice(), r: HO.r }; HO.c = [1440, 520]; HO.r = 230; etoile(ctx, 5, 12, 1, C.cours); horloge(ctx, 1, {}); HO.c = s.c; HO.r = s.r; }

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois théorèmes", ["b_g", "b_c", "b_e"], [30, 30, 46], [580, 620, 440], [["Générateurs du groupe,", "inversibles de l’anneau."], ["Le théorème chinois :", "un isomorphisme d’anneaux."], ["Le théorème d’Euler,", "pour a premier avec n."]], "Une seule idée : la partie {engendrée} par un élément."); }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, LONG, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 556 + (1 - k1) * 20, { size: 80, w: 800, a: k1 });
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
    txt(ctx, "Structures", 76, 352, { size: 140, w: 800, align: 'left' }); txt(ctx, "algébriques", 76, 506, { size: 140, w: 800, align: 'left' });
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
    sunzi(ctx, ts); znz(ctx, ts); ordre(ctx, ts); ideaux(ctx, ts); inversibles(ctx, ts); chinois(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
