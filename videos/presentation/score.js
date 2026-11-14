// PARTITION — source unique des instants, pour la musique (song.js) comme pour l'image (film.js).
// « Présentation d'ATLAS », vertical 9:16, 120 à la noire : un temps = 0,5 s, une mesure = 2 s.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, placeBar, makeChords } = MU;

  const FPS = 30;
  const STYLE = 'flat';
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 120, offset: 0.5 });
  const { T, BEAT } = clock;
  const DURATION = T(23) + 1.5; // 44 s

  const S = {
    intro: [0, T(2)],
    edifice: [T(2), T(6)],
    rubriques: [T(6), T(14)],
    partage: [T(14), T(17)],
    ambition: [T(17), T(21)],
    fin: [T(21), DURATION],
  };

  const { chords, chordAt } = makeChords(clock, {
    F: { notes: ['A3', 'C4', 'F4'], bass: 'F2' },
    C: { notes: ['G3', 'C4', 'E4'], bass: 'C2' },
    Dm: { notes: ['A3', 'D4', 'F4'], bass: 'D2' },
    Bb: { notes: ['Bb3', 'D4', 'F4'], bass: 'Bb1' },
    Fmaj9: { notes: ['A3', 'C4', 'E4', 'G4'], bass: 'F1' },
  }, [
    [0, 0, 4, 'F'], [1, 0, 4, 'C'],
    [2, 0, 4, 'F'], [3, 0, 4, 'Dm'], [4, 0, 4, 'Bb'], [5, 0, 4, 'C'],
    [6, 0, 4, 'F'], [7, 0, 4, 'C'], [8, 0, 4, 'Dm'], [9, 0, 4, 'Bb'], [10, 0, 4, 'F'], [11, 0, 4, 'C'], [12, 0, 4, 'Dm'], [13, 0, 4, 'Bb'],
    [14, 0, 4, 'Dm'], [15, 0, 4, 'Bb'], [16, 0, 4, 'C'],
    [17, 0, 4, 'F'], [18, 0, 4, 'Dm'], [19, 0, 4, 'Bb'], [20, 0, 4, 'C'],
    [21, 0, 4, 'Fmaj9'], [22, 0, 4, 'Fmaj9'], [23, 0, 4, 'Fmaj9'],
  ]);

  // Le thème, sur une grille de croches : [note, croche de départ, durée en croches]
  const HOOK = {
    a: [['C5', 0, 2], ['A4', 2, 1], ['C5', 3, 1], ['F5', 4, 2], ['E5', 6, 1], ['D5', 7, 1]],
    b: [['C5', 0, 3], ['G4', 3, 1], ['C5', 4, 2], ['E5', 6, 2]],
    c: [['D5', 0, 2], ['A4', 2, 1], ['D5', 3, 1], ['F5', 4, 2], ['E5', 6, 1], ['D5', 7, 1]],
    d: [['D5', 0, 3], ['C5', 3, 1], ['Bb4', 4, 2], ['D5', 6, 2]],
    fin: [['D5', 0, 2], ['C5', 2, 1], ['Bb4', 3, 1], ['C5', 4, 4]],
  };

  // ---------- 1. Ouverture : le logo se trace, un sommet par temps ----------
  const logo = [
    { t: T(0, 0), midi: m('F4') },   // alpha
    { t: T(0, 1), midi: m('A4') },   // le point
    { t: T(0, 2), midi: m('C5') },   // oméga, le point rouge
  ];
  const titre = T(0, 3), sousTitre = T(1, 1);

  // ---------- 2. L'édifice : un rang par croche (15 rangs), puis le fil, une théorie par croche ----------
  const PENTA = ['F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4', 'C5', 'D5', 'F5', 'G5', 'A5', 'C6', 'D6'];
  const rangs = PENTA.map((n, i) => ({ t: T(2, 0) + i * BEAT / 2, midi: m(n), i }));
  // Chemin réel dans le graphe (toutes ces arêtes existent) : de la logique au théorème des nombres premiers.
  const FIL = ['log', 'zf', 'rel', 'ord', 'ordin', 'n', 'z', 'q', 'r', 'c', 'anc', 'nban'];
  const FILN = ['F4', 'G4', 'A4', 'C5', 'D5', 'F5', 'G5', 'A5', 'C6', 'D6', 'F6', 'A6'];
  const fil = FIL.map((id, k) => ({ id, t: T(4, 0) + (k + 1) * BEAT / 2, midi: m(FILN[k]), k }));
  const theoreme = fil[fil.length - 1].t; // = T(5, 2)

  // ---------- 3. Les rubriques : une toutes les six noires ----------
  const RUB = [
    { id: 'cours', nom: 'Cours', n: 71, quoi: 'chapitres de cours', sous: 'de la Seconde au Master' },
    { id: 'exercices', nom: 'Exercices', n: 3016, quoi: 'exercices corrigés', sous: 'par thème, par difficulté, par notion' },
    { id: 'annales', nom: 'Annales', n: 803, quoi: 'sujets d’annales', sous: 'le bac et 9 concours, à explorer par thème' },
    { id: 'activites', nom: 'Activités', n: 54, quoi: 'activités interactives', sous: 'casse-têtes, calcul mental, parcours du jour' },
  ].map((r, k) => {
    const t0 = T(6) + k * 8 * BEAT;       // deux mesures par rubrique
    return { ...r, k, t0, marche: [t0, t0 + 1.2], arrose: [t0 + 1.25, t0 + 2.5], plante: t0 + 3 * BEAT, compte: [t0 + 0.55, t0 + 1.5] };
  });
  // ce que montre l'écran de chaque rubrique (instants comptés depuis son début), repris par le son
  const ECR = {
    cours: { defile: [0.7, 1.7], feuilles: [2.0, 3.0] },                            // deux feuilles de l'édifice tombent sur la page : deux résultats
    exercices: { defile: [0.6, 1.7], clic: 1.8, etapes: [2.0, 2.5, 3.0] },          // la banque défile, s'arrête ; le corrigé se déplie
    annales: { defile: [0.6, 1.7], mot: 'déterminant', frappe: [1.9, 2.9], bilan: 3.0 },   // le tableau défile ; le moteur éclaire des sujets
    activites: { tuiles: [0.6, 0.85, 1.1, 1.35], coups: 8, premier: 1.2, pas: 0.27, resolu: 3.4 },
  };

  // ---------- 4. Partage et retours : huit messages se posent sur l'arbre, un par note ----------
  const entree = { jardinier: [0.2, 3.5], chien: [0.9, 2.6], papillon: [T(4, 1), T(5, 3.5)], sauts: [T(4, 2), T(5, 0)] };
  const partage = { t0: T(14), marche: [T(14), T(14) + 1.2], arrose: [T(14) + 1.25, T(14) + 2.6], plante: T(14, 3), pastille: T(15, 0), signaler: T(15, 2), saut: T(16, 0) };
  const RET = [[15, 2], [15, 3], [16, 0], [16, 1], [16, 2], [16, 2.5], [16, 3], [16, 3.5]];
  const RETN = ['D5', 'F5', 'E5', 'G5', 'C5', 'E5', 'G5', 'C6'];
  const retours = RET.map(([b, bt], i) => ({ t: T(b, bt), midi: m(RETN[i]), i }));

  // ---------- 5. L'ambition : les 38 théories fleurissent, une par double croche ----------
  const ambition = { t0: T(17), marche: [T(17), T(17) + 1.2], arbre: T(17, 1), fleurs: T(18, 2), pas: BEAT / 4, arrose: [T(17, 3), T(20, 3)] };
  const ARP = ['F4', 'A4', 'C5', 'D5', 'F5', 'A5', 'C6', 'A5'];
  const fleurs = [];
  for (let j = 0; j < 38; j++) fleurs.push({ t: ambition.fleurs + j * ambition.pas, j, midi: j % 2 === 0 ? m(ARP[(j / 2) % 8]) + (j >= 24 ? 12 : 0) : null });

  // ---------- 6. Fin ----------
  const fin = { t0: T(21), adresse: T(21, 2), signature: T(22, 0), chapeau: T(22, 2) };

  const ev = { titre, sousTitre, theoreme, fin: fin.t0 };

  const melodie = [
    ...placeBar(clock, HOOK.a, 6), ...placeBar(clock, HOOK.b, 7), ...placeBar(clock, HOOK.c, 8), ...placeBar(clock, HOOK.d, 9),
    ...placeBar(clock, HOOK.a, 10), ...placeBar(clock, HOOK.b, 11), ...placeBar(clock, HOOK.c, 12), ...placeBar(clock, HOOK.d, 13),
  ];
  const cuivres = [...placeBar(clock, HOOK.a, 19), ...placeBar(clock, HOOK.fin, 20), { t: T(21), dur: 3, midi: m('F5') }];
  const boite = [...placeBar(clock, HOOK.a, 0, 12), ...placeBar(clock, HOOK.b, 1, 12), ...placeBar(clock, HOOK.a, 21, 12), { t: T(22), dur: 3, midi: m('F6') }, { t: T(22, 2), dur: 3, midi: m('A6') }];

  const markers = {
    omega: { t: logo[2].t, sync: 'av' },
    edifice: T(2),
    theoreme: { t: theoreme, sync: 'av' },
    cours: RUB[0].plante, exercices: RUB[1].plante, annales: RUB[2].plante, activites: RUB[3].plante,
    partage: partage.pastille,
    retours: retours[4].t,
    ambition: T(18),
    fleuri: T(20, 3),
    fin: { t: fin.t0, sync: 'av' },
    adresse: fin.adresse + 1,
  };

  const SCORE = { FPS, STYLE, FORMAT, W, H, SAFE, DURATION, clock, T, BEAT, S, m, chords, chordAt, HOOK, ev, markers,
    logo, titre, sousTitre, entree, ECR, rangs, FIL, fil, theoreme, RUB, partage, retours, ambition, fleurs, fin, melodie, cuivres, boite };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
