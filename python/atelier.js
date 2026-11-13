// Atelier Python d'ATLAS : éditeur, variables et console sous un exercice.
// Chargé seulement sur les pages Python ; Python lui-même (Pyodide) n'est téléchargé qu'au premier clic.

const CSS = `
.atelier { --at-vert: var(--corrige-filet); --at-orange: var(--revoir); --at-rouge: var(--rouge); --at-bleu: var(--c-nb);
  border: 1px solid var(--filet); border-radius: 10px; background: var(--surface); padding: 12px; margin-top: 12px;
  font-family: var(--f-ui); font-size: 14px; color: var(--encre); }
.at-barre { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; }
.at-barre button { font: 600 13.5px var(--f-ui); padding: 5px 12px; border-radius: 6px; cursor: pointer; background: var(--surface); }
.at-barre button:disabled { opacity: .4; cursor: default; }
.at-executer { background: var(--at-vert) !important; color: var(--surface); border: 1px solid var(--at-vert); }
.at-executer:not(:disabled):hover { filter: brightness(1.08); }
.at-deboguer { color: var(--at-orange); border: 1px solid var(--at-orange); font-weight: 500 !important; }
.at-arreter { color: var(--at-rouge); border: 1px solid var(--at-rouge); font-weight: 500 !important; }
.at-barre kbd { font: 500 11.5px var(--f-mono); opacity: .85; margin-left: 2px; }
.at-etat { font-size: 13px; color: var(--encre-3); display: inline-flex; align-items: center; gap: 6px; }
.at-etat.actif::before { content: ""; width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--encre-3); border-right-color: transparent; animation: at-tourne .8s linear infinite; }
@keyframes at-tourne { to { transform: rotate(360deg); } }
.at-droite { margin-left: auto; display: flex; gap: 12px; align-items: center; }
.at-lien { border: 0 !important; background: none !important; padding: 2px 0 !important; color: var(--encre-3); font-weight: 400 !important; font-size: 12.5px !important; text-decoration: underline dotted; text-underline-offset: 3px; }
.at-lien:hover { color: var(--encre); }
.at-pas { display: none; gap: 4px; align-items: center; }
.atelier.debogage .at-pas { display: inline-flex; }
.atelier.debogage .at-executer, .atelier.debogage .at-deboguer { display: none; }
.at-pas button { font: 500 13px var(--f-mono); padding: 4px 9px; color: var(--at-orange); border: 1px solid var(--at-orange); }
.at-pas span { font-size: 13px; color: var(--encre-2); min-width: 92px; text-align: center; }
.at-grille { display: grid; grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr); grid-template-rows: auto auto; gap: 10px; }
.at-cadre { border: 1.5px solid; border-radius: 6px; min-width: 0; display: flex; flex-direction: column; }
.at-cadre > h4 { margin: 0; padding: 6px 10px 4px; font: 600 13px var(--f-ui); display: flex; gap: 8px; align-items: baseline; }
.at-cadre > h4 small { font-weight: 400; color: var(--encre-3); }
.at-editeur { border-color: var(--at-bleu); background: color-mix(in srgb, var(--trame) 45%, var(--surface)); }
.at-editeur > h4 { color: var(--at-bleu); }
.at-editeur > h4 code { font: 500 13px var(--f-mono); }
.at-variables { border-color: var(--at-orange); grid-row: span 2; }
.at-variables > h4 { color: var(--at-orange); }
.at-console { border-color: var(--encre-3); background: color-mix(in srgb, var(--trame) 60%, var(--surface)); }
.at-console > h4 { color: var(--encre); }
.at-zone { position: relative; overflow-x: auto; overflow-y: hidden; font: 14px/1.6 var(--f-mono); padding: 2px 0 8px; }
.at-int { position: relative; display: flex; min-width: 100%; width: max-content; }
.at-num { position: sticky; left: 0; z-index: 2; text-align: right; padding: 0 10px 0 8px; color: var(--encre-3); user-select: none;
  background: inherit; min-width: 2.2em; background: color-mix(in srgb, var(--trame) 45%, var(--surface)); }
.at-num span { display: block; }
.at-texte { position: relative; flex: 1; }
.at-texte pre { margin: 0; padding: 0 12px 0 4px; font: inherit; white-space: pre; tab-size: 4; color: var(--encre); }
.at-texte pre .l { display: block; min-height: 1.6em; }
.at-texte pre .l.cour { background: color-mix(in srgb, var(--at-orange) 22%, transparent); box-shadow: inset 3px 0 0 var(--at-orange); }
.at-texte pre .l.err { background: color-mix(in srgb, var(--at-rouge) 16%, transparent); box-shadow: inset 3px 0 0 var(--at-rouge); }
.at-texte textarea { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; border: 0; padding: 0 12px 0 4px; resize: none; overflow: hidden;
  font: inherit; white-space: pre; tab-size: 4; background: transparent; color: transparent; caret-color: var(--encre); outline: none; }
.at-texte textarea::selection { background: color-mix(in srgb, var(--at-bleu) 30%, transparent); color: transparent; }
.atelier.debogage .at-texte textarea { pointer-events: none; }
.at-zone:focus-within { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--at-bleu) 35%, transparent); border-radius: 0 0 5px 5px; }
.sy-k { color: var(--at-bleu); font-weight: 500; }
.sy-s { color: var(--corrige-filet); }
.sy-c { color: var(--encre-3); font-style: italic; }
.sy-n { color: var(--c-alg); }
.sy-b { color: var(--c-geo); }
.sy-v { color: var(--corrige-filet); font-weight: 500; }
.at-vars { padding: 2px 10px 10px; font: 13.5px/1.55 var(--f-mono); overflow-x: auto; }
.at-vars table { border-collapse: collapse; width: 100%; }
.at-vars td { padding: 1px 8px 1px 0; vertical-align: top; white-space: pre; }
.at-vars td:first-child { color: var(--encre); font-weight: 500; }
.at-vars td:last-child { color: var(--encre-2); width: 100%; white-space: pre-wrap; word-break: break-all; }
.at-vars tr.change td { color: var(--at-orange); font-weight: 600; }
.at-vars .sous { font: 600 11.5px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; color: var(--encre-3); padding: 8px 0 2px; }
.at-vide { color: var(--encre-3); font: italic 13px var(--f-ui); padding: 4px 0; }
.at-sortie { font: 13.5px/1.5 var(--f-mono); padding: 2px 10px 0; white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow-y: auto; min-height: 3em; }
.at-sortie .meta { color: var(--encre-3); }
.at-sortie .err { color: var(--at-rouge); }
.at-sortie .aide { color: var(--encre); font-family: var(--f-ui); font-size: 13.5px; display: block; margin: 2px 0 4px;
  border-left: 3px solid var(--at-rouge); padding: 2px 8px; background: color-mix(in srgb, var(--at-rouge) 7%, transparent); }
.at-sortie .ent { color: var(--at-bleu); }
.at-ligne { display: flex; align-items: baseline; gap: 6px; padding: 2px 10px 8px; font: 13.5px var(--f-mono); }
.at-ligne span { color: var(--at-bleu); font-weight: 500; }
.atelier.saisie .at-ligne { background: color-mix(in srgb, var(--at-bleu) 10%, transparent); box-shadow: inset 3px 0 0 var(--at-bleu); }
.atelier.saisie .at-ligne input::placeholder { color: var(--at-bleu); opacity: .75; }
.at-ligne input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--encre); font: inherit; outline: none; padding: 2px 0; }
@media (max-width: 720px) {
  .at-grille { grid-template-columns: minmax(0, 1fr); }
  .at-variables { grid-row: auto; order: 3; }
  .at-droite { margin-left: 0; width: 100%; }
}
`;

