#!/usr/bin/env python3
"""
Generate and verify Chapters 7–10 (Levels 61–100) for KOMA: Spirit Delivery.
Autumn Landscape (Momiji) + Patrolling Shrine Ghosts (Yūrei).
"""
import json
import random
import sys
from collections import deque
from math import gcd
from multiprocessing import Pool

DELTA = {"N": (0, -1), "E": (1, 0), "S": (0, 1), "W": [-1, 0]}
TL = {"N": "W", "W": "S", "S": "E", "E": "N"}
TR = {"N": "E", "E": "S", "S": "W", "W": "N"}
CMDS = ("F", "L", "R", "A")

def lcm(a, b):
    return a * b // gcd(a, b)

class Level:
    def __init__(self, d):
        self.d = d
        self.w, self.h = d["w"], d["h"]
        self.walls = set(map(tuple, d.get("walls", [])))
        self.gates = {(g[0], g[1]): g[2] for g in d.get("gates", [])}
        self.sws = {(s[0], s[1]): s[2] for s in d.get("sw", [])}
        self.portals = [tuple(p) for p in d.get("portals", [])]
        self.orbs = [tuple(o) for o in d.get("orbs", [])]
        self.orb_idx = {o: i for i, o in enumerate(self.orbs)}
        self.winds = {(w[0], w[1]): w[2] for w in d.get("winds", [])}
        self.fragile = set(map(tuple, d.get("fragile", [])))
        self.water0 = frozenset(map(tuple, d.get("water", [])))
        self.blocks0 = tuple(sorted(map(tuple, d.get("blocks", []))))
        self.goal = tuple(d["g"])
        self.ghosts = [[tuple(p) for p in (g["path"] if isinstance(g, dict) else g)] for g in d.get("ghosts", [])]
        self.period = 1
        for g in self.ghosts:
            self.period = lcm(self.period, len(g))
        self.sole_gate = list(self.gates.values())[0] if len(self.gates) == 1 else None
        self.no_block = set(self.fragile) | set(self.sws) | set(self.portals) | set(self.winds) | {self.goal} | set(self.orbs) | set(self.gates)
        self.full_orbs = (1 << len(self.orbs)) - 1

    def ghost_pos(self, t):
        return [g[t % len(g)] for g in self.ghosts]

    def start(self):
        x, y, d = self.d["s"]
        return (x, y, d, 0, frozenset(), 0, frozenset(), self.blocks0, self.water0)

def step(L, st, cmd):
    x, y, d, t, opened, orbs, collapsed, blocks, water = st
    px, py = x, y
    if cmd == "L":
        d = TL[d]
    elif cmd == "R":
        d = TR[d]
    elif cmd == "A":
        c = L.sws.get((x, y))
        if c is not None:
            new = set(opened)
            new.add(c)
            if L.sole_gate is not None:
                new.add(L.sole_gate)
            opened = frozenset(new)
    else:  # F
        dx, dy = DELTA[d]
        nx, ny = x + dx, y + dy
        if not (0 <= nx < L.w and 0 <= ny < L.h):
            return None
        if (nx, ny) in L.walls:
            return None
        gc = L.gates.get((nx, ny))
        if gc is not None and gc not in opened:
            return None
        if (nx, ny) in collapsed:
            return None
        if (nx, ny) in water and (nx, ny) not in L.fragile:
            return None
        if (nx, ny) in blocks:
            tx, ty = nx + dx, ny + dy
            if not (0 <= tx < L.w and 0 <= ty < L.h):
                return None
            if (tx, ty) in L.walls or (tx, ty) in blocks:
                return None
            if (tx, ty) in L.no_block or (tx, ty) in collapsed:
                return None
            bl = list(blocks)
            bl.remove((nx, ny))
            if (tx, ty) in water:
                water = water - {(tx, ty)}
            else:
                bl.append((tx, ty))
            blocks = tuple(sorted(bl))
        if (x, y) in L.fragile:
            collapsed = collapsed | {(x, y)}
        x, y = nx, ny
        oi = L.orb_idx.get((x, y))
        if oi is not None:
            orbs |= 1 << oi
        if len(L.portals) == 2 and (x, y) in L.portals:
            x, y = L.portals[1] if (x, y) == L.portals[0] else L.portals[0]
        for _ in range(10):
            wd = L.winds.get((x, y))
            if wd is None:
                break
            wx, wy = x + DELTA[wd][0], y + DELTA[wd][1]
            if not (0 <= wx < L.w and 0 <= wy < L.h) or (wx, wy) in L.walls:
                break
            gc = L.gates.get((wx, wy))
            if gc is not None and gc not in opened:
                break
            if (wx, wy) in blocks or (wx, wy) in collapsed or ((wx, wy) in water and (wx, wy) not in L.fragile):
                return None
            x, y = wx, wy
            oi = L.orb_idx.get((x, y))
            if oi is not None:
                orbs |= 1 << oi
            if len(L.portals) == 2 and (x, y) in L.portals:
                x, y = L.portals[1] if (x, y) == L.portals[0] else L.portals[0]

    # Ghosts advance
    if L.ghosts:
        t2 = t + 1
        old = L.ghost_pos(t)
        new = L.ghost_pos(t2)
        for o, n in zip(old, new):
            if n == (x, y):
                return None
            if n == (px, py) and o == (x, y):
                return None
        t = t2 % L.period

    won = cmd == "F" and (x, y) == L.goal and orbs == L.full_orbs
    return (x, y, d, t, opened, orbs, collapsed, blocks, water), won

