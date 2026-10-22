/**
 * KOMA: Spirit Delivery - 60 Level Campaign
 * Fully verified for puzzle depth and zero gate/portal bypasses.
 * Features Japanese Garden & Mount Fuji aesthetics: Machiya houses, Pavilions,
 * Bamboo fences, Stone walls, Sculpted pines, Sakura blossoms, Moss meadows,
 * and the Sacred Mount Fuji with snow caps and wind gusts!
 */
const LEVELS = [
  {
    "n": "Die erste Lieferung",
    "c": "Kapitel 01 · Laternenviertel",
    "t": "Tutorial",
    "d": "Fahre zuerst geradeaus durch die Gasse und biege dann nach Süden zum Paket ab. Mit sechs Befehlen kommst du ans Ziel.",
    "w": 5,
    "h": 5,
    "s": [
      0,
      0,
      "E"
    ],
    "g": [
      4,
      1
    ],
    "walls": [
      [
        1,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        3,
        3
      ]
    ],
    "limit": 8,
    "solution": [
      "F",
      "F",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "1,1": "fence_v",
      "1,2": "wall_v",
      "3,2": "wall_v",
      "3,3": "pine"
    },
    "grass": [
      [
        4,
        0
      ],
      [
        2,
        2
      ],
      [
        0,
        4
      ],
      [
        4,
        4
      ]
    ]
  },
  {
    "n": "Um die Ecke",
    "c": "Kapitel 01 · Laternenviertel",
    "t": "Weg finden",
    "d": "Die Mauer versperrt den mittleren Weg. Fahre nach Norden bis zur oberen Gasse und dann nach Osten zum Paket. Du hast genau acht Befehle.",
    "w": 5,
    "h": 5,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      4,
      0
    ],
    "walls": [
      [
        2,
        1
      ],
      [
        2,
        2
      ],
      [
        2,
        3
      ]
    ],
    "limit": 8,
    "solution": [
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "2,1": "wall_v",
      "2,2": "wall_v",
      "2,3": "pine"
    },
    "grass": [
      [
        1,
        0
      ],
      [
        3,
        2
      ],
      [
        0,
        3
      ],
      [
        4,
        3
      ],
      [
        1,
        4
      ]
    ]
  },
  {
    "n": "Das Tor des Schreins",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Schalter",
    "d": "Aktiviere den mintfarbenen Schalter mit ✦. Danach öffnet sich das violette Tor.",
    "w": 6,
    "h": 6,
    "s": [
      5,
      4,
      "W"
    ],
    "g": [
      3,
      0
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        3,
        3
      ]
    ],
    "gate": [
      [
        3,
        1
      ]
    ],
    "limit": 8,
    "solution": [
      "F",
      "F",
      "R",
      "F",
      "A",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "wall_h",
      "0,3": "wall_h",
      "0,4": "pine",
      "0,5": "sakura",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,2": "wall_h",
      "1,3": "pine",
      "1,4": "house",
      "1,5": "fence_h",
      "2,0": "fence_h",
      "2,1": "wall_h",
      "2,2": "wall_h",
      "2,3": "pine",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "3,5": "fence_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,2": "sakura",
      "4,3": "house",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "pine",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,5": "wall_h"
    },
    "grass": []
  },
  {
    "n": "Der brüchige Steg",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Brüchiges Gestein",
    "d": "Die Trittsteine über dem Lotusteich sind alt und brüchig. KOMA kann jeden Stein nur einmal betreten, bevor er im Wasser versinkt.",
    "w": 5,
    "h": 5,
    "s": [
      0,
      1,
      "E"
    ],
    "g": [
      1,
      3
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        4,
        2
      ],
      [
        0,
        3
      ],
      [
        4,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ]
    ],
    "water": [
      [
        1,
        2
      ],
      [
        2,
        2
      ]
    ],
    "fragile": [
      [
        2,
        1
      ],
      [
        2,
        3
      ]
    ],
    "limit": 9,
    "solution": [
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "pine",
      "2,0": "fence_h",
      "3,0": "wall_h",
      "4,0": "sakura",
      "4,1": "wall_v",
      "0,2": "sakura",
      "4,2": "wall_v",
      "0,3": "fence_v",
      "4,3": "pine",
      "0,4": "wall_h",
      "1,4": "fence_h",
      "2,4": "wall_h",
      "3,4": "fence_h",
      "4,4": "wall_h"
    },
    "grass": [
      [
        3,
        1
      ],
      [
        3,
        3
      ]
    ]
  },
  {
    "n": "Der heilige Felsblock",
    "c": "Kapitel 02 · Alter Schrein",
    "t": "Opferblock",
    "d": "Ein schwerer Shinto-Felsblock versperrt den Pfad. Schiebe ihn vor dir her und nutze ihn als Brücke über das Wasser!",
    "w": 5,
    "h": 5,
    "s": [
      1,
      4,
      "E"
    ],
    "g": [
      2,
      0
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        0,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ]
    ],
    "water": [
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ]
    ],
    "blocks": [
      [
        2,
        3
      ]
    ],
    "limit": 7,
    "solution": [
      "F",
      "L",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "sakura",
      "3,0": "pine",
      "4,0": "wall_h",
      "0,1": "wall_v",
      "4,1": "wall_v",
      "0,2": "wall_v",
      "1,2": "fence_h",
      "3,2": "fence_h",
      "4,2": "wall_v",
      "0,3": "wall_v",
      "1,3": "pine",
      "3,3": "sakura",
      "4,3": "wall_v",
      "0,4": "wall_h",
      "3,4": "wall_h",
      "4,4": "wall_h"
    },
    "grass": [
      [
        2,
        4
      ],
      [
        2,
        2
      ]
    ]
  },
  {
    "n": "Laternenlicht",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Route lesen",
    "d": "Der Weg wird länger und führt um mehrere Ecken. Achte auf die Ausrichtung von KOMA nach jeder Drehung.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      5,
      "E"
    ],
    "g": [
      0,
      1
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        2,
        5
      ]
    ],
    "gate": [
      [
        2,
        3
      ]
    ],
    "limit": 11,
    "solution": [
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,2": "wall_h",
      "0,3": "pine",
      "0,4": "fence_h",
      "1,0": "wall_h",
      "1,2": "pine",
      "1,3": "sakura",
      "1,4": "house",
      "2,0": "wall_h",
      "3,0": "wall_h",
      "3,1": "pine",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,1": "fence_h",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "wall_h",
      "5,5": "pine"
    },
    "grass": [
      [
        2,
        1
      ]
    ]
  },
  {
    "n": "Der richtige Moment",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Reihenfolge",
    "d": "Jetzt brauchst du mehrere Richtungswechsel. Der Schalter liegt auf dem einzigen begehbaren Pfad.",
    "w": 6,
    "h": 6,
    "s": [
      3,
      2,
      "N"
    ],
    "g": [
      1,
      2
    ],
    "walls": [
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        2,
        0
      ]
    ],
    "gate": [
      [
        0,
        0
      ]
    ],
    "limit": 12,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,3": "sakura",
      "0,4": "fence_h",
      "0,5": "fence_h",
      "1,1": "wall_h",
      "1,3": "fence_h",
      "1,4": "house",
      "1,5": "fence_h",
      "2,1": "pine",
      "2,2": "sakura",
      "2,3": "fence_h",
      "2,4": "fence_h",
      "2,5": "wall_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,1": "fence_h",
      "5,2": "fence_h",
      "5,3": "wall_h",
      "5,4": "wall_h",
      "5,5": "pine"
    },
    "grass": [
      [
        3,
        1
      ],
      [
        0,
        2
      ]
    ]
  },
  {
    "n": "Geheime Gasse",
    "c": "Kapitel 03 · Geistergarten",
    "t": "Kombination",
    "d": "Ein verwinkelter Weg verlangt vorausschauendes Planen. Öffne das Tor, bevor KOMA es erreicht.",
    "w": 6,
    "h": 6,
    "s": [
      2,
      1,
      "W"
    ],
    "g": [
      3,
      5
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        0,
        1
      ]
    ],
    "gate": [
      [
        0,
        3
      ]
    ],
    "limit": 13,
    "solution": [
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,5": "fence_h",
      "1,0": "wall_h",
      "1,2": "sakura",
      "1,3": "fence_h",
      "1,5": "wall_h",
      "2,0": "wall_h",
      "2,2": "fence_h",
      "2,3": "fence_h",
      "2,5": "wall_h",
      "3,0": "pine",
      "3,1": "sakura",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "4,0": "sakura",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "pine",
      "5,0": "fence_h",
      "5,1": "fence_h",
      "5,2": "fence_h",
      "5,3": "wall_h",
      "5,4": "wall_h",
      "5,5": "sakura"
    },
    "grass": [
      [
        3,
        4
      ]
    ]
  },
  {
    "n": "Fast am Ziel",
    "c": "Kapitel 04 · Neon-Kyoto",
    "t": "Knifflig",
    "d": "Die Route ist länger und hat mehrere Ecken. Ein falsch gesetzter Drehbefehl kann den gesamten Plan stoppen.",
    "w": 6,
    "h": 6,
    "s": [
      5,
      2,
      "N"
    ],
    "g": [
      0,
      5
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        5,
        4
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        4,
        2
      ]
    ],
    "gate": [
      [
        4,
        4
      ]
    ],
    "limit": 14,
    "solution": [
      "F",
      "L",
      "F",
      "L",
      "F",
      "A",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "wall_h",
      "0,2": "sakura",
      "0,3": "fence_h",
      "0,4": "fence_h",
      "1,0": "wall_h",
      "1,1": "pine",
      "1,2": "fence_h",
      "1,3": "fence_h",
      "1,4": "house",
      "2,0": "pine",
      "2,1": "sakura",
      "2,2": "fence_h",
      "2,3": "fence_h",
      "2,4": "wall_h",
      "3,0": "sakura",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "wall_h",
      "4,0": "fence_h",
      "5,0": "fence_h",
      "5,3": "wall_v",
      "5,4": "pine",
      "5,5": "sakura"
    },
    "grass": [
      [
        5,
        1
      ],
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Die letzte Lieferung",
    "c": "Kapitel 04 · Neon-Kyoto",
    "t": "Finale",
    "d": "Die Abschlussmission verbindet eine lange Route, mehrere Drehungen und die richtige Reihenfolge von Schalter und Tor.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      4,
      "N"
    ],
    "g": [
      4,
      5
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        5,
        5
      ]
    ],
    "sw": [
      [
        1,
        3
      ]
    ],
    "gate": [
      [
        1,
        1
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "R",
      "F",
      "A",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "sakura",
      "0,5": "wall_h",
      "1,0": "wall_h",
      "1,4": "house",
      "1,5": "wall_h",
      "2,0": "pine",
      "2,2": "fence_h",
      "2,3": "fence_h",
      "2,4": "wall_h",
      "2,5": "wall_h",
      "3,0": "sakura",
      "3,2": "fence_h",
      "3,3": "wall_h",
      "3,4": "wall_h",
      "3,5": "pine",
      "4,0": "fence_h",
      "5,0": "fence_h",
      "5,1": "fence_v",
      "5,2": "wall_v",
      "5,3": "wall_v",
      "5,4": "pine",
      "5,5": "fence_v"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        0,
        3
      ],
      [
        4,
        3
      ]
    ]
  },
  {
    "n": "Zwei Lichter",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Dual-Tore",
    "d": "Zwei Tore versperren den Schreinpfad. Aktiviere zuerst den türkisen und dann den violetten Schalter.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      4,
      "N"
    ],
    "g": [
      4,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        2,
        2,
        "cyan"
      ],
      [
        3,
        2,
        "cyan"
      ],
      [
        3,
        1,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "A",
      "R",
      "F",
      "F",
      "A",
      "L",
      "F",
      "L",
      "F",
      "R",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "fence_h",
      "0,3": "fence_v",
      "0,4": "fence_v",
      "0,5": "wall_h",
      "1,0": "pine",
      "1,1": "sakura",
      "1,2": "fence_h",
      "1,5": "wall_h",
      "2,0": "sakura",
      "2,4": "wall_h",
      "2,5": "pine",
      "3,0": "fence_h",
      "3,4": "wall_h",
      "3,5": "sakura",
      "4,0": "fence_h",
      "4,2": "wall_h",
      "4,3": "house",
      "4,4": "pine",
      "4,5": "sakura",
      "5,0": "fence_h",
      "5,1": "fence_v",
      "5,2": "wall_h",
      "5,3": "pine",
      "5,4": "sakura",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Gegensätze",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Parallele Gassen",
    "d": "Zwei getrennte Gassen führen zum Schreinteich. Öffne beide Tore, um den Rundweg zu vollenden.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      1,
      "E"
    ],
    "g": [
      5,
      1
    ],
    "sw": [
      [
        2,
        1,
        "cyan"
      ],
      [
        2,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        2,
        2,
        "cyan"
      ],
      [
        4,
        1,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        3,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "F",
      "R",
      "A",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,2": "fence_h",
      "0,3": "fence_h",
      "0,4": "wall_h",
      "0,5": "wall_h",
      "1,0": "sakura",
      "1,2": "fence_h",
      "1,3": "fence_h",
      "1,4": "house",
      "1,5": "wall_h",
      "2,0": "sakura",
      "2,4": "wall_h",
      "2,5": "pine",
      "3,0": "fence_h",
      "3,1": "fence_v",
      "3,2": "fence_v",
      "3,4": "pine",
      "3,5": "sakura",
      "4,0": "fence_h",
      "4,4": "sakura",
      "4,5": "fence_h",
      "5,0": "fence_h",
      "5,2": "wall_v",
      "5,3": "pine",
      "5,4": "fence_h",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Der Schleichweg",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Kaskade",
    "d": "Das erste Tor öffnet den Zugang zum zweiten Schalter. Plane deine Wendungen präzise.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      3,
      5
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        3,
        1,
        "magenta"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,1": "fence_v",
      "0,2": "fence_v",
      "0,3": "fence_v",
      "0,4": "wall_v",
      "0,5": "wall_v",
      "1,0": "sakura",
      "2,0": "fence_h",
      "2,2": "fence_v",
      "2,3": "wall_v",
      "2,4": "wall_v",
      "2,5": "sakura",
      "3,0": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,3": "house",
      "4,4": "sakura",
      "4,5": "fence_h",
      "5,0": "fence_h",
      "5,1": "wall_h",
      "5,2": "wall_h",
      "5,3": "sakura",
      "5,4": "fence_h",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Spiegelgarten",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Symmetrie",
    "d": "Ein symmetrischer Garten mit Flügeln im Osten und Westen. Sammle beide Freigaben ein.",
    "w": 6,
    "h": 6,
    "s": [
      3,
      5,
      "N"
    ],
    "g": [
      3,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        4,
        3,
        "cyan"
      ],
      [
        3,
        2,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 24,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "sakura",
      "0,1": "fence_h",
      "0,2": "fence_h",
      "0,3": "fence_v",
      "0,4": "wall_h",
      "0,5": "pine",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,2": "fence_h",
      "1,4": "house",
      "1,5": "pine",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "2,2": "wall_h",
      "2,4": "pine",
      "2,5": "sakura",
      "3,0": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,4": "fence_h",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "wall_h",
      "5,2": "pine",
      "5,4": "fence_h",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Kreuzende Pfade",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Kreuzung",
    "d": "Die Schrein-Kreuzung erfordert ein geschicktes Vor- und Zurücksetzen der Blickrichtung.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      5,
      4
    ],
    "sw": [
      [
        2,
        0,
        "cyan"
      ],
      [
        4,
        2,
        "magenta"
      ]
    ],
    "gates": [
      [
        3,
        2,
        "cyan"
      ],
      [
        4,
        4,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,0": "sakura",
      "0,1": "fence_h",
      "0,3": "wall_h",
      "0,4": "wall_h",
      "0,5": "pine",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,3": "wall_h",
      "1,4": "house",
      "1,5": "sakura",
      "2,3": "wall_h",
      "2,4": "sakura",
      "2,5": "fence_h",
      "3,0": "fence_h",
      "3,1": "wall_h",
      "3,3": "pine",
      "3,4": "sakura",
      "3,5": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "wall_h",
      "5,2": "pine",
      "5,3": "fence_v",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Laternenparade",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "S-Kurven",
    "d": "Folge der schlangenförmigen Allee und öffne die Tore in den Biegungen.",
    "w": 6,
    "h": 6,
    "s": [
      5,
      5,
      "W"
    ],
    "g": [
      1,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        5,
        1,
        "magenta"
      ]
    ],
    "gates": [
      [
        3,
        3,
        "cyan"
      ],
      [
        3,
        1,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ]
    ],
    "limit": 25,
    "solution": [
      "F",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_v",
      "0,2": "fence_h",
      "0,3": "wall_v",
      "0,4": "wall_v",
      "0,5": "sakura",
      "1,0": "fence_h",
      "1,2": "wall_h",
      "2,0": "fence_h",
      "2,2": "wall_h",
      "2,4": "sakura",
      "3,0": "fence_h",
      "3,2": "wall_h",
      "3,4": "fence_h",
      "4,0": "wall_h",
      "4,2": "pine",
      "4,4": "fence_h",
      "5,0": "wall_h",
      "5,4": "fence_h"
    },
    "grass": [
      [
        4,
        1
      ],
      [
        5,
        2
      ],
      [
        2,
        3
      ],
      [
        4,
        5
      ]
    ]
  },
  {
    "n": "Farben der Nacht",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Schreingarten",
    "d": "Ein weitläufiger 7x7-Garten mit beleuchteten Steinfliesen. Behalte die Himmelsrichtungen im Blick.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      6,
      "N"
    ],
    "g": [
      1,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        3,
        3,
        "cyan"
      ],
      [
        5,
        1,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_v",
      "0,2": "wall_h",
      "0,3": "wall_v",
      "0,4": "pine",
      "0,5": "sakura",
      "0,6": "fence_v",
      "1,0": "fence_h",
      "1,2": "wall_h",
      "2,0": "fence_h",
      "2,2": "wall_h",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "2,6": "fence_h",
      "3,0": "wall_h",
      "3,2": "pine",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,2": "sakura",
      "4,4": "fence_h",
      "4,5": "fence_h",
      "4,6": "wall_h",
      "5,0": "wall_h",
      "5,4": "fence_h",
      "5,5": "wall_h",
      "5,6": "wall_h",
      "6,0": "pine",
      "6,1": "sakura",
      "6,2": "fence_v",
      "6,3": "fence_v",
      "6,4": "wall_h",
      "6,5": "wall_h",
      "6,6": "pine"
    },
    "grass": [
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Das Zwillings-Tor",
    "c": "Kapitel 03 · Neon-Kyoto",
    "t": "Finale",
    "d": "Die beiden heiligen Tore stehen hintereinander. Nutze den Rundweg durch die alten Bambuspfade.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      5,
      "E"
    ],
    "g": [
      6,
      1
    ],
    "sw": [
      [
        2,
        3,
        "cyan"
      ],
      [
        0,
        1,
        "magenta"
      ]
    ],
    "gates": [
      [
        4,
        3,
        "cyan"
      ],
      [
        4,
        1,
        "magenta"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        3,
        1
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 30,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,4": "pine",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,2": "pine",
      "1,4": "house",
      "1,6": "fence_h",
      "2,0": "fence_h",
      "2,6": "fence_h",
      "3,0": "wall_h",
      "3,1": "wall_v",
      "3,2": "pine",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,4": "fence_h",
      "4,5": "wall_h",
      "4,6": "wall_h",
      "5,0": "wall_h",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "fence_h",
      "5,5": "wall_h",
      "5,6": "pine",
      "6,0": "pine",
      "6,2": "fence_h",
      "6,3": "fence_h",
      "6,4": "wall_h",
      "6,5": "wall_h",
      "6,6": "pine"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        0,
        3
      ],
      [
        2,
        5
      ]
    ]
  },
  {
    "n": "Das Portal des Fuchses",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Teleport",
    "d": "Die Kitsune-Schreine nutzen geheime Dimensionstore. Betrete das leuchtende Portal, um weite Strecken zu überspringen.",
    "w": 7,
    "h": 5,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      6,
      2
    ],
    "portals": [
      [
        2,
        2
      ],
      [
        4,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        3,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ]
    ],
    "limit": 6,
    "solution": [
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,3": "pine",
      "0,4": "sakura",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,3": "sakura",
      "1,4": "fence_h",
      "2,0": "wall_h",
      "2,1": "wall_h",
      "2,3": "sakura",
      "2,4": "fence_h",
      "3,0": "wall_h",
      "3,1": "pine",
      "3,2": "sakura",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,3": "house",
      "4,4": "fence_h",
      "5,0": "pine",
      "5,1": "sakura",
      "5,3": "fence_h",
      "5,4": "wall_h",
      "6,0": "sakura",
      "6,1": "fence_h",
      "6,3": "fence_h",
      "6,4": "wall_h"
    },
    "grass": []
  },
  {
    "n": "Über die Mauer",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Mauer-Sprung",
    "d": "Eine dichte Steinmauer trennt die Gartenbereiche. Nutze das Portal, um direkt auf die andere Seite zu beamen.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      4,
      "N"
    ],
    "g": [
      4,
      4
    ],
    "portals": [
      [
        1,
        2
      ],
      [
        4,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 8,
    "solution": [
      "F",
      "F",
      "R",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_h",
      "0,2": "wall_v",
      "0,3": "pine",
      "0,4": "fence_v",
      "0,5": "fence_h",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,5": "fence_h",
      "2,0": "wall_h",
      "2,1": "wall_h",
      "2,2": "sakura",
      "2,3": "fence_h",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "3,0": "wall_h",
      "3,1": "pine",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,1": "fence_h",
      "5,2": "fence_v",
      "5,3": "fence_v",
      "5,4": "wall_v",
      "5,5": "wall_h"
    },
    "grass": []
  },
  {
    "n": "Schritt ins Blaue",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Hin & Zurück",
    "d": "Der Schalter liegt auf einer isolierten Insel. Springe durch das Portal, aktiviere ihn und kehre zurück.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      3,
      0
    ],
    "portals": [
      [
        1,
        2
      ],
      [
        4,
        2
      ]
    ],
    "sw": [
      [
        5,
        2,
        "cyan"
      ]
    ],
    "gates": [
      [
        1,
        0,
        "cyan"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "F",
      "F",
      "R",
      "F",
      "A",
      "L",
      "L",
      "F",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_v",
      "0,1": "wall_v",
      "0,2": "wall_v",
      "0,3": "sakura",
      "0,4": "fence_v",
      "0,5": "fence_v",
      "2,1": "pine",
      "2,2": "sakura",
      "2,3": "fence_h",
      "2,4": "fence_h",
      "2,5": "wall_h",
      "3,1": "sakura",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,1": "fence_h",
      "5,3": "wall_h",
      "5,4": "wall_h",
      "5,5": "pine"
    },
    "grass": [
      [
        1,
        1
      ]
    ]
  },
  {
    "n": "Dimensions-Sprung",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Wasser-Inseln",
    "d": "Das Schreinbecken ist unpassierbar. Teleportiere auf die Nordinsel und erreiche das Ziel-Torii.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      4,
      "E"
    ],
    "g": [
      3,
      1
    ],
    "sw": [
      [
        2,
        4,
        "cyan"
      ]
    ],
    "gates": [
      [
        4,
        1,
        "cyan"
      ]
    ],
    "portals": [
      [
        2,
        2
      ],
      [
        5,
        4
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "wall_h",
      "0,2": "pine",
      "0,3": "sakura",
      "0,5": "fence_h",
      "1,0": "wall_h",
      "1,1": "pine",
      "1,2": "sakura",
      "1,3": "fence_h",
      "1,5": "fence_h",
      "2,0": "wall_h",
      "2,1": "pine",
      "2,5": "wall_h",
      "3,0": "pine",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "wall_h",
      "3,5": "wall_h",
      "4,0": "sakura",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "pine",
      "5,0": "fence_h",
      "5,5": "pine"
    },
    "grass": [
      [
        1,
        4
      ]
    ]
  },
  {
    "n": "Raumkrümmung",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Portal-Netz",
    "d": "Das Portal verbindet zwei diagonale Kammern des Gartens. Nutze die Raumkrümmung geschickt aus.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      5,
      "E"
    ],
    "g": [
      1,
      3
    ],
    "sw": [
      [
        3,
        1,
        "cyan"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "cyan"
      ]
    ],
    "portals": [
      [
        3,
        3
      ],
      [
        5,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "wall_v",
      "0,2": "sakura",
      "0,3": "fence_v",
      "0,4": "fence_h",
      "0,5": "fence_v",
      "0,6": "wall_h",
      "1,0": "wall_h",
      "1,4": "house",
      "1,6": "wall_h",
      "2,0": "pine",
      "2,2": "fence_h",
      "2,3": "fence_v",
      "2,4": "fence_h",
      "2,6": "pine",
      "3,0": "pine",
      "3,2": "fence_h",
      "3,6": "sakura",
      "4,0": "sakura",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "pine",
      "4,6": "fence_h",
      "5,0": "fence_h",
      "5,2": "fence_h",
      "5,3": "wall_h",
      "5,4": "pine",
      "5,5": "sakura",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,1": "fence_v",
      "6,2": "wall_h",
      "6,3": "wall_h",
      "6,4": "sakura",
      "6,5": "fence_h",
      "6,6": "fence_h"
    },
    "grass": [
      [
        3,
        5
      ]
    ]
  },
  {
    "n": "Der verschlungene Hof",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Portal & Dual-Tore",
    "d": "Das Portal führt direkt in den abgeschlossenen Innenhof mit dem zweiten Schalter.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      5,
      "N"
    ],
    "g": [
      6,
      5
    ],
    "sw": [
      [
        0,
        3,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        2,
        3,
        "cyan"
      ],
      [
        5,
        5,
        "magenta"
      ]
    ],
    "portals": [
      [
        3,
        3
      ],
      [
        5,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "sakura",
      "0,6": "wall_h",
      "1,0": "wall_h",
      "1,1": "sakura",
      "1,2": "fence_h",
      "1,4": "house",
      "1,5": "wall_h",
      "1,6": "wall_h",
      "2,0": "pine",
      "2,1": "fence_h",
      "2,2": "fence_h",
      "2,4": "wall_h",
      "2,5": "wall_h",
      "2,6": "pine",
      "3,0": "sakura",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,4": "wall_h",
      "3,5": "pavilion",
      "3,6": "sakura",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "sakura",
      "4,6": "fence_h",
      "5,0": "fence_h",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,1": "fence_v",
      "6,2": "wall_v",
      "6,3": "pine",
      "6,4": "sakura",
      "6,6": "fence_h"
    },
    "grass": [
      [
        5,
        2
      ]
    ]
  },
  {
    "n": "Kitsunes Irrgarten",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Labyrinth",
    "d": "Die Wände stehen eng. Das Portal ist der einzige Weg, um die versperrte Gasse zu umgehen.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      6,
      "N"
    ],
    "g": [
      6,
      1
    ],
    "sw": [
      [
        4,
        3,
        "cyan"
      ]
    ],
    "gates": [
      [
        5,
        1,
        "cyan"
      ]
    ],
    "portals": [
      [
        2,
        3
      ],
      [
        5,
        5
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        3,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "F",
      "R",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F",
      "L",
      "L",
      "A",
      "F",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "fence_h",
      "0,3": "fence_v",
      "0,4": "fence_v",
      "0,5": "wall_v",
      "0,6": "wall_v",
      "1,0": "pine",
      "1,1": "sakura",
      "1,2": "fence_h",
      "2,0": "sakura",
      "2,1": "fence_h",
      "2,2": "fence_h",
      "2,4": "wall_h",
      "2,5": "pine",
      "2,6": "sakura",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,3": "wall_v",
      "3,4": "wall_h",
      "3,5": "pavilion",
      "3,6": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,4": "pine",
      "4,5": "sakura",
      "4,6": "fence_h",
      "5,0": "fence_h",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,2": "wall_v",
      "6,3": "pine",
      "6,4": "fence_v",
      "6,5": "fence_v",
      "6,6": "fence_h"
    },
    "grass": [
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Sprung ins Torii",
    "c": "Kapitel 04 · Kitsune-Garten",
    "t": "Finale",
    "d": "Das Meisterstück der Kitsune-Geister: Öffne beide Schranken, bevor du das Portal betrittst.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      3,
      "E"
    ],
    "g": [
      6,
      5
    ],
    "sw": [
      [
        2,
        3,
        "cyan"
      ],
      [
        2,
        1,
        "magenta"
      ]
    ],
    "gates": [
      [
        4,
        4,
        "magenta"
      ],
      [
        5,
        5,
        "cyan"
      ]
    ],
    "portals": [
      [
        2,
        5
      ],
      [
        4,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        3,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,1": "sakura",
      "0,2": "fence_h",
      "0,4": "fence_h",
      "0,5": "wall_h",
      "0,6": "pine",
      "1,0": "pine",
      "1,1": "fence_h",
      "1,2": "fence_h",
      "1,4": "house",
      "1,5": "wall_h",
      "1,6": "sakura",
      "2,0": "sakura",
      "2,6": "sakura",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,3": "wall_v",
      "3,4": "pine",
      "3,5": "pavilion",
      "3,6": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,6": "fence_h",
      "5,0": "fence_h",
      "5,1": "wall_h",
      "5,2": "wall_h",
      "5,3": "pine",
      "5,4": "sakura",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,1": "wall_h",
      "6,2": "pine",
      "6,3": "sakura",
      "6,4": "fence_h",
      "6,6": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Das verlorene Licht",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Geisterlicht",
    "d": "Sammle das schwebende Geisterlicht 🌸 ein, um das heilige Zieltor zu aktivieren.",
    "w": 5,
    "h": 5,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      4,
      2
    ],
    "orbs": [
      [
        2,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ]
    ],
    "limit": 6,
    "solution": [
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,1": "sakura",
      "0,3": "fence_h",
      "0,4": "wall_h",
      "1,0": "sakura",
      "1,1": "fence_h",
      "1,3": "fence_h",
      "1,4": "wall_h",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "2,3": "wall_h",
      "2,4": "wall_h",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,3": "wall_h",
      "3,4": "pine",
      "4,0": "fence_h",
      "4,1": "fence_h",
      "4,3": "pine",
      "4,4": "sakura"
    },
    "grass": []
  },
  {
    "n": "Zwei Opfergaben",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Zwei Lichter",
    "d": "Ein plötzlicher Bergwindstoß im Bambuswald trägt KOMA nach Norden! Sammle beide Opfergaben links und rechts.",
    "w": 5,
    "h": 5,
    "s": [
      2,
      4,
      "N"
    ],
    "g": [
      4,
      0
    ],
    "orbs": [
      [
        0,
        2
      ],
      [
        4,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ]
    ],
    "limit": 15,
    "solution": [
      "F",
      "L",
      "F",
      "F",
      "L",
      "L",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "sakura",
      "0,1": "fence_h",
      "0,3": "fence_h",
      "0,4": "wall_h",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,3": "wall_h",
      "1,4": "wall_h",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,3": "wall_h",
      "3,4": "sakura",
      "4,3": "pine",
      "4,4": "fence_h"
    },
    "grass": [
      [
        4,
        1
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ]
    ],
    "winds": [
      [
        2,
        3,
        "N"
      ]
    ]
  },
  {
    "n": "Schrein der Ahnen",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Tor & Licht",
    "d": "Das Zieltor verlangt beides: die Schalter-Freigabe und das eingesammelte Geisterlicht.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      5,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "cyan"
      ]
    ],
    "orbs": [
      [
        3,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 14,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "sakura",
      "0,1": "fence_v",
      "0,2": "fence_v",
      "0,3": "wall_v",
      "0,4": "wall_v",
      "0,5": "pine",
      "1,0": "fence_h",
      "2,0": "fence_h",
      "2,2": "wall_h",
      "2,3": "wall_h",
      "2,4": "pine",
      "2,5": "fence_h",
      "3,0": "fence_h",
      "3,2": "wall_h",
      "3,3": "pine",
      "3,4": "sakura",
      "3,5": "fence_h",
      "4,0": "fence_h",
      "4,2": "wall_h",
      "4,3": "house",
      "4,4": "fence_h",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,2": "pine",
      "5,3": "fence_h",
      "5,4": "fence_h",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Glühwürmchen-Garten",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Glühwürmchen",
    "d": "Die Lichter fliegen zwischen den Schreinteichen. Sammle beide ein, bevor du das Tor durchquerst.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      4,
      "N"
    ],
    "g": [
      5,
      4
    ],
    "sw": [
      [
        2,
        2,
        "cyan"
      ]
    ],
    "gates": [
      [
        4,
        2,
        "cyan"
      ]
    ],
    "orbs": [
      [
        0,
        2
      ],
      [
        4,
        4
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        5,
        2
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,5": "sakura",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,3": "wall_h",
      "1,4": "house",
      "1,5": "sakura",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "2,3": "pine",
      "2,4": "sakura",
      "2,5": "fence_h",
      "3,0": "fence_h",
      "3,1": "wall_h",
      "3,3": "pine",
      "3,4": "fence_h",
      "3,5": "fence_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "pine",
      "5,2": "sakura",
      "5,3": "fence_v",
      "5,5": "fence_h"
    },
    "grass": [
      [
        3,
        2
      ],
      [
        0,
        3
      ],
      [
        4,
        3
      ]
    ]
  },
  {
    "n": "Das heilige Becken",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Umfahrung",
    "d": "Ein kreisförmiger Weg um das Wasser. Sammle die schwebenden Lichter an den gegenüberliegenden Ecken.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      5,
      5
    ],
    "orbs": [
      [
        1,
        1
      ],
      [
        5,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 16,
    "solution": [
      "F",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_v",
      "0,2": "fence_v",
      "0,3": "wall_v",
      "0,4": "pine",
      "0,5": "sakura",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,6": "fence_h",
      "2,0": "fence_h",
      "2,2": "wall_h",
      "2,3": "pine",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "2,6": "fence_h",
      "3,0": "fence_h",
      "3,2": "pine",
      "3,3": "sakura",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,2": "sakura",
      "4,3": "house",
      "4,4": "fence_h",
      "4,5": "fence_h",
      "4,6": "wall_h",
      "5,0": "wall_h",
      "5,6": "wall_h",
      "6,0": "pine",
      "6,1": "sakura",
      "6,2": "fence_v",
      "6,3": "fence_v",
      "6,4": "fence_v",
      "6,5": "wall_v",
      "6,6": "pine"
    },
    "grass": [
      [
        3,
        1
      ],
      [
        1,
        3
      ],
      [
        5,
        3
      ]
    ]
  },
  {
    "n": "Geisterpfad",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Portal & Licht",
    "d": "Das erste Licht liegt vor dem Portal, das zweite wartet auf der anderen Seite des Gartens.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      5,
      5
    ],
    "portals": [
      [
        1,
        1
      ],
      [
        5,
        1
      ]
    ],
    "orbs": [
      [
        1,
        3
      ],
      [
        5,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 14,
    "solution": [
      "F",
      "F",
      "F",
      "F",
      "R",
      "R",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_v",
      "0,2": "wall_v",
      "0,3": "wall_v",
      "0,4": "pine",
      "0,5": "fence_v",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,6": "fence_h",
      "2,0": "fence_h",
      "2,1": "wall_h",
      "2,2": "wall_h",
      "2,3": "sakura",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "2,6": "fence_h",
      "3,0": "wall_h",
      "3,1": "wall_h",
      "3,2": "pine",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,2": "sakura",
      "4,3": "house",
      "4,4": "fence_h",
      "4,5": "wall_h",
      "4,6": "wall_h",
      "5,0": "wall_h",
      "5,6": "wall_h",
      "6,0": "pine",
      "6,1": "fence_v",
      "6,2": "fence_v",
      "6,3": "fence_v",
      "6,4": "wall_v",
      "6,5": "wall_v",
      "6,6": "pine"
    },
    "grass": [
      [
        1,
        2
      ],
      [
        5,
        2
      ]
    ]
  },
  {
    "n": "Der stille Bambus",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Kombination",
    "d": "Verknüpfe Schalter-Aktivierung und das Einsammeln der Geisteropfer in einem flüssigen Plan.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      5,
      "N"
    ],
    "g": [
      6,
      1
    ],
    "sw": [
      [
        0,
        3,
        "cyan"
      ],
      [
        4,
        3,
        "magenta"
      ]
    ],
    "gates": [
      [
        2,
        3,
        "cyan"
      ],
      [
        4,
        1,
        "magenta"
      ]
    ],
    "orbs": [
      [
        2,
        3
      ],
      [
        4,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "wall_h",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,2": "wall_h",
      "1,4": "house",
      "1,5": "fence_h",
      "1,6": "fence_h",
      "2,0": "wall_h",
      "2,1": "wall_h",
      "2,2": "pine",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "2,6": "wall_h",
      "3,0": "wall_h",
      "3,1": "wall_h",
      "3,2": "sakura",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,4": "fence_h",
      "4,5": "wall_h",
      "4,6": "wall_h",
      "5,0": "pine",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "wall_h",
      "5,5": "wall_h",
      "5,6": "pine",
      "6,0": "sakura",
      "6,2": "fence_h",
      "6,3": "fence_h",
      "6,4": "wall_h",
      "6,5": "pine",
      "6,6": "sakura"
    },
    "grass": [
      [
        5,
        1
      ],
      [
        3,
        3
      ],
      [
        0,
        4
      ]
    ]
  },
  {
    "n": "Laternenfest",
    "c": "Kapitel 05 · Bambuswald",
    "t": "Drei Lichter",
    "d": "Zum Abschluss des Geisterwaldes leuchten drei magische Lichter. Plane den optimalen Sammelpfad.",
    "w": 7,
    "h": 7,
    "s": [
      3,
      5,
      "N"
    ],
    "g": [
      5,
      1
    ],
    "orbs": [
      [
        3,
        3
      ],
      [
        1,
        3
      ],
      [
        5,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 18,
    "solution": [
      "F",
      "F",
      "L",
      "F",
      "F",
      "R",
      "R",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_h",
      "0,2": "wall_h",
      "0,3": "pine",
      "0,4": "sakura",
      "0,5": "fence_h",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,2": "pine",
      "1,4": "house",
      "1,5": "fence_h",
      "1,6": "fence_h",
      "2,0": "wall_h",
      "2,1": "wall_h",
      "2,2": "pine",
      "2,4": "fence_h",
      "2,5": "fence_h",
      "2,6": "wall_h",
      "3,0": "wall_h",
      "3,1": "pine",
      "3,2": "sakura",
      "3,6": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "fence_h",
      "4,5": "wall_h",
      "4,6": "pine",
      "5,0": "pine",
      "5,4": "wall_h",
      "5,5": "wall_h",
      "5,6": "sakura",
      "6,0": "sakura",
      "6,1": "fence_v",
      "6,2": "fence_v",
      "6,3": "wall_v",
      "6,4": "wall_h",
      "6,5": "pine",
      "6,6": "sakura"
    },
    "grass": [
      [
        4,
        3
      ]
    ]
  },
  {
    "n": "Die dritte Flamme",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Gold-Tor",
    "d": "Das goldene Torii-Tor ☀️ erstrahlt in Sonnenlicht. Aktiviere den goldenen Schalter zur Durchfahrt.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      3,
      1
    ],
    "sw": [
      [
        1,
        3,
        "gold"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 10,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_v",
      "0,2": "wall_v",
      "0,3": "sakura",
      "0,4": "fence_v",
      "0,5": "fence_v",
      "1,0": "wall_h",
      "2,0": "wall_h",
      "2,2": "sakura",
      "2,3": "fence_h",
      "2,4": "fence_h",
      "2,5": "wall_h",
      "3,0": "wall_h",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "wall_h",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,1": "fence_h",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "wall_h",
      "5,5": "pine"
    },
    "grass": []
  },
  {
    "n": "Triade der Geister",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Dreifach-Tor",
    "d": "Zwischen den Laternen pfeift eine Windböe nach Osten. Plane deinen Weg genau, um die drei Geisterschalter zu aktivieren.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      5,
      "N"
    ],
    "g": [
      6,
      1
    ],
    "sw": [
      [
        0,
        3,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ],
      [
        5,
        3,
        "gold"
      ]
    ],
    "gates": [
      [
        2,
        3,
        "cyan"
      ],
      [
        4,
        3,
        "magenta"
      ],
      [
        5,
        1,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        6,
        3
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 17,
    "solution": [
      "F",
      "F",
      "R",
      "A",
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "wall_h",
      "0,2": "pine",
      "0,6": "wall_h",
      "1,0": "wall_h",
      "1,1": "wall_h",
      "1,2": "sakura",
      "1,4": "house",
      "1,5": "fence_h",
      "1,6": "wall_h",
      "2,0": "wall_h",
      "2,1": "pine",
      "2,2": "fence_h",
      "2,4": "fence_h",
      "2,5": "wall_h",
      "2,6": "wall_h",
      "3,0": "pine",
      "3,1": "sakura",
      "3,2": "fence_h",
      "3,4": "wall_h",
      "3,5": "pavilion",
      "3,6": "pine",
      "4,0": "sakura",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "4,6": "sakura",
      "5,0": "fence_h",
      "5,4": "wall_h",
      "5,5": "pine",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,2": "wall_v",
      "6,3": "wall_v",
      "6,4": "pine",
      "6,5": "sakura",
      "6,6": "fence_h"
    },
    "grass": [
      [
        5,
        2
      ]
    ],
    "winds": [
      [
        2,
        3,
        "E"
      ]
    ]
  },
  {
    "n": "Goldener Sonnenaufgang",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Brückenbogen",
    "d": "Der goldene Schalter liegt am östlichen Aussichtspunkt der Himmelsbrücke.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      6,
      "N"
    ],
    "g": [
      1,
      1
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        5,
        3,
        "gold"
      ]
    ],
    "gates": [
      [
        3,
        3,
        "cyan"
      ],
      [
        3,
        1,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 20,
    "solution": [
      "F",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "wall_v",
      "0,2": "pine",
      "0,3": "fence_v",
      "0,4": "fence_v",
      "0,5": "fence_v",
      "0,6": "wall_v",
      "1,0": "wall_h",
      "1,2": "sakura",
      "2,0": "wall_h",
      "2,2": "fence_h",
      "2,4": "fence_h",
      "2,5": "wall_h",
      "2,6": "pine",
      "3,0": "pine",
      "3,2": "fence_h",
      "3,4": "wall_h",
      "3,5": "pavilion",
      "3,6": "pine",
      "4,0": "sakura",
      "4,2": "fence_h",
      "4,4": "wall_h",
      "4,5": "pine",
      "4,6": "sakura",
      "5,0": "fence_h",
      "5,4": "pine",
      "5,5": "sakura",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,1": "fence_v",
      "6,2": "wall_v",
      "6,3": "wall_v",
      "6,4": "pine",
      "6,5": "fence_h",
      "6,6": "fence_h"
    },
    "grass": [
      [
        5,
        1
      ],
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Die drei Siegel",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Kaskade 3x",
    "d": "Jeder Schalter öffnet das Tor zur nächsten Kammer. Eine meisterhafte Kaskaden-Prüfung.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      6,
      5
    ],
    "sw": [
      [
        1,
        3,
        "cyan"
      ],
      [
        3,
        1,
        "magenta"
      ],
      [
        5,
        3,
        "gold"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ],
      [
        5,
        5,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "limit": 24,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "sakura",
      "0,3": "fence_v",
      "0,4": "fence_v",
      "0,5": "fence_v",
      "0,6": "wall_h",
      "1,0": "wall_h",
      "1,6": "wall_h",
      "2,0": "pine",
      "2,2": "fence_v",
      "2,3": "fence_v",
      "2,4": "wall_h",
      "2,5": "wall_h",
      "2,6": "pine",
      "3,0": "sakura",
      "3,4": "wall_h",
      "3,5": "pavilion",
      "3,6": "sakura",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "wall_h",
      "4,5": "sakura",
      "4,6": "fence_h",
      "5,0": "fence_h",
      "5,1": "fence_h",
      "5,2": "wall_h",
      "5,6": "fence_h",
      "6,0": "fence_h",
      "6,1": "fence_h",
      "6,2": "wall_h",
      "6,3": "pine",
      "6,4": "sakura",
      "6,6": "fence_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        3,
        2
      ],
      [
        4,
        3
      ],
      [
        1,
        4
      ],
      [
        5,
        4
      ]
    ]
  },
  {
    "n": "Brücke der drei Winde",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Große Brücke",
    "d": "Die Himmelsbrücke spannt sich über das 8x8-Tal. Überwinde alle drei Farbsiegel.",
    "w": 8,
    "h": 8,
    "s": [
      1,
      7,
      "N"
    ],
    "g": [
      7,
      2
    ],
    "sw": [
      [
        1,
        5,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ],
      [
        5,
        1,
        "gold"
      ]
    ],
    "gates": [
      [
        3,
        5,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ],
      [
        7,
        1,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "pine",
      "0,2": "fence_h",
      "0,3": "fence_h",
      "0,4": "fence_h",
      "0,5": "wall_v",
      "0,6": "wall_v",
      "0,7": "pine",
      "1,0": "pine",
      "1,1": "sakura",
      "1,2": "fence_h",
      "1,3": "fence_h",
      "1,4": "house",
      "2,0": "sakura",
      "2,1": "fence_h",
      "2,2": "fence_h",
      "2,3": "fence_h",
      "2,4": "wall_h",
      "2,6": "sakura",
      "2,7": "fence_h",
      "3,0": "sakura",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,6": "fence_h",
      "3,7": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "pine",
      "4,5": "sakura",
      "4,6": "fence_h",
      "4,7": "fence_h",
      "5,0": "fence_h",
      "5,4": "sakura",
      "5,5": "fence_h",
      "5,6": "fence_h",
      "5,7": "fence_h",
      "6,0": "fence_h",
      "6,2": "wall_v",
      "6,3": "pine",
      "6,4": "fence_h",
      "6,5": "fence_h",
      "6,6": "fence_h",
      "6,7": "wall_h",
      "7,0": "fence_h",
      "7,3": "sakura",
      "7,4": "fence_h",
      "7,5": "fence_h",
      "7,6": "wall_h",
      "7,7": "wall_h"
    },
    "grass": []
  },
  {
    "n": "Prüfung der Elemente",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Portale & 3 Tore",
    "d": "Kombination aus Portalsprung und drei farbigen Toren auf der oberen Plattform.",
    "w": 8,
    "h": 6,
    "s": [
      0,
      4,
      "E"
    ],
    "g": [
      2,
      1
    ],
    "sw": [
      [
        2,
        4,
        "cyan"
      ],
      [
        6,
        0,
        "magenta"
      ],
      [
        4,
        0,
        "gold"
      ]
    ],
    "gates": [
      [
        4,
        4,
        "cyan"
      ],
      [
        4,
        0,
        "magenta"
      ],
      [
        2,
        0,
        "gold"
      ]
    ],
    "portals": [
      [
        4,
        4
      ],
      [
        6,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ]
    ],
    "limit": 24,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F"
    ],
    "obstacles": {
      "0,0": "wall_h",
      "0,1": "sakura",
      "0,2": "fence_h",
      "0,3": "fence_h",
      "0,5": "wall_h",
      "1,0": "pine",
      "1,1": "fence_h",
      "1,2": "fence_h",
      "1,3": "fence_h",
      "1,5": "wall_h",
      "2,2": "fence_h",
      "2,3": "wall_h",
      "2,5": "pine",
      "3,1": "fence_h",
      "3,2": "fence_h",
      "3,3": "wall_h",
      "3,5": "sakura",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,3": "house",
      "4,5": "fence_h",
      "5,1": "wall_h",
      "5,2": "wall_h",
      "5,3": "pine",
      "5,4": "sakura",
      "5,5": "fence_h",
      "6,3": "sakura",
      "6,4": "fence_h",
      "6,5": "fence_h",
      "7,0": "wall_v",
      "7,1": "wall_v",
      "7,2": "pine",
      "7,3": "fence_h",
      "7,4": "fence_h",
      "7,5": "fence_h"
    },
    "grass": [
      [
        3,
        0
      ],
      [
        3,
        4
      ]
    ]
  },
  {
    "n": "Himmlisches Palais",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Tor & Licht",
    "d": "Das Geisterlicht schwebt hinter dem dritten Tor. Erst nach dem Einsammeln ist das Ziel erreichbar.",
    "w": 8,
    "h": 7,
    "s": [
      1,
      6,
      "N"
    ],
    "g": [
      7,
      2
    ],
    "sw": [
      [
        1,
        4,
        "cyan"
      ],
      [
        3,
        2,
        "magenta"
      ],
      [
        5,
        0,
        "gold"
      ]
    ],
    "gates": [
      [
        3,
        4,
        "cyan"
      ],
      [
        5,
        2,
        "magenta"
      ],
      [
        7,
        0,
        "gold"
      ]
    ],
    "orbs": [
      [
        7,
        0
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,1": "sakura",
      "0,2": "fence_h",
      "0,3": "fence_h",
      "0,4": "wall_v",
      "0,5": "wall_v",
      "0,6": "pine",
      "1,0": "sakura",
      "1,1": "fence_h",
      "1,2": "fence_h",
      "1,3": "fence_h",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "2,2": "fence_h",
      "2,3": "wall_h",
      "2,5": "pine",
      "2,6": "fence_h",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,5": "pavilion",
      "3,6": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,3": "house",
      "4,4": "sakura",
      "4,5": "fence_h",
      "4,6": "fence_h",
      "5,3": "pine",
      "5,4": "fence_h",
      "5,5": "fence_h",
      "5,6": "fence_h",
      "6,1": "wall_v",
      "6,2": "pine",
      "6,3": "sakura",
      "6,4": "fence_h",
      "6,5": "fence_h",
      "6,6": "wall_h",
      "7,3": "fence_h",
      "7,4": "fence_h",
      "7,5": "fence_h",
      "7,6": "wall_h"
    },
    "grass": [
      [
        5,
        1
      ],
      [
        3,
        3
      ],
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Der Aufstieg",
    "c": "Kapitel 06 · Himmelsbrücke",
    "t": "Finale",
    "d": "Erklimme die Stufen der Himmelsbrücke und meistere die Dreifach-Schranke mit Bravour.",
    "w": 8,
    "h": 7,
    "s": [
      0,
      6,
      "E"
    ],
    "g": [
      4,
      0
    ],
    "sw": [
      [
        2,
        6,
        "cyan"
      ],
      [
        4,
        4,
        "magenta"
      ],
      [
        6,
        2,
        "gold"
      ]
    ],
    "gates": [
      [
        2,
        4,
        "cyan"
      ],
      [
        4,
        2,
        "magenta"
      ],
      [
        6,
        0,
        "gold"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "pine",
      "0,1": "fence_h",
      "0,2": "fence_h",
      "0,3": "fence_h",
      "0,4": "wall_h",
      "0,5": "wall_h",
      "1,0": "sakura",
      "1,1": "fence_h",
      "1,2": "fence_h",
      "1,3": "wall_h",
      "1,4": "house",
      "1,5": "pine",
      "2,0": "fence_h",
      "2,1": "fence_h",
      "2,2": "fence_h",
      "2,3": "wall_h",
      "3,0": "fence_h",
      "3,1": "fence_h",
      "3,2": "wall_h",
      "3,3": "wall_h",
      "3,5": "pavilion",
      "3,6": "fence_h",
      "4,1": "pavilion",
      "4,5": "fence_h",
      "4,6": "fence_h",
      "5,1": "wall_h",
      "5,3": "sakura",
      "5,4": "fence_h",
      "5,5": "fence_h",
      "5,6": "fence_h",
      "6,3": "fence_h",
      "6,4": "fence_h",
      "6,5": "fence_h",
      "6,6": "wall_h",
      "7,0": "wall_v",
      "7,1": "pine",
      "7,2": "sakura",
      "7,3": "fence_h",
      "7,4": "fence_h",
      "7,5": "wall_h",
      "7,6": "wall_h"
    },
    "grass": [
      [
        5,
        0
      ],
      [
        6,
        1
      ],
      [
        4,
        3
      ],
      [
        2,
        5
      ]
    ]
  },
  {
    "n": "Das Smaragd-Tor",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Grün-Tor",
    "d": "Im Palast der Götter leuchtet das smaragdgrüne Tor 🌲. Aktiviere den Jadeschalter.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      3,
      1
    ],
    "sw": [
      [
        1,
        3,
        "green"
      ]
    ],
    "gates": [
      [
        1,
        1,
        "green"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "limit": 10,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "sakura",
      "0,1": "fence_v",
      "0,2": "fence_v",
      "0,3": "wall_v",
      "0,4": "wall_v",
      "0,5": "pine",
      "1,0": "fence_h",
      "2,0": "fence_h",
      "2,2": "wall_h",
      "2,3": "wall_h",
      "2,4": "pine",
      "2,5": "fence_h",
      "3,0": "fence_h",
      "3,2": "wall_h",
      "3,3": "pine",
      "3,4": "sakura",
      "3,5": "fence_h",
      "4,0": "fence_h",
      "4,1": "pavilion",
      "4,2": "wall_h",
      "4,3": "house",
      "4,4": "fence_h",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "wall_h",
      "5,2": "pine",
      "5,3": "fence_h",
      "5,4": "fence_h",
      "5,5": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Quad-Siegel",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Vier Farben",
    "d": "Vier Schalter, vier Siegel – und ein mächtiger Aufwind im Innenhof, der deinen Plan beschleunigt oder durchkreuzt!",
    "w": 7,
    "h": 6,
    "s": [
      0,
      4,
      "E"
    ],
    "g": [
      4,
      0
    ],
    "sw": [
      [
        2,
        4,
        "cyan"
      ],
      [
        4,
        4,
        "magenta"
      ],
      [
        4,
        2,
        "gold"
      ],
      [
        2,
        2,
        "green"
      ]
    ],
    "gates": [
      [
        4,
        4,
        "cyan"
      ],
      [
        4,
        2,
        "magenta"
      ],
      [
        2,
        2,
        "gold"
      ],
      [
        2,
        0,
        "green"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "R",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "fence_h",
      "0,3": "wall_h",
      "0,5": "pine",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,2": "wall_h",
      "1,3": "wall_h",
      "1,5": "sakura",
      "2,3": "wall_h",
      "2,5": "fence_h",
      "3,1": "wall_h",
      "3,3": "pine",
      "3,5": "fence_h",
      "4,1": "pavilion",
      "4,5": "fence_h",
      "5,0": "wall_h",
      "5,1": "wall_h",
      "5,2": "sakura",
      "5,3": "fence_h",
      "5,4": "fence_h",
      "5,5": "fence_h",
      "6,0": "wall_h",
      "6,1": "pine",
      "6,2": "fence_h",
      "6,3": "fence_h",
      "6,4": "fence_h",
      "6,5": "wall_h"
    },
    "grass": [
      [
        3,
        0
      ],
      [
        3,
        4
      ]
    ],
    "winds": [
      [
        3,
        3,
        "N"
      ]
    ]
  },
  {
    "n": "Großes Schrein-Labyrinth",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Großes Labyrinth",
    "d": "Ein weitläufiger Schrein mit Portalsprung über die großen Felsspalten.",
    "w": 8,
    "h": 8,
    "s": [
      1,
      7,
      "N"
    ],
    "g": [
      5,
      4
    ],
    "sw": [
      [
        1,
        4,
        "cyan"
      ],
      [
        7,
        2,
        "magenta"
      ]
    ],
    "gates": [
      [
        3,
        4,
        "cyan"
      ],
      [
        7,
        4,
        "magenta"
      ]
    ],
    "portals": [
      [
        3,
        4
      ],
      [
        5,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        4,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 22,
    "solution": [
      "F",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "fence_h",
      "0,3": "wall_h",
      "0,4": "pine",
      "0,5": "sakura",
      "0,6": "fence_v",
      "0,7": "fence_v",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,2": "wall_h",
      "1,3": "wall_h",
      "2,0": "fence_h",
      "2,1": "wall_h",
      "2,2": "wall_h",
      "2,3": "pine",
      "2,5": "fence_h",
      "2,6": "fence_h",
      "2,7": "wall_h",
      "3,0": "fence_h",
      "3,1": "wall_h",
      "3,2": "pine",
      "3,3": "sakura",
      "3,5": "pavilion",
      "3,6": "fence_h",
      "3,7": "wall_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,2": "pine",
      "4,3": "house",
      "4,4": "fence_v",
      "4,5": "fence_h",
      "4,6": "wall_h",
      "4,7": "wall_h",
      "5,0": "wall_h",
      "5,1": "pine",
      "5,3": "fence_h",
      "5,5": "wall_h",
      "5,6": "wall_h",
      "5,7": "pine",
      "6,0": "wall_h",
      "6,1": "sakura",
      "6,3": "fence_h",
      "6,5": "wall_h",
      "6,6": "pine",
      "6,7": "sakura",
      "7,0": "pine",
      "7,1": "fence_h",
      "7,5": "wall_h",
      "7,6": "pine",
      "7,7": "fence_h"
    },
    "grass": [
      [
        6,
        2
      ],
      [
        7,
        3
      ],
      [
        1,
        5
      ]
    ]
  },
  {
    "n": "Kitsunes Meisterstück",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Meisterstück",
    "d": "Sammle das erste Licht, nimm das Portal und hole das zweite Licht im Oberdeck ab.",
    "w": 8,
    "h": 8,
    "s": [
      0,
      4,
      "E"
    ],
    "g": [
      4,
      0
    ],
    "sw": [
      [
        2,
        4,
        "cyan"
      ]
    ],
    "gates": [
      [
        4,
        4,
        "cyan"
      ]
    ],
    "orbs": [
      [
        4,
        4
      ],
      [
        6,
        0
      ]
    ],
    "portals": [
      [
        4,
        6
      ],
      [
        6,
        2
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        1,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 20,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "L",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "wall_h",
      "0,3": "wall_h",
      "0,5": "fence_h",
      "0,6": "fence_h",
      "0,7": "fence_h",
      "1,0": "fence_h",
      "1,1": "fence_h",
      "1,2": "wall_h",
      "1,3": "pine",
      "1,5": "fence_h",
      "1,6": "fence_h",
      "1,7": "wall_h",
      "2,0": "fence_h",
      "2,1": "wall_h",
      "2,2": "wall_h",
      "2,3": "sakura",
      "2,5": "fence_h",
      "2,6": "fence_h",
      "2,7": "wall_h",
      "3,0": "wall_h",
      "3,1": "wall_h",
      "3,2": "pine",
      "3,3": "sakura",
      "3,5": "pavilion",
      "3,6": "wall_h",
      "3,7": "wall_h",
      "4,1": "pavilion",
      "4,2": "sakura",
      "4,3": "house",
      "4,7": "pine",
      "5,1": "pine",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "fence_h",
      "5,5": "wall_h",
      "5,6": "wall_h",
      "5,7": "sakura",
      "6,3": "fence_h",
      "6,4": "wall_h",
      "6,5": "wall_h",
      "6,6": "pine",
      "6,7": "fence_h",
      "7,0": "sakura",
      "7,1": "fence_v",
      "7,2": "fence_v",
      "7,3": "fence_h",
      "7,4": "wall_h",
      "7,5": "pine",
      "7,6": "sakura",
      "7,7": "fence_h"
    },
    "grass": [
      [
        5,
        0
      ],
      [
        6,
        1
      ],
      [
        1,
        4
      ]
    ]
  },
  {
    "n": "Weg der Erleuchtung",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Erleuchtung",
    "d": "Lange Distanzen und hohe Präzision. Öffne die Tore der drei Himmelswinde.",
    "w": 8,
    "h": 8,
    "s": [
      1,
      7,
      "N"
    ],
    "g": [
      7,
      4
    ],
    "sw": [
      [
        1,
        5,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ],
      [
        5,
        1,
        "gold"
      ]
    ],
    "gates": [
      [
        3,
        5,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ],
      [
        7,
        1,
        "gold"
      ]
    ],
    "orbs": [
      [
        7,
        1
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "fence_h",
      "0,2": "wall_h",
      "0,3": "wall_h",
      "0,4": "sakura",
      "0,5": "fence_v",
      "0,6": "fence_v",
      "0,7": "fence_v",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,2": "wall_h",
      "1,3": "pine",
      "1,4": "house",
      "2,0": "fence_h",
      "2,1": "wall_h",
      "2,2": "pine",
      "2,3": "sakura",
      "2,4": "fence_h",
      "2,6": "wall_h",
      "2,7": "wall_h",
      "3,0": "wall_h",
      "3,1": "wall_h",
      "3,2": "sakura",
      "3,6": "wall_h",
      "3,7": "wall_h",
      "4,0": "wall_h",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "fence_h",
      "4,5": "wall_h",
      "4,6": "wall_h",
      "4,7": "pine",
      "5,0": "pine",
      "5,4": "wall_h",
      "5,5": "wall_h",
      "5,6": "pine",
      "5,7": "sakura",
      "6,0": "sakura",
      "6,2": "fence_v",
      "6,3": "fence_v",
      "6,4": "wall_h",
      "6,5": "wall_h",
      "6,6": "sakura",
      "6,7": "fence_h",
      "7,0": "sakura",
      "7,5": "pine",
      "7,6": "fence_h",
      "7,7": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Tempel der Ewigkeit",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Ewigkeit",
    "d": "Der Tempel der Ewigkeit prüft deine Geduld. Portale und Mehrfach-Tore im Einklang.",
    "w": 8,
    "h": 7,
    "s": [
      0,
      5,
      "E"
    ],
    "g": [
      2,
      3
    ],
    "sw": [
      [
        2,
        5,
        "cyan"
      ],
      [
        6,
        1,
        "magenta"
      ],
      [
        4,
        1,
        "green"
      ]
    ],
    "gates": [
      [
        4,
        5,
        "cyan"
      ],
      [
        4,
        1,
        "magenta"
      ],
      [
        2,
        1,
        "green"
      ]
    ],
    "portals": [
      [
        4,
        5
      ],
      [
        6,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ]
    ],
    "limit": 24,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "L",
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_h",
      "0,2": "wall_h",
      "0,3": "pine",
      "0,4": "sakura",
      "0,6": "fence_h",
      "1,0": "fence_h",
      "1,1": "wall_h",
      "1,2": "wall_h",
      "1,3": "sakura",
      "1,4": "house",
      "1,6": "fence_h",
      "2,0": "wall_h",
      "2,4": "fence_h",
      "2,6": "wall_h",
      "3,0": "wall_h",
      "3,2": "sakura",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,6": "wall_h",
      "4,0": "wall_h",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "fence_h",
      "4,6": "pine",
      "5,0": "pine",
      "5,2": "fence_h",
      "5,3": "fence_h",
      "5,4": "wall_h",
      "5,5": "wall_h",
      "5,6": "pine",
      "6,0": "sakura",
      "6,4": "wall_h",
      "6,5": "pine",
      "6,6": "sakura",
      "7,0": "fence_h",
      "7,1": "fence_v",
      "7,2": "fence_v",
      "7,3": "wall_v",
      "7,4": "wall_h",
      "7,5": "sakura",
      "7,6": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Das letzte Orakel",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Vorfinale",
    "d": "Das Orakel der Kami verlangt zwei Geisterlichter und drei geöffnete Himmelstore.",
    "w": 8,
    "h": 8,
    "s": [
      1,
      7,
      "N"
    ],
    "g": [
      7,
      3
    ],
    "sw": [
      [
        1,
        5,
        "cyan"
      ],
      [
        3,
        3,
        "magenta"
      ],
      [
        5,
        1,
        "gold"
      ]
    ],
    "gates": [
      [
        3,
        5,
        "cyan"
      ],
      [
        5,
        3,
        "magenta"
      ],
      [
        7,
        1,
        "gold"
      ]
    ],
    "orbs": [
      [
        3,
        5
      ],
      [
        5,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "L",
      "F",
      "F",
      "A",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_h",
      "0,2": "wall_h",
      "0,3": "pine",
      "0,4": "fence_h",
      "0,5": "fence_v",
      "0,6": "fence_v",
      "0,7": "wall_v",
      "1,0": "wall_h",
      "1,1": "wall_h",
      "1,2": "pine",
      "1,3": "sakura",
      "1,4": "house",
      "2,0": "wall_h",
      "2,1": "pine",
      "2,2": "sakura",
      "2,3": "fence_h",
      "2,4": "fence_h",
      "2,6": "wall_h",
      "2,7": "pine",
      "3,0": "wall_h",
      "3,1": "pine",
      "3,2": "fence_h",
      "3,6": "wall_h",
      "3,7": "sakura",
      "4,0": "pine",
      "4,1": "pavilion",
      "4,2": "fence_h",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "4,6": "pine",
      "4,7": "sakura",
      "5,0": "sakura",
      "5,4": "wall_h",
      "5,5": "pine",
      "5,6": "sakura",
      "5,7": "fence_h",
      "6,0": "fence_h",
      "6,2": "fence_v",
      "6,3": "wall_v",
      "6,4": "wall_h",
      "6,5": "pine",
      "6,6": "fence_h",
      "6,7": "fence_h",
      "7,0": "fence_h",
      "7,4": "pine",
      "7,5": "sakura",
      "7,6": "fence_h",
      "7,7": "fence_h"
    },
    "grass": []
  },
  {
    "n": "Die Legende von KOMA",
    "c": "Kapitel 07 · Palast der Kami",
    "t": "Meister-Finale",
    "d": "Das große Finale von KOMA: Spirit Delivery! Alle Schreinelemente vereinen sich im Palast der Götter.",
    "w": 8,
    "h": 8,
    "s": [
      0,
      6,
      "E"
    ],
    "g": [
      2,
      4
    ],
    "sw": [
      [
        2,
        6,
        "cyan"
      ],
      [
        6,
        1,
        "magenta"
      ],
      [
        2,
        1,
        "gold"
      ]
    ],
    "gates": [
      [
        4,
        6,
        "cyan"
      ],
      [
        4,
        1,
        "magenta"
      ],
      [
        2,
        3,
        "gold"
      ]
    ],
    "orbs": [
      [
        4,
        6
      ],
      [
        4,
        1
      ]
    ],
    "portals": [
      [
        4,
        7
      ],
      [
        6,
        3
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        1,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "limit": 26,
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "R",
      "F",
      "L",
      "L",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "F",
      "F",
      "L",
      "A",
      "F",
      "F",
      "F"
    ],
    "obstacles": {
      "0,0": "fence_h",
      "0,1": "wall_h",
      "0,2": "pine",
      "0,3": "sakura",
      "0,4": "fence_h",
      "0,5": "fence_h",
      "0,7": "wall_h",
      "1,0": "wall_h",
      "1,1": "wall_h",
      "1,2": "sakura",
      "1,3": "fence_h",
      "1,4": "house",
      "1,5": "fence_h",
      "1,7": "wall_h",
      "2,0": "wall_h",
      "2,5": "wall_h",
      "2,7": "pine",
      "3,0": "pine",
      "3,2": "fence_h",
      "3,3": "fence_h",
      "3,4": "fence_h",
      "3,5": "pavilion",
      "3,7": "sakura",
      "4,0": "pine",
      "4,2": "fence_h",
      "4,3": "house",
      "4,4": "wall_h",
      "4,5": "wall_h",
      "5,0": "sakura",
      "5,2": "fence_h",
      "5,3": "wall_h",
      "5,4": "wall_h",
      "5,5": "pine",
      "5,6": "fence_h",
      "5,7": "fence_h",
      "6,0": "fence_h",
      "6,4": "pine",
      "6,5": "sakura",
      "6,6": "fence_h",
      "6,7": "fence_h",
      "7,0": "fence_h",
      "7,1": "fence_v",
      "7,2": "wall_v",
      "7,3": "wall_v",
      "7,4": "sakura",
      "7,5": "fence_h",
      "7,6": "fence_h",
      "7,7": "fence_h"
    },
    "grass": [
      [
        3,
        6
      ]
    ]
  },
  {
    "n": "Der erste Bergwind",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Windböen",
    "d": "Willkommen am schneebedeckten Fuß des Fuji! Eine sanfte Windböe trägt KOMA mit. Nutze den Windstoß, aktiviere den Schrein-Schalter und erreiche das Ziel.",
    "w": 5,
    "h": 5,
    "s": [
      0,
      3,
      "E"
    ],
    "g": [
      3,
      1
    ],
    "winds": [
      [
        1,
        3,
        "E"
      ]
    ],
    "sw": [
      [
        1,
        1,
        "cyan"
      ]
    ],
    "gates": [
      [
        3,
        2,
        "cyan"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        0,
        1
      ],
      [
        4,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        4,
        2
      ],
      [
        4,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "fence_h",
      "3,0": "pine",
      "4,0": "wall_h",
      "0,1": "fence_v",
      "4,1": "fence_v",
      "0,2": "wall_v",
      "1,2": "pine",
      "4,2": "wall_v",
      "4,3": "fence_v",
      "0,4": "wall_h",
      "1,4": "fence_h",
      "2,4": "wall_h",
      "3,4": "fence_h",
      "4,4": "wall_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        2,
        3
      ]
    ],
    "solution": [
      "F",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "limit": 8
  },
  {
    "n": "Die gefrorene Schlucht",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Schlucht-Sprung",
    "d": "Ein eisiger Abgrund trennt die Terrassen. Der Aufwind katapultiert KOMA über die Schlucht zum Bergkristall. Entsiegle das Tor, um den Berggarten zu betreten.",
    "w": 6,
    "h": 6,
    "s": [
      1,
      4,
      "N"
    ],
    "g": [
      4,
      4
    ],
    "orbs": [
      [
        1,
        1
      ]
    ],
    "sw": [
      [
        4,
        1,
        "cyan"
      ]
    ],
    "gates": [
      [
        4,
        3,
        "cyan"
      ]
    ],
    "winds": [
      [
        1,
        3,
        "N"
      ],
      [
        4,
        2,
        "S"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        2,
        2
      ],
      [
        3,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        5,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "pine",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "wall_h",
      "0,1": "fence_v",
      "5,1": "fence_v",
      "2,2": "wall_v",
      "3,2": "wall_v",
      "2,3": "wall_v",
      "3,3": "wall_v",
      "2,4": "pine",
      "3,4": "wall_h",
      "0,5": "wall_h",
      "1,5": "fence_h",
      "2,5": "wall_h",
      "3,5": "fence_h",
      "4,5": "wall_h",
      "5,5": "wall_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        3,
        1
      ]
    ],
    "solution": [
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "R",
      "A",
      "F",
      "F"
    ],
    "limit": 12
  },
  {
    "n": "Das eisige Kitsune-Portal",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Portal-Beschleunigung",
    "d": "Das Kitsune-Portal steht mitten im Windkanal! Die Windträgheit schleudert KOMA direkt beim Austritt weiter. Sammle beide Lichter und finde den Weg zum Hof.",
    "w": 7,
    "h": 7,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      3,
      6
    ],
    "portals": [
      [
        2,
        2
      ],
      [
        4,
        4
      ]
    ],
    "orbs": [
      [
        5,
        4
      ],
      [
        1,
        5
      ]
    ],
    "sw": [
      [
        5,
        5,
        "cyan"
      ]
    ],
    "gates": [
      [
        3,
        5,
        "cyan"
      ]
    ],
    "winds": [
      [
        1,
        2,
        "E"
      ],
      [
        4,
        4,
        "E"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        3,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        3,
        4
      ],
      [
        6,
        4
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "pine",
      "3,0": "fence_h",
      "4,0": "house",
      "5,0": "pine",
      "6,0": "wall_h",
      "3,2": "pine",
      "4,2": "fence_h",
      "1,3": "fence_v",
      "2,3": "wall_h",
      "6,5": "fence_v",
      "0,6": "wall_h",
      "1,6": "fence_h",
      "2,6": "wall_h",
      "4,6": "wall_h",
      "5,6": "wall_h",
      "6,6": "wall_h"
    },
    "grass": [
      [
        5,
        3
      ],
      [
        2,
        5
      ]
    ],
    "solution": [
      "F",
      "R",
      "F",
      "R",
      "A",
      "F",
      "F",
      "F",
      "F",
      "L",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "limit": 17
  },
  {
    "n": "Schneeverwehte Pfade",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Wind-Umleitung",
    "d": "Dichter Schneefall verweht die Stufen. Nutze die abwärtsgerichtete Windböe, um den Schalter im Tal zu erreichen, und umrunde die Schlucht zum Schrein.",
    "w": 6,
    "h": 5,
    "s": [
      0,
      1,
      "E"
    ],
    "g": [
      5,
      1
    ],
    "sw": [
      [
        2,
        3,
        "cyan"
      ]
    ],
    "gates": [
      [
        4,
        1,
        "cyan"
      ]
    ],
    "winds": [
      [
        1,
        1,
        "E"
      ],
      [
        3,
        1,
        "S"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        5,
        4
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "pine",
      "2,0": "house",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "wall_h",
      "0,2": "fence_v",
      "1,2": "wall_h",
      "2,2": "pine",
      "5,2": "wall_h",
      "0,3": "fence_v",
      "0,4": "wall_h",
      "1,4": "fence_h",
      "5,4": "wall_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        3,
        3
      ]
    ],
    "solution": [
      "F",
      "F",
      "R",
      "F",
      "R",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "limit": 18
  },
  {
    "n": "Kreuzende Böen",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Kreuzwinde",
    "d": "Auf dem Bergsattel kreuzen sich tückische Winde. Sammle beide Geisterkristalle, indem du den Ost- und Südwinden gezielt folgst.",
    "w": 6,
    "h": 6,
    "s": [
      0,
      2,
      "E"
    ],
    "g": [
      5,
      4
    ],
    "orbs": [
      [
        3,
        1
      ],
      [
        1,
        4
      ]
    ],
    "winds": [
      [
        1,
        2,
        "E"
      ],
      [
        4,
        2,
        "S"
      ],
      [
        3,
        4,
        "W"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        5,
        1
      ],
      [
        5,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        5,
        3
      ],
      [
        0,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "fence_h",
      "2,0": "house",
      "3,0": "pine",
      "4,0": "fence_h",
      "5,0": "wall_h",
      "1,1": "pine",
      "5,1": "fence_v",
      "2,3": "pine",
      "5,3": "fence_v",
      "0,5": "wall_h",
      "1,5": "fence_h",
      "2,5": "wall_h",
      "3,5": "fence_h",
      "4,5": "wall_h",
      "5,5": "wall_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        4,
        1
      ]
    ],
    "solution": [
      "F",
      "F",
      "R",
      "F",
      "F",
      "R",
      "F",
      "R",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "R",
      "F",
      "F",
      "L",
      "F"
    ],
    "limit": 21
  },
  {
    "n": "Aufstieg zur 8. Station",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Terrassen-Labyrinth",
    "d": "Die achte Station vor dem Gipfel verlangt höchste Meisterschaft: Kitsune-Portale, Doppeltore und Aufwinde müssen in perfekter Harmonie gemeistert werden.",
    "w": 8,
    "h": 8,
    "s": [
      0,
      6,
      "E"
    ],
    "g": [
      7,
      1
    ],
    "portals": [
      [
        2,
        4
      ],
      [
        5,
        4
      ]
    ],
    "orbs": [
      [
        1,
        2
      ],
      [
        5,
        2
      ]
    ],
    "sw": [
      [
        3,
        6,
        "cyan"
      ],
      [
        6,
        2,
        "magenta"
      ]
    ],
    "gates": [
      [
        2,
        2,
        "cyan"
      ],
      [
        6,
        1,
        "magenta"
      ]
    ],
    "winds": [
      [
        1,
        6,
        "E"
      ],
      [
        2,
        3,
        "N"
      ],
      [
        5,
        3,
        "N"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        4,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        3,
        4
      ],
      [
        4,
        4
      ],
      [
        6,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        6,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        7
      ],
      [
        1,
        7
      ],
      [
        2,
        7
      ],
      [
        3,
        7
      ],
      [
        4,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "pine",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "house",
      "6,0": "fence_h",
      "7,0": "wall_h",
      "1,1": "fence_h",
      "3,1": "wall_h",
      "4,1": "pine",
      "3,3": "pine",
      "4,3": "pine",
      "1,4": "wall_h",
      "3,4": "fence_v",
      "4,4": "wall_h",
      "0,7": "wall_h",
      "1,7": "fence_h",
      "2,7": "wall_h",
      "3,7": "fence_h",
      "4,7": "wall_h",
      "5,7": "fence_h",
      "6,7": "wall_h",
      "7,7": "wall_h"
    },
    "grass": [
      [
        2,
        5
      ],
      [
        5,
        5
      ]
    ],
    "solution": [
      "F",
      "F",
      "A",
      "F",
      "F",
      "L",
      "F",
      "F",
      "F",
      "L",
      "F",
      "L",
      "L",
      "F",
      "F",
      "F",
      "F",
      "F",
      "F",
      "L",
      "F"
    ],
    "limit": 23
  },
  {
    "n": "Wirbelsturm der vier Winde",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Wind-Strudel",
    "d": "Ein kreisender Wirbelsturm tobt über dem Hochplateau! Nutze die Strömung, um die äußeren Schreine zu erreichen, ohne im Windstrudel gefangen zu bleiben.",
    "w": 7,
    "h": 7,
    "s": [
      1,
      5,
      "N"
    ],
    "g": [
      3,
      6
    ],
    "orbs": [
      [
        3,
        1
      ],
      [
        5,
        3
      ]
    ],
    "sw": [
      [
        1,
        1,
        "cyan"
      ]
    ],
    "gates": [
      [
        3,
        5,
        "cyan"
      ]
    ],
    "winds": [
      [
        2,
        2,
        "E"
      ],
      [
        4,
        2,
        "S"
      ],
      [
        4,
        4,
        "W"
      ],
      [
        2,
        4,
        "N"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        0,
        1
      ],
      [
        2,
        1
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        0,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        3,
        3
      ],
      [
        6,
        3
      ],
      [
        0,
        4
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        6,
        5
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "pine",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "house",
      "6,0": "wall_h",
      "2,1": "fence_v",
      "4,1": "fence_v",
      "3,3": "pine",
      "0,6": "wall_h",
      "1,6": "fence_h",
      "2,6": "wall_h",
      "4,6": "wall_h",
      "5,6": "fence_h",
      "6,6": "wall_h"
    },
    "grass": [
      [
        3,
        2
      ],
      [
        3,
        4
      ]
    ],
    "solution": [
      "F",
      "F",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "L",
      "F",
      "L",
      "F",
      "L",
      "L",
      "F",
      "L",
      "F",
      "F",
      "L",
      "L",
      "F",
      "L",
      "F",
      "F",
      "F"
    ],
    "limit": 27
  },
  {
    "n": "Gegenstrom im Eiskanal",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Dual-Tore & Windkanal",
    "d": "Zwei versiegelte Tore und reißende Windkanäle fordern präzises Timing. Aktiviere beide Wächterschalter und überwinde die Windströme.",
    "w": 8,
    "h": 7,
    "s": [
      0,
      5,
      "E"
    ],
    "g": [
      7,
      1
    ],
    "orbs": [
      [
        1,
        3
      ],
      [
        6,
        3
      ]
    ],
    "sw": [
      [
        2,
        5,
        "cyan"
      ],
      [
        6,
        5,
        "magenta"
      ]
    ],
    "gates": [
      [
        3,
        3,
        "cyan"
      ],
      [
        6,
        2,
        "magenta"
      ]
    ],
    "winds": [
      [
        1,
        5,
        "E"
      ],
      [
        4,
        3,
        "E"
      ],
      [
        4,
        1,
        "W"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        5,
        1
      ],
      [
        0,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        2
      ],
      [
        4,
        2
      ],
      [
        5,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        4
      ],
      [
        1,
        4
      ],
      [
        2,
        4
      ],
      [
        4,
        4
      ],
      [
        5,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        6
      ],
      [
        1,
        6
      ],
      [
        2,
        6
      ],
      [
        3,
        6
      ],
      [
        4,
        6
      ],
      [
        5,
        6
      ],
      [
        6,
        6
      ],
      [
        7,
        6
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "pine",
      "2,0": "house",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "house",
      "6,0": "fence_h",
      "7,0": "wall_h",
      "1,2": "pine",
      "2,2": "wall_h",
      "4,2": "fence_v",
      "5,2": "pine",
      "1,4": "wall_h",
      "2,4": "fence_h",
      "4,4": "pine",
      "5,4": "wall_h",
      "0,6": "wall_h",
      "1,6": "fence_h",
      "2,6": "wall_h",
      "3,6": "fence_h",
      "4,6": "wall_h",
      "5,6": "fence_h",
      "6,6": "wall_h",
      "7,6": "wall_h"
    },
    "grass": [
      [
        3,
        1
      ],
      [
        3,
        5
      ]
    ],
    "solution": [
      "F",
      "A",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "L",
      "F",
      "F",
      "F",
      "F",
      "R",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "F",
      "F",
      "R",
      "F"
    ],
    "limit": 29
  },
  {
    "n": "Das verborgene Eistor",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Zwei Tore im Eis",
    "d": "Zwei uralte Tore versperren den Hauptweg. Nutze die Windböen im Tal, um den Cyan-Schalter zu betätigen, das Magma-Tor zu entsiegeln und den Schrein zu öffnen.",
    "w": 7,
    "h": 6,
    "s": [
      0,
      4,
      "N"
    ],
    "g": [
      5,
      1
    ],
    "orbs": [
      [
        3,
        4
      ]
    ],
    "sw": [
      [
        1,
        1,
        "magenta"
      ],
      [
        5,
        4,
        "cyan"
      ]
    ],
    "gates": [
      [
        3,
        3,
        "cyan"
      ],
      [
        5,
        2,
        "magenta"
      ]
    ],
    "winds": [
      [
        2,
        4,
        "E"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        4,
        1
      ],
      [
        6,
        1
      ],
      [
        1,
        2
      ],
      [
        6,
        2
      ],
      [
        0,
        3
      ],
      [
        1,
        3
      ],
      [
        2,
        3
      ],
      [
        4,
        3
      ],
      [
        6,
        3
      ],
      [
        6,
        4
      ],
      [
        0,
        5
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        6,
        5
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "pine",
      "2,0": "house",
      "3,0": "fence_h",
      "4,0": "pine",
      "5,0": "wall_h",
      "6,0": "wall_h",
      "4,1": "wall_v",
      "6,1": "fence_v",
      "1,2": "pine",
      "6,2": "fence_v",
      "0,3": "fence_v",
      "1,3": "fence_h",
      "2,3": "wall_h",
      "4,3": "wall_h",
      "6,3": "fence_h",
      "6,4": "fence_v",
      "0,5": "wall_h",
      "1,5": "fence_h",
      "2,5": "wall_h",
      "3,5": "fence_h",
      "4,5": "wall_h",
      "5,5": "wall_h",
      "6,5": "wall_h"
    },
    "grass": [
      [
        2,
        1
      ],
      [
        4,
        1
      ]
    ],
    "solution": [
      "R",
      "F",
      "F",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "L",
      "F",
      "F",
      "L",
      "L",
      "A",
      "F",
      "F",
      "R",
      "F",
      "L",
      "F",
      "F",
      "L",
      "F"
    ],
    "limit": 31
  },
  {
    "n": "Der Geist des Fuji (富士の神)",
    "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
    "t": "Meisterprüfung",
    "d": "Der heilige Gipfel des Fuji liegt vor dir. Finde alle drei kaiserlichen Relikte, entsiegle die Doppeltore des Berggottes und erbringe die finale Geisterlieferung!",
    "w": 8,
    "h": 8,
    "s": [
      3,
      7,
      "N"
    ],
    "g": [
      4,
      1
    ],
    "portals": [
      [
        1,
        4
      ],
      [
        6,
        4
      ]
    ],
    "orbs": [
      [
        1,
        2
      ],
      [
        6,
        2
      ],
      [
        4,
        2
      ]
    ],
    "sw": [
      [
        1,
        6,
        "cyan"
      ],
      [
        6,
        6,
        "magenta"
      ]
    ],
    "gates": [
      [
        1,
        3,
        "cyan"
      ],
      [
        6,
        3,
        "magenta"
      ]
    ],
    "winds": [
      [
        3,
        6,
        "W"
      ],
      [
        4,
        6,
        "E"
      ],
      [
        4,
        4,
        "N"
      ]
    ],
    "walls": [
      [
        0,
        0
      ],
      [
        1,
        0
      ],
      [
        2,
        0
      ],
      [
        3,
        0
      ],
      [
        4,
        0
      ],
      [
        5,
        0
      ],
      [
        6,
        0
      ],
      [
        7,
        0
      ],
      [
        0,
        1
      ],
      [
        1,
        1
      ],
      [
        2,
        1
      ],
      [
        3,
        1
      ],
      [
        5,
        1
      ],
      [
        6,
        1
      ],
      [
        7,
        1
      ],
      [
        0,
        2
      ],
      [
        7,
        2
      ],
      [
        0,
        3
      ],
      [
        2,
        3
      ],
      [
        3,
        3
      ],
      [
        4,
        3
      ],
      [
        5,
        3
      ],
      [
        7,
        3
      ],
      [
        0,
        4
      ],
      [
        7,
        4
      ],
      [
        0,
        5
      ],
      [
        2,
        5
      ],
      [
        3,
        5
      ],
      [
        4,
        5
      ],
      [
        5,
        5
      ],
      [
        7,
        5
      ],
      [
        0,
        6
      ],
      [
        7,
        6
      ],
      [
        0,
        7
      ],
      [
        1,
        7
      ],
      [
        2,
        7
      ],
      [
        5,
        7
      ],
      [
        6,
        7
      ],
      [
        7,
        7
      ]
    ],
    "obstacles": {
      "0,0": "wall_h",
      "1,0": "house",
      "2,0": "pine",
      "3,0": "torii",
      "4,0": "house",
      "5,0": "torii",
      "6,0": "pine",
      "7,0": "wall_h",
      "1,1": "pine",
      "2,1": "wall_h",
      "3,1": "wall_v",
      "5,1": "wall_v",
      "6,1": "pine",
      "3,3": "pine",
      "4,3": "pine",
      "2,5": "pine",
      "3,5": "fence_h",
      "4,5": "fence_h",
      "5,5": "pine",
      "0,7": "wall_h",
      "1,7": "fence_h",
      "2,7": "wall_h",
      "5,7": "wall_h",
      "6,7": "fence_h",
      "7,7": "wall_h"
    },
    "grass": [
      [
        3,
        4
      ],
      [
        4,
        2
      ],
      [
        4,
        7
      ]
    ],
    "solution": [
      "F",
      "L",
      "F",
      "R",
      "A",
      "F",
      "F",
      "L",
      "F",
      "L",
      "L",
      "F",
      "L",
      "F",
      "F",
      "R",
      "F",
      "F",
      "F",
      "F",
      "F",
      "L",
      "L",
      "F",
      "F",
      "R",
      "F"
    ],
    "limit": 29
  }
];
