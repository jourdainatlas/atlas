  // Exemples du cours t-02 : le jeu de la fête foraine (X ∈ {−2 ; 0 ; 6}, E = 0, V = 8), Y = 2X − 1, l'arbre à trois épreuves,
  // 3 billes dans 5 tasses, le triangle de Pascal, l'usine (X ∼ B(50 ; 0,03)).
  const variable = { jeu: N(2, 0.5), faces: N(3, 0), X: [N(3, 2), N(3, 3), N(4, 0)], def: N(4, 2), loi: Cl(5, 0.5), leg: G([2, 0.3, 2, 3.8], [3, 0, 4, 1.6], [4, 2, 5, 3.5]) };
  const esperance = { fig: N(6, 0.3), def: N(7, 0), calc: N(8, 0), zero: Cl(9, 0), vdef: N(10, 0.5), kh: N(11, 1), e2: N(12, 0), v: Cl(12, 2.5), sig: Cl(13, 1),
    leg: G([6, 0.2, 6, 3.8], [7, 0, 8, 3.6], [9, 0, 9, 3.6], [10, 0.2, 11, 0.6], [11, 1, 12, 2.1], [12, 2.5, 13, 3.5]) };
  const lineaire = { prop: N(14, 0.5), Y: N(15, 2), e: N(16, 0.5), v: N(16, 2), s: Cl(17, 0), leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.5]) };
  // le chien suit le chemin S, S, S̄ de l'arbre
  const bernoulli = { def: N(18, 0.5), ev: N(19, 2), sch: N(21, 0), arbre: [L(21, 0.3), L(22, 0)], bond: L(21, 2), chute: [L(22, 0.4), L(22, 1.6)], marche: [L(22, 2), L(24, 0)], sortie: L(24, 0.5), un: N(23, 2), trois: N(24, 2), p2: Cl(25, 0),
    leg: G([18, 0.2, 19, 1.6], [19, 2, 20, 3.6], [21, 0, 22, 1.6], [22, 2, 24, 1.6], [24, 2, 25, 3.5]) };
  // le chien longe les cinq tasses et dépose une bille dans la première, la troisième et la quatrième
  const combi = { def: N(26, 0.5), tasses: N(26, 2.5), bond: L(26, 3), chute: [L(27, 0.4), L(27, 1.6)], marche: [L(27, 2), L(28, 2)], sortie: L(28, 2.5), grille: [L(28, 3), L(29, 2)], dix: Cl(29, 2.5), prop: N(30, 0.5), tri: [L(31, 0), L(32, 0)], pascal: Cl(32, 1), fact: N(33, 0),
    leg: G([26, 0.2, 26, 3.8], [27, 0, 28, 2.6], [28, 3, 29, 3.8], [30, 0.2, 30, 3.8], [31, 0, 32, 3.6], [33, 0, 33, 3.5]) };
  const binomiale = { th: N(34, 0.5), lec: [N(35, 2), N(36, 1), N(37, 0)], ex: N(38, 0.5), p: [N(39, 0), N(39, 2), N(40, 0)], cum: Cl(41, 0), fig: N(42, 0.3), prop: N(43, 1), e: Cl(44, 0.5), s: N(45, 0),
    leg: G([34, 0.2, 35, 1.6], [35, 2, 37, 3.6], [38, 0.2, 38, 3.8], [39, 0, 40, 3.6], [41, 0, 41, 3.6], [42, 0.2, 43, 0.6], [43, 1, 45, 3.5]) };