def solve(d, max_depth=34, max_states=300000):
    L = Level(d)
    s0 = L.start()
    if L.ghosts and (s0[0], s0[1]) in L.ghost_pos(0):
        return None
    prev = {s0: None}
    q = deque([(s0, 0)])
    while q:
        st, depth = q.popleft()
        if depth >= max_depth:
            continue
        for c in CMDS:
            r = step(L, st, c)
            if r is None:
                continue
            ns, won = r
            if won:
                path = [c]
                cur = st
                while prev[cur] is not None:
                    cur, cc = prev[cur]
                    path.append(cc)
                return path[::-1]
            if ns in prev:
                continue
            prev[ns] = (st, c)
            if len(prev) > max_states:
                return None
            q.append((ns, depth + 1))
    return None

def verify(d, sol):
    L = Level(d)
    st = L.start()
    if L.ghosts and (st[0], st[1]) in L.ghost_pos(0):
        return False
    for i, c in enumerate(sol):
        r = step(L, st, c)
        if r is None:
            return False
        st, won = r
        if won:
            return i == len(sol) - 1
    return False

W = H = 8
COLORS = ["cyan", "magenta", "gold", "green"]

def make_ghost_path(rng, free, anchor):
    kind = rng.random()
    if kind < 0.7:
        horiz = rng.random() < 0.5
        dx, dy = (1, 0) if horiz else (0, 1)
        ax, ay = anchor
        seg = [anchor]
        for sign in (1, -1):
            cx, cy = ax, ay
            for _ in range(rng.randint(1, 3)):
                cx, cy = cx + sign * dx, cy + sign * dy
                if (cx, cy) in free:
                    if sign == 1:
                        seg.append((cx, cy))
                    else:
                        seg.insert(0, (cx, cy))
                else:
                    break
        if len(seg) < 3:
            return None
        if rng.random() < 0.5:
            seg = seg[::-1]
        path = seg + seg[-2:0:-1]
        rot = rng.randrange(len(path))
        return path[rot:] + path[:rot]
    ax, ay = anchor
    w, h = rng.choice([(2, 2), (3, 2), (2, 3)])
    ox, oy = ax - rng.randrange(w), ay - rng.randrange(h)
    loop = [(ox + i, oy) for i in range(w)] + [(ox + w - 1, oy + j) for j in range(1, h)]
    loop += [(ox + i, oy + h - 1) for i in range(w - 2, -1, -1)] + [(ox, oy + j) for j in range(h - 2, 0, -1)]
    if any(p not in free for p in loop):
        return None
    if rng.random() < 0.5:
        loop = loop[::-1]
    rot = rng.randrange(len(loop))
    return loop[rot:] + loop[:rot]

