// PARTITION — « Applications et relations binaires », MPSI, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 18, 26, 34, 38, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 46, FIN = 50;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'histoire', nom: "De la formule à la correspondance", b0: 2, b1: 6 },
    { id: 'imagesP', nom: "Image directe, image réciproque", b0: 6, b1: 14 },
    { id: 'transmet', nom: "Composer : ce qui se transmet", b0: 14, b1: 18 },
    { id: 'bij', nom: "Bijections et ensembles finis", b0: 18, b1: 26 },
    { id: 'cantor', nom: "Le théorème de Cantor", b0: 26, b1: 34 },
    { id: 'equiv', nom: "Les relations d’équivalence", b0: 34, b1: 38 },
    { id: 'ordre', nom: "Les relations d’ordre", b0: 38, b1: 46 },
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

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, histoire, imagesP, transmet, bij, cantor, equiv, ordre, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
