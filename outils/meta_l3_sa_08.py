"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 8 (Corps finis, cyclotomie)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'calculs dans les corps finis', ['gs-corps-finis'], ['corps-fini']),
           (6, 12, 'structure des corps finis', ['gs-corps-finis', 'gf-multiplicatif'], ['corps-fini', 'frobenius']),
           (13, 19, 'polynômes cyclotomiques', ['gc-cyclotomiques', 'gc-irreductibilite'], ['polynome-cyclotomique', 'racine-nieme-unite']),
           (20, 21, 'compléments sur les corps', ['gs-extensions', 'gs-corps-finis'], ['corps'])]
R = [(r'Frobenius|\\mathrm\{Fr\}', 'morphisme de Frobenius', ['gs-corps-finis'], ['frobenius']),
     (r'modulo|\\F_\{p\}\[X\]', 'réduction modulo p', ['gc-reduction'], []),
     (r'cyclique|générateur', 'groupe multiplicatif cyclique', ['gf-multiplicatif'], ['groupe-multiplicatif']),
     (r'\\Aut', 'automorphismes', ['gs-extensions'], [])]
FOND = ['gs-corps-finis']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
