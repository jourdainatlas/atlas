#!/usr/bin/env python3
"""Contrôle des fiches de sujets des annales (rubriques/annales-index/*.yaml), sans construire le site.

Usage : python3 outils/annales_fiches_valider.py [fichier.yaml …]   (tous les fichiers par défaut)

Erreurs : YAML illisible ; thème inconnu ; thème du mauvais vocabulaire (lycée hors bac, général au bac) ;
1 à 4 thèmes principaux, au plus 5 secondaires, 2 à 8 mots-clés ; pages hors du sujet ou à l'envers ;
« [[ » dans un texte ; nombre impair de « $ ».
Avertissements : thème fin et son parent au même rang (règle de l'auteur du 26 nov. 2026, MEMO §44 et §45) ;
blocs dont les pages reculent.
"""
import glob, os, sys
import yaml

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
T = yaml.safe_load(open('rubriques/annales-themes.yaml', encoding='utf-8'))
th = {t['id']: t for t in T['themes']}
lyc_dom = {d['id'] for d in T.get('domaines', []) if d.get('vocabulaire') == 'lycee'}
def lycee(t): return th[t].get('domaine') in lyc_dom or t.startswith('ly-')
err, avert = [], []
for f in sys.argv[1:] or sorted(glob.glob('rubriques/annales-index/*.yaml')):
    bac = os.path.basename(f).startswith('bac')
    try: L = yaml.safe_load(open(f, encoding='utf-8')) or []
    except Exception as e: err.append(f"{f} : YAML illisible ({e})"); continue
    for s in L:
        ou = f"{os.path.basename(f)} « {str(s.get('nom', ''))[:50]} »"
        npg = s.get('pages') or 0
        textes = [s.get('nom', ''), s.get('apercu', '')]
        prec = 0
        for b in s.get('blocs') or []:
            o = f"{ou}, bloc « {str(b.get('nom', ''))[:40]} »"
            P, S, M = b.get('themes') or [], b.get('secondaires') or [], b.get('mots') or []
            for t in P + S:
                if t not in th: err.append(f"{o} : thème inconnu {t}")
                elif lycee(t) != bac: err.append(f"{o} : thème {t} du mauvais vocabulaire")
            if not 1 <= len(P) <= 4: err.append(f"{o} : {len(P)} thèmes principaux")
            if len(S) > 5: err.append(f"{o} : {len(S)} thèmes secondaires")
            if not 2 <= len(M) <= 8: err.append(f"{o} : {len(M)} mots-clés")
            if set(P) & set(S): err.append(f"{o} : thème à la fois principal et secondaire")
            for rang, X in (('principal', P), ('secondaire', S)):
                for t in X:
                    p = th.get(t, {}).get('parent')
                    while p:
                        if p in X: avert.append(f"{o} : {t} et son ancêtre {p} tous deux en {rang}")
                        p = th.get(p, {}).get('parent')
            pg = b.get('pages') or []
            if len(pg) != 2 or not (1 <= pg[0] <= pg[1] <= (npg or pg[1])): err.append(f"{o} : pages {pg} (sujet de {npg} p.)")
            elif pg[0] < prec: avert.append(f"{o} : les pages reculent ({pg})")
            else: prec = pg[0]
            textes += [b.get('nom', '')] + [str(m) for m in M]
        for x in textes:
            x = str(x or '')
            if '[[' in x: err.append(f"{ou} : « [[ » dans un texte")
            if x.replace('\\$', '').count('$') % 2: err.append(f"{ou} : nombre impair de $ dans « {x[:60]} »")
print('\n'.join(err) or 'Aucune erreur.')
print(f"{len(avert)} avertissement(s)" + (' :\n' + '\n'.join(avert) if '-v' in sys.argv or len(avert) < 30 else ' (détail avec -v)'))
sys.exit(1 if err else 0)
