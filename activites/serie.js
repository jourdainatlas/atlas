// Calcul mental « Dix calculs », rubrique Activités, MEMO_atlas_activites.md §151.
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import { FAMILLES, serie } from './serie-calculs.js';
import { NIVEAUX_PARCOURS, demande, valider, lireParcours, lienParcours } from './jour.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .jeu { --activites-jeu: var(--activites-calcul); }
.activites-act .jeu .katex { pointer-events: none; }
.activites-act .sr-tete { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 12px 16px 0; font: 600 14px var(--f-ui); color: var(--encre-2); }
.activites-act .sr-tete .temps { font: 700 18px var(--f-mono); color: var(--activites-calcul); }
.activites-act .sr-avance { display: flex; gap: 4px; padding: 8px 16px 0; }
.activites-act .sr-avance i { flex: 1; height: 5px; border-radius: 3px; background: var(--filet); }
.activites-act .sr-avance i.ok { background: var(--tan); } .activites-act .sr-avance i.ko { background: var(--rouge); } .activites-act .sr-avance i.ici { background: var(--activites-calcul); }
.activites-act .sr-question { padding: 22px 16px 10px; text-align: center; font: 19px/1.6 var(--f-texte, Georgia, serif); color: var(--encre); min-height: 5.2em; margin: 0; }
.activites-act .sr-choix { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 16px 16px; }
.activites-act .sr-choix button { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 64px; padding: 8px 10px; border: 1px solid var(--encre-3); border-radius: 8px; background: var(--surface); color: var(--encre); font: 19px var(--f-texte, Georgia, serif); }
.activites-act .sr-choix button kbd { font: 600 11.5px var(--f-mono); color: var(--encre-3); border: 1px solid var(--filet); border-radius: 4px; padding: 1px 5px; }
.activites-act .sr-choix button:hover { border-color: var(--activites-calcul); background: color-mix(in srgb, var(--activites-calcul) 8%, var(--surface)); }
.activites-act .sr-bilan { margin: 0; padding: 0 16px 16px; list-style: none; display: grid; gap: 6px; }
.activites-act .sr-bilan li { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; align-items: baseline; padding: 8px 10px; border: 1px solid var(--filet); border-left: 4px solid var(--tan); border-radius: 6px; font: 15.5px/1.6 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .sr-bilan li.ko { border-left-color: var(--rouge); }
.activites-act .sr-bilan li b { font: 700 12.5px var(--f-mono); color: var(--encre-3); }
.activites-act .sr-bilan .rep { display: block; font: 14.5px/1.6 var(--f-ui); color: var(--encre-2); }
.activites-act .sr-bilan .rep .faux { color: var(--rouge); } .activites-act .sr-bilan .rep .vrai { color: var(--tan); font-weight: 600; }
.activites-act .sr-choix.longues button span { white-space: nowrap; }
@media (max-width: 640px) { .activites-act .sr-choix.longues { grid-template-columns: 1fr; } .activites-act .sr-choix.longues button { min-height: 52px; } }
@media (max-width: 420px) { .activites-act .sr-choix button kbd { display: none; } .activites-act .sr-question { font-size: 17.5px; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Calcul mental · Première, Terminale, Maths expertes, Maths Sup</p>
  <h3>Dix calculs</h3>
  <p class="lede">Dix calculs à faire de tête, contre la montre, sur un thème de votre classe : carrés, pourcentages, développements et factorisations en Première, dérivées, primitives et intégrales en Terminale, à quoi s'ajoutent PGCD, congruences et nombres complexes avec l'option Maths expertes, puis développements limités, équivalents et déterminants en Maths Sup. Quatre réponses sont proposées ; une seule est exacte, les autres sont les erreurs que l'on commet le plus souvent.</p>
</header>

<div class="jeu">
  <div class="bar top" style="flex-direction: row; flex-wrap: wrap; align-items: center;">
    <label>Classe <select id="sr-niveau">${NIVEAUX_PARCOURS.map(([id, nom]) => `<option value="${id}">${nom}</option>`).join('')}</select></label>
    <label class="rz-choix" style="display: flex; align-items: center; gap: 8px; flex: 1 1 240px; min-width: 0;">Thème <select id="sr-famille" style="flex: 1; min-width: 0; max-width: 100%;"></select></label>
    <button type="button" class="primary" id="sr-depart">Commencer</button>
  </div>
  <div class="sr-tete"><span id="sr-rang"></span><span class="temps" id="sr-temps" aria-label="Temps écoulé"></span></div>
  <div class="sr-avance" id="sr-avance" aria-hidden="true"></div>
  <p class="sr-question" id="sr-question" aria-live="polite"></p>
  <div class="sr-choix" id="sr-choix" role="group" aria-label="Réponses"></div>
  <div class="jeu-message" id="sr-message" aria-live="polite"></div>
  <ol class="sr-bilan" id="sr-bilan" hidden></ol>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Choisissez votre classe, puis un thème, ou « Mélange » pour un calcul de chaque sorte. « Commencer » lance le chronomètre et affiche le premier calcul ; cliquez sur la réponse, ou tapez son numéro, de 1 à 4, au clavier : le calcul suivant arrive aussitôt. À la fin, la page donne le nombre de réponses justes, le temps, et reprend les dix calculs avec la bonne réponse en regard de la vôtre. Votre navigateur retient votre meilleur résultat pour chaque thème : d'abord le plus de réponses justes, puis le temps le plus court.</p>
    <p>Les calculs sont fabriqués par la page à chaque série : deux séries du même thème ne se ressemblent pas. Rien ne presse la première fois ; la vitesse vient quand les règles sont sûres.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi s'entraîner à calculer vite</h4>
    <p>Dans une démonstration ou un problème, le calcul n'est pas le but : il doit se faire sans y penser, pour laisser l'attention à ce qui est difficile. Reconnaître d'un coup d'œil que la dérivée de e<sup>3x</sup> en 0 vaut 3, que le module de 3 + 4i vaut 5, ou qu'une limite est une forme indéterminée, c'est ce qui permet de suivre un raisonnement long sans se perdre.</p>
    <p>Les réponses fausses proposées ne sont pas tirées au hasard : ce sont les résultats que donnent les règles appliquées de travers, comme additionner les numérateurs et les dénominateurs de deux fractions, oublier le facteur 2 d'une dérivée ou confondre a<sup>m</sup> × a<sup>n</sup> avec (a<sup>m</sup>)<sup>n</sup>. Se tromper ici désigne donc la règle à revoir.</p>
  </div>
</section>
` + suite(
  "Aller vite avant d'aller juste. Une réponse fausse donnée en deux secondes ne vaut rien : la page classe d'abord par le nombre de réponses justes, et seulement ensuite par le temps. L'autre piège est de reconnaître une réponse « qui ressemble » : les réponses fausses sont précisément celles qui ressemblent.",
  "Les règles employées sont celles des chapitres du cours : <a href=\"#cours/p-04\">Dérivation</a> et <a href=\"#cours/p-01\">Polynôme du second degré</a> en Première, <a href=\"#cours/t-05\">Fonctions exponentielle et logarithme</a> et <a href=\"#cours/t-06\">Calcul intégral</a> en Terminale, <a href=\"#cours/ma-04\">Nombres complexes et trigonométrie</a> et <a href=\"#cours/ma-10\">Analyse asymptotique et développements limités</a> en Maths Sup.",
  "Chaque calcul est fabriqué par la page : les nombres sont tirés au hasard dans des plages choisies pour rester faisables de tête, la bonne réponse est calculée exactement (entiers et fractions réduites), et les réponses fausses sont obtenues en appliquant une règle erronée précise. Les limites et intégrales usuelles viennent d'une liste de résultats classiques. Votre navigateur retient seulement vos meilleurs résultats ; rien n'est envoyé.");

const CLE = 'atlas-serie';
const memoire = () => { try { const m = JSON.parse(localStorage.getItem(CLE) || 'null'); if (m && typeof m === 'object') return m; } catch (_) {} return {}; };
const duree = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
export function monter(racine) {
  const q = s => racine.querySelector(s), { window: fenetre, demonter } = bac(); let vivant = true, S = [], rang = -1, reponses = [], debut = 0, secondes = 0, horloge = 0, fini = false, duParcours = false;
  const niv = () => q('#sr-niveau').value, fam = () => q('#sr-famille').value;
  function familles() { q('#sr-famille').innerHTML = '<option value="melange">Mélange</option>' + FAMILLES[niv()].map(([id, nom]) => `<option value="${id}">${nom}</option>`).join(''); }
  function arreter() { if (horloge) { clearInterval(horloge); horloge = 0; } }
  function record() { const r = memoire()[niv() + '/' + fam()]; return r ? `Votre meilleur résultat sur ce thème : ${r[0]} sur 10 en ${duree(r[1])}.` : ''; }
  function attente() { arreter(); S = []; rang = -1; fini = false; q('#sr-depart').textContent = 'Commencer'; rendre(); }
  function demarrer() { arreter(); S = serie(niv(), fam()); rang = 0; reponses = []; fini = false; debut = Date.now(); secondes = 0; q('#sr-depart').textContent = 'Recommencer';
    horloge = setInterval(() => { if (!vivant) return arreter(); secondes = Math.floor((Date.now() - debut) / 1000); const t = q('#sr-temps'); if (t) t.textContent = duree(secondes); }, 500); rendre(); }
  function repondre(i) { if (rang < 0 || fini || i < 0 || i > 3) return; reponses.push(i); rang++;
    if (rang >= S.length) { fini = true; secondes = Math.floor((Date.now() - debut) / 1000); arreter(); const bons = S.filter((x, k) => reponses[k] === x.bon).length, m = memoire(), c = niv() + '/' + fam(), r = m[c];
      if (!r || bons > r[0] || (bons === r[0] && secondes < r[1])) { m[c] = [bons, secondes]; try { localStorage.setItem(CLE, JSON.stringify(m)); } catch (_) {} }
      duParcours = valider('serie', niv()) && duParcours; }
    rendre(); }
  function rendre() { if (!vivant) return; const m = q('#sr-message'), B = q('#sr-bilan');
    q('#sr-rang').textContent = rang < 0 ? '' : fini ? 'Série terminée' : `Calcul ${rang + 1} sur ${S.length}`; q('#sr-temps').textContent = rang < 0 ? '' : duree(secondes);
    ecrire(q('#sr-avance'), rang < 0 ? '' : S.map((x, k) => `<i class="${k < reponses.length ? (reponses[k] === x.bon ? 'ok' : 'ko') : k === rang ? 'ici' : ''}"></i>`).join(''), true);
    if (rang < 0) { ecrire(q('#sr-question'), 'Dix calculs vous attendent. Le chronomètre part quand vous cliquez sur « Commencer ».', true); ecrire(q('#sr-choix'), '', true); m.className = 'jeu-message'; ecrire(m, record(), true); B.hidden = true; return; }
    if (!fini) { const x = S[rang]; ecrire(q('#sr-question'), x.q, true); q('#sr-choix').classList.toggle('longues', x.choix.some(c => c.replace(/<[^>]+>|\\[a-z]+|[{}^_ ]/g, '').length + 2 * (c.match(/\\[a-z]+/g) || []).length > 7)); ecrire(q('#sr-choix'), x.choix.map((c, i) => `<button type="button" data-i="${i}"><kbd>${i + 1}</kbd><span>${c}</span></button>`).join(''), true); m.className = 'jeu-message'; ecrire(m, 'Cliquez sur la réponse, ou tapez son numéro.', true); B.hidden = true; return; }
    const bons = S.filter((x, k) => reponses[k] === x.bon).length; ecrire(q('#sr-question'), `<b>${bons} sur ${S.length}</b>, en ${duree(secondes)}.`, true); ecrire(q('#sr-choix'), '', true);
    m.className = 'jeu-message ' + (bons === S.length ? 'gagne' : bons >= 7 ? '' : 'mieux'); ecrire(m, (bons === S.length ? 'Sans faute. ' : bons >= 7 ? 'Presque : les calculs manqués sont repris ci-dessous. ' : 'Les calculs manqués sont repris ci-dessous, avec la bonne réponse : ce sont les règles à revoir. ') + record() + (duParcours ? lienParcours : ''), true);
    B.hidden = false; ecrire(B, S.map((x, k) => { const ok = reponses[k] === x.bon; return `<li class="${ok ? '' : 'ko'}"><b>${k + 1}</b><span>${x.q}<span class="rep">${ok ? `<span class="vrai">Juste :</span> ${x.choix[x.bon]}` : `<span class="faux">Votre réponse :</span> ${x.choix[reponses[k]]} · <span class="vrai">Réponse exacte :</span> ${x.choix[x.bon]}`}</span></span></li>`; }).join(''), true); }
  q('#sr-niveau').addEventListener('change', () => { familles(); attente(); }); q('#sr-famille').addEventListener('change', attente); q('#sr-depart').addEventListener('click', demarrer);
  q('#sr-choix').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) repondre(+b.dataset.i); });
  fenetre.addEventListener('keydown', e => { if (e.altKey || e.ctrlKey || e.metaKey || (e.target && e.target.closest && e.target.closest('input, select, textarea'))) return; if (rang >= 0 && !fini && /^[1-4]$/.test(e.key)) { e.preventDefault(); repondre(+e.key - 1); } });
  const D = demande('serie'), M = lireParcours(); if (D) { q('#sr-niveau').value = D.niveau; duParcours = true; } else if (M.niveau) q('#sr-niveau').value = M.niveau;
  familles(); attente(); return () => { vivant = false; arreter(); demonter(); };
}
