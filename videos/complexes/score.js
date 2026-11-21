// PARTITION — « Nombres complexes », Terminale Maths expertes, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 26, 34, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 46, FIN = 50;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'manque', nom: "Un carré égal à −1", b0: 2, b1: 6 },
    { id: 'ensemble', nom: "L’ensemble des nombres complexes", b0: 6, b1: 14 },
    { id: 'calcul', nom: "Calculer avec i", b0: 14, b1: 22 },
    { id: 'conjugue', nom: "Le conjugué", b0: 22, b1: 26 },
    { id: 'quotient', nom: "Quotients et conjugaison", b0: 26, b1: 34 },
    { id: 'equations', nom: "Équations et polynômes", b0: 34, b1: 46 },
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

  // Exemples du cours me-02 : z = 2 + 3i ; (2 + 3i)/(1 + 2i) = 8/5 − i/5 ; z² − 4z + 5 = 0 (Δ = −4, solutions 2 ± i) ;
  // z³ − 4z² + 2z + 1 = (z − 1)(z² − 3z − 1). Propres à la vidéo : le produit (2 + 3i)(1 − 2i) isolé et (1 + i)³ = −2 + 2i.
  // le chien va de −2,5 à 2,5 sur la droite des réels ; x et x² s'affichent
  const manque = { q: N(2, 0.3), axe: N(2, 0.4), bond: L(2, 0.4), chute: [L(2, 1.8), L(3, 0)], marche: [L(3, 0.3), L(4, 1.5)], non: N(4, 2), i: Cl(4, 3.2), sortie: L(4, 2.2), leg: G([2, 0.3, 2, 3.8], [3, 0, 4, 1.6], [4, 2, 5, 3.5]) };
  const ensemble = { prop: N(6, 0.5), l: [N(7, 0), N(7, 2), N(8, 0), N(8, 2)], adm: N(9, 1), def: N(10, 0.5), re: N(11, 0), im: N(11, 2), ex: Cl(12, 0.5), eg: N(13, 0),
    leg: G([6, 0.2, 6, 3.8], [7, 0, 8, 3.8], [9, 0.5, 9, 3.8], [10, 0.2, 10, 3.8], [11, 0, 12, 3.6], [13, 0, 13, 3.5]) };
  const calcul = { regle: N(14, 0.5), p1: N(15, 0), p2: Cl(16, 0), id: N(16, 2.5), newton: N(18, 0.5), c1: N(19, 2), c2: N(20, 1.5), c3: Cl(21, 0.5),
    leg: G([14, 0.2, 14, 3.8], [15, 0, 16, 2.1], [16, 2.5, 17, 3.6], [18, 0.2, 19, 1.6], [19, 2, 21, 3.5]) };
  const conjugue = { def: N(22, 0.5), ex: N(23, 0.5), p: [N(24, 0), N(24, 1.5), N(25, 0), N(25, 1.5)], leg: G([22, 0.2, 23, 3.6], [24, 0, 24, 3.8], [25, 0, 25, 3.5]) };
  const quotient = { q: [N(26, 0.5), N(27, 1), N(28, 2), Cl(29, 2)], alg: Cl(30, 0.5), prop: N(31, 0.5), l: [N(31, 2), N(32, 0), N(32, 2), N(33, 0)],
    leg: G([26, 0.2, 27, 0.6], [27, 1, 28, 1.6], [28, 2, 30, 3.6], [31, 0.2, 33, 3.5]) };
  // le chien descend la parabole y = x² − 4x + 5 de x = 3,7 à son sommet (2 ; 1)
  const equations = { prop: N(34, 0.5), cas: N(35, 1), ex: N(37, 0.3), fig: N(37, 0.5), bond: L(37, 1), chute: [L(37, 2.4), L(38, 0.4)], marche: [L(38, 0.8), L(39, 2)], min: N(39, 2.5), delta: N(40, 0), z1: N(40, 2), z2: Cl(41, 1), sortie: L(41, 0.4), poly: N(42, 0.5), zn: N(43, 0.5), ex3: N(44, 0), fac: Cl(45, 0),
    leg: G([34, 0.2, 36, 3.6], [37, 0.2, 38, 0.6], [38, 0.8, 39, 3.8], [40, 0, 41, 3.6], [42, 0.2, 43, 3.6], [44, 0, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, manque, ensemble, calcul, conjugue, quotient, equations, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
