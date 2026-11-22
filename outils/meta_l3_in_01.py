"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 1 (Tribus et mesures positives)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'préliminaires ensemblistes', ['m-tribus'], ['tribu']),
           (7, 17, 'algèbres de Boole et tribus', ['m-tribus'], ['tribu', 'tribu-engendree']),
           (18, 20, 'boréliens', ['m-tribus', 'm-droite-achevee'], ['tribu-borelienne']),
           (21, 35, 'mesures', ['m-mesures'], ['mesure', 'espace-mesure'])]
R = [(r'classe monotone|\\pi-système|Dynkin|\\lambda-système', 'classe monotone', ['m-dynkin'], ['classe-monotone']),
     (r'Borel-Cantelli|limsup|\\limsupens', 'lemme de Borel-Cantelli', ['m-mesures'], []),
     (r'\\sigma-finie', 'mesures σ-finies', ['m-mesures'], ['mesure-sigma-finie']),
     (r'mesure image|T_\{\*\}', 'mesure image', ['m-mesures'], []),
     (r'comptage|\\delta_', 'mesures discrètes', ['m-mesures'], ['mesure'])]
FOND = ['m-tribus']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
