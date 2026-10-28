"""Schémas de l'édifice : une fonction par schéma, qui calcule la figure et écrit contenu/schemas/<nom>.svg.

    python3 outils/edifice_schemas.py            # tous les schémas
    python3 outils/edifice_schemas.py c-tvi …    # seulement ceux-là

Chaque schéma est appelé dans une fiche par un bloc
    ```schema <nom>
    Phrase qui dit ce qu'il faut lire sur la figure.
    ```
Les modules outils/edifice_schemas_*.py ajoutent leurs schémas au même registre.
"""
import glob
import importlib
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

REGISTRE = {}


def schema(nom):
    def deco(fn):
        if nom in REGISTRE:
            raise SystemExit(f'schéma en double : {nom}')
        REGISTRE[nom] = fn
        return fn
    return deco


def charger():
    ici = os.path.dirname(os.path.abspath(__file__))
    for chemin in sorted(glob.glob(os.path.join(ici, 'edifice_schemas_*.py'))):
        importlib.import_module(os.path.splitext(os.path.basename(chemin))[0])


if __name__ == '__main__':
    sys.modules['edifice_schemas'] = sys.modules['__main__']
    charger()
    noms = sys.argv[1:] or sorted(REGISTRE)
    for nom in noms:
        if nom not in REGISTRE:
            raise SystemExit(f'schéma inconnu : {nom}')
        REGISTRE[nom]().ecrire(nom)
    print(f'{len(noms)} schéma(s) écrit(s) dans contenu/schemas/')
