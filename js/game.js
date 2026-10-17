/**
 * KOMA: Spirit Delivery - Game Controller
 * Manages game state, command queue, level loading, step execution, and synchronization with 3D Renderer & Audio.
 */

class GameEngine {
  constructor() {
    this.currentLevelIdx = 0;
    this.queue = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.playbackTimer = null;
    
    // Level runtime state
    this.state = {
      x: 0,
      y: 0,
      dir: "E",
      isOpen: false,
      isWin: false,
      isFail: false
    };
    
    // Camera Credits & Star Rating System
    this.maxCameraCredits = 6;
    this.cameraCredits = 6;
    this.levelStars = {};
    
    // Save completed levels
    this.completedLevels = new Set();
    this.loadProgress();
    
    // DOM Elements cache
    this.dom = {
      levelTitle: document.getElementById("levelTitle"),
      chapterTitle: document.getElementById("chapterTitle"),
      levelTag: document.getElementById("levelTag"),
      missionDesc: document.getElementById("missionDesc"),
      missionBadge: document.getElementById("missionBadge"),
      creditBadge: document.getElementById("creditBadge"),
      creditStars: document.getElementById("creditStars"),
      queueContainer: document.getElementById("queueContainer"),
      queueCount: document.getElementById("queueCount"),
      feedbackText: document.getElementById("feedbackText"),
      progressBar: document.getElementById("progressBar"),
      btnPlay: document.getElementById("btnPlay"),
      btnUndo: document.getElementById("btnUndo"),
      btnClear: document.getElementById("btnClear"),
      btnReset: document.getElementById("btnReset"),
      cmdButtons: document.querySelectorAll("[data-cmd]"),
      levelDrawer: document.getElementById("levelDrawer"),
      levelList: document.getElementById("levelList"),
      btnLevelSelect: document.getElementById("btnLevelSelect"),
      btnCamRotateLeft: document.getElementById("btnCamRotateLeft"),
      btnCamRotateRight: document.getElementById("btnCamRotateRight"),
      btnCamReset: document.getElementById("btnCamReset"),
      modalWin: document.getElementById("modalWin"),
      modalWinTitle: document.getElementById("modalWinTitle"),
      modalWinText: document.getElementById("modalWinText"),
      modalWinStars: document.getElementById("modalWinStars"),
      modalWinCredits: document.getElementById("modalWinCredits"),
      btnNextLevel: document.getElementById("btnNextLevel"),
      btnReplayLevel: document.getElementById("btnReplayLevel"),
      btnSoundToggle: document.getElementById("btnSoundToggle"),
      btnHelp: document.getElementById("btnHelp"),
      modalHelp: document.getElementById("modalHelp"),
      btnCloseHelp: document.getElementById("btnCloseHelp")
    };
    
    this.renderer = null;
    this.commandMeta = {
      F: { name: "Vorwärts", icon: "↑" },
      L: { name: "Links drehen", icon: "↶" },
      R: { name: "Rechts drehen", icon: "↷" },
      A: { name: "Aktion", icon: "✦" }
    };
    
    this.init();
  }

  init() {
    // 1. Initialize 3D Garden Renderer
    this.renderer = new GardenRenderer("webgl-container");
    
    // Listen to 3D Camera Swivels
    this.renderer.onSwivelCallback = () => {
      this.useCameraCredit();
    };
    
    // 2. Setup Events
    this.bindEvents();
    
    // 3. Load First Level
    this.loadLevel(this.currentLevelIdx);
  }

  getCurrentLevel() {
    return LEVELS[this.currentLevelIdx];
  }

