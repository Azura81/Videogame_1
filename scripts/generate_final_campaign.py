import json
import os
import sys

sys.path.append(os.path.dirname(__file__))
from simulator import simulate, DELTA, TURN_LEFT, TURN_RIGHT
from solve_and_verify import solve_level

def create_walls(w, h, open_tiles):
    open_set = set(tuple(p) for p in open_tiles)
    walls = []
    for y in range(h):
        for x in range(w):
            if (x, y) not in open_set:
                walls.append([x, y])
    return walls

import build_full_campaign

campaign = []
# Create a fresh deep copy of levels
for lvl in build_full_campaign.campaign:
    campaign.append(json.loads(json.dumps(lvl)))

# =========================================================================
# 1. Level 11: Zwei Lichter (Dual-Tore)
# Must pass tests/game.spec.js with sequence:
# ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"]
# Both Cyan and Magenta switches MUST be mandatory.
# =========================================================================
campaign[10]["walls"] = sorted(campaign[10]["walls"] + [[4, 2]])
campaign[10]["gates"] = [[2, 2, "cyan"], [3, 2, "cyan"], [3, 1, "magenta"]]
campaign[10]["sw"] = [[1, 3, "cyan"], [3, 3, "magenta"]]
campaign[10]["solution"] = ["F", "A", "R", "F", "F", "A", "L", "F", "L", "F", "R", "F", "R", "F", "F"]
campaign[10]["limit"] = 18

# =========================================================================
# 2. Level 12: Gegensätze (Parallele Gassen)
# Both Cyan and Magenta gates strictly mandatory.
# =========================================================================
lvl12_open = [
    [0, 1], [1, 1], [2, 1],
    [2, 2], [2, 3],
    [3, 3], [4, 3],
    [4, 2], [4, 1], [5, 1]
]
campaign[11]["walls"] = create_walls(6, 6, lvl12_open)
campaign[11]["sw"] = [[2, 1, "cyan"], [2, 3, "magenta"]]
campaign[11]["gates"] = [[2, 2, "cyan"], [4, 1, "magenta"]]
campaign[11]["g"] = [5, 1]
campaign[11]["solution"] = ["F", "F", "R", "A", "F", "F", "L", "A", "F", "F", "L", "F", "F", "R", "F"]
campaign[11]["limit"] = 18

# =========================================================================
# 3. Level 14: Spiegelgarten (Symmetrie)
# Central sanctum locked by Magenta gate, East wing locked by Cyan gate.
# =========================================================================
lvl14_open = [
    [3, 5], [3, 4], [3, 3], [3, 2], [3, 1],
    [1, 3], [2, 3], [4, 3], [5, 3]
]
campaign[13]["walls"] = create_walls(6, 6, lvl14_open)
campaign[13]["sw"] = [[1, 3, "cyan"], [5, 3, "magenta"]]
campaign[13]["gates"] = [[4, 3, "cyan"], [3, 2, "magenta"]]
campaign[13]["g"] = [3, 1]
campaign[13]["solution"] = ["F", "F", "L", "F", "F", "L", "L", "A", "F", "F", "F", "F", "L", "L", "A", "F", "F", "R", "F", "F"]
campaign[13]["limit"] = 24

# =========================================================================
# 4. Level 25: Kitsunes Irrgarten (Labyrinth)
# Island 1 (x <= 2) and Island 2 (x >= 4) separated by solid wall at x = 3.
# Portal is 100% mandatory.
# =========================================================================
lvl25_open = [
    [1, 6], [1, 5], [1, 4], [1, 3], [2, 3],
    [5, 5], [5, 4], [5, 3], [4, 3], [5, 2], [5, 1], [6, 1]
]
campaign[24]["walls"] = create_walls(7, 7, lvl25_open)
campaign[24]["sw"] = [[4, 3, "cyan"]]
campaign[24]["gates"] = [[5, 1, "cyan"]]
campaign[24]["portals"] = [[2, 3], [5, 5]]
campaign[24]["g"] = [6, 1]
campaign[24]["solution"] = ["F", "F", "F", "R", "F", "L", "F", "F", "L", "F", "L", "L", "A", "F", "L", "F", "F", "R", "F"]
campaign[24]["limit"] = 22

