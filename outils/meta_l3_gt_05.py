"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie et topologie, chapitre 5 (Groupe fondamental)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 7, 'homotopie', ['ta-homotopie', 'vk-retractes'], ['applications-homotopes']), (8, 10, 'rétractions', ['vk-retractes', 'ta-fonctorialite'], ['retraction-espace', 'retracte-deformation']), (11, 13, 'groupe fondamental', ['ta-groupe-fondamental', 'ta-chemins'], ['groupe-fondamental', 'lacet', 'homotopie-chemins'])]
R = [('simplement connexe', 'simple connexité', ['ta-simplement-connexe', 'vk-spheres'], ['simplement-connexe'])]
FOND = ['ta-groupe-fondamental']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
