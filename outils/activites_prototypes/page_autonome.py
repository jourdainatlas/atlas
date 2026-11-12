import re,sys
A='/home/claude/atlas/activites/'
def lib(f, ren=None):
    s=open(A+f,encoding='utf-8').read()
    s=re.sub(r'^import [^\n]*\n','',s,flags=re.M); s=re.sub(r'^export \{[^\n]*\n','',s,flags=re.M); s=re.sub(r'^export ','',s,flags=re.M)
    if ren: s=s.replace('const css = `','const cssCommun = `',1)
    return s
def mod(f):
    s=open(A+f,encoding='utf-8').read(); s=re.sub(r'^import [^\n]*\n','',s,flags=re.M); s=re.sub(r'^export ','',s,flags=re.M)
    return '(function(){\n'+s+'\nreturn { css, html, monter };\n})()'
for ident in sys.argv[1:]:
    page=open('/home/claude/atlas/site/index.html',encoding='utf-8').read()
    a='import(`./activites/${id}.js${v}`)'; assert page.count(a)==1
    page=page.replace(a,'(window.__proto && window.__proto[id] ? Promise.resolve(window.__proto[id]) : import(`./activites/${id}.js${v}`))')
    js='<script>if (!location.hash) location.hash = "#activites/'+ident+'";\n(function(){\n'+lib('commun.js',True)+'\n'+lib('figures.js')+'\n'+lib('jeux.js')+'\nwindow.__proto = { "'+ident+'": '+mod(ident+'.js')+' };\n})();\n</script>'
    assert '</script>' not in js[:-10].replace('<script>','')
    page=page.replace('href="katex.css?v=','href="https://www.atlasjourdain.fr/katex.css?v=').replace('src="katex.min.js?v=','src="https://www.atlasjourdain.fr/katex.min.js?v=')   # formules : fichiers pris sur le site en ligne
    i=page.index('<script'); page=page[:i]+js+page[i:]
    out='/home/claude/proto/prototype-'+ident+'.html'; open(out,'w',encoding='utf-8').write(page); print(out,len(page)//1024,'Ko')