def gen_candidate(rng, cfg):
    walls = set()
    vertical = rng.random() < 0.5
    bpos = rng.randint(3, 4)
    line = [(bpos, i) for i in range(H)] if vertical else [(i, bpos) for i in range(W)]
    crossings = rng.sample(range(1, 7), cfg["crossings"])
    cross_cells = [line[i] for i in crossings]
    for c in line:
        if c not in cross_cells:
            walls.add(c)

    lvl = {"w": W, "h": H}
    gates, sws, water, blocks, fragile, portals, winds, orbs = [], [], [], [], [], [], [], []
    side_a = (lambda p: p[0] < bpos) if vertical else (lambda p: p[1] < bpos)

    kinds = list(cfg["cross_kinds"])
    rng.shuffle(kinds)
    for i, cell in enumerate(cross_cells):
        kind = kinds[i % len(kinds)]
        if kind == "gate":
            gates.append([cell[0], cell[1], COLORS[len(gates)]])
        elif kind == "water":
            water.append(cell)
        elif kind == "fragile":
            fragile.append(cell)

    for _ in range(cfg["scatter"]):
        p = (rng.randrange(W), rng.randrange(H))
        if p not in line:
            walls.add(p)

    for _ in range(cfg.get("pools", 0)):
        p = (rng.randrange(W), rng.randrange(H))
        if p not in line and p not in walls:
            water.append(p)

    occupied = set(walls) | set(map(tuple, water)) | set(fragile) | {(g[0], g[1]) for g in gates}
    free = [(x, y) for x in range(W) for y in range(H) if (x, y) not in occupied]
    rng.shuffle(free)
    if len(free) < 20:
        return None

    def take(pred=lambda p: True):
        for i, p in enumerate(free):
            if pred(p):
                return free.pop(i)
        return None

    s = take(side_a)
    g = take(lambda p: not side_a(p) and abs(p[0] - s[0]) + abs(p[1] - s[1]) >= 6)
    if not s or not g:
        return None

    for gate in gates:
        sp = take(lambda p: side_a(p) if rng.random() < 0.7 else True)
        if not sp:
            return None
        sws.append([sp[0], sp[1], gate[2]])

    for wt in water:
        wx, wy = wt
        opts = []
        for dx, dy in DELTA.values():
            b = (wx - dx, wy - dy)
            pusher = (wx - 2 * dx, wy - 2 * dy)
            if b in free and pusher in free and b != s and pusher != g:
                opts.append(b)
        if not opts:
            return None
        b = rng.choice(opts)
        free.remove(b)
        blocks.append(b)

    for _ in range(cfg.get("orbs", 0)):
        o = take()
        if o:
            orbs.append(o)
    if cfg.get("portals") and rng.random() < cfg["portals"]:
        p1 = take(side_a)
        p2 = take(lambda p: not side_a(p))
        if p1 and p2:
            portals = [p1, p2]
    for _ in range(cfg.get("winds", 0)):
        wpos = take()
        if wpos:
            winds.append([wpos[0], wpos[1], rng.choice("NESW")])

    lvl.update({
        "s": [s[0], s[1], rng.choice("NESW")],
        "g": [g[0], g[1]],
        "walls": sorted([list(p) for p in walls]),
    })
    if gates:
        lvl["gates"] = gates
        lvl["sw"] = sws
    if water:
        lvl["water"] = [list(p) for p in water]
    if blocks:
        lvl["blocks"] = [list(p) for p in blocks]
    if fragile:
        lvl["fragile"] = [list(p) for p in fragile]
    if portals:
        lvl["portals"] = [list(p) for p in portals]
    if winds:
        lvl["winds"] = winds
    if orbs:
        lvl["orbs"] = [list(p) for p in orbs]
    return lvl, set(free)

def attempt(args):
    seed, cfg = args
    rng = random.Random(seed)
    res = gen_candidate(rng, cfg)
    if not res:
        return None
    lvl, free = res
    base = solve(lvl, max_depth=cfg["max_len"])
    if not base or len(base) < cfg["min_base"]:
        return None

    L = Level(lvl)
    st = L.start()
    route = []
    for c in base:
        st, _ = step(L, st, c)
        route.append((st[0], st[1]))
    route_tiles = [p for p in route if p in free or p == tuple(lvl["g"])]
    free_tiles = set(free) | set(route_tiles) | {tuple(lvl["g"])}
    free_tiles.discard(tuple(lvl["s"][:2]))

    best = None
    for _ in range(cfg["ghost_tries"]):
        ghosts = []
        period = 1
        for _ in range(cfg["ghosts"]):
            anchor = rng.choice(route_tiles) if route_tiles else None
            if not anchor:
                break
            path = make_ghost_path(rng, free_tiles, anchor)
            if not path:
                continue
            period = lcm(period, len(path))
            ghosts.append({"path": [list(p) for p in path]})
        if len(ghosts) < cfg["ghosts"] or period > 24:
            continue
        cand = dict(lvl)
        cand["ghosts"] = ghosts
        # Verify base hits a ghost so ghost is an active obstacle
        if verify(cand, base):
            continue
        sol = solve(cand, max_depth=cfg["max_len"])
        if not sol or len(sol) < cfg["min_len"]:
            continue
        score = len(sol) * 10 + (len(sol) - len(base)) * 4
        if best is None or score > best[0]:
            best = (score, cand, sol, len(base))
    if not best:
        return None
    _, cand, sol, blen = best
    assert verify(cand, sol)
    cand["solution"] = sol
    cand["_base"] = blen
    cand["_seed"] = seed
    return cand

