import collections
import json

DELTA = {"N": (0, -1), "E": (1, 0), "S": (0, 1), "W": (-1, 0)}
TURN_LEFT = {"N": "W", "W": "S", "S": "E", "E": "N"}
TURN_RIGHT = {"N": "E", "E": "S", "S": "W", "W": "N"}

def solve_level(lvl, max_depth=30, find_multiple=False):
    """
    Finds shortest path(s) using BFS.
    Returns: list of solutions (strings of commands)
    """
    sx, sy, sd = lvl["s"]
    gx, gy = lvl["g"]
    walls = set(tuple(w) for w in lvl.get("walls", []))
    all_gates = lvl.get("gates") or lvl.get("gate") or []
    all_sws = lvl.get("sw") or []
    portals = lvl.get("portals") or []
    orbs = set(tuple(o) for o in lvl.get("orbs", []))
    total_orbs = len(orbs)
    
    # Initial state
    init_state = (sx, sy, sd, frozenset(), frozenset())
    
    queue = collections.deque([(init_state, [])])
    visited = {init_state: 0}
    solutions = []
    
    while queue:
        state, path = queue.popleft()
        x, y, d, open_gates, collected_orbs = state
        
        if len(path) > max_depth:
            continue
            
        # Check goal condition
        if (x, y) == (gx, gy) and len(collected_orbs) == total_orbs:
            solutions.append(path)
            if not find_multiple:
                return solutions
            if len(solutions) >= 5:
                return solutions
            continue
            
        # Next possible actions: F, L, R, A
        # 1. Turn Left
        nl_state = (x, y, TURN_LEFT[d], open_gates, collected_orbs)
        if nl_state not in visited or len(path) + 1 < visited[nl_state]:
            visited[nl_state] = len(path) + 1
            queue.append((nl_state, path + ["L"]))
            
        # 2. Turn Right
        nr_state = (x, y, TURN_RIGHT[d], open_gates, collected_orbs)
        if nr_state not in visited or len(path) + 1 < visited[nr_state]:
            visited[nr_state] = len(path) + 1
            queue.append((nr_state, path + ["R"]))
            
        # 3. Action
        sw_match = [s for s in all_sws if s[0] == x and s[1] == y]
        if sw_match:
            color = sw_match[0][2] if len(sw_match[0]) > 2 else "cyan"
            new_open = set(open_gates)
            new_open.add(color)
            if len(all_gates) == 1:
                sole_color = all_gates[0][2] if len(all_gates[0]) > 2 else "magenta"
                new_open.add(sole_color)
            f_open = frozenset(new_open)
            if f_open != open_gates:
                na_state = (x, y, d, f_open, collected_orbs)
                if na_state not in visited or len(path) + 1 < visited[na_state]:
                    visited[na_state] = len(path) + 1
                    queue.append((na_state, path + ["A"]))
                    
        # 4. Forward
        dx, dy = DELTA[d]
        nx, ny = x + dx, y + dy
        if 0 <= nx < lvl["w"] and 0 <= ny < lvl["h"]:
            if (nx, ny) not in walls:
                # Check gate
                gate_match = [g for g in all_gates if g[0] == nx and g[1] == ny]
                is_blocked = False
                if gate_match:
                    g_color = gate_match[0][2] if len(gate_match[0]) > 2 else "magenta"
                    if g_color not in open_gates:
                        is_blocked = True
                
                if not is_blocked:
                    tx, ty = nx, ny
                    # Portal check
                    if len(portals) == 2:
                        p1, p2 = tuple(portals[0]), tuple(portals[1])
                        if (tx, ty) == p1:
                            tx, ty = p2
                        elif (tx, ty) == p2:
                            tx, ty = p1
                    
                    new_orbs = set(collected_orbs)
                    if (tx, ty) in orbs:
                        new_orbs.add((tx, ty))
                    f_orbs = frozenset(new_orbs)
                    
                    nf_state = (tx, ty, d, open_gates, f_orbs)
                    if nf_state not in visited or len(path) + 1 < visited[nf_state]:
                        visited[nf_state] = len(path) + 1
                        queue.append((nf_state, path + ["F"]))
                        
    return solutions

print("Solver module ready")
