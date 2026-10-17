import json
from simulator import simulate, DELTA, TURN_LEFT, TURN_RIGHT

def create_walls(w, h, open_tiles):
    open_set = set(tuple(p) for p in open_tiles)
    walls = []
    for y in range(h):
        for x in range(w):
            if (x, y) not in open_set:
                walls.append([x, y])
    return walls

# Let's craft the 40 new levels systematically and verify each one
new_levels = []

# =========================================================================
# KAPITEL 03 · NEON-KYOTO (Dual-Tore: Cyan & Magenta) - Levels 11 bis 18
# =========================================================================

# Level 11: Zwei Lichter (Einführung 2 Tore & 2 Schalter)
# Path: KOMA at (1, 4, N).
# Moves up to (1, 3), presses Cyan switch at (1, 3) -> Cyan gate at (2, 2) opens.
# Turns right, goes to (3, 3), presses Magenta switch at (3, 3) -> Magenta gate at (4, 2) opens.
# Moves through (2, 2), then to goal at (4, 1).
lvl11_path = [
    (1, 4), (1, 3), (2, 3), (3, 3), (3, 2), (2, 2), (2, 1), (3, 1), (4, 1), (4, 2)
]
# Wait, let's trace commands directly from start to finish!
# Start: [1, 4, "N"]
# Commands:
# F -> (1, 3), A (Cyan sw)
# R, F -> (2, 3), F -> (3, 3), A (Magenta sw)
# L, F -> (3, 2), L, F -> (2, 2) [Cyan gate], R, F -> (2, 1), R, F -> (3, 1), F -> (4, 1) [Goal]
lvl11 = {
    "n": "Zwei Lichter",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Dual-Tore",
    "d": "Zwei Tore versperren den Schreinpfad. Aktiviere zuerst den türkisen und dann den violetten Schalter.",
    "w": 6, "h": 6,
    "s": [1, 4, "N"],
    "g": [4, 1],
    "sw": [[1, 3, "cyan"], [3, 3, "magenta"]],
    "gates": [[2, 2, "cyan"], [4, 2, "magenta"]],
    "walls": create_walls(6, 6, [
        [1, 4], [1, 3], [2, 3], [3, 3], [3, 2], [2, 2], [2, 1], [3, 1], [4, 1], [4, 2]
    ]),
    "limit": 14,
    "solution": ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"]
}
# Limit 16 for solution length 15
lvl11["limit"] = 17
new_levels.append(lvl11)

# Level 12: Gegensätze (Zwei parallele Gassen)
# Start: [0, 1, "E"]
# F, F -> (2, 1) Cyan sw, A (opens Cyan gate at (4, 1))
# R, F, F -> (2, 3) Magenta sw, A (opens Magenta gate at (4, 3))
# L, F, F -> (4, 3 gate), L, F, F -> (4, 1 gate), R, F -> (5, 1) Goal
lvl12_open = [
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
    [2, 2], [4, 2],
    [2, 3], [3, 3], [4, 3]
]
lvl12 = {
    "n": "Gegensätze",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Parallele Gassen",
    "d": "Zwei getrennte Gassen führen zum Schreinteich. Öffne beide Tore, um den Rundweg zu vollenden.",
    "w": 6, "h": 6,
    "s": [0, 1, "E"],
    "g": [5, 1],
    "sw": [[2, 1, "cyan"], [2, 3, "magenta"]],
    "gates": [[4, 1, "cyan"], [4, 3, "magenta"]],
    "walls": create_walls(6, 6, lvl12_open),
    "limit": 16,
    "solution": ["F", "F", "A", "R", "F", "F", "A", "L", "F", "F", "L", "F", "F", "R", "F"]
}
new_levels.append(lvl12)

