  const divise = { def: N(2, 0.5), ex1: N(3, 1), ex2: N(4, 0), regle: N(5, 0), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  // 47 = 5 × 9 + 2 et −47 = 5 × (−10) + 3 : exemples propres à la vidéo ; le chien fait neuf bonds de 5, puis deux pas
  const euclide = { th: N(6, 0.5), axe: N(7, 1), bond: L(7, 1.2), chute: [L(7, 2.6), L(7, 3.8)], sauts: [L(8, 0.5), L(10, 1.5)], reste: [L(10, 2.2), L(11, 0)], egal: Cl(11, 0.5), sortie: L(12, 0.3), neg: N(12, 2), negr: Cl(13, 1),
    leg: G([6, 0.2, 7, 3.6], [8, 0, 10, 1.6], [10, 2, 11, 3.9], [12, 0.4, 13, 3.6]) };
  for (let i = 1; i <= 9; i++) ev(euclide.sauts[0] + i * (euclide.sauts[1] - euclide.sauts[0]) / 9, 'pas');
  const crible = { grille: N(14, 0.3), def: N(14, 2), raye: [P(15, 2), P(16, 2), P(17, 2), P(18, 2)], premiers: Cl(19, 2), racine: N(20, 2), leg: G([14, 0.2, 15, 1.6], [15, 2, 19, 1.6], [19, 2, 20, 1.6], [20, 2, 21, 3.6]) };
  const infinite = { prop: N(22, 0.5), n1: N(23, 0), r: N(24, 0), n2: Cl(25, 0), leg: G([22, 0.2, 23, 3.6], [24, 0, 25, 3.5]) };
  const tfa = { lemme: N(26, 0.5), th: N(28, 0), arbre: [N(30, 0), N(30, 3), N(31, 2)], dec: Cl(32, 2), leg: G([26, 0.2, 27, 3.6], [28, 0, 29, 3.6], [30, 0, 31, 3.9], [32, 0.2, 33, 3.5]) };
  const diviseurs = { t1: N(34, 0.5), t2: N(37, 0), compte: Cl(39, 0), gen: N(40, 2), frac: [N(42, 0.5), N(43, 2), Cl(44, 2)], leg: G([34, 0.2, 36, 3.6], [37, 0, 38, 3.6], [39, 0, 40, 1.6], [40, 2, 41, 3.6], [42, 0.2, 45, 3.5]) };
