# Termes définis dans les PDF de cours, pour la recherche globale du site (domaine À propos – apparence).
#
# Convention des cours : le terme que l'on définit est écrit en rouge. Ce script relève, dans chaque PDF de
# documents/cours/, les passages en texte rouge (hors formules), avec leur page, élimine le bruit le plus courant
# (intitulés de théorèmes, consignes, caractères mal codés) et écrit le résultat dans outils/cours-termes.json,
# rangé par fichier PDF avec son empreinte SHA-256 : seul un PDF nouveau ou modifié est relu (la lecture complète
# des 62 PDF prend environ une minute). rendu.mjs en tire site/cours-termes.json, chargé par la recherche globale.
#
# Lancé par construire.sh. Sans pdfplumber, le script ne fait rien et le fichier en place sert tel quel.
# Exclusions à la main : outils/cours-termes-exclus.txt, un terme par ligne, appliquées par rendu.mjs (le cache
# garde tout, pour qu'un terme retiré de la liste revienne sans relire le PDF).
# Usage : python3 outils/cours_termes.py            (depuis la racine du dépôt)
import glob, hashlib, json, os, re, sys, unicodedata

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(RACINE, 'outils', 'cours-termes.json')

ROUGE = lambda c: isinstance(c, (list, tuple)) and len(c) == 3 and c[0] > 0.6 and c[1] < 0.2 and c[2] < 0.2
MATH = ('CMMI', 'CMSY', 'CMEX', 'MSAM', 'MSBM', 'LMMath', 'rsfs', 'eufm', 'CMR')
FIX = {'(cid:27)': 'ff', '(cid:28)': 'fi', '(cid:29)': 'fl', '(cid:30)': 'ffi', '(cid:31)': 'ffl', 'Ø': 'é', 'Ł': 'è',
       '(cid:244)': 'ô', '(cid:238)': 'î', '(cid:226)': 'â', '(cid:251)': 'û', '(cid:231)': 'ç', 'ª': 'ê'}
TETE = re.compile(r'^(Théorème|Proposition|Propriété|Corollaire|Lemme|Définition|Méthode|Exemple|Remarque|Attention|Notation|Point méthode|Exercice)\b')
BRUIT = re.compile(r"^(on|l’|l'|le sens|et|est|au|en|après|avant|toujours|à|ce|cette|il|elle|ils|du signe|qui|que)\b"
                   r"|^(ajoutant|retranchant|multipliant|divisant|additionnant|soustrayant|change|avec|décide|multiplier)$"
                   r"|\(cid:|^les deux ", re.I)
STOP = set('et ou non si on la le les un une de des du à au aux par pour dans sur est sont ne pas car donc alors'.split())
INTITULE = re.compile(r'(Définition|D.finition|Théorème|Th.or.me|Proposition|Propriété|Exemple|Remarque|Méthode|Corollaire|Lemme)')


def nettoie(t):
    for a, b in FIX.items():
        t = t.replace(a, b)
    t = unicodedata.normalize('NFC', t)
    t = re.sub(r'(\w)- (\w)', r'\1\2', t)                 # césure de fin de ligne
    t = re.sub(r'\s+', ' ', t).strip(' :;,.()=’\'')
    return re.sub(r"\s+(de|du|d’|d')$", '', t)


def extraire(fichier):
    import pdfplumber
    termes = []
    with pdfplumber.open(fichier) as pdf:
        for i, pg in enumerate(pdf.pages):
            intit = [(w['top'], w['text']) for w in pg.extract_words() if INTITULE.match(w['text'])]
            cur, last, y = '', None, None

            def pousse():
                t = nettoie(cur)
                if (t and not TETE.match(t) and not BRUIT.search(t) and len(t) >= 3 and t.lower() not in STOP
                        and re.search(r'[a-zà-ÿ]{3}', t) and len(t.split()) <= 7):
                    avant = [x for x in intit if x[0] <= y + 2]
                    termes.append({'t': t, 'p': i + 1, 'def': bool(avant) and re.match(r'D.finition', avant[-1][1]) is not None})

            for ch in pg.chars:
                if ROUGE(ch.get('non_stroking_color')) and not ch['fontname'].split('+')[-1].startswith(MATH):
                    if last is not None and (abs(ch['top'] - last['top']) > 3 or ch['x0'] - last['x1'] > 1.2):
                        cur += ' '
                    if not cur:
                        y = ch['top']
                    cur += ch['text']
                    last = ch
                elif ch['text'].strip():
                    if cur.strip():
                        pousse()
                    cur, last = '', None
            if cur.strip():
                pousse()
    vus, uniq = set(), []
    for x in termes:
        if x['t'].lower() not in vus:
            vus.add(x['t'].lower())
            uniq.append(x)
    return uniq


def main():
    try:
        import pdfplumber  # noqa: F401
    except ImportError:
        print('cours_termes : pdfplumber absent, outils/cours-termes.json gardé tel quel')
        return
    cache = json.load(open(CACHE, encoding='utf-8')) if os.path.exists(CACHE) else {}
    neuf, relus = {}, 0
    for f in sorted(glob.glob(os.path.join(RACINE, 'documents', 'cours', '*', '*.pdf'))):
        cle = os.path.relpath(f, RACINE).replace(os.sep, '/')
        sha = hashlib.sha256(open(f, 'rb').read()).hexdigest()
        if cle in cache and cache[cle].get('sha') == sha:
            neuf[cle] = cache[cle]
        else:
            neuf[cle] = {'sha': sha, 'termes': extraire(f)}
            relus += 1
    if neuf != cache:
        with open(CACHE, 'w', encoding='utf-8') as s:
            json.dump(neuf, s, ensure_ascii=False, indent=0, sort_keys=True)
    n = sum(len(v['termes']) for v in neuf.values())
    print(f'cours_termes : {len(neuf)} PDF, {n} termes ({relus} PDF relus)')


if __name__ == '__main__':
    main()
