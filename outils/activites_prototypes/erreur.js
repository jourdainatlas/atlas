// PROTOTYPE, non publié : « Trouver l'erreur », sous-rubrique Raisonner (MEMO_atlas_activites.md §143).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .jeu { --activites-jeu: var(--rouge); }
.activites-act .er-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .er-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .er-lignes { display: grid; gap: 8px; padding: 14px 16px; margin: 0; list-style: none; counter-reset: ligne; }
.activites-act .er-lignes button { counter-increment: ligne; width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: start; text-align: left; padding: 10px 12px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); color: var(--encre); font: 16px/1.5 var(--f-texte, Georgia, serif); }
.activites-act .er-lignes button::before { content: counter(ligne); font: 700 13px var(--f-mono); color: var(--encre-3); padding-top: 3px; min-width: 1.2em; }
.activites-act .er-lignes button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .er-lignes button .etat { font: 600 12.5px var(--f-ui); white-space: nowrap; padding-top: 3px; }
.activites-act .er-lignes button.juste { border-color: var(--tan); } .activites-act .er-lignes button.juste .etat { color: var(--tan); }
.activites-act .er-lignes button.faute { border-color: var(--rouge); box-shadow: inset 4px 0 0 var(--rouge); background: var(--rouge-fond); } .activites-act .er-lignes button.faute .etat { color: var(--rouge); }
.activites-act .er-lignes button:disabled { cursor: default; opacity: 1; }
.activites-act .er-retenir { margin: 0 16px 14px; padding: 10px 14px; border-left: 3px solid var(--tan); background: color-mix(in srgb, var(--tan) 8%, var(--surface)); font: 15.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Trouver l'erreur</h3>
  <p class="lede">Chacun de ces raisonnements aboutit à une absurdité : 1 = 2, 2 &gt; 3, tous les chevaux ont la même couleur. Toutes les lignes ont l'air justes, et toutes le sont, sauf une. Laquelle ?</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Raisonnement <select id="er-piece"></select></label>
    <button type="button" class="primary" id="er-depart">Recommencer</button>
    <button type="button" id="er-indice">Un indice</button>
  </div>
  <p class="er-enonce" id="er-enonce"></p>
  <ol class="er-lignes" id="er-lignes"></ol>
  <div class="jeu-message" id="er-message" aria-live="polite"></div>
  <p class="er-retenir" id="er-retenir" hidden></p>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Lisez le raisonnement, puis cliquez sur la ligne que vous croyez fautive. Si vous vous trompez, la page dit pourquoi cette ligne-là est correcte, et vous laisse chercher encore. Quand vous trouvez, elle explique l'erreur et ce qu'il faut en retenir. Le nombre d'essais est compté : un raisonnement lu avec soin se résout au premier.</p>
    <p>Une ligne est fautive quand le passage de la ligne précédente à celle-ci n'est pas justifié. Les lignes qui suivent l'erreur sont souvent fausses elles aussi, mais elles se déduisent correctement de la ligne fautive : ce n'est pas elles qu'il faut désigner.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi chercher des erreurs</h4>
    <p>Une conclusion absurde prouve qu'une étape est fausse, sans dire laquelle : c'est le principe même du raisonnement par l'absurde, retourné contre l'auteur. Trouver l'étape oblige à vérifier, pour chaque « donc », la règle qui l'autorise et les conditions de cette règle. Diviser exige un diviseur non nul ; multiplier une inégalité exige de connaître le signe du facteur ; une hérédité doit valoir pour tous les rangs, y compris le premier.</p>
    <p>Ces fautes ne sont pas des curiosités. Ce sont celles que l'on commet soi-même dans un calcul long, quand la conclusion a l'air raisonnable et que rien n'alerte.</p>
  </div>
</section>
` + suite(
  "Désigner la dernière ligne, parce que c'est elle qui est absurde. La dernière ligne est fausse, mais elle découle correctement de la précédente : l'erreur est en amont, à l'endroit où une règle a été appliquée hors de ses conditions. L'autre réflexe trompeur est de soupçonner l'étape la plus compliquée ; l'erreur se cache presque toujours dans l'étape qui paraît aller de soi.",
  "Les propriétés du logarithme sont établies dans le chapitre de Terminale <a href=\"#cours/t-05\">Fonctions exponentielle et logarithme</a>, et la récurrence est introduite dans <a href=\"#cours/t-01\">Suites numériques</a> ; le principe de récurrence, avec le rôle de l'initialisation et de l'hérédité, est à la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a> de l'édifice.",
  "Rien n'est calculé : chaque ligne porte l'explication de sa justesse, ou de sa faute, rédigée à l'avance. Le nombre d'essais est compté dans la page et n'est ni enregistré ni envoyé.");

// Une pièce : annonce, lignes { t, ok (pourquoi la ligne est juste) } ; faute : rang de la ligne fautive ; pourquoi, retenir, indice.
const PIECES = [
  { nom: '1 = 2', annonce: `Soit ${K('a')} et ${K('b')} deux nombres réels égaux et non nuls. « Démontrons » que ${K('2 = 1')}.`, faute: 4, lignes: [
    { t: `On a ${K('a = b')}.`, ok: `C'est l'hypothèse.` },
    { t: `En multipliant les deux membres par ${K('a')} : ${K('a^2 = ab')}.`, ok: `Multiplier les deux membres d'une égalité par un même nombre donne une égalité.` },
    { t: `En retranchant ${K('b^2')} aux deux membres : ${K('a^2 - b^2 = ab - b^2')}.`, ok: `Retrancher un même nombre aux deux membres d'une égalité donne une égalité.` },
    { t: `En factorisant : ${K('(a - b)(a + b) = b(a - b)')}.`, ok: `Les deux factorisations sont exactes : identité remarquable à gauche, mise en facteur de ${K('b')} à droite.` },
    { t: `En simplifiant par ${K('a - b')} : ${K('a + b = b')}.` },
    { t: `Comme ${K('a = b')}, cela s'écrit ${K('2b = b')}.`, ok: `Cette ligne remplace ${K('a')} par ${K('b')} dans la ligne précédente : le passage est correct. La ligne est fausse parce que la précédente l'est.` },
    { t: `En divisant par ${K('b')}, qui n'est pas nul : ${K('2 = 1')}.`, ok: `La division par ${K('b')} est permise, puisque ${K('b \\neq 0')} : le passage est correct. La ligne est fausse parce que la précédente l'est.` }],
    pourquoi: `Simplifier par ${K('a - b')}, c'est diviser par ${K('a - b')}. Or ${K('a = b')}, donc ${K('a - b = 0')} : on a divisé par zéro. La ligne 4 dit seulement ${K('0 = 0')}, dont on ne peut rien tirer.`,
    retenir: `Avant de simplifier une égalité par une expression, on s'assure qu'elle n'est pas nulle. De ${K('xy = xz')} on déduit ${K('x = 0')} ou ${K('y = z')}, et non ${K('y = z')}.`, indice: `Une opération n'est permise qu'avec un nombre non nul. Quelles quantités sont nulles ici ?` },
  { nom: '2 > 3', annonce: `« Démontrons » que ${K('2 > 3')}.`, faute: 4, lignes: [
    { t: `On a ${K('\\dfrac14 > \\dfrac18')}.`, ok: `C'est exact : ${K('0{,}25 > 0{,}125')}.` },
    { t: `Autrement dit, ${K('\\left(\\dfrac12\\right)^2 > \\left(\\dfrac12\\right)^3')}.`, ok: `C'est la même inégalité, écrite avec des puissances.` },
    { t: `La fonction logarithme étant strictement croissante : ${K('\\ln\\left(\\left(\\dfrac12\\right)^2\\right) > \\ln\\left(\\left(\\dfrac12\\right)^3\\right)')}.`, ok: `Une fonction strictement croissante conserve le sens des inégalités, et les deux nombres sont strictement positifs.` },
    { t: `Donc ${K('2 \\ln\\dfrac12 > 3 \\ln\\dfrac12')}.`, ok: `C'est la règle ${K('\\ln(x^n) = n \\ln x')}, valable pour ${K('x > 0')}.` },
    { t: `En divisant les deux membres par ${K('\\ln\\dfrac12')} : ${K('2 > 3')}.` }],
    pourquoi: `Le nombre ${K('\\ln\\dfrac12 = -\\ln 2')} est strictement négatif. Diviser les deux membres d'une inégalité par un nombre strictement négatif en renverse le sens : la conclusion correcte est ${K('2 < 3')}.`,
    retenir: `On ne multiplie ni ne divise une inégalité par un nombre sans connaître son signe. Le logarithme d'un nombre compris entre 0 et 1 est négatif.`, indice: `Toutes les quantités écrites sont-elles positives ?` },
  { nom: 'Les chevaux de même couleur', annonce: `« Démontrons » par récurrence que, pour tout entier ${K('n \\geqslant 1')}, dans tout ensemble de ${K('n')} chevaux, tous les chevaux ont la même couleur.`, faute: 5, lignes: [
    { t: `Notons ${K('P(n)')} : « dans tout ensemble de ${K('n')} chevaux, tous ont la même couleur ».`, ok: `C'est seulement la définition de la propriété à démontrer.` },
    { t: `Initialisation : dans un ensemble d'un seul cheval, tous les chevaux ont la même couleur. Donc ${K('P(1)')} est vraie.`, ok: `C'est exact : avec un seul cheval, il n'y a rien à comparer.` },
    { t: `Hérédité : soit ${K('n \\geqslant 1')} tel que ${K('P(n)')} soit vraie, et soit un ensemble de ${K('n + 1')} chevaux, numérotés de ${K('1')} à ${K('n + 1')}.`, ok: `C'est la manière correcte de commencer une hérédité : on fixe un entier ${K('n \\geqslant 1')} quelconque.` },
    { t: `Les chevaux ${K('1')} à ${K('n')} forment un ensemble de ${K('n')} chevaux : d'après ${K('P(n)')}, ils ont tous la même couleur.`, ok: `C'est une application correcte de l'hypothèse de récurrence à un ensemble de ${K('n')} chevaux.` },
    { t: `De même, les chevaux ${K('2')} à ${K('n + 1')} sont au nombre de ${K('n')} : ils ont tous la même couleur.`, ok: `C'est encore une application correcte de l'hypothèse de récurrence.` },
    { t: `Ces deux groupes ont un cheval en commun, le cheval ${K('2')} : les ${K('n + 1')} chevaux ont donc tous sa couleur, et ${K('P(n + 1)')} est vraie.` },
    { t: `Par le principe de récurrence, ${K('P(n)')} est vraie pour tout ${K('n \\geqslant 1')}.`, ok: `Le principe de récurrence est correctement invoqué : si l'initialisation et l'hérédité étaient établies, la conclusion suivrait. C'est l'hérédité qui ne l'est pas.` }],
    pourquoi: `Pour ${K('n = 1')}, les deux groupes sont « le cheval 1 » et « le cheval 2 » : ils n'ont aucun cheval en commun, et le cheval 2 n'appartient pas au premier groupe. L'hérédité doit valoir pour tout ${K('n \\geqslant 1')} ; elle échoue pour ${K('n = 1')}, c'est-à-dire au passage de ${K('P(1)')} à ${K('P(2)')}. Elle est correcte pour tout ${K('n \\geqslant 2')}, mais cela ne sert à rien : ${K('P(2)')} est fausse.`,
    retenir: `Dans une hérédité, on vérifie que l'argument fonctionne pour le plus petit rang autorisé. Une récurrence dont le premier pas manque ne démontre rien, même si tous les suivants sont justes.`, indice: `Essayez le raisonnement avec ${K('n = 1')}, donc avec deux chevaux.` },
];
export { PIECES };

