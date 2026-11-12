// Raisonner « Nécessaire ou suffisant ? », rubrique Activités, MEMO_atlas_activites.md §151.
import { css as cssCommun } from './commun.js';
import { cssRaison, lireMemoire, noterMemoire, filtrer, pucesNiveaux, pucesThemes, options, auHasard } from './raisonner.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import { demande, pieceDuJour, validerPiece, lienParcours } from './jour.js';
import PIECES from './implication-pieces.js';
export { PIECES };

export const css = cssCommun + cssFigures + cssJeux + cssRaison + `
.activites-act .im-cadre { padding: 12px 16px 0; font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); margin: 0; }
.activites-act .im-cadre b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .im-props { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 16px; }
.activites-act .im-props div { border: 1px solid var(--encre-3); border-radius: 6px; padding: 10px 12px; background: var(--surface); font: 16.5px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .im-props div b { display: block; font: 700 13px var(--f-mono); color: var(--activites-jeu); margin-bottom: 4px; }
.activites-act .im-reponses { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 0 16px 14px; }
.activites-act .im-reponses button { padding: 10px 8px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); color: var(--encre); font: 600 15px/1.3 var(--f-ui); }
.activites-act .im-reponses button small { display: block; font-weight: 400; font-size: 12.5px; color: var(--encre-2); margin-top: 2px; }
.activites-act .im-reponses button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .im-reponses button:disabled { cursor: default; opacity: 1; }
.activites-act .im-reponses button.bon { border-color: var(--tan); box-shadow: inset 0 -4px 0 var(--tan); }
.activites-act .im-reponses button.mauvais { border-color: var(--rouge); box-shadow: inset 0 -4px 0 var(--rouge); background: var(--rouge-fond); }
.activites-act .im-detail { margin: 0 16px 14px; padding: 10px 14px; border-left: 3px solid var(--tan); background: color-mix(in srgb, var(--tan) 8%, var(--surface)); font: 15.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .im-detail p { margin: 0 0 6px; } .activites-act .im-detail p:last-child { margin: 0; }
.activites-act .im-detail .faux { color: var(--rouge); font-weight: 700; } .activites-act .im-detail .vrai { color: var(--tan); font-weight: 700; }
@media (max-width: 640px) { .activites-act .im-props { grid-template-columns: 1fr; } .activites-act .im-reponses { grid-template-columns: 1fr 1fr; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Nécessaire ou suffisant ?</h3>
  <p class="lede">Deux propriétés, A et B. L'une entraîne-t-elle l'autre ? Dans un seul sens, dans les deux, dans aucun ? Répondre, c'est savoir ce qu'un théorème affirme, et ce que sa réciproque n'affirme pas.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <span class="rz-niveaux" id="im-niveaux" role="group" aria-label="Niveau"></span>
    <span class="rz-niveaux" id="im-themes" role="group" aria-label="Thème de Maths Sup" hidden></span>
  </div>
  <div class="bar">
    <label class="rz-choix">Question <select id="im-piece"></select></label>
    <button type="button" class="rz-hasard" id="im-hasard" title="Tirer une question au hasard parmi celles du niveau et du thème choisis">Au hasard</button>
    <button type="button" class="primary" id="im-depart">Recommencer</button>
  </div>
  <p class="im-cadre" id="im-cadre"></p>
  <div class="im-props" id="im-props"></div>
  <div class="im-reponses" id="im-reponses" role="group" aria-label="Votre réponse">
    <button type="button" data-r="d">A ⇒ B<small>seulement</small></button>
    <button type="button" data-r="g">B ⇒ A<small>seulement</small></button>
    <button type="button" data-r="e">A ⇔ B<small>les deux</small></button>
    <button type="button" data-r="n">Aucune<small>ni l'une ni l'autre</small></button>
  </div>
  <div class="jeu-message" id="im-message" aria-live="polite"></div>
  <div class="im-detail" id="im-detail" hidden></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Choisissez un niveau et, pour Maths Sup, un thème, puis une question, ou laissez la page en tirer une avec « Au hasard ». Lisez le cadre, puis les deux propriétés, et choisissez l'une des quatre réponses. Vous n'avez qu'un essai : la page donne ensuite, pour chacun des deux sens, la raison pour laquelle l'implication est vraie, ou un objet qui la met en défaut. Une question réussie est marquée d'une coche dans la liste, et votre navigateur s'en souvient ; « Recommencer » permet de la refaire.</p>
    <p>« A ⇒ B seulement » signifie que A entraîne B et que B n'entraîne pas A. On dit alors que A est une condition <em>suffisante</em> pour B, et que B est une condition <em>nécessaire</em> pour A. « A ⇔ B » signifie que chacune entraîne l'autre : A est nécessaire et suffisante pour B.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que l'exercice apprend</h4>
    <p>Un théorème de la forme « si A, alors B » ne dit rien du cas où B est vrai : c'est sa réciproque, « si B, alors A », qui en parle, et elle est un autre énoncé, vrai ou faux indépendamment du premier. Une suite convergente est bornée, et une suite bornée peut diverger ; une fonction dérivable est continue, et la valeur absolue est continue sans être dérivable en 0.</p>
    <p>Pour établir qu'une implication est vraie, il faut une démonstration, ou le rappel d'un théorème. Pour établir qu'elle est fausse, un seul objet suffit : il vérifie l'hypothèse sans vérifier la conclusion. La page donne l'un ou l'autre pour chaque sens.</p>
  </div>
</section>
` + suite(
  "Prendre la réciproque d'un théorème pour le théorème. « La dérivée s'annule en un extremum » devient, à la relecture, « si la dérivée s'annule, il y a un extremum » : c'est l'erreur la plus répandue, du lycée au supérieur. L'autre piège est d'oublier le cadre : sur un espace de dimension finie, « injectif » et « surjectif » sont équivalents pour un endomorphisme, et ne le sont plus en dimension infinie.",
  "Sous chaque question, un lien mène au chapitre du cours concerné. Le vocabulaire des conditions nécessaires et suffisantes est fixé au chapitre <a href=\"#cours/ma-01\">Logique et ensembles</a> ; les connecteurs « implique » et « équivaut » sont définis par leur table de vérité à la fiche <a href=\"#log.l-connecteurs\">Connecteurs et tables de vérité</a> de l'édifice.",
  "Rien n'est calculé : chaque question porte, rédigées à l'avance, la justification ou le contre-exemple de chacun des deux sens. Votre navigateur retient seulement les questions réussies ; rien n'est envoyé.");

