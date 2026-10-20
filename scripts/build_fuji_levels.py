import json
from scripts.simulator import simulate

def test_levels():
    levels = []

    # Level 51: Der erste Bergwind (5x5)
    lvl51 = {
        "n": "Der erste Bergwind",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Windböen",
        "d": "Willkommen am schneebedeckten Fuß des Fuji! Eine sanfte Windböe trägt KOMA automatisch nach Osten mit. Nutze den Windstoß, um Schritte zu sparen.",
        "w": 5, "h": 5,
        "s": [0, 2, "E"],
        "g": [4, 2],
        "winds": [[1, 2, "E"]],
        "walls": [[1, 0], [2, 0], [3, 0], [1, 1], [3, 1], [1, 3], [3, 3], [1, 4], [2, 4], [3, 4]],
        "limit": 5,
        "solution": ["F", "F", "F"]
    }
    levels.append(lvl51)

    # Level 52: Gratwanderung im Schnee (5x5)
    lvl52 = {
        "n": "Gratwanderung im Schnee",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Rückenwind",
        "d": "Auf dem schmalen Berggrat peitscht der Aufwind. Lass dich vom Wind nach Norden tragen und biege dann geschickt zum Schrein ab.",
        "w": 5, "h": 5,
        "s": [1, 4, "N"],
        "g": [3, 1],
        "winds": [[1, 3, "N"]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
            [0, 1], [4, 1],
            [0, 2], [2, 2], [4, 2],
            [0, 3], [2, 3], [4, 3],
            [0, 4], [2, 4], [4, 4]
        ],
        "limit": 7,
        "solution": ["F", "F", "R", "F", "F"]
    }
    levels.append(lvl52)

    # Level 53: Schneesturm & Eis-Tor (6x5)
    lvl53 = {
        "n": "Schneesturm & Eis-Tor",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Wind & Schalter",
        "d": "Der Schneesturm fegt durch die Schlucht. Nutze die Windböe, um den Eis-Schalter zu erreichen und das Torii-Tor zu entsiegeln.",
        "w": 6, "h": 5,
        "s": [0, 3, "E"],
        "g": [5, 1],
        "sw": [[3, 3, "cyan"]],
        "gates": [[4, 1, "cyan"]],
        "winds": [[1, 3, "E"]],
        "walls": [
            [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
            [0, 1], [1, 1], [2, 1],
            [0, 2], [1, 2], [2, 2], [4, 2], [5, 2],
            [4, 3], [5, 3],
            [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]
        ],
        "limit": 11,
        "solution": ["F", "F", "A", "L", "F", "F", "R", "F", "F"]
    }
    levels.append(lvl53)

    # Level 54: Die gefrorene Schlucht (6x6)
    lvl54 = {
        "n": "Die gefrorene Schlucht",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Doppelböe",
        "d": "Doppelter Windkanal! Mehrere Windböen hintereinander katapultieren KOMA rasant über die vereiste Bergschlucht.",
        "w": 6, "h": 6,
        "s": [0, 1, "E"],
        "g": [5, 4],
        "winds": [[1, 1, "E"], [2, 1, "E"], [4, 2, "S"]],
        "walls": [
            [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
            [1, 2], [2, 2], [3, 2],
            [0, 3], [1, 3], [2, 3], [3, 3], [5, 3],
            [0, 4], [1, 4], [2, 4],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
        ],
        "limit": 9,
        "solution": ["F", "F", "R", "F", "F", "L", "F"]
    }
    levels.append(lvl54)

    # Level 55: Lichter im Schneegestöber (6x6)
    lvl55 = {
        "n": "Lichter im Schneegestöber",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Geisterlichter",
        "d": "Im dichten Schneetreiben leuchten zwei Geisterlichter. Nutze den Windstrom, um beide einzusammeln, bevor du den Schrein betrittst.",
        "w": 6, "h": 6,
        "s": [0, 1, "E"],
        "g": [5, 4],
        "orbs": [[3, 1], [3, 3]],
        "winds": [[1, 1, "E"], [4, 2, "S"]],
        "walls": [
            [1, 0], [2, 0], [4, 0],
            [1, 2], [2, 2],
            [0, 3], [1, 3], [5, 3],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
        ],
        "limit": 14,
        "solution": ["F", "F", "F", "R", "F", "R", "F", "L", "F", "L", "F", "F"]
    }
    levels.append(lvl55)

    # Level 56: Torii im Eismeer (7x6)
    # Start (0, 4, N). Wind on (0, 2, N) blows to (0, 1).
    # Switch cyan on (1, 1). Gate cyan on (3, 1).
    # Switch magenta on (5, 4). Gate magenta on (5, 2).
    # Wind on (4, 4, E) blows to (5, 4).
    # Goal on (6, 1).
    # Solution:
    # 0,4 N -> F to 0,3 -> F to 0,2 (blown to 0,1) -> R to E -> F to 1,1 (A: cyan open)
    # -> F to 2,1 -> F through cyan gate 3,1 -> F to 4,1
    # -> R to S -> F to 4,2 -> F to 4,3 -> F to 4,4 (blown to 5,4! A: magenta open)
    # -> L to N -> F to 5,3 -> F through magenta gate 5,2 -> F to 5,1 -> R to E -> F to 6,1 (Goal)
    lvl56 = {
        "n": "Torii im Eismeer",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Doppeltor & Wind",
        "d": "Zwei versiegelte Torii-Tore versperren den Weg zum Hochplateau. Nutze gezielte Windstöße, um beide Wächterschalter zu erreichen.",
        "w": 7, "h": 6,
        "s": [0, 4, "N"],
        "g": [6, 1],
        "sw": [[1, 1, "cyan"], [5, 4, "magenta"]],
        "gates": [[3, 1, "cyan"], [5, 2, "magenta"]],
        "winds": [[0, 2, "N"], [4, 4, "E"]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [1, 2], [2, 2], [3, 2], [6, 2],
            [1, 3], [2, 3], [3, 3], [6, 3],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5]
        ],
        "limit": 22,
        "solution": [
            "F", "F", "R", "F", "A", "F", "F", "F", "R", "F", "F", "F", "A", "L", "F", "F", "F", "R", "F"
        ]
    }
    levels.append(lvl56)

    # Level 57: Das eisige Kitsune-Portal (7x6)
    # Start: (0, 2, E). Wind on (1, 2, E) -> blown to (2, 2, portal 1).
    # Teleports to portal 2 on (4, 4).
    # On (4, 4), wind blows East to (5, 4) where Orb is!
    # Switch cyan on (5, 5). Gate cyan on (6, 2). Goal on (6, 1).
    lvl57 = {
        "n": "Das eisige Kitsune-Portal",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Portal & Wind",
        "d": "Ein Kitsune-Portal inmitten eines eisigen Windkanals! Kaum materialisiert sich KOMA am Zielportal, reißt der Bergwind ihn direkt zum Geisterlicht mit.",
        "w": 7, "h": 6,
        "s": [0, 2, "E"],
        "g": [6, 1],
        "portals": [[2, 2], [4, 4]],
        "winds": [[1, 2, "E"], [4, 4, "E"]],
        "orbs": [[5, 4]],
        "sw": [[5, 5, "cyan"]],
        "gates": [[6, 2, "cyan"]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
            [3, 2], [4, 2], [5, 2],
            [0, 3], [1, 3], [2, 3], [3, 3],
            [0, 4], [1, 4], [2, 4], [3, 4],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5]
        ],
        "limit": 14,
        "solution": [
            "F", "R", "F", "A", "L", "L", "F", "F", "F", "R", "F", "L", "F"
        ]
    }
    levels.append(lvl57)

    # Level 58: Kreuzwinde des Fuji (7x7)
    # Start: (1, 5, N).
    # Wind 1: [1, 3, "N"] -> blown to 1,2.
    # Orb 1: [1, 1].
    # Wind 2: [3, 1, "E"] -> blown to 4,1.
    # Wind 3: [5, 3, "S"] -> blown to 5,4.
    # Orb 2: [5, 5].
    # Goal: [3, 5].
    # Walls block incorrect paths.
    lvl58 = {
        "n": "Kreuzwinde des Fuji",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Kreuzwinde",
        "d": "Kreuzende Windböen auf einem Felsvorsprung. Wähle deine Schritte mit Bedacht, um beide Bergkristalle mit dem Windstrom einzufangen.",
        "w": 7, "h": 7,
        "s": [1, 5, "N"],
        "g": [3, 5],
        "winds": [[1, 3, "N"], [3, 1, "E"], [5, 3, "S"]],
        "orbs": [[1, 1], [5, 5]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [0, 1], [6, 1],
            [0, 2], [2, 2], [3, 2], [4, 2], [6, 2],
            [0, 3], [2, 3], [4, 3], [6, 3],
            [0, 4], [2, 4], [3, 4], [4, 4], [6, 4],
            [0, 5], [6, 5],
            [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6]
        ],
        "limit": 18,
        "solution": [
            "F", "F", "F", "R", "F", "F", "F", "R", "F", "F", "F", "R", "F", "F"
        ]
    }
    levels.append(lvl58)

    # Level 59: Aufstieg zur 8. Station (8x7)
    # Serpentine mountain path with 2 switches, 2 gates, 2 orbs and wind boosts.
    lvl59 = {
        "n": "Aufstieg zur 8. Station",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Gipfelanstieg",
        "d": "Die achte Bergstation liegt in greifbarer Nähe. Starke Aufwinde fordern all deine Planungsgunst: Schalter umlegen, Tore passieren und Geisterlichter sichern.",
        "w": 8, "h": 7,
        "s": [0, 5, "E"],
        "g": [7, 1],
        "sw": [[3, 5, "cyan"], [6, 4, "magenta"]],
        "gates": [[3, 3, "cyan"], [6, 2, "magenta"]],
        "orbs": [[1, 3], [6, 3]],
        "winds": [[1, 5, "E"], [4, 3, "E"]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
            [0, 2], [1, 2], [2, 2], [4, 2], [5, 2],
            [0, 4], [1, 4], [2, 4], [4, 4], [5, 4],
            [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]
        ],
        "limit": 24,
        "solution": [
            "F", "F", "A", "L", "F", "F", "L", "F", "R", "R", "F", "F", "F", "R", "F", "A", "L", "L", "F", "F", "R", "F"
        ]
    }
    levels.append(lvl59)

    # Level 60: Der Geist des Fuji (8x8)
    # Master climax level!
    lvl60 = {
        "n": "Der Geist des Fuji (富士の神)",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Meisterprüfung",
        "d": "Der heilige Gipfel des Fuji liegt vor dir. Meistere Windströme, Kitsune-Portale, Schalter und sammle alle Geisterlichter, um das Tor des Berggottes zu öffnen!",
        "w": 8, "h": 8,
        "s": [0, 6, "E"],
        "g": [4, 1],
        "portals": [[2, 4], [5, 4]],
        "winds": [[1, 6, "E"], [5, 4, "N"], [4, 3, "N"]],
        "sw": [[3, 6, "cyan"], [6, 2, "magenta"]],
        "gates": [[3, 2, "cyan"], [4, 2, "magenta"]],
        "orbs": [[3, 4], [5, 2], [4, 1]], # Note: 3 orbs
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, 1], [1, 1], [2, 1], [6, 1], [7, 1],
            [0, 2], [1, 2], [7, 2],
            [0, 3], [1, 3], [2, 3], [6, 3], [7, 3],
            [0, 5], [1, 5], [7, 5],
            [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]
        ],
        "limit": 28,
        "solution": [
            "F", "F", "A", "L", "F", "L", "F", "L", "F", "F", "R", "F", "A", "L", "F", "F", "L", "F", "F", "R", "F", "F"
        ]
    }
    levels.append(lvl60)

    print(f"Testing {len(levels)} levels...")
    for idx, lvl in enumerate(levels):
        ok, msg = simulate(lvl, lvl["solution"])
        print(f"Level {51+idx}: {lvl['n']} -> {ok} | {msg}")
        if not ok:
            return False
    return True

if __name__ == "__main__":
    success = test_levels()
    print("ALL 10 NEW LEVELS PASS:", success)
