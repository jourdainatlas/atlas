// BANDE-SON — habillage lo-fi (celui de la vidéo de présentation), à 60 à la noire : batterie feutrée, basse ronde,
// accords de septième au piano électrique, souffle de vinyle. Les instants viennent de score.js : chaque élément qui
// apparaît à l'image joue une note de l'accord du moment, chaque résultat une cloche, chaque arbre un accord de guitare.
//   LUFS=-14 node song.js        ->  out/music.wav
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const MU = require('./engine/music');
const Genre = require('./engine/audio/genres');
const sc = require('./score');
const { L, DURATION, m, clock } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus(), verb = bus(), dly = bus();

// Accords. Le style ajoute à chaque accord la note située dix demi-tons au-dessus de la PREMIÈRE note donnée : elle est
// donc choisie pour que la note ajoutée appartienne à l'accord (piège n° 1 du mémo).
const DEF = {
  F6: { notes: ['A3', 'C4', 'D4'], bass: 'F1' },            // fa 6/9 : la do ré (+ sol)
  Dm: { notes: ['D3', 'F3', 'A3'], bass: 'D1' },            // ré mineur 7 : ré fa la (+ do)
  Bb6: { notes: ['G3', 'C4', 'D4'], bass: 'Bb0' },          // si bémol 6/9 : sol do ré (+ fa)
  Gm: { notes: ['G3', 'Bb3', 'D4'], bass: 'G1' },           // sol mineur 7 : sol si bémol ré (+ fa)
  C: { notes: ['E3', 'G3', 'Bb3'], bass: 'C1' },            // do 9 : mi sol si bémol (+ ré)
  Am: { notes: ['A3', 'C4', 'E4'], bass: 'A1' },            // la mineur 7 : la do mi (+ sol)
};
const PHA = ['F6', 'Dm', 'Bb6', 'C'], PHB = ['Am', 'Dm', 'Gm', 'C'];
const GRILLE = [[0, 0, 4, 'F6'], [1, 0, 4, 'C']];
const FIN = sc.FIN, NPH = (FIN - 2) / 4;                    // des phrases de quatre mesures, de la mesure 2 à l'écran de fin
for (let p = 0; p < NPH; p++) (p % 4 === 1 ? PHB : PHA).forEach((n, i) => GRILLE.push([2 + 4 * p + i, 0, 4, n]));
GRILLE.push([FIN, 0, 4, 'F6'], [FIN + 1, 0, 4, 'Dm'], [FIN + 2, 0, 4, 'Bb6'], [FIN + 3, 0, 4, 'F6']);
const { chords, chordAt } = MU.makeChords(clock, DEF, GRILLE);
const nomA = (b) => GRILLE.find((g) => g[0] === b)[3];

// ---------- l'accompagnement : batterie, basse, accords ----------
const FINS = sc.CH.map((c) => c.b1 - 1).concat([FIN - 1]);          // une relance avant chaque nouveau chapitre
const { kicks } = Genre.play('lofi', { clock, from: 2, to: FIN, chordAt, buses: { drums, bass, pad, keys }, fill: FINS });
Genre.play('lofi', { clock, from: 0, to: 2, chordAt, buses: { drums, bass, pad, keys }, drums: false, bassline: false });
Genre.play('lofi', { clock, from: FIN, to: FIN + 4, chordAt, buses: { drums, bass, pad, keys }, drums: false, bassline: false });
{ const Hh = I.hat(false, 21), swing = 0.58;                   // charleston balancé, très bas
  for (let b = 2; b < FIN; b++) for (let s = 0; s < 16; s++) { const t = L(b, s / 4) + (s % 2 ? (swing - 0.5) * 0.5 : 0); drums.addMono(Hh, t, s % 2 ? 0.03 : 0.045, 0.3); } }
for (const c of chords) for (const n of c.notes) { const { L: l, R } = I.padNote(n + 12, c.t1 - c.t0, { cutoff: 900, attack: 0.5, release: 1.2 }); pad.addStereo(l, R, c.t0, 0.05); }

// ---------- une mélodie discrète : un motif par accord, deux mesures sur quatre ----------
const MOTIFS = {
  F6: [[['A4', 0, 2], ['C5', 2, 1], ['D5', 3, 3]], [['C5', 0, 3], ['A4', 3, 1], ['G4', 4, 4]]],
  Dm: [[['F5', 0, 3], ['D5', 3, 1], ['C5', 4, 2], ['A4', 6, 2]], [['D5', 0, 2], ['F5', 2, 2], ['A4', 4, 4]]],
  Bb6: [[['D5', 0, 2], ['C5', 2, 1], ['G4', 3, 3]], [['G4', 0, 2], ['C5', 2, 2], ['D5', 4, 4]]],
  C: [[['E5', 0, 3], ['D5', 3, 1], ['C5', 4, 4]], [['G4', 0, 2], ['C5', 2, 2], ['E5', 4, 4]]],
  Am: [[['E5', 0, 2], ['C5', 2, 2], ['A4', 4, 4]], [['E5', 0, 2], ['C5', 2, 2], ['A4', 4, 4]]],
  Gm: [[['D5', 0, 3], ['Bb4', 3, 1], ['G4', 4, 4]], [['D5', 0, 3], ['Bb4', 3, 1], ['G4', 4, 4]]],
};
// contrôle : aucune note de mélodie un demi-ton au-dessus d'une note de l'accord (notes données, note ajoutée, basse)
for (const [nom, vs] of Object.entries(MOTIFS)) { const d = DEF[nom], acc = [...d.notes.map(m), m(d.notes[0]) + 10, m(d.bass)];
  for (const v of vs) for (const [n] of v) for (const a of acc) if (((m(n) - a) % 12 + 12) % 12 === 1) throw new Error(`frottement : ${n} sur ${nom}`); }
