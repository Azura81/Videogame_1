from collections import deque
from scripts.simulator import DELTA, TURN_LEFT, TURN_RIGHT

def solve(lvl, max_depth=32):
    start_x, start_y, start_d = lvl["s"]
    walls = set(tuple(w) for w in lvl.get("walls", []))
    all_gates = lvl.get("gates") or lvl.get("gate") or []
    all_sws = lvl.get("sw") or []
    portals = lvl.get("portals") or []
    orbs = tuple(sorted(tuple(o) for o in lvl.get("orbs", [])))
    winds = lvl.get("winds") or []
    goal = tuple(lvl["g"])
    w, h = lvl["w"], lvl["h"]

    init_state = (start_x, start_y, start_d, frozenset(), frozenset())
    queue = deque([(init_state, [])])
    visited = {init_state}

    while queue:
        state, path = queue.popleft()
        x, y, d, open_gates, collected_orbs = state

        if len(path) >= max_depth:
            continue

        for cmd in ["F", "L", "R", "A"]:
            if cmd == "L":
                nd = TURN_LEFT[d]
                ns = (x, y, nd, open_gates, collected_orbs)
                if ns not in visited:
                    visited.add(ns)
                    queue.append((ns, path + ["L"]))
            elif cmd == "R":
                nd = TURN_RIGHT[d]
                ns = (x, y, nd, open_gates, collected_orbs)
                if ns not in visited:
                    visited.add(ns)
                    queue.append((ns, path + ["R"]))
            elif cmd == "A":
                sw_match = [s for s in all_sws if s[0] == x and s[1] == y]
                if sw_match:
                    color = sw_match[0][2] if len(sw_match[0]) > 2 else "cyan"
                    new_gates = set(open_gates)
                    new_gates.add(color)
                    if len(all_gates) == 1:
                        sole_color = all_gates[0][2] if len(all_gates[0]) > 2 else "magenta"
                        new_gates.add(sole_color)
                    ns = (x, y, d, frozenset(new_gates), collected_orbs)
                    if ns not in visited:
                        visited.add(ns)
                        queue.append((ns, path + ["A"]))
            elif cmd == "F":
                dx, dy = DELTA[d]
                nx, ny = x + dx, y + dy
                if nx < 0 or ny < 0 or nx >= w or ny >= h:
                    continue
                if (nx, ny) in walls:
                    continue
                gate_match = [g for g in all_gates if g[0] == nx and g[1] == ny]
                if gate_match:
                    color = gate_match[0][2] if len(gate_match[0]) > 2 else "magenta"
                    if color not in open_gates and not (len(all_gates) == 1 and len(open_gates) > 0):
                        continue
                cur_x, cur_y = nx, ny
                cur_orbs = set(collected_orbs)
                if len(portals) == 2:
                    p1, p2 = tuple(portals[0]), tuple(portals[1])
                    if (cur_x, cur_y) == p1:
                        cur_x, cur_y = p2
                    elif (cur_x, cur_y) == p2:
                        cur_x, cur_y = p1
                if (cur_x, cur_y) in orbs:
                    cur_orbs.add((cur_x, cur_y))

                # Wind push
                pushes = 0
                while pushes < 10:
                    wm = [wind for wind in winds if wind[0] == cur_x and wind[1] == cur_y]
                    if not wm:
                        break
                    wdx, wdy = DELTA[wm[0][2]]
                    wx, wy = cur_x + wdx, cur_y + wdy
                    if wx < 0 or wy < 0 or wx >= w or wy >= h:
                        break
                    if (wx, wy) in walls:
                        break
                    gm = [g for g in all_gates if g[0] == wx and g[1] == wy]
                    if gm:
                        c = gm[0][2] if len(gm[0]) > 2 else "magenta"
                        if c not in open_gates and not (len(all_gates) == 1 and len(open_gates) > 0):
                            break
                    cur_x, cur_y = wx, wy
                    pushes += 1
                    if (cur_x, cur_y) in orbs:
                        cur_orbs.add((cur_x, cur_y))
                    if len(portals) == 2:
                        p1, p2 = tuple(portals[0]), tuple(portals[1])
                        if (cur_x, cur_y) == p1:
                            cur_x, cur_y = p2
                        elif (cur_x, cur_y) == p2:
                            cur_x, cur_y = p1

                if (cur_x, cur_y) == goal and len(cur_orbs) == len(orbs):
                    return path + ["F"]

                ns = (cur_x, cur_y, d, open_gates, frozenset(cur_orbs))
                if ns not in visited:
                    visited.add(ns)
                    queue.append((ns, path + ["F"]))

    return None
