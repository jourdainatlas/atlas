// Activité « Bac à sable Python » (rubrique Activités, MEMO_atlas_activites.md, §161).
// L'atelier Python du site (python/atelier.js, domaine Cours, MEMO_atlas_cours.md §47), seul et sans exercice, dans sa
// disposition « cote ». Le module de l'atelier n'est importé qu'à l'ouverture de l'activité ; Python lui-même
// (Pyodide) n'est téléchargé qu'à la première exécution.
import { css as cssCommun } from './commun.js';

const EXEMPLE = `# Bac à sable : modifiez ce programme, ou effacez tout et écrivez le vôtre.
# « Exécuter » le lance ; « Déboguer » le déroule pas à pas.

def somme_des_carres(n):
    """Renvoie 1² + 2² + ... + n²."""
    total = 0
    for k in range(1, n + 1):
        total = total + k ** 2
    return total

n = 10
print("Somme des carrés de 1 à", n, ":", somme_des_carres(n))
print("Par la formule n(n+1)(2n+1)/6 :", n * (n + 1) * (2 * n + 1) // 6)
`;

export const css = cssCommun + `
.activites-act .bs-hote { margin-top: 22px; min-height: 120px; }
.activites-act .bs-hote .vide-note { font: 15px var(--f-ui); color: var(--encre-3); }
.activites-act .bs-mode { margin-top: 18px; font-size: 16px; color: var(--encre-2); }
.activites-act .bs-mode kbd, .activites-act .bs-texte code { font: 500 .88em var(--f-mono); }
.activites-act .bs-mode kbd { border: 1px solid var(--filet); border-radius: 4px; padding: 0 5px; }
.activites-act .bs-texte p { margin: 0 0 12px; line-height: 1.6; }
.activites-act .bs-texte q { font-style: italic; quotes: "« " " »"; }
.activites-act .bs-sources { font-size: 14.5px; line-height: 1.55; padding-left: 20px; margin: 6px 0 0; }
.activites-act .bs-sources li { margin-bottom: 4px; overflow-wrap: anywhere; }
`;

const ext = (url, nom) => `<a href="${url}" target="_blank" rel="noopener">${nom}</a>`;

