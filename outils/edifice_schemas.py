"""Schémas de l'édifice : une fonction par schéma, qui calcule la figure et écrit contenu/schemas/<nom>.svg.

    python3 outils/edifice_schemas.py            # tous les schémas
    python3 outils/edifice_schemas.py c-tvi …    # seulement ceux-là

Chaque schéma est appelé dans une fiche par un bloc
    ```schema <nom>
    Phrase qui dit ce qu'il faut lire sur la figure.
    ```
Les modules outils/edifice_schemas_*.py ajoutent leurs schémas au même registre ; charger() les découvre
tous, sans liste à tenir.

Schémas des exemples du lexique (5 nov. 2026, mémo de l'édifice § 111) : un module par théorie de premier
niveau, outils/edifice_schemas_lex_<theorie>.py (ainsi edifice_schemas_lex_top.py,
edifice_schemas_lex_analyse-reelle.py), découvert comme les autres ; plusieurs rédacteurs peuvent donc en
écrire en parallèle sans toucher ce registre. Un tel module ne déclare que des noms lex-<id>-<k>[-b…], et
aucun autre module n'en déclare.

    python3 outils/edifice_schemas.py --theorie top   # seulement les schémas d'exemples de cette théorie
"""
import glob
import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

REGISTRE = {}
MODULE = {}          # nom du schéma → module qui le déclare
PREFIXE_LEX = 'edifice_schemas_lex_'


def schema(nom):
    def deco(fn):
        if nom in REGISTRE:
            raise SystemExit(f'schéma en double : {nom}')
        mod = fn.__module__
        if mod.startswith(PREFIXE_LEX) != nom.startswith('lex-'):
            raise SystemExit(f'schéma {nom} déclaré dans {mod} : les noms lex-… vont dans les modules '
                             f'{PREFIXE_LEX}<theorie>.py, et eux seuls')
        REGISTRE[nom] = fn
        MODULE[nom] = mod
        return fn
    return deco


def charger():
    ici = os.path.dirname(os.path.abspath(__file__))
    for chemin in sorted(glob.glob(os.path.join(ici, 'edifice_schemas_*.py'))):
        importlib.import_module(os.path.splitext(os.path.basename(chemin))[0])


if __name__ == '__main__':
    sys.modules['edifice_schemas'] = sys.modules['__main__']
    charger()
    args = sys.argv[1:]
    if args[:1] == ['--theorie']:
        if len(args) != 2:
            raise SystemExit('usage : edifice_schemas.py --theorie <theorie>')
        noms = sorted(n for n, m in MODULE.items() if m == PREFIXE_LEX + args[1])
        if not noms:
            raise SystemExit(f'aucun schéma dans outils/{PREFIXE_LEX}{args[1]}.py')
    else:
        noms = args or sorted(REGISTRE)
    for nom in noms:
        if nom not in REGISTRE:
            raise SystemExit(f'schéma inconnu : {nom}')
        REGISTRE[nom]().ecrire(nom)
    print(f'{len(noms)} schéma(s) écrit(s) dans contenu/schemas/')