export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], vus = new Set(), trouve = false, essais = 0, msg = '', vivant = true;
  q('#er-piece').innerHTML = PIECES.map((p, i) => `<option value="${i}">${p.nom}</option>`).join('');
  function charger() { P = PIECES[+q('#er-piece').value]; vus = new Set(); trouve = false; essais = 0; msg = ''; rendre(); }
  function rendre() { if (!vivant) return; ecrire(q('#er-enonce'), '<b>Le raisonnement</b>' + P.annonce, true);
    ecrire(q('#er-lignes'), P.lignes.map((l, i) => { const f = trouve && i === P.faute, j = vus.has(i) && i !== P.faute; return `<li><button type="button" data-i="${i}" class="${f ? 'faute' : j ? 'juste' : ''}" ${trouve || j ? 'disabled' : ''}><span>${l.t}</span><span class="etat">${f ? 'l\'erreur' : j ? 'ligne correcte' : ''}</span></button></li>`; }).join(''), true);
    const m = q('#er-message'); m.className = 'jeu-message' + (trouve ? ' gagne' : ''); ecrire(m, msg || 'Cliquez sur la ligne où le raisonnement cesse d\'être correct.', true);
    const r = q('#er-retenir'); r.hidden = !trouve; if (trouve) ecrire(r, '<b>À retenir.</b> ' + P.retenir, true); q('#er-indice').disabled = trouve; }
  q('#er-lignes').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b || trouve) return; const i = +b.dataset.i; essais++; vus.add(i);
    if (i === P.faute) { trouve = true; msg = `<b>Ligne ${i + 1} : c'est bien l'erreur${essais === 1 ? ', trouvée du premier coup' : `, trouvée en ${essais} essais`}.</b> ` + P.pourquoi; }
    else msg = `<b>Ligne ${i + 1} : ce n'est pas l'erreur.</b> ` + P.lignes[i].ok; rendre(); });
  q('#er-indice').addEventListener('click', () => { if (trouve) return; msg = 'Vous avez demandé un indice : ' + P.indice; rendre(); });
  q('#er-depart').addEventListener('click', charger); q('#er-piece').addEventListener('change', charger);
  charger(); return () => { vivant = false; };
}
