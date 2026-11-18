// PARTITION — « Logique et ensembles », MPSI, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'histoire', nom: "Une lettre de 1902", b0: 2, b1: 6 },
    { id: 'lois', nom: "Les lois de la logique", b0: 6, b1: 14 },
    { id: 'quantif', nom: "L’ordre des quantificateurs", b0: 14, b1: 22 },
    { id: 'cas', nom: "La disjonction des cas", b0: 22, b1: 26 },
    { id: 'analyse', nom: "L’analyse-synthèse", b0: 26, b1: 34 },
    { id: 'ensembles', nom: "Des assertions aux ensembles", b0: 34, b1: 46 },
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

  // dates de l'introduction du cours : Boole et De Morgan 1847, Frege 1879, Peano 1889, Russell 1902, Zermelo 1908
  const histoire = { lettre: N(2, 0.5), frise: N(3, 2), dates: [0, 1, 2, 3, 4].map((i) => ev(L(4, 0) + i * 0.7)), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  const lois = { tab: N(6, 0.5), egal: Cl(8, 2), lois: [N(10, 0.5), N(11, 0), N(12, 0), Cl(13, 0)], leg: G([6, 0.2, 8, 1.6], [8, 2, 9, 3.6], [10, 0.2, 11, 3.6], [12, 0, 13, 3.6]) };
  // P(x, y) : « y > x » (cours). Le point x va de −3 à 0, puis à 2 : le chien se place en x + 1. Enfin x passe à 4,5 et dépasse le chien resté en 3.
  const quantif = { neg: N(14, 0.5), neg2: Cl(15, 1), axe: N(15, 2.5), bond: L(15, 3), chute: [L(16, 0.4), L(16, 1.6)], x1: P(17, 0), y1: [L(17, 0.8), L(17, 2.3)], x2: P(18, 0), y2: [L(18, 0.8), L(18, 2.3)], vrai: Cl(18, 2.6), x3: P(19, 2), faux: N(20, 0.5), sortie: L(21, 2.2),
    leg: G([14, 0.2, 15, 2.2], [15, 2.6, 18, 2.2], [18, 2.6, 19, 1.6], [19, 2, 21, 3.6]) };
  const cas = { enonce: N(22, 0.5), fig: N(22, 2), c: [N(23, 1), N(23, 3), N(24, 1)], concl: Cl(25, 0), leg: G([22, 0.2, 23, 0.6], [23, 1, 24, 3.6], [25, 0, 25, 3.5]) };
  const analyse = { th: N(26, 0.5), an: [N(27, 2), N(28, 1), Cl(29, 0)], syn: [N(30, 0.5), Cl(31, 0.5)], fig: N(32, 0.3), gh: N(32, 2), leg: G([26, 0.2, 27, 1.6], [27, 2, 29, 3.6], [30, 0.2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  const ensembles = { eg: N(34, 0.5), i1: N(35, 0), i2: [N(35, 2.5), Cl(36, 2)], venn: N(38, 0.3), huit: Cl(39, 0), part: N(40, 0.5), russ: N(42, 0.5), r2: P(43, 0.5), zer: N(44, 0.5), dico: N(45, 0),
    leg: G([34, 0.2, 35, 3.6], [36, 0, 37, 3.6], [38, 0.2, 39, 3.6], [40, 0.2, 41, 3.6], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, histoire, lois, quantif, cas, analyse, ensembles, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
