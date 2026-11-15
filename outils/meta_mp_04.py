"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 4 (espaces vectoriels normés)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 12, 'normes', ['f-evn', 'gd-normes'], ['norme']),
    (13, 22, 'suites', ['f-evn'], ['suite-extraite']),
    (23, 34, 'comparaison des normes', ['gd-equivalence'], ['normes-equivalentes']),
    (35, 48, 'topologie', ['tr-ouverts', 'tr-adherence'], ['ouvert', 'ferme']),
    (49, 51, 'topologie relative', ['me-topologie'], ['topologie-induite']),
    (52, 62, 'synthèse', [], []),
]
R = [
    (r'boule|sphère|borné', 'boules', ['gd-normes'], ['boule-ouverte']),
    (r'convexe', 'convexité', ['gd-normes'], ['partie-convexe']),
    (r'produit scalaire|cauchy-schwarz', 'produit scalaire', ['me-produit-scalaire'], []),
    (r'\\infty|uniforme', 'norme uniforme', ['gd-normes'], []),
    (r'extraite|valeur d\'adhérence|valeurs d\'adhérence', 'suites extraites', ['ar-bw'], ['suite-extraite']),
    (r'équivalentes', 'normes équivalentes', ['gd-equivalence'], ['normes-equivalentes']),
    (r'ouvert', 'ouverts', ['tr-ouverts'], ['ouvert']),
    (r'fermé', 'fermés', ['tr-ouverts'], ['ferme']),
    (r'adhérence|intérieur|frontière', 'adhérence et intérieur', ['tr-adherence'], ['adherence']),
    (r'dense|densité', 'densité', ['tr-dense'], ['partie-dense']),
    (r'matrice|\\mn|gl_', 'espaces de matrices', ['gd-normes'], []),
    (r'polynôme|\\kx|\\r\[x\]', 'normes sur les polynômes', ['gd-normes'], []),
    (r'relatif|relative', 'topologie relative', ['me-topologie'], ['topologie-induite']),
]
FOND = ['f-evn']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
