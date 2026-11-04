"""Préparer un lot d'exemples du lexique pour une théorie : termes, nœuds, définitions, contexte d'amont, emplois.

    python3 outils/edifice_exemples_lot.py --theorie alg                    # table des termes, plus employés d'abord
    python3 outils/edifice_exemples_lot.py --theorie alg --sans-exemples --premiers 30
    python3 outils/edifice_exemples_lot.py --terme anneau [--fiche] [--preuve] [--lex] [--noeuds]
    python3 outils/edifice_exemples_lot.py --theorie alg --premiers 30 --sans-exemples --sortie DOSSIER

Table : rang, id, terme, nœud defini_dans (et son graphe), nombre d'emplois (nœuds dont le texte, l'énoncé, la
preuve, le choix ou une remarque emploient le terme, comme « Employé dans » au lexique), nombre d'exemples déjà
écrits. L'ordre (emplois décroissants, puis ordre du lexique) est celui des lots : termes les plus employés d'abord.
Les conventions et notations pures, qui ne reçoivent pas d'exemple (§ 110), ne sont pas reconnues ici : à écarter
à la lecture.

--terme (répétable) ou --sortie : contexte complet de chaque terme. Définition, exemples existants ; avec
--fiche, texte, énoncé et remarques du nœud defini_dans (--preuve : la preuve aussi) ; avec --lex, les termes du
lexique définis en amont (les seuls qu'un exemple peut employer, liés ou non) ; avec --noeuds, les nœuds d'amont
groupés par graphe (les seuls vers lesquels un {{x|…}} ne demande pas d'annonce). --sortie écrit un fichier
<id>.txt par terme, avec tout (fiche, preuve, lex, noeuds), dans DOSSIER.
"""
import os
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from edifice_exemples_commun import charge, theories_demandees


def valeur(argv, opt, defaut=None):
    return argv[argv.index(opt) + 1] if opt in argv and argv.index(opt) + 1 < len(argv) else defaut


def contexte(A, t, fiche=False, preuve=False, lex=False, noeuds=False):
    e = A.lex[t]
    d = e['defini_dans']
    n = A.noeuds[d]
    out = [f"== {t} « {e['terme']} » défini dans {d} [{n['graphe']}, théorie {e['theorie']}] {n['titre']}",
           f"   {len(A.emplois[t])} emploi(s) ; exemples dans contenu/exemples/{e['theorie']}.yaml",
           e['definition'].rstrip()]
    if e.get('notation'):
        out.append(f"--- notation : {e['notation']}")
    for k, x in enumerate(e['exemples']):
        out.append(f'--- exemple {k + 1} (existant) :\n{x.rstrip()}')
    if fiche:
        for c in ['texte', 'enonce'] + (['preuve'] if preuve else []):
            if n.get(c):
                out.append(f'--- {c} de {d} :\n{n[c].rstrip()}')
        for r in n['remarques']:
            out.append(f'--- remarque de {d} : {r.rstrip()}')
    if lex:
        am = sorted(x for x, y in A.lex.items() if y['defini_dans'] in A.avant[d])
        out.append(f'--- {len(am)} termes du lexique en amont : ' + ', '.join(am))
    if noeuds:
        g = defaultdict(list)
        for v in A.avant[d]:
            g[A.noeuds[v]['graphe']].append(v)
        out.append(f'--- {len(A.avant[d])} nœuds en amont, par graphe :')
        out += [f'[{k}] ({len(v)}) ' + ' '.join(sorted(v)) for k, v in sorted(g.items())]
    return '\n'.join(out) + '\n'


def main():
    argv = sys.argv[1:]
    A = charge()
    demandes = [argv[k + 1] for k, a in enumerate(argv) if a == '--terme' and k + 1 < len(argv)]
    for t in demandes:
        if t not in A.lex:
            raise SystemExit(f'terme inconnu « {t} »')
    if demandes:
        for t in demandes:
            print(contexte(A, t, '--fiche' in argv, '--preuve' in argv, '--lex' in argv, '--noeuds' in argv))
        return
    ths = theories_demandees(A)
    rang = {e['id']: k for k, e in enumerate(A.lexique)}
    choisis = [e for e in A.lexique if e['theorie'] in ths and (not e['exemples'] or '--sans-exemples' not in argv)]
    choisis.sort(key=lambda e: (-len(A.emplois[e['id']]), rang[e['id']]))
    premiers = valeur(argv, '--premiers')
    if premiers:
        choisis = choisis[:int(premiers)]
    sortie = valeur(argv, '--sortie')
    if sortie:
        os.makedirs(sortie, exist_ok=True)
        for e in choisis:
            open(os.path.join(sortie, e['id'] + '.txt'), 'w', encoding='utf-8').write(
                contexte(A, e['id'], True, True, True, True))
        print(f'{len(choisis)} fichier(s) écrit(s) dans {sortie}')
        return
    print(f"{'rang':>4}  {'id':32} {'défini dans':26} {'emplois':>7} {'ex.':>3}  terme")
    for k, e in enumerate(choisis, 1):
        d = e['defini_dans']
        print(f"{k:>4}  {e['id']:32} {d + ' [' + A.noeuds[d]['graphe'] + ']':26} {len(A.emplois[e['id']]):>7} "
              f"{len(e['exemples']):>3}  {e['terme']}")
    print(f"{len(choisis)} terme(s) ; théorie(s) : {', '.join(ths) if len(ths) < 6 else 'toutes'}")


if __name__ == '__main__':
    main()
