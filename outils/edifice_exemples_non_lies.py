"""Notions non liées dans les exemples du lexique : un terme du lexique écrit en clair (hors formules et hors liens),
défini à un nœud qui n'est pas en amont de celui du terme illustré.

    python3 outils/edifice_exemples_non_lies.py [--theorie <id>|tout]

Complète construire.py, qui ne voit que les liens [[id]] et \\lex{id}{…} : un mot écrit sans lien échappe à son
contrôle d'ordre. Les phrases d'ouverture (« Plus loin… », RE_ANNONCE) sont écartées ; un libellé porté par
plusieurs entrées (homonymes) n'est signalé que si aucune d'elles n'est en amont. Libellés cherchés : le terme
sans sa précision entre parenthèses, et son pluriel naïf (s ajouté aux mots de plus de trois lettres) ; les
termes de moins de quatre lettres sont ignorés. C'est un crible : chaque ligne est à juger (homonymie avec le
sens courant, notion définie dans le texte même de l'exemple). Code de sortie 0 dans tous les cas.
"""
import re
import sys
import os
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edifice_exemples_commun import charge, theories_demandees, RE_ANNONCE


def clair(x):
    x = re.sub(r'```schema [\w-]+\n', ' § ', x)
    x = re.sub(r'\$\$.+?\$\$|\$[^$]+\$', ' § ', x, flags=re.S)
    return re.sub(r'\[\[[^\]]+\]\]|\{\{[^}]+\}\}', ' § ', x)


def libelles(e):
    t = re.sub(r'\s*\([^)]*\)\s*$', '', e['terme']).strip().lower()
    if len(t) < 4 or '$' in t:
        return []
    pl = ' '.join(w + ('' if w.endswith(('s', 'x')) else 's') if len(w) > 3 else w for w in t.split())
    return sorted({t, pl})


def main():
    A = charge()
    ths = set(theories_demandees(A))
    LIB = [(e['id'], l) for e in A.lexique for l in libelles(e)]
    HOMO = defaultdict(set)
    for tid, l in LIB:
        HOMO[l].add(tid)
    motifs = [(tid, lib, re.compile(r'(?<![\w-])' + re.escape(lib) + r'(?![\w-])', re.I)) for tid, lib in LIB]
    n = 0
    for e in A.lexique:
        if e['theorie'] not in ths:
            continue
        d = e['defini_dans']
        for k, x in enumerate(e['exemples']):
            for ph in re.split(r'(?<=[.;:])\s+', clair(x)):
                if RE_ANNONCE.search(ph):
                    continue
                for tid, lib, motif in motifs:
                    if any(A.lex[h]['defini_dans'] in A.avant[d] for h in HOMO[lib]):
                        continue
                    if motif.search(ph):
                        n += 1
                        print(f"{e['id']} ex. {k + 1} : « {lib} » ({tid}, défini en {A.lex[tid]['defini_dans']}, "
                              f"hors amont de {d}) | {ph.strip()[:140]}")
    print(f'{n} occurrence(s)')


if __name__ == '__main__':
    main()