CHAPTER_DEFS = [
    {
        "name": "Kapitel 07 · Herbstwald von Arashiyama",
        "cfg": dict(crossings=2, cross_kinds=["gate", "open"], scatter=9, orbs=1, ghosts=2,
                    min_base=12, min_len=16, max_len=26, ghost_tries=12),
        "levels": [
            ("Die Momiji-Allee", "Schrein-Geister", "Erstes Aufeinandertreffen mit den wandelnden Geistern von Arashiyama. Nutze Aktion auf leeren Feldern, um einen Takt abzuwarten!"),
            ("Pfad der tanzenden Blätter", "Geister-Patrouille", "Die Geister folgen einer festen Kreisbahn durch den Ahornwald. Beobachte ihre Route vor deinem Start."),
            ("Laternen im Abendrot", "Timing & Geduld", "Zwei Geister kreuzen deine Lieferroute. Passe dein Vorrücken genau an ihren Rhythmus an."),
            ("Das verfluchte Bambus-Tor", "Schalter & Geister", "Aktiviere den Schalter am Schrein und passiere das geöffnete Tor, bevor der Geist zurückkehrt."),
            ("Schrein-Glocke von Sagano", "Geisterlicht-Bergung", "Sammle das leuchtende Schrein-Relikt ein, während die Geister das Heiligtum umkreisen."),
            ("Ahorn-Labyrinth", "Schalter-Rätsel", "Das goldene Herbstlaub verdeckt die Gassen. Finde den sicheren Pfad um die Patrouille herum."),
            ("Wächter des Steingartens", "Gekreuzte Geister", "Zwei Schutzgeister patrouillieren auf parallelen Routen. Präzises Warten öffnet das Zeitfenster."),
            ("Flüsternder Bambushain", "Verzögerte Pfade", "Manchmal ist der längere Weg um die Mauer herum die sicherste Route am Geist vorbei."),
            ("Dämmerung am Orakel-Schrein", "Zwei Schrein-Geister", "Beide Wächter verengen deinen Korridor. Plane deinen gesamten Weg im Voraus."),
            ("Kapitel-Finale · Pforte von Arashiyama", "Meister-Patrouille", "Meistere die große Schrein-Pforte im Herzen des Herbstwaldes trotz wachsamer Yōkai!")
        ]
    },
    {
        "name": "Kapitel 08 · Nebelschrein der Yōkai",
        "cfg": dict(crossings=2, cross_kinds=["water", "fragile"], scatter=8, orbs=1, ghosts=2,
                    portals=0.6, min_base=13, min_len=18, max_len=28, ghost_tries=14),
        "levels": [
            ("Der versunkene Moosweg", "Brüchige Trittsteine", "Uralte Steine über dem Wasserbecken tragen den Roboter nur einmal – und Geister lauern am Ufer!"),
            ("Opferstein des Berggeistes", "Felsblock & Geister", "Schiebe den heiligen Felsblock vor dir her, um eine begehbare Brücke im Wasser zu errichten."),
            ("Kitsune-Nebelpforte", "Portal-Flucht", "Betritt das leuchtende Portal im dichten Nebel, um den Patrouillen-Geistern zu entwischen."),
            ("Kanal der verlorenen Seelen", "Wasser-Überquerung", "Kombiniere Felsenbrücke und präzises Timing, um den Kanal sicher zu passieren."),
            ("Brüchige Brücken", "Zwei Geister & Trittsteine", "Betritt die brüchigen Steine erst, wenn der Geist auf der Gegenseite weggeschwebt ist."),
            ("Yōkai-Spiegelteich", "Felsenbrücke bauen", "Ein einzelner Felsblock entscheidet über deinen Weg. Versenke ihn am richtigen Punkt im Wasser."),
            ("Schattensprung durchs Portal", "Teleportation & Geister", "Das Ziel-Portal liegt nahe am Patrouillenpfad. Timing beim Durchschreiten ist lebenswichtig."),
            ("Zerbrechlicher Pfad", "Einweg-Trittsteine", "Kein Zurück: Jeder Schritt auf morschem Stein zerstört den Rückweg. Plane fehlerfrei!"),
            ("Das versiegelte Felsengrab", "Felsblock & Portal", "Nutze den Felsen als Brücke und das Portal als Abkürzung zum goldenen Schrein."),
            ("Kapitel-Finale · Nebelschrein der Yōkai", "Meisterprüfung des Nebels", "Bezwinge den Nebelschrein durch meisterhafte Kombination aus Felsen, Portalen und Geister-Ausweichen!")
        ]
    },
    {
        "name": "Kapitel 09 · Blutmond-Ahorntal",
        "cfg": dict(crossings=2, cross_kinds=["gate", "open"], scatter=8, orbs=1, ghosts=2,
                    winds=2, min_base=14, min_len=19, max_len=29, ghost_tries=16),
        "levels": [
            ("Tal des Blutmonds", "Bergwinde & Geister", "Kräftige Fūjin-Windböen fegen durch die Schlucht und tragen KOMA direkt an Geistern vorbei!"),
            ("Fūjin-Böen im Ahornwald", "Wind-Gleiten", "Nutze den Rückenwind, um schneller durch die Gefahrenzone der Patrouille zu gleiten."),
            ("Scharlachrote Wirbel", "Gegenwind & Patrouille", "Stürmische Winde verändern deine Schrittzahl. Berechne jeden Windstoß exakt ein."),
            ("Die zwei Schrein-Tore", "Dual-Tore im Wind", "Öffne das farbige Tor und lass dich vom Windstoß hindurchtragen."),
            ("Klippen-Sturm", "Windstoß & Geister", "Ein Windstoß trägt dich sicher über den Patrouillenpfad des Schrein-Wächters."),
            ("Blutrote Laubdriften", "Timing im Fūjin-Sturm", "Wenn der Wind dich erfasst, bewegst du dich rasend schnell. Passe den Startpunkt genau ab."),
            ("Kamm des Berggeistes", "Windböen-Weiche", "Verwende die Windfelder wie ein Schienennetz, um die Geister zu umkurven."),
            ("Schlucht der flüsternden Winde", "Gleitpfad-Rätsel", "Das Geisterlicht schwebt im Windkanal. Lass dich im richtigen Moment erfassen!"),
            ("Auge des Herbststurms", "Doppel-Geist & Wind", "Zwei Geister kreuzen das Tal, während Winde in entgegengesetzte Richtungen wehen."),
            ("Kapitel-Finale · Schrein des Blutmondes", "Die Sturm-Prüfung", "Beweise deine vollendete Meisterschaft über Wind, Tore und Geister unter dem Blutmond!")
        ]
    },
    {
        "name": "Kapitel 10 · Heiligtum der 100 Prüfungen",
        "cfg": dict(crossings=3, cross_kinds=["gate", "water", "fragile"], scatter=7, orbs=2, ghosts=3,
                    winds=1, portals=0.4, min_base=15, min_len=20, max_len=30, ghost_tries=18),
        "levels": [
            ("Pforte der hundert Seelen", "Drei Geister", "Drei Geister patrouillieren gleichzeitig. Der Raum wird eng – jeder Takt muss stimmen!"),
            ("Der dreifache Geisterkreis", "Präzises Timing", "Ihre Pfade überlappen sich. Finde das winzige Zeitfenster, um unbeschadet durchzuschlüpfen."),
            ("Das vergessene Sanktuarium", "Blöcke, Winde & 3 Geister", "Verschiebe den Felsen zur Brücke, während drei Phantome das Wasserbecken sichern."),
            ("Trittsteine der Ewigkeit", "Brüchige Flucht", "Flucht über brüchigen Grund vor drei wachsamen Schrein-Geistern."),
            ("Kitsune-Astralportal", "Portal-Labyrinth", "Nutze das Teleport-Portal, um der dreifachen Geister-Zange zu entkommen."),
            ("Halle der tanzenden Phantome", "Drei Wächter-Geister", "Alle Schrein-Relikte müssen geborgen werden, bevor sich das goldene Torii öffnet."),
            ("Prüfung der vier Elemente", "Tore, Blöcke, Winde", "Felsen, Windböen und drei Geister verlangen höchste planerische Präzision."),
            ("Das große Schrein-Sanctum", "Drei Geister & Relikte", "Zwei Geisterlichter müssen unter Aufsicht von drei Geistern gesammelt werden."),
            ("Vorhof der Erleuchtung", "Meister-Herausforderung", "Die vorletzte Prüfung vor dem ewigen Heiligtum – fordert dein gesamtes Können!"),
            ("Das Ewige Heiligtum der 100 Geister", "Das Große Finale", "Das legendäre Finale von KOMA: Meistere die ultimative Schrein-Prüfung und werde zur Legende!")
        ]
    }
]

