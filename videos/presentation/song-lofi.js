// BANDE-SON, habillage lo-fi — mêmes instants que la partition (score.js), autre musique : out/music-lofi.wav
// Le tempo est entendu à 60 à la noire (deux mesures de la partition font une mesure lente de 4 s) : batterie feutrée
// et balancée, basse ronde, accords de septième au piano électrique, souffle de vinyle, léger pleurage de bande.
//   LUFS=-14 node song-lofi.js
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const MU = require('./engine/music');
const Genre = require('./engine/audio/genres');
const sc = require('./score');
const { T, BEAT, DURATION, m } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus(), verb = bus(), dly = bus();
const lent = MU.makeClock({ bpm: 60, offset: 0.5 });          // mesure lente n : de T(2n) à T(2n + 2)
// MELODIE=ancienne : le thème et la grille d'accords de la première musique (score.js), dans l'habillage lo-fi
const ANC = process.env.MELODIE === 'ancienne';

// accords : une mesure lente par plan (ouverture, édifice ×2, quatre rubriques, partage, ambition, fin)
// Le style ajoute à chaque accord la note située dix demi-tons au-dessus de la PREMIÈRE note donnée : celle-ci est donc
// choisie pour que la note ajoutée appartienne à l'accord (sinon elle sonne faux : un mi bémol sur ré mineur, par exemple).
const NOUV = MU.makeChords(lent, {
  F: { notes: ['A3', 'C4', 'E4'], bass: 'F1' },             // fa majeur 9 : la do mi (+ sol)
  F6: { notes: ['A3', 'C4', 'D4'], bass: 'F1' },            // fa 6/9, sans mi : pour les mesures où la mélodie chante un fa
  Dm: { notes: ['D3', 'F3', 'A3'], bass: 'D1' },            // ré mineur 7 : ré fa la (+ do)
  Bb: { notes: ['A3', 'D4', 'F4'], bass: 'Bb0' },           // si bémol majeur 7 : la ré fa (+ sol)
  Bb6: { notes: ['G3', 'C4', 'D4'], bass: 'Bb0' },          // si bémol 6/9, sans la : pour les mesures où la mélodie chante un si bémol
  Gm: { notes: ['G3', 'Bb3', 'D4'], bass: 'G1' },           // sol mineur 7 : sol si bémol ré (+ fa)
  C: { notes: ['E3', 'G3', 'Bb3'], bass: 'C1' },            // do 9 : mi sol si bémol (+ ré)
  Am: { notes: ['A3', 'C4', 'E4'], bass: 'A1' },            // la mineur 7 : la do mi (+ sol)
}, [
  [0, 0, 4, 'F6'], [1, 0, 4, 'Dm'], [2, 0, 2, 'Bb'], [2, 2, 2, 'C'],
  [3, 0, 4, 'F6'], [4, 0, 4, 'Dm'], [5, 0, 4, 'Bb6'], [6, 0, 2, 'Gm'], [6, 2, 2, 'C'],
  [7, 0, 4, 'Am'], [8, 0, 2, 'Dm'], [8, 2, 2, 'Gm'], [9, 0, 4, 'Bb6'], [10, 0, 2, 'C'], [10, 2, 2, 'F'], [11, 0, 4, 'F'],
]);
// la grille d'origine, revoicée pour le piano électrique (le style ajoute une note à dix demi-tons de la première)
const VOIX = { 5: ['G3', 'A3', 'C4'], 0: ['D3', 'E3', 'G3'], 2: ['D3', 'F3', 'A3'], 10: ['G3', 'Bb3', 'D4'] };      // fa, do, ré mineur, si bémol
const ANCIENS = sc.chords.map((c) => ({ ...c, notes: VOIX[c.bass % 12].map(m), bass: c.bass % 12 + 24 + (c.bass % 12 >= 10 ? -12 : 0) }));
const chords = ANC ? ANCIENS : NOUV.chords, chordAt = ANC ? (t) => ANCIENS.find((c) => t >= c.t0 - 1e-6 && t < c.t1 - 1e-6) : NOUV.chordAt;

