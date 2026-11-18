// PARTITION — « Ensembles et logique », Maths approfondies, chapitre 1 du cours du site. Paysage 16:9, pour YouTube.
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
    { id: 'propositions', nom: "Propositions et connecteurs", b0: 2, b1: 6 },
    { id: 'implication', nom: "Implication et équivalence", b0: 6, b1: 14 },
    { id: 'raisonner', nom: "Trois façons de raisonner", b0: 14, b1: 22 },
    { id: 'quantif', nom: "Les quantificateurs", b0: 22, b1: 26 },
    { id: 'inclusion', nom: "Ensembles et inclusion", b0: 26, b1: 34 },
    { id: 'operations', nom: "Opérations sur les ensembles", b0: 34, b1: 46 },
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

  const propositions = { def: N(2, 0.5), ex: [N(3, 0), N(3, 1.5)], tab: N(4, 0.3), leg: G([2, 0.3, 3, 3.6], [4, 0, 5, 3.5]) };
  // exemple du cours : « n est un multiple de 4 ⇒ n est pair » ; le chien est l'élément x
  const implication = { tab: N(6, 0.5), faux: P(8, 0), fig: N(9, 0), bond: L(9, 0.3), chute: [L(9, 1.7), L(9, 2.9)], suff: Cl(10, 0), marche: [L(10, 2.5), L(11, 2)], nec: Cl(11, 2), sortie: L(12, 0.4), equiv: N(12, 2), cns: N(13, 0.5),
    leg: G([6, 0.2, 7, 3.6], [8, 0, 8, 3.8], [9, 0, 10, 2.2], [10, 2.5, 12, 0.2], [12, 0.6, 13, 3.6]) };
  const raisonner = { contra: N(14, 0.5), cex: [N(15, 2), N(16, 2), Cl(17, 1)], absurde: N(18, 0.5), abs2: N(19, 0.5), contre: N(20, 0.5), cval: Cl(21, 0),
    leg: G([14, 0.2, 15, 1.6], [15, 2, 17, 3.6], [18, 0.2, 19, 3.6], [20, 0.2, 21, 3.6]) };
  const quantif = { d1: N(22, 0.5), d2: N(22, 2.5), ex: N(23, 2), neg: Cl(24, 2), leg: G([22, 0.2, 23, 1.6], [23, 2, 24, 1.6], [24, 2, 25, 3.5]) };
  const inclusion = { ext: N(26, 0.5), comp: N(27, 2), incl: N(28, 2), fig: N(29, 0.5), dbl: N(30, 0.5), vide: N(32, 0.5), symb: N(32, 2.5), leg: G([26, 0.2, 27, 1.6], [27, 2, 28, 1.6], [28, 2, 29, 3.6], [30, 0.2, 31, 3.6], [32, 0.2, 33, 3.5]) };
  const operations = { fig: N(34, 0.3), bond: L(34, 0.8), chute: [L(34, 2.2), L(35, 0.8)], diff: N(35, 1.2), m1: [L(36, 0.5), L(37, 0)], inter: Cl(37, 0), m2: [L(38, 2), L(39, 2)], union: Cl(39, 2.6), sortie: L(40, 2.4),
    morgan: N(42, 0.5), mfig: N(42, 2), parties: N(44, 0.5), deux: Cl(45, 0), leg: G([34, 0.2, 35, 3.9], [36, 0.2, 38, 1.6], [38, 2, 39, 2.2], [39, 2.6, 41, 3.6], [42, 0.2, 43, 3.6], [44, 0.2, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, propositions, implication, raisonner, quantif, inclusion, operations, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
