#!/usr/bin/env python3
"""Règle « thème fin et parent jamais au même rang » (décision de l'auteur du 26 nov. 2026, MEMO_atlas_annales.md §44).

Usage : python3 outils/annales_fin_parent.py [--appliquer] [fichiers…]   (tous les fichiers d'index par défaut)

Dans chaque bloc d'une fiche : si un thème principal a un ancêtre (parent, grand-parent…) lui aussi principal,
l'ancêtre passe en secondaire (s'il n'y est pas déjà et qu'il reste de la place, cinq secondaires au plus), sinon
il est retiré ; si un thème secondaire a un ancêtre lui aussi secondaire, l'ancêtre est retiré. Sans --appliquer,
le script affiche ce qu'il ferait. Les fichiers sont modifiés ligne par ligne (mise en forme conservée).
"""
import glob, os, re, sys
import yaml

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
th = {t['id']: t for t in yaml.safe_load(open('rubriques/annales-themes.yaml', encoding='utf-8'))['themes']}
def ancetres(t):
    a, p = [], th.get(t, {}).get('parent')
    while p and p not in a: a.append(p); p = th.get(p, {}).get('parent')
    return a

def corriger(P, S):
    P, S = list(P), list(S); journal = []
    for t in list(P):
        for a in ancetres(t):
            if a in P:
                P.remove(a)
                if a not in S and len(S) < 5: S.append(a); journal.append(f"{a} : principal → secondaire (avec {t})")
                else: journal.append(f"{a} : retiré des principaux (avec {t})")
    for t in list(S):
        for a in ancetres(t):
            if a in S: S.remove(a); journal.append(f"{a} : retiré des secondaires (avec {t})")
    return P, S, journal

appl = '--appliquer' in sys.argv
fichiers = [f for f in sys.argv[1:] if not f.startswith('--')] or sorted(glob.glob('rubriques/annales-index/*.yaml'))
total = 0
for f in fichiers:
    L = open(f, encoding='utf-8').read().split('\n'); out = []; i = 0; sujet = ''
    while i < len(L):
        l = L[i]
        if l.startswith('- sujet:'): sujet = l[9:]
        if re.match(r'^  - nom:', l):
            # un bloc : de cette ligne à la prochaine « - nom: » ou « - sujet: »
            j = i + 1
            while j < len(L) and not re.match(r'^  - nom:|^- |^\S', L[j]): j += 1
            B = L[i:j]
            def liste(cle):
                k = next((k for k, x in enumerate(B) if x == f'    {cle}:'), None)
                if k is None: return None, None, []
                e = k + 1
                while e < len(B) and re.match(r'^    - ', B[e]): e += 1
                return k, e, [x[6:].strip() for x in B[k + 1:e]]
            kp, ep, P = liste('themes'); ks, es, S = liste('secondaires')
            P2, S2, jr = corriger(P, S)
            if jr:
                total += len(jr); print(f"{os.path.basename(f)} | {sujet[:60]} | {B[0][8:60]} : " + ' ; '.join(jr))
                nb = list(B)
                # on réécrit d'abord les secondaires (plus bas), puis les principaux
                lignesS = ([f'    secondaires:'] + [f'    - {x}' for x in S2]) if S2 else []
                if ks is not None: nb[ks:es] = lignesS
                elif lignesS: nb[ep:ep] = lignesS
                nb[kp + 1:ep] = [f'    - {x}' for x in P2]
                B = nb
            out += B; i = j; continue
        out.append(l); i += 1
    if appl: open(f, 'w', encoding='utf-8').write('\n'.join(out))
print(total, 'changements', '(appliqués)' if appl else '(simulation)')
