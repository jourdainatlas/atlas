// PROTOTYPE, non publié : Raisonner « Compléter la démonstration » (rubrique Activités). Trois pièces d'essai, non relues par un second agent.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .jeu { --activites-jeu: var(--activites-raison); }
.activites-act .cd-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .cd-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .cd-lignes { display: grid; gap: 6px; padding: 14px 16px 6px; margin: 0; list-style: none; counter-reset: ligne; }
.activites-act .cd-lignes li { counter-increment: ligne; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 10px; padding: 8px 12px; border: 1px solid transparent; border-radius: 6px; font: 16.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .cd-lignes li::before { content: counter(ligne); font: 700 13px var(--f-mono); color: var(--encre-3); padding-top: 4px; min-width: 1.2em; }
.activites-act .cd-lignes li.ici { border-color: var(--activites-jeu); background: color-mix(in srgb, var(--activites-jeu) 7%, var(--surface)); }
.activites-act .cd-lignes li.fait { border-color: color-mix(in srgb, var(--tan) 55%, transparent); }
.activites-act .cd-trou { display: inline-block; min-width: 5.5em; padding: 0 10px; border: 1.5px dashed var(--encre-3); border-radius: 5px; text-align: center; font: 600 13px var(--f-ui); color: var(--encre-3); vertical-align: 1px; }
.activites-act li.ici .cd-trou { border-color: var(--activites-jeu); color: var(--activites-jeu); }
.activites-act .cd-rempli { border-bottom: 2px solid var(--tan); }
.activites-act .cd-question { margin: 6px 16px 0; font: 600 14px var(--f-ui); color: var(--encre-2); }
.activites-act .cd-choix { display: grid; gap: 8px; padding: 10px 16px 14px; }
.activites-act .cd-choix button { text-align: left; padding: 10px 12px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); color: var(--encre); font: 16px/1.5 var(--f-texte, Georgia, serif); cursor: pointer; }
.activites-act .cd-choix button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .cd-choix button:disabled { opacity: 1; }
.activites-act .cd-choix button.faute { border-color: var(--rouge); box-shadow: inset 4px 0 0 var(--rouge); background: var(--rouge-fond); cursor: default; }
.activites-act .cd-choix button .cd-pourquoi { display: block; margin-top: 6px; font: 14px/1.5 var(--f-ui); color: var(--encre-2); }
.activites-act .cd-choix .katex, .activites-act .cd-lignes .katex { pointer-events: none; }
.activites-act .cd-retenir { margin: 0 16px 14px; padding: 10px 14px; border-left: 3px solid var(--tan); background: color-mix(in srgb, var(--tan) 8%, var(--surface)); font: 15.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .cd-bilan { margin: 0 16px 12px; font: 600 14.5px var(--f-ui); color: var(--tan); }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · prototype</p>
  <h3>Compléter la démonstration</h3>
  <p class="lede">Une démonstration est écrite, mais il y manque des morceaux : une justification, un calcul, une conclusion. À chaque trou, plusieurs propositions ; une seule rend la ligne à la fois vraie et suffisante pour passer à la suivante.</p>
</header>

<div class="jeu">
  <div class="bar">
    <label class="rz-choix">Démonstration <select id="cd-piece"></select></label>
    <button type="button" class="primary" id="cd-depart">Recommencer</button>
  </div>
  <p class="cd-enonce" id="cd-enonce"></p>
  <ol class="cd-lignes" id="cd-lignes"></ol>
  <p class="cd-question" id="cd-question" aria-live="polite"></p>
  <div class="cd-choix" id="cd-choix"></div>
  <p class="cd-bilan" id="cd-bilan" hidden aria-live="polite"></p>
  <p class="cd-retenir" id="cd-retenir" hidden></p>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Lisez la démonstration en entier, trous compris : sa structure aide à deviner ce qui manque. Le trou en cours est encadré. Choisissez la proposition qui le comble ; si elle ne convient pas, la page dit pourquoi, et vous laisse choisir encore. Une proposition peut être écartée pour trois raisons différentes : elle est fausse, elle est vraie mais ne justifie pas le passage, ou elle suppose ce que l'on cherche à démontrer.</p>
  </div>
</section>
` + suite(
  "Choisir une phrase parce qu'elle est vraie. Dans une démonstration, une justification doit être vraie, mais aussi être celle qui autorise le passage : « car un carré est positif » est vrai, et ne justifie pas qu'une suite soit croissante.",
  "Prototype : les liens vers les chapitres du cours seront ajoutés pièce par pièce, comme dans « Trouver l'erreur ».",
  "Rien n'est calculé : chaque proposition porte son explication, rédigée à l'avance.");

// Une pièce : énoncé, lignes. Une ligne est un texte, ou { avant, apres, bon, faux: [[texte, pourquoi]], question } : le trou est entre « avant » et « apres ».
const PIECES = [
  { id: 'impair', niveau: 'Seconde', nom: "Le carré d'un entier impair est impair",
    enonce: `Soit ${K('n')} un entier impair. Alors ${K('n^2')} est impair.`,
    lignes: [
      { avant: `Comme ${K('n')} est impair, `, apres: `.`, question: `Que dit l'hypothèse ?`,
        bon: `il existe un entier ${K('k')} tel que ${K('n = 2k + 1')}`,
        faux: [[`${K('n = 2k + 1')} pour tout entier ${K('k')}`, `Un entier impair donné s'écrit ${K('2k + 1')} pour <em>un</em> entier ${K('k')}, pas pour tous : ${K('7 = 2 \\times 3 + 1')}, et ${K('7 \\neq 2 \\times 5 + 1')}.`],
               [`${K('n')} n'est pas divisible par 2, donc ${K('n^2')} non plus`, `C'est la conclusion que l'on veut établir, affirmée sans preuve.`],
               [`il existe un entier ${K('k')} tel que ${K('n = 2k')}`, `C'est la définition d'un entier pair.`]] },
      { avant: `Alors ${K('n^2 = (2k + 1)^2 = ')}`, apres: `.`, question: `Que vaut ce carré ?`,
        bon: `${K('4k^2 + 4k + 1')}`,
        faux: [[`${K('4k^2 + 1')}`, `Il manque le double produit : ${K('(a + b)^2 = a^2 + 2ab + b^2')}, et ici ${K('2ab = 4k')}.`],
               [`${K('2k^2 + 4k + 1')}`, `Le carré de ${K('2k')} est ${K('4k^2')}, et non ${K('2k^2')}.`],
               [`${K('4k^2 + 2k + 1')}`, `Le double produit vaut ${K('2 \\times 2k \\times 1 = 4k')}.`]] },
      { avant: `On met 2 en facteur : ${K('n^2 = 2\\,(2k^2 + 2k) + 1')}, où ${K('2k^2 + 2k')} est un entier, `, apres: `.`, question: `Pourquoi est-ce un entier ?`,
        bon: `car une somme et un produit d'entiers sont des entiers`,
        faux: [[`car ${K('n^2')} est un entier`, `C'est vrai, mais cela ne dit rien de ${K('2k^2 + 2k')} : la moitié d'un entier n'est pas toujours un entier.`],
               [`car ${K('2k^2 + 2k')} est pair`, `C'est vrai, mais pour dire qu'un nombre est pair il faut déjà savoir que c'est un entier.`],
               [`car ${K('k')} est positif`, `Rien ne dit que ${K('k')} est positif (${K('n = -3')} donne ${K('k = -2')}), et le signe n'a aucun rôle ici.`]] },
      { avant: `Donc `, apres: `.`, question: `Quelle est la conclusion ?`,
        bon: `${K('n^2')} est de la forme ${K('2m + 1')} avec ${K('m')} entier : il est impair`,
        faux: [[`${K('n^2')} est impair, car il se termine par 1`, `${K('4k^2 + 4k + 1')} ne se termine pas toujours par 1 : pour ${K('k = 1')}, il vaut 9.`],
               [`${K('n^2')} est divisible par 2, à 1 près`, `Cette phrase n'a pas de sens précis ; la définition d'un entier impair est d'être de la forme ${K('2m + 1')} avec ${K('m')} entier.`],
               [`${K('n')} est impair`, `C'est l'hypothèse, pas la conclusion.`]] }],
    retenir: `Une démonstration sur la parité part de la définition (${K('n = 2k')} ou ${K('n = 2k + 1')}, pour un certain entier ${K('k')}) et y revient : conclure, c'est exhiber la forme ${K('2m + 1')} en disant pourquoi ${K('m')} est entier.` },
  { id: 'majoree', niveau: 'Terminale', nom: 'Une suite majorée par 2, par récurrence',
    enonce: `La suite ${K('(u_n)')} est définie par ${K('u_0 = 0')} et, pour tout entier naturel ${K('n')}, ${K('u_{n+1} = \\sqrt{u_n + 2}')}. Alors, pour tout entier naturel ${K('n')}, ${K('0 \\leqslant u_n \\leqslant 2')}.`,
    lignes: [
      `Pour tout entier naturel ${K('n')}, on note ${K('P(n)')} la propriété « ${K('0 \\leqslant u_n \\leqslant 2')} ».`,
      { avant: `Initialisation : `, apres: `, donc ${K('P(0)')} est vraie.`, question: `Que faut-il vérifier ?`,
        bon: `${K('u_0 = 0')} et ${K('0 \\leqslant 0 \\leqslant 2')}`,
        faux: [[`${K('u_1 = \\sqrt2')} et ${K('0 \\leqslant \\sqrt2 \\leqslant 2')}`, `C'est ${K('P(1)')} que l'on vérifie ainsi. La récurrence doit commencer au rang 0, puisque l'énoncé porte sur tous les entiers naturels.`],
               [`on suppose que ${K('0 \\leqslant u_0 \\leqslant 2')}`, `L'initialisation ne se suppose pas : elle se vérifie.`],
               [`la suite est croissante`, `Ce n'est pas établi, et cela ne donnerait pas la valeur de ${K('u_0')}.`]] },
      { avant: `Hérédité : `, apres: ` Montrons que ${K('P(n + 1)')} est vraie.`, question: `Comment commence une hérédité ?`,
        bon: `soit ${K('n')} un entier naturel tel que ${K('P(n)')} soit vraie.`,
        faux: [[`supposons que ${K('P(n)')} soit vraie pour tout entier naturel ${K('n')}.`, `C'est supposer exactement ce que l'on veut démontrer. On fixe <em>un</em> entier ${K('n')} pour lequel ${K('P(n)')} est vraie.`],
               [`soit ${K('n')} un entier naturel tel que ${K('P(n + 1)')} soit vraie.`, `C'est la conclusion de l'hérédité que l'on suppose ici.`],
               [`on a vu que ${K('P(0)')} est vraie, donc ${K('P(1)')} l'est.`, `Passer de ${K('P(0)')} à ${K('P(1)')} demande un argument, et il faut le donner pour un rang ${K('n')} quelconque.`]] },
      `Par hypothèse de récurrence, ${K('0 \\leqslant u_n \\leqslant 2')}, donc ${K('2 \\leqslant u_n + 2 \\leqslant 4')}.`,
      { avant: `On en déduit ${K('\\sqrt2 \\leqslant \\sqrt{u_n + 2} \\leqslant 2')}, `, apres: `.`, question: `Qu'est-ce qui autorise à prendre la racine carrée des trois membres ?`,
        bon: `car la fonction racine carrée est croissante sur ${K('[0, +\\infty[')}`,
        faux: [[`car une racine carrée est toujours positive`, `C'est vrai, et cela donnerait ${K('\\sqrt{u_n + 2} \\geqslant 0')}, mais pas la majoration par 2 : c'est le sens de variation qui conserve l'ordre.`],
               [`car la fonction carré est croissante sur ${K('\\mathbb{R}')}`, `La fonction carré n'est pas croissante sur ${K('\\mathbb{R}')} : elle décroît sur ${K(']-\\infty, 0]')}.`],
               [`car ${K('\\sqrt{a + b} = \\sqrt a + \\sqrt b')}`, `Cette égalité est fausse : ${K('\\sqrt{9 + 16} = 5')}, alors que ${K('\\sqrt9 + \\sqrt{16} = 7')}.`]] },
      { avant: `Comme ${K('0 \\leqslant \\sqrt2')}, on obtient `, apres: ` : ${K('P(n + 1)')} est vraie.`, question: `Quelle inégalité obtient-on ?`,
        bon: `${K('0 \\leqslant u_{n+1} \\leqslant 2')}`,
        faux: [[`${K('0 \\leqslant u_n \\leqslant 2')}`, `C'est l'hypothèse de récurrence ; l'hérédité doit aboutir à l'encadrement de ${K('u_{n+1}')}.`],
               [`${K('u_n \\leqslant u_{n+1}')}`, `Cette inégalité est vraie pour cette suite, mais ce n'est ni ce qui vient d'être établi, ni ${K('P(n + 1)')}.`],
               [`${K('0 \\leqslant u_{n+1} < 2')}`, `L'inégalité stricte ne découle pas de ce qui précède, où ${K('u_n + 2 \\leqslant 4')} est large. Elle est d'ailleurs vraie, mais demanderait une autre propriété ${K('P(n)')}.`]] },
      { avant: `Conclusion : `, apres: `, ${K('P(n)')} est vraie pour tout entier naturel ${K('n')}.`, question: `Qu'est-ce qui permet de conclure ?`,
        bon: `la propriété est vraie au rang 0 et héréditaire ; par le principe de récurrence`,
        faux: [[`la propriété est vraie pour ${K('n = 0')}, ${K('n = 1')} et ${K('n = 2')} ; donc`, `Vérifier quelques rangs ne démontre rien pour tous les entiers.`],
               [`la suite étant convergente`, `La convergence n'a pas été établie ; c'est au contraire cette majoration qui servira à la démontrer.`],
               [`par passage à la limite`, `Aucune limite n'intervient : l'énoncé porte sur chaque terme de la suite.`]] }],
    retenir: `Une récurrence a trois temps, et chacun a sa phrase : on <em>vérifie</em> le premier rang, on <em>fixe un</em> rang où la propriété est vraie pour en déduire le suivant, et l'on invoque le principe de récurrence. Dans l'hérédité, chaque passage d'une inégalité à une autre s'appuie sur le sens de variation d'une fonction.` },
  { id: 'bornee', niveau: 'Maths Sup', nom: 'Toute suite convergente est bornée',
    enonce: `Soit ${K('(u_n)')} une suite réelle qui converge vers un réel ${K('\\ell')}. Alors ${K('(u_n)')} est bornée.`,
    lignes: [
      { avant: `Par définition de la limite, appliquée à `, apres: `, il existe un entier ${K('N')} tel que, pour tout ${K('n \\geqslant N')}, ${K('|u_n - \\ell| \\leqslant 1')}.`, question: `À quoi applique-t-on la définition ?`,
        bon: `${K('\\varepsilon = 1')}`,
        faux: [[`tout ${K('\\varepsilon > 0')}`, `Le rang ${K('N')} dépend de ${K('\\varepsilon')} : il n'existe pas un même ${K('N')} pour tous les ${K('\\varepsilon')}. Il faut choisir une valeur, et la ligne indique laquelle.`],
               [`${K('\\varepsilon = 0')}`, `La définition exige ${K('\\varepsilon > 0')} ; avec ${K('\\varepsilon = 0')} elle dirait que la suite est stationnaire.`],
               [`${K('n = N')}`, `La définition de la limite commence par le choix de ${K('\\varepsilon')} ; ${K('N')} n'existe pas encore.`]] },
      { avant: `Pour ${K('n \\geqslant N')}, on a alors ${K('|u_n| = |(u_n - \\ell) + \\ell| \\leqslant |u_n - \\ell| + |\\ell| \\leqslant 1 + |\\ell|')}, `, apres: `.`, question: `Quelle propriété donne la première inégalité ?`,
        bon: `par l'inégalité triangulaire`,
        faux: [[`car la valeur absolue d'une somme est la somme des valeurs absolues`, `C'est faux en général : ${K('|1 + (-1)| = 0')} et ${K('|1| + |-1| = 2')}. On a seulement une inégalité.`],
               [`car ${K('(u_n)')} est bornée`, `C'est ce que l'on cherche à démontrer.`],
               [`par croissance de la valeur absolue`, `La valeur absolue n'est pas une fonction croissante sur ${K('\\mathbb{R}')}.`]] },
      { avant: `Il reste les termes ${K('u_0, \\dots, u_{N-1}')}. Posons ${K('M = \\max\\left(|u_0|, \\dots, |u_{N-1}|, 1 + |\\ell|\\right)')}, qui existe `, apres: `.`, question: `Pourquoi ce maximum existe-t-il ?`,
        bon: `car un ensemble fini et non vide de réels a un plus grand élément`,
        faux: [[`car toute partie non vide et majorée de ${K('\\mathbb{R}')} a une borne supérieure`, `C'est vrai, mais une borne supérieure n'est pas toujours un maximum, et il faudrait déjà savoir l'ensemble majoré. Ici l'ensemble est fini : c'est plus simple et cela donne un maximum.`],
               [`car la suite ${K('(|u_n|)')} converge`, `Une suite convergente n'atteint pas forcément sa borne supérieure, et l'argument serait circulaire.`],
               [`car ${K('N')} est le plus petit rang qui convienne`, `Rien n'impose que ${K('N')} soit le plus petit, et cela n'a aucun rapport avec l'existence du maximum.`]] },
      { avant: `Alors, `, apres: `, ${K('|u_n| \\leqslant M')} : la suite est bornée.`, question: `Pour quels entiers la majoration vaut-elle ?`,
        bon: `pour tout entier naturel ${K('n')}, en distinguant ${K('n < N')} et ${K('n \\geqslant N')}`,
        faux: [[`pour tout ${K('n \\geqslant N')}`, `Cela ne borne que la fin de la suite ; être bornée concerne tous les termes, et c'est pour cela que ${K('M')} tient compte des ${K('N')} premiers.`],
               [`pour ${K('n')} assez grand`, `C'est la même insuffisance : « à partir d'un certain rang » n'est pas « pour tout ${K('n')} ».`],
               [`pour tout ${K('n < N')}`, `Il manque les rangs ${K('n \\geqslant N')}, traités à la ligne 2.`]] }],
    retenir: `La convergence ne renseigne que sur les termes de rang assez grand ; les premiers, en nombre fini, se traitent à part par un maximum. Et dans la définition de la limite, on <em>choisit</em> un ${K('\\varepsilon')} : le rang ${K('N')} en dépend.` }];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { p: 0, etape: 0, fautes: 0, ordre: [], ecartes: new Set() };
  const trous = P => P.lignes.map((l, i) => typeof l === 'string' ? -1 : i).filter(i => i >= 0);
  q('#cd-piece').innerHTML = PIECES.map((p, i) => `<option value="${i}">${p.niveau} · ${p.nom}</option>`).join('');
  const melanger = n => { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function etape(k) { const P = PIECES[E.p], T = trous(P); E.etape = k; E.ecartes = new Set(); if (k < T.length) E.ordre = melanger(P.lignes[T[k]].faux.length + 1); rendre(); }
  function depart() { E.fautes = 0; etape(0); }
  function rendre() {
    const P = PIECES[E.p], T = trous(P), fini = E.etape >= T.length, ici = fini ? -1 : T[E.etape];
    q('#cd-enonce').innerHTML = '<b>Énoncé</b>' + P.enonce;
    q('#cd-lignes').innerHTML = P.lignes.map((l, i) => { if (typeof l === 'string') return `<li><span>${l}</span></li>`;
      const rang = T.indexOf(i), fait = rang < E.etape;
      return `<li class="${fait ? 'fait' : i === ici ? 'ici' : ''}"><span>${l.avant}${fait ? `<span class="cd-rempli">${l.bon}</span>` : `<span class="cd-trou">${i === ici ? '?' : '…'}</span>`}${l.apres}</span></li>`; }).join('');
    q('#cd-question').textContent = fini ? '' : `Trou ${E.etape + 1} sur ${T.length}, ligne ${ici + 1}. ${P.lignes[ici].question}`;
    const L = fini ? null : P.lignes[ici];
    q('#cd-choix').innerHTML = fini ? '' : E.ordre.map(j => { const bon = j === L.faux.length, ecarte = E.ecartes.has(j);
      return `<button type="button" data-j="${j}" class="${ecarte ? 'faute' : ''}"${ecarte ? ' disabled' : ''}>${bon ? L.bon : L.faux[j][0]}${ecarte ? `<span class="cd-pourquoi">${L.faux[j][1]}</span>` : ''}</button>`; }).join('');
    q('#cd-bilan').hidden = !fini; q('#cd-retenir').hidden = !fini;
    if (fini) { q('#cd-bilan').textContent = E.fautes ? `Démonstration complétée, avec ${E.fautes} proposition${E.fautes > 1 ? 's' : ''} écartée${E.fautes > 1 ? 's' : ''} en chemin.` : 'Démonstration complétée sans aucune erreur.'; q('#cd-retenir').innerHTML = '<b>À retenir.</b> ' + P.retenir; }
  }
  q('#cd-choix').addEventListener('click', e => { const bt = e.target.closest('button[data-j]'); if (!bt || bt.disabled) return; const P = PIECES[E.p], L = P.lignes[trous(P)[E.etape]], j = +bt.dataset.j;
    if (j === L.faux.length) etape(E.etape + 1); else { E.ecartes.add(j); E.fautes++; rendre(); } });
  q('#cd-piece').addEventListener('change', e => { E.p = +e.target.value; depart(); });
  q('#cd-depart').addEventListener('click', depart);
  depart();
  return () => {};
}