const TEXTE = { d: 'A ⇒ B seulement', g: 'B ⇒ A seulement', e: 'A ⇔ B', n: 'aucune des deux implications' };
export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], choisi = '', niveau = 'tous', theme = 'tous', vivant = true, duParcours = false;
  const D = demande('implication'); if (D) { niveau = D.niveau; P = pieceDuJour(PIECES, niveau, 'implication') || P; duParcours = true; }
  const visibles = () => filtrer(PIECES, niveau, theme);
  function listes() { const M = lireMemoire('implication'), V = visibles();
    ecrire(q('#im-niveaux'), pucesNiveaux(PIECES, niveau), true); const th = q('#im-themes'); th.hidden = niveau !== 'sup'; if (niveau === 'sup') ecrire(th, pucesThemes(PIECES, theme), true);
    if (!V.includes(P)) P = V[0]; const sel = q('#im-piece'); sel.innerHTML = options(V, niveau, theme, M); sel.value = P.id; }
  function charger() { choisi = ''; rendre(); }
  function rendre() { if (!vivant) return; const fait = lireMemoire('implication')[P.id];
    ecrire(q('#im-cadre'), '<b>Le cadre</b>' + P.cadre + (fait ? ' <span class="rz-fait">Fait</span>' : '') + (P.cours ? ` <a class="rz-cours" href="#cours/${P.cours}">Le chapitre du cours</a>` : ''), true);
    ecrire(q('#im-props'), `<div><b>A</b>${P.A}</div><div><b>B</b>${P.B}</div>`, true);
    racine.querySelectorAll('#im-reponses button').forEach(b => { const r = b.dataset.r; b.disabled = !!choisi; b.className = choisi && r === P.rep ? 'bon' : choisi && r === choisi ? 'mauvais' : ''; });
    const m = q('#im-message'), juste = choisi === P.rep; m.className = 'jeu-message' + (choisi ? (juste ? ' gagne' : ' mieux') : '');
    ecrire(m, !choisi ? 'A entraîne-t-elle B ? B entraîne-t-elle A ? Choisissez l\'une des quatre réponses.' : (juste ? `<b>C'est exact : ${TEXTE[P.rep]}.</b>` : `<b>Ce n'est pas cela : la bonne réponse est « ${TEXTE[P.rep]} ».</b>`) + (duParcours && juste ? lienParcours : ''), true);
    const d = q('#im-detail'); d.hidden = !choisi; if (choisi) ecrire(d, `<p><b>A ⇒ B :</b> <span class="${P.d.vrai ? 'vrai' : 'faux'}">${P.d.vrai ? 'vrai' : 'faux'}</span>. ${P.d.t}</p><p><b>B ⇒ A :</b> <span class="${P.r.vrai ? 'vrai' : 'faux'}">${P.r.vrai ? 'vrai' : 'faux'}</span>. ${P.r.t}</p>`, true); }
  q('#im-reponses').addEventListener('click', e => { const b = e.target.closest('button[data-r]'); if (!b || choisi) return; choisi = b.dataset.r;
    if (choisi === P.rep) { noterMemoire('implication', P.id, 1, false); validerPiece('implication', PIECES, P); listes(); } rendre(); });
  q('#im-depart').addEventListener('click', charger); q('#im-piece').addEventListener('change', e => { P = PIECES.find(p => p.id === e.target.value); charger(); });
  q('#im-hasard').addEventListener('click', () => { P = auHasard(visibles(), P, lireMemoire('implication')); listes(); charger(); });
  q('#im-niveaux').addEventListener('click', e => { const b = e.target.closest('button[data-n]'); if (!b) return; niveau = b.dataset.n; theme = 'tous'; listes(); charger(); });
  q('#im-themes').addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; theme = b.dataset.t; listes(); charger(); });
  listes(); charger(); return () => { vivant = false; };
}
