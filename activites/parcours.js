// « Parcours du jour », rubrique Activités, MEMO_atlas_activites.md §151 : six étapes quotidiennes, au niveau de la classe choisie.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import { NIVEAUX_PARCOURS, aujourdhui, lireParcours, ecrireParcours, demander } from './jour.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .jeu { --activites-jeu: var(--rouge); }
.activites-act .pc-niveaux { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.activites-act .pc-niveaux .nom { font: 600 13px var(--f-ui); letter-spacing: .04em; text-transform: uppercase; color: var(--encre-3); margin-right: 4px; }
.activites-act .pc-date { padding: 12px 16px 0; margin: 0; font: 600 15px var(--f-ui); color: var(--encre-2); }
.activites-act .pc-date b { color: var(--encre); }
.activites-act .pc-etapes { list-style: none; margin: 0; padding: 12px 16px 16px; display: grid; gap: 8px; counter-reset: etape; }
.activites-act .pc-etapes li { counter-increment: etape; }
.activites-act .pc-etapes a { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 12px 14px; border: 1px solid var(--encre-3); border-left: 5px solid var(--t, var(--encre-3)); border-radius: 8px; background: var(--surface); color: var(--encre); text-decoration: none; }
.activites-act .pc-etapes a::before { content: counter(etape); font: 700 14px var(--f-mono); color: var(--encre-3); }
.activites-act .pc-etapes a:hover { border-color: var(--t, var(--encre-2)); background: color-mix(in srgb, var(--t, var(--encre-3)) 6%, var(--surface)); }
.activites-act .pc-etapes .titre { font: 600 16.5px/1.35 var(--f-ui); display: block; }
.activites-act .pc-etapes .quoi { font: 14.5px/1.45 var(--f-ui); color: var(--encre-2); display: block; }
.activites-act .pc-etapes .etat { font: 600 13px var(--f-ui); color: var(--encre-3); white-space: nowrap; }
.activites-act .pc-etapes li.fait a { border-color: var(--tan); border-left-color: var(--tan); } .activites-act .pc-etapes li.fait .etat { color: var(--tan); }
.activites-act .pc-etapes .calcul { --t: var(--activites-calcul); } .activites-act .pc-etapes .raison { --t: var(--activites-raison); }
@media (max-width: 520px) { .activites-act .pc-etapes a { grid-template-columns: auto minmax(0, 1fr); } .activites-act .pc-etapes .etat { grid-column: 2; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Chaque jour · Seconde, Première, Terminale, Maths expertes, Maths Sup</p>
  <h3>Parcours du jour</h3>
  <p class="lede">Six étapes par jour, les mêmes pour tous les visiteurs d'une même classe : un nombre à atteindre, dix calculs, une démonstration à remettre en ordre, une erreur à trouver, un contre-exemple, une question de logique. Un quart d'heure environ, pour entretenir à la fois le calcul et le raisonnement.</p>
</header>

<div class="jeu">
  <div class="bar top"><span class="pc-niveaux" id="pc-niveaux" role="group" aria-label="Votre classe"></span></div>
  <p class="pc-date" id="pc-date"></p>
  <ol class="pc-etapes" id="pc-etapes"></ol>
  <div class="jeu-message" id="pc-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment cela marche</h4>
    <p>Choisissez votre classe une fois : votre navigateur s'en souvient. Chaque étape ouvre l'activité correspondante, déjà réglée sur votre classe et sur la pièce du jour ; quand l'étape est réussie, un lien ramène ici, et l'étape est marquée « fait ». À minuit, heure de Paris, le parcours change et les marques repartent de zéro.</p>
    <p>Les étapes sont indépendantes : on peut les faire dans l'ordre que l'on veut, et s'arrêter en route. La difficulté suit la classe choisie. « Le compte est bon » est au niveau 1 en Seconde et en Première, et au niveau 2 à partir de la Terminale, Maths Sup comprise (le niveau 3, plus long, reste offert aux volontaires dans l'activité elle-même) ; les dix calculs portent sur le programme de la classe ; les quatre pièces de raisonnement sont tirées parmi celles de la classe. Deux classes sont proposées en Terminale : « Terminale », qui s'en tient à l'enseignement de spécialité, et « Terminale + Maths expertes », qui y ajoute l'arithmétique, les nombres complexes, les matrices et les graphes de l'option.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi un parcours</h4>
    <p>Le calcul et le raisonnement s'entretiennent comme une langue : peu, et souvent. Dix minutes chaque jour laissent plus de traces que deux heures la veille d'un devoir, parce que l'on retrouve les mêmes règles à des jours d'intervalle, au moment où l'on commençait à les oublier.</p>
    <p>Le parcours ne remplace pas le cours : il fait circuler entre des chapitres que l'on a vus à des mois d'écart, une dérivée un jour, une congruence le lendemain, et rappelle que tout cela forme un même édifice.</p>
  </div>
</section>
` + suite(
  "Faire le parcours comme une liste de cases à cocher. Une étape réussie par élimination, ou au troisième essai, mérite que l'on relise l'explication donnée par la page : c'est elle qui fait progresser, pas la marque « fait ». L'autre piège est de s'arrêter aux étapes de calcul, plus rapides, en laissant de côté la démonstration du jour.",
  "Chaque étape renvoie, dans l'activité qu'elle ouvre, au chapitre du cours concerné. Pour le raisonnement lui-même, voir le chapitre <a href=\"#cours/ma-01\">Logique et ensembles</a> et la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a> de l'édifice.",
  "Le parcours ne calcule rien lui-même : il choisit, d'après la date à Paris et la classe, le rang de la pièce du jour dans chaque activité, et lit dans votre navigateur ce que vous avez déjà fait aujourd'hui. Rien n'est envoyé : la classe choisie et les étapes faites restent sur votre appareil.");

const NIV_COMPTE = { seconde: 0, premiere: 0, terminale: 1, expertes: 1, sup: 1 };
const ETAPES = [
  ['compte-est-bon', 'calcul', 'Le compte est bon', n => `Le nombre du jour, niveau ${NIV_COMPTE[n] + 1} : six nombres, quatre opérations, une cible.`],
  ['serie', 'calcul', 'Dix calculs', () => 'Dix calculs de tête sur le programme de votre classe, contre la montre.'],
  ['ordonner', 'raison', 'La démonstration du jour', () => 'Une démonstration classique à remettre en ordre, en écartant la phrase fausse.'],
  ['erreur', 'raison', 'L\'erreur du jour', () => 'Un raisonnement qui aboutit à une absurdité : trouver la ligne fautive.'],
  ['contre-exemple', 'raison', 'Le contre-exemple du jour', () => 'Un énoncé faux et quatre objets : lequel le réfute ?'],
  ['implication', 'raison', 'Nécessaire ou suffisant ?', () => 'Deux propriétés : laquelle entraîne l\'autre ?'],
];
export function monter(racine) {
  const q = s => racine.querySelector(s); let vivant = true;
  // « Le compte est bon » tient sa propre mémoire du jour : { jour, faits: { niveau: opérations } }.
  function compteFait(n) { try { const m = JSON.parse(localStorage.getItem('atlas-compte-est-bon') || 'null'); return !!(m && m.jour === aujourdhui().n && m.faits && (NIV_COMPTE[n] in m.faits)); } catch (_) { return false; } }
  function rendre() { if (!vivant) return; const M = lireParcours(), J = aujourdhui();
    ecrire(q('#pc-niveaux'), '<span class="nom">Votre classe</span>' + NIVEAUX_PARCOURS.map(([id, nom]) => `<button type="button" class="chip" data-n="${id}" aria-pressed="${id === M.niveau}">${nom}</button>`).join(''), true);
    ecrire(q('#pc-date'), `Parcours du <b>${J.texte}</b>`, true); const m = q('#pc-message');
    if (!M.niveau) { ecrire(q('#pc-etapes'), '', true); m.className = 'jeu-message'; ecrire(m, 'Choisissez votre classe pour voir le parcours du jour.', true); return; }
    const faits = ETAPES.map(([id]) => id === 'compte-est-bon' ? compteFait(M.niveau) : !!M.faits[id]), nb = faits.filter(Boolean).length;
    ecrire(q('#pc-etapes'), ETAPES.map(([id, teinte, titre, quoi], k) => `<li class="${teinte}${faits[k] ? ' fait' : ''}"><a href="#activites/${id}" data-etape="${id}"><span><span class="titre">${titre}</span><span class="quoi">${quoi(M.niveau)}</span></span><span class="etat">${faits[k] ? '✓ fait' : 'à faire'}</span></a></li>`).join(''), true);
    m.className = 'jeu-message' + (nb === ETAPES.length ? ' gagne' : ''); ecrire(m, nb === ETAPES.length ? '<b>Parcours du jour terminé.</b> Un nouveau parcours vous attend demain.' : nb ? `${nb} étape${nb > 1 ? 's' : ''} sur ${ETAPES.length} : il en reste ${ETAPES.length - nb}.` : 'Six étapes vous attendent. Commencez par celle que vous voulez.', true); }
  q('#pc-niveaux').addEventListener('click', e => { const b = e.target.closest('button[data-n]'); if (!b) return; const M = lireParcours(); if (M.niveau !== b.dataset.n) { M.niveau = b.dataset.n; M.faits = {}; ecrireParcours(M); } rendre(); });
  // Avant d'ouvrir une activité, on lui laisse la demande : classe et pièce du jour.
  q('#pc-etapes').addEventListener('click', e => { const a = e.target.closest('a[data-etape]'); if (a) demander(a.dataset.etape, lireParcours().niveau); });
  rendre(); return () => { vivant = false; };
}