// ---------- l'accompagnement du style : batterie, basse, accords ----------
const { kicks } = Genre.play('lofi', { clock: lent, from: 1, to: 10, chordAt, buses: { drums, bass, pad, keys }, fill: [2, 6] });
Genre.play('lofi', { clock: lent, from: 0, to: 1, chordAt, buses: { drums, bass, pad, keys }, drums: false, bassline: false });        // ouverture : accords seuls
// charleston en doubles croches balancées, très bas, pour garder l'allant des images
{ const H = I.hat(false, 21), swing = 0.58;
  for (let b = 2; b < 21; b++) for (let s = 0; s < 8; s++) { const t = T(b, s / 2) + (s % 2 ? (swing - 0.5) * BEAT : 0); drums.addMono(H, t, s % 2 ? 0.035 : 0.05, 0.3); } }
// fin : la batterie s'arrête sur le temps fort ; un accord tenu et une note grave
for (const n of ANC ? ['F3', 'A3', 'C4', 'G4'] : ['F3', 'A3', 'C4', 'E4', 'G4']) { const x = I.epiano(m(n), 4.5, { index: 0.9, decay: 3 }); keys.addMono(x, sc.fin.t0, 0.16, (m(n) % 3 - 1) * 0.25); verb.addMono(x, sc.fin.t0, 0.12); }
bass.addMono(I.bass(m('F1') + 12, 3.2, { bright: 0.2, sub: 1 }), sc.fin.t0, 0.5);
drums.addMono(I.kick({ tail: 0.3, punch: 0.6 }), sc.fin.t0, 0.75); drums.addMono(I.rim(0.8, 3), sc.fin.t0, 0.3);
// nappe très douce sous tout le morceau
for (const c of chords) for (const n of c.notes) { const { L, R } = I.padNote(n + 12, c.t1 - c.t0, { cutoff: 900, attack: 0.5, release: 1.2 }); pad.addStereo(L, R, c.t0, 0.05); }

// ---------- une mélodie nouvelle, plus posée, au piano électrique (croches de la mesure lente = 0,5 s) ----------
const ep = (midi, d, idx = 1.2) => I.epiano(midi, d, { index: idx, decay: 1.3 });
const chante = (notes, g = 0.3) => { for (const n of notes) { const x = ep(n.midi, Math.max(0.5, n.dur)); lead.addMono(x, n.t, g); verb.addMono(x, n.t, g * 0.45); dly.addMono(x, n.t, g * 0.18); } };
const P = (motif, mesure) => MU.placeBar(lent, motif, mesure);
if (ANC) {
  chante(sc.melodie, 0.32);                                                   // le thème, pendant les rubriques
  chante(sc.boite.map((n) => ({ ...n, midi: n.midi - 12 })), 0.24);           // l'ouverture et la fin, une octave plus bas que la boîte à musique
  for (const n of sc.cuivres) { const g = I.guitar(n.midi, Math.max(0.7, n.dur), { bright: 0.45, seed: 7 }); lead.addMono(g, n.t, 1.0, -0.15); verb.addMono(g, n.t, 0.22); }   // son retour, à la guitare
  chante(sc.cuivres, 0.32);
} else if (process.env.MELODIE === 'melange') {
  // la mélodie lo-fi, où le thème d'origine revient par citations : une mesure sur deux pendant les rubriques, puis à la floraison
  const Q = (motif, mesure) => MU.placeBar(sc.clock, sc.HOOK[motif], mesure);      // un motif du thème, à sa vitesse d'origine (2 s)
  chante([
    ...Q('a', 6), ...P([['C5', 4, 2], ['A4', 6, 2]], 3),                           // Cours : le thème, puis une réponse posée
    ...P([['F5', 0, 3], ['E5', 3, 1], ['D5', 4, 2], ['A4', 6, 2]], 4),             // Exercices : la mélodie lo-fi seule
    ...Q('d', 10), ...P([['F5', 4, 2], ['D5', 6, 2]], 5),                          // Annales : le thème, puis la réponse
    ...P([['D5', 0, 3], ['Bb4', 3, 1]], 6), ...Q('b', 13),                         // Activités : la réponse d'abord, le thème pour conclure
    ...P([['E5', 0, 2], ['C5', 2, 2]], 7),                                         // partage : la suite est jouée par les messages
    ...Q('d', 18), ...P([['F5', 4, 2], ['D5', 6, 2]], 9),                          // l'arbre fleurit : le thème revient
    ...Q('fin', 20), { t: sc.fin.t0, dur: 3, midi: m('A5') }, { t: sc.fin.adresse, dur: 3, midi: m('C6') },
  ]);
} else chante([
  ...P([['A4', 0, 2], ['C5', 2, 1], ['D5', 3, 3], ['C5', 6, 2]], 3),          // Cours
  ...P([['F5', 0, 3], ['E5', 3, 1], ['D5', 4, 2], ['A4', 6, 2]], 4),          // Exercices
  ...P([['D5', 0, 2], ['F5', 2, 1], ['G5', 3, 3], ['F5', 6, 2]], 5),          // Annales
  ...P([['D5', 0, 3], ['Bb4', 3, 1], ['E5', 4, 4]], 6),                       // Activités
  ...P([['E5', 0, 2], ['C5', 2, 2]], 7),                                      // partage : la suite est jouée par les messages
  ...P([['A5', 0, 3], ['G5', 3, 1], ['F5', 4, 2], ['D5', 6, 2]], 9),          // l'arbre fleurit
  ...P([['E5', 0, 2], ['G5', 2, 2]], 10), { t: sc.fin.t0, dur: 3, midi: m('A5') }, { t: sc.fin.adresse, dur: 3, midi: m('C6') },
]);

