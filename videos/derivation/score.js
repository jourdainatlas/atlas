// PARTITION — source unique des instants, pour la musique (song.js) comme pour l'image (film.js).
// « La dérivation », Première spécialité, chapitre 4 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 14, 26, 34, 50, 58, 74];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const FIN = 78;                                         // mesure où commence l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 359 s

  // ---------- les chapitres : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'pente', nom: 'Une pente en chaque point', b0: 2, b1: 6 },
    { id: 'taux', nom: 'Le taux de variation', b0: 6, b1: 14 },
    { id: 'nombre', nom: 'Le nombre dérivé', b0: 14, b1: 26 },
    { id: 'fonction', nom: 'La fonction dérivée', b0: 26, b1: 34 },
    { id: 'formules', nom: 'Les formules', b0: 34, b1: 50 },
    { id: 'tangente', nom: 'La tangente', b0: 50, b1: 58 },
    { id: 'variations', nom: 'Les variations', b0: 58, b1: 74 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), 74]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(74), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat),
  // 'titre' (un intertitre commence), 'arbre' (un arbre est planté)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };
  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(74) - INTER, 'titre'), nom: 'En résumé', rang: '' }];

  // Règle de lecture : un texte reste à l'écran au moins trois secondes et demie, et une légende de deux lignes
  // près de huit ; deux textes longs n'apparaissent jamais dans la même mesure.

  // ---------- ouverture ----------
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 1), colline: [L(2, 0.2), L(2, 1.2)] };

  // ---------- 1. la colline : le chien la parcourt, la pente sous ses pattes ----------
  const pente = { chien: [L(2, 1.2), L(5, 3.4)], leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]] };

  // ---------- 2. le taux de variation, sur f(x) = x², entre a = 1 et a + h = 2 ----------
  const taux = {
    courbe: [L(6, 0.3), L(6, 1.8)], A: ev(L(6, 2)), B: ev(L(7, 0)), secante: [L(7, 1), L(7, 2.2)],
    h: ev(L(8, 1)), df: ev(L(9, 0)), formule: ev(L(10, 0)), valeur: ev(L(12, 0), 'cloche'),
    leg: [[L(6, 0.3), L(7, 3.6)], [L(8), L(9, 3.6)], [L(10), L(11, 3.6)], [L(12), L(13, 3.6)]],
  };

  // ---------- 3. le nombre dérivé : h devient petit, puis la définition, puis le calcul ----------
  const HS = [1, 0.5, 0.1, 0.01];
  const nombre = {
    HS, arrets: HS.map((h, i) => (i ? ev(L(14 + i, 0), 'pas') : L(14, 0))),      // B arrive en a + h sur le premier temps
    glisse: 1.6,                                                                  // durée d'un glissement de B, qui finit sur le temps
    tangente: ev(L(17, 2), 'cloche'),
    def: ev(L(18, 0)), defFormule: ev(L(19, 0)),
    calcul: [ev(L(22, 0)), ev(L(23, 0)), ev(L(23, 2)), ev(L(24, 0))], resultat: ev(L(25, 0), 'cloche'),
    leg: [[L(14, 0.2), L(15, 3.6)], [L(16), L(17, 3.6)], [L(20), L(21, 3.6)], [L(22), L(25, 3.6)]],
  };

  // ---------- 4. la fonction dérivée : le point parcourt la parabole, sa pente trace la droite y = 2x ----------
  const fonction = {
    balaie: [L(26, 1), L(28, 0)], reperes: [-1, 0, 1].map((x) => ({ x, t: ev(L(26, 1) + (x + 1.5) / 3 * (L(28, 0) - L(26, 1)), 'pas') })),
    aligne: ev(L(28, 0.5)), formule: ev(L(30, 0)), calcul: ev(L(31, 0)), resultat: ev(L(32, 0), 'cloche'),
    leg: [[L(26, 0.2), L(27, 3.6)], [L(28), L(29, 3.6)], [L(30), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 5. les formules : dérivées usuelles, opérations, le piège, puis un exemple ----------
  const formules = {
    usuelles: [0, 1, 2, 3, 4, 5].map((i) => ev(L(34, 2) + i * 2.5)),               // une ligne toutes les deux secondes et demie
    operations: [0, 1, 2, 3, 4, 5].map((i) => ev(L(38, 1) + i * 2.5)),
    piege: [L(42, 0.3), L(43, 3.7)],
    exemple: { f: ev(L(44, 0.5)), termes: [ev(L(45, 0)), ev(L(46, 0)), ev(L(47, 0))], resultat: ev(L(48, 0), 'cloche') },
    leg: [[L(34, 0.2), L(37, 3.6)], [L(38), L(41, 3.6)], [L(42), L(43, 3.7)], [L(44, 0.2), L(47, 3.6)], [L(48), L(49, 3.6)]],
  };

  // ---------- 6. la tangente, sur f(x) = x² en a = 1 ----------
  const tangente = {
    trace: [L(50, 0.4), L(50, 1.6)], formule: ev(L(51, 2)), remplace: ev(L(54, 0)), resultat: ev(L(55, 0), 'cloche'),
    zoom: [L(56, 0.5), L(57, 0.5)], leg: [[L(50, 0.2), L(53, 3.6)], [L(54), L(55, 3.6)], [L(56), L(57, 3.6)]],
  };

  // ---------- 7. les variations, sur f(x) = −x³ + 3x² + 2 ----------
  const variations = {
    courbe: [L(58, 0.3), L(58, 1.8)], chien: [L(58, 2), L(61, 2)],
    derivee: ev(L(62, 0)), facteur: ev(L(63, 0)), courbeD: [L(63, 2), L(64, 2)], zeros: [ev(L(64, 2), 'pas'), ev(L(64, 3), 'pas')], signes: [ev(L(65, 0)), ev(L(65, 1)), ev(L(65, 2))],
    tableau: ev(L(66, 0)), ligneD: [0, 1, 2, 3, 4].map((i) => ev(L(67, 0) + i * 0.6)), fleches: [ev(L(68, 0)), ev(L(68, 2)), ev(L(69, 0))],
    valeurs: [ev(L(68, 1)), ev(L(68, 3))], min: ev(L(70, 0), 'cloche'), max: ev(L(71, 0), 'cloche'),
    leg: [[L(58, 0.2), L(59, 3.6)], [L(60), L(61, 3.6)], [L(62, 0.2), L(63, 3.6)], [L(64), L(65, 3.6)], [L(66, 0.2), L(69, 3.6)], [L(70), L(73, 3.6)]],
  };

  // ---------- bilan : à quoi sert la dérivée ----------
  const bilan = { titre: L(74, 0.2), cartes: [ev(L(74, 2)), ev(L(75, 2)), ev(L(76, 2))], phrase: ev(L(77, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par chapitre ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = {
    entree: [L(0, 2), L(1, 3)],
    arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]),
    marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]),
  };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, pente, taux, nombre, fonction, formules, tangente, variations, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
