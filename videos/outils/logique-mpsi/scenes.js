  // table de vérité : colonnes (identifiants de formules), lignes de 'V' / 'F' ; kr(i) : apparition de la ligne i ; hi : ligne mise en valeur
  function tableV(ctx, x, y, cols, lignes, kr, o = {}) { const w = o.w || 190, h = o.h || 74;
    cols.forEach((id, j) => { cadre(ctx, x + j * w, y, w - 8, h - 8, { fill: C.trame, stroke: C.filet, lw: 2, r: 8, a: kr(-1) }); formule(ctx, id, x + j * w, y, { fs: o.fs || 34, mil: 1, a: kr(-1) }); });
    lignes.forEach((l, i) => { const k = kr(i), hi = o.hi === i ? o.khi : 0; [...l].forEach((v, j) => { cadre(ctx, x + j * w, y + (i + 1) * h, w - 8, h - 8, { fill: hi > 0 && j === l.length - 1 ? 'rgba(255,162,74,0.22)' : C.surface, stroke: hi > 0 ? C.orange : C.filet, lw: hi > 0 ? 3 : 2, r: 8, a: k }); txt(ctx, v, x + j * w, y + (i + 1) * h + 12, { fam: F.ui, w: 600, size: 34, c: v === 'V' ? VRAI : C.orange, a: k }); }); }); }
  // ---------- 1. une lettre de 1902 ----------
  function histoire(ctx, t) { const V = S.histoire;
    phase(ctx, t, 2, 6, () => { const kl = ap(t, V.lettre); cadre(ctx, CX, 290, 1200, 210, { fill: C.surface, stroke: C.filet, lw: 2, a: kl }); txt(ctx, '16 juin 1902 · Russell écrit à Frege', CX, 262, { size: 44, w: 700, a: kl });
      txt(ctx, 'Si toute propriété définit un ensemble,', CX, 322, { fam: F.ui, w: 500, size: 27, c: C.encre2, a: kl }); txt(ctx, 'alors « ne pas s’appartenir à soi-même » mène à une contradiction.', CX, 360, { fam: F.ui, w: 500, size: 27, c: C.encre2, a: kl });
      const kf = ap(t, V.frise, 0.8), X = (an) => 260 + (an - 1840) / 75 * 1400, Y = 580; seg(ctx, [X(1840), Y], [X(1915), Y], { c: C.gm, lw: 3, k: kf });
      [[1847, 'Boole, De Morgan', 'la logique devient un calcul', -1], [1879, 'Frege', 'les quantificateurs', 1], [1889, 'Peano', 'le symbole ∈', -1], [1902, 'Russell', 'le paradoxe', 1], [1908, 'Zermelo', 'des axiomes pour les ensembles', -1]].forEach(([an, nom, quoi, h], i) => { const k = ap(t, V.dates[i]); if (k <= 0) return; const x = X(an);
        pt(ctx, [x, Y], { c: i === 3 ? C.orange : C.cours, r: 9, a: k }); seg(ctx, [x, Y], [x, Y + h * 46], { c: C.gm, lw: 2.5, a: k }); txt(ctx, `${an} · ${nom}`, x, Y + h * 80 + (h > 0 ? 22 : -22), { size: 30, w: 700, a: k }); txt(ctx, quoi, x, Y + h * 80 + (h > 0 ? 56 : 12), { fam: F.ui, w: 500, size: 23, c: C.encre2, a: k }); }); });
    legs(ctx, t, V, [['Une lettre suffit à ébranler l’arithmétique que Frege vient de fonder.'], ['En un demi-siècle, la logique était devenue un calcul : il fallait désormais l’encadrer.']]); }

  // ---------- 2. les lois de la logique ----------
  function lois(ctx, t) { const V = S.lois;
    phase(ctx, t, 6, 10, () => { tableV(ctx, 420, 230, ['h_P', 'h_Q', 'h_imp', 'h_nou'], ['VVVV', 'VFFF', 'FVVV', 'FFVV'], (i) => ap(t, V.tab + (i + 1) * 0.5), { w: 300, fs: 32 });
      const ke = ap(t, V.egal); ctx.save(); ctx.globalAlpha *= ke; ctx.strokeStyle = C.cours; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(420 + 2 * 300 - 150, 190, 600, 384, 14); ctx.stroke(); ctx.restore(); tx(ctx, t, 'Les deux colonnes coïncident : les deux assertions sont équivalentes.', CX, 680, V.egal, { c: C.cours }); });
    phase(ctx, t, 10, 14, () => { [['l_m1', 'De Morgan', 520, 270], ['l_m2', 'De Morgan', 1400, 270], ['l_ni', 'négation d’une implication', 520, 560], ['l_c', 'contraposée', 1400, 560]].forEach(([id, nom, x, y], i) => { const k = ap(t, V.lois[i]); carte(ctx, x - 410, y - 100, 820, 190, nom.toUpperCase(), k); formule(ctx, id, x, y + 14, { fs: 34, mil: 1, a: k }); }); });
    legs(ctx, t, V, [['L’implication n’est fausse que si l’hypothèse est vraie et la conclusion fausse.'], ['« P implique Q » dit la même chose que « non P, ou Q ».'], ['La négation échange « et » et « ou ».'], ['Nier une implication, ce n’est pas écrire une autre implication.']]); }

  // ---------- 3. l'ordre des quantificateurs ----------
  const X3 = (v) => 760 + v * 150, Y3 = 620;
  const xPoint = (t) => { const V = S.quantif; return lerp(lerp(lerp(-3, 0, doux(pr(t, V.x1, 0.6))), 2, doux(pr(t, V.x2, 0.6))), 4.5, doux(pr(t, V.x3, 1.2))); };
  const posY = (t) => { const V = S.quantif, k1 = doux(pr(t, V.y1[0], V.y1[1] - V.y1[0])), k2 = doux(pr(t, V.y2[0], V.y2[1] - V.y2[0])), y = lerp(lerp(-2, 1, k1), 3, k2), m = (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1);
    return { p: [X3(y), Y3], y, marche: m, assis: !m && t > V.y2[1] ? doux(pr(t, V.y2[1], 0.4)) : undefined, tete: t > V.x3 ? 0.35 : 0.05 }; };
  function quantif(ctx, t) { const V = S.quantif;
    phase(ctx, t, 14, 22, () => { const kn = ap(t, V.neg); formule(ctx, 'q_a', 560, 220, { fs: 42, mil: 1, a: kn }); marque(ctx, 960, 220, 18, true, ap(t, V.vrai)); tx(ctx, t, 'sa négation :', 1090, 232, V.neg2, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, 'q_na', 1500, 220, 38, V.neg2);
      const ka = ap(t, V.axe, 0.8), x = xPoint(t); axeGradue(ctx, X3, Y3, -4, 6.5, [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], ka);
      pt(ctx, [X3(x), Y3], { c: C.orange, r: 13, a: ka }); formule(ctx, 'q_x', X3(x), Y3 - 40, { fs: 44, mil: 1, a: ka }); fo(ctx, t, 'q_yx', 560, 360, 46, V.x1 - 0.5); tx(ctx, t, 'le y choisi dépend de x', 560, 430, V.x1 - 0.5, { size: 26, c: C.encre2, w: 500 });
      fo(ctx, t, 'q_b', 1400, 360, 42, V.x3 - 0.3); marque(ctx, 1800, 360, 18, false, ap(t, V.faux)); tx(ctx, t, 'un même y pour tous les x : impossible', 1400, 430, V.faux, { size: 26, c: C.orange }); });
    legs(ctx, t, V, [['Pour nier une assertion quantifiée, on échange les quantificateurs et l’on nie la fin.'], ['À chaque $x$, le chien répond par un $y$ plus grand : il se place un pas plus loin.'], ['« Pour tout $x$, il existe $y$ » : l’assertion est vraie.'], ['Si $y$ doit être choisi avant $x$, il se fait dépasser : l’ordre des quantificateurs compte.']]); }

  // ---------- 4. la disjonction des cas ----------
  const R4 = K.repere({ x: 110, y: 290, w: 800, h: 460 }, { x0: -3.4, x1: 3.4, y0: 0, y1: 7 }), phi = (x) => Math.abs(x - 1) + Math.abs(x + 1);
  function cas(ctx, t) { const V = S.cas;
    phase(ctx, t, 22, 26, () => { fo(ctx, t, 'c_e', CX, 215, 48, V.enonce); const kf = ap(t, V.fig, 0.8);
      [[-3.4, -1, 'rgba(85,170,255,0.14)'], [-1, 1, 'rgba(53,202,164,0.16)'], [1, 3.4, 'rgba(255,162,74,0.14)']].forEach(([a, b, c], i) => { const k = ap(t, V.c[i], 0.5); if (k > 0) { ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = c; ctx.fillRect(R4.X(a), R4.b.y, R4.X(b) - R4.X(a), R4.b.h); ctx.restore(); } });
      K.axes(ctx, R4, kf, { gx: [-3, -2, -1, 1, 2, 3], gy: [2, 4, 6] }); K.courbe(ctx, R4, phi, -3.4, lerp(-3.4, 3.4, kf)); K.trait(ctx, R4, -3.4, 2, 3.4, 2, { c: C.cours, dash: [8, 8], a: ap(t, V.concl) });
      ['c_1', 'c_2', 'c_3'].forEach((id, i) => fo(ctx, t, id, 1420, 380 + i * 110, 34, V.c[i])); tx(ctx, t, 'Les trois cas recouvrent ℝ : l’inégalité est démontrée.', 1420, 720, V.concl, { c: C.cours, size: 28 }); });
    legs(ctx, t, V, [['Les valeurs absolues changent d’expression en −1 et en 1.'], ['On traite séparément chaque cas, en vérifiant qu’ils recouvrent toutes les situations.'], ['C’est le raisonnement par [disjonction des cas].']]); }

  // ---------- 5. l'analyse-synthèse ----------
  const R5 = K.repere({ x: 110, y: 170, w: 800, h: 580 }, { x0: -2.2, x1: 2.2, y0: -4, y1: 4.2 });
  function analyse(ctx, t) { const V = S.analyse;
    phase(ctx, t, 26, 32, () => { const kt = ap(t, V.th); carte(ctx, 410, 160, 1100, 170, 'THÉORÈME', kt); txt(ctx, 'Toute fonction de ℝ dans ℝ s’écrit de manière unique', CX, 238, { fam: F.ui, w: 500, size: 27, a: kt }); formule(ctx, 'a_th', CX, 286, { fs: 34, mil: 1, a: kt });
      tx(ctx, t, 'Analyse', 300, 400, V.an[0], { c: C.cours, size: 34 }); tx(ctx, t, 'si une solution existe…', 300, 444, V.an[0], { c: C.encre2, size: 24, w: 500 }); fo(ctx, t, 'a_1', 760, 380, 38, V.an[0]); fo(ctx, t, 'a_2', 760, 450, 38, V.an[1]); fo(ctx, t, 'a_g', 1400, 414, 34, V.an[2]);
      tx(ctx, t, 'Synthèse', 300, 620, V.syn[0], { c: C.cours, size: 34 }); tx(ctx, t, '… on vérifie qu’elle convient', 300, 664, V.syn[0], { c: C.encre2, size: 24, w: 500 }); fo(ctx, t, 'a_s', 1120, 630, 34, V.syn[0]); marque(ctx, 1720, 630, 18, true, ap(t, V.syn[1])); });
    phase(ctx, t, 32, 34, () => { const kf = ap(t, V.fig, 0.8), kg = ap(t, V.gh, 0.9); K.axes(ctx, R5, kf, { gx: [-2, -1, 1, 2], gy: [-2, 2] }); K.courbe(ctx, R5, Math.exp, -2.2, lerp(-2.2, 1.44, kf));
      K.courbe(ctx, R5, Math.cosh, -2.1, lerp(-2.1, 2.1, kg), { c: C.cours, lw: 4 }); K.courbe(ctx, R5, Math.sinh, -2.1, lerp(-2.1, 2.1, kg), { c: C.orange, lw: 4 });
      formule(ctx, 'a_f', 1400, 260, { fs: 50, mil: 1, a: kf }); formule(ctx, 'a_lg', 1400, 440, { fs: 44, mil: 1, a: kg }); formule(ctx, 'a_lh', 1400, 620, { fs: 44, mil: 1, a: kg }); });
    legs(ctx, t, V, [['Pour démontrer qu’un objet existe et qu’il est unique : l’[analyse-synthèse].'], ['L’analyse : on suppose le problème résolu, et l’on trouve ce que la solution doit être.'], ['La synthèse : on vérifie que ce candidat convient.', 'L’analyse donne l’unicité, la synthèse l’existence.'], ['Pour l’exponentielle, voici sa partie paire et sa partie impaire.']]); }

  // ---------- 6. des assertions aux ensembles ----------
  function ensembles(ctx, t) { const V = S.ensembles;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.eg); carte(ctx, 410, 165, 1100, 150, 'DOUBLE INCLUSION', kd); formule(ctx, 'e_dbl', CX, 250, { fs: 42, mil: 1, a: kd }); fo(ctx, t, 'e_eg', CX, 420, 50, V.eg);
      tx(ctx, t, '⊂', 420, 562, V.i1, { size: 44, c: C.cours }); fo(ctx, t, 'e_i1', 700, 550, 42, V.i1); tx(ctx, t, '⊃', 1040, 562, V.i2[0], { size: 44, c: C.cours }); fo(ctx, t, 'e_i2', 1400, 550, 42, V.i2[0]); tx(ctx, t, 'pour tout entier n', 1400, 630, V.i2[1], { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 38, 42, () => { const kv = ap(t, V.venn, 0.8), c3 = [[470, 420, C.bleu, 'e_A', -150, -130], [650, 420, C.orange, 'e_B', 150, -130], [560, 570, C.cours, 'e_C', 0, 125]]; ctx.save(); ctx.globalAlpha *= kv; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(200, 190, 720, 570); ctx.lineWidth = 4;
      c3.forEach(([x, y, c, id, dx, dy]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, 160, 0, 6.3); ctx.stroke(); formule(ctx, id, x + dx, y + dy, { fs: 40, mil: 1 }); }); formule(ctx, 'e_E', 880, 226, { fs: 36, mil: 1 }); ctx.restore();
      tx(ctx, t, 'huit régions : les huit lignes d’une table de vérité', 1440, 250, V.huit, { c: C.cours, size: 30 }); fo(ctx, t, 'e_m', 1440, 430, 46, V.huit + 1.5); fo(ctx, t, 'e_p', 1440, 630, 46, V.part); tx(ctx, t, 'une partition de ℤ', 1440, 700, V.part, { size: 26, c: C.encre2, w: 500 }); });
    phase(ctx, t, 42, 46, () => { fo(ctx, t, 'e_r', 560, 260, 54, V.russ); fo(ctx, t, 'e_r2', 560, 400, 50, V.r2); tx(ctx, t, 'le paradoxe de Russell', 560, 480, V.r2, { c: C.orange });
      const kz = ap(t, V.zer); cadre(ctx, 1400, 320, 760, 230, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kz }); formule(ctx, 'e_z', 1400, 280, { fs: 52, mil: 1, a: kz }); txt(ctx, 'on choisit les éléments dans un ensemble déjà construit', 1400, 384, { fam: F.ui, w: 500, size: 25, a: kz });
      [['non P', 'complémentaire'], ['P et Q', 'intersection'], ['P ou Q', 'réunion'], ['P ⇒ Q', 'inclusion']].forEach(([a, b2], i) => { const k = ap(t, V.dico + i * 0.3), x = 330 + i * 420; cadre(ctx, x, 660, 380, 110, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); txt(ctx, a, x, 648, { fam: F.ui, w: 600, size: 30, a: k }); txt(ctx, b2, x, 692, { fam: F.ui, w: 500, size: 26, c: C.cours, a: k }); }); });
    legs(ctx, t, V, [['Deux ensembles sont égaux quand chacun est inclus dans l’autre.'], ['La première inclusion est claire ; pour la seconde, on écrit chaque entier sous la forme voulue.'], ['Trois parties découpent l’ensemble en huit régions.'], ['Les lois de De Morgan valent pour toute famille de parties.'], ['L’ensemble de Russell ne peut ni s’appartenir, ni ne pas s’appartenir.'], ['D’où la règle de Zermelo, et un dictionnaire entre logique et ensembles.']]); }

  const ACTES_DEF = () => [acte(2, S.quantif, 2.6, posY, S.quantif.sortie)];
  function vignetteFig(ctx) { [[1320, 440, C.bleu], [1560, 440, C.orange], [1440, 640, C.cours]].forEach(([x, y, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, 210, 0, 6.3); ctx.stroke(); }); K.chienSur(ctx, 1440, 560, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); }

