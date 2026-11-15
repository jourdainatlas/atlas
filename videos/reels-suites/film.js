// LE FILM — « Nombres réels et suites numériques », MPSI, 1920 × 1080. Chaque image est une fonction pure de t.
// Les instants viennent de score.js, les outils de commun.js (copié de videos/derivation), les formules de formules.js.
// Le fil conducteur est celui du cours : tout découle de l'axiome de la borne supérieure, à commencer par le
// théorème de la limite monotone, que Dedekind ne savait pas démontrer en 1858.
(function () {
  const S = globalThis.SCORE, K = globalThis.K, G = globalThis.G, Studio = globalThis.Studio;
  const { W, H, CX, borne, doux, ressort, pr, sortie, lerp, ap, fen, alea, fr, C, RUBC, F, txt, ligne, legende, formule, largeur, cadre, repere, dans, axes, trait, point, fleche, SC, SOLPX, LU, BEC } = K;
  const L = S.L;
  const TITRE = 'Nombres réels et suites numériques', COURT = 'NOMBRES RÉELS ET SUITES', NIVEAU = 'MPSI', CHAPITRE = 7, NB_EXERCICES = 54;
  // Code des couleurs : les éléments d'une partie en vert, les majorants en orange, la borne supérieure et l'axiome
  // en rouge (définition, axiome), les termes d'une suite en bleu, ε en orange ou violet, le rang N en turquoise.
  const VERT = C.activites;

  // carte de définition ou d'axiome (filet rouge, comme sur le site), de théorème ou de propriété (filet turquoise)
  function carte(ctx, x, y, w, h, genre, a) {
    if (a <= 0) return; const c = genre === 'DÉFINITION' || genre === 'AXIOME' ? C.rouge : C.cours;
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fillStyle = C.surface; ctx.fill(); ctx.fillStyle = c; ctx.fillRect(x, y, 5, h);
    txt(ctx, genre, x + 32, y + 42, { fam: F.mono, w: 700, size: 20, ls: 3, c, align: 'left' }); ctx.restore();
  }
  // droite graduée : ech(v) donne l'abscisse en pixels ; k : part tracée
  const echelle = (xa, xb, a, b) => (v) => xa + (v - a) / (b - a) * (xb - xa);
  function droiteR(ctx, xa, xb, y, k = 1, o = {}) {
    if (k <= 0) return; const xe = lerp(xa, xb, k); ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.strokeStyle = ctx.fillStyle = o.c || C.encre3; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xe, y); ctx.stroke(); if (!o.sansFleche) { ctx.beginPath(); ctx.moveTo(xe + 14, y); ctx.lineTo(xe - 3, y - 8); ctx.lineTo(xe - 3, y + 8); ctx.fill(); } ctx.restore();
  }
  function grad(ctx, x, y, s, o = {}) {
    const a = o.a ?? 1; if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = o.c || C.encre3; ctx.lineWidth = o.lw || 3; ctx.lineCap = 'round'; const h = o.h || 9; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y + h); ctx.stroke(); ctx.restore();
    if (s) ligne(ctx, s, x, y + (o.dy || 44), { size: o.size || 28, w: 500, c: o.c || C.encre3, a });
  }
  // pastille : pleine, ou creuse (le point n'appartient pas à la partie)
  function pastille(ctx, x, y, c, k = 1, o = {}) {
    if (k <= 0) return; const r = (o.r || 9) * ressort(borne(k)); ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.3); ctx.fillStyle = o.creux ? C.papier : c; ctx.fill(); ctx.strokeStyle = o.creux ? c : C.papier; ctx.lineWidth = o.creux ? 3.5 : 3; ctx.stroke(); ctx.restore();
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
    txt(ctx, `${COURT} · ${NIVEAU}`, 126, 62, { fam: F.mono, w: 500, size: 20, ls: 3, c: C.encre3, align: 'left' });
    for (const [nom, t0, t1] of [...S.CH.map((c) => [c.nom, c.t0, c.t1]), ['En résumé', L(46), L(S.FIN)]]) { const k = fen(t, t0 + 0.1, t1, 0.35); if (k > 0) txt(ctx, nom, 126, 104, { size: 36, w: 600, align: 'left', a: k }); }
    ctx.restore();
  }

  // ---------- ouverture ----------
  function ouverture(ctx, t) {
    const O = S.ouverture, out = 1 - pr(t, L(2) - 0.6, 0.5); if (out <= 0) return;
    ctx.save(); ctx.globalAlpha = out;
    const [l0, l1, l2] = O.logo;
    K.logo(ctx, CX, 290, 200, [pr(t, l0, 0.35), pr(t, l0 + 0.25, 0.4), pr(t, l1, 0.35), pr(t, l1 + 0.25, 0.5), pr(t, l2, 0.35)], sortie(pr(t, l0 - 0.3, 0.4)));
    const k1 = ap(t, O.titre), k2 = ap(t, O.sous);
    txt(ctx, `${NIVEAU} · CHAPITRE ${CHAPITRE}`, CX, 468, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, 'Nombres réels', CX, 568 + (1 - k1) * 24, { size: 100, w: 800, a: k1 }); txt(ctx, 'et suites numériques', CX, 668 + (1 - k1) * 24, { size: 100, w: 800, a: k1 });
    ligne(ctx, 'Tout part d’un seul {axiome}', CX, 748 + (1 - k2) * 18, { size: 44, w: 500, c: C.encre2, a: k2 });
    ctx.restore();
  }

  // ---------- 1. un théorème sans démonstration ----------
  function trou(ctx, t) {
    const Tr = S.trou; let a = fen(t, L(2) + 0.1, L(4) - 0.1, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a;
      let k = ap(t, L(2) + 0.4); txt(ctx, 'ZURICH, AUTOMNE 1858', CX, 250, { fam: F.mono, w: 500, size: 26, ls: 5, c: C.encre3, a: k });
      k = ap(t, Tr.enonce); txt(ctx, 'L’énoncé que tout le monde admet :', CX, 340, { size: 34, w: 500, c: C.encre2, a: k });
      txt(ctx, 'une suite croissante et majorée a une limite.', CX, 430 + (1 - k) * 18, { size: 60, w: 700, a: k });
      k = ap(t, Tr.question); txt(ctx, 'Sa démonstration :', CX - 40, 560, { size: 40, w: 500, c: C.encre2, a: k }); txt(ctx, '?', CX + 190, 572 , { size: 96, w: 800, c: C.orange, a: k });
      ctx.restore(); }
    a = fen(t, L(4) + 0.1, L(6), 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const X = echelle(240, 1680, 0.95, 1.55), y = 470, V = [1, 1.4, 1.41, 1.414], NOM = ['1', '1,4', '1,41', '1,414'];
      { const k = ap(t, L(4) + 0.2), titre = 'Les valeurs décimales approchées par défaut de'; ctx.save(); ctx.font = `700 40px ${F.titre}`; const wt = ctx.measureText(titre).width; ctx.restore();
        txt(ctx, titre, 240, 215, { size: 40, w: 700, align: 'left', a: k }); formule(ctx, 'racine', 240 + wt + 16, 215, { fs: 40, align: 'left', a: k }); }
      droiteR(ctx, 180, 1720, y, doux(pr(t, Tr.droite[0], Tr.droite[1] - Tr.droite[0])));
      for (const v of [1, 1.1, 1.2, 1.3, 1.4, 1.5]) grad(ctx, X(v), y, v === 1 || v === 1.5 ? '' : `$${fr(v, 1)}$`, { a: ap(t, Tr.droite[1]) * (v === 1.4 ? 0 : 1) });
      V.forEach((v, i) => { const k = ap(t, Tr.points[i], 0.3); if (k <= 0) return; const yy = 400 - i * 46, dx = [0, -70, -24, 40][i];
        ctx.save(); ctx.globalAlpha *= k * 0.7; ctx.strokeStyle = VERT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(v), y - 12); ctx.lineTo(X(v) + dx, yy + 10); ctx.stroke(); ctx.restore();
        ligne(ctx, `$${NOM[i]}$`, X(v) + dx, yy, { size: 32, c: VERT, a: k }); pastille(ctx, X(v), y, VERT, k, { r: 8 }); });
      let k = ap(t, Tr.majorant); grad(ctx, X(1.5), y, '', { c: C.orange, a: k, h: 16, lw: 4 }); ligne(ctx, 'majorant : $1,5$', X(1.5), y - 34, { size: 30, w: 500, c: C.orange, a: k });
      k = ap(t, Tr.racine); pastille(ctx, X(Math.SQRT2), y, C.encre, k, { creux: 1, r: 11 }); formule(ctx, 'racine_q', X(Math.SQRT2), y + 86, { fs: 40, mil: 1, a: k });
      ligne(ctx, 'la limite attendue manque', X(Math.SQRT2), y + 150, { size: 28, w: 500, c: C.encre2, a: k });
      ctx.restore(); }
    legende(ctx, t, Tr.leg[0], ['Dedekind doit l’enseigner à ses élèves… et constate qu’il ne peut que', 'l’admettre : rien, dans les rationnels, ne permet de le démontrer.'], { size: 40 });
    legende(ctx, t, Tr.leg[1], ['Les nombres $1$ ; $1,4$ ; $1,41$ ; $1,414$… forment une suite croissante de rationnels, majorée par $1,5$.', 'Elle n’a pourtant aucune limite rationnelle : chez les rationnels, l’énoncé est faux.'], { size: 38 });
  }

  // ---------- 2. la borne supérieure ----------
  function sup(ctx, t) {
    const Su = S.sup, a = fen(t, L(6) + 0.1, L(14), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; const X = echelle(260, 1660, -0.3, 2.7), y = 290;
    droiteR(ctx, 200, 1720, y, doux(pr(t, Su.droite[0], Su.droite[1] - Su.droite[0])));
    for (const v of [0, 1, 2]) grad(ctx, X(v), y, `$${v}$`, { a: ap(t, Su.droite[1]) });
    // la partie A = [0 ; 1[, en vert ; les majorants, en orange
    let k = ap(t, Su.A); ctx.save(); ctx.globalAlpha *= Math.min(1, k * 2); ctx.strokeStyle = VERT; ctx.lineWidth = 9; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(X(0), y); ctx.lineTo(lerp(X(0), X(1), k), y); ctx.stroke(); ctx.restore();
    formule(ctx, 'A01', X(0.22), y - 44, { fs: 34, mil: 1, a: k });
    const km = ap(t, Su.majorants); ctx.save(); ctx.globalAlpha *= Math.min(1, km * 2); ctx.strokeStyle = C.orange; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(X(1), y); ctx.lineTo(lerp(X(1), 1700, km), y); ctx.stroke(); ctx.restore();
    ligne(ctx, 'les majorants de $A$', X(2.15), y - 34, { size: 30, w: 500, c: C.orange, a: km });
    pastille(ctx, X(0), y, VERT, k, { r: 10 });
    k = ap(t, Su.M) * (1 - 0.6 * ap(t, Su.sup)); pastille(ctx, X(1.8), y, C.orange, k, { r: 10 }); formule(ctx, 'M', X(1.8), y - 78, { fs: 34, mil: 1, a: k }); ligne(ctx, 'un majorant', X(1.8), y + 86, { size: 26, w: 500, c: C.orange, a: k * (1 - km) });
    const ks = ap(t, Su.sup); pastille(ctx, X(1), y, C.rouge, Math.max(ks, ap(t, Su.A)), { creux: 1, r: 11 });
    formule(ctx, 'supA', X(1) + 30, y - 106, { fs: 38, mil: 1, a: ks }); ligne(ctx, '$1$ n’appartient pas à $A$', X(1) + 30, y - 152, { size: 26, w: 500, c: C.encre2, a: ap(t, Su.piege) });
    // la caractérisation : tout intervalle ]sup A − ε ; sup A] contient un élément de A
    const ke = fen(t, Su.eps[0], L(12) - 0.2, 0.4), e = lerp(0.6, 0.12, doux(pr(t, Su.eps[0] + 0.8, Su.eps[1] - Su.eps[0] - 0.8)));
    if (ke > 0) { ctx.save(); ctx.globalAlpha *= ke; ctx.strokeStyle = C.violet; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; const xa = X(1 - e), xb = X(1), yb = y + 96;
      ctx.beginPath(); ctx.moveTo(xa, yb - 12); ctx.lineTo(xa, yb); ctx.lineTo(xb, yb); ctx.lineTo(xb, yb - 12); ctx.stroke(); formule(ctx, 'eps', (xa + xb) / 2, yb + 30, { fs: 32, mil: 1 });
      const xa2 = X(1 - e / 2);                              // l'élément a de A : le chien vient s'y poser (voir acteur)
      pastille(ctx, xa2, y, VERT, 1, { r: 7 }); formule(ctx, 'a', xa2, y + 60, { fs: 30, mil: 1 }); ctx.restore(); }
    // la définition, la caractérisation, l'axiome
    k = ap(t, Su.def); carte(ctx, 110, 450, 800, 150, 'DÉFINITION', k);
    ligne(ctx, 'La [borne supérieure] de $A$, notée sup $A$, est le plus petit', 142, 532, { size: 28, w: 500, align: 'left', a: k }); ligne(ctx, 'des majorants de $A$, s’il existe.', 142, 570, { size: 28, w: 500, align: 'left', a: k });
    k = ap(t, Su.car[0]); ligne(ctx, '$M$ est la borne supérieure de $A$ si et seulement si :', 142, 652, { size: 26, w: 500, c: C.encre2, align: 'left', a: k });
    formule(ctx, 'sup_c1', 142, 708, { fs: 28, mil: 1, align: 'left', a: k, monte: 1 }); txt(ctx, 'et', 142 + largeur('sup_c1', 28) + 34, 717, { size: 26, w: 500, c: C.encre2, a: ap(t, Su.car[1]) });
    formule(ctx, 'sup_c2', 142 + largeur('sup_c1', 28) + 68, 708, { fs: 28, mil: 1, align: 'left', a: ap(t, Su.car[1]), monte: 1 });
    k = ap(t, Su.axiome); carte(ctx, 1000, 450, 820, 170, 'AXIOME', k);
    ligne(ctx, 'Toute partie de $ℝ$ non vide et majorée', 1032, 540, { size: 34, w: 600, align: 'left', a: k }); ligne(ctx, 'admet une borne supérieure.', 1032, 586, { size: 34, w: 600, align: 'left', a: k });
    k = ap(t, Su.faux); ligne(ctx, 'Il est faux dans $ℚ$ : la partie des rationnels de carré inférieur', 1032, 672, { size: 26, w: 500, c: C.encre2, align: 'left', a: k }); ligne(ctx, 'à $2$ y est majorée, sans borne supérieure rationnelle.', 1032, 708, { size: 26, w: 500, c: C.encre2, align: 'left', a: k });
    ctx.restore();
    legende(ctx, t, Su.leg[0], ['Un [majorant] d’une partie $A$ est un réel supérieur ou égal à tous ses éléments.']);
    legende(ctx, t, Su.leg[1], ['Le plus petit des majorants est la borne supérieure.', 'L’erreur la plus répandue est de croire qu’elle appartient à la partie.'], { size: 40 });
    legende(ctx, t, Su.leg[2], ['C’est un majorant que l’on approche d’aussi près que l’on veut', 'par des éléments de $A$.']);
    legende(ctx, t, Su.leg[3], ['On ne construit pas $ℝ$ : on admet cet axiome, et tout le chapitre en découle.']);
  }

  // ---------- 3. premières conséquences ----------
  function conseq(ctx, t) {
    const Co = S.conseq; let a = fen(t, L(14) + 0.1, L(16) - 0.1, 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const X = echelle(300, 1560, 0, 8), y = 400, xv = 6.4;
      let k = ap(t, Co.arch); txt(ctx, 'Propriété d’Archimède', 240, 215, { size: 40, w: 700, align: 'left', a: k }); formule(ctx, 'arch', 1290, 205, { fs: 34, mil: 1, a: k });
      droiteR(ctx, 240, 1640, y, doux(pr(t, Co.arch, 0.8))); grad(ctx, X(0), y, '$0$', { a: k }); grad(ctx, X(xv), y, '', { c: C.orange, a: k, h: 16, lw: 4 }); formule(ctx, 'x', X(xv), y + 50, { fs: 34, mil: 1, a: k });
      Co.sauts.forEach((ts, i) => { const q = doux(pr(t, ts, 0.3)); if (q <= 0) return; const xa = X(i), xb = X(i + 1), der = i === 6;
        ctx.save(); ctx.strokeStyle = der ? C.cours : C.bleu; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xa, y - 6);
        for (let s = 0; s <= Math.min(1, (t - ts) / 0.25) + 1e-9; s += 0.05) ctx.lineTo(lerp(xa, xb, s), y - 6 - Math.sin(Math.PI * s) * 70); ctx.stroke(); ctx.restore();
        if (q >= 1) { pastille(ctx, xb, y, der ? C.cours : C.bleu, ap(t, ts + 0.3, 0.25), { r: 7 }); if (i < 2) ligne(ctx, i ? '$2a$' : '$a$', xb, y + 44, { size: 28, c: C.bleu, a: ap(t, ts + 0.3) }); if (der) formule(ctx, 'na', xb, y + 50, { fs: 34, mil: 1, a: ap(t, ts + 0.3) }); } });
      ['Sinon, la partie des $na$ serait majorée par $x$ : l’axiome lui donnerait une borne supérieure $M$.', 'Or $M − a$ n’est pas un majorant : un certain $na$ le dépasse, donc $(n + 1)a > M$.', 'C’est absurde, puisque $(n + 1)a$ appartient à la partie que $M$ majore.']
        .forEach((s, i) => ligne(ctx, s, CX, 570 + i * 54, { size: 31, w: 500, c: i === 2 ? C.encre : C.encre2, a: ap(t, Co.preuve[i]) }));
      ctx.restore(); }
    a = fen(t, L(16) + 0.1, L(18), 0.4);
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; const X = echelle(300, 1620, 0.285, 0.405), y = 420, va = 0.313, vb = 0.347;
      let k = ap(t, Co.dens); txt(ctx, 'Densité des décimaux', 240, 215, { size: 40, w: 700, align: 'left', a: k });
      droiteR(ctx, 240, 1680, y, doux(pr(t, Co.dens, 0.8))); grad(ctx, X(0.3), y, '$0,3$', { a: k, h: 14 }); grad(ctx, X(0.4), y, '$0,4$', { a: k, h: 14 });
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.orange; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(X(va), y); ctx.lineTo(X(vb), y); ctx.stroke(); ctx.restore();
      pastille(ctx, X(va), y, C.orange, k, { creux: 1, r: 10 }); pastille(ctx, X(vb), y, C.orange, k, { creux: 1, r: 10 }); formule(ctx, 'la', X(va), y - 50, { fs: 34, mil: 1, a: k }); formule(ctx, 'lb', X(vb), y - 50, { fs: 34, mil: 1, a: k });
      k = ap(t, Co.centiemes); for (let i = 31; i < 40; i++) grad(ctx, X(i / 100), y, i === 32 ? '' : `$${fr(i / 100, 2)}$`, { a: k, h: 7, size: 20, dy: 36 });
      formule(ctx, 'dens_n', 1290, 205, { fs: 34, mil: 1, a: k });
      k = ap(t, Co.d); pastille(ctx, X(0.32), y, C.cours, k, { r: 11 }); ligne(ctx, '$d = 0,32$', X(0.32), y + 62, { size: 32, c: C.cours, a: k }); formule(ctx, 'dens', CX, 590, { fs: 40, mil: 1, a: k, monte: 1 });
      ligne(ctx, 'Tout intervalle ouvert non vide contient un décimal, donc un rationnel ; il contient aussi un irrationnel.', CX, 690, { size: 30, w: 500, c: C.encre2, a: ap(t, Co.suite) });
      ctx.restore(); }
    legende(ctx, t, Co.leg[0], ['Première conséquence : à force d’ajouter $a$, on finit par dépasser tout réel $x$.']);
    legende(ctx, t, Co.leg[1], ['On en tire la densité : dès que $10^{-n}$ est plus petit que $b − a$,'.replace('$10^{-n}$', 'le pas des graduations'), 'l’une d’elles tombe entre $a$ et $b$.']);
  }

  // ---------- 4. la limite d'une suite ----------
  const RL = repere({ x: 110, y: 160, w: 1000, h: 590 }, { x0: -1, x1: 31, y0: 0.6, y1: 3.7 });
  const uL = (n) => 2 + (n % 2 ? -1 : 1) * 3 / (n + 2);
  function limite(ctx, t) {
    const Li = S.limite, a = fen(t, L(18) + 0.1, L(26), 0.4); if (a <= 0) return;
    let e = 0.4; for (const [t0, t1, ea, eb] of Li.serre) { const k = doux(pr(t, t0, t1 - t0)); if (k > 0) e = lerp(ea, eb, k); }
    const N = Math.max(0, Math.ceil(3 / e - 2 - 1e-9)), kb = ap(t, Li.bande), kN = ap(t, Li.N), R = RL;
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, R, pr(t, L(18) + 0.1, 0.8), { gx: [5, 10, 15, 20, 25, 30], gy: [1, 2, 3] }); formule(ctx, 'n', R.b.x + R.b.w + 4, R.Y(0.6) - 26, { fs: 26, a: ap(t, L(18) + 0.8) });
    if (kb > 0) dans(ctx, R, () => { ctx.globalAlpha *= kb; ctx.fillStyle = 'rgba(255,162,74,0.16)'; ctx.fillRect(R.X(-1), R.Y(2 + e), R.b.w, R.Y(2 - e) - R.Y(2 + e));
      ctx.strokeStyle = C.orange; ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); for (const v of [2 + e, 2 - e]) { ctx.beginPath(); ctx.moveTo(R.b.x, R.Y(v)); ctx.lineTo(R.b.x + R.b.w, R.Y(v)); ctx.stroke(); } });
    const kl = ap(t, Li.ell); trait(ctx, R, -1, 2, lerp(-1, 31, kl), 2, { c: C.encre2, dash: [3, 7], a: kl });
    formule(ctx, 'ell', R.b.x + R.b.w + 14, R.Y(2) + 9, { fs: 28, align: 'left', a: kl }); formule(ctx, 'ellp', R.b.x + R.b.w + 14, R.Y(2 + e) + 2, { fs: 22, align: 'left', a: kb * borne((e - 0.14) / 0.05) }); formule(ctx, 'ellm', R.b.x + R.b.w + 14, R.Y(2 - e) + 16, { fs: 22, align: 'left', a: kb * borne((e - 0.14) / 0.05) });
    if (kN > 0) { trait(ctx, R, N, 0.6, N, 3.7, { c: C.cours, dash: [8, 8], a: kN, lw: 3 }); ligne(ctx, '$N$', R.X(N) + (N > 24 ? -26 : 26), R.b.y + 34, { size: 32, c: C.cours, a: kN }); }
    const [p0, p1] = Li.points;
    for (let n = 0; n <= 30; n++) { const k = ap(t, p0 + n / 30 * (p1 - p0), 0.3); point(ctx, R, n, uL(n), { c: C.bleu, k, r: 7, a: kN > 0 && n < N ? lerp(1, 0.35, kN) : 1 }); }
    // à droite : la suite, la définition, les valeurs de ε et de N
    const xp = 1515; formule(ctx, 'suite_u', xp, 215, { fs: 32, mil: 1, a: ap(t, L(18) + 0.4), monte: 1 });
    let k = ap(t, Li.def); carte(ctx, 1195, 290, 650, 200, 'DÉFINITION', k); ligne(ctx, 'La suite [converge] vers le réel $ℓ$ si :', 1227, 372, { size: 28, w: 500, align: 'left', a: k }); formule(ctx, 'lim_def', xp, 435, { fs: 25, mil: 1, a: k });
    ligne(ctx, `$ε = ${fr(e, 2)}$`, 1370, 580, { size: 46, c: C.orange, a: kb }); ligne(ctx, `$N = ${N}$`, 1680, 580, { size: 46, c: C.cours, a: kN });
    ligne(ctx, 'Théorème : une suite a au plus une limite.', xp, 690, { size: 29, w: 500, c: C.encre2, a: ap(t, Li.unicite) });
    ctx.restore();
    legende(ctx, t, Li.leg[0], ['Les termes de cette suite oscillent autour de $2$, de plus en plus près.']);
    legende(ctx, t, Li.leg[1], ['Converger vers $ℓ$ : quelle que soit la bande de demi-largeur $ε$ autour de $ℓ$,', 'tous les termes y sont à partir d’un certain rang $N$.'], { size: 40 });
    legende(ctx, t, Li.leg[2], ['Si l’on rétrécit la bande, il faut aller plus loin : le rang $N$ dépend de $ε$.']);
    legende(ctx, t, Li.leg[3], ['C’est ce que dit l’ordre des quantificateurs : pour tout $ε$, il existe $N$.']);
  }

  // ---------- 5. le théorème de la limite monotone ----------
  const RM = repere({ x: 110, y: 160, w: 900, h: 590 }, { x0: 0, x1: 12.9, y0: 0.86, y1: 2.14 });
  const SOM = [0]; for (let n = 1; n <= 12; n++) SOM.push(SOM[n - 1] + 1 / (n * n));
  function monotone(ctx, t) {
    const Mo = S.monotone, a = fen(t, L(26) + 0.1, L(34), 0.4); if (a <= 0) return;
    const R = RM, ell = Math.PI * Math.PI / 6, e = 0.12, Nn = 8;
    ctx.save(); ctx.globalAlpha = a;
    axes(ctx, R, pr(t, L(26) + 0.1, 0.8), { gx: [2, 4, 6, 8, 10, 12], gy: [1, 1.5, 2], sansO: 1, muetY: 1 });
    for (const v of [1, 1.5, 2]) ligne(ctx, `$${fr(v, v === 1.5 ? 1 : 0)}$`, R.b.x - 30, R.Y(v) + 9, { size: 26, c: C.encre3, a: ap(t, L(26) + 0.6) });
    let k = ap(t, Mo.majorant); trait(ctx, R, 0, 2, lerp(0, 12.9, k), 2, { c: C.orange, dash: [10, 8], a: k, lw: 3 }); ligne(ctx, 'majorant $2$', R.X(10.6), R.Y(2) - 16, { size: 28, w: 500, c: C.orange, a: k });
    const kb = ap(t, Mo.bande); if (kb > 0) dans(ctx, R, () => { ctx.globalAlpha *= kb; ctx.fillStyle = 'rgba(199,147,230,0.16)'; ctx.fillRect(R.b.x, R.Y(ell), R.b.w, R.Y(ell - e) - R.Y(ell)); ctx.strokeStyle = C.violet; ctx.lineWidth = 2.5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(R.b.x, R.Y(ell - e)); ctx.lineTo(R.b.x + R.b.w, R.Y(ell - e)); ctx.stroke(); });
    formule(ctx, 'mono_ellm', R.X(1.3), R.Y(ell - e) + 34, { fs: 26, a: kb });
    k = ap(t, Mo.sup); trait(ctx, R, 0, ell, lerp(0, 12.9, k), ell, { c: C.rouge, dash: [10, 8], a: k, lw: 3 }); formule(ctx, 'mono_sup', R.X(2.6), R.Y(ell) - 18, { fs: 28, a: k });
    ligne(ctx, 'sa valeur, $π^2/6$, ne sera établie qu’au chapitre 20', R.X(6.6), R.Y(ell) - 60, { size: 23, w: 500, c: C.encre3, a: ap(t, Mo.note) });
    const [p0, p1] = Mo.points, ks = ap(t, Mo.suivants), ku = ap(t, Mo.uN);
    for (let n = 1; n <= 12; n++) { const q = ap(t, p0 + (n - 1) / 11 * (p1 - p0), 0.3); point(ctx, R, n, SOM[n], { c: n === Nn && ku > 0 ? C.cours : n > Nn && ks > 0 ? C.cours : C.bleu, k: q, r: n === Nn && ku > 0 ? 11 : 8 }); }
    formule(ctx, 'mono_uN', R.X(Nn), R.Y(SOM[Nn]) + 52, { fs: 30, a: ku });
    // à droite : la suite, le théorème, la démonstration
    const x0 = 1085, xp = 1465; formule(ctx, 'mono_u', xp, 205, { fs: 28, mil: 1, a: ap(t, L(26) + 0.4), monte: 1 });
    k = ap(t, Mo.th); carte(ctx, x0, 262, 760, 200, 'THÉORÈME', k); ligne(ctx, 'Toute suite réelle croissante et majorée converge,', x0 + 32, 340, { size: 28, w: 500, align: 'left', a: k }); ligne(ctx, 'et sa limite est sa borne supérieure :', x0 + 32, 378, { size: 28, w: 500, align: 'left', a: k }); formule(ctx, 'mono_th', xp, 428, { fs: 24, mil: 1, a: k });
    const pl = (s, y, tk, c) => ligne(ctx, s, x0 + 10, y, { size: 27, w: 500, align: 'left', a: ap(t, tk), c });
    pl('La partie des $u_n$ est non vide et majorée :', 520, Mo.p1); pl('par l’[axiome], elle a une borne supérieure $ℓ$.', 556, Mo.p1);
    pl('Soit $ε > 0$. Le réel $ℓ − ε$ n’est pas un majorant :', 612, Mo.p2); pl('un terme $u_N$ le dépasse.', 648, Mo.p2);
    pl('La suite est croissante, donc pour tout $n ⩾ N$ :', 704, Mo.p3); k = ap(t, Mo.formule); cadre(ctx, xp, 750, largeur('mono_pr', 30) + 60, 58, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: k }); formule(ctx, 'mono_pr', xp, 750, { fs: 30, mil: 1, a: k });
    ctx.restore();
    legende(ctx, t, Mo.leg[0], ['Revenons au théorème de Dedekind. Ces sommes croissent et restent sous $2$.']);
    legende(ctx, t, Mo.leg[1], ['L’axiome leur donne une borne supérieure $ℓ$ : c’est elle, la limite.']);
    legende(ctx, t, Mo.leg[2], ['Un terme dépasse $ℓ − ε$ ; les suivants, plus grands encore, restent sous $ℓ$.']);
    legende(ctx, t, Mo.leg[3], ['Trois lignes de démonstration, mais tout repose sur la borne supérieure.']);
  }

  // ---------- 6. suites adjacentes ----------
  const ADJ = (() => { const r = []; let f = 1, u = 1; for (let n = 1; n <= 5; n++) { f *= n; u += 1 / f; r.push([u, u + 1 / (n * f)]); } return r; })();
  function adjacentes(ctx, t) {
    const Ad = S.adjacentes, a = fen(t, L(34) + 0.1, L(38), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; const X = echelle(250, 990, 1.9, 3.1), yl = (n) => 232 + (n - 1) * 86;
    const kl = ap(t, Ad.ell); ctx.save(); ctx.globalAlpha *= kl; ctx.strokeStyle = C.cours; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(X(Math.E), 190); ctx.lineTo(X(Math.E), 660); ctx.stroke(); ctx.restore(); formule(ctx, 'ell', X(Math.E), 172, { fs: 30, a: kl });
    Ad.rangs.forEach((tr, i) => { const k = ap(t, tr, 0.35); if (k <= 0) return; const [u, v] = ADJ[i], y = yl(i + 1);
      ligne(ctx, `$n = ${i + 1}$`, 110, y + 10, { size: 28, c: C.encre3, a: k, align: 'left' });
      ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = C.gl; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(u), y); ctx.lineTo(lerp(X(u), X(v), k), y); ctx.stroke(); ctx.restore();
      pastille(ctx, X(v), y, C.orange, k, { r: 8 }); pastille(ctx, X(u), y, C.bleu, k, { r: 8 });
      if (i < 3) { ctx.save(); ctx.font = `400 25px ${F.main}`; const wu = ctx.measureText(fr(u, i === 0 ? 0 : i === 1 ? 1 : 3)).width; ctx.restore(); ligne(ctx, `$${fr(u, i === 0 ? 0 : i === 1 ? 1 : 3)}$`, X(u) - 16 - wu, y + 9, { size: 24, c: C.bleu, a: k, align: 'left' }); } });
    ADJ.slice(0, 3).forEach(([u, v], i) => { const k = ap(t, Ad.rangs[i], 0.35), y = yl(i + 1); ligne(ctx, `$${fr(v, i === 0 ? 0 : i === 1 ? 2 : 3)}$`, X(v) + 16, y + 9, { size: 24, c: C.orange, a: k, align: 'left' }); });
    formule(ctx, 'un', X(2) - 6, yl(1) + 52, { fs: 28, a: ap(t, Ad.rangs[0]) }); formule(ctx, 'vn', X(3) + 6, yl(1) + 52, { fs: 28, a: ap(t, Ad.rangs[0]) });
    droiteR(ctx, 220, 1010, 668, ap(t, Ad.suites), { sansFleche: 1 }); for (const v of [2, 2.5, 3]) grad(ctx, X(v), 668, `$${fr(v, v === 2.5 ? 1 : 0)}$`, { a: ap(t, Ad.suites), dy: 40, size: 26 });
    const x0 = 1085, xp = 1465; let k = ap(t, Ad.suites); formule(ctx, 'adj_u', x0 + 190, 205, { fs: 26, mil: 1, a: k, monte: 1 }); formule(ctx, 'adj_v', x0 + 570, 205, { fs: 26, mil: 1, a: k, monte: 1 });
    k = ap(t, Ad.def); carte(ctx, x0, 270, 760, 160, 'DÉFINITION', k); ligne(ctx, 'Deux suites sont [adjacentes] si l’une est croissante,', x0 + 32, 348, { size: 28, w: 500, align: 'left', a: k }); ligne(ctx, 'l’autre décroissante, et si leur différence tend vers $0$.', x0 + 32, 386, { size: 28, w: 500, align: 'left', a: k });
    k = ap(t, Ad.th); carte(ctx, x0, 452, 760, 200, 'THÉORÈME', k); ligne(ctx, 'Deux suites adjacentes convergent vers une même', x0 + 32, 530, { size: 28, w: 500, align: 'left', a: k }); ligne(ctx, 'limite $ℓ$, qui les sépare :', x0 + 32, 568, { size: 28, w: 500, align: 'left', a: k }); formule(ctx, 'adj_th', xp, 618, { fs: 28, mil: 1, a: k });
    k = ap(t, Ad.note); ligne(ctx, 'Ici $ℓ = e$ (chapitre 18) ; dès $n = 5$ : $2,7166 ⩽ e ⩽ 2,7184$.', xp, 722, { size: 27, w: 500, c: C.encre2, a: k });
    ctx.restore();
    legende(ctx, t, Ad.leg[0], ['L’une monte, l’autre descend, et l’écart entre elles tend vers $0$.']);
    legende(ctx, t, Ad.leg[1], ['La preuve : la suite croissante est majorée par $v_0$.', 'C’est le théorème de la limite monotone.']);
  }

  // ---------- 7. Bolzano-Weierstrass ----------
  function bw(ctx, t) {
    const Bw = S.bw, a = fen(t, L(38) + 0.1, L(46), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    // les termes de la suite, dont on garde certains sans changer leur ordre
    for (let i = 0; i < 18; i++) { const k = ap(t, Bw.jetons + i * 0.05, 0.3), j = Bw.PHI.indexOf(i), q = j >= 0 ? ap(t, Bw.choisis[j], 0.3) : 0, x = 150 + i * 95, y = 205;
      cadre(ctx, x, y, 70, 56, { fill: q > 0 ? 'rgba(199,147,230,0.22)' : C.surface, stroke: q > 0 ? C.violet : C.filet, lw: q > 0 ? 3 : 2, a: k * (j >= 0 ? 1 : lerp(1, 0.45, ap(t, Bw.choisis[4]))), r: 12 }); formule(ctx, `c${i}`, x, y, { fs: 26, mil: 1, a: k * (j >= 0 ? 1 : lerp(1, 0.45, ap(t, Bw.choisis[4]))) }); }
    let k = ap(t, Bw.th); carte(ctx, 410, 262, 1100, 106, 'THÉORÈME', k); ligne(ctx, 'De toute suite réelle bornée, on peut extraire une suite convergente.', 600, 326, { size: 30, w: 600, align: 'left', a: k });
    // la dichotomie, sur u_n = sin n
    const X = echelle(420, 1500, -1, 1), y = 450; k = ap(t, Bw.droite); droiteR(ctx, 400, 1520, y, k, { sansFleche: 1 });
    for (const v of [-1, 0, 1]) grad(ctx, X(v), y, `$${fr(v, 0)}$`, { a: k, dy: -24, size: 24 });
    formule(ctx, 'sinn', 1660, y, { fs: 30, mil: 1, a: k });
    for (let n = 0; n <= 60; n++) { const q = ap(t, Bw.droite + 0.2 + n * 0.02, 0.3); if (q > 0) { ctx.save(); ctx.globalAlpha *= q * 0.75; ctx.fillStyle = C.bleu; ctx.beginPath(); ctx.arc(X(Math.sin(n)), y, 5, 0, 6.3); ctx.fill(); ctx.restore(); } }
    Bw.etapes.forEach((te, i) => { const q = ap(t, te); if (q <= 0) return; const yy = 512 + i * 50, b = i ? -1 + Math.pow(2, 1 - i) : 1, v = Math.sin(Bw.PHI[i]);
      formule(ctx, `sg${i}`, 300, yy, { fs: 24, mil: 1, a: q });
      ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = C.orange; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X(-1), yy); ctx.lineTo(lerp(X(-1), X(b), q), yy); ctx.stroke(); ctx.restore();
      const q2 = ap(t, te + 0.9); pastille(ctx, X(v), yy, C.violet, q2, { r: 9 }); pastille(ctx, X(v), y, C.violet, q2, { r: 8 }); formule(ctx, `bw${i}`, X(b) + 46, yy, { fs: 26, mil: 1, a: q2 }); });
    ctx.restore();
    legende(ctx, t, Bw.leg[0], ['Une [suite extraite] garde une infinité de termes, sans changer leur ordre.']);
    legende(ctx, t, Bw.leg[1], ['La preuve procède par dichotomie : on coupe le segment en deux,', 'et l’on garde une moitié qui contient une infinité de termes.']);
    legende(ctx, t, Bw.leg[2], ['Dans chaque segment, on choisit un terme d’indice plus grand que le précédent.']);
    legende(ctx, t, Bw.leg[3], ['Les bornes des segments sont adjacentes : pris en étau, les termes extraits convergent.'], { size: 40 });
  }

  // ---------- bilan : l'arbre des résultats, qui pousse depuis l'axiome ----------
  function bilan(ctx, t) {
    const Bi = S.bilan, a = fen(t, L(46) + 0.2, L(S.FIN), 0.4); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ND = [[960, 705, 'Axiome de la borne supérieure', -1, C.rouge], [520, 580, 'Propriété d’Archimède', 0], [520, 455, 'Densité des rationnels', 1], [1400, 580, 'Limite monotone', 0], [1400, 455, 'Suites adjacentes', 3], [1400, 330, 'Bolzano-Weierstrass', 4], [1400, 205, 'Chapitre 8 : bornes atteintes', 5, C.encre3]];
    ND.forEach(([x, y, , p], i) => { if (p < 0) return; const k = doux(pr(t, Bi.noeuds[i] - 0.5, 0.6)); if (k <= 0) return; const [xp, yp] = ND[p];
      ctx.save(); ctx.strokeStyle = C.gm; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.setLineDash(i === 6 ? [6, 10] : [800 * k, 2000]); ctx.globalAlpha *= i === 6 ? k : 1; ctx.beginPath(); ctx.moveTo(xp, yp - 34); ctx.bezierCurveTo(xp, yp - 34 - (yp - y - 68) * 0.6, x, y + 34 + (yp - y - 68) * 0.6, x, y + 34); ctx.stroke(); ctx.restore(); });
    ND.forEach(([x, y, nom, p, c], i) => { const k = ap(t, Bi.noeuds[i]); if (k <= 0) return; ctx.save(); ctx.font = `600 30px ${F.titre}`; const w = ctx.measureText(nom).width + 56; ctx.restore();
      ctx.save(); ctx.translate(0, (1 - k) * 14); cadre(ctx, x, y, w, 64, { fill: C.surface, stroke: c || C.cours, lw: i ? 2.5 : 3.5, a: k }); txt(ctx, nom, x, y + 10, { size: 30, w: 600, a: k, c: i === 6 ? C.encre2 : C.encre }); ctx.restore(); });
    ctx.restore();
    legende(ctx, t, Bi.leg[0], ['Un seul {axiome} ; tout le chapitre en découle.']);
  }

  // ---------- fin : le logo, le titre, le renvoi vers le cours (pas de signature : décision de l'auteur) ----------
  function fin(ctx, t) {
    const Fi = S.fin; if (t < Fi.t0) return;
    K.logo(ctx, CX, 285, 190, [1, 1, 1, 1, 1], sortie(pr(t, Fi.t0, 0.5)));
    const k1 = ap(t, Fi.titre), k2 = ap(t, Fi.adresse);
    txt(ctx, `${NIVEAU} · CHAPITRE ${CHAPITRE}`, CX, 452, { fam: F.mono, w: 500, size: 24, ls: 5, c: C.encre3, a: k1 });
    txt(ctx, TITRE, CX, 552 + (1 - k1) * 20, { size: 84, w: 800, a: k1 });
    ligne(ctx, `Le cours complet et ${NB_EXERCICES} exercices corrigés : {atlasjourdain.fr}`, CX, 650 + (1 - k2) * 16, { size: 42, w: 600, a: k2 });
  }

  // ---------- le jardin du bas ----------
  const NP = S.CH.length, XS = S.CH.map((c, k) => (280 + 210 * k) / SC), STAND = [...XS.map((x) => x - BEC), XS[NP - 1] + 36], DS = [...XS.map((x) => x + 30), XS[NP - 1] + 76], J = S.jardin;
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
  // Le chien est l'acteur des scènes (voir acteur) : chacun de ses déplacements a une raison que l'on voit.
  //  · borne supérieure : il saute sous l'écran, retombe du haut sur l'intervalle A, y marche, puis saute rejoindre
  //    le jardinier ; · Archimède : il sort par la gauche pendant l'intertitre, entre par la gauche de l'axe, fait
  //    les sept sauts, repart par la droite et revient au jardin par la droite.
  const AC = (() => { const Su = S.sup, Co = S.conseq, e0 = Su.eps[0];
    return { tJ: e0 - 1.9, tA: e0 - 0.75, tL: e0 + 0.55, tX: L(12) - 0.8, tIn: Co.arch + 0.1, tE: L(16) - 1.35 }; })();
  const EN_SCENE = [[AC.tJ + 0.2, AC.tX + 1.5]];
  const TRAJETS = [[L(1, 1), L(1, 3.2), DEHORS, DS[0]], ...J.marche.map(([a, b], k) => k === 1 ? [a + 0.15, b + 0.35, DS[1], -45] : [a + 0.15, b + 0.15, DS[k], DS[k + 1]]),
    [L(16) + 0.2, L(16) + 2.3, DEHORS, DS[2]]].sort((u, v) => u[0] - v[0]);
  function acteur(ctx, t) {
    const Su = S.sup, Co = S.conseq, e0 = Su.eps[0], e1 = Su.eps[1], Xs = echelle(260, 1660, -0.3, 2.7), ys = 287, ECH = 3, dsx = DS[1] * SC;
    const { tJ, tA, tL, tX, tIn, tE } = AC;
    // --- la borne supérieure ---
    if (t >= tJ + 0.2 && t < tA) { const u = t - tJ - 0.2, y = SOLPX - 430 * u + 1250 * u * u;                       // petit bond, puis il tombe sous l'écran
      if (y < H + 130) K.chienSur(ctx, dsx, y, 0, SC, u < 0.17 ? { t, face: -1, allure: 'vol', vol: u / 0.17, tang: 0.3 } : { ...K.poseChute(t), face: -1 }); }
    else if (t >= tA && t < tL) { const u = (t - tA) / (tL - tA); K.chienSur(ctx, Xs(0.7), -60 + (ys + 60) * Math.pow(u, 1.6), 0, ECH, K.poseChute(t)); }      // il retombe du haut de l'écran
    else if (t >= tL && t < tX) { const e = lerp(0.6, 0.12, doux(pr(t, e0 + 0.8, e1 - e0 - 0.8))), x = Xs(1 - e / 2), marche = t > e0 + 0.8 && t < e1;
      K.chienSur(ctx, x, ys, 0, ECH, marche ? { t, allure: 'trot', phase: x / ECH * 0.33 } : t < e0 + 0.8 ? K.poseChoc(t, t - tL) : { t, tete: 0.25, queue: { a: -0.35, amp: 0.45, f: 8, courbe: 0.06 } }); }
    else if (t >= tX && t < tX + 1.5) { const u = pr(t, tX + 0.2, 0.8), x = lerp(Xs(0.94), dsx, u), y = lerp(ys, SOLPX, u * u) - 170 * Math.sin(Math.PI * u) * (1 - u), ech = lerp(ECH, SC, u), fin = t - (tX + 1.0);
      K.chienSur(ctx, x, y, 0, ech, u <= 0 ? { t, face: -1, bas: 2.2 * pr(t, tX, 0.2) } : u < 0.3 ? { t, face: -1, allure: 'vol', vol: u / 0.3, tang: 0.35 } : u < 1 ? { ...K.poseChute(t), face: -1 } : { ...K.poseChoc(t, fin), face: -1, assis: doux(pr(fin, 0.15, 0.35)) }); }
    // --- Archimède ---
    const ya = 396, Xa = echelle(300, 1560, 0, 8), DH = 0.25;
    if (t >= tIn && t < tE + 1.15) {
      if (t < Co.sauts[0]) { const k = doux(pr(t, tIn, 0.85)), x = lerp(-90, Xa(0), k); K.chienSur(ctx, x, ya, 0, ECH, k < 1 ? { t, allure: 'trot', phase: x / ECH * 0.33 } : { t, bas: 1.2 }); }
      else if (t < tE) { const i = Co.sauts.findIndex((ts) => t >= ts && t < ts + DH), fait = Co.sauts.filter((ts) => t >= ts + DH).length;
        if (i >= 0) { const u = (t - Co.sauts[i]) / DH; K.chienSur(ctx, lerp(Xa(i), Xa(i + 1), u), ya - 2 - Math.sin(Math.PI * u) * 70, -Math.cos(Math.PI * u) * 0.45, ECH, { t, allure: 'galop', phase: u * Math.PI, oreille: -0.8 * Math.sin(Math.PI * u) }); }
        else K.chienSur(ctx, Xa(fait), ya, 0, ECH, { t, queue: { a: -0.35, amp: fait === 7 ? 0.6 : 0.3, f: 8, courbe: 0.06 } }); }
      else { const u = pr(t, tE, 1.15), x = lerp(Xa(7), W + 150, u * u); K.chienSur(ctx, x, ya, 0, ECH, { t, allure: 'galop', phase: x / ECH * 0.21 }); }
    }
  }
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
    if (ch.x < LU + 28 && ch.x > -32 && !EN_SCENE.some(([a, b]) => t >= a && t < b)) globalThis.CHIEN.dessiner(ctx, ch);
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
    trou(ctx, ts); sup(ctx, ts); conseq(ctx, ts); limite(ctx, ts); monotone(ctx, ts); adjacentes(ctx, ts); bw(ctx, ts); bilan(ctx, ts); fin(ctx, t);
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
