import json
import os
from simulator import simulate, DELTA, TURN_LEFT, TURN_RIGHT

def create_walls(w, h, open_tiles):
    open_set = set(tuple(p) for p in open_tiles)
    walls = []
    for y in range(h):
        for x in range(w):
            if (x, y) not in open_set:
                walls.append([x, y])
    return walls

campaign = []

# -------------------------------------------------------------
# KAPITEL 01 & 02: LEVELS 1 BIS 10 (ORIGINAL)
# -------------------------------------------------------------
original_10 = [
  {
    "n": "Die erste Lieferung",
    "c": "Kapitel 01 · Laternenviertel",
    "t": "Tutorial",
    "d": "Fahre zuerst geradeaus durch die Gasse und biege dann nach Süden zum Paket ab. Mit sechs Befehlen kommst du ans Ziel.",
    "w": 5, "h": 5,
    "s": [0, 0, "E"],
    "g": [4, 1],
    "walls": [[1, 1], [1, 2], [3, 2], [3, 3]],
    "limit": 8,
    "solution": ["F", "F", "F", "F", "R", "F"]
  },
  {
    "n": "Um die Ecke",
    "c": "Kapitel 01 · Laternenviertel",
    "t": "Weg finden",
    "d": "Die Mauer versperrt den mittleren Weg. Fahre nach Norden bis zur oberen Gasse und dann nach Osten zum Paket. Du hast genau acht Befehle.",
    "w": 5, "h": 5,
    "s": [0, 2, "E"],
    "g": [4, 0],
    "walls": [[2, 1], [2, 2], [2, 3]],
    "limit": 8,
    "solution": ["L", "F", "F", "R", "F", "F", "F", "F"]
  },
  {
    "n": "Das Tor des Schreins",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Schalter",
    "d": "Aktiviere den mintfarbenen Schalter mit ✦. Danach öffnet sich das violette Tor.",
    "w": 6, "h": 6,
    "s": [5, 4, "W"],
    "g": [3, 0],
    "walls": [
      [0, 0], [1, 0], [2, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [4, 1], [5, 1],
      [0, 2], [1, 2], [2, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [2, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [2, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    "sw": [[3, 3]],
    "gate": [[3, 1]],
    "limit": 8,
    "solution": ["F", "F", "R", "F", "A", "F", "F", "F"]
  },
  {
    "n": "Der kleine Umweg",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Planen",
    "d": "Ein längerer Korridor zwingt dich zu einem Richtungswechsel. Aktiviere unterwegs den Schalter, bevor du das Tor erreichst.",
    "w": 6, "h": 6,
    "s": [1, 0, "S"],
    "g": [3, 5],
    "walls": [
      [0, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [0, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [0, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [2, 4], [3, 4], [4, 4], [5, 4],
      [0, 5], [4, 5], [5, 5]
    ],
    "sw": [[1, 2]],
    "gate": [[1, 4]],
    "limit": 9,
    "solution": ["F", "F", "A", "F", "F", "F", "L", "F", "F"]
  },
  {
    "n": "Zwei Schritte voraus",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Kombination",
    "d": "Plane eine längere Strecke mit mehreren Abschnitten. Der Schalter muss vor dem Tor aktiviert werden.",
    "w": 6, "h": 6,
    "s": [4, 3, "S"],
    "g": [0, 2],
    "walls": [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [1, 3], [2, 3], [3, 3], [5, 3],
      [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    "sw": [[2, 4]],
    "gate": [[0, 4]],
    "limit": 10,
    "solution": ["F", "R", "F", "F", "A", "F", "F", "R", "F", "F"]
  },
  {
    "n": "Laternenlicht",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Route lesen",
    "d": "Der Weg wird länger und führt um mehrere Ecken. Achte auf die Ausrichtung von KOMA nach jeder Drehung.",
    "w": 6, "h": 6,
    "s": [0, 5, "E"],
    "g": [0, 1],
    "walls": [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [3, 1], [4, 1], [5, 1],
      [0, 2], [1, 2], [3, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [3, 4], [4, 4], [5, 4],
      [3, 5], [4, 5], [5, 5]
    ],
    "sw": [[2, 5]],
    "gate": [[2, 3]],
    "limit": 11,
    "solution": ["F", "F", "A", "L", "F", "F", "F", "F", "L", "F", "F"]
  },
  {
    "n": "Der richtige Moment",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Reihenfolge",
    "d": "Jetzt brauchst du mehrere Richtungswechsel. Der Schalter liegt auf dem einzigen begehbaren Pfad.",
    "w": 6, "h": 6,
    "s": [3, 2, "N"],
    "g": [1, 2],
    "walls": [
      [4, 0], [5, 0],
      [1, 1], [2, 1], [4, 1], [5, 1],
      [2, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    "sw": [[2, 0]],
    "gate": [[0, 0]],
    "limit": 12,
    "solution": ["F", "F", "L", "F", "A", "F", "F", "L", "F", "F", "L", "F"]
  },
  {
    "n": "Geheime Gasse",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Kombination",
    "d": "Ein verwinkelter Weg verlangt vorausschauendes Planen. Öffne das Tor, bevor KOMA es erreicht.",
    "w": 6, "h": 6,
    "s": [2, 1, "W"],
    "g": [3, 5],
    "walls": [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [3, 1], [4, 1], [5, 1],
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [4, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [4, 5], [5, 5]
    ],
    "sw": [[0, 1]],
    "gate": [[0, 3]],
    "limit": 13,
    "solution": ["F", "F", "A", "L", "F", "F", "F", "L", "F", "F", "F", "R", "F"]
  },
  {
    "n": "Fast am Ziel",
    "c": "Kapitel 04 · Neon-Kyoto",
    "t": "Knifflig",
    "d": "Die Route ist länger und hat mehrere Ecken. Ein falsch gesetzter Drehbefehl kann den gesamten Plan stoppen.",
    "w": 6, "h": 6,
    "s": [5, 2, "N"],
    "g": [0, 5],
    "walls": [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2],
      [0, 3], [1, 3], [2, 3], [3, 3], [5, 3],
      [0, 4], [1, 4], [2, 4], [3, 4], [5, 4],
      [5, 5]
    ],
    "sw": [[4, 2]],
    "gate": [[4, 4]],
    "limit": 14,
    "solution": ["F", "L", "F", "L", "F", "A", "F", "F", "F", "R", "F", "F", "F", "F"]
  },
  {
    "n": "Die letzte Lieferung",
    "c": "Kapitel 04 · Neon-Kyoto",
    "t": "Finale",
    "d": "Die Abschlussmission verbindet eine lange Route, mehrere Drehungen und die richtige Reihenfolge von Schalter und Tor.",
    "w": 6, "h": 6,
    "s": [0, 4, "N"],
    "g": [4, 5],
    "walls": [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [5, 1],
      [0, 2], [2, 2], [3, 2], [5, 2],
      [2, 3], [3, 3], [5, 3],
      [1, 4], [2, 4], [3, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [5, 5]
    ],
    "sw": [[1, 3]],
    "gate": [[1, 1]],
    "limit": 16,
    "solution": ["F", "R", "F", "A", "L", "F", "F", "R", "F", "F", "F", "R", "F", "F", "F", "F"]
  }
]
campaign.extend(original_10)

# -------------------------------------------------------------
# KAPITEL 03 · NEON-KYOTO (LEVELS 11 BIS 18: DUAL-TORE)
# -------------------------------------------------------------
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
    "limit": 18,
    "solution": ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"]
}
campaign.append(lvl11)

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
    "walls": create_walls(6, 6, [
        [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
        [2, 2], [4, 2],
        [2, 3], [3, 3], [4, 3]
    ]),
    "limit": 17,
    "solution": ["F", "F", "A", "R", "F", "F", "A", "L", "F", "F", "L", "F", "F", "R", "F"]
}
campaign.append(lvl12)

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
    "walls": create_walls(6, 6, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
        [2, 1], [3, 1],
        [3, 2], [3, 3], [3, 4], [3, 5]
    ]),
    "limit": 16,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F", "A", "R", "F", "F", "F", "F"]
}
campaign.append(lvl13)

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
    "walls": create_walls(6, 6, [
        [3, 5], [3, 4], [3, 3], [3, 2], [3, 1],
        [1, 3], [2, 3], [4, 3], [5, 3],
        [2, 1], [4, 1], [5, 1]
    ]),
    "limit": 26,
    "solution": ["F", "F", "L", "F", "F", "A", "R", "R", "F", "F", "F", "F", "A", "L", "L", "F", "F", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl14)

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
    "walls": create_walls(6, 6, [
        [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
        [2, 0], [2, 1],
        [4, 3], [4, 4], [5, 4]
    ]),
    "limit": 22,
    "solution": ["F", "F", "L", "F", "F", "A", "R", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F"]
}
campaign.append(lvl15)

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
    "walls": create_walls(6, 6, [
        [5, 5], [4, 5], [3, 5], [2, 5], [1, 5],
        [1, 4], [1, 3],
        [2, 3], [3, 3], [4, 3], [5, 3],
        [5, 2], [5, 1],
        [4, 1], [3, 1], [2, 1], [1, 1]
    ]),
    "limit": 25,
    "solution": ["F", "F", "F", "F", "R", "F", "F", "A", "R", "F", "F", "F", "F", "L", "F", "F", "A", "L", "F", "F", "F", "F"]
}
campaign.append(lvl16)

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
    "walls": create_walls(7, 7, [
        [1, 6], [1, 5], [1, 4], [1, 3],
        [2, 3], [3, 3], [4, 3], [5, 3],
        [5, 2], [5, 1],
        [4, 1], [3, 1], [2, 1], [1, 1]
    ]),
    "limit": 22,
    "solution": ["F", "F", "F", "A", "R", "F", "F", "F", "F", "A", "L", "F", "F", "L", "F", "F", "F", "F"]
}
campaign.append(lvl17)

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
    "walls": create_walls(7, 7, [
        [0, 5], [1, 5], [2, 5],
        [2, 4], [2, 3], [2, 2], [1, 3], [0, 3],
        [0, 2], [0, 1], [1, 1], [2, 1],
        [3, 3], [4, 3],
        [4, 2], [4, 1], [5, 1], [6, 1]
    ]),
    "limit": 30,
    "solution": ["F", "F", "L", "F", "F", "A", "L", "F", "F", "R", "F", "F", "A", "R", "F", "F", "R", "F", "F", "L", "F", "F", "L", "F", "F", "R", "F", "F"]
}
campaign.append(lvl18)

# -------------------------------------------------------------
# KAPITEL 04 · KITSUNE-GARTEN (LEVELS 19 BIS 26: PORTALE ⛩️🌀)
# -------------------------------------------------------------

# Level 19: Das Portal des Fuchses (Einführung Portal)
# Start: [0, 2, "E"]
# F, F -> (2, 2) Portal 1 -> teleports to (4, 2) Portal 2
# F, F -> (6, 2) Goal
lvl19 = {
    "n": "Das Portal des Fuchses",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Teleport",
    "d": "Die Kitsune-Schreine nutzen geheime Dimensionstore. Betrete das leuchtende Portal, um weite Strecken zu überspringen.",
    "w": 7, "h": 5,
    "s": [0, 2, "E"],
    "g": [6, 2],
    "portals": [[2, 2], [4, 2]],
    "walls": create_walls(7, 5, [
        [0, 2], [1, 2], [2, 2], [4, 2], [5, 2], [6, 2]
    ]),
    "limit": 6,
    "solution": ["F", "F", "F", "F"]
}
campaign.append(lvl19)

# Level 20: Über die Mauer
# Start: [1, 4, "N"]
# F, F -> (1, 2) Portal 1 -> teleports to (4, 2) Portal 2
# R, F, F -> (4, 4) Goal
lvl20 = {
    "n": "Über die Mauer",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Mauer-Sprung",
    "d": "Eine dichte Steinmauer trennt die Gartenbereiche. Nutze das Portal, um direkt auf die andere Seite zu beamen.",
    "w": 6, "h": 6,
    "s": [1, 4, "N"],
    "g": [4, 4],
    "portals": [[1, 2], [4, 2]],
    "walls": create_walls(6, 6, [
        [1, 4], [1, 3], [1, 2],
        [4, 2], [4, 3], [4, 4]
    ]),
    "limit": 8,
    "solution": ["F", "F", "R", "R", "F", "F"]
}
campaign.append(lvl20)

# Level 21: Schritt ins Blaue (Portal + Schalter)
# Start: [1, 5, "N"]
# F, F, F -> (1, 2) Portal 1 -> teleports to (4, 2) Portal 2
# R, F -> (5, 2) sw, A (opens gate at (1, 0))
# L, L, F -> (4, 2) Portal 2 -> teleports back to (1, 2) Portal 1 (facing W)
# R, F, F -> (1, 0 gate), R, F, F -> (3, 0) Goal
lvl21 = {
    "n": "Schritt ins Blaue",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Hin & Zurück",
    "d": "Der Schalter liegt auf einer isolierten Insel. Springe durch das Portal, aktiviere ihn und kehre zurück.",
    "w": 6, "h": 6,
    "s": [1, 5, "N"],
    "g": [3, 0],
    "portals": [[1, 2], [4, 2]],
    "sw": [[5, 2, "cyan"]],
    "gates": [[1, 0, "cyan"]],
    "walls": create_walls(6, 6, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0],
        [2, 0], [3, 0],
        [4, 2], [5, 2]
    ]),
    "limit": 16,
    "solution": ["F", "F", "F", "R", "F", "A", "L", "L", "F", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl21)

# Level 22: Dimensions-Sprung (Zwei Inseln im Wasser)
# Start: [0, 4, "E"]
# F, F -> (2, 4) sw Cyan, A (opens (4, 1))
# L, F, F -> (2, 2) Portal 1 -> teleports to (5, 4) Portal 2
# F, F, F -> (5, 1), L, F -> (4, 1 gate), F -> (3, 1) Goal
lvl22 = {
    "n": "Dimensions-Sprung",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Wasser-Inseln",
    "d": "Das Schreinbecken ist unpassierbar. Teleportiere auf die Nordinsel und erreiche das Ziel-Torii.",
    "w": 6, "h": 6,
    "s": [0, 4, "E"],
    "g": [3, 1],
    "sw": [[2, 4, "cyan"]],
    "gates": [[4, 1, "cyan"]],
    "portals": [[2, 2], [5, 4]],
    "walls": create_walls(6, 6, [
        [0, 4], [1, 4], [2, 4], [2, 3], [2, 2],
        [5, 4], [5, 3], [5, 2], [5, 1], [4, 1], [3, 1]
    ]),
    "limit": 16,
    "solution": ["F", "F", "A", "L", "F", "F", "F", "F", "F", "L", "F", "F"]
}
campaign.append(lvl22)

# Level 23: Raumkrümmung (7x7 Schrein-Garten)
# Start: [1, 5, "E"]
# F, F -> (3, 5), L, F, F -> (3, 3) Portal 1 -> teleports to (5, 1) Portal 2 (facing N)
# L, F, F -> (3, 1) sw Cyan, A (opens (1, 1))
# F, F -> (1, 1 gate), L, F, F -> (1, 3) Goal
lvl23 = {
    "n": "Raumkrümmung",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Portal-Netz",
    "d": "Das Portal verbindet zwei diagonale Kammern des Gartens. Nutze die Raumkrümmung geschickt aus.",
    "w": 7, "h": 7,
    "s": [1, 5, "E"],
    "g": [1, 3],
    "sw": [[3, 1, "cyan"]],
    "gates": [[1, 1, "cyan"]],
    "portals": [[3, 3], [5, 1]],
    "walls": create_walls(7, 7, [
        [1, 5], [2, 5], [3, 5], [3, 4], [3, 3],
        [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3]
    ]),
    "limit": 18,
    "solution": ["F", "F", "L", "F", "F", "L", "F", "F", "A", "F", "F", "L", "F", "F"]
}
campaign.append(lvl23)

# Level 24: Der verschlungene Hof (Portal + Dual-Tore)
# Start: [0, 5, "N"]
# F, F -> (0, 3) sw Cyan, A (opens (2, 3))
# R, F, F -> (2, 3 gate), F -> (3, 3) Portal 1 -> teleports to (5, 1) Portal 2 (facing E)
# R, F, F -> (5, 3) sw Magenta, A (opens (5, 5))
# F, F -> (5, 5 gate), L, F -> (6, 5) Goal
lvl24 = {
    "n": "Der verschlungene Hof",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Portal & Dual-Tore",
    "d": "Das Portal führt direkt in den abgeschlossenen Innenhof mit dem zweiten Schalter.",
    "w": 7, "h": 7,
    "s": [0, 5, "N"],
    "g": [6, 5],
    "sw": [[0, 3, "cyan"], [5, 3, "magenta"]],
    "gates": [[2, 3, "cyan"], [5, 5, "magenta"]],
    "portals": [[3, 3], [5, 1]],
    "walls": create_walls(7, 7, [
        [0, 5], [0, 4], [0, 3], [1, 3], [2, 3], [3, 3],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [6, 5]
    ]),
    "limit": 18,
    "solution": ["F", "F", "A", "R", "F", "F", "F", "R", "F", "F", "A", "F", "F", "L", "F"]
}
campaign.append(lvl24)

# Level 25: Kitsunes Irrgarten (Labyrinth mit Portal-Überbrückung)
# Start: [1, 6, "N"]
# F, F, F -> (1, 3), R, F, F -> (3, 3) Portal 1 -> teleports to (5, 5) Portal 2 (facing E)
# L, F, F -> (5, 3), L, F, F -> (3, 3) sw Cyan, A (opens (5, 1)) -- wait, (3, 3) is Portal 1!
# Let's adjust sw to (4, 3):
# From Portal 2 at (5, 5, facing E):
# L, F, F -> (5, 3), L, F -> (4, 3) sw Cyan, A (opens (5, 1))
# R, R, F -> (5, 3), L, F, F -> (5, 1 gate), R, F -> (6, 1) Goal
lvl25 = {
    "n": "Kitsunes Irrgarten",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Labyrinth",
    "d": "Die Wände stehen eng. Das Portal ist der einzige Weg, um die versperrte Gasse zu umgehen.",
    "w": 7, "h": 7,
    "s": [1, 6, "N"],
    "g": [6, 1],
    "sw": [[4, 3, "cyan"]],
    "gates": [[5, 1, "cyan"]],
    "portals": [[3, 3], [5, 5]],
    "walls": create_walls(7, 7, [
        [1, 6], [1, 5], [1, 4], [1, 3], [2, 3], [3, 3],
        [5, 5], [5, 4], [5, 3], [4, 3], [5, 2], [5, 1], [6, 1]
    ]),
    "limit": 22,
    "solution": ["F", "F", "F", "R", "F", "F", "L", "F", "F", "L", "F", "A", "R", "R", "F", "L", "F", "F", "R", "F"]
}
campaign.append(lvl25)

# Level 26: Sprung ins Torii (Kapitel 04 Finale)
# Start: [0, 3, "E"]
# F, F -> (2, 3) sw Cyan, A (opens (4, 1))
# L, F, F -> (2, 1) sw Magenta, A (opens (4, 5))
# R, R, F, F, F, F -> (2, 5) Portal 1 -> teleports to (4, 1 gate) -> wait!
# If teleports to (4, 3) Portal 2 (facing S):
# F, F -> (4, 5 gate), L, F, F -> (6, 5) Goal
lvl26 = {
    "n": "Sprung ins Torii",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Finale",
    "d": "Das Meisterstück der Kitsune-Geister: Öffne beide Schranken, bevor du das Portal betrittst.",
    "w": 7, "h": 7,
    "s": [0, 3, "E"],
    "g": [6, 5],
    "sw": [[2, 3, "cyan"], [2, 1, "magenta"]],
    "gates": [[4, 5, "cyan"]], # opens gate to goal
    "portals": [[2, 5], [4, 3]],
    "walls": create_walls(7, 7, [
        [0, 3], [1, 3], [2, 3],
        [2, 2], [2, 1],
        [2, 4], [2, 5],
        [4, 3], [4, 4], [4, 5], [5, 5], [6, 5]
    ]),
    "limit": 22,
    "solution": ["F", "F", "A", "L", "F", "F", "A", "R", "R", "F", "F", "F", "F", "F", "F", "L", "F", "F"]
}
campaign.append(lvl26)

# -------------------------------------------------------------
# KAPITEL 05 · BAMBUSWALD DER GEISTER (LEVELS 27 BIS 34: SPIRIT ORBS 🌸)
# -------------------------------------------------------------

# Level 27: Das verlorene Licht (Einführung 1 Spirit Orb)
# Start: [0, 2, "E"]
# F, F -> (2, 2) collects Orb 1
# F, F -> (4, 2) Goal
lvl27 = {
    "n": "Das verlorene Licht",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Geisterlicht",
    "d": "Sammle das schwebende Geisterlicht 🌸 ein, um das heilige Zieltor zu aktivieren.",
    "w": 5, "h": 5,
    "s": [0, 2, "E"],
    "g": [4, 2],
    "orbs": [[2, 2]],
    "walls": create_walls(5, 5, [
        [0, 2], [1, 2], [2, 2], [3, 2], [4, 2]
    ]),
    "limit": 6,
    "solution": ["F", "F", "F", "F"]
}
campaign.append(lvl27)

# Level 28: Zwei Opfergaben (2 Orbs auf verschiedenen Pfaden)
# Start: [2, 4, "N"]
# F, F -> (2, 2)
# L, F, F -> (0, 2) Orb 1
# R, R, F, F, F, F -> (4, 2) Orb 2
# L, F, F -> (4, 0) Goal
lvl28 = {
    "n": "Zwei Opfergaben",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Zwei Lichter",
    "d": "Zwei Lotosblüten leuchten links und rechts im Bambusdickicht. Sammle beide ein.",
    "w": 5, "h": 5,
    "s": [2, 4, "N"],
    "g": [4, 0],
    "orbs": [[0, 2], [4, 2]],
    "walls": create_walls(5, 5, [
        [2, 4], [2, 3], [2, 2],
        [1, 2], [0, 2],
        [3, 2], [4, 2],
        [4, 1], [4, 0]
    ]),
    "limit": 16,
    "solution": ["F", "F", "L", "F", "F", "R", "R", "F", "F", "F", "F", "L", "F", "F"]
}
campaign.append(lvl28)

# Level 29: Schrein der Ahnen (1 Orb + 1 Tor)
# Start: [1, 5, "N"]
# F, F -> (1, 3) sw Cyan, A (opens (1, 1))
# F, F -> (1, 1 gate), R, F, F -> (3, 1) Orb 1, F, F -> (5, 1) Goal
lvl29 = {
    "n": "Schrein der Ahnen",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Tor & Licht",
    "d": "Das Zieltor verlangt beides: die Schalter-Freigabe und das eingesammelte Geisterlicht.",
    "w": 6, "h": 6,
    "s": [1, 5, "N"],
    "g": [5, 1],
    "sw": [[1, 3, "cyan"]],
    "gates": [[1, 1, "cyan"]],
    "orbs": [[3, 1]],
    "walls": create_walls(6, 6, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
        [2, 1], [3, 1], [4, 1], [5, 1]
    ]),
    "limit": 14,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F", "F", "F"]
}
campaign.append(lvl29)

# Level 30: Glühwürmchen-Garten (2 Orbs + Schalter)
# Start: [0, 4, "N"]
# F, F -> (0, 2) Orb 1, R, F, F -> (2, 2) sw Cyan, A (opens (4, 2))
# F, F -> (4, 2 gate), R, F, F -> (4, 4) Orb 2, L, F -> (5, 4) Goal
lvl30 = {
    "n": "Glühwürmchen-Garten",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Glühwürmchen",
    "d": "Die Lichter fliegen zwischen den Schreinteichen. Sammle beide ein, bevor du das Tor durchquerst.",
    "w": 6, "h": 6,
    "s": [0, 4, "N"],
    "g": [5, 4],
    "sw": [[2, 2, "cyan"]],
    "gates": [[4, 2, "cyan"]],
    "orbs": [[0, 2], [4, 4]],
    "walls": create_walls(6, 6, [
        [0, 4], [0, 3], [0, 2],
        [1, 2], [2, 2], [3, 2], [4, 2],
        [4, 3], [4, 4], [5, 4]
    ]),
    "limit": 16,
    "solution": ["F", "F", "R", "F", "F", "A", "F", "F", "R", "F", "F", "L", "F"]
}
campaign.append(lvl30)

# Level 31: Das heilige Becken (Rundweg um Teich mit 2 Orbs)
# Start: [1, 5, "N"]
# F, F, F, F -> (1, 1) Orb 1
# R, F, F, F, F -> (5, 1) Orb 2
# R, F, F, F, F -> (5, 5) Goal
lvl31 = {
    "n": "Das heilige Becken",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Umfahrung",
    "d": "Ein kreisförmiger Weg um das Wasser. Sammle die schwebenden Lichter an den gegenüberliegenden Ecken.",
    "w": 7, "h": 7,
    "s": [1, 5, "N"],
    "g": [5, 5],
    "orbs": [[1, 1], [5, 1]],
    "walls": create_walls(7, 7, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
        [2, 1], [3, 1], [4, 1], [5, 1],
        [5, 2], [5, 3], [5, 4], [5, 5]
    ]),
    "limit": 16,
    "solution": ["F", "F", "F", "F", "R", "F", "F", "F", "F", "R", "F", "F", "F", "F"]
}
campaign.append(lvl31)

# Level 32: Geisterpfad (Orbs + Portal)
# Start: [1, 5, "N"]
# F, F -> (1, 3) Orb 1
# F, F -> (1, 1) Portal 1 -> teleports to (5, 1) Portal 2 (facing N)
# R, F, F -> (5, 3) Orb 2, F, F -> (5, 5) Goal
lvl32 = {
    "n": "Geisterpfad",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Portal & Licht",
    "d": "Das erste Licht liegt vor dem Portal, das zweite wartet auf der anderen Seite des Gartens.",
    "w": 7, "h": 7,
    "s": [1, 5, "N"],
    "g": [5, 5],
    "portals": [[1, 1], [5, 1]],
    "orbs": [[1, 3], [5, 3]],
    "walls": create_walls(7, 7, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
        [5, 1], [5, 2], [5, 3], [5, 4], [5, 5]
    ]),
    "limit": 14,
    "solution": ["F", "F", "F", "F", "R", "R", "F", "F", "F", "F"]
}
campaign.append(lvl32)

# Level 33: Der stille Bambus (2 Orbs + Dual Gates)
# Start: [0, 5, "N"]
# F, F -> (0, 3) sw Cyan, A (opens (2, 3))
# R, F, F -> (2, 3 gate) Orb 1, F, F -> (4, 3) sw Magenta, A (opens (4, 1))
# L, F, F -> (4, 1 gate) Orb 2, R, F, F -> (6, 1) Goal
lvl33 = {
    "n": "Der stille Bambus",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Kombination",
    "d": "Verknüpfe Schalter-Aktivierung und das Einsammeln der Geisteropfer in einem flüssigen Plan.",
    "w": 7, "h": 7,
    "s": [0, 5, "N"],
    "g": [6, 1],
    "sw": [[0, 3, "cyan"], [4, 3, "magenta"]],
    "gates": [[2, 3, "cyan"], [4, 1, "magenta"]],
    "orbs": [[2, 3], [4, 1]],
    "walls": create_walls(7, 7, [
        [0, 5], [0, 4], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3],
        [4, 2], [4, 1], [5, 1], [6, 1]
    ]),
    "limit": 18,
    "solution": ["F", "F", "A", "R", "F", "F", "F", "F", "A", "L", "F", "F", "R", "F", "F"]
}
campaign.append(lvl33)

# Level 34: Laternenfest (Kapitel 05 Finale: 3 Orbs)
# Start: [3, 5, "N"]
# F, F -> (3, 3) Orb 1
# L, F, F -> (1, 3) Orb 2
# R, R, F, F, F, F -> (5, 3) Orb 3
# L, F, F -> (5, 1) Goal
lvl34 = {
    "n": "Laternenfest",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Drei Lichter",
    "d": "Zum Abschluss des Geisterwaldes leuchten drei magische Lichter. Plane den optimalen Sammelpfad.",
    "w": 7, "h": 7,
    "s": [3, 5, "N"],
    "g": [5, 1],
    "orbs": [[3, 3], [1, 3], [5, 3]],
    "walls": create_walls(7, 7, [
        [3, 5], [3, 4], [3, 3],
        [2, 3], [1, 3],
        [4, 3], [5, 3],
        [5, 2], [5, 1]
    ]),
    "limit": 18,
    "solution": ["F", "F", "L", "F", "F", "R", "R", "F", "F", "F", "F", "L", "F", "F"]
}
campaign.append(lvl34)

# -------------------------------------------------------------
# KAPITEL 06 · SHINTO-HIMMELSBRÜCKE (LEVELS 35 BIS 42: TRIPLE-TORE)
# -------------------------------------------------------------

# Level 35: Die dritte Flamme (Einführung Goldener Schalter & Tor)
# Start: [1, 5, "N"]
# F, F -> (1, 3) Gold sw, A (opens (1, 1))
# F, F -> (1, 1 gate), R, F, F -> (3, 1) Goal
lvl35 = {
    "n": "Die dritte Flamme",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Gold-Tor",
    "d": "Das goldene Torii-Tor ☀️ erstrahlt in Sonnenlicht. Aktiviere den goldenen Schalter zur Durchfahrt.",
    "w": 6, "h": 6,
    "s": [1, 5, "N"],
    "g": [3, 1],
    "sw": [[1, 3, "gold"]],
    "gates": [[1, 1, "gold"]],
    "walls": create_walls(6, 6, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1]
    ]),
    "limit": 10,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F"]
}
campaign.append(lvl35)

# Level 36: Triade der Geister (3 Tore: Cyan, Magenta, Gold)
# Start: [0, 5, "N"]
# F, F -> (0, 3) Cyan sw, A (opens (2, 3))
# R, F, F -> (2, 3 gate), F -> (3, 3) Magenta sw, A (opens (4, 3))
# F -> (4, 3 gate), F -> (5, 3) Gold sw, A (opens (5, 1))
# L, F, F -> (5, 1 gate), R, F -> (6, 1) Goal
lvl36 = {
    "n": "Triade der Geister",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Dreifach-Tor",
    "d": "Drei aufeinanderfolgende Tore in Türkis, Violett und Gold versperren die heilige Brücke.",
    "w": 7, "h": 7,
    "s": [0, 5, "N"],
    "g": [6, 1],
    "sw": [[0, 3, "cyan"], [3, 3, "magenta"], [5, 3, "gold"]],
    "gates": [[2, 3, "cyan"], [4, 3, "magenta"], [5, 1, "gold"]],
    "walls": create_walls(7, 7, [
        [0, 5], [0, 4], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
        [5, 2], [5, 1], [6, 1]
    ]),
    "limit": 18,
    "solution": ["F", "F", "A", "R", "F", "F", "F", "A", "F", "F", "A", "L", "F", "F", "R", "F"]
}
campaign.append(lvl36)

# Level 37: Goldener Sonnenaufgang (Gold-Schalter öffnet Haupttor)
# Start: [1, 6, "N"]
# F, F, F -> (1, 3) Cyan sw, A (opens (3, 3))
# R, F, F -> (3, 3 gate), F, F -> (5, 3) Gold sw, A (opens (3, 1))
# L, F, F -> (5, 1), L, F, F -> (3, 1 gate), F, F -> (1, 1) Goal
lvl37 = {
    "n": "Goldener Sonnenaufgang",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Brückenbogen",
    "d": "Der goldene Schalter liegt am östlichen Aussichtspunkt der Himmelsbrücke.",
    "w": 7, "h": 7,
    "s": [1, 6, "N"],
    "g": [1, 1],
    "sw": [[1, 3, "cyan"], [5, 3, "gold"]],
    "gates": [[3, 3, "cyan"], [3, 1, "gold"]],
    "walls": create_walls(7, 7, [
        [1, 6], [1, 5], [1, 4], [1, 3],
        [2, 3], [3, 3], [4, 3], [5, 3],
        [5, 2], [5, 1],
        [4, 1], [3, 1], [2, 1], [1, 1]
    ]),
    "limit": 20,
    "solution": ["F", "F", "F", "A", "R", "F", "F", "F", "F", "A", "L", "F", "F", "L", "F", "F", "F", "F"]
}
campaign.append(lvl37)

# Level 38: Die drei Siegel (Kaskade Cyan -> Magenta -> Gold)
# Start: [1, 5, "N"]
# F, F -> (1, 3) Cyan sw, A (opens (1, 1))
# F, F -> (1, 1 gate), R, F, F -> (3, 1) Magenta sw, A (opens (3, 3))
# R, F, F -> (3, 3 gate), L, F, F -> (5, 3) Gold sw, A (opens (5, 5))
# R, F, F -> (5, 5 gate), L, F -> (6, 5) Goal
lvl38 = {
    "n": "Die drei Siegel",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Kaskade 3x",
    "d": "Jeder Schalter öffnet das Tor zur nächsten Kammer. Eine meisterhafte Kaskaden-Prüfung.",
    "w": 7, "h": 7,
    "s": [1, 5, "N"],
    "g": [6, 5],
    "sw": [[1, 3, "cyan"], [3, 1, "magenta"], [5, 3, "gold"]],
    "gates": [[1, 1, "cyan"], [3, 3, "magenta"], [5, 5, "gold"]],
    "walls": create_walls(7, 7, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1],
        [2, 1], [3, 1],
        [3, 2], [3, 3],
        [4, 3], [5, 3],
        [5, 4], [5, 5], [6, 5]
    ]),
    "limit": 24,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F"]
}
campaign.append(lvl38)

