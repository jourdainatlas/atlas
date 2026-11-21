#!/usr/bin/env python3
"""Bilan de liaison des programmes officiels (rubrique Annales, MEMO_atlas_annales.md §45).

Usage : python3 outils/annales_programmes_bilan.py [--mettre-a-jour-reference]

Affiche, pour chaque programme de rubriques/annales-programmes/, le nombre de points « à venir » (ni cours ni
exercice) et sans exercice, puis les chapitres et feuilles d'exercices nouveaux ou modifiés depuis la dernière
liaison (comparaison avec rubriques/annales-programmes/reference-cours.json). C'est la liste de travail de la
conversation Annales quand des cours arrivent : relier les points concernés (agent + relecture indépendante),
puis relancer avec --mettre-a-jour-reference pour enregistrer l'état des cours ainsi relié.
"""
import glob, json, os, sys
import yaml

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
REF = 'rubriques/annales-programmes/reference-cours.json'
cours = {c['id']: c for c in yaml.safe_load(open('rubriques/cours.yaml', encoding='utf-8'))['cours']}
feuilles = {}
for f in glob.glob('rubriques/exercices/*.yaml'):
    for e in yaml.safe_load(open(f, encoding='utf-8')) or []: feuilles[e['feuille']] = feuilles.get(e['feuille'], 0) + 1

for f in sorted(glob.glob('rubriques/annales-programmes/*.yaml')):
    d = yaml.safe_load(open(f, encoding='utf-8'))
    pts = [(i, s['intitule'], p) for i, s in enumerate(d['sections']) for b in s['blocs'] for p in b['points']]
    av = [x for x in pts if not x[2].get('cours') and not x[2].get('ex')]
    se = [x for x in pts if not x[2].get('ex')]
    print(f"{d['id']:12} {len(pts):4} points · {len(av):3} « à venir » · {len(se):3} sans exercice")
    for i, t, p in av[:200]: print(f"    à venir  §{i + 1} {t[:40]} — {str(p['contenu'])[:90]}")

ref = json.load(open(REF, encoding='utf-8')) if os.path.isfile(REF) else {'cours': {}, 'feuilles': {}}
neufs = sorted(c for c in cours if c not in ref['cours'])
changes = sorted(c for c in cours if c in ref['cours'] and [str(x) for x in (cours[c].get('sommaire') or [])] != ref['cours'][c])
fe = sorted(k for k, n in feuilles.items() if n != ref['feuilles'].get(k))
print('\nChapitres nouveaux :', ', '.join(neufs) or 'aucun')
print('Sommaires modifiés :', ', '.join(changes) or 'aucun')
print('Feuilles nouvelles ou enrichies :', ', '.join(fe) or 'aucune')

if '--mettre-a-jour-reference' in sys.argv:
    json.dump({'cours': {c: [str(s) for s in (cours[c].get('sommaire') or [])] for c in cours}, 'feuilles': feuilles},
              open(REF, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    print('Référence mise à jour :', REF)
