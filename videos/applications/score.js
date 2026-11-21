// PARTITION — « Applications », Maths approfondies, chapitre 2 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 22, 30, 34, 46];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const BILAN = 46, FIN = 50;                             // mesures où commencent le bilan et l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 243 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'appli', nom: "Une flèche et une seule", b0: 2, b1: 6 },
    { id: 'composer', nom: "Égalité, identité, composition", b0: 6, b1: 14 },
    { id: 'inj', nom: "Injective, surjective, bijective", b0: 14, b1: 22 },
    { id: 'sinus', nom: "Trois versions du sinus", b0: 22, b1: 30 },
    { id: 'reciproque', nom: "La bijection réciproque", b0: 30, b1: 34 },
    { id: 'images', nom: "Image directe, image réciproque", b0: 34, b1: 46 },
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

  // Exemples du cours ap-02 : x ↦ x² de ℝ dans ℝ ou dans ℝ₊ ; f : x ↦ x + 1 et g : x ↦ x² ; les trois versions du sinus et arcsinus ;
  // f(x) = x², A = [−1 ; 2], B = [1 ; 4], B′ = [−4 ; −1]. Propre à la vidéo : la droite y = 1/2 (le cours prend y = 1 et y = 2).
  const appli = { def: N(2, 0.5), oui: N(3, 1), fl: [N(3, 2), N(3, 3), N(4, 0)], non: N(4, 2), d2: N(4, 3), d0: N(5, 1), leg: G([2, 0.3, 3, 0.6], [3, 1, 4, 1.6], [4, 2, 5, 3.5]) };
  const composer = { eg: N(6, 0.5), a1: N(7, 1), a2: N(7, 3), diff: Cl(8, 1), id: N(9, 0), dia: N(10, 0.3), f: N(10, 2), g: N(11, 0), gf: Cl(11, 2), ex: [N(12, 1), N(12, 3)], asso: N(13, 1),
    leg: G([6, 0.2, 7, 0.6], [7, 1, 8, 3.6], [9, 0, 9, 3.8], [10, 0.2, 11, 3.8], [12, 0.5, 13, 0.6], [13, 1, 13, 3.6]) };
  const inj = { d: [N(14, 0.5), N(15, 2), N(17, 0)], m: [N(19, 0.3), N(20, 2)], leg: G([14, 0.2, 15, 1.6], [15, 2, 16, 3.6], [17, 0, 18, 3.6], [19, 0.2, 20, 1.6], [20, 2, 21, 3.6]) };
  // le chien parcourt la droite y = 1/2 de x = −4,3 à x = 9,5 : elle coupe cinq fois la courbe
  const sinus = { fig: N(22, 0.3), bond: L(22, 1), chute: [L(22, 2.4), L(23, 0.4)], marche: [L(23, 0.8), L(25, 0)], ninj: N(25, 0.3), sortie: L(25, 0.8), deux: N(26, 0.5), b: N(27, 1.5), c: N(28, 3),
    leg: G([22, 0.2, 23, 0.4], [23, 0.8, 25, 3.6], [26, 0.2, 27, 1.1], [27, 1.5, 28, 2.6], [28, 3, 29, 3.6]) };
  const reciproque = { def: N(30, 0.5), eq: N(31, 0.5), prop: N(32, 0), arc: Cl(33, 0), leg: G([30, 0.2, 31, 3.6], [32, 0, 32, 3.8], [33, 0, 33, 3.5]) };
  // le chien est x : il parcourt A = [−1 ; 2] sur l'axe des abscisses, son image x² décrit [0 ; 4] sur l'axe des ordonnées
  const images = { dir: N(34, 0.5), rec: N(35, 2), rem: N(37, 0), fig: N(38, 0.3), A: N(38, 2), bond: L(38, 2.5), chute: [L(39, 0), L(39, 1.2)], marche: [L(39, 1.6), L(41, 1)], fA: Cl(41, 1.5), sortie: L(41, 2), B: N(42, 2), fB: Cl(43, 2), vide: N(45, 0),
    leg: G([34, 0.2, 35, 1.6], [35, 2, 36, 3.6], [37, 0, 37, 3.6], [38, 0.2, 39, 1.2], [39, 1.6, 41, 1.1], [41, 1.5, 42, 1.6], [42, 2, 44, 3.6], [45, 0, 45, 3.5]) };

  const bilan = { titre: L(BILAN, 0.2), cartes: [ev(L(BILAN, 2)), ev(L(BILAN + 1, 2)), ev(L(BILAN + 2, 2))], phrase: ev(L(BILAN + 3, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, BILAN, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, appli, composer, inj, sinus, reciproque, images, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
