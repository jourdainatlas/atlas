"""Phrases trop longues dans les exemples du lexique (concision, mémo de l'édifice § 110-111).

    python3 outils/edifice_exemples_longueurs.py [--theorie <id>|tout] [--max 65]

Compte les mots de chaque phrase : formules centrées et blocs de schéma retirés, formule en ligne comptée pour un
mot, liens réduits à leur texte. Signale les phrases de plus de --max mots (65 par défaut). Code de sortie 0.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edifice_exemples_commun import charge, theories_demandees


def mots_par_phrase(x):
    c = re.sub(r'```schema [\w-]+\n[\s\S]*?\n\s*```', ' ', x)
    c = re.sub(r'\$\$.+?\$\$', ' ', c, flags=re.S)
    c = re.sub(r'\$[^$]+\$', 'F', c)
    c = re.sub(r'\[\[[^\]|]+\|([^\]]+)\]\]|\[\[([^\]]+)\]\]', r'\1\2', c)
    c = re.sub(r'\{\{[^}|]+\|([^}]*)\}\}', r'\1', c)
    return [(len(ph.split()), ph) for ph in re.split(r'(?<=[.!?])\s+', c) if ph.strip()]


def main():
    argv = sys.argv[1:]
    lim = int(argv[argv.index('--max') + 1]) if '--max' in argv else 65
    A = charge()
    ths = set(theories_demandees(A))
    n = 0
    for e in A.lexique:
        if e['theorie'] not in ths:
            continue
        for k, x in enumerate(e['exemples']):
            for m, ph in mots_par_phrase(x):
                if m > lim:
                    n += 1
                    print(f"{e['id']} ex. {k + 1} : {m} mots | {ph.strip()[:90]}…")
    print(f'{n} phrase(s) de plus de {lim} mots')


if __name__ == '__main__':
    main()