export const html = `
<header class="col">
  <p class="eyebrow">Python · Lycée et au-delà</p>
  <h3>Bac à sable Python</h3>
  <p class="lede">Un éditeur, une console et rien d'autre : écrivez le programme que vous voulez, exécutez-le, déroulez-le pas à pas. Aucun exercice n'est imposé et rien n'est noté ; Python tourne dans votre navigateur.</p>
</header>

<div class="bs-hote" id="bs-hote"><p class="vide-note">L'atelier se charge…</p></div>

<p class="bs-mode">Le bouton « Exécuter » (ou <kbd>F5</kbd>, ou <kbd>Ctrl</kbd> + <kbd>Entrée</kbd>) lance le programme de l'éditeur ; ce qu'il affiche avec <code>print</code> paraît dans la console, et le cadre « Variables » montre ce que valent les variables à la fin. « Déboguer » déroule le programme une ligne après l'autre, et l'on voit chaque variable changer. Quand le programme appelle <code>input()</code>, la réponse se tape dans la console. Si un programme ne s'arrête pas, le bouton « Arrêter » l'interrompt. La ligne <code>&gt;&gt;&gt;</code> de la console accepte aussi une instruction isolée, pour un calcul rapide. Votre programme est gardé dans ce navigateur d'une visite à l'autre ; « Revenir à l'exemple » rétablit le programme de départ.</p>

<section class="suite bs-texte">
  <h4>Qu'est-ce que Python ?</h4>
  <p>Python est un langage de programmation : une façon d'écrire, sous forme de texte, les instructions qu'une machine doit suivre. C'est un langage interprété : un programme appelé interpréteur lit le texte et l'exécute instruction après instruction, sans étape de traduction préalable, ce qui permet d'essayer une idée et d'en voir aussitôt le résultat. Sa particularité la plus visible est que la mise en page fait partie du langage : les instructions qui dépendent d'un <code>if</code>, d'un <code>for</code> ou d'un <code>def</code> sont celles que l'on a décalées vers la droite. Un programme Python se lit donc à peu près comme l'algorithme qu'il réalise, et un décalage oublié ou de trop est l'erreur la plus répandue chez qui débute.</p>
  <p>Python est aussi un logiciel libre, que chacun peut utiliser et étudier sans rien payer ; ses droits sont détenus depuis 2001 par une fondation sans but lucratif, la <i>Python Software Foundation</i>. Le Python de cette page est la version 3.14, exécutée dans le navigateur : rien n'est à installer et aucun programme n'est envoyé au site.</p>

  <h4>Pourquoi l'apprend-on au lycée ?</h4>
  <p>L'algorithmique est entrée dans le programme de mathématiques de la classe de Seconde à la rentrée 2009, sans langage imposé. L'aménagement de ce programme en 2017 lui a consacré une partie entière, « Algorithmique et programmation », et a demandé un langage textuel ; le document d'accompagnement publié alors par le ministère est écrit en Python, retenu, y lit-on, pour la concision et la simplicité de sa syntaxe et pour l'étendue de sa communauté d'utilisateurs. Les programmes entrés en vigueur à la rentrée 2019 ont confirmé ce choix : Python est aujourd'hui le langage du lycée général et technologique, en mathématiques comme dans les enseignements d'informatique.</p>
  <p>En mathématiques, programmer sert à expérimenter : calculer les mille premiers termes d'une suite, simuler dix mille lancers d'un dé, chercher par balayage une solution approchée d'une équation. Le programme ne démontre rien, mais il fait naître des conjectures et il oblige à dire exactement ce que l'on calcule. Le cours <a href="#cours/py-01">Initiation à Python</a> reprend tout depuis le début, et chacun de ses exemples peut s'essayer ici.</p>

  <h4>Une histoire commencée à Noël 1989</h4>
  <p>Python est né aux Pays-Bas. Guido van Rossum travaillait à Amsterdam, au <i>Centrum Wiskunde &amp; Informatica</i> (CWI), où il avait participé à la réalisation d'un langage d'enseignement nommé ABC, puis rejoint l'équipe du système d'exploitation Amoeba. Il lui manquait un langage aussi lisible qu'ABC mais que l'on puisse étendre. Pendant les vacances de Noël 1989, il s'est mis à l'écrire, et il en a publié la première version, numérotée 0.9.0, en février 1991.</p>
  <p>Le nom ne vient pas du serpent. Van Rossum lisait alors les scénarios publiés du <i>Monty Python's Flying Circus</i>, série comique de la BBC, et la documentation officielle rapporte qu'il voulait un nom <q lang="en">short, unique, and slightly mysterious</q>, c'est-à-dire court, unique et un peu mystérieux. Le cours rappelle la même origine dans sa section « Python, de 1991 à nos jours ».</p>
  <p>Le langage a ensuite grandi par étapes. Van Rossum a poursuivi son travail aux États-Unis à partir de 1995 ; Python 2.0 est paru en 2000. Python 3.0, publié le 3 décembre 2008, a corrigé des défauts anciens au prix d'une rupture : les programmes écrits pour Python 2 ne fonctionnaient plus sans retouches. Les deux versions ont coexisté plus de dix ans, jusqu'à l'abandon de Python 2 le 1<sup>er</sup> janvier 2020. C'est pourquoi l'on trouve encore, dans de vieux documents, des <code>print</code> sans parenthèses qui ne fonctionnent plus.</p>
  <p>Van Rossum a longtemps tranché seul les décisions difficiles, avec le titre mi-sérieux de « dictateur bienveillant à vie ». Il s'en est retiré en juillet 2018, et le langage est depuis conduit par un conseil de cinq personnes élues par ses développeurs. L'esprit de Python tient en dix-neuf maximes rédigées par Tim Peters, l'un de ses développeurs de la première heure, dont celle-ci : <q lang="en">Readability counts</q>, la lisibilité compte. Pour les lire toutes, effacez l'éditeur, écrivez <code>import this</code> et exécutez.</p>

  <h4>Sources</h4>
  <ul class="bs-sources">
    <li>Documentation de Python, ${ext('https://docs.python.org/3/faq/general.html', '<i>General Python FAQ</i>')} (« Why was Python created in the first place? », « Why is it called Python? ») et ${ext('https://docs.python.org/3/license.html', '<i>History and License</i>')}.</li>
    <li>Guido van Rossum, ${ext('https://www.python.org/doc/essays/foreword', 'avant-propos de <i>Programming Python</i>')} (Mark Lutz, O'Reilly, 1<sup>re</sup> édition, 1996).</li>
    <li>python.org, ${ext('https://www.python.org/download/releases/3.0/', '<i>Python 3.0 Release</i>')} et ${ext('https://www.python.org/doc/sunset-python-2/', '<i>Sunsetting Python 2</i>')}.</li>
    <li>${ext('https://peps.python.org/pep-0013/', 'PEP 13')}, <i>Python Language Governance</i>, et ${ext('https://peps.python.org/pep-0020/', 'PEP 20')}, <i>The Zen of Python</i>, Tim Peters, 2004.</li>
    <li>Ministère de l'Éducation nationale : ${ext('https://www.education.gouv.fr/bo/17/Hebdo18/MENE1712512C.htm', 'circulaire n° 2017-082 du 2 mai 2017')} (Bulletin officiel n° 18 du 4 mai 2017), ressource Éduscol <i>Algorithmique et programmation</i> (juin 2017), et ${ext('https://www.education.gouv.fr/bo/19/Special1/MENE1901631A.htm', 'programme de mathématiques de Seconde')} (Bulletin officiel spécial n° 1 du 22 janvier 2019).</li>
  </ul>
</section>
`;

export function monter(racine) {
  const hote = racine.querySelector('#bs-hote');
  let atelier = null, vivant = true;
  import('/python/atelier.js').then((m) => {
    if (!vivant) return;
    hote.textContent = '';
    atelier = m.monterAtelier(hote, { wid: 'activites/bac-a-sable', nom: 'essai.py', code: EXEMPLE, retour: "Revenir à l'exemple", disposition: 'cote' });
  }).catch(() => { if (vivant) hote.innerHTML = '<p class="vide-note">L\'atelier Python n\'a pas pu être chargé. Vérifiez la connexion, puis rechargez la page.</p>'; });
  // En quittant l'activité, un programme encore en cours (boucle sans fin, saisie attendue) est arrêté.
  return () => { vivant = false; try { atelier?.arreter(); } catch {} };
}
