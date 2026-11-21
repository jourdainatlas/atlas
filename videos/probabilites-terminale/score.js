// PARTITION — « Probabilités », Terminale spécialité, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 18, 26, 34, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 46, FIN = 50;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'variable', nom: "Une variable aléatoire", b0: 2, b1: 6 },
    { id: 'esperance', nom: "Espérance, variance, écart-type", b0: 6, b1: 14 },
    { id: 'lineaire', nom: "Transformer une variable aléatoire", b0: 14, b1: 18 },
    { id: 'bernoulli', nom: "Le schéma de Bernoulli", b0: 18, b1: 26 },
    { id: 'combi', nom: "Les combinaisons", b0: 26, b1: 34 },
    { id: 'binomiale', nom: "La loi binomiale", b0: 34, b1: 46 },
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

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, variable, esperance, lineaire, bernoulli, combi, binomiale, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
