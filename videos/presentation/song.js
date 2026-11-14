// BANDE-SON — tout est synthétisé à partir de la partition (score.js) : out/music.wav
//   node song.js      (STEMS=1 écrit aussi out/stem-*.wav ; LUFS=-14 règle le niveau)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { T, BEAT, DURATION, m, clock } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const drums = bus(), bass = bus(), pad = bus(), keys = bus(), lead = bus(), fx = bus();
const verb = bus(), dly = bus();
const pan = (x) => (x / sc.W - 0.5) * 1.2;

// Deux habillages pour la même partition :  MUSIQUE=acoustique node song.js
//   par défaut : marimba et boîte à musique ;  acoustique : guitare, piano électrique, pizzicati, percussions au bord de caisse
const AC = process.env.MUSIQUE === 'acoustique';
const fort = (x, g) => { const y = new Float32Array(x.length); for (let i = 0; i < x.length; i++) y[i] = x[i] * g; return y; };
const Mar = (midi, o) => AC ? fort(I.guitar(midi, 0.9, { bright: 0.5, seed: 3 + (midi % 5) }), 1.9) : I.marimba(midi, o);
const Box = (midi) => AC ? I.epiano(midi, 1.4, { index: 1.1, decay: 1.4 }) : I.musicBox(midi);
const Pop = (p) => AC ? I.rim(1 + (p % 1) * 0.3) : I.pop(p);


// ---------- batterie ----------
const K = AC ? I.kick({ punch: 0.6, tail: 0.3 }) : I.kick(), KD = I.kick({ punch: AC ? 0.45 : 0.7, tail: 0.25 }), CL = AC ? I.rim(1, 4) : I.clap(), HC = [I.hat(false, 11), I.hat(false, 12)], HO = I.hat(true, 14), CR = I.crash(18);
const SH = [I.shaker(1, 15), I.shaker(0.6, 16)];
const kicks = [];
clock.eachStep(2, 21, 16, (t, b, s) => {
  if (b === 17) { if (s % 4 === 0) drums.addMono(SH[0], t, 0.16, 0.3); return; }                     // respiration avant l'ambition
  const leger = b < 6, plein = b >= 18;
  if (plein ? s % 4 === 0 : s % 8 === 0) { drums.addMono(leger ? KD : K, t, leger ? 0.6 : 0.9); kicks.push(t); }
  if (s % 8 === 4 && b >= 4) { drums.addMono(CL, t, leger ? 0.35 : 0.55); verb.addMono(CL, t, 0.25); }
  if (s % 2 === 0) drums.addMono(SH[(s / 2) % 2], t, leger ? 0.14 : 0.18, 0.35);
  else if (!leger) drums.addMono(SH[1], t, 0.08, 0.35);
  if (!leger && s % 4 === 2) drums.addMono(plein ? HO : HC[0], t, plein ? 0.1 : 0.16, -0.3);
  if (plein && s % 2 === 1) drums.addMono(HC[s % 4 === 1 ? 0 : 1], t, 0.1, -0.3);
});
for (let i = 0; i < 8; i++) drums.addMono(I.tom(220 - i * 16, 0.18), T(20, 2.5) + i * BEAT / 8, 0.25 + i * 0.03, (i - 4) / 8);   // roulement vers la fin
drums.addMono(CR, T(6), 0.22, -0.2); drums.addMono(CR, T(18), 0.25, 0.2); drums.addMono(CR, sc.fin.t0, 0.4, 0); drums.addMono(I.kick({ punch: 1.3, tail: 0.4 }), sc.fin.t0, 0.95); drums.addMono(CL, sc.fin.t0, 0.5);

// ---------- basse ----------
clock.eachStep(2, 21, 8, (t, b, s) => {
  const c = sc.chordAt(t); if (!c || b === 17) return;
  const R = c.bass + 12;
  if (b < 6) { if (s === 0 || s === 4) bass.addMono(I.pizz(R + 12), t, 0.5); return; }
  if (b >= 18) bass.addMono(I.bass(s % 2 ? R + 12 : R, BEAT / 2 * 0.8, { sub: 0.7 }), t, 0.55);
  else if (s === 0 || s === 3 || s === 4 || s === 7) bass.addMono(I.bass(s === 4 ? R + 7 : R, BEAT / 2 * (s % 4 === 0 ? 1.4 : 0.7)), t, 0.55);
});
bass.addMono(I.bass(m('F2'), 1.6, { bright: 0.3, sub: 0.8 }), T(17), 0.45);
bass.addMono(I.bass(m('F2'), 3, { bright: 0.3, sub: 1 }), sc.fin.t0, 0.5);

