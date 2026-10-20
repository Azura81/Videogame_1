import json

# Direction helpers
# N = [0, -1], E = [1, 0], S = [0, 1], W = [-1, 0]
DELTA = {"N": (0, -1), "E": (1, 0), "S": (0, 1), "W": (-1, 0)}
TURN_LEFT = {"N": "W", "W": "S", "S": "E", "E": "N"}
TURN_RIGHT = {"N": "E", "E": "S", "S": "W", "W": "N"}

def simulate(lvl, solution):
    x, y, d = lvl["s"]
    open_gates = set()
    collected_orbs = set()
    walls = set(tuple(w) for w in lvl.get("walls", []))
    all_gates = lvl.get("gates") or lvl.get("gate") or []
    all_sws = lvl.get("sw") or []
    portals = lvl.get("portals") or []
    orbs = lvl.get("orbs") or []
    
    for idx, cmd in enumerate(solution):
        if cmd == "L":
            d = TURN_LEFT[d]
        elif cmd == "R":
            d = TURN_RIGHT[d]
        elif cmd == "F":
            dx, dy = DELTA[d]
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= lvl["w"] or ny >= lvl["h"]:
                return False, f"Step {idx+1} ({cmd}): Out of bounds at ({nx}, {ny})"
            if (nx, ny) in walls:
                return False, f"Step {idx+1} ({cmd}): Hit wall at ({nx}, {ny})"
            
            # Check gates
            gate_match = [g for g in all_gates if g[0] == nx and g[1] == ny]
            if gate_match:
                color = gate_match[0][2] if len(gate_match[0]) > 2 else "magenta"
                if color not in open_gates and not (len(all_gates) == 1 and len(open_gates) > 0):
                    return False, f"Step {idx+1} ({cmd}): Blocked by gate {color} at ({nx}, {ny})"
            
            x, y = nx, ny
            
            # Portal check
            if len(portals) == 2:
                p1, p2 = tuple(portals[0]), tuple(portals[1])
                if (x, y) == p1:
                    x, y = p2
                elif (x, y) == p2:
                    x, y = p1
            
            # Orb check
            if (x, y) in [tuple(o) for o in orbs]:
                collected_orbs.add((x, y))
                
            # Wind tile check (pushes KOMA in direction wdir)
            winds = lvl.get("winds") or []
            wind_pushes = 0
            while wind_pushes < 10:
                wind_match = [w for w in winds if w[0] == x and w[1] == y]
                if not wind_match:
                    break
                wdir = wind_match[0][2]
                wdx, wdy = DELTA[wdir]
                wx, wy = x + wdx, y + wdy
                # Check bounds
                if wx < 0 or wy < 0 or wx >= lvl["w"] or wy >= lvl["h"]:
                    break
                # Check walls
                if (wx, wy) in walls:
                    break
                # Check gates
                gate_match_w = [g for g in all_gates if g[0] == wx and g[1] == wy]
                if gate_match_w:
                    color = gate_match_w[0][2] if len(gate_match_w[0]) > 2 else "magenta"
                    if color not in open_gates and not (len(all_gates) == 1 and len(open_gates) > 0):
                        break
                # Apply wind push
                x, y = wx, wy
                wind_pushes += 1
                if (x, y) in [tuple(o) for o in orbs]:
                    collected_orbs.add((x, y))
                if len(portals) == 2:
                    p1, p2 = tuple(portals[0]), tuple(portals[1])
                    if (x, y) == p1:
                        x, y = p2
                    elif (x, y) == p2:
                        x, y = p1
                
        elif cmd == "A":
            sw_match = [s for s in all_sws if s[0] == x and s[1] == y]
            if not sw_match:
                return False, f"Step {idx+1} ({cmd}): Pressed A with no switch at ({x}, {y})"
            color = sw_match[0][2] if len(sw_match[0]) > 2 else "cyan"
            open_gates.add(color)
            if len(all_gates) == 1:
                sole_color = all_gates[0][2] if len(all_gates[0]) > 2 else "magenta"
                open_gates.add(sole_color)
    
    # Check goal
    if (x, y) != tuple(lvl["g"]):
        return False, f"Goal not reached! Ended at ({x}, {y}), Goal is {lvl['g']}"
    
    if len(collected_orbs) < len(orbs):
        return False, f"Only collected {len(collected_orbs)}/{len(orbs)} orbs"
        
    if len(solution) > lvl["limit"]:
        return False, f"Solution {len(solution)} exceeds limit {lvl['limit']}"
        
    return True, f"Success ({len(solution)} steps <= {lvl['limit']})"

print("Simulator loaded successfully")
