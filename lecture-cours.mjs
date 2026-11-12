// Pages de lecture indexables des rubriques Cours et Exercices (domaine « Cours », MEMO_atlas_cours.md, §29).
//
// Même principe que lecture.mjs pour l'édifice et les annales : à une vraie adresse, une page complète et
// légère, sans redirection, avec le texte déjà composé et un bouton « Ouvrir dans l'atlas ». Ces pages
// remplacent les anciennes pages de partage des cours et des exercices, qui redirigeaient vers une ancre.
//   /cours/                     les niveaux et leurs chapitres
//   /cours/<id>/                un chapitre : résumé, sommaire, PDF, feuille d'exercices, théories, chapitres liés
//   /exercices/                 les niveaux, puis leurs feuilles
//   /exercices/feuille/<id>/    une feuille : ses exercices, partie par partie
//   /exercices/<id>/            un exercice : énoncé composé, corrigé replié, source, PDF, notions de l'édifice
// L'enveloppe (en-tête, fil d'Ariane, pied, style, données structurées, plan du site) vient de
// outilsLecture(ctx) ; rien du gabarit n'est recopié ici.
import { outilsLecture } from './lecture.mjs';

// Texte lisible d'un HTML composé, pour les descriptions et les extraits : chaque formule KaTeX est remplacée
// par sa source TeX simplifiée (\\frac{a}{b} → a/b, \\pi → π…), au lieu du texte haché de son rendu HTML.
const TEX = { pi: 'π', infty: '∞', leqslant: '≤', geqslant: '≥', leq: '≤', geq: '≥', le: '≤', ge: '≥', neq: '≠', in: '∈', notin: '∉',
  times: '×', cdot: '·', to: '→', mapsto: '↦', Rightarrow: '⇒', Leftrightarrow: '⇔', iff: '⇔', forall: '∀', exists: '∃', subset: '⊂',
  cup: '∪', cap: '∩', emptyset: '∅', varnothing: '∅', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', varepsilon: 'ε', epsilon: 'ε',
  lambda: 'λ', mu: 'μ', theta: 'θ', varphi: 'φ', phi: 'φ', omega: 'ω', sigma: 'σ', Delta: 'Δ', Omega: 'Ω', sum: 'Σ', prod: 'Π',
  int: '∫', sqrt: '√', pm: '±', approx: '≈', sim: '∼', ldots: '…', dots: '…', cdots: '…', circ: '∘', partial: '∂', nabla: '∇' };
