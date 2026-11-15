// PARTITION — « Les équations », Seconde, chapitre 4 du cours du site. Paysage 16:9, pour YouTube.
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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 10, 22, 34, 42, 66, 82];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const FIN = 86;                                         // mesure où commence l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 387 s

  // ---------- les parties : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'vocab', nom: 'Une égalité, une inconnue', b0: 2, b1: 10 },
    { id: 'balance', nom: 'Le principe de la balance', b0: 10, b1: 22 },
    { id: 'methode', nom: 'La méthode de résolution', b0: 22, b1: 34 },
    { id: 'cas', nom: 'Deux cas particuliers', b0: 34, b1: 42 },
    { id: 'produit', nom: 'Les équations produit', b0: 42, b1: 66 },
    { id: 'quotient', nom: 'Les équations quotient', b0: 66, b1: 82 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), 82]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(82), L(FIN)], fin: [L(FIN), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat),
  // 'titre' (un intertitre commence), 'arbre' (un arbre est planté)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };
  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(82) - INTER, 'titre'), nom: 'En résumé', rang: '' }];

  // Règle de lecture : un texte reste à l'écran au moins trois secondes et demie, et une légende de deux lignes
  // près de huit ; deux textes longs n'apparaissent jamais dans la même mesure.

  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 0.5) };

  // ---------- 1. le vocabulaire, sur 5x − 3 = 2x + 9 ----------
  const vocab = {
    eq: ev(L(2, 0.5)), membres: [ev(L(2, 2)), ev(L(2, 3))],
    tests: [{ l: ev(L(4, 2)), r: ev(L(4, 3)), v: ev(L(5, 1), 'pas') }, { l: ev(L(6, 0)), r: ev(L(6, 1)), v: ev(L(6, 3), 'cloche') }],
    leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)], [L(6), L(7, 3.6)], [L(8), L(9, 3.6)]],
  };

  // ---------- 2. la balance : 3 sacs + 2 = 1 sac + 10, chaque sac pèse x ; puis la propriété ----------
  const balance = {
    trace: [L(10, 0.3), L(10, 1.3)], objets: L(10, 1.5), ligne0: ev(L(10, 3)),
    faute: ev(L(11, 2), 'pas'),                                          // un sac retiré d'un seul côté : la balance penche
    sac: ev(L(12, 2), 'pas'), ligne1: ev(L(12, 3)),                      // le même sac retiré de l'autre côté
    poids: ev(L(13, 2), 'pas'), ligne2: ev(L(13, 3)),                    // deux poids retirés de chaque côté
    moitie: ev(L(14, 2), 'pas'), ligne3: ev(L(14, 3), 'cloche'),         // on garde la moitié de chaque plateau
    prop: ev(L(16, 0)), puces: [ev(L(17, 0)), ev(L(18, 0))],
    leg: [[L(10, 0.3), L(11, 1.6)], [L(11, 2), L(13, 1.6)], [L(13, 2), L(15, 3.6)], [L(20), L(21, 3.6)]],
  };

  // ---------- 3. la méthode, sur 5x − 3 = 2x + 9 : une ligne par mesure ----------
  const methode = {
    lignes: [ev(L(22, 0.5)), ev(L(23, 0)), ev(L(24, 0)), ev(L(25, 0)), ev(L(26, 0)), ev(L(27, 0)), ev(L(28, 0), 'cloche')],
    verif: [ev(L(30, 0)), ev(L(30, 1)), ev(L(30, 2), 'cloche')],
    leg: [[L(22, 0.2), L(25, 3.6)], [L(26), L(29, 3.6)], [L(30), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 4. deux cas particuliers ----------
  const cas = {
    g: [ev(L(34, 0.5)), ev(L(35, 0)), ev(L(36, 0), 'pas')], d: [ev(L(38, 0)), ev(L(39, 0)), ev(L(40, 0)), ev(L(40, 2), 'cloche')],
    leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)], [L(38), L(39, 3.6)], [L(40), L(41, 3.6)]],
  };

  // ---------- 5. les équations produit : la propriété, un exemple, puis x² = 9 (huit mesures chacun) ----------
  const produit = {
    prop: ev(L(42, 2)), formule: ev(L(43, 2)), nuls: [ev(L(44, 2)), ev(L(45, 0))], douze: [ev(L(46, 0)), ev(L(46, 2)), ev(L(47, 0)), ev(L(47, 2))],
    ex: ev(L(50, 0.5)), branches: ev(L(51, 0)), ga: [ev(L(52, 0)), ev(L(53, 0)), ev(L(54, 0), 'cloche')], dr: [ev(L(52, 0)), ev(L(54, 2), 'cloche')], piege: [L(56, 0.3), L(57, 3.7)], dev: ev(L(56, 2), 'pas'),
    carre: [ev(L(58, 0.5)), ev(L(59, 2)), ev(L(61, 0)), ev(L(62, 2))], sol: [ev(L(63, 0), 'cloche'), ev(L(63, 2), 'cloche')],
    leg: [[L(42, 0.2), L(45, 3.6)], [L(46), L(49, 3.6)], [L(50, 0.2), L(53, 3.6)], [L(54), L(55, 3.6)], [L(56), L(57, 3.6)], [L(58, 0.2), L(61, 3.6)], [L(62), L(65, 3.6)]],
  };

  // ---------- 6. les équations quotient : définition et propriété, puis l'exemple (huit mesures chacun) ----------
  const quotient = {
    def: ev(L(66, 0.5)), prop: ev(L(70, 0)), contraste: [ev(L(72, 0)), ev(L(73, 0))],
    ex: ev(L(74, 0.3)), e1: [ev(L(75, 0)), ev(L(75, 2), 'pas')], e2: [ev(L(76, 2)), ev(L(77, 2)), ev(L(78, 2))], e3: ev(L(79, 2), 'pas'), sol: ev(L(80, 2), 'cloche'),
    leg: [[L(66, 0.2), L(69, 3.6)], [L(70), L(73, 3.6)], [L(74, 0.2), L(78, 3.6)], [L(79), L(81, 3.6)]],
  };

  const bilan = { titre: L(82, 0.2), cartes: [ev(L(82, 2)), ev(L(83, 2)), ev(L(84, 2))], phrase: ev(L(85, 1), 'cloche') };
  const fin = { t0: ev(L(FIN), 'cloche'), titre: L(FIN, 1), adresse: ev(L(FIN + 1, 0)), chapeau: L(FIN + 1, 3) };

  // ---------- le jardin du bas : un arbre par partie ; le jardinier arrose, puis rejoint l'emplacement suivant ----------
  const jardin = { entree: [L(0, 2), L(1, 3)], arrose: CH.map((c) => [c.t1 - 1.7, c.t1 + 0.6]), marche: CH.map((c) => [c.t1 + 0.9, c.t1 + 2.6]) };
  for (const c of CH) ev(c.plante, 'arbre');

  const markers = { omega: { t: logo[2], sync: 'av' }, fin: { t: fin.t0, sync: 'av' } };
  for (const c of CH) markers[c.id] = { t: c.t0 };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, clock, L, BEAT, DURATION, FIN, INTER, intertitres, S, CH, EV, m, markers,
    ouverture, vocab, balance, methode, cas, produit, quotient, bilan, fin, jardin };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
