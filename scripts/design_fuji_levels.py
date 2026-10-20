import json
import sys
from scripts.solver import solve
from scripts.simulator import simulate

def build_ordered_levels():
    levels = []

    # =========================================================================
    # Level 51: Der erste Bergwind (5x5) - 6 steps (limit 8)
    # Introduction to wind currents.
    # =========================================================================
    lvl51 = {
        "n": "Der erste Bergwind",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Windböen",
        "d": "Willkommen am schneebedeckten Fuß des Fuji! Eine sanfte Windböe trägt KOMA mit. Nutze den Windstoß, aktiviere den Schrein-Schalter und erreiche das Ziel.",
        "w": 5, "h": 5,
        "s": [0, 3, "E"],
        "g": [3, 1],
        "winds": [
            [1, 3, "E"]
        ],
        "sw": [[1, 1, "cyan"]],
        "gates": [[3, 2, "cyan"]],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
            [0, 1], [4, 1],
            [0, 2], [1, 2], [4, 2],
            [4, 3],
            [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "fence_h", "3,0": "pine", "4,0": "wall_h",
            "0,1": "fence_v", "4,1": "fence_v",
            "0,2": "wall_v", "1,2": "pine", "4,2": "wall_v",
            "4,3": "fence_v",
            "0,4": "wall_h", "1,4": "fence_h", "2,4": "wall_h", "3,4": "fence_h", "4,4": "wall_h"
        },
        "grass": [[2, 1], [2, 3]]
    }
    levels.append(lvl51)

    # =========================================================================
    # Level 52: Die gefrorene Schlucht (6x6) - 10 steps (limit 12)
    # Wind over gorge + Sacred Orb + Gate.
    # =========================================================================
    lvl52 = {
        "n": "Die gefrorene Schlucht",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Schlucht-Sprung",
        "d": "Ein eisiger Abgrund trennt die Terrassen. Der Aufwind katapultiert KOMA über die Schlucht zum Bergkristall. Entsiegle das Tor, um den Berggarten zu betreten.",
        "w": 6, "h": 6,
        "s": [1, 4, "N"],
        "g": [4, 4],
        "orbs": [[1, 1]],
        "sw": [[4, 1, "cyan"]],
        "gates": [[4, 3, "cyan"]],
        "winds": [
            [1, 3, "N"],
            [4, 2, "S"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
            [0, 1], [5, 1],
            [0, 2], [2, 2], [3, 2], [5, 2],
            [0, 3], [2, 3], [3, 3], [5, 3],
            [0, 4], [2, 4], [3, 4], [5, 4],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "pine", "3,0": "fence_h", "4,0": "pine", "5,0": "wall_h",
            "0,1": "fence_v", "5,1": "fence_v",
            "2,2": "wall_v", "3,2": "wall_v",
            "2,3": "wall_v", "3,3": "wall_v",
            "2,4": "pine", "3,4": "wall_h",
            "0,5": "wall_h", "1,5": "fence_h", "2,5": "wall_h", "3,5": "fence_h", "4,5": "wall_h", "5,5": "wall_h"
        },
        "grass": [[2, 1], [3, 1]]
    }
    levels.append(lvl52)

    # =========================================================================
    # Level 53: Das eisige Kitsune-Portal (7x7) - 15 steps (limit 17)
    # Portals + Wind inertia + 2 Orbs + Switch & Gate.
    # =========================================================================
    lvl53 = {
        "n": "Das eisige Kitsune-Portal",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Portal-Beschleunigung",
        "d": "Das Kitsune-Portal steht mitten im Windkanal! Die Windträgheit schleudert KOMA direkt beim Austritt weiter. Sammle beide Lichter und finde den Weg zum Hof.",
        "w": 7, "h": 7,
        "s": [0, 2, "E"],
        "g": [3, 6],
        "portals": [[2, 2], [4, 4]],
        "orbs": [[5, 4], [1, 5]],
        "sw": [[5, 5, "cyan"]],
        "gates": [[3, 5, "cyan"]],
        "winds": [
            [1, 2, "E"],
            [4, 4, "E"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
            [3, 2], [4, 2], [5, 2], [6, 2],
            [0, 3], [1, 3], [2, 3], [3, 3], [6, 3],
            [0, 4], [1, 4], [2, 4], [3, 4], [6, 4],
            [6, 5],
            [0, 6], [1, 6], [2, 6], [4, 6], [5, 6], [6, 6]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "pine", "3,0": "fence_h", "4,0": "house", "5,0": "pine", "6,0": "wall_h",
            "3,2": "pine", "4,2": "fence_h",
            "1,3": "fence_v", "2,3": "wall_h",
            "6,5": "fence_v",
            "0,6": "wall_h", "1,6": "fence_h", "2,6": "wall_h", "4,6": "wall_h", "5,6": "wall_h", "6,6": "wall_h"
        },
        "grass": [[5, 3], [2, 5]]
    }
    levels.append(lvl53)

    # =========================================================================
    # Level 54: Schneeverwehte Pfade (6x5) - 16 steps (limit 18)
    # Wind-Umleitung + Schalter + Tor.
    # =========================================================================
    lvl54 = {
        "n": "Schneeverwehte Pfade",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Wind-Umleitung",
        "d": "Dichter Schneefall verweht die Stufen. Nutze die abwärtsgerichtete Windböe, um den Schalter im Tal zu erreichen, und umrunde die Schlucht zum Schrein.",
        "w": 6, "h": 5,
        "s": [0, 1, "E"],
        "g": [5, 1],
        "sw": [[2, 3, "cyan"]],
        "gates": [[4, 1, "cyan"]],
        "winds": [
            [1, 1, "E"],
            [3, 1, "S"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
            [0, 2], [1, 2], [2, 2], [5, 2],
            [0, 3],
            [0, 4], [1, 4], [5, 4]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "pine", "2,0": "house", "3,0": "fence_h", "4,0": "pine", "5,0": "wall_h",
            "0,2": "fence_v", "1,2": "wall_h", "2,2": "pine", "5,2": "wall_h",
            "0,3": "fence_v",
            "0,4": "wall_h", "1,4": "fence_h", "5,4": "wall_h"
        },
        "grass": [[2, 1], [3, 3]]
    }
    levels.append(lvl54)

    # =========================================================================
    # Level 55: Kreuzende Böen (6x6) - 19 steps (limit 21)
    # Perpendicular Crosswinds + 2 Orbs.
    # =========================================================================
    lvl55 = {
        "n": "Kreuzende Böen",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Kreuzwinde",
        "d": "Auf dem Bergsattel kreuzen sich tückische Winde. Sammle beide Geisterkristalle, indem du den Ost- und Südwinden gezielt folgst.",
        "w": 6, "h": 6,
        "s": [0, 2, "E"],
        "g": [5, 4],
        "orbs": [[3, 1], [1, 4]],
        "winds": [
            [1, 2, "E"],
            [4, 2, "S"],
            [3, 4, "W"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
            [0, 1], [1, 1], [5, 1],
            [5, 2],
            [0, 3], [2, 3], [5, 3],
            [0, 4],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "fence_h", "2,0": "house", "3,0": "pine", "4,0": "fence_h", "5,0": "wall_h",
            "1,1": "pine", "5,1": "fence_v",
            "2,3": "pine", "5,3": "fence_v",
            "0,5": "wall_h", "1,5": "fence_h", "2,5": "wall_h", "3,5": "fence_h", "4,5": "wall_h", "5,5": "wall_h"
        },
        "grass": [[2, 1], [4, 1]]
    }
    levels.append(lvl55)

    # =========================================================================
    # Level 56: Aufstieg zur 8. Station (8x8) - 21 steps (limit 23)
    # Terraced shrine labyrinth + Portals + Dual Gates + 2 Orbs.
    # =========================================================================
    lvl56 = {
        "n": "Aufstieg zur 8. Station",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Terrassen-Labyrinth",
        "d": "Die achte Station vor dem Gipfel verlangt höchste Meisterschaft: Kitsune-Portale, Doppeltore und Aufwinde müssen in perfekter Harmonie gemeistert werden.",
        "w": 8, "h": 8,
        "s": [0, 6, "E"],
        "g": [7, 1],
        "portals": [[2, 4], [5, 4]],
        "orbs": [[1, 2], [5, 2]],
        "sw": [[3, 6, "cyan"], [6, 2, "magenta"]],
        "gates": [[2, 2, "cyan"], [6, 1, "magenta"]],
        "winds": [
            [1, 6, "E"],
            [2, 3, "N"],
            [5, 3, "N"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
            [0, 3], [3, 3], [4, 3], [6, 3], [7, 3],
            [0, 4], [1, 4], [3, 4], [4, 4], [6, 4], [7, 4],
            [0, 5], [1, 5], [3, 5], [4, 5], [6, 5], [7, 5],
            [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "pine", "3,0": "fence_h", "4,0": "pine", "5,0": "house", "6,0": "fence_h", "7,0": "wall_h",
            "1,1": "fence_h", "3,1": "wall_h", "4,1": "pine",
            "3,3": "pine", "4,3": "pine",
            "1,4": "wall_h", "3,4": "fence_v", "4,4": "wall_h",
            "0,7": "wall_h", "1,7": "fence_h", "2,7": "wall_h", "3,7": "fence_h", "4,7": "wall_h", "5,7": "fence_h", "6,7": "wall_h", "7,7": "wall_h"
        },
        "grass": [[2, 5], [5, 5]]
    }
    levels.append(lvl56)

    # =========================================================================
    # Level 57: Wirbelsturm der vier Winde (7x7) - 25 steps (limit 27)
    # Whirlwind Vortex: 4 cardinal winds + 2 Orbs + Switch & Gate.
    # =========================================================================
    lvl57 = {
        "n": "Wirbelsturm der vier Winde",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Wind-Strudel",
        "d": "Ein kreisender Wirbelsturm tobt über dem Hochplateau! Nutze die Strömung, um die äußeren Schreine zu erreichen, ohne im Windstrudel gefangen zu bleiben.",
        "w": 7, "h": 7,
        "s": [1, 5, "N"],
        "g": [3, 6],
        "orbs": [[3, 1], [5, 3]],
        "sw": [[1, 1, "cyan"]],
        "gates": [[3, 5, "cyan"]],
        "winds": [
            [2, 2, "E"],
            [4, 2, "S"],
            [4, 4, "W"],
            [2, 4, "N"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [0, 1], [2, 1], [4, 1], [6, 1],
            [0, 2], [6, 2],
            [0, 3], [3, 3], [6, 3],
            [0, 4], [6, 4],
            [0, 5], [6, 5],
            [0, 6], [1, 6], [2, 6], [4, 6], [5, 6], [6, 6]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "pine", "3,0": "fence_h", "4,0": "pine", "5,0": "house", "6,0": "wall_h",
            "2,1": "fence_v", "4,1": "fence_v",
            "3,3": "pine",
            "0,6": "wall_h", "1,6": "fence_h", "2,6": "wall_h", "4,6": "wall_h", "5,6": "fence_h", "6,6": "wall_h"
        },
        "grass": [[3, 2], [3, 4]]
    }
    levels.append(lvl57)

    # =========================================================================
    # Level 58: Gegenstrom im Eiskanal (8x7) - 27 steps (limit 29)
    # Dual Gates (Cyan & Magenta) + 2 Orbs + 3 Wind channels.
    # =========================================================================
    lvl58 = {
        "n": "Gegenstrom im Eiskanal",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Dual-Tore & Windkanal",
        "d": "Zwei versiegelte Tore und reißende Windkanäle fordern präzises Timing. Aktiviere beide Wächterschalter und überwinde die Windströme.",
        "w": 8, "h": 7,
        "s": [0, 5, "E"],
        "g": [7, 1],
        "orbs": [[1, 3], [6, 3]],
        "sw": [[2, 5, "cyan"], [6, 5, "magenta"]],
        "gates": [[3, 3, "cyan"], [6, 2, "magenta"]],
        "winds": [
            [1, 5, "E"],
            [4, 3, "E"],
            [4, 1, "W"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [5, 1],
            [0, 2], [1, 2], [2, 2], [4, 2], [5, 2], [7, 2],
            [0, 4], [1, 4], [2, 4], [4, 4], [5, 4], [7, 4],
            [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "pine", "2,0": "house", "3,0": "fence_h", "4,0": "pine", "5,0": "house", "6,0": "fence_h", "7,0": "wall_h",
            "1,2": "pine", "2,2": "wall_h", "4,2": "fence_v", "5,2": "pine",
            "1,4": "wall_h", "2,4": "fence_h", "4,4": "pine", "5,4": "wall_h",
            "0,6": "wall_h", "1,6": "fence_h", "2,6": "wall_h", "3,6": "fence_h", "4,6": "wall_h", "5,6": "fence_h", "6,6": "wall_h", "7,6": "wall_h"
        },
        "grass": [[3, 1], [3, 5]]
    }
    levels.append(lvl58)

    # =========================================================================
    # Level 59: Das verborgene Eistor (7x6) - 29 steps (limit 31)
    # Two separated mountain chambers + Dual colored gates.
    # =========================================================================
    lvl59 = {
        "n": "Das verborgene Eistor",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Zwei Tore im Eis",
        "d": "Zwei uralte Tore versperren den Hauptweg. Nutze die Windböen im Tal, um den Cyan-Schalter zu betätigen, das Magma-Tor zu entsiegeln und den Schrein zu öffnen.",
        "w": 7, "h": 6,
        "s": [0, 4, "N"],
        "g": [5, 1],
        "orbs": [[3, 4]],
        "sw": [[1, 1, "magenta"], [5, 4, "cyan"]],
        "gates": [[3, 3, "cyan"], [5, 2, "magenta"]],
        "winds": [
            [2, 4, "E"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
            [4, 1], [6, 1],
            [1, 2], [6, 2],
            [0, 3], [1, 3], [2, 3], [4, 3], [6, 3],
            [6, 4],
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "pine", "2,0": "house", "3,0": "fence_h", "4,0": "pine", "5,0": "wall_h", "6,0": "wall_h",
            "4,1": "wall_v", "6,1": "fence_v",
            "1,2": "pine", "6,2": "fence_v",
            "0,3": "fence_v", "1,3": "fence_h", "2,3": "wall_h", "4,3": "wall_h", "6,3": "fence_h",
            "6,4": "fence_v",
            "0,5": "wall_h", "1,5": "fence_h", "2,5": "wall_h", "3,5": "fence_h", "4,5": "wall_h", "5,5": "wall_h", "6,5": "wall_h"
        },
        "grass": [[2, 1], [4, 1]]
    }
    levels.append(lvl59)

    # =========================================================================
    # Level 60: Der Geist des Fuji (富士の神) (8x8) - 27 steps (limit 29)
    # The Grand Climax of the 60-Level Campaign!
    # 3 Sacred Imperial Relics at (1, 2), (6, 2), (4, 2).
    # Dual Gates, Kitsune Portals, and Summit Winds.
    # =========================================================================
    lvl60 = {
        "n": "Der Geist des Fuji (富士の神)",
        "c": "Kapitel 06 · Der Heilige Berg Fuji (富士山)",
        "t": "Meisterprüfung",
        "d": "Der heilige Gipfel des Fuji liegt vor dir. Finde alle drei kaiserlichen Relikte, entsiegle die Doppeltore des Berggottes und erbringe die finale Geisterlieferung!",
        "w": 8, "h": 8,
        "s": [3, 7, "N"],
        "g": [4, 1],
        "portals": [[1, 4], [6, 4]],
        "orbs": [[1, 2], [6, 2], [4, 2]],
        "sw": [[1, 6, "cyan"], [6, 6, "magenta"]],
        "gates": [[1, 3, "cyan"], [6, 3, "magenta"]],
        "winds": [
            [3, 6, "W"],
            [4, 6, "E"],
            [4, 4, "N"]
        ],
        "walls": [
            [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
            [0, 1], [1, 1], [2, 1], [3, 1], [5, 1], [6, 1], [7, 1],
            [0, 2], [7, 2],
            [0, 3], [2, 3], [3, 3], [4, 3], [5, 3], [7, 3],
            [0, 4], [7, 4],
            [0, 5], [2, 5], [3, 5], [4, 5], [5, 5], [7, 5],
            [0, 6], [7, 6],
            [0, 7], [1, 7], [2, 7], [5, 7], [6, 7], [7, 7]
        ],
        "obstacles": {
            "0,0": "wall_h", "1,0": "house", "2,0": "pine", "3,0": "torii", "4,0": "house", "5,0": "torii", "6,0": "pine", "7,0": "wall_h",
            "1,1": "pine", "2,1": "wall_h", "3,1": "wall_v", "5,1": "wall_v", "6,1": "pine",
            "3,3": "pine", "4,3": "pine",
            "2,5": "pine", "3,5": "fence_h", "4,5": "fence_h", "5,5": "pine",
            "0,7": "wall_h", "1,7": "fence_h", "2,7": "wall_h", "5,7": "wall_h", "6,7": "fence_h", "7,7": "wall_h"
        },
        "grass": [[3, 4], [4, 2], [4, 7]]
    }
    levels.append(lvl60)

    return levels

if __name__ == "__main__":
    lvls = build_ordered_levels()
    print(f"Generated {len(lvls)} candidate levels. Running BFS solver on all...")

    results = []
    all_ok = True

    for i, lvl in enumerate(lvls, 51):
        sol = solve(lvl, max_depth=35)
        if sol is None:
            print(f"ERROR: Level {i} ({lvl['n']}) has NO SOLUTION!")
            all_ok = False
            continue

        step_count = len(sol)
        limit = step_count + 2
        lvl["solution"] = sol
        lvl["limit"] = limit

        ok, msg = simulate(lvl, sol)
        print(f"Level {i}: {lvl['n']} -> Solved in {step_count} steps (limit {limit}) | Valid: {ok} | Solution: {' '.join(sol)}")
        if not ok:
            all_ok = False
        results.append(lvl)

    if all_ok:
        with open("scripts/fuji_verified.json", "w") as f:
            json.dump(results, f, indent=2)
        print("Successfully saved all 10 verified levels to scripts/fuji_verified.json")
    else:
        print("FAILED: Some levels could not be verified.")
        sys.exit(1)
