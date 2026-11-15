"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 5 (continuité, compacité, connexité par arcs)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 9, 'limites et continuité', ['c-uniforme'], ['continuite']),
    (10, 17, 'applications linéaires continues', ['gd-normes'], ['norme-subordonnee']),
    (18, 25, 'compacts', ['tr-compacts', 'ar-bw'], ['compact']),
    (26, 33, 'continuité sur un compact', ['c-heine', 'tr-compacts'], ['compact']),
    (34, 44, 'dimension finie', ['gd-equivalence', 'f-compacts'], ['normes-equivalentes']),
    (45, 52, 'connexité par arcs', ['tr-connexes'], ['connexe-par-arcs']),
    (53, 62, 'synthèse', [], []),
]
R = [
    (r'lipschitz', 'applications lipschitziennes', ['c-uniforme'], []),
    (r'uniformément continue|continuité uniforme', 'continuité uniforme', ['c-uniforme', 'c-heine'], ['continuite-uniforme']),
    (r'subordonnée|\\nop|\\\|\\\|\\\|', 'norme subordonnée', ['gd-normes'], ['norme-subordonnee']),
    (r'multilinéaire|bilinéaire', 'applications multilinéaires', ['gd-normes'], []),
    (r'compact', 'compacité', ['tr-compacts'], ['compact']),
    (r'bolzano|extraite|valeur d\'adhérence', 'Bolzano-Weierstrass', ['ar-bw'], []),
    (r'heine', 'théorème de Heine', ['c-heine'], ['continuite-uniforme']),
    (r'atteint|bornes|minimum|maximum', 'bornes atteintes', ['tr-compacts'], []),
    (r'dimension finie|équivalentes', 'normes en dimension finie', ['gd-equivalence'], ['normes-equivalentes']),
    (r'connexe|chemin|étoilée', 'connexité par arcs', ['tr-connexes'], ['connexe-par-arcs']),
    (r'valeurs intermédiaires', 'valeurs intermédiaires', ['c-tvi'], []),
    (r'ouvert|fermé', 'ouverts et fermés', ['tr-ouverts'], ['ouvert']),
    (r'dense|densité', 'densité', ['tr-dense'], ['partie-dense']),
    (r'matrice|\\mn|gl_|\\gl', 'topologie des matrices', ['gd-normes'], []),
    (r'point fixe', 'point fixe', ['c-uniforme'], []),
]
FOND = ['c-uniforme']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