# =========================================================================
# 5. Level 26: Sprung ins Torii (Finale Kapitel 04)
# Both Cyan and Magenta gates strictly mandatory before teleporting.
# =========================================================================
lvl26_open = [
    [0, 3], [1, 3], [2, 3],
    [2, 2], [2, 1],
    [2, 4], [2, 5],
    [4, 3], [4, 4], [4, 5], [5, 5], [6, 5]
]
campaign[25]["walls"] = create_walls(7, 7, lvl26_open)
campaign[25]["sw"] = [[2, 3, "cyan"], [2, 1, "magenta"]]
campaign[25]["gates"] = [[4, 4, "magenta"], [5, 5, "cyan"]]
campaign[25]["portals"] = [[2, 5], [4, 3]]
campaign[25]["g"] = [6, 5]
campaign[25]["solution"] = ["F", "F", "L", "A", "F", "F", "L", "L", "A", "F", "F", "F", "F", "F", "F", "L", "F", "F"]
campaign[25]["limit"] = 22

# =========================================================================
# 6. Level 50: Die Legende von KOMA (Meister-Finale)
# Goal at [2, 4] behind Gold gate at [2, 3]. Direct shortcut from [2, 6] blocked.
# Cyan, Magenta, Gold, both Orbs, and Portals strictly mandatory.
# =========================================================================
lvl50_open = [
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [4, 7],
    [6, 3], [6, 2], [6, 1],
    [5, 1], [4, 1], [3, 1], [2, 1],
    [2, 2], [2, 3], [2, 4]
]
campaign[49]["walls"] = create_walls(8, 8, lvl50_open)
campaign[49]["sw"] = [[2, 6, "cyan"], [6, 1, "magenta"], [2, 1, "gold"]]
campaign[49]["gates"] = [[4, 6, "cyan"], [4, 1, "magenta"], [2, 3, "gold"]]
campaign[49]["orbs"] = [[4, 6], [4, 1]]
campaign[49]["portals"] = [[4, 7], [6, 3]]
campaign[49]["g"] = [2, 4]
campaign[49]["solution"] = ["F", "F", "A", "F", "F", "R", "F", "L", "L", "F", "F", "L", "A", "F", "F", "F", "F", "L", "A", "F", "F", "F"]
campaign[49]["limit"] = 26

# =========================================================================
# 7. Verification: ZERO BYPASSES GUARANTEE
# =========================================================================
print("=== VERIFYING ALL 50 LEVELS FOR ZERO BYPASSES ===")
all_passed = True
for idx, lvl in enumerate(campaign):
    # Simulate designated solution
    ok, msg = simulate(lvl, lvl["solution"])
    if not ok:
        print(f"❌ Level {idx+1} ({lvl['n']}) solution failed: {msg}")
        all_passed = False
        continue

    # Verify no gate bypass
    gates = lvl.get("gates") or lvl.get("gate") or []
    if gates:
        t_nosw = dict(lvl)
        t_nosw["sw"] = []
        if solve_level(t_nosw, max_depth=lvl.get("limit", 30), find_multiple=False):
            print(f"❌ Level {idx+1} ({lvl['n']}): GATE IS BYPASSABLE!")
            all_passed = False

    # Verify each gate color is strictly required in multi-gate levels
    sws = lvl.get("sw") or []
    if len(gates) > 1:
        gate_colors = set(g[2] if len(g) > 2 else "magenta" for g in gates)
        for c in gate_colors:
            t_c = dict(lvl)
            t_c["sw"] = [s for s in sws if (s[2] if len(s) > 2 else "cyan") != c]
            if solve_level(t_c, max_depth=lvl.get("limit", 30), find_multiple=False):
                print(f"❌ Level {idx+1} ({lvl['n']}): Gate color '{c}' is NOT needed!")
                all_passed = False

    # Verify portal is strictly required
    portals = lvl.get("portals") or []
    if len(portals) == 2:
        t_noport = dict(lvl)
        t_noport["portals"] = []
        if solve_level(t_noport, max_depth=lvl.get("limit", 30), find_multiple=False):
            print(f"❌ Level {idx+1} ({lvl['n']}): PORTAL IS BYPASSABLE!")
            all_passed = False

