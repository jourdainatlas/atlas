  const f2 = (x) => 3 * x * x - 2 * x - 5, g2 = (x) => 2 * x * x - x - 1;
  // petite parabole schématique : y = a x² + dy dans un cadre centré en (cx, cy)
  function para(ctx, cx, cy, a, dy, k, o = {}) { if (k <= 0) return; const w = o.w || 150, u = 60; ctx.save(); ctx.globalAlpha *= k; seg(ctx, [cx - w, cy], [cx + w, cy], { c: C.gm, lw: 2.5 });
    ctx.strokeStyle = C.bleu; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = -40; i <= 40; i++) { const x = i / 40 * 1.9, y = a * x * x + dy; if (i === -40) ctx.moveTo(cx + x * u, cy - y * u); else ctx.lineTo(cx + x * u, cy - y * u); } ctx.stroke();
    for (const r of o.racines || []) pt(ctx, [cx + r * u, cy], { c: C.cours, r: 9 }); if (o.sommet) pt(ctx, [cx, cy - dy * u], { c: C.cours, r: 10 }); ctx.restore(); }

  // ---------- 1. la fonction trinôme ----------
  function trinome(ctx, t) { const V = S.trinome;
    phase(ctx, t, 2, 6, () => { const kd = ap(t, V.def); carte(ctx, 510, 165, 900, 150, 'DÉFINITION', kd); formule(ctx, 't_def', CX, 250, { fs: 52, mil: 1, a: kd });
      const kh = ap(t, V.haut, 0.7), kb = ap(t, V.bas, 0.7), ks = ap(t, V.sommet); para(ctx, 700, 565, 0.8, -2.2, kh, { sommet: ks > 0 }); para(ctx, 1220, 565, -0.8, 2.2, kb, { sommet: ks > 0 });      // les deux axes sur une même horizontale
      formule(ctx, 't_ap', 700, 380, { fs: 44, mil: 1, a: kh }); formule(ctx, 't_an', 1220, 380, { fs: 44, mil: 1, a: kb }); });
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
        for (const x of [1400, 1640]) { seg(ctx, [x, 300], [x, 400], { c: C.gm, lw: 2.5, dash: [7, 7], a: kt }); ctx.save(); ctx.globalAlpha *= kt; ctx.fillStyle = C.papier; ctx.fillRect(x - 15, 330, 30, 40); ctx.restore(); }                    // une barre sous chaque racine sépare les signes
        [['g_x', 1090, y1], ['g_fx', 1090, y2], ['g_mi', 1200, y1], ['g_r1', 1400, y1], ['g_r2', 1640, y1], ['g_pi', 1850, y1], ['g_p', 1290, y2], ['g_0', 1400, y2], ['g_m', 1520, y2], ['g_0', 1640, y2], ['g_p', 1760, y2]].forEach(([id, x, y]) => formule(ctx, id, x, y, { fs: 38, mil: 1, a: kt }));
        fo(ctx, t, 'g_in', 1470, 520, 48, V.ineq); fo(ctx, t, 'g_S', 1470, 660, 44, V.sol); }); });
    legs(ctx, t, V, [['Une parabole tournée vers le haut, deux racines.'], ['Le point d’abscisse $x$ avance : le signe de $f(x)$ change à chaque racine.'], ['Positif, négatif, positif : le signe de $a$ revient à l’extérieur des racines.'], ['Le tableau de signes résume la figure.'], ['Il donne aussitôt les solutions d’une inéquation.']]); }

  const ACTES_DEF = () => [acte(1, S.canonique, 3.0, posSommet), acte(5, S.signe, 2.8, posSigne, S.signe.sortie)];
  function vignetteFig(ctx) { const Rv = K.repere({ x: 1040, y: 230, w: 800, h: 560 }, { x0: -1.6, x1: 2.3, y0: -6.2, y1: 4.2 }); seg(ctx, XY(Rv, -1.6, 0), XY(Rv, 2.3, 0), { c: C.gm, lw: 4 }); K.courbe(ctx, Rv, f2, -1.45, 2.12, { lw: 9 });
    const p = XY(Rv, 1 / 3, -16 / 3); pt(ctx, XY(Rv, -1, 0), { c: C.cours, r: 13 }); pt(ctx, XY(Rv, 5 / 3, 0), { c: C.cours, r: 13 }); K.chienSur(ctx, p[0], p[1] - 4, 0, 4.6, { t: 0.4, assis: 1, tete: -0.1 }); formule(ctx, 'b_d', 500, 700, { fs: 84, mil: 1 }); }

