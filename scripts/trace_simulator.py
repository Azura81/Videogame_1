from scripts.simulator import DELTA, TURN_LEFT, TURN_RIGHT

def trace(lvl, solution):
    x, y, d = lvl["s"]
    open_gates = set()
    collected_orbs = set()
    walls = set(tuple(w) for w in lvl.get("walls", []))
    all_gates = lvl.get("gates") or lvl.get("gate") or []
    all_sws = lvl.get("sw") or []
    portals = lvl.get("portals") or []
    orbs = lvl.get("orbs") or []
    winds = lvl.get("winds") or []
    
    print(f"START: ({x}, {y}, {d})")
    for idx, cmd in enumerate(solution):
        if cmd == "L":
            d = TURN_LEFT[d]
            print(f"Step {idx+1}: L -> facing {d}")
        elif cmd == "R":
            d = TURN_RIGHT[d]
            print(f"Step {idx+1}: R -> facing {d}")
        elif cmd == "F":
            dx, dy = DELTA[d]
            nx, ny = x + dx, y + dy
            print(f"Step {idx+1}: F from ({x},{y},{d}) -> ({nx},{ny})", end="")
            if nx < 0 or ny < 0 or nx >= lvl["w"] or ny >= lvl["h"]:
                print(f" -> OOB!")
                return False
            if (nx, ny) in walls:
                print(f" -> WALL!")
                return False
            gate_match = [g for g in all_gates if g[0] == nx and g[1] == ny]
            if gate_match:
                color = gate_match[0][2] if len(gate_match[0]) > 2 else "magenta"
                if color not in open_gates:
                    print(f" -> GATE {color} CLOSED!")
                    return False
            x, y = nx, ny
            print(f" -> landed at ({x},{y})", end="")
            
            if len(portals) == 2:
                p1, p2 = tuple(portals[0]), tuple(portals[1])
                if (x, y) == p1:
                    x, y = p2
                    print(f" -> teleported to ({x},{y})", end="")
                elif (x, y) == p2:
                    x, y = p1
                    print(f" -> teleported to ({x},{y})", end="")
            if (x, y) in [tuple(o) for o in orbs]:
                collected_orbs.add((x, y))
                print(f" [ORB!]", end="")
                
            pushes = 0
            while pushes < 10:
                wm = [w for w in winds if w[0] == x and w[1] == y]
                if not wm:
                    break
                wdx, wdy = DELTA[wm[0][2]]
                wx, wy = x + wdx, y + wdy
                if wx < 0 or wy < 0 or wx >= lvl["w"] or wy >= lvl["h"] or (wx, wy) in walls:
                    break
                x, y = wx, wy
                pushes += 1
                print(f" -> wind push {wm[0][2]} to ({x},{y})", end="")
                if (x, y) in [tuple(o) for o in orbs]:
                    collected_orbs.add((x, y))
                    print(f" [ORB!]", end="")
            print()
        elif cmd == "A":
            sw_match = [s for s in all_sws if s[0] == x and s[1] == y]
            if sw_match:
                open_gates.add(sw_match[0][2])
                print(f"Step {idx+1}: A -> activated {sw_match[0][2]}")
            else:
                print(f"Step {idx+1}: A -> NO SWITCH at ({x},{y})")
                return False

    print(f"FINAL: ({x}, {y}) vs GOAL {lvl['g']}")
    return (x, y) == tuple(lvl["g"])

