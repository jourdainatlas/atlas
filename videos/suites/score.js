// PARTITION — « Suites numériques », Terminale spécialité, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 30, 42, 54];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 54, FIN = 58;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'recurrence', nom: "Le principe de récurrence", b0: 2, b1: 6 },
    { id: 'rediger', nom: "Rédiger une récurrence", b0: 6, b1: 14 },
    { id: 'limite', nom: "La limite d’une suite", b0: 14, b1: 22 },
    { id: 'operations', nom: "Limites usuelles et formes indéterminées", b0: 22, b1: 30 },
    { id: 'theoremes', nom: "Comparer, encadrer, majorer", b0: 30, b1: 42 },
    { id: 'geometriques', nom: "Les suites géométriques", b0: 42, b1: 54 },
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

  // 1. les dominos du cours : le chien pousse le premier
  const recurrence = { dominos: N(2, 0.3), bond: L(2, 0.6), chute: [L(2, 2.0), L(2, 3.2)], pousse: P(3, 1.5), init: N(4, 0.6), hered: Cl(4, 2.6), leg: G([2, 0.3, 3, 3.6], [4, 0.2, 5, 3.5]) };
  // 2. l'exemple du cours : 1 + 2 + … + n = n(n + 1)/2 ; puis l'hérédité sans initialisation (3 divise 4ⁿ + 1)
  const rediger = { enonce: N(6, 0.5), init: [N(7, 2), Cl(8, 0.5)], hered: [N(9, 0), N(10, 0), Cl(10, 2.5)], concl: N(11, 2), piege: [N(12, 0.5), N(12, 2.5), P(13, 1.5)],
    leg: G([6, 0.2, 7, 1.4], [7, 2, 8, 3.6], [9, 0, 11, 1.4], [11, 2, 11, 3.8], [12, 0.2, 13, 3.6]) };
  // 3. u₀ = 1, uₙ₊₁ = uₙ/2 + 3 (cours) : uₙ = 6 − 5/2ⁿ ; bande de demi-largeur 0,5 (rang 4) puis 0,1 (rang 6)
  const limite = { fig: N(14, 0.3), def: N(14, 2), bond: L(14, 1), chute: [L(14, 2.4), L(15, 1.2)], marche: [L(15, 2), L(17, 1)], bande: [N(17, 2), P(19, 0)], rang: [Cl(18, 1), Cl(19, 2.5)], sortie: L(21, 2.2),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 1.4], [17, 2, 18, 3.7], [19, 0, 21, 3.6]) };
  // 4. limites de référence (proposition 2 du cours), deux combinaisons simples, puis l'indétermination du cours
  const operations = { ref: [N(22, 0.5), N(23, 2)], gen: N(24, 0.5), ops: N(24, 2.5), ex: N(26, 0.5), fi: P(27, 0), fact: N(27, 2), res: Cl(28, 2.5),
    leg: G([22, 0.2, 23, 1.6], [23, 2, 24, 2.1], [24, 2.5, 25, 3.6], [26, 0.2, 27, 1.6], [27, 2, 29, 3.5]) };
  // 5. comparaison (minoration, majoration ; n + sin n est propre à la vidéo), gendarmes (sin n / n, cours), convergence monotone
  const theoremes = { comp: [N(30, 0.5), N(31, 0.5)], cfig: N(32, 0), cres: Cl(33, 0), gend: N(34, 0.5), fig: N(35, 0), enc: N(35, 2.5), lim: Cl(37, 0), mono: N(38, 0.5), fig2: N(39, 0.5), ell: N(40, 0.5), six: Cl(41, 0),
    leg: G([30, 0.2, 31, 3.6], [32, 0, 33, 3.6], [34, 0.2, 35, 2.1], [35, 2.5, 37, 3.6], [38, 0.2, 39, 3.9], [40, 0.2, 41, 3.5]) };
  const geometriques = { cas: [N(42, 0.5), N(43, 2), N(45, 0), N(46, 2)], prop: N(48, 0.5), bern: N(50, 0), ex: N(51, 2), res: Cl(52, 2), leg: G([42, 0.2, 43, 1.6], [43, 2, 44, 3.6], [45, 0, 46, 1.6], [46, 2, 47, 3.6], [48, 0.2, 49, 3.6], [50, 0, 51, 1.6], [51, 2, 53, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, recurrence, rediger, limite, operations, theoremes, geometriques, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
