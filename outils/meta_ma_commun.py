"""Métadonnées des feuilles Maths Sup – MPSI : règles par motif (énoncé) et règles par partie de la feuille.

Chaque meta_ma_0N.py définit R (motif → mot-clé, nœuds, notions), PARTIES (premier et dernier numéro de
la partie → mot-clé, nœuds, notions) et EXTRA ; les exercices de synthèse n'ont que les règles par motif et
reçoivent FOND si aucune règle ne leur donne de nœud. Propositions à relire."""
from meta_commun import types_exercice, appliquer


def fabriquer(R, PARTIES, FOND, EXTRA):
    def meta(numero, titre, enonce, corrige, etoiles):
        m, n, l = [], [], []
        for a, b, mot, noeuds, notions in PARTIES:
            if a <= numero <= b:
                m, n, l = [mot] if mot else [], list(noeuds), list(notions)
        m2, n2, l2 = appliquer(R, (titre or '') + '\n' + enonce, maxi=12)
        em, en, el = EXTRA.get(numero, ([], [], []))
        for src, dst in ((m2 + em, m), (n2 + en, n), (l2 + el, l)):
            for x in src:
                if x not in dst: dst.append(x)
        if not n: n = list(FOND)
        return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m[:8], 'noeuds': n, 'notions': l}
    return meta