// ---------- nappes, et accords à contretemps ----------
for (const c of sc.chords) {
  const plein = c.bar >= 18 && c.bar < 21;
  const opts = plein ? { cutoff: 2400, attack: 0.06 } : { cutoff: 1100, attack: 0.4, release: 1.2 };
  for (const n of c.notes) { const { L, R } = I.padNote(n, c.t1 - c.t0, opts); pad.addStereo(L, R, c.t0, c.bar < 2 ? 0.07 : 0.09); }
}
clock.eachStep(6, 21, 8, (t, b, s) => {
  if (b === 17 || s % 2 === 0) return;
  const c = sc.chordAt(t); if (!c) return;
  for (const n of c.notes) keys.addMono(AC ? I.epiano(n + 12, 0.35, { index: 0.9, decay: 0.5 }) : I.pluck(n + 12), t, AC ? 0.1 : 0.12, s % 4 === 1 ? -0.25 : 0.25);
});

// ---------- boîte à musique : ouverture et fin ----------
for (const n of sc.boite) { const x = Box(n.midi); lead.addMono(x, n.t, 0.2); verb.addMono(x, n.t, 0.2); dly.addMono(x, n.t, 0.07); }

// ---------- 1. le logo : trois notes, une par sommet ; l'oméga s'allume sur la troisième ----------
for (const n of sc.logo) { const x = Mar(n.midi, { thock: 0.3 }); lead.addMono(x, n.t, 0.55); verb.addMono(x, n.t, 0.25); }
fx.addMono(I.bell(1568, 1.2, 2), sc.logo[2].t, 0.22); verb.addMono(I.bell(1568, 1.2, 2), sc.logo[2].t, 0.2);
fx.addMono(I.paperFwip(0.9, 3), sc.titre - 0.03, 0.2);

// ---------- 2. l'édifice : chaque rang est une note qui monte ; le fil, une note par théorie ----------
for (const n of sc.rangs) { const x = AC ? I.pizz(n.midi) : Mar(n.midi, { thock: 0.15 }); lead.addMono(x, n.t, 0.42, (n.i % 2 ? 0.2 : -0.2)); verb.addMono(x, n.t, 0.16); }
for (const n of sc.fil) { const x = I.epiano(n.midi, 0.5); lead.addMono(x, n.t, 0.34); verb.addMono(x, n.t, 0.18); dly.addMono(x, n.t, 0.06); }
{ const b1 = I.bell(2093, 1.6, 2), th = I.thud(90, 0.07); fx.addMono(b1, sc.theoreme, 0.3); verb.addMono(b1, sc.theoreme, 0.3); fx.addMono(th, sc.theoreme, 0.35); }

// ---------- 3. les rubriques : le thème au marimba ; le compteur cliquette ; l'arbre éclot sur le temps ----------
for (const n of sc.melodie) { const x = Mar(n.midi, { thock: 0 }); lead.addMono(x, n.t, 0.42); verb.addMono(x, n.t, 0.18); }
for (const r of sc.RUB) {
  for (let i = 0; i < 7; i++) fx.addMono(I.woodTick(1.2 + i * 0.08), r.compte[0] + (r.compte[1] - r.compte[0]) * Math.pow(i / 6, 0.7), 0.1 + i * 0.012, 0.2);
  fx.addMono(Pop(1 + r.k * 0.12), r.plante, 0.45); fx.addMono(I.thud(100, 0.06), r.plante, 0.3);
  const c = sc.chordAt(r.plante); for (const n of c.notes) { const g = I.guitar(n + 12, 0.9, { bright: 0.6 }); keys.addMono(g, r.plante, 0.5); verb.addMono(g, r.plante, 0.2); }
  fx.addMono(I.noiseSweep(0.8, 500, 2400, { q: 0.8, pink: true }), r.marche[0], 0.09);
}
// ce qui se passe à l'écran de chaque rubrique s'entend
{ const E = sc.ECR, [co, ex, an, ac] = sc.RUB, bell = (t, midi, g = 0.2) => { const x = Box(midi); lead.addMono(x, t, g); verb.addMono(x, t, g * 0.8); };
  E.cours.feuilles.forEach((d, i) => { fx.addMono(I.paperFwip(1.1, 5 + i), co.t0 + d - 0.05, 0.16); bell(co.t0 + d, m(i ? 'C6' : 'A5')); });
  for (let i = 0; i < 9; i++) fx.addMono(I.woodTick(1.5 - i * 0.05), ex.t0 + E.exercices.defile[0] + (E.exercices.defile[1] - E.exercices.defile[0]) * (1 - Math.pow(1 - i / 8, 2)), 0.1, -0.2);   // la liste ralentit
  fx.addMono(Pop(1.4), ex.t0 + E.exercices.clic, 0.22);
  E.exercices.etapes.forEach((d, i) => bell(ex.t0 + d, m(['D5', 'F5', 'A5'][i])));
  const n = E.annales.mot.length; for (let i = 0; i < n; i++) fx.addMono(I.woodTick(1.9 + (i % 3) * 0.1), an.t0 + E.annales.frappe[0] + (E.annales.frappe[1] - E.annales.frappe[0]) * i / n, 0.13, 0.15);
  bell(an.t0 + E.annales.bilan, m('C6'), 0.22);
  E.activites.tuiles.forEach((d, i) => fx.addMono(Pop(1 + i * 0.15), ac.t0 + d, 0.2, (i % 2 ? 0.3 : -0.3)));
  for (let i = 0; i < E.activites.coups; i++) fx.addMono(I.woodTick(1.3), ac.t0 + E.activites.premier + i * E.activites.pas, 0.09, -0.3);
  bell(ac.t0 + E.activites.resolu, m('F6'), 0.22); bell(ac.t0 + E.activites.resolu + 0.12, m('A6'), 0.16);
}

