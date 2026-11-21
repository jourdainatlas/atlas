  // le problème de l'introduction du cours : restes 2, 3, 2 dans les divisions par 3, 5, 7 ; réponse 23
  const sunzi = { enonce: N(2, 0.5), restes: [N(3, 0), N(3, 1), N(3, 2)], rep: Cl(4, 0), regle: N(4, 2), calc: Cl(5, 0.5), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  const znz = { horloge: N(6, 0.3), def: N(6, 2), cinq: [L(8, 0), L(10, 0)], v5: Cl(10, 0.3), quatre: [L(11, 0), L(11, 2)], v4: P(11, 2.5), prop: N(12, 0.5), gens: Cl(13, 0.5), leg: G([6, 0.2, 7, 3.6], [8, 0, 10, 3.6], [11, 0, 11, 3.8], [12, 0.2, 13, 3.6]) };
  const ordre = { def: N(14, 0.5), ex: [N(15, 2), N(16, 2), N(17, 2)], th: N(18, 0.5), cor: Cl(19, 2), mono: N(20, 2), leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.6], [18, 0.2, 20, 1.6], [20, 2, 21, 3.6]) };
  // 12ℤ + 18ℤ = 6ℤ (PGCD de 12 et 18, exemple du cours) : le chien avance de 18, recule de 12
  const ideaux = { th: N(22, 0.3), bond: L(22, 0.4), chute: [L(22, 1.8), L(22, 3.0)], m1: [L(23, 0.3), L(23, 2.5)], m2: [L(24, 0), L(24, 2.2)], six: Cl(24, 2.4), pgcd: N(25, 0.3), leg: G([22, 0.2, 23, 3.6], [24, 0, 25, 3.5]) };
  const inversibles = { th: N(26, 0.5), corps: N(27, 2), div: [N(28, 2), N(29, 0.5), N(29, 2.5)], rem: [N(30, 2), N(31, 1)], inv: Cl(32, 0.5), ver: Cl(33, 0), leg: G([26, 0.2, 27, 1.6], [27, 2, 28, 1.6], [28, 2, 30, 1.6], [30, 2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  // partie allongée de quatre mesures : l'exemple de la case 8, puis la fabrication de 70, 21 et 15 (produit des deux autres modules, corrigé pour que le reste vaille 1)
  const chinois = { th: N(34, 0.5), grille: [L(35, 2), L(38, 0)], bij: Cl(38, 0.5), ex: N(39, 0.3), dou: N(40, 0.5), a: [N(40, 2), N(42, 0.5), N(43, 0.5)], b: [N(41, 1), N(42, 2), N(43, 2)], sun: N(44, 0.5), e: [N(44, 2), N(45, 0), N(45, 2)], x: Cl(46, 0.5), phi: N(47, 0.5), euler: Cl(48, 0), fermat: N(49, 0),
    leg: G([34, 0.2, 35, 1.6], [35, 2, 38, 3.8], [39, 0.2, 39, 3.6], [40, 0.2, 41, 3.8], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.8], [46, 0.2, 46, 3.6], [47, 0.2, 49, 3.5]) };
