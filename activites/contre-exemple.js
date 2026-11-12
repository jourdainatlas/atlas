// Raisonner « Le contre-exemple », rubrique Activités, MEMO_atlas_activites.md §151.
import { css as cssCommun } from './commun.js';
import { cssRaison, lireMemoire, noterMemoire, filtrer, pucesNiveaux, pucesThemes, options, auHasard } from './raisonner.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import { demande, pieceDuJour, validerPiece, lienParcours } from './jour.js';
import PIECES from './contre-exemple-pieces.js';
export { PIECES };

export const css = cssCommun + cssFigures + cssJeux + cssRaison + `
.activites-act .cx-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17.5px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); margin: 0; }
.activites-act .cx-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .cx-choix { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px 16px; margin: 0; list-style: none; }
.activites-act .cx-choix button { width: 100%; height: 100%; display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px; text-align: left; padding: 10px 12px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); color: var(--encre); font: 16px/1.5 var(--f-texte, Georgia, serif); }
.activites-act .cx-choix button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .cx-choix button .etat { font: 600 12.5px var(--f-ui); }
.activites-act .cx-choix button .etat:empty { display: none; }
.activites-act .cx-choix button.non { border-color: var(--encre-3); opacity: .75; } .activites-act .cx-choix button.non .etat { color: var(--encre-2); }
.activites-act .cx-choix button.oui { border-color: var(--tan); box-shadow: inset 4px 0 0 var(--tan); opacity: 1; } .activites-act .cx-choix button.oui .etat { color: var(--tan); }
.activites-act .cx-choix button:disabled { cursor: default; }
.activites-act .cx-retenir { margin: 0 16px 14px; padding: 10px 14px; border-left: 3px solid var(--tan); background: color-mix(in srgb, var(--tan) 8%, var(--surface)); font: 15.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
@media (max-width: 640px) { .activites-act .cx-choix { grid-template-columns: 1fr; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Le contre-exemple</h3>
  <p class="lede">L'énoncé affiché est faux. Parmi les quatre objets proposés, un seul le prouve : lequel ? Les trois autres ne réfutent rien, soit parce qu'ils ne vérifient pas l'hypothèse, soit parce qu'ils vérifient aussi la conclusion.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <span class="rz-niveaux" id="cx-niveaux" role="group" aria-label="Niveau"></span>
    <span class="rz-niveaux" id="cx-themes" role="group" aria-label="Thème de Maths Sup" hidden></span>
  </div>
  <div class="bar">
    <label class="rz-choix">Énoncé <select id="cx-piece"></select></label>
    <button type="button" class="rz-hasard" id="cx-hasard" title="Tirer un énoncé au hasard parmi ceux du niveau et du thème choisis">Au hasard</button>
    <button type="button" class="primary" id="cx-depart">Recommencer</button>
  </div>
  <p class="cx-enonce" id="cx-enonce"></p>
  <ol class="cx-choix" id="cx-choix"></ol>
  <div class="jeu-message" id="cx-message" aria-live="polite"></div>
  <p class="cx-retenir" id="cx-retenir" hidden></p>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Choisissez un niveau et, pour Maths Sup, un thème, puis un énoncé, ou laissez la page en tirer un avec « Au hasard ». L'énoncé est faux ; cliquez sur l'objet qui le réfute. Si vous vous trompez, la page dit pourquoi cet objet ne réfute rien, et vous laisse chercher encore. Le nombre d'essais est compté. Les quatre objets sont présentés dans un ordre tiré au hasard à chaque fois. Un énoncé résolu est marqué d'une coche dans la liste, et votre navigateur s'en souvient ; « Recommencer » permet de le refaire.</p>
    <p>Un contre-exemple à « si H, alors C » est un objet qui vérifie H et ne vérifie pas C. Un contre-exemple à « pour tout x, P(x) » est un x pour lequel P(x) est faux. Il y a donc deux façons, pour un objet, de ne pas être un contre-exemple : ne pas vérifier l'hypothèse, auquel cas il ne dit rien ; ou vérifier aussi la conclusion, auquel cas il illustre l'énoncé sans le démontrer.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi un seul objet suffit</h4>
    <p>Un énoncé universel affirme quelque chose de tous les objets d'une famille. Mille exemples favorables ne le démontrent pas : le polynôme n² + n + 41 donne un nombre premier pour tous les entiers de 0 à 39, et un nombre composé pour 40. À l'inverse, un seul objet défavorable le réfute définitivement. C'est cette dissymétrie qui donne au contre-exemple sa force, et qui en fait un mode de raisonnement à part entière.</p>
    <p>Chercher un contre-exemple, c'est aussi comprendre une hypothèse : la fonction inverse sur ]0 ; 1] montre pourquoi le théorème des bornes atteintes demande un segment, et la multiplication par X sur les polynômes pourquoi « injectif donc surjectif » demande la dimension finie.</p>
  </div>
</section>
` + suite(
  "Proposer un objet qui ne vérifie pas l'hypothèse. Pour réfuter « toute suite bornée converge », la suite de terme général n ne sert à rien : elle n'est pas bornée, et l'énoncé ne parle pas d'elle. L'autre piège est de croire qu'un exemple favorable, ou plusieurs, démontre un énoncé général.",
  "Sous chaque énoncé, un lien mène au chapitre du cours où se trouve le théorème correct. Le contre-exemple comme mode de raisonnement, et la négation d'un énoncé universel, sont traités au chapitre <a href=\"#cours/ma-01\">Logique et ensembles</a> ; les connecteurs logiques sont définis à la fiche <a href=\"#log.l-connecteurs\">Connecteurs et tables de vérité</a> de l'édifice.",
  "Rien n'est calculé : chaque objet porte, rédigée à l'avance, la raison pour laquelle il réfute l'énoncé ou ne le réfute pas ; les valeurs numériques citées ont été vérifiées. Votre navigateur retient seulement les énoncés résolus et le nombre d'essais ; rien n'est envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], ordre = [], vus = new Set(), trouve = false, essais = 0, msg = '', niveau = 'tous', theme = 'tous', vivant = true, duParcours = false;
  const D = demande('contre-exemple'); if (D) { niveau = D.niveau; P = pieceDuJour(PIECES, niveau, 'contre-exemple') || P; duParcours = true; }
  const visibles = () => filtrer(PIECES, niveau, theme);
  function listes() { const M = lireMemoire('contre'), V = visibles();
    ecrire(q('#cx-niveaux'), pucesNiveaux(PIECES, niveau), true); const th = q('#cx-themes'); th.hidden = niveau !== 'sup'; if (niveau === 'sup') ecrire(th, pucesThemes(PIECES, theme), true);
    if (!V.includes(P)) P = V[0]; const sel = q('#cx-piece'); sel.innerHTML = options(V, niveau, theme, M); sel.value = P.id; }
  function charger() { vus = new Set(); trouve = false; essais = 0; msg = ''; ordre = P.choix.map((_, i) => i); for (let i = ordre.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; } rendre(); }
  function rendre() { if (!vivant) return; const fait = lireMemoire('contre')[P.id];
    ecrire(q('#cx-enonce'), '<b>Énoncé faux</b>' + P.enonce + (fait ? ` <span class="rz-fait">Fait, en ${fait} essai${fait > 1 ? 's' : ''}</span>` : '') + (P.cours ? ` <a class="rz-cours" href="#cours/${P.cours}">Le théorème dans le cours</a>` : ''), true);
    ecrire(q('#cx-choix'), ordre.map(i => { const c = P.choix[i], o = trouve && c.bon, n = vus.has(i) && !c.bon; return `<li><button type="button" data-i="${i}" class="${o ? 'oui' : n ? 'non' : ''}" ${trouve || n ? 'disabled' : ''}><span>${c.t}</span><span class="etat">${o ? 'le contre-exemple' : n ? 'ne réfute pas l\'énoncé' : ''}</span></button></li>`; }).join(''), true);
    const m = q('#cx-message'); m.className = 'jeu-message' + (trouve ? ' gagne' : ''); ecrire(m, msg || 'Cliquez sur l\'objet qui prouve que l\'énoncé est faux.', true);
    const r = q('#cx-retenir'); r.hidden = !trouve; if (trouve) ecrire(r, '<b>À retenir.</b> ' + P.retenir, true); }
  q('#cx-choix').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b || trouve) return; const i = +b.dataset.i, c = P.choix[i]; essais++; vus.add(i);
    if (c.bon) { trouve = true; noterMemoire('contre', P.id, essais, false); const p = validerPiece('contre-exemple', PIECES, P); listes(); msg = `<b>C'est le contre-exemple${essais === 1 ? ', trouvé du premier coup' : `, trouvé en ${essais} essais`}.</b> ` + c.pourquoi + (duParcours && p ? lienParcours : ''); }
    else msg = `<b>Cet objet ne réfute pas l'énoncé.</b> ` + c.pourquoi; rendre(); });
  q('#cx-depart').addEventListener('click', charger); q('#cx-piece').addEventListener('change', e => { P = PIECES.find(p => p.id === e.target.value); charger(); });
  q('#cx-hasard').addEventListener('click', () => { P = auHasard(visibles(), P, lireMemoire('contre')); listes(); charger(); });
  q('#cx-niveaux').addEventListener('click', e => { const b = e.target.closest('button[data-n]'); if (!b) return; niveau = b.dataset.n; theme = 'tous'; listes(); charger(); });
  q('#cx-themes').addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; theme = b.dataset.t; listes(); charger(); });
  listes(); charger(); return () => { vivant = false; };
}