# Level 13: Der Schleichweg (Kaskade: Cyan öffnet Weg zum Magenta-Schalter)
# Start: [1, 5, "N"]
# F, F -> (1, 3) Cyan sw, A (opens Cyan gate at (1, 1))
# F, F -> (1, 1 gate), R, F, F -> (3, 1) Magenta sw, A (opens Magenta gate at (3, 3))
# R, F, F -> (3, 3 gate), F, F -> (3, 5) Goal
lvl13_open = [
    [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
    [2, 1], [3, 1],
    [3, 2], [3, 3], [3, 4], [3, 5]
]
lvl13 = {
    "n": "Der Schleichweg",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Kaskade",
    "d": "Das erste Tor öffnet den Zugang zum zweiten Schalter. Plane deine Wendungen präzise.",
    "w": 6, "h": 6,
    "s": [1, 5, "N"],
    "g": [3, 5],
    "sw": [[1, 3, "cyan"], [3, 1, "magenta"]],
    "gates": [[1, 1, "cyan"], [3, 3, "magenta"]],
    "walls": create_walls(6, 6, lvl13_open),
    "limit": 16,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F", "A", "R", "F", "F", "F", "F"]
}
new_levels.append(lvl13)

# Level 14: Spiegelgarten (Symmetrischer Schrein mit zwei Toren)
# Start: [3, 5, "N"]
# F, F -> (3, 3)
# L, F, F -> (1, 3) Cyan sw, A (opens Cyan gate at (2, 1))
# R, R, F, F, F, F -> (5, 3) Magenta sw, A (opens Magenta gate at (4, 1))
# L, L, F, F -> (3, 3), R, F, F -> (3, 1), R, F -> (4, 1 gate), F -> (5, 1) Goal
lvl14_open = [
    [3, 5], [3, 4], [3, 3], [3, 2], [3, 1],
    [1, 3], [2, 3], [4, 3], [5, 3],
    [2, 1], [4, 1], [5, 1]
]
lvl14 = {
    "n": "Spiegelgarten",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Symmetrie",
    "d": "Ein symmetrischer Garten mit Flügeln im Osten und Westen. Sammle beide Freigaben ein.",
    "w": 6, "h": 6,
    "s": [3, 5, "N"],
    "g": [5, 1],
    "sw": [[1, 3, "cyan"], [5, 3, "magenta"]],
    "gates": [[2, 1, "cyan"], [4, 1, "magenta"]],
    "walls": create_walls(6, 6, lvl14_open),
    "limit": 22,
    "solution": ["F", "F", "L", "F", "F", "A", "R", "R", "F", "F", "F", "F", "A", "L", "L", "F", "F", "R", "F", "F", "R", "F", "F"]
}
new_levels.append(lvl14)

# Level 15: Kreuzende Pfade (Kreuzung mit zwei Sperren)
# Start: [0, 2, "E"]
# F, F -> (2, 2), L, F, F -> (2, 0) Cyan sw, A (opens (4, 2))
# R, R, F, F, F, F -> (2, 4) Magenta sw, A (opens (2, 1)) -- wait, (2, 1) is already visited, let's open (3, 4) or goal gate!
# Let's design:
# Start: [0, 2, "E"]
# F, F -> (2, 2)
# L, F, F -> (2, 0) Cyan sw, A (opens Cyan gate at (3, 2))
# R, R, F, F -> (2, 2), L, F -> (3, 2 gate), F -> (4, 2) Magenta sw, A (opens Magenta gate at (4, 4))
# R, F, F -> (4, 4 gate), L, F -> (5, 4) Goal
lvl15_open = [
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    [2, 0], [2, 1],
    [4, 3], [4, 4], [5, 4]
]
lvl15 = {
    "n": "Kreuzende Pfade",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Kreuzung",
    "d": "Die Schrein-Kreuzung erfordert ein geschicktes Vor- und Zurücksetzen der Blickrichtung.",
    "w": 6, "h": 6,
    "s": [0, 2, "E"],
    "g": [5, 4],
    "sw": [[2, 0, "cyan"], [4, 2, "magenta"]],
    "gates": [[3, 2, "cyan"], [4, 4, "magenta"]],
    "walls": create_walls(6, 6, lvl15_open),
    "limit": 18,
    "solution": ["F", "F", "L", "F", "F", "A", "R", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F"]
}
new_levels.append(lvl15)

# Level 16: Laternenparade (Gewundene Allee)
# Start: [5, 5, "W"]
# F, F, F, F -> (1, 5), R, F, F -> (1, 3) Cyan sw, A (opens Cyan gate at (3, 3))
# R, F, F -> (3, 3 gate), F, F -> (5, 3), L, F, F -> (5, 1) Magenta sw, A (opens Magenta gate at (3, 1))
# L, F, F -> (3, 1 gate), F, F -> (1, 1) Goal
lvl16_open = [
    [5, 5], [4, 5], [3, 5], [2, 5], [1, 5],
    [1, 4], [1, 3],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [5, 2], [5, 1],
    [4, 1], [3, 1], [2, 1], [1, 1]
]
lvl16 = {
    "n": "Laternenparade",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "S-Kurven",
    "d": "Folge der schlangenförmigen Allee und öffne die Tore in den Biegungen.",
    "w": 6, "h": 6,
    "s": [5, 5, "W"],
    "g": [1, 1],
    "sw": [[1, 3, "cyan"], [5, 1, "magenta"]],
    "gates": [[3, 3, "cyan"], [3, 1, "magenta"]],
    "walls": create_walls(6, 6, lvl16_open),
    "limit": 24,
    "solution": ["F", "F", "F", "F", "R", "F", "F", "A", "R", "F", "F", "F", "F", "L", "F", "F", "A", "L", "F", "F", "F", "F"]
}
new_levels.append(lvl16)

# Level 17: Farben der Nacht (7x7 Schrein-Garten)
# Start: [1, 6, "N"]
# F, F, F -> (1, 3) Cyan sw, A (opens Cyan gate at (3, 3))
# R, F, F -> (3, 3 gate), F, F -> (5, 3) Magenta sw, A (opens Magenta gate at (5, 1))
# L, F, F -> (5, 1 gate), L, F, F -> (3, 1), F, F -> (1, 1) Goal
lvl17_open = [
    [1, 6], [1, 5], [1, 4], [1, 3],
    [2, 3], [3, 3], [4, 3], [5, 3],
    [5, 2], [5, 1],
    [4, 1], [3, 1], [2, 1], [1, 1]
]
lvl17 = {
    "n": "Farben der Nacht",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Schreingarten",
    "d": "Ein weitläufiger 7x7-Garten mit beleuchteten Steinfliesen. Behalte die Himmelsrichtungen im Blick.",
    "w": 7, "h": 7,
    "s": [1, 6, "N"],
    "g": [1, 1],
    "sw": [[1, 3, "cyan"], [5, 3, "magenta"]],
    "gates": [[3, 3, "cyan"], [5, 1, "magenta"]],
    "walls": create_walls(7, 7, lvl17_open),
    "limit": 20,
    "solution": ["F", "F", "F", "A", "R", "F", "F", "F", "F", "A", "L", "F", "F", "L", "F", "F", "F", "F"]
}
new_levels.append(lvl17)

# Level 18: Das Zwillings-Tor (Kapitel 03 Finale)
# Start: [0, 5, "E"]
# F, F -> (2, 5), L, F, F -> (2, 3) Cyan sw, A (opens (4, 3))
# L, F, F -> (0, 3), R, F, F -> (0, 1) Magenta sw, A (opens (4, 1))
# R, F, F -> (2, 1), R, F, F -> (2, 3), L, F, F -> (4, 3 gate), L, F, F -> (4, 1 gate), R, F, F -> (6, 1) Goal
lvl18_open = [
    [0, 5], [1, 5], [2, 5],
    [2, 4], [2, 3], [1, 3], [0, 3],
    [0, 2], [0, 1], [1, 1], [2, 1],
    [3, 3], [4, 3],
    [4, 2], [4, 1], [5, 1], [6, 1]
]
lvl18 = {
    "n": "Das Zwillings-Tor",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Finale",
    "d": "Die beiden heiligen Tore stehen hintereinander. Nutze den Rundweg durch die alten Bambuspfade.",
    "w": 7, "h": 7,
    "s": [0, 5, "E"],
    "g": [6, 1],
    "sw": [[2, 3, "cyan"], [0, 1, "magenta"]],
    "gates": [[4, 3, "cyan"], [4, 1, "magenta"]],
    "walls": create_walls(7, 7, lvl18_open),
    "limit": 26,
    "solution": ["F", "F", "L", "F", "F", "A", "L", "F", "F", "R", "F", "F", "A", "R", "F", "F", "R", "F", "F", "L", "F", "F", "L", "F", "F", "R", "F", "F"]
}
lvl18["limit"] = 30
new_levels.append(lvl18)

print("Kapitel 03 levels (11-18) created.")
