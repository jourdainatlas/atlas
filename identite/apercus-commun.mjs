// Images d'aperçu par page (MEMO_atlas_apropos.md §77) : ce que partagent la construction du site (lecture.mjs)
// et la fabrique (identite/fabriquer-apercus-pages.mjs).
// Une fiche d'aperçu : { cle, rub, sur, titre, sous?, couleur?, vignette? }.
//   cle      : chemin de l'image sans extension (identite/apercus/<cle>.png, publiée en /apercus/<cle>.png)
//   rub      : rubrique (symbole et couleur de la tuile) ; sur : ligne de contexte ; titre ; sous : ligne facultative
//   couleur  : nom d'une variable de couleur du gabarit (« c-ana », « activites-jeu »…), sinon celle de la rubrique
//   vignette : intérieur d'un <svg viewBox="0 0 120 72"> (vignette d'une activité), dessinée à la place du symbole
// L'empreinte dit si l'image fabriquée correspond encore à la fiche ; VERSION change quand le dessin change.
import crypto from 'node:crypto';
export const VERSION_APERCU = 1;
export const empreinteApercu = s => crypto.createHash('sha1')
  .update(VERSION_APERCU + JSON.stringify([s.rub, s.sur, s.titre, s.sous || '', s.couleur || '', s.vignette || ''])).digest('hex').slice(0, 10);
export const DOSSIER_APERCUS = 'identite/apercus', LISTE_APERCUS = 'construction/apercus.json';
