#!/usr/bin/env python3
"""Réétiquette les feuilles déjà versées d'après l'édifice actuel (outils/etiquetage.py).

Usage : python3 outils/reetiqueter.py [FEUILLE ...]   (sans argument : toutes les feuilles)
Seules les lignes `noeuds:` et `notions:` des exercices changent ; le reste du fichier est conservé.
Un exercice sans nœud reçoit ceux que son énoncé désigne, sinon les deux premiers nœuds précis du cours
de sa feuille. Le bilan des changements s'affiche ; le relire avant de valider."""
import glob, os, re, sys, collections
import yaml
sys.path.insert(0, os.path.dirname(__file__))
import etiquetage

GRAPHES = {os.path.basename(f)[:-5] for f in glob.glob('contenu/*.yaml')}
FEUILLES = {f['id']: f for f in yaml.safe_load(open('rubriques/exercices.yaml', encoding='utf-8'))['feuilles']}
COURS = {c['id']: c for c in yaml.safe_load(open('rubriques/cours.yaml', encoding='utf-8'))['cours']}


def defaut(fe):
    c = COURS.get(fe.get('cours') or '', {})
    return [n for n in c.get('theories') or [] if n not in GRAPHES][:2]


def traiter(chemin, bilan):
    exos = yaml.safe_load(open(chemin, encoding='utf-8'))
    lignes = open(chemin, encoding='utf-8').read().split('\n')
    debuts = [i for i, l in enumerate(lignes) if l.startswith('- id: ')]
    n = 0
    for k, e in enumerate(exos):
        fe = FEUILLES[e['feuille']]
        av = (list(e.get('noeuds') or []), list(e.get('notions') or []))
        etiquetage.affiner(e, fe, fe.get('niveau', ''))
        etiquetage.completer(e, defaut(fe))
        if (e['noeuds'], e['notions']) == av: continue
        n += 1
        for x in av[0]: bilan[x] -= 1
        for x in e['noeuds']: bilan[x] += 1
        d, f = debuts[k], (debuts[k + 1] if k + 1 < len(debuts) else len(lignes))
        for i in range(d, f):
            if lignes[i].startswith('  noeuds:'): lignes[i] = f'  noeuds: [{", ".join(e["noeuds"])}]'
            elif lignes[i].startswith('  notions:'): lignes[i] = f'  notions: [{", ".join(e["notions"])}]'
    if n:
        open(chemin, 'w', encoding='utf-8').write('\n'.join(lignes))
    return n, len(exos)


if __name__ == '__main__':
    ids = sys.argv[1:]
    bilan = collections.Counter(); tot = mod = 0
    for chemin in sorted(glob.glob('rubriques/exercices/*.yaml')):
        if ids and os.path.basename(chemin)[:-5] not in ids: continue
        m, t = traiter(chemin, bilan); mod += m; tot += t
        if m: print(f'{os.path.basename(chemin):24s} {m:3d} / {t} exercices modifiés')
    print(f'{mod} exercices modifiés sur {tot}')
    for k, v in sorted(bilan.items(), key=lambda x: x[1]):
        if v: print(f'   {k:24s} {v:+d}')