# Level 39: Brücke der drei Winde (8x8 Brücke)
# Start: [1, 7, "N"]
# F, F -> (1, 5) Cyan sw, A (opens (3, 5))
# R, F, F -> (3, 5 gate), L, F, F -> (3, 3) Magenta sw, A (opens (5, 3))
# R, F, F -> (5, 3 gate), L, F, F -> (5, 1) Gold sw, A (opens (7, 1))
# R, F, F -> (7, 1 gate), R, F -> (7, 2) Goal
lvl39 = {
    "n": "Brücke der drei Winde",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Große Brücke",
    "d": "Die Himmelsbrücke spannt sich über das 8x8-Tal. Überwinde alle drei Farbsiegel.",
    "w": 8, "h": 8,
    "s": [1, 7, "N"],
    "g": [7, 2],
    "sw": [[1, 5, "cyan"], [3, 3, "magenta"], [5, 1, "gold"]],
    "gates": [[3, 5, "cyan"], [5, 3, "magenta"], [7, 1, "gold"]],
    "walls": create_walls(8, 8, [
        [1, 7], [1, 6], [1, 5],
        [2, 5], [3, 5],
        [3, 4], [3, 3],
        [4, 3], [5, 3],
        [5, 2], [5, 1],
        [6, 1], [7, 1], [7, 2]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "R", "F"]
}
campaign.append(lvl39)

# Level 40: Prüfung der Elemente (3 Tore + Portal)
# Start: [0, 4, "E"]
# F, F -> (2, 4) Cyan sw, A (opens (4, 4))
# F, F -> (4, 4 gate) Portal 1 -> teleports to (6, 2) Portal 2 (facing E)
# L, F, F -> (6, 0) Magenta sw, A (opens (4, 0))
# L, F, F -> (4, 0 gate) Gold sw, A (opens (2, 0))
# F, F -> (2, 0 gate), L, F -> (2, 1) Goal
lvl40 = {
    "n": "Prüfung der Elemente",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Portale & 3 Tore",
    "d": "Kombination aus Portalsprung und drei farbigen Toren auf der oberen Plattform.",
    "w": 8, "h": 6,
    "s": [0, 4, "E"],
    "g": [2, 1],
    "sw": [[2, 4, "cyan"], [6, 0, "magenta"], [4, 0, "gold"]],
    "gates": [[4, 4, "cyan"], [4, 0, "magenta"], [2, 0, "gold"]],
    "portals": [[4, 4], [6, 2]],
    "walls": create_walls(8, 6, [
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
        [6, 2], [6, 1], [6, 0],
        [5, 0], [4, 0], [3, 0], [2, 0], [2, 1]
    ]),
    "limit": 24,
    "solution": ["F", "F", "A", "F", "F", "L", "F", "F", "A", "L", "F", "F", "A", "F", "F", "L", "F"]
}
campaign.append(lvl40)

# Level 41: Himmlisches Palais (3 Tore + 1 Orb)
# Start: [1, 6, "N"]
# F, F -> (1, 4) Cyan sw, A (opens (3, 4))
# R, F, F -> (3, 4 gate), L, F, F -> (3, 2) Magenta sw, A (opens (5, 2))
# R, F, F -> (5, 2 gate), L, F, F -> (5, 0) Gold sw, A (opens (7, 0))
# R, F, F -> (7, 0 gate) Orb 1, R, F, F -> (7, 2) Goal
lvl41 = {
    "n": "Himmlisches Palais",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Tor & Licht",
    "d": "Das Geisterlicht schwebt hinter dem dritten Tor. Erst nach dem Einsammeln ist das Ziel erreichbar.",
    "w": 8, "h": 7,
    "s": [1, 6, "N"],
    "g": [7, 2],
    "sw": [[1, 4, "cyan"], [3, 2, "magenta"], [5, 0, "gold"]],
    "gates": [[3, 4, "cyan"], [5, 2, "magenta"], [7, 0, "gold"]],
    "orbs": [[7, 0]],
    "walls": create_walls(8, 7, [
        [1, 6], [1, 5], [1, 4],
        [2, 4], [3, 4],
        [3, 3], [3, 2],
        [4, 2], [5, 2],
        [5, 1], [5, 0],
        [6, 0], [7, 0],
        [7, 1], [7, 2]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl41)

# Level 42: Der Aufstieg (Kapitel 06 Finale)
# Start: [0, 6, "E"]
# F, F -> (2, 6) Cyan sw, A (opens (2, 4))
# L, F, F -> (2, 4 gate), R, F, F -> (4, 4) Magenta sw, A (opens (4, 2))
# L, F, F -> (4, 2 gate), R, F, F -> (6, 2) Gold sw, A (opens (6, 0))
# L, F, F -> (6, 0 gate), L, F, F -> (4, 0) Goal
lvl42 = {
    "n": "Der Aufstieg",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Finale",
    "d": "Erklimme die Stufen der Himmelsbrücke und meistere die Dreifach-Schranke mit Bravour.",
    "w": 8, "h": 7,
    "s": [0, 6, "E"],
    "g": [4, 0],
    "sw": [[2, 6, "cyan"], [4, 4, "magenta"], [6, 2, "gold"]],
    "gates": [[2, 4, "cyan"], [4, 2, "magenta"], [6, 0, "gold"]],
    "walls": create_walls(8, 7, [
        [0, 6], [1, 6], [2, 6],
        [2, 5], [2, 4],
        [3, 4], [4, 4],
        [4, 3], [4, 2],
        [5, 2], [6, 2],
        [6, 1], [6, 0],
        [5, 0], [4, 0]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "L", "F", "F", "R", "F", "F", "A", "L", "F", "F", "R", "F", "F", "A", "L", "F", "F", "L", "F", "F"]
}
campaign.append(lvl42)

# -------------------------------------------------------------
# KAPITEL 07 · PALAST DER KAMI (LEVELS 43 BIS 50: MEISTER-LEVEL 👑)
# -------------------------------------------------------------

# Level 43: Das Smaragd-Tor (Einführung Grün / Smaragd)
# Start: [1, 5, "N"]
# F, F -> (1, 3) Green sw, A (opens (1, 1))
# F, F -> (1, 1 gate), R, F, F -> (3, 1) Goal
lvl43 = {
    "n": "Das Smaragd-Tor",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Grün-Tor",
    "d": "Im Palast der Götter leuchtet das smaragdgrüne Tor 🌲. Aktiviere den Jadeschalter.",
    "w": 6, "h": 6,
    "s": [1, 5, "N"],
    "g": [3, 1],
    "sw": [[1, 3, "green"]],
    "gates": [[1, 1, "green"]],
    "walls": create_walls(6, 6, [
        [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [2, 1], [3, 1]
    ]),
    "limit": 10,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F"]
}
campaign.append(lvl43)

# Level 44: Quad-Siegel (Alle 4 Farben: Cyan, Magenta, Gold, Grün)
# Start: [0, 4, "E"]
# F, F -> (2, 4) Cyan sw, A (opens (4, 4))
# F, F -> (4, 4 gate) Magenta sw, A (opens (4, 2))
# L, F, F -> (4, 2 gate) Gold sw, A (opens (2, 2))
# L, F, F -> (2, 2 gate) Green sw, A (opens (2, 0))
# R, F, F -> (2, 0 gate), R, F, F -> (4, 0) Goal
lvl44 = {
    "n": "Quad-Siegel",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Vier Farben",
    "d": "Vier Schreintore: Türkis, Violett, Gold und Smaragdgrün im ehrwürdigen Kreisgang.",
    "w": 7, "h": 6,
    "s": [0, 4, "E"],
    "g": [4, 0],
    "sw": [[2, 4, "cyan"], [4, 4, "magenta"], [4, 2, "gold"], [2, 2, "green"]],
    "gates": [[4, 4, "cyan"], [4, 2, "magenta"], [2, 2, "gold"], [2, 0, "green"]],
    "walls": create_walls(7, 6, [
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
        [4, 3], [4, 2],
        [3, 2], [2, 2],
        [2, 1], [2, 0],
        [3, 0], [4, 0]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "F", "F", "A", "L", "F", "F", "A", "L", "F", "F", "A", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl44)

# Level 45: Das große Schrein-Labyrinth (8x8 mit Portalen & Toren)
# Start: [1, 7, "N"]
# F, F, F -> (1, 4) Cyan sw, A (opens (3, 4))
# R, F, F -> (3, 4 gate) Portal 1 -> teleports to (5, 2) Portal 2 (facing E)
# F, F -> (7, 2) Magenta sw, A (opens (7, 4))
# R, F, F -> (7, 4 gate), R, F, F -> (5, 4) Goal
lvl45 = {
    "n": "Großes Schrein-Labyrinth",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Großes Labyrinth",
    "d": "Ein weitläufiger Schrein mit Portalsprung über die großen Felsspalten.",
    "w": 8, "h": 8,
    "s": [1, 7, "N"],
    "g": [5, 4],
    "sw": [[1, 4, "cyan"], [7, 2, "magenta"]],
    "gates": [[3, 4, "cyan"], [7, 4, "magenta"]],
    "portals": [[3, 4], [5, 2]],
    "walls": create_walls(8, 8, [
        [1, 7], [1, 6], [1, 5], [1, 4],
        [2, 4], [3, 4],
        [5, 2], [6, 2], [7, 2],
        [7, 3], [7, 4],
        [6, 4], [5, 4]
    ]),
    "limit": 22,
    "solution": ["F", "F", "F", "A", "R", "F", "F", "F", "F", "A", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl45)

# Level 46: Kitsunes Meisterstück (Portale + Multi-Tore + Orbs)
# Start: [0, 4, "E"]
# F, F -> (2, 4) Cyan sw, A (opens (4, 4))
# F, F -> (4, 4 gate) Orb 1, R, F, F -> (4, 6) Portal 1 -> teleports to (6, 2) Portal 2 (facing S)
# L, F, F -> (6, 0) Orb 2, L, F, F -> (4, 0) Goal
lvl46 = {
    "n": "Kitsunes Meisterstück",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Meisterstück",
    "d": "Sammle das erste Licht, nimm das Portal und hole das zweite Licht im Oberdeck ab.",
    "w": 8, "h": 8,
    "s": [0, 4, "E"],
    "g": [4, 0],
    "sw": [[2, 4, "cyan"]],
    "gates": [[4, 4, "cyan"]],
    "orbs": [[4, 4], [6, 0]],
    "portals": [[4, 6], [6, 2]],
    "walls": create_walls(8, 8, [
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4],
        [4, 5], [4, 6],
        [6, 2], [6, 1], [6, 0],
        [5, 0], [4, 0]
    ]),
    "limit": 20,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "F", "L", "L", "F", "F", "L", "F", "F"]
}
campaign.append(lvl46)

# Level 47: Weg der Erleuchtung (Schrein der 4 Himmelsrichtungen)
# Start: [1, 7, "N"]
# F, F -> (1, 5) sw Cyan, A (opens (3, 5))
# R, F, F -> (3, 5 gate), L, F, F -> (3, 3) sw Magenta, A (opens (5, 3))
# R, F, F -> (5, 3 gate), L, F, F -> (5, 1) sw Gold, A (opens (7, 1))
# R, F, F -> (7, 1 gate) Orb 1, R, F, F, F -> (7, 4) Goal
lvl47 = {
    "n": "Weg der Erleuchtung",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Erleuchtung",
    "d": "Lange Distanzen und hohe Präzision. Öffne die Tore der drei Himmelswinde.",
    "w": 8, "h": 8,
    "s": [1, 7, "N"],
    "g": [7, 4],
    "sw": [[1, 5, "cyan"], [3, 3, "magenta"], [5, 1, "gold"]],
    "gates": [[3, 5, "cyan"], [5, 3, "magenta"], [7, 1, "gold"]],
    "orbs": [[7, 1]],
    "walls": create_walls(8, 8, [
        [1, 7], [1, 6], [1, 5],
        [2, 5], [3, 5],
        [3, 4], [3, 3],
        [4, 3], [5, 3],
        [5, 2], [5, 1],
        [6, 1], [7, 1],
        [7, 2], [7, 3], [7, 4]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "R", "F", "F", "F"]
}
campaign.append(lvl47)

# Level 48: Tempel der Ewigkeit (Quad-Tore + Portal)
# Start: [0, 5, "E"]
# F, F -> (2, 5) Cyan sw, A (opens (4, 5))
# F, F -> (4, 5 gate) Portal 1 -> teleports to (6, 3) Portal 2 (facing E)
# L, F, F -> (6, 1) Magenta sw, A (opens (4, 1))
# L, F, F -> (4, 1 gate) Green sw, A (opens (2, 1))
# F, F -> (2, 1 gate), L, F, F -> (2, 3) Goal
lvl48 = {
    "n": "Tempel der Ewigkeit",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Ewigkeit",
    "d": "Der Tempel der Ewigkeit prüft deine Geduld. Portale und Mehrfach-Tore im Einklang.",
    "w": 8, "h": 7,
    "s": [0, 5, "E"],
    "g": [2, 3],
    "sw": [[2, 5, "cyan"], [6, 1, "magenta"], [4, 1, "green"]],
    "gates": [[4, 5, "cyan"], [4, 1, "magenta"], [2, 1, "green"]],
    "portals": [[4, 5], [6, 3]],
    "walls": create_walls(8, 7, [
        [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
        [6, 3], [6, 2], [6, 1],
        [5, 1], [4, 1], [3, 1], [2, 1],
        [2, 2], [2, 3]
    ]),
    "limit": 24,
    "solution": ["F", "F", "A", "F", "F", "L", "F", "F", "A", "L", "F", "F", "A", "F", "F", "L", "F", "F"]
}
campaign.append(lvl48)

# Level 49: Das letzte Orakel (Vorletzte Meisterprüfung)
# Start: [1, 7, "N"]
# F, F -> (1, 5) Cyan sw, A (opens (3, 5))
# R, F, F -> (3, 5 gate) Orb 1, L, F, F -> (3, 3) Magenta sw, A (opens (5, 3))
# R, F, F -> (5, 3 gate) Orb 2, L, F, F -> (5, 1) Gold sw, A (opens (7, 1))
# R, F, F -> (7, 1 gate), R, F, F -> (7, 3) Goal
lvl49 = {
    "n": "Das letzte Orakel",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Vorfinale",
    "d": "Das Orakel der Kami verlangt zwei Geisterlichter und drei geöffnete Himmelstore.",
    "w": 8, "h": 8,
    "s": [1, 7, "N"],
    "g": [7, 3],
    "sw": [[1, 5, "cyan"], [3, 3, "magenta"], [5, 1, "gold"]],
    "gates": [[3, 5, "cyan"], [5, 3, "magenta"], [7, 1, "gold"]],
    "orbs": [[3, 5], [5, 3]],
    "walls": create_walls(8, 8, [
        [1, 7], [1, 6], [1, 5],
        [2, 5], [3, 5],
        [3, 4], [3, 3],
        [4, 3], [5, 3],
        [5, 2], [5, 1],
        [6, 1], [7, 1],
        [7, 2], [7, 3]
    ]),
    "limit": 26,
    "solution": ["F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "L", "F", "F", "A", "R", "F", "F", "R", "F", "F"]
}
campaign.append(lvl49)

# Level 50: Die Legende von KOMA (Das ultimative Meister-Finale)
# Start: [0, 6, "E"]
# F, F -> (2, 6) Cyan sw, A (opens (4, 6))
# F, F -> (4, 6 gate) Orb 1, R, F -> (4, 7) Portal 1 -> teleports to (6, 3) Portal 2 (facing S)
# L, F, F -> (6, 1) Magenta sw, A (opens (4, 1))
# L, F, F -> (4, 1 gate) Orb 2, F, F -> (2, 1) Gold sw, A (opens (2, 3))
# L, F, F -> (2, 3 gate), F, F -> (2, 5) Goal
lvl50 = {
    "n": "Die Legende von KOMA",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Meister-Finale",
    "d": "Das große Finale von KOMA: Spirit Delivery! Alle Schreinelemente vereinen sich im Palast der Götter.",
    "w": 8, "h": 8,
    "s": [0, 6, "E"],
    "g": [2, 5],
    "sw": [[2, 6, "cyan"], [6, 1, "magenta"], [2, 1, "gold"]],
    "gates": [[4, 6, "cyan"], [4, 1, "magenta"], [2, 3, "gold"]],
    "orbs": [[4, 6], [4, 1]],
    "portals": [[4, 7], [6, 3]],
    "walls": create_walls(8, 8, [
        [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [4, 7],
        [6, 3], [6, 2], [6, 1],
        [5, 1], [4, 1], [3, 1], [2, 1],
        [2, 2], [2, 3], [2, 4], [2, 5]
    ]),
    "limit": 30,
    "solution": ["F", "F", "A", "F", "F", "R", "F", "L", "L", "F", "F", "A", "L", "F", "F", "F", "F", "A", "L", "F", "F", "F", "F"]
}
campaign.append(lvl50)

print(f"Total levels configured: {len(campaign)}")

# Validate every single level!
all_passed = True
for idx, lvl in enumerate(campaign):
    success, msg = simulate(lvl, lvl["solution"])
    if not success:
        print(f"❌ Level {idx+1} ({lvl['n']}) FAILED: {msg}")
        all_passed = False
    else:
        print(f"✅ Level {idx+1}: {lvl['n']} -> {msg}")

if all_passed:
    print("\n🎉 ALL 50 LEVELS SUCCESSFULLY VALIDATED AND VERIFIED!")
    
    # Generate js/levels.js
    # Strip solutions out of the production game file, or keep them if desired
    # We can keep them or output standard level structure
    output_js = """/**
 * KOMA: Spirit Delivery - 50 Level Campaign
 * Automatically generated and 100% verified for solvability.
 * Includes Colored Torii Gates, Kitsune Portals, and Spirit Lotus Orbs.
 */
const LEVELS = """ + json.dumps(campaign, indent=2, ensure_ascii=False) + """;
"""
    levels_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "js", "levels.js"))
    with open(levels_path, "w", encoding="utf-8") as f:
        f.write(output_js)
    print(f"Saved to {levels_path}")
else:
    print("\n⚠️ Fix errors before writing js/levels.js")