  bindEvents() {
    // Command Buttons
    this.dom.cmdButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-cmd");
        this.addCommand(cmd);
      });
    });

    // Control Buttons
    if (this.dom.btnPlay) this.dom.btnPlay.addEventListener("click", () => this.play());
    if (this.dom.btnReset) this.dom.btnReset.addEventListener("click", () => this.reset(false));
    if (this.dom.btnUndo) this.dom.btnUndo.addEventListener("click", () => this.undo());
    if (this.dom.btnClear) this.dom.btnClear.addEventListener("click", () => this.reset(true));

    // Sound Toggle
    if (this.dom.btnSoundToggle) {
      this.dom.btnSoundToggle.addEventListener("click", () => {
        const isMuted = Sound.toggleMute();
        this.dom.btnSoundToggle.innerHTML = isMuted ? "🔇" : "🔊";
        this.dom.btnSoundToggle.title = isMuted ? "Ton aktivieren" : "Ton stummschalten";
      });
    }

    // Level Select Drawer Toggle
    if (this.dom.btnLevelSelect && this.dom.levelDrawer) {
      this.dom.btnLevelSelect.addEventListener("click", () => {
        this.dom.levelDrawer.classList.toggle("open");
      });
    }

    // Help Modal
    if (this.dom.btnHelp && this.dom.modalHelp) {
      this.dom.btnHelp.addEventListener("click", () => this.dom.modalHelp.classList.add("active"));
    }
    if (this.dom.btnCloseHelp && this.dom.modalHelp) {
      this.dom.btnCloseHelp.addEventListener("click", () => this.dom.modalHelp.classList.remove("active"));
    }

    // Win Modal Actions
    if (this.dom.btnNextLevel) {
      this.dom.btnNextLevel.addEventListener("click", () => {
        this.dom.modalWin.classList.remove("active");
        this.loadLevel((this.currentLevelIdx + 1) % LEVELS.length);
      });
    }
    if (this.dom.btnReplayLevel) {
      this.dom.btnReplayLevel.addEventListener("click", () => {
        this.dom.modalWin.classList.remove("active");
        this.reset(false);
      });
    }

    // Camera Swivel / Rotate Controls
    if (this.dom.btnCamRotateLeft) {
      this.dom.btnCamRotateLeft.addEventListener("click", () => {
        this.renderer.rotateCameraBy(Math.PI / 4);
      });
    }
    if (this.dom.btnCamRotateRight) {
      this.dom.btnCamRotateRight.addEventListener("click", () => {
        this.renderer.rotateCameraBy(-Math.PI / 4);
      });
    }
    if (this.dom.btnCamReset) {
      this.dom.btnCamReset.addEventListener("click", () => {
        this.renderer.resetCameraView();
        Sound.playClick();
      });
    }

    // Keyboard Shortcuts
    document.addEventListener("keydown", e => {
      if (this.dom.modalHelp && this.dom.modalHelp.classList.contains("active")) {
        if (e.key === "Escape") this.dom.modalHelp.classList.remove("active");
        return;
      }
      if (this.dom.modalWin && this.dom.modalWin.classList.contains("active")) {
        if (e.key === "Enter" || e.key === " ") {
          this.dom.modalWin.classList.remove("active");
          this.loadLevel((this.currentLevelIdx + 1) % LEVELS.length);
        } else if (e.key === "Escape") {
          this.dom.modalWin.classList.remove("active");
        }
        return;
      }

      if (this.isPlaying) return;

      const k = e.key.toUpperCase();
      if (k === "ARROWUP" || k === "W" || k === "F") {
        this.addCommand("F");
      } else if (k === "ARROWLEFT" || (k === "A" && e.altKey) || k === "L") {
        this.addCommand("L");
      } else if (k === "ARROWRIGHT" || k === "D" || k === "R") {
        this.addCommand("R");
      } else if (k === "E" || k === "A") {
        this.addCommand("A");
      } else if (k === "Q") {
        this.renderer.rotateCameraBy(Math.PI / 4);
      } else if (k === "Y" || k === "Z") {
        this.renderer.rotateCameraBy(-Math.PI / 4);
      } else if (k === "C") {
        this.renderer.resetCameraView();
      } else if (k === " " || k === "ENTER") {
        e.preventDefault();
        this.play();
      } else if (k === "BACKSPACE") {
        this.undo();
      } else if (k === "ESCAPE") {
        this.reset(false);
      }
    });
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem("koma_completed_levels");
      if (saved) {
        JSON.parse(saved).forEach(idx => this.completedLevels.add(idx));
      }
      const stars = localStorage.getItem("koma_level_stars");
      if (stars) {
        this.levelStars = JSON.parse(stars);
      }
    } catch (e) {}
  }

  saveProgress() {
    try {
      localStorage.setItem("koma_completed_levels", JSON.stringify(Array.from(this.completedLevels)));
      localStorage.setItem("koma_level_stars", JSON.stringify(this.levelStars));
    } catch (e) {}
  }

  calculateStars(credits, maxCredits) {
    if (credits === maxCredits) return 3;
    if (credits >= Math.ceil(maxCredits / 2)) return 2;
    if (credits > 0) return 1;
    return 0;
  }

  useCameraCredit() {
    if (this.cameraCredits > 0) {
      this.cameraCredits--;
      Sound.playCameraSwivel();
      this.renderCameraCredits();
      if (this.cameraCredits === 0) {
        this.setFeedback("Kamera-Credits aufgebraucht (0 Sterne möglich – Level kann trotzdem abgeschlossen werden).", "bad");
      } else {
        this.setFeedback(`Kamera geschwenkt (-1 Credit, noch ${this.cameraCredits} übrig).`, "normal");
      }
    }
  }

  renderCameraCredits() {
    if (this.dom.creditBadge) {
      this.dom.creditBadge.textContent = `${this.cameraCredits} / ${this.maxCameraCredits}`;
    }
    if (this.dom.creditStars) {
      const stars = this.calculateStars(this.cameraCredits, this.maxCameraCredits);
      this.dom.creditStars.textContent = stars > 0 ? "⭐".repeat(stars) : "–";
    }
  }

  loadLevel(idx) {
    if (this.isPlaying) return;
    this.currentLevelIdx = idx;
    this.queue = [];
    this.currentStep = 0;
    
    const lvl = this.getCurrentLevel();
    this.resetState();
    
    // Update Header & Card
    if (this.dom.levelTitle) this.dom.levelTitle.textContent = lvl.n;
    if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = lvl.c;
    if (this.dom.levelTag) this.dom.levelTag.textContent = lvl.t;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = lvl.d;
    if (this.dom.missionBadge) this.dom.missionBadge.textContent = `${String(idx + 1).padStart(2, "0")} / ${LEVELS.length}`;
    if (this.dom.progressBar) this.dom.progressBar.style.width = "0%";
    
    this.setFeedback("Plane deine Befehlsfolge und drücke auf „Plan abspielen“.", "normal");
    
    // Render in 3D Scene
    this.renderer.loadLevel(lvl);
    
    this.renderQueue();
    this.renderLevelDrawer();
    this.renderCameraCredits();
  }

  resetKomaPosition() {
    const lvl = this.getCurrentLevel();
    this.state = {
      x: lvl.s[0],
      y: lvl.s[1],
      dir: lvl.s[2],
      isOpen: false,
      openGates: new Set(),
      collectedOrbs: new Set(),
      isWin: false,
      isFail: false
    };
    if (this.renderer) {
      this.renderer.setKomaInitialState(this.state.x, this.state.y, this.state.dir);
      this.renderer.setGateOpen("all", false);
      this.renderer.setSwitchActive("all", false);
      this.renderer.resetOrbs();
    }
  }

  resetState(resetCredits = true) {
    this.resetKomaPosition();
    if (resetCredits) {
      this.cameraCredits = this.maxCameraCredits;
      this.renderCameraCredits();
      if (this.renderer) {
        this.renderer.resetCameraView();
      }
    }
  }

  addCommand(cmd) {
    if (this.isPlaying) return;
    const lvl = this.getCurrentLevel();
    if (this.queue.length >= lvl.limit) {
      this.setFeedback("Dein Plan ist voll! Entferne einen Befehl für neue Schritte.", "bad");
      Sound.playBump();
      return;
    }
    this.queue.push(cmd);
    Sound.playClick();
    this.renderQueue();
    this.setFeedback(`${this.commandMeta[cmd].name} hinzugefügt.`, "normal");
  }

  undo() {
    if (this.isPlaying || !this.queue.length) return;
    this.queue.pop();
    Sound.playClick();
    this.renderQueue();
    this.setFeedback("Letzten Befehl entfernt.", "normal");
  }

  reset(clearQueue = false) {
    if (this.playbackTimer) clearTimeout(this.playbackTimer);
    this.isPlaying = false;
    this.currentStep = 0;
    this.resetState();
    if (clearQueue) this.queue = [];
    if (this.dom.progressBar) this.dom.progressBar.style.width = "0%";
    this.renderQueue();
    this.setFeedback(
      clearQueue
        ? "Plan gelöscht. Beginne mit einer neuen Befehlsfolge."
        : "KOMA ist wieder am Start. Du kannst deinen Plan anpassen.",
      "normal"
    );
    Sound.playClick();
  }

  renderQueue() {
    const lvl = this.getCurrentLevel();
    if (this.dom.queueCount) {
      this.dom.queueCount.textContent = `${this.queue.length} / ${lvl.limit}`;
    }

    if (!this.dom.queueContainer) return;
    this.dom.queueContainer.innerHTML = "";

    if (this.queue.length === 0) {
      this.dom.queueContainer.innerHTML = `<div class="empty-queue-hint">Dein Plan erscheint hier …</div>`;
    } else {
      this.queue.forEach((cmd, idx) => {
        const slot = document.createElement("button");
        slot.className = "queue-chip" + (idx === this.currentStep - 1 && this.isPlaying ? " active-step" : "");
        slot.title = `${this.commandMeta[cmd].name} (antippen zum Löschen)`;
        slot.innerHTML = `
          <span class="chip-icon">${this.commandMeta[cmd].icon}</span>
          <span class="chip-number">${idx + 1}</span>
        `;
        slot.onclick = () => {
          if (!this.isPlaying) {
            this.queue.splice(idx, 1);
            Sound.playClick();
            this.renderQueue();
            this.setFeedback("Befehl entfernt.", "normal");
          }
        };
        this.dom.queueContainer.appendChild(slot);
      });
    }

    // Disable buttons if at limit or during playback
    const atLimit = this.queue.length >= lvl.limit;
    this.dom.cmdButtons.forEach(btn => (btn.disabled = this.isPlaying || atLimit));
    if (this.dom.btnUndo) this.dom.btnUndo.disabled = this.isPlaying || !this.queue.length;
    if (this.dom.btnClear) this.dom.btnClear.disabled = this.isPlaying || !this.queue.length;
    if (this.dom.btnPlay) this.dom.btnPlay.disabled = this.isPlaying || !this.queue.length;
  }

  renderLevelDrawer() {
    if (!this.dom.levelList) return;
    this.dom.levelList.innerHTML = "";
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement("button");
      btn.className =
        "level-pill-btn" +
        (idx === this.currentLevelIdx ? " active" : "") +
        (this.completedLevels.has(idx) ? " done" : "");
      
      const stars = this.levelStars[idx];
      let starMarkup = "";
      if (stars !== undefined) {
        starMarkup = stars > 0 ? `<span class="pill-stars">${"⭐".repeat(stars)}</span>` : `<span class="pill-stars zero">0⭐</span>`;
      }

      btn.innerHTML = `
        <span class="pill-number">${idx + 1}</span>
        <span class="pill-title">${lvl.n}</span>
        ${starMarkup}
        ${this.completedLevels.has(idx) ? '<span class="pill-check">✓</span>' : ""}
      `;
      btn.onclick = () => {
        this.dom.levelDrawer.classList.remove("open");
        this.loadLevel(idx);
      };
      this.dom.levelList.appendChild(btn);
    });
  }

  setFeedback(text, type = "normal") {
    if (!this.dom.feedbackText) return;
    this.dom.feedbackText.textContent = text;
    this.dom.feedbackText.className = "feedback-box " + type;
  }

  play() {
    if (this.isPlaying) return;
    if (!this.queue.length) {
      this.setFeedback("Füge zuerst mindestens einen Befehl hinzu.", "bad");
      Sound.playBump();
      return;
    }

    this.resetKomaPosition();
    this.currentStep = 0;
    this.isPlaying = true;
    this.setFeedback("Los geht's! KOMA führt deinen Plan aus …", "normal");
    this.renderQueue();

    this.playbackTimer = setTimeout(() => this.executeNextStep(), 350);
  }

  executeNextStep() {
    if (this.currentStep >= this.queue.length) {
      this.isPlaying = false;
      this.renderQueue();
      if (!this.state.isWin && !this.state.isFail) {
        this.setFeedback("Plan beendet. KOMA hat das Ziel noch nicht erreicht – passe deinen Plan an.", "bad");
        Sound.playBump();
      }
      return;
    }

    const cmd = this.queue[this.currentStep++];
    const lvl = this.getCurrentLevel();
    const hasCoord = (arr, x, y) => (arr || []).some(p => p[0] === x && p[1] === y);

    // Update progress bar & queue chip highlight
    if (this.dom.progressBar) {
      const pct = (this.currentStep / this.queue.length) * 100;
      this.dom.progressBar.style.width = `${pct}%`;
    }
    this.renderQueue();

    // 1. Turn Left
    if (cmd === "L") {
      const turnMap = { N: "W", W: "S", S: "E", E: "N" };
      this.state.dir = turnMap[this.state.dir];
      this.renderer.animateRotate(this.state.dir);
      Sound.playTurn();
    }

    // 2. Turn Right
    if (cmd === "R") {
      const turnMap = { N: "E", E: "S", S: "W", W: "N" };
      this.state.dir = turnMap[this.state.dir];
      this.renderer.animateRotate(this.state.dir);
      Sound.playTurn();
    }

    // 3. Forward
    if (cmd === "F") {
      const deltaMap = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
      const [dx, dy] = deltaMap[this.state.dir];
      const nx = this.state.x + dx;
      const ny = this.state.y + dy;

      const isOutOfBounds = nx < 0 || ny < 0 || nx >= lvl.w || ny >= lvl.h;
      const isWall = hasCoord(lvl.walls, nx, ny);
      
      // Check gate collision
      const allGates = lvl.gates || lvl.gate || [];
      const gateOnTile = allGates.find(g => g[0] === nx && g[1] === ny);
      let isBlockedGate = false;
      if (gateOnTile) {
        const gateColor = gateOnTile[2] || "magenta";
        const isColorOpen = this.state.openGates.has(gateColor) || (allGates.length === 1 && this.state.isOpen);
        if (!isColorOpen) {
          isBlockedGate = true;
        }
      }

      if (isOutOfBounds || isWall || isBlockedGate) {
        this.state.isFail = true;
        this.isPlaying = false;
        this.renderer.animateBump();
        Sound.playBump();
        const reason = isBlockedGate ? "Das Tor ist noch verschlossen!" : "Da ist ein Hindernis.";
        this.setFeedback(`Plopp! ${reason} KOMA bleibt stehen – passe deinen Plan an.`, "bad");
        this.renderQueue();
        return;
      }

      this.state.x = nx;
      this.state.y = ny;
      this.renderer.animateMove(nx, ny);
      Sound.playStep();

      // Check if stepped on a Portal
      if (lvl.portals && lvl.portals.length === 2) {
        const [p1, p2] = lvl.portals;
        if (nx === p1[0] && ny === p1[1]) {
          this.state.x = p2[0];
          this.state.y = p2[1];
          setTimeout(() => {
            this.renderer.animateTeleport(p2[0], p2[1]);
            Sound.playPortal();
            this.setFeedback("🌀 Kitsune-Portal betreten! KOMA beamt sich ans Ziel-Portal.", "normal");
          }, 180);
        } else if (nx === p2[0] && ny === p2[1]) {
          this.state.x = p1[0];
          this.state.y = p1[1];
          setTimeout(() => {
            this.renderer.animateTeleport(p1[0], p1[1]);
            Sound.playPortal();
            this.setFeedback("🌀 Kitsune-Portal betreten! KOMA beamt sich ans Ziel-Portal.", "normal");
          }, 180);
        }
      }

      // Check if stepped on a Spirit Orb
      if (lvl.orbs && lvl.orbs.length > 0) {
        const orbKey = `${this.state.x},${this.state.y}`;
        const hasOrb = lvl.orbs.some(o => o[0] === this.state.x && o[1] === this.state.y);
        if (hasOrb && !this.state.collectedOrbs.has(orbKey)) {
          this.state.collectedOrbs.add(orbKey);
          Sound.playOrb();
          this.renderer.collectOrb(this.state.x, this.state.y);
          this.setFeedback(`🌸 Geisterlicht eingesammelt! (${this.state.collectedOrbs.size} / ${lvl.orbs.length})`, "good");
        }
      }
    }

    // 4. Action
    if (cmd === "A") {
      const allSws = lvl.sw || [];
      const swOnTile = allSws.find(s => s[0] === this.state.x && s[1] === this.state.y);
      if (swOnTile) {
        const swColor = swOnTile[2] || "cyan";
        this.state.isOpen = true; // backwards compatibility
        this.state.openGates.add(swColor);
        
        // Also if level has only 1 gate and colors differ, open that gate
        const allGates = lvl.gates || lvl.gate || [];
        if (allGates.length === 1) {
          const soleColor = allGates[0][2] || "magenta";
          this.state.openGates.add(soleColor);
        }

        this.renderer.setGateOpen(swColor, true);
        if (allGates.length === 1) {
          this.renderer.setGateOpen("all", true);
        }
        this.renderer.setSwitchActive(swColor, true);

        Sound.playSwitch();
        Sound.playGateOpen();
        const colorNames = { cyan: "Türkis", magenta: "Violett", gold: "Gold", green: "Smaragd" };
        const colorName = colorNames[swColor] || swColor;
        this.setFeedback(`✦ ${colorName}-Schalter aktiviert! Das zugehörige Tor öffnet sich.`, "good");
      } else {
        Sound.playBump();
        this.setFeedback("Hier gibt es keinen Schalter zum Aktivieren.", "normal");
      }
    }

    // Check Victory
    if (this.state.x === lvl.g[0] && this.state.y === lvl.g[1]) {
      if (lvl.orbs && this.state.collectedOrbs.size < lvl.orbs.length) {
        this.setFeedback(`⛩️ Ziel noch versiegelt! Sammle noch ${lvl.orbs.length - this.state.collectedOrbs.size} Geisterlicht(er).`, "bad");
        Sound.playBump();
        return;
      }
      this.state.isWin = true;
      this.isPlaying = false;
      this.completedLevels.add(this.currentLevelIdx);
      
      // Calculate star rating based on user formula:
      // Volle Credit Zahl -> 3 Sterne, Hälfte -> 2 Sterne, 0 Credits -> 0 Sterne (Level trotzdem abgeschlossen)
      const stars = this.calculateStars(this.cameraCredits, this.maxCameraCredits);
      this.levelStars[this.currentLevelIdx] = Math.max(this.levelStars[this.currentLevelIdx] || 0, stars);
      
      this.saveProgress();
      this.renderLevelDrawer();
      this.renderQueue();

      this.renderer.animateWin();
      Sound.playWin();

      if (this.dom.progressBar) this.dom.progressBar.style.width = "100%";
      this.setFeedback("Paket erfolgreich zugestellt! Eine Ecke Japans leuchtet auf.", "good");

      setTimeout(() => {
        if (this.dom.modalWinTitle) {
          this.dom.modalWinTitle.textContent =
            this.currentLevelIdx === LEVELS.length - 1 ? "Alle Lieferungen geschafft! 🎉" : "Lieferung erfolgreich! 🌸";
        }
        if (this.dom.modalWinText) {
          this.dom.modalWinText.textContent = `KOMA hat das Paket in ${this.currentStep} Befehl${
            this.currentStep === 1 ? "" : "en"
          } sicher abgeliefert.`;
        }
        if (this.dom.modalWinStars) {
          let starHtml = "";
          for (let i = 1; i <= 3; i++) {
            starHtml += `<span class="win-star ${i <= stars ? "filled" : "empty"}">${i <= stars ? "⭐" : "☆"}</span>`;
          }
          let starLabel = "";
          if (stars === 3) starLabel = "3 Sterne · Volle Kamera-Credits erhalten (Perfekt!)";
          else if (stars === 2) starLabel = "2 Sterne · Mindestens halbe Credits erhalten (Sehr gut!)";
          else if (stars === 1) starLabel = "1 Stern · Wenig Credits übrig (Gut!)";
          else starLabel = "0 Sterne · Alle Kamera-Credits aufgebraucht (Erfolgreich geliefert)";
          
          this.dom.modalWinStars.innerHTML = `
            <div class="stars-row">${starHtml}</div>
            <div class="stars-caption">${starLabel}</div>
          `;
          
          // Play star chimes
          for (let i = 0; i < stars; i++) {
            setTimeout(() => Sound.playStarChime(i), (i + 1) * 220);
          }
        }
        if (this.dom.modalWinCredits) {
          this.dom.modalWinCredits.textContent = `Übrige Kamera-Credits: ${this.cameraCredits} / ${this.maxCameraCredits}`;
        }
        if (this.dom.btnNextLevel) {
          this.dom.btnNextLevel.textContent =
            this.currentLevelIdx === LEVELS.length - 1 ? "Erstes Level erneut spielen" : "Nächstes Level →";
        }
        if (this.dom.modalWin) this.dom.modalWin.classList.add("active");
      }, 700);
      return;
    }

    // Next step after delay
    this.playbackTimer = setTimeout(() => this.executeNextStep(), 460);
  }
}

// Start Game on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new GameEngine();
});
