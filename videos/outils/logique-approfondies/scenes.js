  // table de vérité : colonnes (identifiants de formules), lignes de 'V' / 'F' ; kr(i) : apparition de la ligne i ; hi : ligne mise en valeur
  function tableV(ctx, x, y, cols, lignes, kr, o = {}) { const w = o.w || 190, h = o.h || 74;
    cols.forEach((id, j) => { cadre(ctx, x + j * w, y, w - 8, h - 8, { fill: C.trame, stroke: C.filet, lw: 2, r: 8, a: kr(-1) }); formule(ctx, id, x + j * w, y, { fs: o.fs || 34, mil: 1, a: kr(-1) }); });
    lignes.forEach((l, i) => { const k = kr(i), hi = o.hi === i ? o.khi : 0; [...l].forEach((v, j) => { cadre(ctx, x + j * w, y + (i + 1) * h, w - 8, h - 8, { fill: hi > 0 && j === l.length - 1 ? 'rgba(255,162,74,0.22)' : C.surface, stroke: hi > 0 ? C.orange : C.filet, lw: hi > 0 ? 3 : 2, r: 8, a: k }); txt(ctx, v, x + j * w, y + (i + 1) * h + 12, { fam: F.ui, w: 600, size: 34, c: v === 'V' ? VRAI : C.orange, a: k }); }); }); }
  // deux disques E (bleu) et F (orange) qui se chevauchent ; mode : 'diff', 'inter', 'union', 'hors' (complémentaire de la réunion)
  const VE = { cx: 560, cy: 470, r: 190, d: 210 };
  function venn(ctx, k, modes = {}, o = {}) { if (k <= 0) return; const { cx, cy, r, d } = { ...VE, ...o }, E = [cx - d / 2, cy], Fc = [cx + d / 2, cy], cer = (c) => { ctx.moveTo(c[0] + r, c[1]); ctx.arc(c[0], c[1], r, 0, 2 * Math.PI); };
    ctx.save(); ctx.globalAlpha *= k;
    if (modes.hors > 0) { ctx.save(); ctx.globalAlpha *= modes.hors; ctx.fillStyle = 'rgba(181,140,255,0.38)'; ctx.fillRect(cx - d / 2 - r - 60, cy - r - 50, d + 2 * r + 120, 2 * r + 100); ctx.fillStyle = C.papier; ctx.beginPath(); cer(E); cer(Fc); ctx.fill(); ctx.restore(); ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.strokeRect(cx - d / 2 - r - 60, cy - r - 50, d + 2 * r + 120, 2 * r + 100); }
    if (modes.union > 0) { ctx.save(); ctx.globalAlpha *= modes.union; ctx.fillStyle = 'rgba(181,140,255,0.38)'; ctx.beginPath(); cer(E); cer(Fc); ctx.fill('nonzero'); ctx.restore(); }
    if (modes.diff > 0) { ctx.save(); ctx.globalAlpha *= modes.diff; ctx.beginPath(); cer(E); ctx.clip(); ctx.fillStyle = 'rgba(85,170,255,0.38)'; ctx.beginPath(); ctx.rect(0, 0, W, H); cer(Fc); ctx.fill('evenodd'); ctx.restore(); }
    if (modes.inter > 0) { ctx.save(); ctx.globalAlpha *= modes.inter; ctx.beginPath(); cer(E); ctx.clip(); ctx.fillStyle = 'rgba(53,202,164,0.45)'; ctx.beginPath(); cer(Fc); ctx.fill(); ctx.restore(); }
    ctx.lineWidth = 4; ctx.strokeStyle = C.bleu; ctx.beginPath(); cer(E); ctx.stroke(); ctx.strokeStyle = C.orange; ctx.beginPath(); cer(Fc); ctx.stroke();
    formule(ctx, o.ids ? o.ids[0] : 'l_E', E[0] - r * 0.72, cy - r * 0.86, { fs: 44, mil: 1 }); formule(ctx, o.ids ? o.ids[1] : 'l_F', Fc[0] + r * 0.72, cy - r * 0.86, { fs: 44, mil: 1 }); ctx.restore(); }
  // A (bleu) inclus dans B (orange)
  const NI = { B: [560, 470, 240], A: [470, 500, 110] };
  function inclus(ctx, k) { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.lineWidth = 4; for (const [c, col, fill] of [[NI.B, C.orange, 'rgba(255,162,74,0.10)'], [NI.A, C.bleu, 'rgba(85,170,255,0.22)']]) { ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, 6.3); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = col; ctx.stroke(); }
    formule(ctx, 'l_A', NI.A[0] - 70, NI.A[1] - 60, { fs: 44, mil: 1 }); formule(ctx, 'l_B', NI.B[0] + 150, NI.B[1] - 150, { fs: 44, mil: 1 }); ctx.restore(); }

  // ---------- 1. propositions et connecteurs ----------
  function propositions(ctx, t) { const V = S.propositions;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 110, 180, 800, 170, 'DÉFINITION', kd); txt(ctx, 'Une proposition est une affirmation', 510, 258, { fam: F.ui, w: 600, size: 30, a: kd }); txt(ctx, 'qui est soit vraie, soit fausse.', 510, 304, { fam: F.ui, w: 600, size: 30, c: C.rouge, a: kd });
      tx(ctx, t, '« 2 > 3 » : fausse        « π est irrationnel » : vraie', 510, 460, V.ex[0], { size: 28 }); tx(ctx, t, '« x + 1 » n’est pas une proposition : c’est une expression.', 510, 560, V.ex[1], { size: 28, c: C.orange });
      tableV(ctx, 1150, 215, ['l_A', 'l_B', 'p_et', 'p_ou'], ['VVVV', 'VFFV', 'FVFV', 'FFFF'], (i) => ap(t, V.tab + (i + 1) * 0.5)); });
    legs(ctx, t, V, [['Une [proposition] est une affirmation dont on peut dire si elle est vraie ou fausse.'], ['Les connecteurs en fabriquent de nouvelles. Le « ou » des mathématiques est inclusif.']]); }

  // ---------- 2. implication et équivalence ----------
  const posImp = (t) => { const V = S.implication, k = doux(pr(t, V.marche[0], V.marche[1] - V.marche[0])); return { p: [lerp(470, 700, k), 540], marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : t < V.marche[0] ? doux(pr(t, V.chute[1] + 0.4, 0.4)) * (1 - pr(t, V.marche[0] - 0.3, 0.3)) : undefined }; };
  function implication(ctx, t) { const V = S.implication;
    phase(ctx, t, 6, 9, () => { tableV(ctx, 560, 230, ['l_A', 'l_B', 'p_imp'], ['VVV', 'VFF', 'FVV', 'FFV'], (i) => ap(t, V.tab + (i + 1) * 0.45), { w: 230, hi: 1, khi: ap(t, V.faux) });
      tx(ctx, t, 'Une implication n’est fausse', 1440, 400, V.faux, { size: 34 }); tx(ctx, t, 'que si A est vraie et B fausse.', 1440, 450, V.faux, { size: 34, c: C.orange }); });
    phase(ctx, t, 9, 12.1, () => { inclus(ctx, ap(t, V.fig, 0.8)); tx(ctx, t, 'A : « n est un multiple de 4 »', 1440, 220, V.fig, { c: C.bleu, size: 32 }); tx(ctx, t, 'B : « n est pair »', 1440, 280, V.fig, { c: C.orange, size: 32 }); formule(ctx, 'p_imp', 1440, 380, { fs: 60, mil: 1, a: ap(t, V.fig) });
      const ks = ap(t, V.suff), kn = ap(t, V.nec); cadre(ctx, 1440, 520, 760, 96, { stroke: C.bleu, fill: 'rgba(85,170,255,0.10)', a: ks }); txt(ctx, 'A est une condition suffisante pour B.', 1440, 531, { fam: F.ui, w: 600, size: 30, a: ks });
      cadre(ctx, 1440, 650, 760, 96, { stroke: C.orange, fill: 'rgba(255,162,74,0.10)', a: kn }); txt(ctx, 'B est une condition nécessaire pour A.', 1440, 661, { fam: F.ui, w: 600, size: 30, a: kn }); tx(ctx, t, 'n = 6', 760, 600, V.nec, { size: 28, c: C.orange }); });
    phase(ctx, t, 12.1, 14, () => { fo(ctx, t, 'i_eq', CX, 300, 90, V.equiv); fo(ctx, t, 'i_eq2', CX, 480, 50, V.equiv); tx(ctx, t, 'condition nécessaire et suffisante', CX, 650, V.cns, { size: 40, c: C.cours }); });
    legs(ctx, t, V, [['L’[implication] « si A, alors B » se définit elle aussi par sa table de vérité.'], ['Du faux, on peut déduire n’importe quoi : les deux dernières lignes sont vraies.'], ['Si $x$ est dans A, alors il est dans B : A suffit.'], ['Mais on peut être dans B sans être dans A : la réciproque est fausse.'], ['Quand l’implication et sa réciproque sont vraies, c’est une [équivalence].']]); }

  // ---------- 3. trois façons de raisonner ----------
  function raisonner(ctx, t) { const V = S.raisonner;
    phase(ctx, t, 14, 18, () => { const kc = ap(t, V.contra); carte(ctx, 410, 165, 1100, 170, 'LA CONTRAPOSÉE', kc); formule(ctx, 'r_c', CX, 262, { fs: 46, mil: 1, a: kc });
      tx(ctx, t, 'A : « pour tout ε > 0, x ⩽ ε »        B : « x = 0 »        (x est un réel positif)', CX, 420, V.cex[0], { size: 28, w: 500 });
      [['r_1', 520], ['r_2', 960], ['r_3', 1400]].forEach(([id, x], i) => { fo(ctx, t, id, x, 560, 46, V.cex[i]); if (i) fl(ctx, [x - 260, 560], [x - 180, 560], { c: C.gm, lw: 3, a: ap(t, V.cex[i]) }); }); tx(ctx, t, 'donc non A', 1400, 650, V.cex[2], { c: C.cours, size: 32 }); });
    phase(ctx, t, 18, 22, () => { const ka = ap(t, V.absurde); carte(ctx, 110, 180, 820, 200, 'PAR L’ABSURDE', ka); txt(ctx, 'On suppose le contraire de ce que l’on veut', 520, 262, { fam: F.ui, w: 600, size: 28, a: ka }); txt(ctx, 'démontrer, et l’on aboutit à une contradiction.', 520, 306, { fam: F.ui, w: 600, size: 28, a: ka });
      fo(ctx, t, 'r_a', 360, 520, 50, V.abs2); tx(ctx, t, 'sans facteur commun…', 680, 512, V.abs2, { size: 26, c: C.encre2 }); tx(ctx, t, '… et pourtant p et q sont pairs.', 520, 640, V.abs2 + 1.2, { size: 30, c: C.orange });
      const kx = ap(t, V.contre); carte(ctx, 990, 180, 820, 200, 'LE CONTRE-EXEMPLE', kx); txt(ctx, 'Un seul élément suffit à démontrer', 1400, 262, { fam: F.ui, w: 600, size: 28, a: kx }); txt(ctx, 'qu’une propriété universelle est fausse.', 1400, 306, { fam: F.ui, w: 600, size: 28, a: kx });
      tx(ctx, t, '« 2x + 1 est strictement positif pour tout réel x »', 1400, 480, V.contre, { size: 26, w: 500 }); fo(ctx, t, 'r_f', 1400, 600, 42, V.cval); });
    legs(ctx, t, V, [['Une implication et sa [contraposée] sont équivalentes : on démontre celle qui est la plus commode.'], ['Si $x$ est strictement positif, sa moitié le met en défaut.'], ['Le raisonnement par l’absurde est celui de l’irrationalité de racine de 2.'], ['Mais attention : mille exemples ne démontrent pas une propriété universelle.']]); }

  // ---------- 4. les quantificateurs ----------
  function quantif(ctx, t) { const V = S.quantif;
    phase(ctx, t, 22, 26, () => { [['q_1', 'pour tout x de E', V.d1, 520], ['q_2', 'il existe au moins un x de E', V.d2, 1400]].forEach(([id, s, t0, x]) => { const k = ap(t, t0); cadre(ctx, x, 260, 760, 170, { fill: C.surface, stroke: C.filet, lw: 2, a: k }); formule(ctx, id, x, 240, { fs: 50, mil: 1, a: k }); txt(ctx, s, x, 316, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); });
      fo(ctx, t, 'q_v', 520, 460, 44, V.ex); marque(ctx, 820, 460, 18, true, ap(t, V.ex + 0.3)); fo(ctx, t, 'q_f', 1400, 460, 44, V.ex + 0.6); marque(ctx, 1660, 460, 18, false, ap(t, V.ex + 0.9));
      const kn = ap(t, V.neg); cadre(ctx, CX, 650, 1200, 120, { stroke: C.cours, fill: 'rgba(53,202,164,0.10)', a: kn }); formule(ctx, 'q_n', CX, 650, { fs: 42, mil: 1, a: kn }); });
    legs(ctx, t, V, [['Deux [quantificateurs] : « pour tout » et « il existe ».'], ['Une proposition quantifiée est vraie ou fausse, comme les autres.'], ['Nier « pour tout », c’est affirmer « il existe » : la négation échange les deux.']]); }

  // ---------- 5. ensembles et inclusion ----------
  function inclusion(ctx, t) { const V = S.inclusion;
    phase(ctx, t, 26, 30, () => { fo(ctx, t, 'e_ext', 1440, 220, 46, V.ext); tx(ctx, t, 'en extension', 1440, 290, V.ext, { size: 24, c: C.encre2, w: 500 }); fo(ctx, t, 'e_comp', 1440, 380, 46, V.comp); tx(ctx, t, 'en compréhension', 1440, 450, V.comp, { size: 24, c: C.encre2, w: 500 });
      const ki = ap(t, V.incl); carte(ctx, 1040, 530, 800, 150, 'DÉFINITION', ki); formule(ctx, 'e_incl', 1440, 616, { fs: 38, mil: 1, a: ki }); inclus(ctx, ap(t, V.fig, 0.8)); });
    phase(ctx, t, 30, 34, () => { const kd = ap(t, V.dbl); carte(ctx, 410, 180, 1100, 170, 'DOUBLE INCLUSION', kd); formule(ctx, 'e_dbl', CX, 278, { fs: 46, mil: 1, a: kd });
      fo(ctx, t, 'e_vide', 520, 500, 60, V.vide); tx(ctx, t, 'l’ensemble vide est inclus dans tout ensemble', 520, 600, V.vide, { size: 26, c: C.encre2, w: 500 });
      fo(ctx, t, 'e_E', 1400, 450, 44, V.symb); fo(ctx, t, 'e_s1', 1260, 560, 50, V.symb); fo(ctx, t, 'e_s2', 1560, 560, 50, V.symb); tx(ctx, t, '∈ : un élément et un ensemble        ⊂ : deux ensembles', 1400, 670, V.symb, { size: 26, c: C.orange, w: 500 }); });
    legs(ctx, t, V, [['Un [ensemble] se décrit par la liste de ses éléments…'], ['… ou par une propriété qui les caractérise.'], ['A est [inclus] dans B quand tout élément de A est un élément de B.'], ['Pour démontrer que deux ensembles sont égaux, on démontre deux inclusions.'], ['L’appartenance et l’inclusion ne relient pas les mêmes objets : ne les confondez pas.']]); }

  // ---------- 6. opérations sur les ensembles ----------
  const posOp = (t) => { const V = S.operations, k1 = doux(pr(t, V.m1[0], V.m1[1] - V.m1[0])), k2 = doux(pr(t, V.m2[0], V.m2[1] - V.m2[0])), x = lerp(lerp(VE.cx - 190, VE.cx, k1), VE.cx + 190, k2), m = (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1);
    return { p: [x, VE.cy + 50], marche: m, tete: 0.1 }; };
  function operations(ctx, t) { const V = S.operations;
    phase(ctx, t, 34, 42, () => { venn(ctx, ap(t, V.fig, 0.8), { diff: fen(t, V.diff, V.m1[0] + 0.3, 0.3), inter: fen(t, V.inter, V.m2[0] + 0.3, 0.3), union: ap(t, V.union, 0.5) });
      [['o_d', V.diff, 'le complémentaire de F dans E', 250], ['o_i', V.inter, 'l’intersection', 430], ['o_u', V.union, 'la réunion', 610]].forEach(([id, t0, s, y]) => { tx(ctx, t, s, 1440, y - 54, t0, { size: 26, c: C.encre2, w: 500 }); fo(ctx, t, id, 1440, y, 38, t0); }); });
    phase(ctx, t, 42, 46, () => { const km = ap(t, V.morgan); carte(ctx, 1040, 170, 800, 230, 'LOIS DE DE MORGAN', km); formule(ctx, 'o_m1', 1440, 262, { fs: 46, mil: 1, a: km }); formule(ctx, 'o_m2', 1440, 340, { fs: 46, mil: 1, a: km });
      venn(ctx, ap(t, V.mfig, 0.7), { hors: ap(t, V.mfig + 0.5) }, { r: 150, d: 170, cy: 450, ids: ['l_Fb', 'l_G'] });
      fo(ctx, t, 'o_p', 1440, 520, 34, V.parties); const k2 = ap(t, V.deux); txt(ctx, 'Un ensemble à n éléments possède', 1370, 650, { fam: F.ui, w: 600, size: 30, a: k2 }); formule(ctx, 'o_2n', 1668, 636, { fs: 50, mil: 1, a: k2 }); txt(ctx, 'parties.', 1770, 650, { fam: F.ui, w: 600, size: 30, a: k2 }); });
    legs(ctx, t, V, [['Chaque opération sur les ensembles traduit un connecteur logique.'], ['L’élément $x$ entre dans l’[intersection] : il est dans E et dans F.'], ['Il quitte E, mais reste dans F.'], ['Dans tous ces cas, il est dans la [réunion] : dans E ou dans F.'], ['Être hors de la réunion, c’est être à la fois hors de l’un et hors de l’autre.'], ['Les parties d’un ensemble forment elles-mêmes un ensemble.']]); }

  const ACTES_DEF = () => [acte(1, S.implication, 2.6, posImp, S.implication.sortie), acte(5, S.operations, 2.6, posOp, S.operations.sortie)];
  function vignetteFig(ctx) { venn(ctx, 1, { inter: 1 }, { cx: 1420, cy: 520, r: 230, d: 250 }); K.chienSur(ctx, 1420, 590, 0, 4.2, { t: 0.4, assis: 1, tete: -0.1 }); }

