"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 7 (Équations différentielles : approximation numérique)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, "méthode d'Euler", ['ed-cauchy-lipschitz', 'ed-gronwall'], ['schema-recurrence']), (4, 5, 'stabilité, schémas implicites, équations raides', ['ed-lineaires'], ['schema-recurrence']), (6, 9, "schémas d'ordre supérieur, méthodes de Runge-Kutta", ['de-taylor'], ['schema-recurrence']), (10, 10, 'méthodes itératives', ['gd-point-fixe'], ['contractante']), (11, 15, 'étude qualitative, portraits de phase', ['edo-liapounov'], ['equilibre', 'equilibre-stable']), (16, 17, "retour sur l'équation y' = t + y²", ['ed-maximales'], ['solution-maximale'])]
R = [('Liapounov|Lyapunov', 'fonctions de Liapounov', ['edo-liapounov'], ['fonction-liapounov']), ('linéaris', 'système linéarisé', ['edo-liapounov'], ['systeme-linearise']), ('Taylor', 'formule de Taylor', ['de-taylor'], [])]
FOND = ['ed-cauchy-lipschitz']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
