/**
 * KOMA: Spirit Delivery - Game Controller
 * Manages game state, command queue, level loading, step execution, and synchronization with 3D Renderer & Audio.
 */

const ACHIEVEMENTS = [
  {
    id: "camera_monk",
    name: "Kamera-Mönch",
    jpName: "不動心",
    icon: "🧘",
    desc: "Schließe 10 Level mit vollen 3 Sternen ab (ohne Kameradrehung).",
    goal: 10,
    getProgress: (game) => game.stats.threeStarCount || 0
  },
  {
    id: "spirit_friend",
    name: "Geisterfreund",
    jpName: "霊友",
    icon: "🦊",
    desc: "Sammle insgesamt 50 Geisterlichter (Orbs) in den Schreingärten.",
    goal: 50,
    getProgress: (game) => game.stats.orbsCollected || 0
  },
  {
    id: "wind_master",
    name: "Herr des Windes",
    jpName: "風神の息",
    icon: "💨",
    desc: "Lass dich 25 Mal von einer heiligen Bergwindböe tragen.",
    goal: 25,
    getProgress: (game) => game.stats.windGusts || 0
  },
  {
    id: "fuji_climber",
    name: "Fuji-Besteiger",
    jpName: "富士登頂",
    icon: "🏔️",
    desc: "Erklimme alle 10 Stationen des Heiligen Berges Fuji (Kapitel 6).",
    goal: 10,
    getProgress: (game) => {
      let count = 0;
      for (let i = 50; i < 60; i++) {
        if (game.completedLevels.has(i)) count++;
      }
      return count;
    }
  },
  {
    id: "zen_master",
    name: "Zen-Meister",
    jpName: "皆伝",
    icon: "🌸",
    desc: "Schalte alle 6 heiligen Kami-Skins in der Schrein-Garderobe frei.",
    goal: 6,
    getProgress: (game) => {
      if (typeof window === "undefined" || !window.KOMA_SKINS) return 1;
      const totalStars = game.getTotalStars();
      return Object.values(window.KOMA_SKINS).filter(s => totalStars >= s.starsRequired).length;
    }
  },
  {
    id: "minimalist",
    name: "Minimalist",
    jpName: "最小限",
    icon: "⚡",
    desc: "Löse 5 Level mit der perfekten Mindestanzahl an Befehlen.",
    goal: 5,
    getProgress: (game) => game.stats.minimalWins || 0
  }
];

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
      btnMusicToggle: document.getElementById("btnMusicToggle"),
      btnSoundToggle: document.getElementById("btnSoundToggle"),
      btnHelp: document.getElementById("btnHelp"),
      modalHelp: document.getElementById("modalHelp"),
      btnCloseHelp: document.getElementById("btnCloseHelp"),
      btnSkins: document.getElementById("btnSkins"),
      modalSkins: document.getElementById("modalSkins"),
      btnCloseSkins: document.getElementById("btnCloseSkins"),
      btnTrophies: document.getElementById("btnTrophies"),
      modalTrophies: document.getElementById("modalTrophies"),
      btnCloseTrophies: document.getElementById("btnCloseTrophies"),
      modalTrophiesList: document.getElementById("modalTrophiesList"),
      modalTrophiesCount: document.getElementById("modalTrophiesCount"),
      headerTotalStars: document.getElementById("headerTotalStars"),
      modalTotalStars: document.getElementById("modalTotalStars"),
      skinsGrid: document.getElementById("skinsGrid"),
      modalWinSkinNotice: document.getElementById("modalWinSkinNotice"),
      btnInstallPwa: document.getElementById("btnInstallPwa"),
      pwaNetworkBanner: document.getElementById("pwaNetworkBanner"),
      pwaNetworkText: document.getElementById("pwaNetworkText"),
      btnMobileHub: document.getElementById("btnMobileHub"),
      modalMobileHub: document.getElementById("modalMobileHub"),
      btnCloseMobileHub: document.getElementById("btnCloseMobileHub"),
      mobileHubTotalStars: document.getElementById("mobileHubTotalStars"),
      mobileSkinsGrid: document.getElementById("mobileSkinsGrid"),
      mobileLevelsGrid: document.getElementById("mobileLevelsGrid"),
      mobileChapterPills: document.getElementById("mobileChapterPills"),
      tabBtnTrophies: document.getElementById("tabBtnTrophies"),
      hubPanelTrophies: document.getElementById("hubPanelTrophies"),
      mobileTrophiesList: document.getElementById("mobileTrophiesList"),
      mobileTrophiesCount: document.getElementById("mobileTrophiesCount"),
      mobileHubWinBanner: document.getElementById("mobileHubWinBanner"),
      mobileHubWinTitle: document.getElementById("mobileHubWinTitle"),
      mobileHubWinStars: document.getElementById("mobileHubWinStars"),
      btnMobileHubNextLevel: document.getElementById("btnMobileHubNextLevel"),
      btnMobileHubReplayLevel: document.getElementById("btnMobileHubReplayLevel"),
      btnMobileResume: document.getElementById("btnMobileResume"),
      btnMobileMusicToggle: document.getElementById("btnMobileMusicToggle"),
      btnMobileSoundToggle: document.getElementById("btnMobileSoundToggle"),
      mobileLvlTitle: document.getElementById("mobileLvlTitle"),
      mobileLvlCredits: document.getElementById("mobileLvlCredits"),
      btnWinOpenHub: document.getElementById("btnWinOpenHub"),
      btnHeaderFuji: document.getElementById("btnHeaderFuji"),
      btnJumpFujiDrawer: document.getElementById("btnJumpFujiDrawer"),
      drawerChapterTabs: document.getElementById("drawerChapterTabs"),
      btnMobileHapticToggle: document.getElementById("btnMobileHapticToggle"),
      btnDailyTrial: document.getElementById("btnDailyTrial"),
      modalDailyTrial: document.getElementById("modalDailyTrial"),
      btnCloseDailyTrial: document.getElementById("btnCloseDailyTrial"),
      btnStartDailyTrial: document.getElementById("btnStartDailyTrial"),
      btnMobileOpenDaily: document.getElementById("btnMobileOpenDaily"),
      headerDailyStreak: document.getElementById("headerDailyStreak")
    };

    this.isDailyTrial = false;
    this.activeMobileChapter = 1;
    this.activeMobileTab = "skins";
    this.activeDrawerChapter = "all";
    
    this.hapticsEnabled = (typeof localStorage === "undefined" || localStorage.getItem("koma_haptics_enabled") !== "false");
    this.equippedSkin = (typeof localStorage !== "undefined" && localStorage.getItem("koma_equipped_skin")) || "original";
    let storedNotices = ["original"];
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem("koma_skin_notices");
        if (raw) storedNotices = JSON.parse(raw);
      }
    } catch (e) {}
    this.unlockedSkinNotices = new Set(storedNotices);

    this.renderer = null;
    this.commandMeta = {
      F: { 
        name: "Vorwärts", 
        icon: "↑",
        iconSvg: typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.cmdForward(18) : "↑"
      },
      L: { 
        name: "Links drehen", 
        icon: "↶",
        iconSvg: typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.cmdLeft(18) : "↶"
      },
      R: { 
        name: "Rechts drehen", 
        icon: "↷",
        iconSvg: typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.cmdRight(18) : "↷"
      },
      A: { 
        name: "Aktion", 
        icon: "✦",
        iconSvg: typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.cmdAction(18) : "✦"
      }
    };
    
    window.gameInstance = this;
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
    
    // 3. Update Audio Controls Status
    this.updateAudioButtons();

    // 4. Update Stars Counter
    this.updateStarsDisplay();

    // 5. Ensure equipped skin is synchronized
    if (this.equippedSkin && this.equippedSkin !== "original" && typeof this.renderer.setKomaSkin === "function") {
      this.renderer.setKomaSkin(this.equippedSkin);
    }

    // 6. Load First Level
    this.loadLevel(this.currentLevelIdx);

    // Initial check for any achievements already achieved from saved progress
    this.checkAchievements();

    // 7. Setup PWA & Mobile Optimizations
    this.setupPwaAndMobile();

    // 8. Update Daily Shrine Trial UI
    if (typeof DailyTrial !== "undefined" && typeof DailyTrial.updateUI === "function") {
      DailyTrial.updateUI();
    }
  }

  getCurrentLevel() {
    if (this.isDailyTrial && typeof DailyTrial !== "undefined") {
      return DailyTrial.getTodayLevel();
    }
    return LEVELS[this.currentLevelIdx] || LEVELS[0];
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

    // Music Toggle (BGM only)
    if (this.dom.btnMusicToggle) {
      this.dom.btnMusicToggle.addEventListener("click", () => {
        Sound.init();
        Sound.toggleBgm();
        this.updateAudioButtons();
      });
    }

    // Sound Toggle (Master Mute / Unmute)
    if (this.dom.btnSoundToggle) {
      this.dom.btnSoundToggle.addEventListener("click", () => {
        Sound.init();
        Sound.toggleMasterMute();
        this.updateAudioButtons();
      });
    }

    // Level Select Drawer Toggle
    if (this.dom.btnLevelSelect && this.dom.levelDrawer) {
      this.dom.btnLevelSelect.addEventListener("click", () => {
        this.triggerHaptic(12);
        this.dom.levelDrawer.classList.toggle("open");
      });
    }

    // Daily Shrine Trial Modals & Handlers
    const openDailyModal = () => {
      this.triggerHaptic(20);
      if (typeof DailyTrial !== "undefined" && typeof DailyTrial.updateUI === "function") {
        DailyTrial.updateUI();
      }
      if (this.dom.modalDailyTrial) {
        this.dom.modalDailyTrial.classList.add("active");
      }
    };

    if (this.dom.btnDailyTrial) {
      this.dom.btnDailyTrial.addEventListener("click", openDailyModal);
    }
    if (this.dom.btnMobileOpenDaily) {
      this.dom.btnMobileOpenDaily.addEventListener("click", () => {
        if (this.dom.modalMobileHub) this.dom.modalMobileHub.classList.remove("active");
        openDailyModal();
      });
    }

    if (this.dom.btnCloseDailyTrial) {
      this.dom.btnCloseDailyTrial.addEventListener("click", () => {
        this.triggerHaptic(10);
        if (this.dom.modalDailyTrial) this.dom.modalDailyTrial.classList.remove("active");
      });
    }

    if (this.dom.modalDailyTrial) {
      this.dom.modalDailyTrial.addEventListener("click", (e) => {
        if (e.target === this.dom.modalDailyTrial) {
          this.dom.modalDailyTrial.classList.remove("active");
        }
      });
    }

    if (this.dom.btnStartDailyTrial) {
      this.dom.btnStartDailyTrial.addEventListener("click", () => {
        this.triggerHaptic(30);
        if (this.dom.modalDailyTrial) this.dom.modalDailyTrial.classList.remove("active");
        this.loadDailyTrial();
      });
    }

    // Direct Header Jump to Mount Fuji (Kapitel 6 · Level 51)
    if (this.dom.btnHeaderFuji) {
      this.dom.btnHeaderFuji.addEventListener("click", () => {
        this.triggerHaptic(25);
        if (this.dom.levelDrawer) this.dom.levelDrawer.classList.remove("open");
        this.loadLevel(50); // Level 51 (Der erste Bergwind)
        this.setFeedback("🏔️ Willkommen am Fuße des heiligen Berges Fuji!", "good");
      });
    }

    // Drawer Fuji Quick-Jump Banner
    if (this.dom.btnJumpFujiDrawer) {
      this.dom.btnJumpFujiDrawer.addEventListener("click", () => {
        this.triggerHaptic(25);
        if (this.dom.levelDrawer) this.dom.levelDrawer.classList.remove("open");
        this.loadLevel(50); // Level 51
        this.setFeedback("🏔️ Kapitel 6: Der Heilige Berg Fuji geladen!", "good");
      });
    }

    // Drawer Chapter Filter Tabs
    if (this.dom.drawerChapterTabs) {
      const tabs = this.dom.drawerChapterTabs.querySelectorAll(".drawer-tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          this.triggerHaptic(12);
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          this.activeDrawerChapter = tab.getAttribute("data-chapter") || "all";
          this.renderLevelDrawer();
        });
      });
    }

    // Help Modal
    if (this.dom.btnHelp && this.dom.modalHelp) {
      this.dom.btnHelp.addEventListener("click", () => this.dom.modalHelp.classList.add("active"));
    }
    if (this.dom.btnCloseHelp && this.dom.modalHelp) {
      this.dom.btnCloseHelp.addEventListener("click", () => this.dom.modalHelp.classList.remove("active"));
    }

    // Shrine Wardrobe (KOMA Skins) Modal
    if (this.dom.btnSkins) {
      this.dom.btnSkins.addEventListener("click", () => this.openSkinsModal());
    }
    if (this.dom.btnCloseSkins) {
      this.dom.btnCloseSkins.addEventListener("click", () => this.closeSkinsModal());
    }
    if (this.dom.modalSkins) {
      this.dom.modalSkins.addEventListener("click", (e) => {
        if (e.target === this.dom.modalSkins) this.closeSkinsModal();
      });
    }

    // Shrine Trophies (Achievements) Modal
    if (this.dom.btnTrophies) {
      this.dom.btnTrophies.addEventListener("click", () => this.openTrophiesModal());
    }
    if (this.dom.btnCloseTrophies) {
      this.dom.btnCloseTrophies.addEventListener("click", () => this.closeTrophiesModal());
    }
    if (this.dom.modalTrophies) {
      this.dom.modalTrophies.addEventListener("click", (e) => {
        if (e.target === this.dom.modalTrophies) this.closeTrophiesModal();
      });
    }

    // Win Modal Actions
    if (this.dom.btnNextLevel) {
      this.dom.btnNextLevel.addEventListener("click", () => {
        this.dom.modalWin.classList.remove("active");
        if (this.isDailyTrial) {
          this.loadLevel(0);
        } else {
          this.loadLevel((this.currentLevelIdx + 1) % LEVELS.length);
        }
      });
    }
    if (this.dom.btnReplayLevel) {
      this.dom.btnReplayLevel.addEventListener("click", () => {
        this.dom.modalWin.classList.remove("active");
        this.reset(false);
      });
    }
    if (this.dom.btnWinOpenHub) {
      this.dom.btnWinOpenHub.addEventListener("click", () => {
        if (this.dom.modalWin) this.dom.modalWin.classList.remove("active");
        this.openMobileHub("skins", true);
      });
    }

    // Mobile Hub Events
    if (this.dom.btnMobileHub) {
      this.dom.btnMobileHub.addEventListener("click", () => {
        this.openMobileHub("skins", false);
      });
    }
    if (this.dom.btnCloseMobileHub) {
      this.dom.btnCloseMobileHub.addEventListener("click", () => {
        this.closeMobileHub();
      });
    }
    if (this.dom.btnMobileResume) {
      this.dom.btnMobileResume.addEventListener("click", () => {
        this.closeMobileHub();
      });
    }
    if (this.dom.btnMobileHubNextLevel) {
      this.dom.btnMobileHubNextLevel.addEventListener("click", () => {
        this.closeMobileHub();
        if (this.isDailyTrial) {
          this.loadLevel(0);
        } else {
          this.loadLevel((this.currentLevelIdx + 1) % LEVELS.length);
        }
      });
    }
    if (this.dom.btnMobileHubReplayLevel) {
      this.dom.btnMobileHubReplayLevel.addEventListener("click", () => {
        this.closeMobileHub();
        this.reset(false);
      });
    }
    if (this.dom.modalMobileHub) {
      this.dom.modalMobileHub.addEventListener("click", (e) => {
        if (e.target === this.dom.modalMobileHub) this.closeMobileHub();
      });
    }

    // Mobile Hub Tab Switching
    const hubTabs = document.querySelectorAll(".mobile-hub-tab");
    hubTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const tabId = tab.getAttribute("data-tab");
        if (tabId) this.switchMobileHubTab(tabId);
      });
    });

    // Mobile Hub Chapter Selector
    if (this.dom.mobileChapterPills) {
      const pills = this.dom.mobileChapterPills.querySelectorAll(".chapter-pill");
      pills.forEach(pill => {
        pill.addEventListener("click", () => {
          const chap = parseInt(pill.getAttribute("data-chapter"), 10);
          if (chap) this.switchMobileChapter(chap);
        });
      });
    }

    // Mobile Hub Audio Toggles
    if (this.dom.btnMobileMusicToggle) {
      this.dom.btnMobileMusicToggle.addEventListener("click", () => {
        if (typeof Sound !== "undefined" && typeof Sound.toggleBgm === "function") {
          Sound.toggleBgm();
          this.updateAudioButtons();
        }
      });
    }
    if (this.dom.btnMobileSoundToggle) {
      this.dom.btnMobileSoundToggle.addEventListener("click", () => {
        if (typeof Sound !== "undefined" && typeof Sound.toggleMaster === "function") {
          Sound.toggleMaster();
          this.updateAudioButtons();
        }
      });
    }

    // Camera Swivel / Rotate Controls
    if (this.dom.btnCamRotateLeft) {
      this.dom.btnCamRotateLeft.addEventListener("click", () => {
        if (this.isDailyTrial) {
          this.setFeedback("In der täglichen Schreinprüfung sind Kameraschwenker verboten!", "warning");
          if (typeof Sound !== "undefined" && typeof Sound.playBump === "function") Sound.playBump();
          return;
        }
        this.triggerHaptic(14);
        this.renderer.rotateCameraBy(Math.PI / 4);
      });
    }
    if (this.dom.btnCamRotateRight) {
      this.dom.btnCamRotateRight.addEventListener("click", () => {
        if (this.isDailyTrial) {
          this.setFeedback("In der täglichen Schreinprüfung sind Kameraschwenker verboten!", "warning");
          if (typeof Sound !== "undefined" && typeof Sound.playBump === "function") Sound.playBump();
          return;
        }
        this.triggerHaptic(14);
        this.renderer.rotateCameraBy(-Math.PI / 4);
      });
    }
    if (this.dom.btnCamReset) {
      this.dom.btnCamReset.addEventListener("click", () => {
        this.triggerHaptic(14);
        this.renderer.resetCameraView();
        Sound.playClick();
      });
    }

    // Mobile Haptic Feedback Toggle
    if (this.dom.btnMobileHapticToggle) {
      this.updateHapticButton();
      this.dom.btnMobileHapticToggle.addEventListener("click", () => {
        this.hapticsEnabled = !this.hapticsEnabled;
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("koma_haptics_enabled", this.hapticsEnabled ? "true" : "false");
        }
        if (this.hapticsEnabled) {
          this.triggerHaptic([30, 40, 50]);
        }
        this.updateHapticButton();
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
          if (this.isDailyTrial) {
            this.loadLevel(0);
          } else {
            this.loadLevel((this.currentLevelIdx + 1) % LEVELS.length);
          }
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

  updateAudioButtons() {
    // 1. Update Master Sound Toggle Button
    if (this.dom.btnSoundToggle) {
      const isMuted = Sound.masterMuted;
      const sfxSvg = isMuted 
        ? (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.soundOff(18) : "🔇")
        : (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.soundOn(18) : "🔊");
      this.dom.btnSoundToggle.innerHTML = `${sfxSvg}<span class="sr-only">${isMuted ? "🔇" : "🔊"}</span>`;
      this.dom.btnSoundToggle.title = isMuted ? "Gesamten Ton aktivieren (Ton an)" : "Gesamten Ton stummschalten (Mute)";
      this.dom.btnSoundToggle.classList.toggle("muted", isMuted);
    }

    // 2. Update BGM Music Toggle Button
    if (this.dom.btnMusicToggle) {
      const isMusicActive = Sound.bgmPlaying && !Sound.masterMuted;
      if (isMusicActive) {
        const musicSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.musicOn(18) : "🎵";
        this.dom.btnMusicToggle.innerHTML = `${musicSvg}<span class="sr-only">🎵</span>`;
        this.dom.btnMusicToggle.classList.add("playing");
        this.dom.btnMusicToggle.classList.remove("muted");
        this.dom.btnMusicToggle.title = "Hintergrundmusik pausieren";
      } else {
        const musicSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.musicOff(18) : "🔇";
        this.dom.btnMusicToggle.innerHTML = `${musicSvg}<span class="sr-only">🔇</span>`;
        this.dom.btnMusicToggle.classList.remove("playing");
        this.dom.btnMusicToggle.classList.add("muted");
        this.dom.btnMusicToggle.title = Sound.masterMuted ? "Musik stummgeschaltet (Master Mute)" : "Hintergrundmusik abspielen";
      }
    }

    // 3. Update Mobile Hub Audio Buttons
    if (this.dom.btnMobileMusicToggle) {
      const isMusicActive = Sound.bgmPlaying && !Sound.masterMuted;
      this.dom.btnMobileMusicToggle.textContent = isMusicActive ? "Musik pausieren ⏸️" : "Musik starten ▶️";
      this.dom.btnMobileMusicToggle.classList.toggle("active", isMusicActive);
    }
    if (this.dom.btnMobileSoundToggle) {
      const isMuted = Sound.masterMuted;
      this.dom.btnMobileSoundToggle.textContent = isMuted ? "Stumm 🔇" : "SFX Aktiv 🔊";
      this.dom.btnMobileSoundToggle.classList.toggle("active", !isMuted);
    }
  }

  updateMusicButton(isPlaying = Sound.bgmPlaying) {
    this.updateAudioButtons();
  }

  loadProgress() {
    this.stats = {
      orbsCollected: 0,
      windGusts: 0,
      minimalWins: 0,
      threeStarCount: 0
    };
    this.unlockedAchievements = new Set();

    try {
      const saved = localStorage.getItem("koma_completed_levels");
      if (saved) {
        JSON.parse(saved).forEach(idx => this.completedLevels.add(idx));
      }
      const stars = localStorage.getItem("koma_level_stars");
      if (stars) {
        this.levelStars = JSON.parse(stars);
      }
      const statsRaw = localStorage.getItem("koma_stats");
      if (statsRaw) {
        Object.assign(this.stats, JSON.parse(statsRaw));
      }
      const achRaw = localStorage.getItem("koma_achievements");
      if (achRaw) {
        JSON.parse(achRaw).forEach(id => this.unlockedAchievements.add(id));
      }
    } catch (e) {}

    this.stats.threeStarCount = Object.values(this.levelStars || {}).filter(s => s === 3).length;
  }

  saveProgress() {
    try {
      localStorage.setItem("koma_completed_levels", JSON.stringify(Array.from(this.completedLevels)));
      localStorage.setItem("koma_level_stars", JSON.stringify(this.levelStars));
      localStorage.setItem("koma_stats", JSON.stringify(this.stats));
      localStorage.setItem("koma_achievements", JSON.stringify(Array.from(this.unlockedAchievements)));
    } catch (e) {}
  }

  calculateStars(credits, maxCredits) {
    if (credits === maxCredits) return 3;
    if (credits >= Math.ceil(maxCredits / 2)) return 2;
    if (credits > 0) return 1;
    return 0;
  }

  getTotalStars() {
    let total = 0;
    if (this.levelStars) {
      for (const idx in this.levelStars) {
        total += (this.levelStars[idx] || 0);
      }
    }
    return total;
  }

  updateStarsDisplay() {
    const total = this.getTotalStars();
    if (this.dom.headerTotalStars) {
      this.dom.headerTotalStars.textContent = total;
    }
    if (this.dom.modalTotalStars) {
      this.dom.modalTotalStars.textContent = total;
    }
    if (this.dom.mobileHubTotalStars) {
      this.dom.mobileHubTotalStars.textContent = total;
    }
  }

  isSkinUnlocked(skinId) {
    if (skinId === "original") return true;
    const skin = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS[skinId]);
    if (!skin) return false;
    return this.getTotalStars() >= skin.starsRequired;
  }

  equipSkin(skinId) {
    if (!this.isSkinUnlocked(skinId)) return;
    this.equippedSkin = skinId;
    try {
      localStorage.setItem("koma_equipped_skin", skinId);
    } catch (e) {}

    if (this.renderer && typeof this.renderer.setKomaSkin === "function") {
      this.renderer.setKomaSkin(skinId);
    }
    if (typeof Sound !== "undefined" && typeof Sound.playSkinEquip === "function") {
      Sound.playSkinEquip();
    }
    this.renderSkinsModal();
    this.renderMobileSkins();
    const skin = window.KOMA_SKINS && window.KOMA_SKINS[skinId];
    this.setFeedback(`Skin "${skin ? skin.name : skinId}" ausgerüstet!`, "good");
  }

  openSkinsModal() {
    this.updateStarsDisplay();
    this.renderSkinsModal();
    if (this.dom.modalSkins) {
      this.dom.modalSkins.classList.add("active");
    }
  }

  closeSkinsModal() {
    if (this.dom.modalSkins) {
      this.dom.modalSkins.classList.remove("active");
    }
  }

  openTrophiesModal() {
    this.renderTrophies();
    if (this.dom.modalTrophies) {
      this.dom.modalTrophies.classList.add("active");
    }
  }

  closeTrophiesModal() {
    if (this.dom.modalTrophies) {
      this.dom.modalTrophies.classList.remove("active");
    }
  }

  openMobileHub(activeTab = "skins", isPostWin = false) {
    this.updateStarsDisplay();
    if (this.dom.mobileHubWinBanner) {
      if (isPostWin) {
        this.dom.mobileHubWinBanner.style.display = "block";
        if (this.dom.mobileHubWinTitle) {
          this.dom.mobileHubWinTitle.textContent =
            this.currentLevelIdx === LEVELS.length - 1 ? "Alle 60 Lieferungen geschafft! 🎉" : `Level ${this.currentLevelIdx + 1} geschafft! 🌸`;
        }
        if (this.dom.mobileHubWinStars) {
          const stars = this.calculateStars(this.cameraCredits, this.maxCameraCredits);
          let starHtml = "";
          for (let i = 1; i <= 3; i++) {
            const isFilled = i <= stars;
            const svgStar = isFilled
              ? (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(28, "var(--gold)", true) : "⭐")
              : (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starEmpty(28, "rgba(255,255,255,0.3)") : "☆");
            starHtml += `<span class="win-star ${isFilled ? "filled" : "empty"}">${svgStar}</span>`;
          }
          this.dom.mobileHubWinStars.innerHTML = `<div class="stars-row">${starHtml}</div>`;
        }
      } else {
        this.dom.mobileHubWinBanner.style.display = "none";
      }
    }

    this.switchMobileHubTab(activeTab);
    if (this.dom.modalMobileHub) {
      this.dom.modalMobileHub.classList.add("active");
    }
  }

  closeMobileHub() {
    if (this.dom.modalMobileHub) {
      this.dom.modalMobileHub.classList.remove("active");
    }
  }

  switchMobileHubTab(tabId) {
    this.activeMobileTab = tabId;
    const tabs = document.querySelectorAll(".mobile-hub-tab");
    tabs.forEach(tab => {
      const isCurrent = tab.getAttribute("data-tab") === tabId;
      tab.classList.toggle("active", isCurrent);
      tab.setAttribute("aria-selected", isCurrent ? "true" : "false");
    });

    const panels = [
      { id: "skins", el: document.getElementById("hubPanelSkins") },
      { id: "levels", el: document.getElementById("hubPanelLevels") },
      { id: "trophies", el: document.getElementById("hubPanelTrophies") },
      { id: "settings", el: document.getElementById("hubPanelSettings") }
    ];
    panels.forEach(p => {
      if (p.el) {
        p.el.classList.toggle("active", p.id === tabId);
      }
    });

    if (tabId === "skins") {
      this.renderMobileSkins();
    } else if (tabId === "levels") {
      this.renderMobileLevels(this.activeMobileChapter || 1);
    } else if (tabId === "trophies") {
      this.renderMobileTrophies();
    } else if (tabId === "settings") {
      this.updateAudioButtons();
    }
  }

  checkAchievements() {
    let newlyUnlocked = [];
    ACHIEVEMENTS.forEach(ach => {
      const prog = ach.getProgress(this);
      if (prog >= ach.goal && !this.unlockedAchievements.has(ach.id)) {
        this.unlockedAchievements.add(ach.id);
        newlyUnlocked.push(ach);
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveProgress();
      this.renderTrophies();
      this.renderMobileTrophies();
      newlyUnlocked.forEach(ach => {
        if (typeof Sound !== "undefined" && typeof Sound.playSkinEquip === "function") {
          Sound.playSkinEquip();
        }
        this.setFeedback(`🏆 Heiliges Siegel erlangt: ${ach.name} (${ach.jpName})!`, "good");
      });
    }
  }

  renderTrophies() {
    const list = this.dom.modalTrophiesList;
    if (!list) return;
    const countEl = this.dom.modalTrophiesCount;
    if (countEl) countEl.textContent = this.unlockedAchievements.size;

    list.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = this.unlockedAchievements.has(ach.id);
      const prog = Math.min(ach.goal, ach.getProgress(this));
      const pct = Math.round((prog / ach.goal) * 100);

      return `
        <div class="trophy-card ${isUnlocked ? "unlocked" : "locked"}">
          <div class="trophy-icon-wrap">
            <span>${ach.icon}</span>
          </div>
          <div class="trophy-info">
            <div class="trophy-header-row">
              <span class="trophy-title">${ach.name}</span>
              <span class="trophy-jptag">${ach.jpName}</span>
            </div>
            <div class="trophy-desc">${ach.desc}</div>
            <div class="trophy-prog-wrap">
              <div class="trophy-prog-bar"><div class="trophy-prog-fill" style="width: ${pct}%"></div></div>
              <span class="trophy-prog-text">${prog} / ${ach.goal}</span>
            </div>
          </div>
          <div class="trophy-status-badge ${isUnlocked ? "unlocked" : "locked"}">
            ${isUnlocked ? "✓ Gemeistert" : "Versiegelt"}
          </div>
        </div>
      `;
    }).join("");
  }

  renderMobileTrophies() {
    const list = this.dom.mobileTrophiesList;
    if (!list) return;
    const countEl = this.dom.mobileTrophiesCount;
    if (countEl) countEl.textContent = this.unlockedAchievements.size;

    list.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = this.unlockedAchievements.has(ach.id);
      const prog = Math.min(ach.goal, ach.getProgress(this));
      const pct = Math.round((prog / ach.goal) * 100);

      return `
        <div class="mobile-trophy-item ${isUnlocked ? "unlocked" : "locked"}">
          <div class="trophy-icon-wrap">
            <span>${ach.icon}</span>
          </div>
          <div class="trophy-info">
            <div class="trophy-header-row">
              <span class="trophy-title">${ach.name}</span>
              <span class="trophy-jptag">${ach.jpName}</span>
            </div>
            <div class="trophy-desc">${ach.desc}</div>
            <div class="trophy-prog-wrap">
              <div class="trophy-prog-bar"><div class="trophy-prog-fill" style="width: ${pct}%"></div></div>
              <span class="trophy-prog-text">${prog} / ${ach.goal}</span>
            </div>
          </div>
          <div class="trophy-status-badge ${isUnlocked ? "unlocked" : "locked"}">
            ${isUnlocked ? "✓" : "🔒"}
          </div>
        </div>
      `;
    }).join("");
  }

  switchMobileChapter(chap) {
    this.activeMobileChapter = chap;
    if (this.dom.mobileChapterPills) {
      const pills = this.dom.mobileChapterPills.querySelectorAll(".chapter-pill");
      pills.forEach(p => {
        p.classList.toggle("active", parseInt(p.getAttribute("data-chapter"), 10) === chap);
      });
    }
    this.renderMobileLevels(chap);
  }

  renderMobileSkins() {
    if (!this.dom.mobileSkinsGrid || typeof window === "undefined" || !window.KOMA_SKINS) return;
    const totalStars = this.getTotalStars();
    const skins = Object.values(window.KOMA_SKINS);

    this.dom.mobileSkinsGrid.innerHTML = skins.map(skin => {
      const isUnlocked = totalStars >= skin.starsRequired;
      const isEquipped = this.equippedSkin === skin.id;
      const progress = skin.starsRequired > 0 
        ? Math.min(100, Math.round((totalStars / skin.starsRequired) * 100)) 
        : 100;

      let statusBadge = "";
      let actionBtn = "";

      if (isEquipped) {
        statusBadge = `<span class="mobile-skin-badge active">✓ Aktiv</span>`;
        actionBtn = `<button class="mobile-skin-btn equipped" disabled>Ausgerüstet</button>`;
      } else if (isUnlocked) {
        statusBadge = `<span class="mobile-skin-badge unlocked">Frei</span>`;
        actionBtn = `<button class="mobile-skin-btn equip" data-mobile-skin="${skin.id}">Ausrüsten</button>`;
      } else {
        const starSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(11, "var(--gold)", false) : "⭐";
        statusBadge = `<span class="mobile-skin-badge locked">🔒 ${skin.starsRequired} ${starSvg}</span>`;
        actionBtn = `
          <div class="mobile-skin-progress">
            <div class="mobile-skin-prog-bar"><div class="mobile-skin-prog-fill" style="width: ${progress}%"></div></div>
            <span class="mobile-skin-prog-txt">${totalStars}/${skin.starsRequired} ${starSvg}</span>
          </div>
        `;
      }

      return `
        <div class="mobile-skin-card ${isEquipped ? "equipped" : ""} ${isUnlocked ? "unlocked" : "locked"}" style="--skin-accent: ${skin.accentColor}">
          <div class="mobile-skin-top">
            <div class="mobile-skin-icon-wrap">
              <span class="mobile-skin-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getSkinIcon(skin.id, 30, skin.accentColor) : skin.icon}</span>
              <span class="mobile-skin-jptag">${skin.jpName}</span>
            </div>
            <div class="mobile-skin-details">
              <div class="mobile-skin-title">${skin.name}</div>
              <div class="mobile-skin-sub">${skin.subtitle}</div>
            </div>
            ${statusBadge}
          </div>
          <div class="mobile-skin-bottom">
            ${actionBtn}
          </div>
        </div>
      `;
    }).join("");

    const equipBtns = this.dom.mobileSkinsGrid.querySelectorAll("button[data-mobile-skin]");
    equipBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const skinId = btn.getAttribute("data-mobile-skin");
        if (skinId) {
          this.equipSkin(skinId);
        }
      });
    });
  }

  renderMobileLevels(chapter = 1) {
    if (!this.dom.mobileLevelsGrid) return;
    const startIdx = (chapter - 1) * 10;
    const endIdx = startIdx + 10;
    const chapterLevels = LEVELS.slice(startIdx, endIdx);

    this.dom.mobileLevelsGrid.innerHTML = chapterLevels.map((lvl, relIdx) => {
      const absIdx = startIdx + relIdx;
      const isActive = absIdx === this.currentLevelIdx;
      const isDone = this.completedLevels.has(absIdx);
      const stars = this.levelStars[absIdx];

      let starsHtml = "";
      if (stars !== undefined && stars > 0) {
        starsHtml = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getStarsRow(stars, stars, 11) : "⭐".repeat(stars);
      } else {
        starsHtml = `<span style="opacity:0.3; font-size:11px;">–</span>`;
      }

      return `
        <button class="mobile-level-card ${isActive ? "active" : ""} ${isDone ? "done" : ""}" data-level-idx="${absIdx}">
          <div class="mobile-level-num">${String(absIdx + 1).padStart(2, "0")}</div>
          <div class="mobile-level-info">
            <div class="mobile-level-name">${lvl.n}</div>
            <div class="mobile-level-meta">
              <span class="mobile-level-stars">${starsHtml}</span>
              ${isDone ? '<span class="mobile-level-check">✓</span>' : ''}
            </div>
          </div>
        </button>
      `;
    }).join("");

    const lvlBtns = this.dom.mobileLevelsGrid.querySelectorAll("button[data-level-idx]");
    lvlBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-level-idx"), 10);
        if (!isNaN(idx)) {
          this.closeMobileHub();
          this.loadLevel(idx);
        }
      });
    });
  }

  renderSkinsModal() {
    if (!this.dom.skinsGrid || typeof window === "undefined" || !window.KOMA_SKINS) return;
    const totalStars = this.getTotalStars();
    const skins = Object.values(window.KOMA_SKINS);

    this.dom.skinsGrid.innerHTML = skins.map(skin => {
      const isUnlocked = totalStars >= skin.starsRequired;
      const isEquipped = this.equippedSkin === skin.id;
      const progress = skin.starsRequired > 0 
        ? Math.min(100, Math.round((totalStars / skin.starsRequired) * 100)) 
        : 100;

      let statusBadge = "";
      let actionButton = "";

      if (isEquipped) {
        statusBadge = `<span class="skin-badge active">✓ Aktiv</span>`;
        actionButton = `<button class="skin-action-btn equipped" disabled>Ausgerüstet</button>`;
      } else if (isUnlocked) {
        statusBadge = `<span class="skin-badge unlocked">Freigeschaltet</span>`;
        actionButton = `<button class="skin-action-btn equip" data-skin-id="${skin.id}">Ausrüsten</button>`;
      } else {
        const starSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(12, "var(--gold)", false) : "⭐";
        statusBadge = `<span class="skin-badge locked">🔒 ${skin.starsRequired} ${starSvg}</span>`;
        actionButton = `
          <div class="skin-progress-container">
            <div class="skin-progress-bar">
              <div class="skin-progress-fill" style="width: ${progress}%"></div>
            </div>
            <span class="skin-progress-text">${totalStars} / ${skin.starsRequired} ${starSvg}</span>
          </div>
        `;
      }

      return `
        <div class="skin-card ${isEquipped ? "equipped" : ""} ${isUnlocked ? "unlocked" : "locked"}" style="--skin-accent: ${skin.accentColor}">
          <div class="skin-card-header">
            <div class="skin-icon-wrap">
              <span class="skin-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getSkinIcon(skin.id, 26, skin.accentColor) : skin.icon}</span>
              <span class="skin-jp-tag">${skin.jpName}</span>
            </div>
            <div class="skin-title-wrap">
              <div class="skin-name">${skin.name}</div>
              <div class="skin-sub">${skin.subtitle}</div>
            </div>
            ${statusBadge}
          </div>
          <p class="skin-desc">${skin.desc}</p>
          <div class="skin-card-footer">
            ${actionButton}
          </div>
        </div>
      `;
    }).join("");

    // Add event listeners to "Ausrüsten" buttons
    const equipBtns = this.dom.skinsGrid.querySelectorAll("button[data-skin-id]");
    equipBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const skinId = btn.getAttribute("data-skin-id");
        this.equipSkin(skinId);
      });
    });
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
    if (this.isDailyTrial) {
      if (this.dom.creditBadge) {
        this.dom.creditBadge.textContent = "0 / 0 (Gesperrt)";
      }
      if (this.dom.creditStars) {
        this.dom.creditStars.innerHTML = `<span style="color: #f97316; font-weight: 700;">🔥 Meister-Prüfung</span>`;
      }
      if (this.dom.mobileLvlCredits) {
        this.dom.mobileLvlCredits.textContent = "0/0 🚫";
      }
      if (this.dom.btnCamRotateLeft) {
        this.dom.btnCamRotateLeft.classList.add("disabled");
        this.dom.btnCamRotateLeft.title = "Kameraschwenker in der täglichen Prüfung verboten!";
      }
      if (this.dom.btnCamRotateRight) {
        this.dom.btnCamRotateRight.classList.add("disabled");
        this.dom.btnCamRotateRight.title = "Kameraschwenker in der täglichen Prüfung verboten!";
      }
      return;
    }

    if (this.dom.btnCamRotateLeft) {
      this.dom.btnCamRotateLeft.classList.remove("disabled");
      this.dom.btnCamRotateLeft.title = "Kamera 45° nach links schwenken (-1 Credit)";
    }
    if (this.dom.btnCamRotateRight) {
      this.dom.btnCamRotateRight.classList.remove("disabled");
      this.dom.btnCamRotateRight.title = "Kamera 45° nach rechts schwenken (-1 Credit)";
    }

    if (this.dom.creditBadge) {
      this.dom.creditBadge.textContent = `${this.cameraCredits} / ${this.maxCameraCredits}`;
    }
    if (this.dom.creditStars) {
      const stars = this.calculateStars(this.cameraCredits, this.maxCameraCredits);
      if (stars > 0) {
        const starText = "⭐".repeat(stars);
        const starsHtml = typeof KOMA_ICONS !== "undefined"
          ? KOMA_ICONS.getStarsRow(stars, 3, 14)
          : starText;
        this.dom.creditStars.innerHTML = `${starsHtml}<span class="sr-only">${starText}</span>`;
      } else {
        this.dom.creditStars.textContent = "–";
      }
    }
    if (this.dom.mobileLvlCredits) {
      this.dom.mobileLvlCredits.textContent = `${this.cameraCredits}/${this.maxCameraCredits} 🎥`;
    }
  }

  loadDailyTrial() {
    if (this.isPlaying) return;
    this.isDailyTrial = true;
    const dailyLevel = (typeof DailyTrial !== "undefined") ? DailyTrial.getTodayLevel() : null;
    if (!dailyLevel) return;
    
    this.currentLevelIdx = -1;
    this.queue = [];
    this.currentStep = 0;
    
    // Strict Hardcore rule: Zero camera credits (swivels disabled)
    this.cameraCredits = 0;
    this.maxCameraCredits = 0;
    if (this.renderer) {
      this.renderer.swivelDisabled = true;
    }
    
    this.resetState();
    
    // Update Header & Card
    if (this.dom.levelTitle) this.dom.levelTitle.textContent = dailyLevel.n;
    if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = `🔥 Tägliche Schreinprüfung · ${typeof DailyTrial !== "undefined" ? DailyTrial.getFormattedDate() : "Heute"}`;
    if (this.dom.levelTag) this.dom.levelTag.textContent = dailyLevel.t;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = dailyLevel.d;
    if (this.dom.missionBadge) this.dom.missionBadge.textContent = "🔥 DAILY";
    if (this.dom.progressBar) this.dom.progressBar.style.width = "0%";
    if (this.dom.mobileLvlTitle) this.dom.mobileLvlTitle.textContent = "Tages-Prüfung";
    if (this.dom.mobileLvlCredits) this.dom.mobileLvlCredits.textContent = "0/0 🚫";
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-executing");
      document.body.classList.add("is-daily-trial");
    }
    
    this.setFeedback("Tägliche Schreinprüfung geladen! Kameraschwenker sind deaktiviert (0 Credits). Plane deine Befehle vorab.", "normal");
    
    // Render in 3D Scene
    this.renderer.loadLevel(dailyLevel);

    // Update Music Track: Berg Fuji winter theme gets dedicated ice soundtrack
    const isFuji = (dailyLevel.theme === "fuji");
    if (typeof Sound !== "undefined" && typeof Sound.setTrack === "function") {
      Sound.setTrack(isFuji ? "ice" : "default");
    }
    
    this.renderQueue();
    this.renderLevelDrawer();
    this.renderCameraCredits();
  }

  loadLevel(idx) {
    if (this.isPlaying) return;
    this.isDailyTrial = false;
    this.maxCameraCredits = 6;
    this.cameraCredits = 6;
    if (this.renderer) {
      this.renderer.swivelDisabled = false;
    }
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-daily-trial");
    }
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
    if (this.dom.mobileLvlTitle) this.dom.mobileLvlTitle.textContent = `Lvl ${String(idx + 1).padStart(2, "0")}`;
    if (this.dom.mobileLvlCredits) this.dom.mobileLvlCredits.textContent = `${this.cameraCredits}/${this.maxCameraCredits} 🎥`;
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-executing");
    }
    
    this.setFeedback("Plane deine Befehlsfolge und drücke auf „Plan abspielen“.", "normal");
    
    // Render in 3D Scene
    this.renderer.loadLevel(lvl);

    // Update Music Track: Berg Fuji / Winter / Eiswelt gets dedicated ethereal soundtrack
    const isFuji = (lvl && lvl.c && (lvl.c.includes("Fuji") || lvl.c.includes("Berg"))) || (lvl && lvl.theme === "fuji") || (idx >= 50 && idx < 60);
    if (typeof Sound !== "undefined" && typeof Sound.setTrack === "function") {
      Sound.setTrack(isFuji ? "ice" : "default");
    }
    
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

  // Tactile Haptic Vibration System (for Mobile and Vibration-supported hardware)
  triggerHaptic(pattern = 14) {
    if (!this.hapticsEnabled) return;
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  updateHapticButton() {
    if (!this.dom.btnMobileHapticToggle) return;
    if (this.hapticsEnabled) {
      this.dom.btnMobileHapticToggle.classList.add("active");
      this.dom.btnMobileHapticToggle.textContent = "Haptik An";
    } else {
      this.dom.btnMobileHapticToggle.classList.remove("active");
      this.dom.btnMobileHapticToggle.textContent = "Haptik Aus";
    }
  }

  addCommand(cmd) {
    if (this.isPlaying) return;
    this.triggerHaptic(14);
    const lvl = this.getCurrentLevel();
    if (this.queue.length >= lvl.limit) {
      this.setFeedback("Dein Plan ist voll! Entferne einen Befehl für neue Schritte.", "bad");
      Sound.playBump();
      this.triggerHaptic([35, 30, 40]);
      return;
    }
    this.queue.push(cmd);
    Sound.playClick();
    this.renderQueue();
    this.setFeedback(`${this.commandMeta[cmd].name} hinzugefügt.`, "normal");
  }

  undo() {
    if (this.isPlaying || !this.queue.length) return;
    this.triggerHaptic(12);
    this.queue.pop();
    Sound.playClick();
    this.renderQueue();
    this.setFeedback("Letzten Befehl entfernt.", "normal");
  }

  reset(clearQueue = false) {
    this.triggerHaptic(12);
    if (this.playbackTimer) clearTimeout(this.playbackTimer);
    if (this.renderer && this.renderer.komaState) {
      this.renderer.komaState.onLanding = null;
    }
    this.isPlaying = false;
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-executing");
    }
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
        const chipIcon = this.commandMeta[cmd].iconSvg || this.commandMeta[cmd].icon;
        slot.innerHTML = `
          <span class="chip-icon">${chipIcon}<span class="sr-only">${this.commandMeta[cmd].icon}</span></span>
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

    // Determine level range based on selected chapter tab
    let minIdx = 0;
    let maxIdx = LEVELS.length - 1;
    if (this.activeDrawerChapter && this.activeDrawerChapter !== "all") {
      const ch = parseInt(this.activeDrawerChapter, 10);
      if (!isNaN(ch) && ch >= 1 && ch <= 6) {
        minIdx = (ch - 1) * 10;
        maxIdx = Math.min(ch * 10 - 1, LEVELS.length - 1);
      }
    }

    LEVELS.forEach((lvl, idx) => {
      if (idx < minIdx || idx > maxIdx) return;

      const btn = document.createElement("button");
      btn.className =
        "level-pill-btn" +
        (idx === this.currentLevelIdx ? " active" : "") +
        (this.completedLevels.has(idx) ? " done" : "");
      
      const stars = this.levelStars[idx];
      let starMarkup = "";
      if (stars !== undefined) {
        if (stars > 0) {
          const starsSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getStarsRow(stars, stars, 12) : "⭐".repeat(stars);
          starMarkup = `<span class="pill-stars">${starsSvg}<span class="sr-only">${"⭐".repeat(stars)}</span></span>`;
        } else {
          const emptySvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starEmpty(11, "rgba(255,255,255,0.3)") : "0⭐";
          starMarkup = `<span class="pill-stars zero">${emptySvg}<span class="sr-only">0⭐</span></span>`;
        }
      }

      const isFujiLvl = idx >= 50;
      btn.innerHTML = `
        <span class="pill-number">${idx + 1}</span>
        <span class="pill-title">${isFujiLvl ? "🏔️ " : ""}${lvl.n}</span>
        ${starMarkup}
        ${this.completedLevels.has(idx) ? '<span class="pill-check">✓</span>' : ""}
      `;
      btn.onclick = () => {
        this.triggerHaptic(14);
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
    this.triggerHaptic(28);
    if (!this.queue.length) {
      this.setFeedback("Füge zuerst mindestens einen Befehl hinzu.", "bad");
      Sound.playBump();
      this.triggerHaptic([35, 30, 40]);
      return;
    }

    this.resetKomaPosition();
    this.currentStep = 0;
    this.isPlaying = true;
    if (typeof document !== "undefined") {
      document.body.classList.add("is-executing");
    }
    this.setFeedback("Los geht's! KOMA führt deinen Plan aus …", "normal");
    this.renderQueue();

    this.playbackTimer = setTimeout(() => this.executeNextStep(), 350);
  }

  executeNextStep() {
    if (this.currentStep >= this.queue.length) {
      this.isPlaying = false;
      if (typeof document !== "undefined") {
        document.body.classList.remove("is-executing");
      }
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
      this.renderer.animateRotate(this.state.dir, 220);
      Sound.playTurn();
      this.playbackTimer = setTimeout(() => this.executeNextStep(), 250);
      return;
    }

    // 2. Turn Right
    if (cmd === "R") {
      const turnMap = { N: "E", E: "S", S: "W", W: "N" };
      this.state.dir = turnMap[this.state.dir];
      this.renderer.animateRotate(this.state.dir, 220);
      Sound.playTurn();
      this.playbackTimer = setTimeout(() => this.executeNextStep(), 250);
      return;
    }

    // 3. Action
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
      this.playbackTimer = setTimeout(() => this.executeNextStep(), 300);
      return;
    }

    // 4. Forward
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
        if (typeof document !== "undefined") {
          document.body.classList.remove("is-executing");
        }
        this.renderer.animateBump();
        Sound.playBump();
        this.triggerHaptic([45, 30, 50]);
        const reason = isBlockedGate ? "Das Tor ist noch verschlossen!" : "Da ist ein Hindernis.";
        this.setFeedback(`Plopp! ${reason} KOMA bleibt stehen – passe deinen Plan an.`, "bad");
        this.renderQueue();
        return;
      }

      // Valid step: Hop forward (300ms) and trigger audio & events on exact touchdown
      this.state.x = nx;
      this.state.y = ny;

      this.renderer.animateMove(nx, ny, 300, () => {
        if (!this.isPlaying) return; // In case reset was pressed during animation

        // Play footstep sound and tactile step pulse precisely at touchdown
        Sound.playStep();
        this.triggerHaptic(18);

        // Check if stepped on a Spirit Orb
        if (lvl.orbs && lvl.orbs.length > 0) {
          const orbKey = `${this.state.x},${this.state.y}`;
          const hasOrb = lvl.orbs.some(o => o[0] === this.state.x && o[1] === this.state.y);
          if (hasOrb && !this.state.collectedOrbs.has(orbKey)) {
            this.state.collectedOrbs.add(orbKey);
            this.stats.orbsCollected = (this.stats.orbsCollected || 0) + 1;
            this.saveProgress();
            this.checkAchievements();
            Sound.playOrb();
            this.triggerHaptic([15, 30, 25]);
            this.renderer.collectOrb(this.state.x, this.state.y);
            this.setFeedback(`🌸 Geisterlicht eingesammelt! (${this.state.collectedOrbs.size} / ${lvl.orbs.length})`, "good");
          }
        }

        // Check if stepped on a Kitsune Portal
        if (lvl.portals && lvl.portals.length === 2) {
          const [p1, p2] = lvl.portals;
          let destPortal = null;
          if (nx === p1[0] && ny === p1[1]) destPortal = p2;
          else if (nx === p2[0] && ny === p2[1]) destPortal = p1;

          if (destPortal) {
            this.state.x = destPortal[0];
            this.state.y = destPortal[1];
            Sound.playPortal();
            this.triggerHaptic([20, 35, 20, 35, 40]);
            this.renderer.animateTeleport(destPortal[0], destPortal[1]);
            this.setFeedback("🌀 Kitsune-Portal betreten! KOMA beamt sich ans Ziel-Portal.", "normal");
            this.playbackTimer = setTimeout(() => this.handleWindPush(lvl, () => this.handlePostMoveChecks(lvl)), 180);
            return;
          }
        }

        this.handleWindPush(lvl, () => this.handlePostMoveChecks(lvl));
      });
    }
  }

  handleWindPush(lvl, onComplete, chainCount = 0) {
    if (!this.isPlaying) return;
    if (chainCount >= 10) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const winds = lvl.winds || [];
    const windMatch = winds.find(w => w[0] === this.state.x && w[1] === this.state.y);
    if (!windMatch) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const wdir = windMatch[2];
    const deltaMap = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
    const [wdx, wdy] = deltaMap[wdir] || [0, 0];
    const wx = this.state.x + wdx;
    const wy = this.state.y + wdy;

    const isOOB = wx < 0 || wy < 0 || wx >= lvl.w || wy >= lvl.h;
    const isWall = lvl.walls && lvl.walls.some(w => w[0] === wx && w[1] === wy);
    const allGates = lvl.gates || lvl.gate || [];
    const gateMatch = allGates.find(g => g[0] === wx && g[1] === wy);
    const isBlockedGate = gateMatch && !this.state.openGates.has(gateMatch[2] || "magenta") && !(allGates.length === 1 && this.state.openGates.size > 0);

    if (isOOB || isWall || isBlockedGate) {
      // Wind blocked by barrier: KOMA is pushed against the obstacle and stays on current wind tile
      Sound.playWind();
      this.renderer.animateBump();
      this.triggerHaptic([40, 25, 40]);
      this.setFeedback("💨 Eine Windböe erfasst KOMA, aber ein Hindernis stoppt den Windstoß!", "normal");
      if (typeof onComplete === "function") onComplete();
      return;
    }

    // Wind pushes KOMA forward!
    this.state.x = wx;
    this.state.y = wy;
    this.stats.windGusts = (this.stats.windGusts || 0) + 1;
    this.saveProgress();
    this.checkAchievements();
    Sound.playWind();
    this.triggerHaptic([25, 30, 40]);
    this.setFeedback("💨 Eine kräftige Bergwindböe trägt KOMA mit sich!", "good");

    const slideFn = typeof this.renderer.animateWindSlide === "function"
      ? (tx, ty, d, cb) => this.renderer.animateWindSlide(tx, ty, d, cb)
      : (tx, ty, d, cb) => this.renderer.animateMove(tx, ty, 260, cb);

    slideFn(wx, wy, wdir, () => {
      if (!this.isPlaying) return;

      // Check orb collection on wind landing tile
      if (lvl.orbs && lvl.orbs.length > 0) {
        const orbKey = `${wx},${wy}`;
        const hasOrb = lvl.orbs.some(o => o[0] === wx && o[1] === wy);
        if (hasOrb && !this.state.collectedOrbs.has(orbKey)) {
          this.state.collectedOrbs.add(orbKey);
          this.stats.orbsCollected = (this.stats.orbsCollected || 0) + 1;
          this.saveProgress();
          this.checkAchievements();
          Sound.playOrb();
          this.renderer.collectOrb(wx, wy);
          this.setFeedback(`🌸 Geisterlicht im Flug eingesammelt! (${this.state.collectedOrbs.size} / ${lvl.orbs.length})`, "good");
        }
      }

      // Check portal on wind landing tile
      if (lvl.portals && lvl.portals.length === 2) {
        const [p1, p2] = lvl.portals;
        let dest = null;
        if (wx === p1[0] && wy === p1[1]) dest = p2;
        else if (wx === p2[0] && wy === p2[1]) dest = p1;

        if (dest) {
          this.state.x = dest[0];
          this.state.y = dest[1];
          Sound.playPortal();
          this.renderer.animateTeleport(dest[0], dest[1]);
          this.setFeedback("🌀 Vom Wind direkt ins Kitsune-Portal getragen!", "normal");
          this.playbackTimer = setTimeout(() => this.handleWindPush(lvl, onComplete, chainCount + 1), 180);
          return;
        }
      }

      // Check chained wind tiles
      this.handleWindPush(lvl, onComplete, chainCount + 1);
    });
  }

  handlePostMoveChecks(lvl) {
    if (!this.isPlaying) return;

    // Check Victory
    if (this.state.x === lvl.g[0] && this.state.y === lvl.g[1]) {
      if (lvl.orbs && this.state.collectedOrbs.size < lvl.orbs.length) {
        this.setFeedback(`⛩️ Ziel noch versiegelt! Sammle noch ${lvl.orbs.length - this.state.collectedOrbs.size} Geisterlicht(er).`, "bad");
        Sound.playBump();
        return;
      }
      this.state.isWin = true;
      this.isPlaying = false;
      if (typeof document !== "undefined") {
        document.body.classList.remove("is-executing");
      }

      if (this.isDailyTrial) {
        const res = (typeof DailyTrial !== "undefined")
          ? DailyTrial.recordCompletion()
          : { currentStreak: 1, isNewRecord: false };

        this.renderer.animateWin();
        Sound.playWin();
        this.triggerHaptic([40, 50, 40, 50, 80, 80, 120]);

        if (this.dom.progressBar) this.dom.progressBar.style.width = "100%";
        this.setFeedback(`⛩️ TÄGLICHE PRÜFUNG GEMEISTERT! 🔥 Tages-Streak: ${res.currentStreak} Tage!`, "good");

        setTimeout(() => {
          if (this.dom.modalWinTitle) {
            this.dom.modalWinTitle.textContent = "Tägliche Schreinprüfung gemeistert! 🔥";
          }
          if (this.dom.modalWinText) {
            this.dom.modalWinText.textContent = `Du hast die heutige Meisterprüfung ohne Kameraschwenker in ${this.currentStep} Schritten gelöst!`;
          }
          if (this.dom.modalWinStars) {
            this.dom.modalWinStars.innerHTML = `
              <div class="daily-win-streak-badge">
                <span class="flame-big">🔥</span>
                <div class="streak-big-val">${res.currentStreak} ${res.currentStreak === 1 ? "Tag" : "Tage"} Streak!</div>
                <div class="streak-sub-text">${res.isNewRecord ? "🎉 NEUER PERSÖNLICHER REKORD!" : "Komm morgen für die nächste Schrein-Prüfung wieder!"}</div>
              </div>
            `;
          }
          if (this.dom.modalWinCredits) {
            this.dom.modalWinCredits.textContent = "0 Kameraschwenker verwendet · Reine Vorab-Planung!";
          }
          if (this.dom.modalWin) this.dom.modalWin.classList.add("active");
        }, 450);
        return;
      }

      this.completedLevels.add(this.currentLevelIdx);
      
      const stars = this.calculateStars(this.cameraCredits, this.maxCameraCredits);
      this.levelStars[this.currentLevelIdx] = Math.max(this.levelStars[this.currentLevelIdx] || 0, stars);
      
      this.stats.threeStarCount = Object.values(this.levelStars).filter(s => s === 3).length;
      if (lvl.solution && this.currentStep <= lvl.solution.length) {
        this.stats.minimalWins = (this.stats.minimalWins || 0) + 1;
      }

      this.saveProgress();
      this.checkAchievements();
      this.renderLevelDrawer();
      this.renderQueue();
      this.updateStarsDisplay();

      this.renderer.animateWin();
      Sound.playWin();
      this.triggerHaptic([40, 50, 40, 50, 80, 80, 120]);

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
            const isFilled = i <= stars;
            const svgStar = isFilled
              ? (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(36, "var(--gold)", true) : "⭐")
              : (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starEmpty(36, "rgba(255,255,255,0.3)") : "☆");
            starHtml += `<span class="win-star ${isFilled ? "filled" : "empty"}">${svgStar}<span class="sr-only">${isFilled ? "⭐" : "☆"}</span></span>`;
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

        // Check if any new Kami skin was unlocked
        const newTotalStars = this.getTotalStars();
        let newlyUnlockedSkin = null;
        if (typeof window !== "undefined" && window.KOMA_SKINS) {
          for (const skin of Object.values(window.KOMA_SKINS)) {
            if (skin.starsRequired > 0 && newTotalStars >= skin.starsRequired && !this.unlockedSkinNotices.has(skin.id)) {
              newlyUnlockedSkin = skin;
              this.unlockedSkinNotices.add(skin.id);
              try {
                localStorage.setItem("koma_skin_notices", JSON.stringify(Array.from(this.unlockedSkinNotices)));
              } catch (e) {}
              break;
            }
          }
        }

        if (this.dom.modalWinSkinNotice) {
          if (newlyUnlockedSkin) {
            this.dom.modalWinSkinNotice.innerHTML = `
              <div class="win-skin-banner">
                <span class="win-skin-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getSkinIcon(newlyUnlockedSkin.id, 28, newlyUnlockedSkin.accentColor) : newlyUnlockedSkin.icon}</span>
                <div class="win-skin-info">
                  <span class="win-skin-kicker">🎉 Neuer Kami-Skin freigeschaltet!</span>
                  <strong class="win-skin-name">${newlyUnlockedSkin.name} (${newlyUnlockedSkin.jpName})</strong>
                </div>
                <button class="win-skin-btn" id="btnWinOpenSkins">Garderobe 👘</button>
              </div>
            `;
            this.dom.modalWinSkinNotice.style.display = "block";
            const btnNotice = document.getElementById("btnWinOpenSkins");
            if (btnNotice) {
              btnNotice.addEventListener("click", () => {
                if (this.dom.modalWin) this.dom.modalWin.classList.remove("active");
                this.openSkinsModal();
              });
            }
          } else {
            this.dom.modalWinSkinNotice.style.display = "none";
            this.dom.modalWinSkinNotice.innerHTML = "";
          }
        }

        if (this.dom.btnNextLevel) {
          this.dom.btnNextLevel.textContent =
            this.currentLevelIdx === LEVELS.length - 1 ? "Erstes Level erneut spielen" : "Nächstes Level →";
        }
        if (this.dom.modalWin) this.dom.modalWin.classList.add("active");
      }, 700);
      return;
    }

    // Next step with crisp, steady rhythm (100ms interval between steps)
    this.playbackTimer = setTimeout(() => this.executeNextStep(), 100);
  }

  // Progressive Web App (PWA) & Mobile Lifecycle
  setupPwaAndMobile() {
    // 1. Service Worker Registration for Offline Cache
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").then((reg) => {
          console.log("[PWA] Service Worker registered with scope:", reg.scope);
        }).catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
      });
    }

    // 2. Custom PWA Install Prompt
    this.deferredInstallPrompt = null;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.dom.btnInstallPwa) {
        this.dom.btnInstallPwa.classList.remove("hidden");
      }
    });

    if (this.dom.btnInstallPwa) {
      this.dom.btnInstallPwa.addEventListener("click", async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice && choice.outcome === "accepted") {
          this.showNetworkToast("⛩️ KOMA wird installiert...", false);
        }
        this.deferredInstallPrompt = null;
        this.dom.btnInstallPwa.classList.add("hidden");
      });
    }

    window.addEventListener("appinstalled", () => {
      this.deferredInstallPrompt = null;
      if (this.dom.btnInstallPwa) {
        this.dom.btnInstallPwa.classList.add("hidden");
      }
      this.showNetworkToast("🎉 KOMA erfolgreich als App installiert!", false);
    });

    // 3. Network Online / Offline Detection
    window.addEventListener("offline", () => {
      this.showNetworkToast("⛩️ Offline-Modus aktiv · Schreine bereit!", true);
    });

    window.addEventListener("online", () => {
      this.showNetworkToast("🌐 Wieder online · Verbindung synchronisiert", false);
    });
  }

  showNetworkToast(message, isOffline = false) {
    if (!this.dom.pwaNetworkBanner || !this.dom.pwaNetworkText) return;
    this.dom.pwaNetworkText.textContent = message;
    this.dom.pwaNetworkBanner.classList.remove("hidden", "pwa-toast-offline", "pwa-toast-online");
    this.dom.pwaNetworkBanner.classList.add(isOffline ? "pwa-toast-offline" : "pwa-toast-online");

    if (this.networkToastTimer) clearTimeout(this.networkToastTimer);
    this.networkToastTimer = setTimeout(() => {
      if (this.dom.pwaNetworkBanner) {
        this.dom.pwaNetworkBanner.classList.add("hidden");
      }
    }, 3800);
  }
}

// Start Game on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.Game = new GameEngine();
});
