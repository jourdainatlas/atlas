// Pages de lecture indexables de la rubrique Activités (MEMO_atlas_activites.md, §119), sur le modèle de
// lecture-cours.mjs : à une vraie adresse, une page légère, sans script, avec un bouton « Ouvrir dans l'atlas ».
//   /activites/          les activités, groupe par groupe, puis celles qui n'ont pas de groupe
//   /activites/<id>/     une activité : ce qu'on y fait, ce que cela signifie, le piège, cours et fiches de l'édifice
// Une activité ne se lit pas : la page décrit en phrases ce qu'on y manipule (champ texte de rubriques/activites.yaml)
// et renvoie à l'atlas pour manipuler. L'enveloppe vient de outilsLecture(ctx).
import { outilsLecture } from './lecture.mjs';

export function pagesActivites(ctx) {
  const { D, texteBrut } = ctx;
  const { page, esc } = outilsLecture(ctx);
  const A = (D.rubriques || {}).activites || {}, acts = A.activites || [];
  const doms = (A.groupes || []).filter(d => acts.some(a => a.groupe === d.id)), seules = acts.filter(a => !doms.some(d => d.id === a.groupe));
  const cours = Object.fromEntries(((D.rubriques.cours || {}).cours || []).map(c => [c.id, c]));
  const fil0 = { name: 'Activités', href: '/activites/' };
  for (const a of acts) {
    const dom = doms.find(d => d.id === a.groupe);
    const liens = [
      ...(a.cours || []).filter(id => cours[id]).map(id => `<li><span class="l-sorte">Cours</span><a href="/cours/${id}/">${cours[id].titre}</a></li>`),
      ...(a.noeuds || []).filter(id => D.noeuds[id]).map(id => `<li><span class="l-sorte">Édifice</span><a href="/edifice/${id}/">${D.noeuds[id].titre}</a></li>`),
    ].join('');
    page({ chemin: `activites/${a.id}/`, ancre: `activites/${a.id}`, titre: `ATLAS – Activité : ${texteBrut(a.titre)} (${a.niveau})`,
      // image d'aperçu de l'activité (§77 du mémo À propos) : sa vignette, dans la couleur de son domaine ou de son groupe
      apercu: { cle: `activites/${a.id}`, rub: 'activites', sur: `Activité${dom ? ' · ' + texteBrut(dom.titre) : ''}`, titre: texteBrut(a.titre), sous: a.niveau || '', vignette: a.vignette || '',
        couleur: { analyse: 'c-ana', geometrie: 'c-geo', algebre: 'c-alg', nombres: 'c-nb', probabilites: 'c-nb', denombrement: 'c-nb' }[a.domaine] || { jeu: 'activites-jeu', calcul: 'activites-calcul', raison: 'activites-raison', geo: 'c-geo', annales: 'c-alg', marque: 'rouge', python: 'c-nb' }[(dom || a).couleur] || 'c-ord' },
      description: texteBrut(a.resume), fil: [fil0, { name: texteBrut(a.titre), href: `/activites/${a.id}/` }],
      corps: `<article class="fiche"><p class="sur-titre">Activité interactive · ${esc(a.niveau || '')}${dom ? ' · ' + esc(dom.titre) : ''}</p><h1>${a.titre}</h1>
<div class="texte">${a.resume || ''}</div>
<h2 class="l-sec">Ce que l'on y fait</h2><div class="texte">${a.texte || ''}</div>
${liens ? `<h2 class="l-sec">Où lire l'énoncé et la démonstration</h2><ul class="l-liste">${liens}</ul>` : ''}</article>` });
  }
  page({ chemin: 'activites/', ancre: 'activites', titre: 'ATLAS – Activités', description: texteBrut(A.intro), fil: [fil0],
    corps: `<article class="fiche"><h1>Activités</h1><div class="texte">${A.intro || ''}</div>
${doms.map(d => `<h2 class="l-sec">${esc(d.titre)}</h2><div class="texte">${d.intro || ''}</div><ul class="l-liste">${acts.filter(a => a.groupe === d.id).map(a => `<li><span class="l-sorte">${esc(a.niveau || '')}</span><a href="/activites/${a.id}/">${a.titre}</a></li>`).join('')}</ul>`).join('')}
${seules.map(a => `<h2 class="l-sec"><a href="/activites/${a.id}/">${a.titre}</a></h2><div class="texte">${a.resume || ''}</div>`).join('')}</article>` });
  return acts.length + 1;
}