const ep = (midi, d, idx = 1.2) => I.epiano(midi, d, { index: idx, decay: 1.3 });
const chante = (notes, g = 0.24) => { for (const n of notes) { const x = ep(n.midi, Math.max(0.5, n.dur)); lead.addMono(x, n.t, g); verb.addMono(x, n.t, g * 0.45); dly.addMono(x, n.t, g * 0.18); } };
for (let p = 0; p < NPH; p++) for (const i of p % 2 ? [0, 2] : [1, 3]) { const b = 2 + 4 * p + i; chante(MU.placeBar(clock, MOTIFS[nomA(b)][p % 4 < 2 ? 1 : 0], b)); }
chante(MU.placeBar(clock, MOTIFS.F6[0], FIN)); chante(MU.placeBar(clock, MOTIFS.Bb6[1], FIN + 2));

// ---------- les événements de l'image ----------
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
let rang = 0;
for (const e of sc.EV) {
  const c = chordAt(Math.min(e.t, DURATION - 0.01)), tons = [...c.notes, c.notes[0] + 10].map((n) => n + 12).sort((a, b) => a - b), pan = (rang % 3 - 1) * 0.25;
  if (e.g === 'note') { const x = ep(tons[rang % tons.length] + (rang % 8 > 3 ? 12 : 0), 0.9, 0.9); lead.addMono(x, e.t, 0.2, pan); verb.addMono(x, e.t, 0.1); rang++; }
  else if (e.g === 'pas') fx.addMono(I.woodTick(1.3 + (rang % 3) * 0.1), e.t, 0.12, pan);
  else if (e.g === 'cloche') { const b = I.bell(hz(tons[tons.length - 1] + 12), 1.4, 2); fx.addMono(b, e.t, 0.1); verb.addMono(b, e.t, 0.14); const x = ep(tons[0] + 12, 1.2, 0.9); lead.addMono(x, e.t, 0.2); verb.addMono(x, e.t, 0.1); }
  else if (e.g === 'titre') {                                 // la mesure de l'intertitre : l'accord de dominante tenu, égrené sur les quatre temps
    fx.addMono(I.paperFwip(0.8, 3), e.t, 0.1); bass.addMono(I.bass(m(DEF.C.bass) + 12, 3.4, { bright: 0.2, sub: 1 }), e.t, 0.42);
    drums.addMono(I.kick({ tail: 0.3, punch: 0.5 }), e.t, 0.5);
    tons.forEach((n, j) => { const x = ep(n, 1.6, 0.8); lead.addMono(x, e.t + j, 0.17, (j % 3 - 1) * 0.25); verb.addMono(x, e.t + j, 0.11); });
    { const Hh = I.hat(false, 23); for (let s8 = 0; s8 < 8; s8++) drums.addMono(Hh, e.t + s8 * 0.5 + (s8 % 2 ? 0.04 : 0), s8 % 2 ? 0.025 : 0.04, 0.3); }
    fx.addMono(I.woodTick(1.2), e.t + 3, 0.09); fx.addMono(I.woodTick(1.35), e.t + 3.5, 0.11); }
  else if (e.g === 'arbre') { fx.addMono(I.thud(100, 0.06), e.t, 0.24); for (const n of c.notes) { const g = I.guitar(n + 12, 1.1, { bright: 0.4 }); keys.addMono(g, e.t, 0.36); verb.addMono(g, e.t, 0.14); } }
}
// ouverture : un froissement à l'apparition du titre ; fin : la batterie s'arrête sur le temps fort, un accord tenu
fx.addMono(I.paperFwip(0.9, 3), sc.ouverture.titre - 0.03, 0.14); fx.addMono(I.rim(1, 2), sc.ouverture.logo[2], 0.3); fx.addMono(I.thud(110, 0.05), sc.ouverture.logo[2], 0.3);
for (const n of ['F3', 'A3', 'C4', 'D4', 'G4']) { const x = I.epiano(m(n), 4.5, { index: 0.9, decay: 3 }); keys.addMono(x, sc.fin.t0, 0.16, (m(n) % 3 - 1) * 0.25); verb.addMono(x, sc.fin.t0, 0.1); }
bass.addMono(I.bass(m('F1') + 12, 3.2, { bright: 0.2, sub: 1 }), sc.fin.t0, 0.5);
drums.addMono(I.kick({ tail: 0.3, punch: 0.6 }), sc.fin.t0, 0.75); drums.addMono(I.rim(0.8, 3), sc.fin.t0, 0.3);

// ---------- mixage ----------
MIX.sidechain([pad, keys], kicks);
const stems = { drums, bass, pad, keys, lead, fx, verb: reverb(verb, { room: 0.8, damp: 0.45 }), dly: pingpong(dly, 0.75, 0.35, 2800) };
const GAIN = { drums: 0.8, bass: 0.42, pad: 2.6, keys: 1.9, lead: 1.05, fx: 0.8, verb: 1, dly: 1 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 28);
Genre.fx('lofi', mix, { kicks, buses: [] });
MIX.fadeOut(mix, DURATION - 2.2, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : null });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`out/music.wav (${DURATION.toFixed(2)} s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS` : ''})`);