// ---------- les événements de l'image, dans les mêmes timbres ----------
const note = (t, midi, g = 0.26, pan = 0) => { const x = ep(midi, 0.9, 0.9); lead.addMono(x, t, g, pan); verb.addMono(x, t, g * 0.5); };
// 1. le logo : trois notes, une par sommet
for (const n of sc.logo) note(n.t, n.midi, 0.4);
{ const b = I.bell(1568, 1.2, 2); fx.addMono(b, sc.logo[2].t, 0.12); verb.addMono(b, sc.logo[2].t, 0.14); }
fx.addMono(I.paperFwip(0.9, 3), sc.titre - 0.03, 0.14);
fx.addMono(I.rim(1, 2), sc.logo[2].t, 0.3); fx.addMono(I.thud(110, 0.05), sc.logo[2].t, 0.3);
// 2. l'édifice : un rang par croche, à la guitare étouffée ; le fil, au piano électrique
for (const n of sc.rangs) { const x = I.guitar(n.midi, 0.5, { bright: 0.35, sustain: 0.992, seed: 2 + n.i }); lead.addMono(x, n.t, 0.55, n.i % 2 ? 0.2 : -0.2); verb.addMono(x, n.t, 0.14); }
for (const n of sc.fil) note(n.t, n.midi - 12 - (n.k === 10 ? 1 : 0), 0.24);      // l'avant-dernière note : mi, et non fa, sur l'accord de do
{ const b = I.bell(1047, 1.6, 2); fx.addMono(b, sc.theoreme, 0.16); verb.addMono(b, sc.theoreme, 0.2); fx.addMono(I.thud(90, 0.07), sc.theoreme, 0.5); fx.addMono(I.rim(1.2, 9), sc.theoreme, 0.4); }
// 3. les rubriques : le compteur, l'arbre qui éclot, et ce qui se passe à l'écran
for (const r of sc.RUB) {
  for (let i = 0; i < 7; i++) fx.addMono(I.woodTick(1.2 + i * 0.08), r.compte[0] + (r.compte[1] - r.compte[0]) * Math.pow(i / 6, 0.7), 0.07 + i * 0.008, 0.2);
  fx.addMono(I.thud(100, 0.06), r.plante, 0.26); const c = chordAt(r.plante); for (const n of c.notes) { const g = I.guitar(n + 12, 1.1, { bright: 0.4 }); keys.addMono(g, r.plante, 0.4); verb.addMono(g, r.plante, 0.16); }
}
{ const E = sc.ECR, [co, ex, an, ac] = sc.RUB;
  E.cours.feuilles.forEach((d, i) => { fx.addMono(I.paperFwip(1.1, 5 + i), co.t0 + d - 0.05, 0.12); note(co.t0 + d, m(i ? 'E5' : 'C5'), 0.28, 0.2); });
  for (let i = 0; i < 9; i++) fx.addMono(I.woodTick(1.5 - i * 0.05), ex.t0 + E.exercices.defile[0] + (E.exercices.defile[1] - E.exercices.defile[0]) * (1 - Math.pow(1 - i / 8, 2)), 0.07, -0.2);
  fx.addMono(I.rim(1.1, 5), ex.t0 + E.exercices.clic, 0.2);
  E.exercices.etapes.forEach((d, i) => note(ex.t0 + d, m(['A4', 'C5', 'F5'][i]), 0.28, -0.2));
  const n = E.annales.mot.length; for (let i = 0; i < n; i++) fx.addMono(I.woodTick(1.9 + (i % 3) * 0.1), an.t0 + E.annales.frappe[0] + (E.annales.frappe[1] - E.annales.frappe[0]) * i / n, 0.1, 0.15);
  note(an.t0 + E.annales.bilan, m('A5'), 0.26, 0.2);
  E.activites.tuiles.forEach((d, i) => fx.addMono(I.rim(0.9 + i * 0.12, 6), ac.t0 + d, 0.14, i % 2 ? 0.3 : -0.3));
  for (let i = 0; i < E.activites.coups; i++) fx.addMono(I.woodTick(1.3), ac.t0 + E.activites.premier + i * E.activites.pas, 0.07, -0.3);
  note(ac.t0 + E.activites.resolu, m('G5'), 0.24); note(ac.t0 + E.activites.resolu + 0.12, m('C6'), 0.2);
}
// 4. partage et retours : chaque message qui se pose est une note de la mélodie
fx.addMono(I.rim(1, 7), sc.partage.pastille, 0.18);
{ const RET = ['A4', 'C5', 'E5', 'G5', 'D5', 'F5', 'A5', 'C6']; for (const n of sc.retours) note(n.t, ANC ? n.midi : m(RET[n.i]), 0.34, n.i % 2 ? 0.3 : -0.3); }
// 5. l'ambition : une note de guitare pour une fleur sur deux, sur la gamme de l'accord
{ const ARPS = { 10: ['D4', 'F4', 'G4', 'C5', 'D5', 'F5', 'G5', 'F5'], 0: ['E4', 'G4', 'C5', 'D5', 'E5', 'G5', 'C6', 'G5'] };       // les notes de l'accord du moment : si bémol 6/9, puis do 9
  for (const f of sc.fleurs) { if (f.j % 2) continue; const ARP = ARPS[chordAt(f.t).bass % 12] || ARPS[10]; const x = I.guitar(ANC ? f.midi : m(ARP[(f.j / 2) % 8]) + (f.j >= 24 && chordAt(f.t).bass % 12 === 10 ? 12 : 0), 0.7, { bright: 0.45, seed: 4 + f.j }); lead.addMono(x, f.t, 0.32, ((f.j % 8) - 3.5) / 8); verb.addMono(x, f.t, 0.14); }
  for (const c of chords) if (c.t0 >= T(18) && c.t0 < T(21)) for (const n of c.notes) { const s = I.strings(n + 12, c.t1 - c.t0, { attack: 0.35, release: 0.6, bright: 0.6 }); pad.addStereo(s.L, s.R, c.t0, 0.05); } }
// 6. fin
fx.addMono(I.rim(1, 8), sc.fin.adresse, 0.16);

// ---------- mixage ----------
MIX.sidechain([pad, keys], kicks);
const stems = { drums, bass, pad, keys, lead, fx, verb: reverb(verb, { room: 0.8, damp: 0.45 }), dly: pingpong(dly, 0.75, 0.35, 2800) };
const GAIN = { drums: 0.85, bass: 0.42, pad: 2.6, keys: 1.9, lead: 1.15, fx: 0.8, verb: 1, dly: 1 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 28);
Genre.fx('lofi', mix, { kicks, buses: [] });      // souffle de vinyle, pleurage de bande, aigus adoucis
MIX.fadeOut(mix, DURATION - 1.6, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : null });
MIX.writeWav(path.join(out, ANC ? 'music-lofi-theme.wav' : process.env.MELODIE === 'melange' ? 'music-lofi-melange.wav' : 'music-lofi.wav'), mix);
console.log(`out/music-lofi.wav (${DURATION.toFixed(2)} s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS` : ''})`);
