// PARTITION — « Éléments propres et diagonalisation », MP, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
// Source unique des instants, pour la musique (song.js) comme pour l'image (film.js).
// Tempo entendu : 60 à la noire. Une mesure = 4 s ; L(mesure, temps) donne l'instant en secondes.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock } = MU;

  const FPS = 30;
  const STYLE = 'flat';
  const FORMAT = U.pickFormat('16:9');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  // Un intertitre d'une mesure entière (quatre secondes) précède chaque partie et le bilan : toute la partition est
  // décalée d'autant à partir de la mesure où la partie commence. L(b0) est l'instant où le contenu de la partie
  // démarre ; l'intertitre occupe [L(b0) − INTER, L(b0)]. La musique lit la même horloge : elle tient pendant cette
  // mesure l'accord de dominante qui termine la phrase précédente, avant de repartir sur la suivante.
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 10, 14, 22, 30, 38, 46, 54];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 54, FIN = 58;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'direction', nom: "Une direction que l’on étire", b0: 2, b1: 10 },
    { id: 'propres', nom: "Valeurs propres, vecteurs propres", b0: 10, b1: 14 },
    { id: 'caract', nom: "Le polynôme caractéristique", b0: 14, b1: 22 },
    { id: 'diago', nom: "Diagonaliser", b0: 22, b1: 30 },
    { id: 'issues', nom: "Trois issues possibles", b0: 30, b1: 38 },
    { id: 'puissances', nom: "Les puissances d’une matrice", b0: 38, b1: 46 },
    { id: 'trigo', nom: "Trigonaliser ; les nilpotents", b0: 46, b1: 54 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), BILAN]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(BILAN), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };
  const N = (m, b) => ev(L(m, b)), P = (m, b) => ev(L(m, b), 'pas'), Cl = (m, b) => ev(L(m, b), 'cloche');   // raccourcis
  const G = (...l) => l.map(([a, b, c, d]) => [L(a, b), L(c, d)]);                                          // fenêtres des légendes

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(BILAN) - INTER, 'titre'), nom: 'En résumé', rang: '' }];
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // Tout vient du cours mp-02 : la matrice (2 1 ; 1 2) de l'introduction, la matrice A de taille 3 (χ = (X − 1)²(X − 4)), la matrice C
  // (χ = (X − 2)³, non diagonalisable), le quart de tour R, la suite de Fibonacci (f₁₀ = 55), la matrice J nilpotente d'indice 3.
  // le chien est le vecteur unitaire x : il parcourt l'arc de 20° à 160°, avec un arrêt à 45° (Ax = 3x) et à 135° (Ax = x)
  const direction = { fig: N(2, 0.3), A: N(2, 1.5), bond: L(3, 0), chute: [L(3, 1.4), L(3, 2.6)], marche: [L(4, 0), L(8, 0)], e3: Cl(4, 3.4), e1: Cl(7, 0.2), sortie: L(8, 1.6), dir: N(8, 2), mot: N(9, 1),
    leg: G([2, 0.3, 3, 3.6], [4, 0, 4, 3.2], [4, 3.4, 5, 2.4], [5, 2.6, 6, 3.8], [7, 0.2, 8, 1.6], [8, 2, 9, 3.5]) };
  const propres = { def: N(10, 0.5), E: N(11, 1), sp: N(12, 0), th: Cl(12, 2), card: N(13, 1.5), leg: G([10, 0.2, 11, 0.6], [11, 1, 12, 1.6], [12, 2, 13, 3.5]) };
  const caract = { def: N(14, 0.5), th: Cl(15, 2), dev: N(16, 2.5), d2: N(18, 0.5), ex: N(19, 0.5), fac: Cl(20, 0), mult: N(20, 2.5), ab: N(21, 1.5),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 16, 2.1], [16, 2.5, 17, 3.6], [18, 0.2, 18, 3.8], [19, 0.2, 20, 2.1], [20, 2.5, 21, 3.6]) };
  const diago = { def: N(22, 0.5), th: Cl(23, 1), cor: N(24, 1.5), A: N(25, 0.3), chi: N(25, 2.5), E1: N(26, 2), E4: N(27, 2), P: N(28, 2), ctrl: Cl(29, 1.5),
    leg: G([22, 0.2, 23, 0.6], [23, 1, 24, 3.6], [25, 0.2, 26, 1.6], [26, 2, 28, 1.6], [28, 2, 29, 3.5]) };
  const issues = { C: N(30, 0.5), chi: N(31, 0), E2: N(31, 2.5), non: Cl(32, 2), R: N(34, 0.5), chiR: N(35, 0), nonR: N(35, 2.5), surC: Cl(36, 2), err: N(37, 1),
    leg: G([30, 0.2, 31, 2.1], [31, 2.5, 33, 3.6], [34, 0.2, 35, 2.1], [35, 2.5, 36, 3.8], [37, 1, 37, 3.6]) };
  // le chien va de 0 à 55 sur la droite graduée ; les nombres de Fibonacci s'allument à son passage
  const puissances = { prop: N(38, 0.5), F: N(39, 1), chi: N(40, 0), axe: N(40, 3), bond: L(41, 0), chute: [L(41, 1.4), L(41, 2.6)], marche: [L(42, 0), L(44, 0)], binet: N(42, 0), f10: Cl(44, 0.2), sortie: L(44, 1),
    leg: G([38, 0.2, 38, 3.8], [39, 1, 40, 2.6], [40, 3, 41, 3.8], [42, 0, 43, 3.8], [44, 0.2, 45, 3.5]) };
  const trigo = { def: N(46, 0.5), th: Cl(47, 1), surC: N(48, 0), tr: N(48, 2), ex: N(49, 1.5), nil: N(50, 0.5), th7: Cl(51, 1), J: N(52, 2), ch: [N(53, 0), N(53, 1), N(53, 2)],
    leg: G([46, 0.2, 47, 0.6], [47, 1, 48, 1.6], [48, 2, 49, 3.6], [50, 0.2, 51, 0.6], [51, 1, 52, 1.6], [52, 2, 53, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, direction, propres, caract, diago, issues, puissances, trigo, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
