"""Outils communs aux crochets de métadonnées meta_<prefixe>.py.

Chaque crochet définit des RÈGLES (motif → mot-clé, nœuds, notions) appliquées au texte
de l'énoncé et du corrigé ; le résultat est une proposition, à relire avant publication."""
import re


def sans_formules(t):
    t = re.sub(r'```python.*?```', ' ', t, flags=re.S)  # le code est ignoré, les tableaux non
    return t


def types_exercice(titre, enonce, corrige, etoiles):
    """Types déduits du titre, de l'énoncé et du nombre d'étoiles."""
    e = enonce.lower(); T = []
    titre = (titre or '').lower()
    if 'type bac' in titre: T.append('Type Bac')
    if re.search(r'une seule (des réponses|réponse) (proposées )?est exacte|qcm|réponse a\b', e): T.append('QCM')
    if re.search(r'vrai ou faux|vraie ou fausse|vraies ou fausses', e): T.append('Vrai ou faux')
    if 'python' in titre or '```python' in enonce or re.search(r'python|(un|cet|l\'|l’)\s*algorithme (suivant|ci-dessous)|cet algorithme|écrire un algorithme|script|programme (suivant|python|ci-dessous)|écrire un programme', e): T.append('Algorithmique')
    if re.search(r'graphiquement|lecture graphique|par lecture|courbe représentative ci-dessous|ci-dessous la courbe|on a représenté|ci-contre', e): T.append('Lecture graphique')
    if re.search(r'conjectur', e): T.append('Conjecture')
    if etoiles >= 3 and len(enonce) > 1200: T.append('Problème')
    # Démonstration ou Calcul : on garde la dominante (les deux si elles s'équilibrent).
    nd = len(re.findall(r'montrer|démontrer|prouver|justifier|établir', e))
    nc = len(re.findall(r'calculer|déterminer|donner la valeur|exprimer|résoudre|étudier|en déduire la valeur', e))
    if nd and nd >= nc / 2: T.append('Démonstration')
    if nc and nc >= nd / 2: T.append('Calcul')
    if re.search(r'on modélise|modéliser|modélisation', e): T.append('Modélisation')
    vus = []
    for t in T:
        if t not in vus: vus.append(t)
    return vus or ['Calcul']


def appliquer(regles, texte, maxi=8):
    """regles : liste de (motif, mot-clé, [nœuds], [notions]). Renvoie mots-clés, nœuds, notions."""
    t = sans_formules(texte).lower()
    M, N, L = [], [], []
    for motif, mot, noeuds, notions in regles:
        if re.search(motif, t, flags=re.S):
            if mot and mot not in M: M.append(mot)
            for n in noeuds:
                if n not in N: N.append(n)
            for n in notions:
                if n not in L: L.append(n)
    return M[:maxi], N, L
