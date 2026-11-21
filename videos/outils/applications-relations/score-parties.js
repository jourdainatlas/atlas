  // Tout vient du cours ma-02 : les dates de l'introduction, l'application à cinq et quatre éléments, le contre-exemple de la fonction
  // carré, n ↦ n + 1 et son inverse à gauche, le principe des tiroirs, l'argument diagonal, les congruences modulo 3, les diviseurs de 12.
  // Propre à la vidéo : les cinq premières lignes du tableau de Cantor.
  const histoire = { d: [N(2, 0.5), N(3, 1), N(4, 2), N(5, 0)], leg: G([2, 0.3, 3, 0.6], [3, 1, 4, 1.6], [4, 2, 5, 3.5]) };
  const imagesP = { dir: N(6, 0.5), A: N(7, 0), fA: Cl(7, 2), rec: N(8, 0), B: N(8, 2), fB: Cl(9, 0), prop: N(10, 0.5), l: [N(10, 2), N(11, 0.5), N(11, 2.5)], ce: [N(12, 2), N(13, 0), Cl(13, 1.5)],
    leg: G([6, 0.2, 7, 3.6], [8, 0, 9, 3.6], [10, 0.2, 10, 1.8], [10, 2, 12, 1.6], [12, 2, 13, 3.5]) };
  const transmet = { dia: N(14, 0.3), p: [N(14, 2), N(15, 2), N(16, 2)], pr: N(17, 0), leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.5]) };
  // le chien longe trois tiroirs en y posant un objet, puis revient poser le quatrième dans le deuxième
  const bij = { th: N(18, 0.5), f: N(19, 2), g: N(20, 1), gf: N(20, 3), fg: Cl(21, 1.5), th2: N(22, 0.5), tir: N(22, 2), bond: L(22, 2.5), chute: [L(23, 0), L(23, 1.2)], marche: [L(23, 1.5), L(25, 0)], sortie: L(25, 1), np: Cl(25, 0.3),
    leg: G([18, 0.2, 19, 1.6], [19, 2, 20, 2.6], [20, 3, 21, 3.6], [22, 0.2, 23, 1.2], [23, 1.5, 25, 3.5]) };
  // le chien descend la diagonale du tableau : à chaque ligne x, il regarde si x appartient à f(x), et D prend le contraire
  const cantor = { th: N(26, 0.5), tab: [L(27, 0), L(28, 0)], bond: L(28, 0), chute: [L(28, 1.4), L(28, 2.6)], marche: [L(29, 0), L(31, 0)], D: N(29, 0), sortie: L(31, 0.6), dif: N(31, 2), abs: N(32, 1), contra: Cl(32, 3), concl: N(33, 1.5),
    leg: G([26, 0.2, 26, 3.8], [27, 0, 28, 3.6], [29, 0, 31, 1.6], [31, 2, 32, 0.6], [32, 1, 33, 1.1], [33, 1.5, 33, 3.6]) };
  const equiv = { def: N(34, 0.5), axe: N(35, 1), cl: [N(35, 2), N(35, 3), N(36, 0)], th: Cl(36, 2), leg: G([34, 0.2, 35, 0.6], [35, 1, 36, 1.6], [36, 2, 37, 3.5]) };
  const ordre = { def: N(38, 0.5), tot: N(39, 2), par: N(40, 2), hasse: [L(42, 0.3), L(43, 0)], nc: N(43, 1), maj: N(44, 0), pg: N(44, 2.5), prop: Cl(45, 1),
    leg: G([38, 0.2, 39, 1.6], [39, 2, 40, 1.6], [40, 2, 41, 3.6], [42, 0.2, 43, 0.6], [43, 1, 44, 2.1], [44, 2.5, 45, 3.5]) };