// ---------- 4. partage et retours : chaque message qui se pose est une note ----------
fx.addMono(Pop(1.3), sc.partage.pastille, 0.4);
{ const c = sc.chordAt(sc.partage.plante); for (const n of c.notes) { const g = I.guitar(n + 12, 1.2, { bright: 0.6 }); keys.addMono(g, sc.partage.plante, 0.5); verb.addMono(g, sc.partage.plante, 0.2); } }
for (const n of sc.retours) { const x = Mar(n.midi, { thock: 0.2 }), p = Pop(1.1 + n.i * 0.05); lead.addMono(x, n.t, 0.5, n.i % 2 ? 0.3 : -0.3); verb.addMono(x, n.t, 0.2); fx.addMono(p, n.t, 0.16, n.i % 2 ? 0.3 : -0.3); }
if (!AC) fx.addMono(I.boing(), sc.partage.saut - 0.02, 0.16);

// ---------- 5. l'ambition : l'arpège des fleurs, puis le thème aux cuivres ----------
fx.addMono(I.noiseSweep(T(18) - T(17, 2), 300, 7000, { q: 0.9, shape: (x) => x * x, pink: true }), T(17, 2), 0.3);
for (const f of sc.fleurs) { if (f.midi == null) continue; const x = Box(f.midi); lead.addMono(x, f.t, 0.22, ((f.j % 8) - 3.5) / 8); verb.addMono(x, f.t, 0.16); }
// le thème revient sans cuivres : marimba, boîte à musique à l'octave et piano électrique, sur des cordes et une guitare
for (const n of sc.cuivres) {
  const a = Mar(n.midi, { thock: 0.2 }), b = Box(n.midi + 12), c = I.epiano(n.midi, Math.max(0.5, n.dur * 0.9));
  lead.addMono(a, n.t, 0.34, -0.15); lead.addMono(b, n.t, 0.14, 0.2); lead.addMono(c, n.t, 0.17); verb.addMono(a, n.t, 0.2); verb.addMono(b, n.t, 0.16); dly.addMono(b, n.t, 0.05);
}
clock.eachStep(19, 21, 4, (t, b, s) => { const c = sc.chordAt(t); if (!c) return; c.notes.forEach((n, i) => { const g = I.guitar(n + 12, 0.8, { bright: 0.55 }); keys.addMono(g, t + i * 0.018, s % 2 ? 0.3 : 0.42, s % 2 ? 0.25 : -0.25); }); });
for (const c of sc.chords) if (c.bar >= 18 && c.bar < 21) for (const n of c.notes) { const s = I.strings(n + 12, c.t1 - c.t0, { attack: 0.2, release: 0.5 }); pad.addStereo(s.L, s.R, c.t0, c.bar >= 19 ? 0.085 : 0.05); }

// ---------- 6. fin ----------
fx.addMono(I.subBoom(1.6), sc.fin.t0, 0.4);
fx.addMono(Pop(1.2), sc.fin.adresse, 0.3);
{ const c = sc.chords[sc.chords.length - 3]; for (const n of c.notes) { const g = I.guitar(n + 12, 2.5, { bright: 0.5 }); keys.addMono(g, sc.fin.t0, 0.6); verb.addMono(g, sc.fin.t0, 0.3); } }

// ---------- mixage ----------
MIX.sidechain([pad, bass], kicks.filter((t) => t >= T(18)));
const stems = { drums, bass, pad, keys, lead, fx, verb: reverb(verb, { room: 0.84, damp: 0.3 }), dly: pingpong(dly, BEAT * 0.75, 0.38, 3500) };
const GAIN = { drums: 0.38, bass: 0.7, pad: 2.6, keys: 0.9, lead: 1.0, fx: 0.8, verb: 1, dly: 1 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 22);
MIX.fadeOut(mix, DURATION - 1.6, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : null });
MIX.writeWav(path.join(out, AC ? 'music-acoustique.wav' : 'music.wav'), mix);
console.log(`out/music.wav (${DURATION.toFixed(2)} s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS, drive ${M.drive.toFixed(2)}` : ''})`);