const MOTS = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const CONST = new Set(['True', 'False', 'None']);
const INTEGREES = new Set('print input range len int float str list tuple dict set bool abs round min max sum sorted type chr ord divmod enumerate zip map filter reversed isinstance'.split(' '));
const RE = /(#[^\n]*)|("""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b\d+(?:\.\d*)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_À-ÿ][\wÀ-ÿ]*)/g;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function colorer(code, lignes = true) {
  let out = '', i = 0;
  code.replace(RE, (m, c, s, n, id, pos) => {
    out += esc(code.slice(i, pos)); i = pos + m.length;
    let cl = c ? 'c' : s ? 's' : n ? 'n' : CONST.has(id) ? 'v' : MOTS.has(id) ? 'k' : INTEGREES.has(id) ? 'b' : '';
    out += cl ? m.split('\n').map((p) => `<span class="sy-${cl}">${esc(p)}</span>`).join('\n') : esc(m);
    return m;
  });
  out += esc(code.slice(i));
  if (!lignes) return out;
  return out.split('\n').map((l, k) => `<span class="l" data-n="${k + 1}">${l || ' '}</span>`).join('');
}

// ---------- Le worker, partagé par tous les ateliers de la page ----------
const Python = {
  worker: null, pret: null, version: '', occupe: null, compteur: 0, attentes: new Map(), ateliers: new Map(),
  url: new URL('./atelier-worker.mjs', import.meta.url),
  demarrer() {
    if (this.pret) return this.pret;
    this.worker = new Worker(this.url, { type: 'module' });
    this.pret = new Promise((ok, ko) => {
      this.worker.onmessage = (ev) => {
        const m = ev.data;
        if (m.type === 'pret') { this.version = m.version; ok(); }
        else if (m.type === 'echec') ko(new Error(m.message));
        else if (m.type === 'sortie') this.ateliers.get(m.wid)?.ecrire(m.texte);
        else if (m.type === 'fin') { const f = this.attentes.get(m.id); this.attentes.delete(m.id); this.occupe = null; f?.(m.resultat); }
      };
      this.worker.onerror = (e) => ko(new Error(e.message || 'Le worker Python n\'a pas pu démarrer.'));
    });
    return this.pret;
  },
  async envoyer(msg) {
    await this.demarrer();
    const id = ++this.compteur;
    this.occupe = msg.wid;
    return new Promise((ok) => { this.attentes.set(id, ok); this.worker.postMessage({ ...msg, id }); });
  },
  arreter() {
    if (!this.worker) return;
    const wid = this.occupe;
    this.worker.terminate();
    for (const f of this.attentes.values()) f({ etat: 'interrompu' });
    this.attentes.clear(); this.worker = null; this.pret = null; this.occupe = null;
    for (const a of this.ateliers.values()) a.perdu(a.wid === wid);
  },
};

