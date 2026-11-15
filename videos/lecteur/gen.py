import json, re, html
d = json.load(open('../../construction/donnees.json'))
cours = {c['id']: c for c in d['rubriques']['cours']['cours']}
N = d['noeuds']
sc = __import__('importlib').import_module('subprocess').run(['node','-e',"const S=require('../../videos/reels-suites/score.js');console.log(JSON.stringify({d:S.DURATION,c:S.intertitres.map(i=>({t:i.t,nom:i.nom}))}))"],capture_output=True,text=True).stdout
def tex(s):
    s = re.sub(r'</?p>', ' ', s)
    for a,b in [(r'$\mathbb{R}$','ℝ'),(r'$\mathbb{Q}$','ℚ'),(r'$\mathbb{D}$','𝔻'),(r'$u_{n+1} = f(u_n)$','<i>u</i><sub><i>n</i>+1</sub> = <i>f</i>(<i>u</i><sub><i>n</i></sub>)'),(r'$u_{n+1} = f(u_{n})$','<i>u</i><sub><i>n</i>+1</sub> = <i>f</i>(<i>u</i><sub><i>n</i></sub>)'),(r'$n$','<i>n</i>')]:
        s = s.replace(a,b)
    assert '$' not in s, s
    return s.strip()
def ligne(cid, video):
    c = cours[cid]
    th = ''.join(f'<span class="mini-theorie">{html.escape(N[i]["titre"]).replace("$\\\\mathbb{R}$","ℝ").replace("$\\\\mathbb{Q}$","ℚ")}</span>' for i in c['theories'] if i in N)
    th = th.replace(r'$\mathbb{R}$','ℝ').replace(r'$\mathbb{Q}$','ℚ')
    bouton = f'<button class="voir-video" type="button" data-video aria-haspopup="dialog" aria-label="Regarder la vidéo du chapitre {c["chapitre"]}, {html.escape(c["titre"])}" title="Regarder la vidéo du chapitre"><svg viewBox="0 0 44 30" aria-hidden="true"><rect width="44" height="30" rx="8.5"/><path d="M17.5 8.6v12.8L29 15z"/></svg></button>' if video else ''
    return f'''<li><a class="chapitre" href="#"><span class="num"><span>{c["chapitre"]}</span></span><span><span class="ch-titre">{html.escape(c["titre"])}</span><span class="ch-resume">{tex(c["resume"])}</span></span><span class="ch-theories">{th}</span></a><span class="ch-etat"><span class="statut depose">En ligne</span>{bouton}</span></li>'''
t = open('gabarit-proto.html', encoding='utf-8').read()
t = t.replace('/*LIGNES*/', ligne('ma-07', True) + ligne('ma-08', False)).replace('/*SCORE*/', sc.strip())
open('index.html', 'w', encoding='utf-8').write(t)
print(len(t))
