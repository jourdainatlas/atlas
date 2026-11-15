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
  const base = makeClock({ bpm: 60, offset: 0.5 }), INTER = 4, BORNES = [2, 6, 10, 18, 22, 34, 38, 50];
  const clock = { ...base, T: (mesure, temps = 0) => { const t = base.T(mesure, temps); return t + INTER * BORNES.filter((b) => t >= base.T(b) - 1e-9).length; } };
  const L = (mesure, temps = 0) => clock.T(mesure, temps);
  const BEAT = clock.BEAT;
  const FIN = 54;                                         // mesure où commence l'écran de fin
  const DURATION = L(FIN + 3) + 2.5;                      // 263 s

  // ---------- les chapitres : [première mesure, mesure suivante]. Les phrases musicales font quatre mesures. ----------
  const CH = [
    { id: 'pente', nom: 'Une pente en chaque point', b0: 2, b1: 6 },
    { id: 'taux', nom: 'Le taux de variation', b0: 6, b1: 10 },
    { id: 'nombre', nom: 'Le nombre dérivé', b0: 10, b1: 18 },
    { id: 'fonction', nom: 'La fonction dérivée', b0: 18, b1: 22 },
    { id: 'formules', nom: 'Les formules', b0: 22, b1: 34 },
    { id: 'tangente', nom: 'La tangente', b0: 34, b1: 38 },
    { id: 'variations', nom: 'Les variations', b0: 38, b1: 50 },
  ].map((c, k) => ({ ...c, k, t0: L(c.b0), t1: L(c.b1) - INTER, plante: L(c.b1) - INTER }));
  if (String([...CH.map((c) => c.b0), 50]) !== String(BORNES)) throw new Error('BORNES ne suit pas les parties');
  const S = { ouverture: [0, L(2)], ...Object.fromEntries(CH.map((c) => [c.id, [c.t0, c.t1]])), bilan: [L(50), L(54)], fin: [L(54), DURATION] };

  // les événements que le son reprend : { t, g } ; g : 'note' (un élément apparaît), 'pas' (petit bois), 'cloche' (un résultat)
  const EV = [];
  const ev = (t, g = 'note') => { EV.push({ t, g }); return t; };

  const intertitres = [...CH.map((c) => ({ t: ev(c.t0 - INTER, 'titre'), nom: c.nom, rang: `${c.k + 1} / ${CH.length}` })), { t: ev(L(50) - INTER, 'titre'), nom: 'En résumé', rang: '' }];

  // ---------- ouverture ----------
  const logo = [L(0, 0), L(0, 1), L(0, 2)].map((t) => ev(t));           // alpha, le point, oméga
  const ouverture = { logo, titre: ev(L(0, 3)), sous: L(1, 1), colline: [L(2, 0.2), L(2, 1.2)] };

  // ---------- 1. la colline : le chien la parcourt, la pente sous ses pattes ----------
  const pente = { chien: [L(2, 1.2), L(5, 3.4)], leg: [[L(2, 0.3), L(3, 3.6)], [L(4), L(5, 3.6)]] };

  // ---------- 2. le taux de variation, sur f(x) = x², entre a = 1 et a + h = 2 ----------
  const taux = {
    courbe: [L(6, 0.3), L(6, 1.8)], A: ev(L(6, 2)), B: ev(L(7, 0)), secante: [L(7, 1), L(7, 2.2)],
    h: ev(L(8, 0)), df: ev(L(8, 1)), formule: ev(L(8, 2)), valeur: ev(L(9, 0), 'cloche'),
    leg: [[L(6, 0.3), L(7, 3.6)], [L(8), L(9, 3.6)]],
  };

  // ---------- 3. le nombre dérivé : h devient petit, puis la définition et le calcul ----------
  const HS = [1, 0.5, 0.1, 0.01];
  const nombre = {
    HS, arrets: HS.map((h, i) => (i ? ev(L(10 + i, 0), 'pas') : L(10, 0))),      // B arrive en a + h sur le premier temps
    glisse: 1.6,                                                                  // durée d'un glissement de B, qui finit sur le temps
    tangente: ev(L(13, 2), 'cloche'),
    def: ev(L(14, 0)), defFormule: ev(L(14, 2)),
    calcul: [ev(L(15, 2)), ev(L(16, 0)), ev(L(16, 2)), ev(L(17, 0))], resultat: ev(L(17, 2), 'cloche'),
    leg: [[L(10, 0.2), L(11, 3.6)], [L(12), L(13, 3.6)], [L(14, 0.2), L(17, 3.6)]],
  };

  // ---------- 4. la fonction dérivée : le point parcourt la parabole, sa pente trace la droite y = 2x ----------
  const fonction = {
    balaie: [L(18, 1), L(20, 0)], reperes: [-1, 0, 1].map((x) => ({ x, t: ev(L(18, 1) + (x + 1.5) / 3 * (L(20, 0) - L(18, 1)), 'pas') })),
    formule: ev(L(20, 1)), calcul: ev(L(20, 3)), resultat: ev(L(21, 1), 'cloche'),
    leg: [[L(18, 0.2), L(19, 3.6)], [L(20), L(21, 3.6)]],
  };

  // ---------- 5. les formules : dérivées usuelles, opérations, puis un exemple ----------
  const formules = {
    usuelles: [0, 1, 2, 3, 4, 5].map((i) => ev(L(22, 2) + i * 2)),                 // une ligne toutes les deux secondes
    operations: [0, 1, 2, 3, 4, 5].map((i) => ev(L(26, 1) + i * 2)),
    piege: [L(29, 1), L(29, 3.7)],
    exemple: { f: ev(L(30, 0.5)), termes: [ev(L(31, 0)), ev(L(31, 2)), ev(L(32, 0))], resultat: ev(L(32, 2), 'cloche') },
    leg: [[L(22, 0.2), L(25, 3.6)], [L(26), L(28, 3.6)], [L(29), L(29, 3.7)], [L(30, 0.2), L(31, 3.6)], [L(32), L(33, 3.6)]],
  };

  // ---------- 6. la tangente, sur f(x) = x² en a = 1 ----------
  const tangente = {
    trace: [L(34, 0.4), L(34, 1.6)], formule: ev(L(34, 2)), remplace: ev(L(35, 2)), resultat: ev(L(36, 0), 'cloche'),
    zoom: [L(36, 2), L(37, 2)], leg: [[L(34, 0.2), L(35, 3.6)], [L(36), L(37, 3.6)]],
  };

  // ---------- 7. les variations, sur f(x) = −x³ + 3x² + 2 ----------
  const variations = {
    courbe: [L(38, 0.3), L(38, 1.8)], chien: [L(38, 2), L(41, 2)],
    derivee: ev(L(42, 0)), facteur: ev(L(42, 2)), courbeD: [L(43, 0), L(43, 2)], zeros: [ev(L(44, 0), 'pas'), ev(L(44, 1), 'pas')], signes: [ev(L(44, 2)), ev(L(44, 3)), ev(L(45, 0))],
    tableau: ev(L(46, 0)), ligneD: [ev(L(46, 2)), ev(L(46, 2.5)), ev(L(46, 3)), ev(L(46, 3.5)), ev(L(47, 0))], fleches: [ev(L(47, 2)), ev(L(47, 3)), ev(L(48, 0))],
    valeurs: [ev(L(47, 2.5)), ev(L(47, 3.5))], min: ev(L(48, 2), 'cloche'), max: ev(L(49, 0), 'cloche'),
    leg: [[L(38, 0.2), L(39, 3.6)], [L(40), L(41, 3.6)], [L(42, 0.2), L(43, 3.6)], [L(44), L(45, 3.6)], [L(46, 0.2), L(47, 3.6)], [L(48), L(49, 3.6)]],
  };

  // ---------- bilan : à quoi sert la dérivée ----------
  const bilan = { titre: L(50, 0.2), cartes: [ev(L(50, 2)), ev(L(51, 2)), ev(L(52, 2))], phrase: ev(L(53, 1), 'cloche') };
  const fin = { t0: ev(L(54), 'cloche'), titre: L(54, 1), adresse: ev(L(55, 0)), chapeau: L(55, 3) };

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
