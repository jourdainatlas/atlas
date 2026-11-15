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
    lab = f'aria-haspopup="dialog" aria-label="Regarder la vidéo du chapitre {c["chapitre"]}, {html.escape(c["titre"])} (4 min 07)" title="Regarder la vidéo du chapitre"'
    tri = '<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0v12l10-6z"/></svg>'
    bouton = (f'<button class="voir-video v-a" type="button" data-video {lab}>{tri}Vidéo</button>'
              f'<button class="voir-video v-b" type="button" data-video {lab}><img src="vignette.jpg" alt=""><span class="rond">{tri}</span><span class="duree">4:07</span></button>'
              f'<button class="voir-video v-c" type="button" data-video {lab}>{tri}</button>') if video else ''
    sous = f'<span class="ch-sous"><button class="voir-video v-d" type="button" data-video {lab}>{tri}<span>Le chapitre en vidéo</span><small>4 min 07</small></button></span>' if video else ''
    return f'''<li><a class="chapitre" href="#"><span class="num"><span>{c["chapitre"]}</span></span><span><span class="ch-titre">{html.escape(c["titre"])}</span><span class="ch-resume">{tex(c["resume"])}</span></span><span class="ch-theories">{th}</span></a><span class="ch-etat"><span class="statut depose">En ligne</span>{bouton}</span>{sous}</li>'''
t = open('gabarit-proto.html', encoding='utf-8').read()
t = t.replace('/*LIGNES*/', ligne('ma-07', True) + ligne('ma-08', False)).replace('/*SCORE*/', sc.strip())
open('index.html', 'w', encoding='utf-8').write(t)
print(len(t))
