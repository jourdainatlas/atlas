"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 1 (structures algébriques usuelles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'groupes', ['a-sous-groupe', 'gf-cycliques'], ['sous-groupe-engendre', 'ordre-element']),
    (11, 26, 'anneaux', ['a-anneau', 'a-ideal'], ['ideal']),
    (27, 31, 'idéaux de Z', ['z-ideaux', 'z-bezout'], ['ideal-principal']),
    (32, 48, 'anneaux Z/nZ', ['z-zn'], ['anneau-zn']),
    (49, 59, 'anneau K[X]', ['pol-principal', 'pol-irreductibles'], ['polynome-irreductible']),
    (60, 66, 'algèbres', ['alg'], []),
    (67, 79, 'synthèse', [], []),
]
R = [
    (r'engendr', 'sous-groupe engendré', ['a-sous-groupe'], ['sous-groupe-engendre']),
    (r'monogène|cyclique', 'groupes cycliques', ['gf-cycliques'], ['groupe-cyclique']),
    (r'ordre d|d\'ordre|\\omega\(', 'ordre d\'un élément', ['gf-cycliques'], ['ordre-element']),
    (r'lagrange|classe à gauche', 'théorème de Lagrange', ['gs-lagrange'], []),
    (r'idéal|idéaux', 'idéaux', ['a-ideal'], ['ideal']),
    (r'intègre|nilpotent|inversible', 'anneaux', ['a-anneau'], []),
    (r'produit d\'anneaux|a_\{1\} \\times|\\times a_\{2\}', 'produit d\'anneaux', ['a-anneau'], ['anneau-produit']),
    (r'\\zn|z/n|congru|\\equiv|modulo', 'congruences et Z/nZ', ['z-zn'], ['anneau-zn']),
    (r'chinois|système de congruences', 'théorème chinois', ['ac-chinois'], []),
    (r'euler|\\varphi\(|fermat', 'indicatrice d\'Euler', ['z-zn'], []),
    (r'pgcd|\\wedge|bézout|bezout', 'PGCD et Bézout', ['z-bezout'], ['pgcd-anneau']),
    (r'nombres? premiers?|\$p\$ (?:un nombre )?premier|premier \$p', 'nombres premiers', ['z-premiers'], []),
    (r'irréductible', 'polynômes irréductibles', ['pol-irreductibles'], ['polynome-irreductible']),
    (r'\\kx|polynôme', 'anneau des polynômes', ['pol-principal'], []),
    (r'algèbre|sous-algèbre', 'algèbres', ['alg'], []),
    (r'corps', 'corps', ['a-corps'], []),
]
FOND = ['a-anneau']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
