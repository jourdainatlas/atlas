// LE FILM — « Le second degré », Première spécialité, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le chien y descend la parabole jusqu'à son sommet, puis il parcourt l'axe des abscisses pour lire le signe du trinôme.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const VRAI = C.activites, FAUX = C.orange, PX = 1400;
  const TITRE = 'Le second degré', NIVEAU = 'PREMIÈRE SPÉCIALITÉ', LONG = 'PREMIÈRE SPÉCIALITÉ · CHAPITRE 1', NB_EXERCICES = 29;

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
    ligne(ctx, 'Une parabole, un {discriminant}', CX, 690 + (1 - k2) * 18, { size: 46, w: 500, c: C.encre2, a: k2 });
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

  const f2 = (x) => 3 * x * x - 2 * x - 5, g2 = (x) => 2 * x * x - x - 1;
  // petite parabole schématique : y = a x² + dy dans un cadre centré en (cx, cy)
  function para(ctx, cx, cy, a, dy, k, o = {}) { if (k <= 0) return; const w = o.w || 150, u = 60; ctx.save(); ctx.globalAlpha *= k; seg(ctx, [cx - w, cy], [cx + w, cy], { c: C.gm, lw: 2.5 });
    ctx.strokeStyle = C.bleu; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = -40; i <= 40; i++) { const x = i / 40 * 1.9, y = a * x * x + dy; if (i === -40) ctx.moveTo(cx + x * u, cy - y * u); else ctx.lineTo(cx + x * u, cy - y * u); } ctx.stroke();
    for (const r of o.racines || []) pt(ctx, [cx + r * u, cy], { c: C.cours, r: 9 }); if (o.sommet) pt(ctx, [cx, cy - dy * u], { c: C.cours, r: 10 }); ctx.restore(); }

  // ---------- 1. la fonction trinôme ----------
  function trinome(ctx, t) { const V = S.trinome;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); formule(ctx, 't_def', CX, 250, { fs: 52, mil: 1, a: kd });
      const kh = ap(t, V.haut, 0.7), kb = ap(t, V.bas, 0.7), ks = ap(t, V.sommet); para(ctx, 600, 640, 0.8, -2.2, kh, { sommet: ks > 0 }); para(ctx, 1320, 470, -0.8, 2.2, kb, { sommet: ks > 0 });
      formule(ctx, 't_ap', 600, 400, { fs: 44, mil: 1, a: kh }); formule(ctx, 't_an', 1320, 700, { fs: 44, mil: 1, a: kb }); });
    legs(ctx, t, V, [['Un [trinôme] du second degré a pour courbe une [parabole].'], ['Tournée vers le haut ou vers le bas selon le signe de $a$, elle a un [sommet].']]); }

  // ---------- 2. la forme canonique ----------
  const R2 = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -2, x1: 3, y0: -6.6, y1: 4 });
  const posSommet = (t) => { const V = S.canonique, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])), x = lerp(1.6, 1 / 3, k), m = t > V.marche[0] && t < V.marche[1];
    return { p: XY(R2, x, f2(x)), an: m ? borne(Math.atan(-(6 * x - 2) * R2.ky / R2.kx), -0.8, 0.8) : 0, marche: m, face: -1, assis: t >= V.marche[1] ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figF(ctx, k, kr = 0) { K.axes(ctx, R2, k, { gx: [-1, 1, 2], gy: [-4, -2, 2] }); K.courbe(ctx, R2, f2, -1.42, lerp(-1.42, 2.1, k)); K.point(ctx, R2, -1, 0, { k: kr, r: 10, c: C.cours }); K.point(ctx, R2, 5 / 3, 0, { k: kr, r: 10, c: C.cours }); }
  function canonique(ctx, t) { const V = S.canonique;
    phase(ctx, t, 6, 11, () => { const kt = ap(t, V.th); carte(ctx, 210, 165, 1500, 180, 'PROPRIÉTÉ', kt); formule(ctx, 'k_th', CX, 265, { fs: 44, mil: 1, a: kt });
      fo(ctx, t, 'k_f', 520, 440, 46, V.f); fo(ctx, t, 'k_d', 1280, 440, 40, V.delta); fo(ctx, t, 'k_a', 520, 580, 44, V.alpha); fo(ctx, t, 'k_b', 1180, 580, 44, V.beta); fo(ctx, t, 'k_c', CX, 710, 50, V.forme); });
    phase(ctx, t, 11, 14, () => { figF(ctx, ap(t, V.fig, 0.9)); const km = ap(t, V.min); K.trait(ctx, R2, 1 / 3, 0, 1 / 3, -16 / 3, { c: C.cours, dash: [6, 8], a: km }); formule(ctx, 'l_S', R2.X(1 / 3) + 6, R2.Y(-16 / 3) + 44, { fs: 36, mil: 1, a: km });
      formule(ctx, 'k_c', 1440, 300, { fs: 50, mil: 1 }); tx(ctx, t, 'Le sommet est le point (α ; β).', 1440, 480, V.fig, { size: 34 }); tx(ctx, t, 'Ici a > 0 : β est le minimum de f.', 1440, 600, V.min, { size: 34, c: C.cours }); });
    legs(ctx, t, V, [['Tout trinôme s’écrit sous [forme canonique].'], ['On commence par le [discriminant], que l’on note delta.'], ['Les deux nombres alpha et bêta se calculent à partir des coefficients.'], ['Alpha et bêta sont les coordonnées du sommet de la parabole.'], ['Au sommet, le carré est nul : la fonction atteint son minimum.']]); }

  // ---------- 3. l'équation du second degré ----------
  function equation(ctx, t) { const V = S.equation;
    phase(ctx, t, 14, 18, () => { [[-0.7, 1, [], 'q_1', 'aucune solution'], [0.7, 0, [0], 'q_2', 'une solution'], [0.8, -1.6, [-1.414, 1.414], 'q_3', 'deux solutions']].forEach(([a, dy, r, id, s], i) => { const k = ap(t, V.cas[i], 0.6), cx = 380 + i * 580;
        formule(ctx, id, cx, 200, { fs: 46, mil: 1, a: k }); para(ctx, cx, 400, i ? a : 0.7, i ? dy : 0.8, k, { racines: r }); txt(ctx, s, cx, 575, { fam: F.ui, w: 600, size: 30, c: i ? C.cours : C.orange, a: k }); });
      fo(ctx, t, 'q_x0', 960, 690, 42, V.formules[0]); fo(ctx, t, 'q_x12', 1500, 690, 36, V.formules[1]); });
    phase(ctx, t, 18, 22, () => { figF(ctx, 1, ap(t, V.fig)); formule(ctx, 'l_x1', R2.X(-1) - 30, R2.Y(0) - 30, { fs: 38, mil: 1, a: ap(t, V.fig) }); formule(ctx, 'l_x2', R2.X(5 / 3) + 34, R2.Y(0) - 30, { fs: 38, mil: 1, a: ap(t, V.fig) });
      fo(ctx, t, 'q_e', 1440, 230, 40, V.ex); [['q_a1', 'q_a2', V.x1, 400], ['q_b1', 'q_b2', V.x2, 580]].forEach(([i1, i2, T2, y]) => { const w = largeur(i1, 44), x0 = 1440 - (w + 120) / 2; formule(ctx, i1, x0, y, { fs: 44, mil: 1, align: 'left', a: ap(t, T2[0]), monte: 1 }); formule(ctx, i2, x0 + w + 16, y, { fs: 50, mil: 1, align: 'left', a: ap(t, T2[1]), monte: 1 }); }); });
    legs(ctx, t, V, [['Discriminant négatif : la parabole ne touche pas l’axe, aucune solution réelle.'], ['Discriminant nul : elle le touche en son sommet, une seule solution.'], ['Discriminant positif : elle le coupe deux fois. Les solutions sont les [racines] du trinôme.'], ['Sur l’exemple, le discriminant vaut 64 : il y a deux racines.'], ['Ce sont les abscisses des points où la parabole coupe l’axe.']]); }

  // ---------- 4. somme et produit des racines ----------
  function somme(ctx, t) { const V = S.somme;
    phase(ctx, t, 22, 26, () => { const kp = ap(t, V.prop); carte(ctx, 410, 165, 1100, 180, 'PROPRIÉTÉ', kp); formule(ctx, 's_p', CX, 265, { fs: 50, mil: 1, a: kp });
      fo(ctx, t, 's_e', CX, 450, 50, V.ex); fo(ctx, t, 's_1', CX, 570, 42, V.evid); fo(ctx, t, 's_2', CX, 700, 42, V.autre); });
    legs(ctx, t, V, [['Quand il y a deux racines, leur somme et leur produit se lisent sur les coefficients.'], ['Si une racine est évidente, le produit donne l’autre sans aucun calcul de discriminant.']]); }

  // ---------- 5. factoriser un trinôme ----------
  function facto(ctx, t) { const V = S.facto;
    phase(ctx, t, 26, 34, () => { const kp = ap(t, V.prop); carte(ctx, 410, 165, 1100, 150, 'PROPRIÉTÉ', kp); formule(ctx, 'c_p', CX, 250, { fs: 48, mil: 1, a: kp });
      fo(ctx, t, 'c_1', CX, 400, 44, V.ex1); fo(ctx, t, 'c_2', CX, 510, 44, V.ex2); fo(ctx, t, 'c_0', CX, 630, 44, V.nul);
      const kn = ap(t, V.neg); formule(ctx, 'c_n', 760, 720, { fs: 44, mil: 1, a: kn }); txt(ctx, 'le trinôme ne se factorise pas', 1080, 732, { fam: F.ui, w: 600, size: 32, c: C.orange, a: kn }); });
    legs(ctx, t, V, [['Connaître les racines, c’est savoir [factoriser] le trinôme.'], ['Attention au coefficient $a$, que l’on oublie souvent devant les parenthèses.'], ['Avec une racine double, le trinôme est un carré, au facteur $a$ près.'], ['Sans racine réelle, aucune factorisation en facteurs du premier degré.']]); }

  // ---------- 6. le signe du trinôme ----------
  const R6 = K.repere({ x: 110, y: 170, w: 890, h: 590 }, { x0: -1.6, x1: 2.1, y0: -2.2, y1: 4.6 }), X6 = [-1.4, 1.9];
  const posSigne = (t) => { const V = S.signe, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(X6[0], X6[1], k); return { p: XY(R6, x, 0), x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function signe(ctx, t) { const V = S.signe;
    phase(ctx, t, 34, 46, () => { const kf = ap(t, V.fig, 0.9), { x } = posSigne(t), xa = t > V.marche[0] ? x : X6[0];
      K.dans(ctx, R6, () => { for (let u = X6[0]; u < xa; u += 0.012) { const y = g2(u); ctx.strokeStyle = y >= 0 ? 'rgba(182,202,76,0.30)' : 'rgba(255,162,74,0.30)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(R6.X(u), R6.Y(0)); ctx.lineTo(R6.X(u), R6.Y(y)); ctx.stroke(); } });
      K.axes(ctx, R6, kf, { gx: [-1, 1, 2], gy: [-2, 2, 4] }); K.courbe(ctx, R6, g2, -1.46, lerp(-1.46, 1.96, kf)); K.point(ctx, R6, -0.5, 0, { k: kf, r: 10, c: C.cours }); K.point(ctx, R6, 1, 0, { k: kf, r: 10, c: C.cours }); formule(ctx, 'g_f', R6.X(0.78), R6.Y(4.1), { fs: 40, mil: 1, a: kf });
      phase(ctx, t, 34, 42, () => { const km = fen(t, V.marche[0] - 0.3, V.sortie, 0.3), y = g2(x); if (km > 0) { txt(ctx, `x = ${K.fr(x, 2)}`, 1300, 300, { fam: F.ui, w: 600, size: 44, a: km }); txt(ctx, `f(x) = ${K.fr(y, 2)}`, 1300, 400, { fam: F.ui, w: 600, size: 44, c: y >= 0 ? VRAI : C.orange, a: km }); txt(ctx, y >= 0 ? 'positif' : 'négatif', 1660, 400, { fam: F.ui, w: 600, size: 36, c: y >= 0 ? VRAI : C.orange, a: km }); }
        const kp = ap(t, V.prop); carte(ctx, 1060, 520, 800, 170, 'PROPRIÉTÉ', kp); txt(ctx, 'f(x) est du signe de a', 1460, 606, { fam: F.ui, w: 600, size: 32, a: kp }); txt(ctx, 'à l’extérieur des racines.', 1460, 652, { fam: F.ui, w: 600, size: 32, c: C.cours, a: kp }); });
      phase(ctx, t, 42, 46, () => { const kt = ap(t, V.tab), X = [1080, 1200, 1340, 1480, 1620, 1760, 1860], y1 = 250, y2 = 350; ctx.save(); ctx.globalAlpha *= kt; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(1040, 200, 860, 200); ctx.beginPath(); ctx.moveTo(1040, 300); ctx.lineTo(1900, 300); ctx.moveTo(1140, 200); ctx.lineTo(1140, 400); ctx.stroke(); ctx.restore();
        [['g_x', 1090, y1], ['g_fx', 1090, y2], ['g_mi', 1200, y1], ['g_r1', 1400, y1], ['g_r2', 1640, y1], ['g_pi', 1850, y1], ['g_p', 1290, y2], ['g_0', 1400, y2], ['g_m', 1520, y2], ['g_0', 1640, y2], ['g_p', 1760, y2]].forEach(([id, x, y]) => formule(ctx, id, x, y, { fs: 38, mil: 1, a: kt }));
        fo(ctx, t, 'g_in', 1470, 520, 48, V.ineq); fo(ctx, t, 'g_S', 1470, 660, 44, V.sol); }); });
    legs(ctx, t, V, [['Une parabole tournée vers le haut, deux racines.'], ['Le point d’abscisse $x$ avance : le signe de $f(x)$ change à chaque racine.'], ['Positif, négatif, positif : le signe de $a$ revient à l’extérieur des racines.'], ['Le tableau de signes résume la figure.'], ['Il donne aussitôt les solutions d’une inéquation.']]); }

  const ACTES_DEF = () => [acte(1, S.canonique, 3.0, posSommet), acte(5, S.signe, 2.8, posSigne, S.signe.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1040, y: 230, w: 800, h: 560 }, { x0: -1.6, x1: 2.3, y0: -6.2, y1: 4.2 }); seg(ctx, XY(Rv, -1.6, 0), XY(Rv, 2.3, 0), { c: C.gm, lw: 4 }); K.courbe(ctx, Rv, f2, -1.45, 2.12, { lw: 9 });
    const p = XY(Rv, 1 / 3, -16 / 3); pt(ctx, XY(Rv, -1, 0), { c: C.cours, r: 13 }); pt(ctx, XY(Rv, 5 / 3, 0), { c: C.cours, r: 13 }); K.chienSur(ctx, p[0], p[1] - 4, 0, 4.6, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_d', 500, 700, { fs: 84, mil: 1 }); }

  // ---------- bilan ----------
  function bilan(ctx, t) { bilanCartes(ctx, t, "Trois formules", ["b_d", "b_x", "b_f"], [46, 46, 42], [500, 560, 560], [["Le discriminant :", "son signe donne le nombre de racines."], ["Les racines,", "quand le discriminant est positif."], ["La forme factorisée,", "d’où l’on tire le signe."]], "Le trinôme est du signe de $a$ {à l’extérieur des racines}."); }

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
    txt(ctx, "Le second", 76, 352, { size: 150, w: 800, align: 'left' }); txt(ctx, "degré", 76, 506, { size: 150, w: 800, align: 'left' });
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
    trinome(ctx, ts); canonique(ctx, ts); equation(ctx, ts); somme(ctx, ts); facto(ctx, ts); signe(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
