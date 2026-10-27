/**
 * KOMA: Spirit Delivery - Daily Shrine Trial & Streak Engine (js/daily.js)
 * Procedurally generates a unique, hardcore daily puzzle for every calendar date.
 * Enforces ZERO camera credits (blind spatial planning) and tracks player daily streaks.
 * Verified with built-in BFS graph solver for 100% guaranteed solvability.
 */

(function() {
  "use strict";

  // --- Seeded PRNG (Mulberry32) ---
  function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function dateToSeed(dateStr) {
    const parts = dateStr.split("-").map(Number);
    return (parts[0] * 10000 + parts[1] * 100 + parts[2]) >>> 0;
  }

  const DELTA = { "N": [0, -1], "S": [0, 1], "E": [1, 0], "W": [-1, 0] };
  const TURN_LEFT = { "N": "W", "W": "S", "S": "E", "E": "N" };
  const TURN_RIGHT = { "N": "E", "E": "S", "S": "W", "W": "N" };

  // --- Fast BFS Level Solver ---
  function solveLevel(lvl, maxDepth = 36) {
    const [sx, sy, sd] = lvl.s;
    const w = lvl.w, h = lvl.h;
    const walls = new Set(lvl.walls.map(pt => `${pt[0]},${pt[1]}`));
    const sws = lvl.sw || [];
    const gates = lvl.gates || [];
    const portals = lvl.portals || [];
    const winds = lvl.winds || [];
    const orbs = (lvl.orbs || []).map(o => `${o[0]},${o[1]}`).sort();
    const orbKey = (collected) => Array.from(collected).sort().join(";");

    const initState = `${sx},${sy},${sd}|${orbKey(new Set())}|`;
    const queue = [{ x: sx, y: sy, d: sd, gates: new Set(), orbs: new Set(), path: [] }];
    const visited = new Set([initState]);

    while (queue.length > 0) {
      const cur = queue.shift();
      if (cur.path.length >= maxDepth) continue;

      for (const cmd of ["F", "L", "R", "A"]) {
        if (cmd === "L") {
          const nd = TURN_LEFT[cur.d];
          const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({ x: cur.x, y: cur.y, d: nd, gates: new Set(cur.gates), orbs: new Set(cur.orbs), path: [...cur.path, "L"] });
          }
        } else if (cmd === "R") {
          const nd = TURN_RIGHT[cur.d];
          const stateKey = `${cur.x},${cur.y},${nd}|${orbKey(cur.orbs)}|${Array.from(cur.gates).sort().join(",")}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({ x: cur.x, y: cur.y, d: nd, gates: new Set(cur.gates), orbs: new Set(cur.orbs), path: [...cur.path, "R"] });
          }
        } else if (cmd === "A") {
          const swMatch = sws.find(s => s[0] === cur.x && s[1] === cur.y);
          if (swMatch) {
            const color = swMatch[2] || "cyan";
            const newGates = new Set(cur.gates);
            newGates.add(color);
            if (gates.length === 1) newGates.add(gates[0][2] || "magenta");
            const stateKey = `${cur.x},${cur.y},${cur.d}|${orbKey(cur.orbs)}|${Array.from(newGates).sort().join(",")}`;
            if (!visited.has(stateKey)) {
              visited.add(stateKey);
              queue.push({ x: cur.x, y: cur.y, d: cur.d, gates: newGates, orbs: new Set(cur.orbs), path: [...cur.path, "A"] });
            }
          }
        } else if (cmd === "F") {
          const [dx, dy] = DELTA[cur.d];
          let nx = cur.x + dx;
          let ny = cur.y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (walls.has(`${nx},${ny}`)) continue;

          const gMatch = gates.find(g => g[0] === nx && g[1] === ny);
          if (gMatch) {
            const color = gMatch[2] || "magenta";
            if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) continue;
          }

          let cx = nx;
          let cy = ny;
          const newOrbs = new Set(cur.orbs);

          // Kitsune Portals
          if (portals.length === 2) {
            if (cx === portals[0][0] && cy === portals[0][1]) {
              cx = portals[1][0]; cy = portals[1][1];
            } else if (cx === portals[1][0] && cy === portals[1][1]) {
              cx = portals[0][0]; cy = portals[0][1];
            }
          }
          if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);

          // Wind currents & inertia
          let pushes = 0;
          while (pushes < 10) {
            const wm = winds.find(w => w[0] === cx && w[1] === cy);
            if (!wm) break;
            const [wdx, wdy] = DELTA[wm[2]];
            const wx = cx + wdx;
            const wy = cy + wdy;
            if (wx < 0 || wy < 0 || wx >= w || wy >= h) break;
            if (walls.has(`${wx},${wy}`)) break;
            const wGate = gates.find(g => g[0] === wx && g[1] === wy);
            if (wGate) {
              const color = wGate[2] || "magenta";
              if (!cur.gates.has(color) && !(gates.length === 1 && cur.gates.size > 0)) break;
            }
            cx = wx;
            cy = wy;
            pushes++;
            if (orbs.includes(`${cx},${cy}`)) newOrbs.add(`${cx},${cy}`);
            if (portals.length === 2) {
              if (cx === portals[0][0] && cy === portals[0][1]) {
                cx = portals[1][0]; cy = portals[1][1];
              } else if (cx === portals[1][0] && cy === portals[1][1]) {
                cx = portals[0][0]; cy = portals[0][1];
              }
            }
          }

          // Goal torii check
          if (cx === lvl.g[0] && cy === lvl.g[1]) {
            if (newOrbs.size === orbs.length) {
              return { solved: true, steps: cur.path.length + 1, path: [...cur.path, "F"] };
            }
          }

          const stateKey = `${cx},${cy},${cur.d}|${orbKey(newOrbs)}|${Array.from(cur.gates).sort().join(",")}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push({ x: cx, y: cy, d: cur.d, gates: new Set(cur.gates), orbs: newOrbs, path: [...cur.path, "F"] });
          }
        }
      }
    }
    return { solved: false, steps: 0, path: [] };
  }

  // --- Master Daily Level Archetypes (One for each day of the week, with seed variations) ---

  function buildOuterWalls(w, h) {
    const walls = [];
    for (let x = 0; x < w; x++) { walls.push([x, 0]); walls.push([x, h - 1]); }
    for (let y = 1; y < h - 1; y++) { walls.push([0, y]); walls.push([w - 1, y]); }
    return walls;
  }

  function generateDailyLevel(dateStr) {
    const seed = dateToSeed(dateStr);
    const dateObj = new Date(dateStr + "T12:00:00");
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ...
    const rng = mulberry32(seed);

    const w = 7, h = 7;
    const baseWalls = buildOuterWalls(w, h);

    // 7 Distinct Master Archetypes
    const archetypes = [
      // 0: Sonntag - Das Himmlische Meister-Tor (Hardcore Grand Sanctum)
      () => ({
        n: "Das Himmlische Tor",
        c: "Tägliche Schreinprüfung · Sonntag",
        t: "0 Kameraschwenker · Grand Sanctum",
        d: "Sonntags-Meisterprüfung: Sammle alle drei heiligen Relikte, meistere die Windträgheit und aktiviere das Torii ohne Kameradrehung!",
        w, h,
        s: [1, 5, "N"],
        g: [5, 1],
        orbs: [[1, 2], [3, 3], [5, 4]],
        sw: [[5, 5, "cyan"], [1, 4, "magenta"]],
        gates: [[5, 2, "cyan"], [3, 4, "magenta"]],
        portals: [[1, 1], [3, 5]],
        winds: [[1, 3, "N"], [4, 4, "W"]],
        walls: [...baseWalls, [2, 1], [2, 2], [4, 2], [2, 4]],
        maxCredits: 0
      }),

      // 1: Montag - Der Pfad der zwei Tore (Laternen-Schrein)
      () => ({
        n: "Das Labyrinth der zwei Tore",
        c: "Tägliche Schreinprüfung · Montag",
        t: "0 Kameraschwenker · Dual-Tore",
        d: "Montags-Prüfung: Beide Kami-Tore versperren den Schrein. Finde die Schalter, nutze das Portal und erreiche das Ziel ohne Blickwinkel-Wechsel.",
        w, h,
        s: [1, 5, "E"],
        g: [5, 5],
        orbs: [[1, 1], [5, 1]],
        sw: [[1, 3, "cyan"], [5, 3, "magenta"]],
        gates: [[3, 3, "cyan"], [5, 4, "magenta"]],
        portals: [[2, 1], [4, 5]],
        winds: [[2, 5, "E"]],
        walls: [...baseWalls, [3, 1], [3, 2], [3, 4], [3, 5]],
        maxCredits: 0
      }),

      // 2: Dienstag - Der Tanz der vier Winde (Berg-Heiligtum)
      () => ({
        n: "Der Tanz der vier Winde",
        c: "Tägliche Schreinprüfung · Dienstag",
        t: "0 Kameraschwenker · Wind-Puzzle",
        d: "Dienstags-Prüfung: Vier Windströme durchwehen den Steingarten. Nutze den Wind als Beschleuniger, um Schalter und Relikte zu erreichen.",
        w, h,
        s: [1, 1, "E"],
        g: [3, 3],
        orbs: [[5, 1], [1, 5]],
        sw: [[5, 5, "cyan"]],
        gates: [[3, 4, "cyan"]],
        portals: [],
        winds: [[2, 1, "E"], [5, 2, "S"], [4, 5, "W"], [1, 4, "N"]],
        walls: [...baseWalls, [2, 2], [4, 2], [2, 4], [4, 4], [3, 2], [2, 3], [4, 3]],
        maxCredits: 0
      }),

      // 3: Mittwoch - Die Hallen der Kitsune (Mystik-Thema)
      () => ({
        n: "Die Hallen der Kitsune",
        c: "Tägliche Schreinprüfung · Mittwoch",
        t: "0 Kameraschwenker · Portale",
        d: "Mittwochs-Prüfung: Das Kitsune-Portal verbindet entfernte Kammern. Plane die Befehlsfolge blind voraus und aktiviere das Schrein-Tor.",
        w, h,
        s: [1, 5, "N"],
        g: [5, 1],
        orbs: [[3, 3], [5, 5]],
        sw: [[1, 1, "cyan"]],
        gates: [[5, 2, "cyan"]],
        portals: [[1, 3], [3, 5]],
        winds: [[3, 1, "E"], [4, 4, "N"]],
        walls: [...baseWalls, [2, 1], [4, 1], [2, 4], [4, 3]],
        maxCredits: 0
      }),

      // 4: Donnerstag - Gipfelwind am Fuji (Eiswelt-Thema mit Fuji-Soundtrack)
      () => ({
        n: "Gipfelwind am Eisigen Fuji",
        c: "Tägliche Schreinprüfung · Donnerstag",
        t: "0 Kameraschwenker · Eiswelt",
        d: "Donnerstags-Prüfung: Eisige Höhenluft und schimmernder Raureif. Sammle die Bergkristalle, nutze die Böen und öffne das Eistor.",
        theme: "fuji",
        w, h,
        s: [1, 5, "N"],
        g: [5, 1],
        orbs: [[1, 2], [4, 4]],
        sw: [[5, 5, "cyan"]],
        gates: [[5, 2, "cyan"]],
        portals: [[1, 1], [3, 5]],
        winds: [[1, 4, "N"], [3, 2, "E"]],
        walls: [...baseWalls, [2, 1], [2, 2], [4, 2], [2, 4], [4, 5]],
        maxCredits: 0
      }),

      // 5: Freitag - Die Bambus-Schlucht (Bambus-Garten)
      () => ({
        n: "Die Bambus-Schlucht",
        c: "Tägliche Schreinprüfung · Freitag",
        t: "0 Kameraschwenker · Schlucht-Sprung",
        d: "Freitags-Prüfung: Ein tiefer Abgrund trennt den Bambushain. Die Windböe katapultiert dich über den Teich. Plane die Route präzise.",
        w, h,
        s: [1, 5, "E"],
        g: [5, 1],
        orbs: [[2, 2], [4, 4]],
        sw: [[1, 2, "cyan"], [5, 4, "magenta"]],
        gates: [[3, 3, "cyan"], [5, 2, "magenta"]],
        portals: [[1, 1], [5, 5]],
        winds: [[2, 5, "E"], [4, 1, "W"]],
        walls: [...baseWalls, [2, 3], [3, 2], [4, 3], [3, 4]],
        maxCredits: 0
      }),

      // 6: Samstag - Der Schrein der drei Relikte (Goldener Tempel)
      () => ({
        n: "Der Schrein der drei Relikte",
        c: "Tägliche Schreinprüfung · Samstag",
        t: "0 Kameraschwenker · 3 Relikte",
        d: "Samstags-Prüfung: Drei heilige Relikte müssen vor Betreten des Altars geborgen werden. Nutze die Windträgheit zur perfekten Wende.",
        w, h,
        s: [1, 1, "S"],
        g: [3, 3],
        orbs: [[1, 5], [5, 1], [5, 5]],
        sw: [[3, 5, "cyan"]],
        gates: [[3, 2, "cyan"]],
        portals: [[1, 3], [5, 3]],
        winds: [[2, 1, "E"], [4, 5, "W"]],
        walls: [...baseWalls, [2, 2], [4, 2], [2, 4], [4, 4], [3, 4]],
        maxCredits: 0
      })
    ];

    // Pick archetype matching day of week
    const archetypeFn = archetypes[dayOfWeek] || archetypes[0];
    const lvl = archetypeFn();

    // Verify solvability with BFS solver
    const sol = solveLevel(lvl);
    lvl.solverSolution = sol;
    lvl.solution = sol.path;
    lvl.limit = Math.max(18, Math.min(32, sol.steps + 2));
    lvl.maxQueue = lvl.limit;

    return lvl;
  }

  // --- Daily Trial Manager ---

  const DAILY_STORAGE_KEY = "koma_daily_streak_v2";

  class DailyTrialManager {
    constructor() {
      this.data = this.loadData();
      this.cachedTodayLevel = null;
    }

    loadData() {
      if (typeof localStorage !== "undefined") {
        try {
          const raw = localStorage.getItem(DAILY_STORAGE_KEY);
          if (raw) return JSON.parse(raw);
        } catch (e) {}
      }
      return {
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedDate: null,
        history: {}
      };
    }

    saveData() {
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {}
      }
    }

    getTodayStr() {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    getYesterdayStr() {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    getFormattedDate(dateStr = this.getTodayStr()) {
      try {
        const parts = dateStr.split("-").map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
        return d.toLocaleDateString("de-DE", options);
      } catch (e) {
        return dateStr;
      }
    }

    isTodayCompleted() {
      return this.data.lastCompletedDate === this.getTodayStr();
    }

    getEffectiveStreak() {
      const today = this.getTodayStr();
      const yesterday = this.getYesterdayStr();
      if (!this.data.lastCompletedDate) return 0;
      if (this.data.lastCompletedDate === today || this.data.lastCompletedDate === yesterday) {
        return this.data.currentStreak;
      }
      return 0; // Streak was broken
    }

    getTodayLevel() {
      const today = this.getTodayStr();
      if (!this.cachedTodayLevel || this.cachedTodayLevel._date !== today) {
        this.cachedTodayLevel = generateDailyLevel(today);
        this.cachedTodayLevel._date = today;
      }
      return this.cachedTodayLevel;
    }

    recordCompletion() {
      const today = this.getTodayStr();
      const yesterday = this.getYesterdayStr();
      const alreadyCompleted = (this.data.lastCompletedDate === today);

      let isNewRecord = false;

      if (!alreadyCompleted) {
        if (this.data.lastCompletedDate === yesterday) {
          this.data.currentStreak += 1;
        } else {
          this.data.currentStreak = 1;
        }

        if (this.data.currentStreak > this.data.bestStreak) {
          this.data.bestStreak = this.data.currentStreak;
          isNewRecord = true;
        }

        this.data.lastCompletedDate = today;
        this.data.history[today] = true;
        this.saveData();
      }

      this.updateUI();
      return {
        alreadyCompleted,
        currentStreak: this.data.currentStreak,
        bestStreak: this.data.bestStreak,
        isNewRecord
      };
    }

    getWeeklyHistory() {
      const now = new Date();
      // Calculate Monday of current week
      const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
      const monday = new Date(now);
      monday.setDate(now.getDate() - dayOfWeek);

      const days = [];
      const dayLabels = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        days.push({
          label: dayLabels[i],
          date: str,
          dayNum: d.getDate(),
          isToday: str === this.getTodayStr(),
          isPast: d < now && str !== this.getTodayStr(),
          completed: !!this.data.history[str]
        });
      }
      return days;
    }

    updateUI() {
      const streak = this.getEffectiveStreak();
      const isDone = this.isTodayCompleted();
      const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
      const daysWord = (cnt) => isEn ? (cnt === 1 ? "day" : "days") : (cnt === 1 ? "Tag" : "Tage");

      // 1. Header Button Badge
      const badge = document.getElementById("headerDailyStreak");
      if (badge) {
        badge.textContent = isDone ? `${streak} ✓` : `${streak}`;
      }

      const btn = document.getElementById("btnDailyTrial");
      if (btn) {
        btn.classList.toggle("completed-today", isDone);
        btn.title = isDone 
          ? (isEn ? `Daily Shrine Trial completed today! (Streak: ${streak} ${daysWord(streak)})` : `Tägliche Schreinprüfung heute gemeistert! (Streak: ${streak} Tage)`)
          : (isEn ? `Daily Shrine Trial open! (Streak: ${streak} ${daysWord(streak)} · 0 camera rotations)` : `Tägliche Schreinprüfung offen! (Streak: ${streak} Tage · 0 Kameraschwenker)`);
      }

      // 2. Mobile Hub Banner
      const mobileSub = document.getElementById("mobileDailySub");
      if (mobileSub) {
        mobileSub.textContent = isDone 
          ? (isEn ? `Cleared today ✓ · Streak: ${streak} ${daysWord(streak)}` : `Heute gemeistert ✓ · Streak: ${streak} Tage`)
          : (isEn ? `0 camera rotations · Streak: ${streak} ${daysWord(streak)}` : `0 Kameraschwenker · Streak: ${streak} Tage`);
      }

      // 3. Modal Elements (if open)
      const streakVal = document.getElementById("dailyStreakValue");
      if (streakVal) {
        streakVal.textContent = isEn ? `${streak} ${daysWord(streak)} Streak` : `${streak} ${daysWord(streak)} Streak`;
      }

      const streakSub = document.getElementById("dailyStreakSub");
      if (streakSub) {
        streakSub.textContent = isEn
          ? `Record: ${this.data.bestStreak} ${daysWord(this.data.bestStreak)} · Master the daily trial`
          : `Rekord: ${this.data.bestStreak} ${daysWord(this.data.bestStreak)} · Meistere die tägliche Prüfung`;
      }

      const statusTag = document.getElementById("dailyStatusTag");
      if (statusTag) {
        if (isDone) {
          statusTag.textContent = isEn ? "Cleared today ✓" : "Heute gemeistert ✓";
          statusTag.className = "daily-status-tag completed";
        } else {
          statusTag.textContent = isEn ? "Open for today" : "Heute noch offen";
          statusTag.className = "daily-status-tag pending";
        }
      }

      const startLabel = document.getElementById("btnStartDailyLabel");
      if (startLabel) {
        const iconSvg = typeof KOMA_ICONS !== "undefined"
          ? (isDone ? KOMA_ICONS.retry(16) : KOMA_ICONS.play(16))
          : (isDone ? "↺" : "▶");
        const btnText = isDone
          ? (isEn ? "Play Again" : "Erneut spielen")
          : (isEn ? "Enter Trial" : "Prüfung antreten");
        startLabel.innerHTML = `<span style="display:inline-flex; align-items:center; gap:6px;">${iconSvg} <span>${btnText}</span></span>`;
      }

      // 4. Render Weekly Stamp Grid
      const weekGrid = document.getElementById("dailyWeekGrid");
      if (weekGrid) {
        const week = this.getWeeklyHistory();
        weekGrid.innerHTML = week.map(d => {
          let stampContent = "·";
          if (d.completed) {
            stampContent = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.torii(16, "#ffffff") : "⛩️";
          } else if (d.isToday) {
            stampContent = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.flame(16, "#ffaa44") : "🔥";
          }
          return `
            <div class="week-stamp-item ${d.completed ? "stamped" : ""} ${d.isToday ? "today" : ""}">
              <div class="stamp-day-label">${d.label}</div>
              <div class="stamp-icon-circle">
                ${stampContent}
              </div>
              <div class="stamp-date-label">${d.dayNum}.</div>
            </div>
          `;
        }).join("");
      }
    }
  }

  // Global Singleton instance & solver utilities
  window.DailyTrial = new DailyTrialManager();
  window.generateDailyLevel = generateDailyLevel;
  window.solveLevel = solveLevel;
  window.KomaSolver = {
    solveLevel,
    buildOuterWalls,
    mulberry32,
    DELTA,
    TURN_LEFT,
    TURN_RIGHT
  };

})();
