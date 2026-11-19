"""Parties du cours concernées par chaque exercice (« Dans le cours » des cartes d'exercice).

Pour chaque feuille rattachée à un cours qui a un PDF et un sommaire paginé (`sommaire`, `sommaire_pages`), le texte
de chaque partie du cours (pages de son début à la veille de la partie suivante, lues par pdftotext) est comparé au
texte de chaque exercice (titre de la partie de la feuille et mots-clés, énoncé, corrigé ; formules retirées) par
similarité cosinus de vecteurs TF-IDF (mots ramenés à leurs six premières lettres, sans accents). On retient la
partie la plus proche, et une seconde si elle la suit de près. « Introduction historique » et « Bilan » ne sont
jamais proposées : l'une raconte, l'autre récapitule tout le chapitre.

Résultat versionné : outils/exercices-cours.json, {id d'exercice: [indices dans le sommaire du cours]}, lu par
construire.py. À relancer après le dépôt ou le remplacement d'un cours ou d'une feuille :
    python3 outils/exercices_cours.py            (tout)
    python3 outils/exercices_cours.py f-mp-14    (une ou plusieurs feuilles ; les autres sont gardées)
Une correspondance fausse se corrige dans outils/exercices-cours-corrections.yaml ({id: [indices]}), qui l'emporte.
"""
import glob, json, math, os, re, subprocess, sys, unicodedata
from collections import Counter
import yaml

SORTIE = 'outils/exercices-cours.json'
EXCLUES = re.compile(r'^\s*(introduction historique|bilan)\b', re.I)
VIDES = set('''avec dans pour par sur sous entre vers chez sans selon comme donc ainsi alors aussi mais encore toute toutes tous
tout cette ces cet celle celui ceux elles elle ils leur leurs nous vous etre sont soit soient etait avoir ayant
peut peuvent doit montrer montre montrons deduire deduit verifier verifie calculer calcule determiner determine
justifier exercice question questions suivant suivante suivantes suivants partie chapitre cours definition
definie defini theoreme proposition lemme corollaire exemple exemples remarque remarques demonstration preuve
alors ensuite enfin meme memes autre autres plus moins tres bien fait faire quel quelle quels quelles dont
lorsque lorsqu puisque quand chaque deux trois premier premiere second seconde ici celui point'''.split())


def norm(t):
    t = unicodedata.normalize('NFD', t.lower())
    return ''.join(c for c in t if unicodedata.category(c) != 'Mn')


def mots(t):
    return [m[:6] for m in re.findall(r'[a-z]{3,}', norm(t)) if m not in VIDES]


def sans_formules(t):
    t = re.sub(r'```.*?```', ' ', t or '', flags=re.S)
    t = re.sub(r'\$\$.*?\$\$', ' ', t, flags=re.S)
    t = re.sub(r'\$[^$]*\$', ' ', t)
    return re.sub(r'\\[A-Za-z]+', ' ', t)


def pages_pdf(pdf):
    sortie = subprocess.run(['pdftotext', '-layout', pdf, '-'], capture_output=True, text=True, errors='replace').stdout
    return sortie.split('\f')


def main(cibles):
    C = yaml.safe_load(open('rubriques/cours.yaml', encoding='utf-8'))
    E = yaml.safe_load(open('rubriques/exercices.yaml', encoding='utf-8'))
    cours = {c['id']: c for c in C['cours']}
    exos = []
    for f in sorted(glob.glob('rubriques/exercices/*.yaml')):
        exos += yaml.safe_load(open(f, encoding='utf-8')) or []

    # Parties de tous les cours paginés : le vocabulaire de l'IDF est celui de l'ensemble des cours.
    parties = {}   # id du cours → [(indice, Counter)]
    df, N = Counter(), 0
    for c in cours.values():
        if not (c.get('pdf') and c.get('sommaire') and c.get('sommaire_pages') and os.path.isfile(c['pdf'])):
            continue
        pgs = pages_pdf(c['pdf']); sp = c['sommaire_pages']; L = []
        for i, titre in enumerate(c['sommaire']):
            deb = sp[i]; fin = max(deb, (sp[i + 1] if i + 1 < len(sp) else len(pgs)))
            texte = ' '.join(pgs[deb - 1:fin]) if fin > deb else pgs[deb - 1]
            # le titre de la partie compte triple : c'est lui que le lecteur verra
            tf = Counter(mots(texte) + 3 * mots(titre))
            df.update(set(tf)); N += 1
            if not EXCLUES.match(titre): L.append((i, tf))
        parties[c['id']] = L
    idf = {m: math.log(1 + N / k) for m, k in df.items()}

    def vecteur(tf):
        v = {m: (1 + math.log(k)) * idf.get(m, math.log(1 + N)) for m, k in tf.items()}
        n = math.sqrt(sum(x * x for x in v.values())) or 1
        return {m: x / n for m, x in v.items()}

    titres = {c['id']: c.get('sommaire') or [] for c in cours.values()}
    vparties = {cid: [(i, vecteur(tf)) for i, tf in L] for cid, L in parties.items()}
    feuille_cours = {f['id']: f.get('cours') for f in E['feuilles']}

    res = json.load(open(SORTIE, encoding='utf-8')) if cibles and os.path.isfile(SORTIE) else {}
    for e in exos:
        if cibles and e['feuille'] not in cibles: continue
        res.pop(e['id'], None)
        cid = feuille_cours.get(e['feuille'])
        if cid not in vparties or not vparties[cid]: continue
        texte = Counter(mots(sans_formules(e.get('enonce'))) + mots(sans_formules(e.get('corrige'))))
        for m in mots(e.get('partie') or '') + mots(' '.join(e.get('mots_cles') or [])):
            texte[m] += 3
        if not texte: continue
        v = vecteur(texte)
        scores = sorted(((sum(x * vp.get(m, 0) for m, x in v.items()), i) for i, vp in vparties[cid]), reverse=True)
        if not scores or scores[0][0] < 0.05: continue
        garde = [scores[0][1]]
        if len(scores) > 1 and scores[1][0] >= 0.85 * scores[0][0]: garde.append(scores[1][1])
        # La feuille suit souvent le plan du cours : une partie de feuille dont le titre reprend celui d'une partie
        # du cours (au moins les deux tiers de ses mots) y renvoie d'abord ; la similarité ne donne plus que le complément.
        mp = set(mots(e.get('partie') or ''))
        if mp:
            prox = max(((len(mp & set(mots(titres[cid][i]))) / len(mp), -len(set(mots(titres[cid][i])) - mp), i) for i, _ in vparties[cid]), default=(0, 0, None))
            prox = (prox[0], prox[2])   # à égalité, le titre qui ajoute le moins de mots
            if prox[0] >= 2 / 3:
                garde = [prox[1]] + [i for i in garde[:1] if i != prox[1] and dict((j, sc) for sc, j in scores)[i] >= 0.85 * dict((j, sc) for sc, j in scores)[prox[1]]]
        res[e['id']] = sorted(garde)

    corr = 'outils/exercices-cours-corrections.yaml'
    if os.path.isfile(corr):
        for k, v in (yaml.safe_load(open(corr, encoding='utf-8')) or {}).items(): res[k] = v
    json.dump(dict(sorted(res.items())), open(SORTIE, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'exercices_cours : {len(res)} exercices reliés à leur cours')


if __name__ == '__main__':
    main(set(sys.argv[1:]))
