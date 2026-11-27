"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie et topologie, chapitre 4 (Variétés topologiques)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'variétés et atlas', ['t-separe', 't-quotient'], ['carte', 'atlas', 'cartes-compatibles']), (7, 15, 'actions de groupes', ['gt-quotient', 'rv-tore', 'rv-projectif'], ['action-groupe', 'espace-projectif-reel']), (16, 17, 'revêtements', ['ta-revetement'], ['revetement', 'ouvert-uniformement-couvert'])]
R = [('projectif', 'espace projectif', ['rv-projectif'], ['espace-projectif-reel'])]
FOND = ['t-quotient']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
