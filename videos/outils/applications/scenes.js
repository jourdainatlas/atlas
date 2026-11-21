  // ---------- diagrammes sagittaux ----------
  function ovale(ctx, cx, cy, rx, ry, a, id) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = C.gm; ctx.lineWidth = 2.5; ctx.fillStyle = C.surface; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.3); ctx.fill(); ctx.stroke(); ctx.restore(); if (id) formule(ctx, id, cx, cy - ry - 30, { fs: 34, mil: 1, a }); }
  const pts = (cx, cy, n, pas = 62) => Array.from({ length: n }, (_, i) => [cx, cy + (i - (n - 1) / 2) * pas]);
  // D : { cx, cy, d (demi-écart), nE, nF, fl : [[i, j, couleur]], an : [[côté, i]] points entourés en orange } ; A : opacités [ovales, flèches…]
  function sagittal(ctx, D, ko, kf, o = {}) { const E = pts(D.cx - D.d, D.cy, D.nE, D.pas), Fp = pts(D.cx + D.d, D.cy, D.nF, D.pas), ry = o.ry || 150;
    ovale(ctx, D.cx - D.d, D.cy, 70, ry, ko, o.sans ? null : 'l_E'); ovale(ctx, D.cx + D.d, D.cy, 70, ry, ko, o.sans ? null : 'l_F');
    D.fl.forEach(([i, j, c], n) => { const k = typeof kf === 'function' ? kf(n) : kf; fl(ctx, [E[i][0] + 14, E[i][1]], [Fp[j][0] - 16, Fp[j][1]], { c: c || C.bleu, lw: 3, a: k }); if (o.retour) fl(ctx, [Fp[j][0] - 14, Fp[j][1]], [E[i][0] + 16, E[i][1]], { c: c || C.bleu, lw: 3, a: k }); });
    for (const p of E) pt(ctx, p, { c: C.encre, r: 8, a: ko }); for (const p of Fp) pt(ctx, p, { c: C.encre, r: 8, a: ko });
    for (const [cote, i] of D.an || []) { const p = (cote ? Fp : E)[i]; ctx.save(); ctx.globalAlpha *= (o.kan ?? ko); ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p[0], p[1], 20, 0, 6.3); ctx.stroke(); ctx.restore(); } }

  // ---------- 1. une flèche et une seule ----------
  const D1 = { cx: 520, cy: 560, d: 170, pas: 54, nE: 3, nF: 4, fl: [[0, 0], [1, 0], [2, 2]] }, D2 = { cx: 1400, cy: 560, d: 170, pas: 54, nE: 3, nF: 4, fl: [[0, 0, C.orange], [0, 1, C.orange], [2, 3]], an: [[0, 1]] };
  function appli(ctx, t) { const V = S.appli;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 260, 165, 1400, 170, 'DÉFINITION', kd); txt(ctx, 'Une application de E dans F est un triplet (E, F, G), où G est une partie de E × F telle que :', CX, 250, { fam: F.ui, w: 600, size: 26, a: kd }); formule(ctx, 'a_def', CX, 300, { fs: 36, mil: 1, a: kd });
      sagittal(ctx, D1, ap(t, V.oui), (n) => ap(t, V.fl[n]), { ry: 125 }); tx(ctx, t, 'une application', D1.cx, 740, V.oui, { c: C.cours, size: 28 });
      sagittal(ctx, D2, ap(t, V.non), (n) => ap(t, n < 2 ? V.d2 : V.non), { kan: ap(t, V.d0), ry: 125 }); tx(ctx, t, 'pas une application', D2.cx, 740, V.non, { c: C.orange, size: 28 });
      tx(ctx, t, 'deux images', D2.cx, 462, V.d2, { c: C.orange, size: 24, w: 500 }); tx(ctx, t, 'aucune image', D2.cx - 330, 568, V.d0, { c: C.orange, size: 24, w: 500 }); });
    legs(ctx, t, V, [['Une [application] se donne par trois choses :', 'un ensemble de départ, un ensemble d’arrivée, un graphe.'], ['De chaque élément de départ part une flèche, et une seule : son [image].'], ['Deux images pour un même élément, ou aucune : ce n’est plus une application.']]); }

  // ---------- 2. égalité, identité, composition ----------
  function composer(ctx, t) { const V = S.composer;
    phase(ctx, t, 6, 10, () => { tx(ctx, t, 'Deux applications sont égales quand elles ont', CX, 205, V.eg, { size: 32 }); tx(ctx, t, 'même départ, même arrivée, et la même image pour chaque x.', CX, 252, V.eg, { size: 32 });
      fo(ctx, t, 'c_1', 560, 400, 42, V.a1); fo(ctx, t, 'c_2', 1360, 400, 42, V.a2); fo(ctx, t, 'c_ne', 960, 400, 60, V.diff); tx(ctx, t, 'même formule, mais deux applications distinctes', CX, 500, V.diff, { c: C.orange, size: 28 });
      const ki = ap(t, V.id); carte(ctx, 510, 570, 900, 150, 'DÉFINITION', ki); txt(ctx, 'l’identité de E', 750, 668, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: ki }); formule(ctx, 'c_id', 1120, 656, { fs: 38, mil: 1, a: ki }); });
    phase(ctx, t, 10, 14, () => { const kd = ap(t, V.dia), X = [330, 760, 1190], y = 330; [['l_E', 0], ['l_F', 1], ['l_G', 2]].forEach(([id, i]) => ovale(ctx, X[i], y, 110, 100, kd, id));
      pt(ctx, [X[0], y], { r: 9, a: kd }); formule(ctx, 'l_x', X[0], y + 40, { fs: 32, mil: 1, a: kd }); const kf = ap(t, V.f), kg = ap(t, V.g), kc = ap(t, V.gf);
      fl(ctx, [X[0] + 20, y], [X[1] - 22, y], { c: C.bleu, lw: 4, a: kf }); formule(ctx, 'l_f', (X[0] + X[1]) / 2, y - 30, { fs: 34, mil: 1, a: kf }); pt(ctx, [X[1], y], { r: 9, a: kf }); formule(ctx, 'l_fx', X[1], y + 40, { fs: 32, mil: 1, a: kf });
      fl(ctx, [X[1] + 20, y], [X[2] - 22, y], { c: C.orange, lw: 4, a: kg }); formule(ctx, 'l_g', (X[1] + X[2]) / 2, y - 30, { fs: 34, mil: 1, a: kg }); pt(ctx, [X[2], y], { r: 9, a: kg }); formule(ctx, 'l_gfx', X[2], y + 44, { fs: 30, mil: 1, a: kg });
      if (kc > 0) { ctx.save(); ctx.globalAlpha *= kc; ctx.strokeStyle = VIOLET; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X[0], y + 104); ctx.quadraticCurveTo(X[1], y + 210, X[2] - 14, y + 108); ctx.stroke(); ctx.restore(); fl(ctx, [X[2] - 34, y + 122], [X[2] - 6, y + 104], { c: VIOLET, lw: 4, a: kc }); formule(ctx, 'l_gf', X[1], y + 188, { fs: 34, mil: 1, a: kc }); }
      fo(ctx, t, 'c_gf', 1560, 250, 30, V.gf); tx(ctx, t, 'f agit en premier :', 1560, 340, V.gf, { c: C.encre2, w: 500, size: 26 }); tx(ctx, t, 'on lit de droite à gauche', 1560, 380, V.gf, { c: C.encre2, w: 500, size: 26 });
      fo(ctx, t, 'c_e1', 620, 640, 36, V.ex[0]); fo(ctx, t, 'c_e2', 620, 720, 36, V.ex[1]); fo(ctx, t, 'c_as', 1500, 680, 36, V.asso); });
    legs(ctx, t, V, [['L’égalité de deux applications porte sur trois données, pas sur la seule formule.'], ['Le carré, de l’ensemble des réels dans lui-même ou dans les réels positifs : deux applications.'], ['L’[identité] ne déplace aucun élément.'], ['La [composée] : on applique $f$, puis $g$ au résultat.'], ['L’ordre compte : la composition n’est pas commutative.'], ['Mais elle est associative : les parenthèses sont inutiles.']]); }

  // ---------- 3. injective, surjective, bijective ----------
  const DI = [{ cx: 380, cy: 400, d: 120, nE: 3, nF: 4, fl: [[0, 0], [1, 1], [2, 3]], an: [[1, 2]] }, { cx: 960, cy: 400, d: 120, nE: 4, nF: 3, fl: [[0, 0], [1, 1, C.orange], [2, 1, C.orange], [3, 2]], an: [[1, 1]] }, { cx: 1540, cy: 400, d: 120, nE: 3, nF: 3, fl: [[0, 1], [1, 0], [2, 2]] }];
  function inj(ctx, t) { const V = S.inj;
    phase(ctx, t, 14, 19, () => { [['injective', 'tout élément d’arrivée a', 'au plus un antécédent', 'un élément sans antécédent'], ['surjective', 'tout élément d’arrivée a', 'au moins un antécédent', 'un élément a deux antécédents'], ['bijective', 'tout élément d’arrivée a', 'exactement un antécédent', '']].forEach(([n, l1, l2, d], i) => { const k = ap(t, V.d[i]), D = DI[i];
        sagittal(ctx, D, k, k, { ry: 135 }); txt(ctx, n, D.cx, 610, { fam: F.ui, w: 700, size: 36, c: C.rouge, a: k }); txt(ctx, l1, D.cx, 660, { fam: F.ui, w: 500, size: 26, c: C.encre2, a: k }); txt(ctx, l2, D.cx, 700, { fam: F.ui, w: 600, size: 28, a: k }); if (d) txt(ctx, d, D.cx, 192, { fam: F.ui, w: 500, size: 24, c: C.orange, a: k }); }); });
    phase(ctx, t, 19, 22, () => { [['Pour démontrer que f est injective', 'i_r1', 'i_r2', 500], ['Pour démontrer que f est surjective', 'i_s1', 'i_s2', 1420]].forEach(([s, a, b, x], i) => { const k = ap(t, V.m[i]); carte(ctx, x - 410, 200, 820, 420, 'MÉTHODE', k); txt(ctx, s, x, 300, { fam: F.ui, w: 600, size: 30, a: k }); formule(ctx, a, x, 400, { fs: 32, mil: 1, a: k }); formule(ctx, b, x, 500, { fs: 32, mil: 1, a: k }); }); });
    legs(ctx, t, V, [['[Injective] : deux éléments distincts n’ont jamais la même image.'], ['[Surjective] : tout élément de l’ensemble d’arrivée est atteint.'], ['[Bijective] : injective et surjective à la fois, un appariement parfait.'], ['Pour l’injectivité, on part d’une égalité entre deux images.'], ['Pour la surjectivité, on se donne un élément d’arrivée et l’on exhibe un antécédent.']]); }

  // ---------- 4. trois versions du sinus ----------
  const RS = K.repere({ x: 120, y: 330, w: 1680, h: 400 }, { x0: -4.6, x1: 9.9, y0: -1.7, y1: 2.5 }), CROIS = [-7 * Math.PI / 6, Math.PI / 6, 5 * Math.PI / 6, 13 * Math.PI / 6, 17 * Math.PI / 6];
  const posSin = (t) => { const V = S.sinus, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-4.3, 9.5, k); return { p: XY(RS, x, 0.5), x, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function figSin(ctx, kf, o = {}) { K.axes(ctx, RS, kf, { gx: [], gy: [-1, 1] }); K.courbe(ctx, RS, Math.sin, -4.5, lerp(-4.5, 9.8, kf), o.c ? { c: o.c } : {}); }
  function sinus(ctx, t) { const V = S.sinus;
    phase(ctx, t, 22, 30, () => { const kf = ap(t, V.fig, 0.9), kc = ap(t, V.c), kb = ap(t, V.b), k2 = ap(t, V.deux) * (1 - kb);
      if (kb > 0) { ctx.save(); ctx.globalAlpha *= kb * 0.16; ctx.fillStyle = C.cours; ctx.fillRect(RS.X(-4.6), RS.Y(1), RS.X(9.9) - RS.X(-4.6), RS.Y(-1) - RS.Y(1)); ctx.restore(); }
      ctx.save(); ctx.globalAlpha *= 1 - 0.7 * kc; figSin(ctx, kf); ctx.restore(); if (kc > 0) { K.courbe(ctx, RS, Math.sin, -Math.PI / 2, Math.PI / 2, { c: C.cours, lw: 8, a: kc }); seg(ctx, XY(RS, -Math.PI / 2, 0), XY(RS, Math.PI / 2, 0), { c: C.cours, lw: 7, a: kc }); }
      formule(ctx, 's_f', RS.X(8.6), RS.Y(1.45), { fs: 32, mil: 1, a: kf });
      const km = fen(t, V.marche[0] - 0.4, V.deux + 0.2, 0.4), x = t > V.marche[0] ? posSin(t).x : -9; seg(ctx, XY(RS, -4.6, 0.5), XY(RS, 9.9, 0.5), { c: C.cours, lw: 3, dash: [8, 8], a: km }); formule(ctx, 's_12', RS.X(-4.2), RS.Y(0.5) - 30, { fs: 28, mil: 1, a: km }); for (const u of CROIS) if (x > u) pt(ctx, XY(RS, u, 0.5), { c: C.cours, r: 11, a: km });
      seg(ctx, XY(RS, -4.6, 2), XY(RS, 9.9, 2), { c: C.orange, lw: 3, dash: [8, 8], a: k2 }); formule(ctx, 's_2', RS.X(-4.2), RS.Y(2) - 28, { fs: 28, mil: 1, a: k2 });
      const A = [fen(t, V.fig, V.b, 0.4), fen(t, V.b, V.c, 0.4), kc]; ['s_a', 's_b', 's_c'].forEach((id, i) => formule(ctx, id, 520, 235, { fs: 42, mil: 1, a: A[i] }));
      const n = CROIS.filter((u) => x > u).length; txt(ctx, n ? `${n} antécédent${n > 1 ? 's' : ''} de 1/2` : '', 1300, 247, { fam: F.ui, w: 600, size: 32, c: C.cours, a: fen(t, V.marche[0], V.ninj, 0.3) });
      txt(ctx, 'ni injective, ni surjective', 1300, 247, { fam: F.ui, w: 600, size: 34, c: C.orange, a: fen(t, V.ninj, V.b, 0.3) }); txt(ctx, 'surjective, non injective', 1300, 247, { fam: F.ui, w: 600, size: 34, c: C.cours, a: A[1] }); txt(ctx, 'bijective', 1300, 247, { fam: F.ui, w: 600, size: 38, c: C.cours, a: kc }); });
    legs(ctx, t, V, [['Le sinus, de l’ensemble des réels dans lui-même.'], ['La droite horizontale de hauteur un demi coupe la courbe plusieurs fois :', 'pas d’injectivité.'], ['La droite de hauteur 2 ne la coupe jamais : pas de surjectivité non plus.'], ['En réduisant l’ensemble d’arrivée aux valeurs atteintes, on obtient une surjection.'], ['En réduisant aussi l’ensemble de départ,', 'chaque valeur n’est atteinte qu’une fois : une bijection.']]); }

  // ---------- 5. la bijection réciproque ----------
  function reciproque(ctx, t) { const V = S.reciproque;
    phase(ctx, t, 30, 34, () => { const kd = ap(t, V.def); carte(ctx, 760, 165, 1000, 170, 'DÉFINITION', kd); txt(ctx, 'À chaque y de F, on associe son unique antécédent.', 1260, 250, { fam: F.ui, w: 600, size: 28, a: kd }); formule(ctx, 'r_def', 1260, 300, { fs: 38, mil: 1, a: kd });
      sagittal(ctx, { cx: 400, cy: 440, d: 130, nE: 3, nF: 3, fl: [[0, 1], [1, 0], [2, 2]] }, kd, kd, { retour: 1, ry: 140 }); tx(ctx, t, 'chaque flèche se parcourt dans les deux sens', 400, 660, V.def, { c: C.encre2, w: 500, size: 24 });
      fo(ctx, t, 'r_eq', 1260, 430, 42, V.eq); fo(ctx, t, 'r_p', 1260, 550, 38, V.prop); fo(ctx, t, 'r_arc', 1260, 680, 40, V.arc); });
    legs(ctx, t, V, [['Une bijection se renverse : c’est sa [bijection réciproque].'], ['Composer une bijection et sa réciproque redonne l’identité.'], ['La réciproque de la troisième version du sinus est la fonction arcsinus.']]); }

  // ---------- 6. image directe, image réciproque ----------
  const RI = K.repere({ x: 160, y: 200, w: 760, h: 540 }, { x0: -2.6, x1: 2.6, y0: -0.7, y1: 4.7 }), car = (x) => x * x;
  const posIm = (t) => { const V = S.images, k = pr(t, V.marche[0], V.marche[1] - V.marche[0]), x = lerp(-1, 2, k); return { p: XY(RI, x, 0), x, k, marche: k > 0 && k < 1, assis: k >= 1 ? doux(pr(t, V.marche[1], 0.4)) : undefined }; };
  function images(ctx, t) { const V = S.images;
    phase(ctx, t, 34, 38, () => { const kd = ap(t, V.dir); carte(ctx, 260, 165, 1400, 150, 'DÉFINITION', kd); txt(ctx, 'image directe', 520, 262, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kd }); formule(ctx, 'm_d', 1130, 250, { fs: 36, mil: 1, a: kd });
      const kr = ap(t, V.rec); carte(ctx, 260, 370, 1400, 150, 'DÉFINITION', kr); txt(ctx, 'image réciproque', 540, 467, { fam: F.ui, w: 600, size: 28, c: C.encre2, a: kr }); formule(ctx, 'm_r', 1150, 455, { fs: 36, mil: 1, a: kr });
      tx(ctx, t, 'L’image réciproque d’une partie a un sens même si f n’est pas bijective.', CX, 640, V.rem, { c: C.cours, size: 30 }); });
    phase(ctx, t, 38, 46, () => { const kf = ap(t, V.fig, 0.9), kA = ap(t, V.A), kB = ap(t, V.B), kfB = ap(t, V.fB), on = t > V.marche[0], { x, k } = posIm(t);
      K.axes(ctx, RI, kf, { gx: [-2, -1, 1, 2], gy: [1, 4] }); K.courbe(ctx, RI, car, -2.15, lerp(-2.15, 2.15, kf), { c: C.gd }); formule(ctx, 'm_f', RI.X(1.7), RI.Y(4.4), { fs: 30, mil: 1, a: kf });
      seg(ctx, XY(RI, -1, 0), XY(RI, 2, 0), { c: C.bleu, lw: 9, a: kA }); if (on) { const lo = x < 0 ? x * x : 0, hi = Math.max(1, x * x); seg(ctx, XY(RI, 0, lo), XY(RI, 0, hi), { c: C.cours, lw: 9 }); if (k < 1) { K.trait(ctx, RI, x, 0, x, x * x, { c: C.gm, dash: [5, 7] }); K.trait(ctx, RI, x, x * x, 0, x * x, { c: C.gm, dash: [5, 7] }); K.point(ctx, RI, x, x * x, { r: 8, c: C.encre }); K.point(ctx, RI, 0, x * x, { r: 9, c: C.cours }); } }
      seg(ctx, XY(RI, 0.06, 1), XY(RI, 0.06, 4), { c: C.orange, lw: 9, a: kB }); for (const [u, w] of [[-2, -1], [1, 2]]) { seg(ctx, XY(RI, u, -0.12), XY(RI, w, -0.12), { c: VIOLET, lw: 9, a: kfB }); for (const z of [u, w]) K.trait(ctx, RI, z, 0, z, z * z, { c: VIOLET, dash: [5, 7], a: kfB }); } for (const y of [1, 4]) K.trait(ctx, RI, -Math.sqrt(y), y, Math.sqrt(y), y, { c: C.orange, dash: [5, 7], a: kfB });
      fo(ctx, t, 'm_A', 1420, 240, 44, V.A); const km = fen(t, V.marche[0], V.fA, 0.3); txt(ctx, `x = ${K.fr(x, 2)}        x² = ${K.fr(x * x, 2)}`, 1420, 350, { fam: F.ui, w: 600, size: 36, a: km }); fo(ctx, t, 'm_fA', 1420, 350, 48, V.fA); tx(ctx, t, 'et non [1 ; 4] : les carrés des nombres', 1420, 416, V.fA, { c: C.encre2, w: 500, size: 25 }); tx(ctx, t, 'proches de 0 sont proches de 0', 1420, 450, V.fA, { c: C.encre2, w: 500, size: 25 });
      fo(ctx, t, 'm_B', 1420, 540, 44, V.B); fo(ctx, t, 'm_fB', 1420, 625, 42, V.fB); fo(ctx, t, 'm_v', 1420, 715, 40, V.vide); });
    legs(ctx, t, V, [['L’[image directe] d’une partie $A$ : l’ensemble des images de ses éléments.'], ['L’[image réciproque] d’une partie $B$ : les éléments dont l’image tombe dans $B$.'], ['Elle se note comme la réciproque, mais existe pour toute application.'], ['La fonction carré, et la partie $A$ : les réels compris entre −1 et 2.'], ['Le chien parcourt $A$ : son image descend jusqu’à 0, puis remonte jusqu’à 4.'], ['L’image directe de $A$ commence donc à 0, et non à 1.'], ['L’image réciproque de $B$ se lit à contre-courant :', 'deux intervalles ont leurs carrés entre 1 et 4.'], ['Aucun carré n’est négatif : cette image réciproque est vide.']]); }

  const ACTES_DEF = () => [acte(3, S.sinus, 2.3, posSin, S.sinus.sortie), acte(5, S.images, 2.4, posIm, S.images.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1000, y: 330, w: 840, h: 380 }, { x0: -1.2, x1: 8.2, y0: -1.5, y1: 1.7 }); seg(ctx, XY(Rv, -1.2, 0), XY(Rv, 8.2, 0), { c: C.gm, lw: 4 }); K.courbe(ctx, Rv, Math.sin, -1.1, 8.1, { lw: 9 }); seg(ctx, XY(Rv, -1.2, 0.5), XY(Rv, 8.2, 0.5), { c: C.cours, lw: 4, dash: [10, 10] }); for (const u of CROIS.slice(1, 4)) pt(ctx, XY(Rv, u, 0.5), { c: C.cours, r: 14 }); const p = XY(Rv, 4.6, 0.5); K.chienSur(ctx, p[0], p[1] - 4, 0, 3.8, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_2', 480, 640, { fs: 50, mil: 1 }); }