function lire(cle) { try { return localStorage.getItem(cle); } catch { return null; } }
function ecrire(cle, v) { try { v == null ? localStorage.removeItem(cle) : localStorage.setItem(cle, v); } catch {} }

class Atelier {
  constructor(hote, { wid, nom, code, retour = "Revenir au code de l'énoncé" }) {
    if (!document.getElementById('atelier-css')) {
      const st = document.createElement('style'); st.id = 'atelier-css'; st.textContent = CSS; document.head.append(st);
    }
    this.wid = wid; this.nom = nom; this.initial = code; this.cle = 'atlas-python:' + wid;
    this.histo = []; this.hPos = 0; this.enCours = false; this.suiteConsole = '';
    const el = this.el = document.createElement('div');
    el.className = 'atelier';
    el.innerHTML = `
      <div class="at-barre">
        <button class="at-executer" type="button" title="Exécuter le programme (F5 ou Ctrl+Entrée)">Exécuter <kbd>F5</kbd></button>
        <button class="at-deboguer" type="button" title="Exécuter pas à pas en suivant les variables">Déboguer</button>
        <span class="at-pas">
          <button type="button" data-pas="debut" title="Première étape">⏮</button>
          <button type="button" data-pas="-1" title="Étape précédente">◀</button>
          <span></span>
          <button type="button" data-pas="1" title="Étape suivante">▶</button>
          <button type="button" data-pas="fin" title="Dernière étape">⏭</button>
        </span>
        <button class="at-arreter" type="button" disabled title="Arrêter le programme">Arrêter</button>
        <span class="at-etat"></span>
        <span class="at-droite"><button type="button" class="at-lien at-reinit">${esc(retour)}</button></span>
      </div>
      <div class="at-grille">
        <div class="at-cadre at-editeur"><h4><code>${esc(nom)}</code> <small>— l'éditeur</small></h4>
          <div class="at-zone"><div class="at-int"><div class="at-num"></div><div class="at-texte"><pre aria-hidden="true"></pre>
          <textarea spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Code Python"></textarea></div></div></div></div>
        <div class="at-cadre at-variables"><h4>Variables <small class="at-portee"></small></h4><div class="at-vars"><div class="at-vide">Elles apparaîtront après l'exécution.</div></div></div>
        <div class="at-cadre at-console"><h4>Console <small>(<i>Shell</i>)</small></h4>
          <div class="at-sortie" aria-live="polite"></div>
          <label class="at-ligne"><span>&gt;&gt;&gt;</span><input type="text" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Instruction pour la console"></label></div>
      </div>`;
    hote.append(el);
    const $ = (s) => el.querySelector(s);
    this.ta = $('textarea'); this.pre = $('pre'); this.num = $('.at-num');
    this.sortie = $('.at-sortie'); this.vars = $('.at-vars'); this.portee = $('.at-portee');
    this.etat = $('.at-etat'); this.bExe = $('.at-executer'); this.bDeb = $('.at-deboguer'); this.bArr = $('.at-arreter');
    this.entree = $('.at-ligne input'); this.invite = $('.at-ligne span'); this.pas = $('.at-pas span');
    this.ta.value = lire(this.cle) ?? code;
    this.rendre();
    Python.ateliers.set(wid, this);

    this.ta.addEventListener('input', () => { this.erreur = null; this.rendre(); ecrire(this.cle, this.ta.value === this.initial ? null : this.ta.value); });
    this.ta.addEventListener('keydown', (e) => this.touche(e));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'F5' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); if (!this.dbg) this.executer(); }
      if (this.dbg && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.tagName !== 'INPUT') { e.preventDefault(); this.aller(this.k + (e.key === 'ArrowRight' ? 1 : -1)); }
    });
    this.bExe.onclick = () => this.executer();
    this.bDeb.onclick = () => this.deboguer();
    this.bArr.onclick = () => this.arreter();
    $('.at-reinit').onclick = () => { if (this.ta.value !== this.initial) { this.ta.value = this.initial; ecrire(this.cle, null); this.erreur = null; this.rendre(); } };
    el.querySelectorAll('[data-pas]').forEach((b) => b.onclick = () => {
      const p = b.dataset.pas; this.aller(p === 'debut' ? 0 : p === 'fin' ? this.dbg.etapes.length - 1 : this.k + (+p));
    });
    this.entree.addEventListener('keydown', (e) => this.toucheConsole(e));
  }

  // Charger un autre programme dans le même atelier (exemples du cours) : la console est gardée.
  charger({ wid, nom, code }) {
    if (this.dbg) this.quitterDbg();
    Python.ateliers.delete(this.wid);
    this.wid = wid; this.nom = nom; this.initial = code; this.cle = 'atlas-python:' + wid;
    Python.ateliers.set(wid, this); this.annonce = false;
    this.el.querySelector('.at-editeur h4 code').textContent = nom;
    this.ta.value = lire(this.cle) ?? code; this.erreur = null; this.rendre();
    this.vars.innerHTML = '<div class="at-vide">Elles apparaîtront après l\'exécution.</div>';
  }

  // ---------- éditeur ----------
  rendre(courante = null) {
    const code = this.ta.value;
    this.pre.innerHTML = colorer(code);
    const n = code.split('\n').length;
    if (this.num.childElementCount !== n) this.num.innerHTML = Array.from({ length: n }, (_, i) => `<span>${i + 1}</span>`).join('');
    const marquer = (l, cl) => { const s = l && this.pre.querySelector(`.l[data-n="${l}"]`); s?.classList.add(cl); return s; };
    marquer(this.erreur, 'err');
    const s = marquer(courante, 'cour');
    if (s) { const z = this.el.querySelector('.at-zone'); s.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }); z.scrollLeft = 0; }
  }
  touche(e) {
    const ta = this.ta, v = ta.value, a = ta.selectionStart, b = ta.selectionEnd;
    const remplacer = (deb, fin, txt, curseur) => {
      ta.setSelectionRange(deb, fin);
      if (!document.execCommand('insertText', false, txt)) { ta.setRangeText(txt, deb, fin, 'end'); ta.dispatchEvent(new Event('input')); }
      if (curseur != null) ta.setSelectionRange(curseur, curseur);
    };
    if (e.key === 'Tab') {
      e.preventDefault();
      const d = v.lastIndexOf('\n', a - 1) + 1;
      if (e.shiftKey || a !== b) {
        const f = v.indexOf('\n', b - (b > a && v[b - 1] === '\n' ? 1 : 0)); const fin = f < 0 ? v.length : f;
        const bloc = v.slice(d, fin).split('\n').map((l) => e.shiftKey ? l.replace(/^ {1,4}/, '') : '    ' + l).join('\n');
        remplacer(d, fin, bloc); ta.setSelectionRange(d, d + bloc.length);
      } else remplacer(a, b, '    ');
    } else if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const d = v.lastIndexOf('\n', a - 1) + 1, ligne = v.slice(d, a);
      let ind = ligne.match(/^ */)[0];
      if (/:\s*(#.*)?$/.test(ligne)) ind += '    ';
      else if (/^\s*(return|break|continue|pass|raise)\b/.test(ligne)) ind = ind.slice(4);
      remplacer(a, b, '\n' + ind);
    } else if (e.key === 'Backspace' && a === b) {
      const d = v.lastIndexOf('\n', a - 1) + 1, avant = v.slice(d, a);
      if (avant.length && /^ +$/.test(avant)) { e.preventDefault(); const k = ((avant.length - 1) % 4) + 1; remplacer(a - k, a, ''); }
    }
  }

  // ---------- console ----------
  ecrire(texte, cl = '') {
    // Le texte brut est regroupé et posé à l'image suivante : la page reste réactive même sous un flot d'affichage.
    if (!cl) { this.attente = (this.attente || '') + texte; if (!this.rafId) this.rafId = requestAnimationFrame(() => this.poser()); return; }
    this.poser();
    const sp = document.createElement('span'); sp.className = cl; sp.textContent = texte; this.sortie.append(sp); this.taille = (this.taille || 0) + texte.length;
    this.sortie.scrollTop = this.sortie.scrollHeight;
  }
  poser() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
    const t = this.attente; this.attente = ''; if (!t) return;
    const s = this.sortie;
    if (s.lastChild && s.lastChild.nodeType === 3) s.lastChild.appendData(t); else s.append(t);
    this.taille = (this.taille || 0) + t.length;
    if (this.taille > 60000) {
      while (s.firstChild && this.taille > 30000) { this.taille -= s.firstChild.textContent.length; s.firstChild.remove(); }
      s.prepend(Object.assign(document.createElement('span'), { className: 'meta', textContent: '[… début de l\'affichage supprimé …]\n' }));
    }
    s.scrollTop = s.scrollHeight;
  }
  finLigne() { this.poser(); const d = this.sortie.lastChild; if (!d || d.classList?.contains('aide')) return; if (!d.textContent.endsWith('\n')) this.ecrire('\n'); }
  demanderSaisie(invite) {
    // input() : la réponse se tape dans la console, comme dans Thonny.
    this.poser();
    this.el.classList.add('saisie'); this.invite.textContent = '⌨';
    this.entree.placeholder = (invite ? invite.trim() + ' ' : '') + '(taper la réponse, puis Entrée)';
    this.etat.textContent = 'Le programme attend une saisie.'; this.etat.classList.remove('actif');
    this.entree.focus({ preventScroll: true });
    return new Promise((ok) => { this.attenteSaisie = ok; });
  }
  finSaisie(v) {
    const ok = this.attenteSaisie; if (!ok) return;
    this.attenteSaisie = null; this.el.classList.remove('saisie'); this.invite.textContent = '>>>'; this.entree.placeholder = '';
    this.etat.textContent = 'En cours…'; this.etat.classList.add('actif');
    ok(v);
  }
  async toucheConsole(e) {
    if (this.attenteSaisie) { if (e.key === 'Enter') { e.preventDefault(); const v = this.entree.value; this.entree.value = ''; this.finSaisie(v); } return; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); if (!this.histo.length) return;
      this.hPos = Math.max(0, Math.min(this.histo.length, this.hPos + (e.key === 'ArrowUp' ? -1 : 1)));
      this.entree.value = this.histo[this.hPos] ?? ''; return;
    }
    if (e.key !== 'Enter' || this.enCours || this.dbg) return;
    const ligne = this.entree.value; this.entree.value = '';
    if (ligne.trim()) { this.histo.push(ligne); } this.hPos = this.histo.length;
    this.finLigne();
    this.ecrire((this.suiteConsole ? '... ' : '>>> ') + ligne + '\n', 'ent');
    const src = this.suiteConsole + ligne;
    const r = await this.lancer({ action: 'console', code: src }, false);
    if (r.etat === 'suite') { this.suiteConsole = src + '\n'; this.invite.textContent = '...'; }
    else { this.suiteConsole = ''; this.invite.textContent = '>>>'; }
    this.entree.focus();
  }

  // ---------- exécution ----------
  occupe(oui, msg = '') {
    this.enCours = oui;
    this.bExe.disabled = this.bDeb.disabled = oui; this.bArr.disabled = !oui && !this.dbg;
    this.etat.textContent = msg; this.etat.classList.toggle('actif', oui);
  }
  async lancer(msg, programme) {
    if (Python.occupe && Python.occupe !== this.wid) Python.arreter();
    if (!Python.pret) {
      this.occupe(true, 'Chargement de Python…');
      this.ecrire('Chargement de Python (une seule fois ; quelques secondes)…\n', 'meta');
    }
    try { await Python.demarrer(); }
    catch (e) { this.occupe(false); this.ecrire('Python n\'a pas pu se charger : ' + e.message + '\n', 'err'); return { etat: 'echec' }; }
    if (!this.annonce) { this.annonce = true; this.ecrire(`Python ${Python.version}, exécuté dans votre navigateur.\n`, 'meta'); }
    this.occupe(true, programme === 'dbg' ? 'Enregistrement des étapes…' : 'En cours…');
    const graine = Math.floor(Math.random() * 2 ** 31), reponses = [];
    let saut = 0, r;
    for (;;) {
      r = await Python.envoyer({ ...msg, wid: this.wid, nom: this.nom, reponses, graine, saut, limite: 1000 });
      if (r.etat !== 'saisie') break;
      // input() : on demande la valeur, puis on relance le programme depuis le début avec les réponses déjà
      // données (même graine du hasard) ; l'affichage déjà produit n'est pas répété.
      const v = await this.demanderSaisie(programme === 'dbg' ? r.invite : '');
      if (v === null) { r = { etat: 'annule', variables: r.variables }; break; }
      this.etat.textContent = programme === 'dbg' ? 'Enregistrement des étapes…' : 'En cours…';
      reponses.push(v); saut = r.n;
    }
    this.occupe(false);
    if (r.etat === 'erreur') {
      this.finLigne(); this.ecrire(r.trace + (r.aide ? '' : '\n'), 'err');
      if (r.aide) this.ecrire(r.aide, 'aide');
      if (programme && r.ligne) { this.erreur = r.ligne; this.rendre(); }
    } else if (r.etat === 'interrompu') { this.finLigne(); this.ecrire('Programme arrêté.\n', 'err'); }
    else if (r.etat === 'annule') { this.finLigne(); this.ecrire('Saisie annulée : programme arrêté.\n', 'err'); }
    if (r.variables) this.montrerVariables(r.variables);
    return r;
  }
  async executer() {
    if (this.enCours) return;
    this.erreur = null; this.rendre(); this.finLigne();
    this.ecrire(`>>> %Run ${this.nom}\n`, 'meta');
    await this.lancer({ action: 'executer', code: this.ta.value }, true);
  }
  arreter() {
    if (this.attenteSaisie) { this.finSaisie(null); return; }
    if (this.dbg) { this.quitterDbg(); return; }
    if (this.enCours) Python.arreter();
  }
  perdu(lui) {
    // Arrêter un programme oblige à relancer Python : les variables de tous les ateliers de la page sont perdues.
    if (!this.annonce) return;
    this.annonce = false;
    this.vars.innerHTML = '<div class="at-vide">Python a été relancé : exécuter de nouveau le programme pour voir ses variables.</div>';
    if (!lui) { this.finLigne(); this.ecrire('Python a été relancé (programme arrêté dans un autre exercice).\n', 'meta'); }
  }

  // ---------- débogage : on enregistre toutes les étapes, puis on les parcourt ----------
  async deboguer() {
    if (this.enCours) return;
    this.erreur = null; this.rendre(); this.finLigne();
    this.ecrire(`>>> %Debug ${this.nom}\n`, 'meta');
    const debut = this.sortie.childNodes.length;
    const r = await this.lancer({ action: 'deboguer', code: this.ta.value }, 'dbg');
    if (!r.etapes) return;
    this.dbg = { etapes: r.etapes, sortie: Array.from(r.sortie), r, debut };
    this.el.classList.add('debogage'); this.bArr.disabled = false; this.bArr.textContent = 'Quitter le débogage';
    this.poser(); this.zoneDbg = document.createElement('span'); this.sortie.append(this.zoneDbg);
    this.etat.textContent = r.etat === 'limite' ? 'Seules les 1000 premières étapes sont enregistrées.' : 'La ligne surlignée est la prochaine à exécuter.';
    this.aller(0);
  }
  aller(k) {
    const d = this.dbg; if (!d) return;
    this.k = Math.max(0, Math.min(d.etapes.length - 1, k));
    const e = d.etapes[this.k], prec = d.etapes[this.k - 1];
    const dernier = this.k === d.etapes.length - 1;
    this.pas.textContent = dernier ? 'programme terminé' : `étape ${this.k + 1} / ${d.etapes.length - 1}`;
    this.erreur = dernier && d.r.etat === 'erreur' ? d.r.ligne : null;
    this.rendre(e.l);
    let t = d.sortie.slice(0, e.n).join('');
    this.zoneDbg.textContent = t;
    if (dernier && d.r.etat === 'erreur') this.zoneDbg.textContent += (t && !t.endsWith('\n') ? '\n' : '');
    this.sortie.scrollTop = this.sortie.scrollHeight;
    this.montrerVariables(e.g, prec && prec.g, e.loc, prec && prec.loc);
  }
  quitterDbg() {
    const d = this.dbg; this.dbg = null; this.el.classList.remove('debogage');
    this.zoneDbg.textContent = d.sortie.join('');
    if (d.r.etat === 'erreur') { this.finLigne(); this.ecrire(d.r.trace + (d.r.aide ? '' : '\n'), 'err'); if (d.r.aide) this.ecrire(d.r.aide, 'aide'); this.erreur = d.r.ligne; }
    this.bArr.textContent = 'Arrêter'; this.occupe(false); this.rendre();
    this.montrerVariables(d.r.variables);
  }

  montrerVariables(g, gPrec, loc, locPrec) {
    const avant = (liste) => new Map((liste || []).map(([k, v]) => [k, v]));
    const table = (liste, prec) => {
      const p = prec ? avant(prec) : null;
      return '<table>' + liste.map(([k, v]) => `<tr class="${p && p.get(k) !== v ? 'change' : ''}"><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('') + '</table>';
    };
    let h = '';
    if (loc) {
      h += `<div class="sous">Dans ${esc(loc.f)}()</div>` + (loc.v.length ? table(loc.v, locPrec && locPrec.f === loc.f ? locPrec.v : null) : '<div class="at-vide">aucune variable locale</div>');
      h += '<div class="sous">Globales</div>';
    }
    h += g.length ? table(g, gPrec) : '<div class="at-vide">Aucune variable.</div>';
    this.vars.innerHTML = h;
    this.portee.textContent = this.dbg ? '(à cette étape)' : '';
  }
}

export function monterAtelier(hote, options) { return new Atelier(hote, options); }
export function colorerBloc(code) { return colorer(code); }
// Coloration des blocs de code d'une page (énoncés et corrigés des feuilles Python), sans toucher au texte.
export function colorerCode(racine) {
  feuilleStyle();
  for (const c of racine.querySelectorAll('pre.code[data-lang="python"]:not([data-colore]) > code')) {
    c.parentElement.dataset.colore = '1';
    c.innerHTML = colorer(c.textContent, false);
  }
}
export function feuilleStyle() { if (!document.getElementById('atelier-css')) { const st = document.createElement('style'); st.id = 'atelier-css'; st.textContent = CSS; document.head.append(st); } }