function texSimple(t) {
  const simple = x => /^[\p{L}\p{N}.,′'∞π]+$/u.test(x.trim());
  const groupe = x => simple(x) ? x.trim() : `(${x.trim()})`;
  t = t.replace(/\\mathbb\{([A-Z])\}/g, (m, l) => ({ R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', U: '𝕌' })[l] || l)
    .replace(/\\(left|right|big|Big|bigg|Bigg|displaystyle|textstyle|limits|mathrm|mathbf|mathcal|operatorname|text|boxed|quad|qquad)(?![A-Za-z])/g, ' ')
    .replace(/\\(?!d?frac(?![A-Za-z])|tfrac(?![A-Za-z])|sqrt(?![A-Za-z]))([A-Za-z]+)/g, (m, c) => TEX[c] ?? c + ' ');
  // des groupes les plus intérieurs vers l'extérieur : exposants, indices, racines, fractions
  for (let k = 0; k < 6; k++) t = t
    .replace(/([\^_])\{([^{}]*)\}/g, (m, op, x) => op + groupe(x))
    .replace(/\\sqrt\{([^{}]*)\}/g, (m, x) => '√' + groupe(x))
    .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => ` ${groupe(a)}/${groupe(b)} `)
    .replace(/(?<![A-Za-z}])\{([^{}]*)\}/g, '$1');   // accolades de groupement, sauf celles d'une fraction
  t = t.replace(/\\[dt]?frac\s*(\S)(\S)/g, '$1/$2').replace(/\\sqrt/g, '√').replace(/\\[,;:! ]/g, ' ').replace(/\\/g, '');
  return t.replace(/\s+/g, ' ').trim();
}
// Texte d'origine (Markdown et TeX, avant composition) : lu dans construction/donnees.json, que rendu.mjs
// compose en place ; les formules y sont simplifiées plutôt qu'extraites du rendu KaTeX, illisible en texte.
function texteSource(md) {
  return String(md || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, a, b) => ' ' + texSimple(a ?? b) + ' ')
    .replace(/\*\*|\*|`/g, '').replace(/\[\[([^\]|]+)\|([^\]]*)\]\]/g, '$2').replace(/\{\{[^}|]+\|([^}]*)\}\}/g, '$1')
    .replace(/\s+/g, ' ').replace(/\s+([,.;:)])/g, '$1').replace(/\(\s+/g, '(').trim();
}

export function pagesCoursExercices(ctx) {
  const { D, attr, coupe, texteBrut, fs } = ctx;
  const brut = JSON.parse(fs.readFileSync('construction/donnees.json', 'utf8')).rubriques || {};
  const srcExo = Object.fromEntries((brut.exercices?.exercices || []).map(e => [e.id, e]));
  const srcCours = Object.fromEntries((brut.cours?.cours || []).map(c => [c.id, c]));
  const { page, puce, relier, esc } = outilsLecture(ctx);
  // Lien partagé depuis le site (bouton Partager de l'en-tête : ?page=n pour un cours, ?ouvrir pour un exercice ou
  // une feuille) : le visiteur va droit à la page interactive. Les aperçus des messageries et les moteurs, qui
  // lisent l'adresse sans paramètre (canonical) ou n'exécutent pas le script, gardent la page de lecture.
  // DOMContentLoaded : après le script de lecture.mjs qui ajoute la page au lien « Ouvrir ».
  const ALLER = `<script>if(/[?&](page=\\d+|ouvrir)(&|$)/.test(location.search))document.addEventListener('DOMContentLoaded',function(){var a=document.querySelector('a.l-ouvrir');if(a)location.replace(a.href)});</script>`;
  const R = D.rubriques || {};
  const niveaux = R.cours?.niveaux || [];
  const niveau = id => niveaux.find(n => n.id === id) || { id, titre: id };
  const coursTous = (R.cours?.cours || []).filter(c => c.statut === 'depose');
  const coursDe = id => coursTous.find(c => c.id === id);
  const E = R.exercices || {};
  const feuilles = (E.feuilles || []).filter(f => f.statut === 'depose');
  const feuilleDe = id => feuilles.find(f => f.id === id);
  const exos = E.exercices || [];
  const exosDe = fid => exos.filter(e => e.feuille === fid).sort((a, b) => a.numero - b.numero);
  const ordreNiv = id => { const k = niveaux.findIndex(n => n.id === id); return k < 0 ? 99 : k; };
  const pdf = (u, p) => u ? '/' + encodeURI(String(u).replace(/^\//, '')) + (p ? `#page=${p}` : '') : '';
  // Une notion du lexique mène à la page de la fiche qui la définit (le lexique n'a pas de pages propres).
  const notion = id => { const t = D.lexique?.[id]; if (!t) return ''; return t.defini && D.noeuds[t.defini] ? `<a href="/edifice/${t.defini}/">${esc(t.terme)}</a>` : esc(t.terme); };
  const difficulte = k => k ? `<span class="difficulte" title="Difficulté ${k} sur 4" aria-label="Difficulté ${k} sur 4">${[1, 2, 3, 4].map(i => `<i class="${i <= k ? 'plein' : ''}"></i>`).join('')}</span>` : '';
  const puces = ids => (ids || []).filter(id => D.noeuds[id]).map(puce).join('');
  const lieuFeuille = f => `${texteBrut(niveau(f.niveau).titre)}${f.chapitre ? `, chapitre ${f.chapitre}` : ''}`;
  const lieuCours = c => `${texteBrut(niveau(c.niveau).titre)}${c.chapitre ? `, chapitre ${c.chapitre}` : ''}`;
  const boutons = l => `<div class="l-boutons">${l.filter(Boolean).join('')}</div>`;
  const bouton = (href, texte, plein) => href ? `<a${plein ? ' class="plein"' : ''} href="${attr(href)}"${/^\/documents\//.test(href) ? ' rel="noopener"' : ''}>${texte}</a>` : '';
  const FIL_C = { name: 'Cours', href: '/cours/' }, FIL_E = { name: 'Exercices', href: '/exercices/' };
  let n = 0;

  // ---------------------------------------------------------------- cours
  for (const c of coursTous) {
    const nv = niveau(c.niveau), f = feuilleDe(c.exercices);
    let h = `<article class="fiche l-ann"><p class="sur-titre"><span class="sorte">Cours</span><span>${esc(lieuCours(c))}</span></p>`;
    h += `<h1>${c.titre}</h1>`;
    h += boutons([bouton(pdf(c.pdf), `Cours (PDF${c.pages ? `, ${c.pages} pages` : ''})`, true),
      f && bouton(`/exercices/feuille/${f.id}/`, `Les ${f.nombre || exosDe(f.id).length} exercices corrigés`),
      f && bouton(pdf(f.pdf_enonce), 'Feuille (PDF)'), f && bouton(pdf(f.pdf_corrige), 'Corrigé (PDF)'),
      ...(R.cours?.formulaires || []).filter(x => x.pdf && (x.chapitres || []).includes(c.id)).map(x => bouton(pdf(x.pdf), `Formulaire : ${x.titre} (PDF)`))]);
    if (c.resume) h += relier(c.resume);
    if ((c.sommaire || []).length) {
      h += `<h2 class="l-sec">Sommaire</h2><ol class="l-sommaire">${c.sommaire.map((s, i) => { const p = (c.sommaire_pages || [])[i];
        return `<li>${p && c.pdf ? `<a href="${attr(pdf(c.pdf, p))}">${s}</a> <span class="l-sorte">p. ${p}</span>` : s}</li>`; }).join('')}</ol>`;
    }
    const acts = (R.activites?.activites || []).filter(x => (x.cours || []).includes(c.id));
    if (acts.length) h += `<h2 class="l-sec">Activités</h2><ul class="l-liste">${acts.map(x => `<li><a href="/activites/${x.id}/">${texteBrut(x.titre)}</a>${x.niveau ? ` <span class="l-sorte">${esc(x.niveau)}</span>` : ''}</li>`).join('')}</ul>`;
    const liens = [...new Set([...(c.liens || []), ...coursTous.filter(x => (x.liens || []).includes(c.id)).map(x => x.id)])].map(coursDe).filter(Boolean)
      .sort((a, b) => ordreNiv(a.niveau) - ordreNiv(b.niveau) || (a.chapitre || 0) - (b.chapitre || 0));
    h += `<div class="liens">`;
    if ((c.theories || []).length) h += `<div><h3>Dans l'édifice</h3><div class="puces">${puces(c.theories)}</div></div>`;
    if ((c.notions || []).length) h += `<div><h3>Notions</h3><p class="l-meta l-notions">${c.notions.map(notion).filter(Boolean).join(', ')}</p></div>`;
    if (liens.length) h += `<div><h3>Chapitres liés</h3><ul class="l-liste">${liens.map(x => `<li><span class="l-sorte">${esc(lieuCours(x))}</span><a href="/cours/${x.id}/">${x.titre}</a></li>`).join('')}</ul></div>`;
    h += `</div>`;
    const meme = coursTous.filter(x => x.niveau === c.niveau).sort((a, b) => (a.chapitre || 0) - (b.chapitre || 0)), k = meme.indexOf(c);
    h += navigation(meme[k - 1] && { href: `/cours/${meme[k - 1].id}/`, texte: meme[k - 1].titre }, meme[k + 1] && { href: `/cours/${meme[k + 1].id}/`, texte: meme[k + 1].titre });
    h += `</article>`;
    page({ chemin: `cours/${c.id}/`, titre: `ATLAS – Cours : ${texteBrut(c.titre)} (${lieuCours(c)})`, description: `Cours de ${lieuCours(c)}. ${texteSource(srcCours[c.id]?.resume)}`,
      ancre: `cours/${c.id}`, fil: [FIL_C, { name: texteBrut(nv.titre), href: `/cours/#${nv.id}` }, { name: texteBrut(c.titre) }], corps: h + ALLER,
      apercu: { cle: `cours/${c.id}`, rub: 'cours', sur: `Cours · ${lieuCours(c).replace(', ', ' · ')}`, titre: texteBrut(c.titre) } });
    n++;
  }
  {
    let h = `<article class="fiche"><p class="sur-titre"><span class="sorte">Rubrique</span></p><h1>Cours</h1>${relier(R.cours?.intro || '')}</article>`;
    for (const nv of niveaux) {
      const cs = coursTous.filter(c => c.niveau === nv.id).sort((a, b) => (a.chapitre || 0) - (b.chapitre || 0));
      if (!cs.length) continue;
      h += `<h2 class="l-sec" id="${attr(nv.id)}">${nv.titre}</h2>${nv.description ? `<p class="l-meta">${esc(texteBrut(nv.description))}</p>` : ''}`;
      h += `<ul class="l-liste">${cs.map(c => `<li>${c.chapitre ? `<span class="l-sorte">Chapitre ${c.chapitre}</span>` : ''}<a href="/cours/${c.id}/">${c.titre}</a></li>`).join('')}</ul>`;
    }
    page({ chemin: 'cours/', titre: 'ATLAS – Cours', description: texteBrut(R.cours?.intro) || 'Cours de mathématiques, du lycée au master, chapitre par chapitre.',
      ancre: 'cours', fil: [{ name: 'Cours' }], corps: h });
    n++;
  }

  // ---------------------------------------------------------------- exercices
  for (const f of feuilles) {
    const nv = niveau(f.niveau), c = coursDe(f.cours), liste = exosDe(f.id);
    if (!liste.length) continue;
    const filF = [FIL_E, { name: texteBrut(nv.titre), href: `/exercices/#${nv.id}` }];
    // image d'aperçu : une par feuille, que partagent la page de la feuille et celles de ses exercices
    const apercuF = { cle: `exercices/${f.id}`, rub: 'exercices', sur: `Feuille d’exercices corrigés · ${texteBrut(nv.titre)}`, titre: texteBrut(f.titre), sous: `${liste.length} exercices${f.chapitre ? `, chapitre ${f.chapitre}` : ''}` };
    // une page par exercice
    liste.forEach((e, k) => {
      let h = `<article class="fiche l-ann l-exo"><p class="sur-titre"><span class="sorte">Exercice</span><span>${esc(lieuFeuille(f))} — ${f.titre}${e.partie ? ` · ${e.partie}` : ''}</span></p>`;
      h += `<h1>Exercice ${e.numero}${e.titre ? ` <span class="l-titre-exo">${e.titre}</span>` : ''}</h1>`;
      h += `<p class="l-meta l-etiquettes">${difficulte(e.etoiles)}${(e.types || []).map(t => `<span class="etiquette-type">${esc(t)}</span>`).join('')}</p>`;
      h += `<div class="exo"><div class="exo-enonce">${relier(e.enonce || '')}</div>`;   // classe exo : style du site pour l'énoncé et le corrigé
      if (e.source) h += `<p class="source-exo">Source : ${esc(e.source)}</p>`;
      if (e.corrige) h += `<details class="corrige"><summary>Corrigé</summary><div class="contenu">${relier(e.corrige)}</div></details>`;
      h += `</div>`;
      h += boutons([bouton(pdf(f.pdf_enonce, e.page_enonce), `Énoncé PDF${e.page_enonce ? `, p. ${e.page_enonce}` : ''}`),
        bouton(pdf(f.pdf_corrige, e.page_corrige), `Corrigé PDF${e.page_corrige ? `, p. ${e.page_corrige}` : ''}`),
        bouton(`/exercices/feuille/${f.id}/`, 'Toute la feuille'), c && bouton(`/cours/${c.id}/`, 'Le cours')]);
      h += `<div class="liens">`;
      if ((e.noeuds || []).length) h += `<div><h3>Dans l'édifice</h3><div class="puces">${puces(e.noeuds)}</div></div>`;
      const nn = (e.notions || []).map(notion).filter(Boolean);
      if ((e.mots_cles || []).length) h += `<div><h3>Thèmes</h3><p class="l-meta">${e.mots_cles.map(esc).join(', ')}</p></div>`;
      if (nn.length) h += `<div><h3>Notions</h3><p class="l-meta l-notions">${nn.join(', ')}</p></div>`;
      h += `</div>`;
      h += navigation(liste[k - 1] && { href: `/exercices/${liste[k - 1].id}/`, texte: `Exercice ${liste[k - 1].numero}` }, liste[k + 1] && { href: `/exercices/${liste[k + 1].id}/`, texte: `Exercice ${liste[k + 1].numero}` });
      h += `</article>`;
      page({ chemin: `exercices/${e.id}/`, titre: `ATLAS – Exercice ${e.numero}${e.titre ? ` (${texteBrut(e.titre)})` : ''} : ${texteBrut(f.titre)}, ${lieuFeuille(f)}`,
        description: `Exercice corrigé, ${texteBrut(f.titre)} (${lieuFeuille(f)}). ${texteSource(srcExo[e.id]?.enonce)}`, ancre: `exercices/ex/${e.id}`,
        fil: [...filF, { name: texteBrut(f.titre), href: `/exercices/feuille/${f.id}/` }, { name: `Exercice ${e.numero}` }], corps: h + ALLER, apercu: apercuF });
      n++;
    });
    // la page de la feuille
    let h = `<article class="fiche l-ann"><p class="sur-titre"><span class="sorte">Feuille d'exercices</span><span>${esc(lieuFeuille(f))}</span></p><h1>${f.titre}</h1>`;
    h += `<p class="l-meta">${liste.length} exercices corrigés${(f.etoiles || []).some(Boolean) ? ' · ' + f.etoiles.map((k, i) => k ? `${difficulte(i + 1)} ${k}` : '').filter(Boolean).join(' &nbsp; ') : ''}</p>`;
    h += boutons([bouton(pdf(f.pdf_enonce), 'Énoncés (PDF)', true), bouton(pdf(f.pdf_corrige), 'Corrigés (PDF)'), c && bouton(`/cours/${c.id}/`, 'Le cours')]);
    let partie = null;
    for (const e of liste) {
      if (e.partie !== partie) { if (partie !== null) h += '</ul>'; partie = e.partie; h += `${partie ? `<h2 class="l-sec">${partie}</h2>` : ''}<ul class="l-liste l-exos">`; }
      h += `<li><a href="/exercices/${e.id}/">Exercice ${e.numero}${e.titre ? ` · ${e.titre}` : ''}</a> ${difficulte(e.etoiles)}<span class="l-extrait">${esc(coupe(texteSource(srcExo[e.id]?.enonce), 150))}</span></li>`;
    }
    h += '</ul></article>';
    page({ chemin: `exercices/feuille/${f.id}/`, titre: `ATLAS – Exercices : ${texteBrut(f.titre)} (${lieuFeuille(f)})`,
      description: `${liste.length} exercices corrigés, ${texteBrut(f.titre)} (${lieuFeuille(f)}).${c ? ` ${texteSource(srcCours[c.id]?.resume)}` : ''}`, ancre: `exercices/feuille/${f.id}`,
      fil: [...filF, { name: texteBrut(f.titre) }], corps: h + ALLER, apercu: apercuF });
    n++;
  }
  {
    let h = `<article class="fiche"><p class="sur-titre"><span class="sorte">Rubrique</span></p><h1>Exercices</h1>${relier(E.intro || '')}<p class="l-meta">${exos.length} exercices corrigés, ${feuilles.length} feuilles.</p></article>`;
    for (const nv of niveaux) {
      const fs = feuilles.filter(f => f.niveau === nv.id && exosDe(f.id).length).sort((a, b) => (a.chapitre || 0) - (b.chapitre || 0));
      if (!fs.length) continue;
      h += `<h2 class="l-sec" id="${attr(nv.id)}">${nv.titre}</h2>`;
      h += `<ul class="l-liste">${fs.map(f => `<li>${f.chapitre ? `<span class="l-sorte">Chapitre ${f.chapitre}</span>` : ''}<a href="/exercices/feuille/${f.id}/">${f.titre}</a> <span class="l-sorte">— ${exosDe(f.id).length} exercices</span></li>`).join('')}</ul>`;
    }
    page({ chemin: 'exercices/', titre: 'ATLAS – Exercices', description: texteBrut(E.intro) || 'Exercices corrigés de mathématiques, du lycée au master.',
      ancre: 'exercices', fil: [{ name: 'Exercices' }], corps: h });
    n++;
  }
  return n;

  function navigation(prec, suiv) {
    if (!prec && !suiv) return '';
    return `<nav class="l-suite" aria-label="Précédent et suivant">${prec ? `<a href="${attr(prec.href)}">← ${prec.texte}</a>` : '<span></span>'}${suiv ? `<a href="${attr(suiv.href)}">${suiv.texte} →</a>` : ''}</nav>`;
  }
}