def decorate_level(lvl, ch_idx, lvl_in_ch):
    ch_info = CHAPTER_DEFS[ch_idx]
    meta = ch_info["levels"][lvl_in_ch]
    lvl["n"] = meta[0]
    lvl["c"] = ch_info["name"]
    lvl["t"] = meta[1]
    lvl["d"] = meta[2]
    lvl["theme"] = "autumn"
    lvl["limit"] = len(lvl["solution"]) + 2

    if ch_idx == 3 and lvl_in_ch == 9:
        lvl["isFinaleLevel"] = True
        lvl["limit"] = len(lvl["solution"]) + 3

    # Procedural obstacles for walls
    obstacles = {}
    for x, y in lvl.get("walls", []):
        seed = (x * 7 + y * 13 + ch_idx * 17 + lvl_in_ch * 31) % 100
        if seed < 25:
            obstacles[f"{x},{y}"] = "wall_h" if (x % 2 == 0) else "wall_v"
        elif seed < 45:
            obstacles[f"{x},{y}"] = "fence_h" if (y % 2 == 0) else "fence_v"
        elif seed < 75:
            obstacles[f"{x},{y}"] = "pine"
        elif seed < 90:
            obstacles[f"{x},{y}"] = "tree" # In autumn, renders Momiji foliage
        else:
            obstacles[f"{x},{y}"] = "house"
    lvl["obstacles"] = obstacles

    # Autumn grass moss tufts
    grass = []
    for x in range(lvl["w"]):
        for y in range(lvl["h"]):
            if [x, y] not in lvl.get("walls", []) and [x, y] not in lvl.get("water", []):
                if (x * 3 + y * 7 + ch_idx * 5) % 9 == 0:
                    grass.append([x, y])
    lvl["grass"] = grass[:4]
    return lvl

