// Atelier Python d'ATLAS — exécution dans un worker (le code de l'élève tourne dans son navigateur,
// jamais sur le serveur). Pyodide est hébergé avec le site, dans python/pyodide/.
import { loadPyodide } from './pyodide/pyodide.mjs';

let py = null;
let tampon = '', dernier = 0, widCourant = null;

function vider() {
  if (tampon) { postMessage({ type: 'sortie', wid: widCourant, texte: tampon }); tampon = ''; }
  dernier = Date.now();
}
// Appelée par Python à chaque écriture : on regroupe pour ne pas inonder la page.
self.atelierEcrire = (texte) => {
  tampon += texte;
  // Un programme qui affiche sans fin ne doit pas inonder la page : on n'envoie qu'un paquet toutes les 50 ms,
  // et seulement la fin du texte en attente.
  if (tampon.length > 50000) tampon = '[…]\n' + tampon.slice(-30000);
  if (Date.now() - dernier > 50) vider();
};

const AMORCE = String.raw`
import sys, builtins, traceback, codeop, random, types, reprlib, linecache, json, js

class BesoinSaisie(BaseException):
    def __init__(self, invite): self.invite = invite

class TropDEtapes(BaseException):
    pass

class Sortie:
    def __init__(self):
        self.n = 0; self.saut = 0; self.flux = True; self.texte = []
    def write(self, s):
        s = str(s)
        if not s: return 0
        debut = self.n; self.n += len(s)
        if self.n <= self.saut: return len(s)
        if debut < self.saut: s = s[self.saut - debut:]
        if self.flux: js.atelierEcrire(s)
        else: self.texte.append(s)
        return len(s)
    def flush(self): pass
    def isatty(self): return False

_sortie = Sortie()
sys.stdout = _sortie
sys.stderr = _sortie
_saisie = {'reponses': [], 'i': 0}

def _input(invite=''):
    invite = str(invite)
    _sortie.write(invite)
    if _saisie['i'] < len(_saisie['reponses']):
        r = _saisie['reponses'][_saisie['i']]; _saisie['i'] += 1
        _sortie.write(r + '\n')
        return r
    raise BesoinSaisie(invite)
builtins.input = _input

_espaces = {}
def _neuf():
    return {'__name__': '__main__', '__builtins__': builtins}

_r = reprlib.Repr()
_r.maxstring = 46; _r.maxother = 46; _r.maxlist = 12; _r.maxtuple = 8; _r.maxdict = 6; _r.maxset = 8; _r.maxlevel = 3

def _montrer(v):
    if isinstance(v, types.FunctionType): return 'fonction'
    if isinstance(v, type): return 'classe'
    if isinstance(v, types.BuiltinFunctionType): return 'fonction'
    try: return _r.repr(v)
    except Exception: return '?'

def _visibles(d):
    out = []
    for k, v in d.items():
        if k.startswith('__') or isinstance(v, types.ModuleType): continue
        out.append([k, _montrer(v), type(v).__name__])
    return out

_AIDE = {
  'NameError': "Ce nom n'existe pas encore : faute de frappe, ou variable utilisée avant d'avoir reçu une valeur ?",
  'TypeError': "Opération impossible entre ces types de valeurs.",
  'ZeroDivisionError': "Division par zéro : le diviseur vaut 0 au moment du calcul.",
  'ValueError': "La valeur ne convient pas : par exemple int(\"abc\") ou int(\"3.5\").",
  'IndexError': "Indice hors de la liste : les indices d'une liste L vont de 0 à len(L) − 1.",
  'KeyError': "Cette clé n'existe pas dans le dictionnaire.",
  'AttributeError': "Cet objet n'a pas d'attribut (ni de méthode) de ce nom.",
  'RecursionError': "Trop d'appels imbriqués : la fonction s'appelle elle-même sans jamais s'arrêter ?",
  'UnboundLocalError': "Variable utilisée dans la fonction avant d'y avoir reçu une valeur.",
  'IndentationError': "Problème de décalage (indentation) des lignes.",
  'TabError': "Mélange de tabulations et d'espaces dans le décalage des lignes.",
  'SyntaxError': "Python ne comprend pas cette ligne.",
}

def _aide(e):
    t = type(e).__name__; m = str(e)
    if isinstance(e, SyntaxError):
        m = e.msg or ''
        if 'expected an indented block' in m: return "Le bloc qui suit « : » doit être décalé vers la droite (de quatre espaces)."
        if 'unexpected indent' in m: return "Cette ligne est décalée vers la droite alors que rien ne l'exige."
        if 'unindent does not match' in m: return "Ce décalage ne correspond à aucun des niveaux précédents."
        if "expected ':'" in m: return "Il manque les deux-points « : » à la fin de cette ligne."
        if 'unterminated string' in m: return "Un guillemet ouvert n'est jamais refermé sur cette ligne."
        if 'never closed' in m: return "Une parenthèse (ou un crochet) ouverte n'est jamais refermée."
        if 'invalid decimal literal' in m: return "Un nom de variable ne peut pas commencer par un chiffre."
        if "Maybe you meant '==' or ':='" in m or "cannot assign" in m: return "Pour comparer, on écrit « == » ; « = » sert à affecter une valeur."
        return _AIDE.get(t, _AIDE['SyntaxError'])
    if t == 'TypeError' and ("'str'" in m) and ("'int'" in m or "'float'" in m):
        return "On mélange une chaîne (str) et un nombre. Rappel : input() renvoie toujours une chaîne ; on la convertit avec int() ou float()."
    if t == 'TypeError' and 'not callable' in m:
        return "On appelle comme une fonction quelque chose qui n'en est pas une (un nom comme print a-t-il été réutilisé pour une variable ?)."
    if t == 'NameError' and getattr(e, 'name', None):
        return f"Le nom « {e.name} » n'est pas défini : faute de frappe, ou variable utilisée avant d'avoir reçu une valeur ?"
    return _AIDE.get(t, '')

def _rapport(e, nom):
    lignes = ['Traceback (most recent call last):']
    ligne = None
    if isinstance(e, SyntaxError):
        ligne = e.lineno
        corps = traceback.format_exception_only(type(e), e)
        lignes = []
    else:
        for f in traceback.extract_tb(e.__traceback__):
            if f.filename != nom: continue
            lignes.append(f'  File "{f.filename}", line {f.lineno}, in {f.name}')
            if f.line: lignes.append('    ' + f.line.strip())
            ligne = f.lineno
        if len(lignes) == 1: lignes = []
        corps = traceback.format_exception_only(type(e), e)
    texte = '\n'.join(lignes + [c.rstrip('\n') for c in corps])
    return {'trace': texte, 'aide': _aide(e), 'ligne': ligne}

def _preparer(reponses, graine, saut, flux=True):
    _saisie['reponses'] = list(reponses); _saisie['i'] = 0
    _sortie.n = 0; _sortie.saut = saut; _sortie.flux = flux; _sortie.texte = []
    random.seed(graine)

def executer(wid, code, nom, reponses, graine, saut):
    reponses = json.loads(reponses)
    _preparer(reponses, graine, saut)
    ns = _neuf(); _espaces[wid] = ns
    linecache.cache[nom] = (len(code), None, code.splitlines(True), nom)
    res = {'etat': 'fini'}
    try:
        exec(compile(code, nom, 'exec'), ns)
    except BesoinSaisie as s:
        res = {'etat': 'saisie', 'invite': s.invite, 'n': _sortie.n}
    except KeyboardInterrupt:
        res = {'etat': 'interrompu'}
    except BaseException as e:
        res = {'etat': 'erreur'}; res.update(_rapport(e, nom))
    res['variables'] = _visibles(ns)
    return json.dumps(res)

def deboguer(wid, code, nom, reponses, graine, limite):
    reponses = json.loads(reponses)
    _preparer(reponses, graine, 0, flux=False)
    ns = _neuf(); _espaces[wid] = ns
    linecache.cache[nom] = (len(code), None, code.splitlines(True), nom)
    etapes = []
    def instant(frame, ligne):
        loc = None
        if frame.f_code.co_name != '<module>':
            loc = {'f': frame.f_code.co_name, 'v': _visibles(frame.f_locals)}
        etapes.append({'l': ligne, 'g': _visibles(ns), 'loc': loc, 'n': _sortie.n})
    def trace(frame, ev, arg):
        if frame.f_code.co_filename != nom: return None
        if ev == 'line':
            if len(etapes) >= limite: raise TropDEtapes()
            instant(frame, frame.f_lineno)
        return trace
    res = {'etat': 'fini'}
    try:
        code_objet = compile(code, nom, 'exec')
        sys.settrace(trace)
        try: exec(code_objet, ns)
        finally: sys.settrace(None)
    except BesoinSaisie as s:
        return json.dumps({'etat': 'saisie', 'invite': s.invite, 'n': 0})
    except TropDEtapes:
        res = {'etat': 'limite'}
    except KeyboardInterrupt:
        res = {'etat': 'interrompu'}
    except BaseException as e:
        res = {'etat': 'erreur'}; res.update(_rapport(e, nom))
    etapes.append({'l': None, 'g': _visibles(ns), 'loc': None, 'n': _sortie.n})
    res['etapes'] = etapes
    res['sortie'] = ''.join(_sortie.texte)
    res['variables'] = _visibles(ns)
    return json.dumps(res)

def console(wid, src, reponses, saut):
    reponses = json.loads(reponses)
    _preparer(reponses, random.random(), saut)
    ns = _espaces.setdefault(wid, _neuf())
    try:
        c = codeop.compile_command(src, '<console>', 'single')
    except (SyntaxError, OverflowError, ValueError) as e:
        r = {'etat': 'erreur'}; r.update(_rapport(e, '<console>')); r['variables'] = _visibles(ns)
        return json.dumps(r)
    if c is None: return json.dumps({'etat': 'suite'})
    res = {'etat': 'fini'}
    try:
        exec(c, ns)
    except BesoinSaisie as s:
        res = {'etat': 'saisie', 'invite': s.invite, 'n': _sortie.n}
    except BaseException as e:
        res = {'etat': 'erreur'}; res.update(_rapport(e, '<console>'))
    res['variables'] = _visibles(ns)
    return json.dumps(res)
`;

