#!/usr/bin/env python3
"""Applique tex2exos.typographie aux feuilles déjà versées (énoncés, corrigés, titres, sources).

Usage : python3 outils/typographier.py [FEUILLE ...]
Les blocs `enonce:` et `corrige:` sont traités en entier (une formule peut courir sur plusieurs lignes), puis
remis ligne pour ligne : la transformation ne change pas le nombre de lignes. Le reste du fichier est conservé."""
import glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
sys.argv, args = [sys.argv[0]], sys.argv[1:]
import tex2exos

def traiter(chemin):
    L = open(chemin, encoding='utf-8').read().split('\n')
    i, n = 0, 0
    while i < len(L):
        m = re.match(r'^(  |- )(enonce|corrige): \|$', L[i])
        if m:
            j = i + 1
            while j < len(L) and (L[j].startswith('    ') or L[j] == ''):
                if L[j] == '' and j + 1 < len(L) and not (L[j + 1].startswith('    ') or L[j + 1] == ''): break
                j += 1
            bloc = '\n'.join(L[i + 1:j]); nouveau = tex2exos.typographie(bloc)
            assert nouveau.count('\n') == bloc.count('\n')
            if nouveau != bloc: L[i + 1:j] = nouveau.split('\n'); n += 1
            i = j; continue
        m = re.match(r'^(  |- )(titre|source): (".*")$', L[i])
        if m:
            v = json.loads(m.group(3)); w = tex2exos.typographie(v)
            if w != v: L[i] = f'{m.group(1)}{m.group(2)}: {json.dumps(w, ensure_ascii=False)}'; n += 1
        i += 1
    open(chemin, 'w', encoding='utf-8').write('\n'.join(L))
    return n

tot = 0
for f in sorted(glob.glob('rubriques/exercices/*.yaml')):
    if args and os.path.basename(f)[:-5] not in args: continue
    tot += traiter(f)
print(tot, 'champs retouchés')