def main():
    print("Starte Generierung der 40 Herbst-Level (Kapitel 7–10, Level 61–100)...", flush=True)
    all_levels = []
    
    with Pool() as pool:
        for ci, ch in enumerate(CHAPTER_DEFS):
            found = []
            seen_layouts = set()
            batch = 0
            print(f"Generiere {ch['name']}...", flush=True)
            while len(found) < 10:
                seeds = [(77777 + ci * 2_000_000 + batch * 300 + i, ch["cfg"]) for i in range(300)]
                batch += 1
                for r in pool.imap_unordered(attempt, seeds, chunksize=4):
                    if r is None:
                        continue
                    key = (tuple(map(tuple, r["walls"])), tuple(r["s"][:2]), tuple(r["g"]))
                    if key in seen_layouts:
                        continue
                    seen_layouts.add(key)
                    found.append(r)
                    if len(found) >= 10:
                        break
                print(f"  {ch['name']}: {len(found)} / 10 gefunden...", flush=True)
                if batch > 40:
                    break

            found.sort(key=lambda r: len(r["solution"]))
            pick = found[:10]
            for li, raw in enumerate(pick):
                decorated = decorate_level(raw, ci, li)
                # Verify solution
                assert verify(decorated, decorated["solution"]), f"Verifikation fehlgeschlagen für Level {61 + len(all_levels)}"
                all_levels.append(decorated)
                print(f"  Level {60 + len(all_levels)}: {decorated['n']} - {len(decorated['solution'])} Schritte (Limit: {decorated['limit']}, Geister: {len(decorated['ghosts'])})")

    out_file = "autumn_40_levels.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(all_levels, f, ensure_ascii=False, indent=2)

    print(f"\nAlle 40 Level erfolgreich generiert und verifiziert in {out_file}!")

if __name__ == "__main__":
    main()