if not all_passed:
    print("❌ Verification failed. Fix issues before proceeding.")
    sys.exit(1)

print("🎯 ALL 50 LEVELS VERIFIED: 100% AIRTIGHT, ZERO BYPASSES!")

# =========================================================================
# 8. Enrich with Japanese Garden 3D Aesthetics (Decorations)
# =========================================================================
print("\n=== DECORATING 50 LEVELS WITH JAPANESE GARDEN AESTHETICS ===")
for idx, lvl in enumerate(campaign):
    w, h = lvl["w"], lvl["h"]
    walls = set(tuple(p) for p in lvl.get("walls", []))
    gates = set(tuple(g[:2]) for g in (lvl.get("gates") or lvl.get("gate") or []))
    sws = set(tuple(s[:2]) for s in lvl.get("sw", []))
    portals = set(tuple(p) for p in lvl.get("portals", []))
    orbs = set(tuple(o) for o in lvl.get("orbs", []))
    start = tuple(lvl["s"][:2])
    goal = tuple(lvl["g"])

    # 1. Obstacles (Townhouses, Pavilions, Bamboo Fences, Stone Walls, Niwaki Pines, Sakura Trees)
    obstacles = {}
    for (wx, wy) in sorted(walls):
        key = f"{wx},{wy}"
        has_h = (wx - 1, wy) in walls or (wx + 1, wy) in walls
        has_v = (wx, wy - 1) in walls or (wx, wy + 1) in walls
        seed = (wx * 11 + wy * 17 + idx * 7) % 100

        if (wx + wy * 3) % 13 == 0 and w >= 6 and 0 < wx < w - 1 and 0 < wy < h - 1:
            obstacles[key] = "house"
        elif (wx * 3 + wy * 5) % 17 == 0 and w >= 6 and 0 < wx < w - 1 and 0 < wy < h - 1:
            obstacles[key] = "pavilion"
        elif (has_h or has_v) and seed < 45:
            obstacles[key] = "fence_h" if has_h else "fence_v"
        elif (has_h or has_v) and seed < 75:
            obstacles[key] = "wall_h" if has_h else "wall_v"
        elif seed < 88:
            obstacles[key] = "pine"
        else:
            obstacles[key] = "sakura"

    lvl["obstacles"] = obstacles

    # 2. Lush Moss / Meadow Tiles (15-25% of walkable tiles)
    grass_tiles = []
    walkable = [(x, y) for y in range(h) for x in range(w) if (x, y) not in walls]
    for (x, y) in walkable:
        if (x, y) not in gates and (x, y) not in sws and (x, y) not in portals and (x, y) != goal and (x, y) != start:
            if (x * 7 + y * 13 + idx * 5) % 4 == 0:
                grass_tiles.append([x, y])
    lvl["grass"] = grass_tiles

# =========================================================================
# 9. Write to js/levels.js
# =========================================================================
levels_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "js", "levels.js"))
output_js = """/**
 * KOMA: Spirit Delivery - 50 Level Campaign
 * Fully verified for puzzle depth and zero gate/portal bypasses.
 * Features Japanese Garden aesthetics: Machiya houses, Pavilions,
 * Bamboo fences, Stone walls, Sculpted pines, Sakura blossoms, and Moss meadows.
 */
const LEVELS = """ + json.dumps(campaign, indent=2, ensure_ascii=False) + """;
"""

with open(levels_path, "w", encoding="utf-8") as f:
    f.write(output_js)

print(f"\n✨ Successfully wrote 50 decorated, airtight levels to {levels_path}!")