// Le serveur peut servir pyodide.asm.wasm sous un autre type que application/wasm (Apache d'OVH lit « .asm » :
// text/x-asm) ; WebAssembly le refuse alors. On rétablit le type de la réponse, sans toucher au contenu.
const fetchOrigine = self.fetch.bind(self);
self.fetch = async (...a) => {
  const r = await fetchOrigine(...a);
  const u = String(a[0]?.url ?? a[0]);
  if (!/\.wasm(\?|$)/.test(u) || (r.headers.get('content-type') || '').startsWith('application/wasm')) return r;
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers: { 'Content-Type': 'application/wasm' } });
};

async function demarrer() {
  py = await loadPyodide({ indexURL: new URL('./pyodide/', import.meta.url).href });
  py.runPython(AMORCE);
  const v = py.runPython('import sys; sys.version.split()[0]');
  postMessage({ type: 'pret', version: v });
}

onmessage = (ev) => {
  const m = ev.data;
  widCourant = m.wid; tampon = ''; dernier = Date.now();
  let r;
  try {
    const f = py.globals.get(m.action);
    if (m.action === 'executer') r = f(m.wid, m.code, m.nom, JSON.stringify(m.reponses), m.graine, m.saut);
    else if (m.action === 'deboguer') r = f(m.wid, m.code, m.nom, JSON.stringify(m.reponses), m.graine, m.limite);
    else if (m.action === 'console') r = f(m.wid, m.code, JSON.stringify(m.reponses), m.saut);
    f.destroy();
    r = JSON.parse(r);
  } catch (e) {
    r = { etat: 'erreur', trace: String(e), aide: "Erreur interne de l'atelier." };
  }
  vider();
  postMessage({ type: 'fin', wid: m.wid, id: m.id, resultat: r });
};

demarrer().catch((e) => postMessage({ type: 'echec', message: String(e) }));
