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
    iconKey: "monk",
    desc: "Schließe 10 Level mit vollen 3 Sternen ab (ohne Kameradrehung).",
    goal: 10,
    getProgress: (game) => game.stats.threeStarCount || 0
  },
  {
    id: "spirit_friend",
    name: "Geisterfreund",
    jpName: "霊友",
    icon: "🦊",
    iconKey: "fox",
    desc: "Sammle insgesamt 50 Geisterlichter (Orbs) in den Schreingärten.",
    goal: 50,
    getProgress: (game) => game.stats.orbsCollected || 0
  },
  {
    id: "wind_master",
    name: "Herr des Windes",
    jpName: "風神の息",
    icon: "💨",
    iconKey: "wind",
    desc: "Lass dich 25 Mal von einer heiligen Bergwindböe tragen.",
    goal: 25,
    getProgress: (game) => game.stats.windGusts || 0
  },
  {
    id: "fuji_climber",
    name: "Fuji-Besteiger",
    jpName: "富士登頂",
    icon: "🏔️",
    iconKey: "fuji",
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
    iconKey: "sakura",
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
    iconKey: "lightning",
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
    this.bonusStars = 0;
    
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
      btnHome: document.getElementById("btnHome"),
      homeScreen: document.getElementById("homeScreen"),
      btnHomeClose: document.getElementById("btnHomeClose"),
      btnHomePlay: document.getElementById("btnHomePlay"),
      homePlayBtnText: document.getElementById("homePlayBtnText"),
      btnHomeModeDropdown: document.getElementById("btnHomeModeDropdown"),
      homeCurrentModeIcon: document.getElementById("homeCurrentModeIcon"),
      homeCurrentModeLabel: document.getElementById("homeCurrentModeLabel"),
      homeModeMenu: document.getElementById("homeModeMenu"),
      checkModeCampaign: document.getElementById("checkModeCampaign"),
      checkModeTower: document.getElementById("checkModeTower"),
      checkModeDaily: document.getElementById("checkModeDaily"),
      menuDailyBadge: document.getElementById("menuDailyBadge"),
      btnHomeDailyWidget: document.getElementById("btnHomeDailyWidget"),
      btnHomeWardrobeWidget: document.getElementById("btnHomeWardrobeWidget"),
      homeActiveSkinLabel: document.getElementById("homeActiveSkinLabel"),
      btnHomeChapters: document.getElementById("btnHomeChapters"),
      homeTotalStars: document.getElementById("homeTotalStars"),
      homeLevelPlaque: document.getElementById("homeLevelPlaque"),
      homeLevelBigNumber: document.getElementById("homeLevelBigNumber"),
      btnHomeAudioMusic: document.getElementById("btnHomeAudioMusic"),
      btnHomeAudioSound: document.getElementById("btnHomeAudioSound"),
      btnHomeHelp: document.getElementById("btnHomeHelp"),
      btnHomeOpenWardrobe: document.getElementById("btnHomeOpenWardrobe"),
      homeSkinIcon: document.getElementById("homeSkinIcon"),
      homeSkinName: document.getElementById("homeSkinName"),
      homeSkinSub: document.getElementById("homeSkinSub"),
      homeSkinTag: document.getElementById("homeSkinTag"),
      homeSkinDesc: document.getElementById("homeSkinDesc"),
      homeCurrentChapter: document.getElementById("homeCurrentChapter"),
      homeCurrentStatus: document.getElementById("homeCurrentStatus"),
      homeCurrentLevelTitle: document.getElementById("homeCurrentLevelTitle"),
      homeCurrentLevelDesc: document.getElementById("homeCurrentLevelDesc"),
      homeCurrentStarsRow: document.getElementById("homeCurrentStarsRow"),
      btnHomeResume: document.getElementById("btnHomeResume"),
      btnHomeModeCampaign: document.getElementById("btnHomeModeCampaign"),
      btnHomeModeTower: document.getElementById("btnHomeModeTower"),
      btnHomeModeDaily: document.getElementById("btnHomeModeDaily"),
      btnHomeModeWardrobe: document.getElementById("btnHomeModeWardrobe"),
      btnHomeModeTrophies: document.getElementById("btnHomeModeTrophies"),
      homeTowerBadge: document.getElementById("homeTowerBadge"),
      homeDailyBadge: document.getElementById("homeDailyBadge"),
      homeTrophiesBadge: document.getElementById("homeTrophiesBadge"),
      btnJumpFujiDrawer: document.getElementById("btnJumpFujiDrawer"),
      drawerChapterTabs: document.getElementById("drawerChapterTabs"),
      btnMobileHapticToggle: document.getElementById("btnMobileHapticToggle"),
      btnDailyTrial: document.getElementById("btnDailyTrial"),
      modalDailyTrial: document.getElementById("modalDailyTrial"),
      btnCloseDailyTrial: document.getElementById("btnCloseDailyTrial"),
      btnStartDailyTrial: document.getElementById("btnStartDailyTrial"),
      btnMobileOpenDaily: document.getElementById("btnMobileOpenDaily"),
      headerDailyStreak: document.getElementById("headerDailyStreak"),
      btnTowerMode: document.getElementById("btnTowerMode"),
      btnMobileOpenTower: document.getElementById("btnMobileOpenTower"),
      modalTowerIntro: document.getElementById("modalTowerIntro"),
      btnCloseTowerIntro: document.getElementById("btnCloseTowerIntro"),
      btnStartTowerRun: document.getElementById("btnStartTowerRun"),
      modalTowerAltar: document.getElementById("modalTowerAltar"),
      towerAltarChoices: document.getElementById("towerAltarChoices"),
      modalTowerGameOver: document.getElementById("modalTowerGameOver"),
      towerReviveBox: document.getElementById("towerReviveBox"),
      btnTowerRevive: document.getElementById("btnTowerRevive"),
      btnTowerRetry: document.getElementById("btnTowerRetry"),
      btnTowerExitToCampaign: document.getElementById("btnTowerExitToCampaign"),
      btnDesktopWardrobeAd: document.getElementById("btnDesktopWardrobeAd"),
      btnMobileWardrobeAd: document.getElementById("btnMobileWardrobeAd"),
      towerHudBar: document.getElementById("towerHudBar"),
      headerTowerBest: document.getElementById("headerTowerBest"),
      mobileTowerBest: document.getElementById("mobileTowerBest"),
      towerHeroBestFloor: document.getElementById("towerHeroBestFloor"),
      towerHeroBestScore: document.getElementById("towerHeroBestScore"),
      towerResultFloor: document.getElementById("towerResultFloor"),
      towerResultScore: document.getElementById("towerResultScore"),
      modalMechanicIntro: document.getElementById("modalMechanicIntro"),
      mechanicIntroTitle: document.getElementById("mechanicIntroTitle"),
      mechanicIntroSubtitle: document.getElementById("mechanicIntroSubtitle"),
      mechanicIntroDesc: document.getElementById("mechanicIntroDesc"),
      mechanicIntroIcon: document.getElementById("mechanicIntroIcon"),
      mechanicIntroBullets: document.getElementById("mechanicIntroBullets"),
      btnDismissMechanicIntro: document.getElementById("btnDismissMechanicIntro"),
      btnCloseMechanicIntro: document.getElementById("btnCloseMechanicIntro"),
      towerResultZen: document.getElementById("towerResultZen"),
      towerResultZenRow: document.getElementById("towerResultZenRow"),
      towerResultRecord: document.getElementById("towerResultRecord"),
      bossHudBar: document.getElementById("bossHudBar"),
      bossHudName: document.getElementById("bossHudName"),
      bossPhaseBadge: document.getElementById("bossPhaseBadge"),
      seal1: document.getElementById("seal1"),
      seal2: document.getElementById("seal2"),
      seal3: document.getElementById("seal3"),
      btnHomeLang: document.getElementById("btnHomeLang"),
      homeLangFlag: document.getElementById("homeLangFlag"),
      homeLangLabel: document.getElementById("homeLangLabel"),
      btnSettingLangDe: document.getElementById("btnSettingLangDe"),
      btnSettingLangEn: document.getElementById("btnSettingLangEn")
    };

    this.isDailyTrial = false;
    this.isTowerMode = false;
    this.activeMobileChapter = 1;
    this.activeMobileTab = "skins";
    this.activeDrawerChapter = "all";
    this.selectedHomeMode = "campaign";
    
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

    // 6. Load First Level or Progression Level
    const urlParams = (typeof window !== "undefined" && window.location) ? new URLSearchParams(window.location.search) : new URLSearchParams();
    if (urlParams.has("level") || urlParams.has("lvl")) {
      const targetLvl = parseInt(urlParams.get("level") || urlParams.get("lvl"), 10);
      if (!isNaN(targetLvl) && targetLvl >= 1 && targetLvl <= LEVELS.length) {
        this.currentLevelIdx = targetLvl - 1;
      }
    } else {
      this.currentLevelIdx = this.getProgressionLevel();
    }

    // Initialize Internationalization (i18n)
    if (typeof I18N !== "undefined") {
      I18N.onChange(() => this.onLanguageChange());
      this.onLanguageChange();
    }

    this.loadLevel(this.currentLevelIdx);

    // Initial check for any achievements already achieved from saved progress
    this.checkAchievements();

    // 7. Setup PWA & Mobile Optimizations
    this.setupPwaAndMobile();

    // 8. Update Daily Shrine Trial UI
    if (typeof DailyTrial !== "undefined" && typeof DailyTrial.updateUI === "function") {
      DailyTrial.updateUI();
    }

    // 9. Update Tower of 100 Trials UI
    if (typeof TowerTrial !== "undefined" && typeof TowerTrial.updateUI === "function") {
      TowerTrial.updateUI();
    }

    // 10. Update & Display Main Home Screen
    if (typeof Showroom3DViewer !== "undefined" && !window.showroomViewer) {
      window.showroomViewer = new Showroom3DViewer("showroomCanvas");
    }
    this.updateHomeScreen();

    const skipHome = urlParams.has("skipHome") || urlParams.has("level") || urlParams.has("lvl") || (typeof navigator !== "undefined" && navigator.webdriver && !urlParams.has("showHome"));
    if (!skipHome) {
      this.showHomeScreen();
    } else {
      this.hideHomeScreen();
    }
  }

  getCurrentLevel() {
    let lvl;
    if (this.isTowerMode && typeof TowerTrial !== "undefined") {
      lvl = TowerTrial.getCurrentLevel();
    } else if (this.isDailyTrial && typeof DailyTrial !== "undefined") {
      lvl = DailyTrial.getTodayLevel();
    } else {
      lvl = LEVELS[this.currentLevelIdx] || LEVELS[0];
    }
    if (typeof I18N !== "undefined" && typeof I18N.translateLevel === "function") {
      return I18N.translateLevel(lvl, this.currentLevelIdx);
    }
    return lvl;
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

    // Tower of 100 Trials Modals & Handlers
    const openTowerModal = () => {
      this.triggerHaptic(20);
      if (typeof TowerTrial !== "undefined") {
        TowerTrial.updateUI();
        if (this.dom.towerHeroBestFloor) {
          this.dom.towerHeroBestFloor.textContent = `Ebene ${TowerTrial.getBestFloor() || 1}`;
        }
        if (this.dom.towerHeroBestScore) {
          this.dom.towerHeroBestScore.textContent = `${TowerTrial.getBestScore().toLocaleString("de-DE")} Pkt.`;
        }
      }
      if (this.dom.modalTowerIntro) {
        this.dom.modalTowerIntro.classList.add("active");
      }
    };

    if (this.dom.btnTowerMode) {
      this.dom.btnTowerMode.addEventListener("click", openTowerModal);
    }
    if (this.dom.btnMobileOpenTower) {
      this.dom.btnMobileOpenTower.addEventListener("click", () => {
        if (this.dom.modalMobileHub) this.dom.modalMobileHub.classList.remove("active");
        openTowerModal();
      });
    }
    if (this.dom.btnCloseTowerIntro) {
      this.dom.btnCloseTowerIntro.addEventListener("click", () => {
        this.triggerHaptic(10);
        if (this.dom.modalTowerIntro) this.dom.modalTowerIntro.classList.remove("active");
      });
    }
    if (this.dom.modalTowerIntro) {
      this.dom.modalTowerIntro.addEventListener("click", (e) => {
        if (e.target === this.dom.modalTowerIntro) {
          this.dom.modalTowerIntro.classList.remove("active");
        }
      });
    }
    if (this.dom.btnStartTowerRun) {
      this.dom.btnStartTowerRun.addEventListener("click", () => {
        this.triggerHaptic(30);
        if (this.dom.modalTowerIntro) this.dom.modalTowerIntro.classList.remove("active");
        if (typeof TowerTrial !== "undefined") {
          const firstLvl = TowerTrial.startNewRun();
          this.loadTowerFloor(firstLvl);
        }
      });
    }
    if (this.dom.btnTowerRetry) {
      this.dom.btnTowerRetry.addEventListener("click", () => {
        this.triggerHaptic(30);
        if (this.dom.modalTowerGameOver) this.dom.modalTowerGameOver.classList.remove("active");
        if (typeof TowerTrial !== "undefined") {
          const firstLvl = TowerTrial.startNewRun();
          this.loadTowerFloor(firstLvl);
        }
      });
    }
    if (this.dom.btnTowerRevive) {
      this.dom.btnTowerRevive.addEventListener("click", async () => {
        this.triggerHaptic(20);
        if (typeof window !== "undefined" && window.adManager) {
          const res = await window.adManager.showRewardedAd({
            title: "Zweite Chance",
            rewardDescription: "1 Laterne für den Turm der 100 Prüfungen retten"
          });
          if (res && res.rewarded) {
            if (typeof TowerTrial !== "undefined" && typeof TowerTrial.revive === "function") {
              TowerTrial.revive();
            }
            if (this.dom.modalTowerGameOver) {
              this.dom.modalTowerGameOver.classList.remove("active");
            }
            if (typeof TowerTrial !== "undefined") {
              this.loadTowerFloor(TowerTrial.getCurrentLevel());
            }
            this.showNetworkToast("🏮 1 Laterne neu entzündet! Dein Aufstieg geht weiter.");
          }
        }
      });
    }
    if (this.dom.btnTowerExitToCampaign) {
      this.dom.btnTowerExitToCampaign.addEventListener("click", () => {
        this.triggerHaptic(12);
        if (this.dom.modalTowerGameOver) this.dom.modalTowerGameOver.classList.remove("active");
        this.loadLevel(0);
      });
    }

    // Top Nav: Return to Main Home Screen
    if (this.dom.btnHome) {
      this.dom.btnHome.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.showHomeScreen();
      });
    }

    // Language Switcher Events
    if (this.dom.btnHomeLang) {
      this.dom.btnHomeLang.addEventListener("click", () => {
        this.triggerHaptic(15);
        if (typeof I18N !== "undefined") {
          const next = I18N.getLanguage() === "de" ? "en" : "de";
          I18N.setLanguage(next);
        }
      });
    }
    if (this.dom.btnSettingLangDe) {
      this.dom.btnSettingLangDe.addEventListener("click", () => {
        this.triggerHaptic(15);
        if (typeof I18N !== "undefined") I18N.setLanguage("de");
      });
    }
    if (this.dom.btnSettingLangEn) {
      this.dom.btnSettingLangEn.addEventListener("click", () => {
        this.triggerHaptic(15);
        if (typeof I18N !== "undefined") I18N.setLanguage("en");
      });
    }

    // Home Screen Actions
    if (this.dom.btnHomeClose) {
      this.dom.btnHomeClose.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.hideHomeScreen();
      });
    }

    // Colony Flow-style Big Play Button (Directly launches current progression level or mode)
    if (this.dom.btnHomePlay) {
      this.dom.btnHomePlay.addEventListener("click", () => {
        this.triggerHaptic(25);
        if (this.selectedHomeMode === "tower") {
          this.hideHomeScreen();
          if (this.dom.modalTowerIntro) {
            if (typeof TowerTrial !== "undefined") TowerTrial.updateUI();
            this.dom.modalTowerIntro.classList.add("active");
          }
        } else if (this.selectedHomeMode === "daily") {
          this.hideHomeScreen();
          if (this.dom.modalDailyTrial) {
            if (typeof DailyTrial !== "undefined") DailyTrial.updateUI();
            this.dom.modalDailyTrial.classList.add("active");
          }
        } else {
          // Campaign progression
          const progLvl = this.getProgressionLevel();
          this.hideHomeScreen();
          this.loadLevel(progLvl);
        }
      });
    }

    // Mode Selector Dropdown Button
    if (this.dom.btnHomeModeDropdown) {
      this.dom.btnHomeModeDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        this.triggerHaptic(12);
        if (!this.dom.homeModeMenu) return;
        const isHidden = this.dom.homeModeMenu.classList.contains("hidden");
        if (isHidden) {
          this.dom.homeModeMenu.classList.remove("hidden");
          this.dom.btnHomeModeDropdown.classList.add("open");
          this.dom.btnHomeModeDropdown.setAttribute("aria-expanded", "true");
        } else {
          this.dom.homeModeMenu.classList.add("hidden");
          this.dom.btnHomeModeDropdown.classList.remove("open");
          this.dom.btnHomeModeDropdown.setAttribute("aria-expanded", "false");
        }
      });
    }

    // Mode Selection Menu Items
    const homeModeItems = document.querySelectorAll(".home-mode-item");
    homeModeItems.forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.triggerHaptic(15);
        const m = item.getAttribute("data-mode");
        if (m) this.setHomeMode(m);
        if (this.dom.homeModeMenu) this.dom.homeModeMenu.classList.add("hidden");
        if (this.dom.btnHomeModeDropdown) {
          this.dom.btnHomeModeDropdown.classList.remove("open");
          this.dom.btnHomeModeDropdown.setAttribute("aria-expanded", "false");
        }
      });
    });

    // Close mode menu on click outside
    document.addEventListener("click", (e) => {
      if (this.dom.homeModeMenu && !this.dom.homeModeMenu.classList.contains("hidden")) {
        if (!this.dom.homeModeMenu.contains(e.target) && (!this.dom.btnHomeModeDropdown || !this.dom.btnHomeModeDropdown.contains(e.target))) {
          this.dom.homeModeMenu.classList.add("hidden");
          if (this.dom.btnHomeModeDropdown) {
            this.dom.btnHomeModeDropdown.classList.remove("open");
            this.dom.btnHomeModeDropdown.setAttribute("aria-expanded", "false");
          }
        }
      }
    });

    // Top-Left Widgets: Daily Challenge & Wardrobe
    if (this.dom.btnHomeDailyWidget) {
      this.dom.btnHomeDailyWidget.addEventListener("click", () => {
        this.triggerHaptic(18);
        this.hideHomeScreen();
        if (this.dom.modalDailyTrial) {
          if (typeof DailyTrial !== "undefined") DailyTrial.updateUI();
          this.dom.modalDailyTrial.classList.add("active");
        }
      });
    }

    if (this.dom.btnHomeWardrobeWidget) {
      this.dom.btnHomeWardrobeWidget.addEventListener("click", () => {
        this.triggerHaptic(16);
        this.openSkinsModal();
      });
    }

    // Top-Right Widget: Chapters Overview
    if (this.dom.btnHomeChapters) {
      this.dom.btnHomeChapters.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.openLevelDrawer();
      });
    }

    if (this.dom.btnHomeResume) {
      this.dom.btnHomeResume.addEventListener("click", () => {
        this.triggerHaptic(20);
        this.hideHomeScreen();
      });
    }

    if (this.dom.btnHomeOpenWardrobe) {
      this.dom.btnHomeOpenWardrobe.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.openSkinsModal();
      });
    }

    if (this.dom.btnHomeModeCampaign) {
      this.dom.btnHomeModeCampaign.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.hideHomeScreen();
        this.openLevelDrawer();
      });
    }

    if (this.dom.btnHomeModeTower) {
      this.dom.btnHomeModeTower.addEventListener("click", () => {
        this.triggerHaptic(20);
        this.hideHomeScreen();
        if (this.dom.modalTowerIntro) {
          if (typeof TowerTrial !== "undefined") TowerTrial.updateUI();
          this.dom.modalTowerIntro.classList.add("active");
        }
      });
    }

    if (this.dom.btnHomeModeDaily) {
      this.dom.btnHomeModeDaily.addEventListener("click", () => {
        this.triggerHaptic(20);
        this.hideHomeScreen();
        if (this.dom.modalDailyTrial) {
          if (typeof DailyTrial !== "undefined") DailyTrial.updateUI();
          this.dom.modalDailyTrial.classList.add("active");
        }
      });
    }

    if (this.dom.btnHomeModeWardrobe) {
      this.dom.btnHomeModeWardrobe.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.openSkinsModal();
      });
    }

    if (this.dom.btnHomeModeTrophies) {
      this.dom.btnHomeModeTrophies.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.openTrophiesModal();
      });
    }

    if (this.dom.btnHomeAudioMusic) {
      this.dom.btnHomeAudioMusic.addEventListener("click", () => {
        this.triggerHaptic(15);
        Sound.toggleMusic();
        this.updateAudioButtons();
      });
    }

    if (this.dom.btnHomeAudioSound) {
      this.dom.btnHomeAudioSound.addEventListener("click", () => {
        this.triggerHaptic(15);
        Sound.toggleSound();
        this.updateAudioButtons();
      });
    }

    if (this.dom.btnHomeHelp) {
      this.dom.btnHomeHelp.addEventListener("click", () => {
        this.triggerHaptic(15);
        if (this.dom.modalHelp) this.dom.modalHelp.classList.add("active");
      });
    }

    if (this.dom.btnDismissMechanicIntro) {
      this.dom.btnDismissMechanicIntro.addEventListener("click", () => {
        this.triggerHaptic(15);
        this.closeMechanicIntro();
      });
    }

    if (this.dom.btnCloseMechanicIntro) {
      this.dom.btnCloseMechanicIntro.addEventListener("click", () => {
        this.triggerHaptic(12);
        this.closeMechanicIntro();
      });
    }

    // Drawer Fuji Quick-Jump Banner
    if (this.dom.btnJumpFujiDrawer) {
      this.dom.btnJumpFujiDrawer.addEventListener("click", () => {
        if (!this.isLevelUnlocked(50)) {
          Sound.playBump();
          this.triggerHaptic([35, 30, 40]);
          this.setFeedback("🔒 Kapitel 6 ist noch gesperrt! Schließe zuerst Kapitel 5 (Level 50) ab.", "bad");
          return;
        }
        this.triggerHaptic(25);
        if (this.dom.levelDrawer) this.dom.levelDrawer.classList.remove("open");
        this.hideHomeScreen();
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

    // Wardrobe Bonus Stars (Rewarded Ad)
    const handleWardrobeAd = async () => {
      this.triggerHaptic(20);
      if (typeof window !== "undefined" && window.adManager) {
        const res = await window.adManager.showRewardedAd({
          title: "Kami-Gunst",
          rewardDescription: "3 Kami-Sterne für die Schrein-Garderobe erhalten"
        });
        if (res && res.rewarded) {
          this.addBonusStars(3);
        }
      }
    };

    if (this.dom.btnDesktopWardrobeAd) {
      this.dom.btnDesktopWardrobeAd.addEventListener("click", handleWardrobeAd);
    }
    if (this.dom.btnMobileWardrobeAd) {
      this.dom.btnMobileWardrobeAd.addEventListener("click", handleWardrobeAd);
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
      const mIcon = typeof KOMA_ICONS !== "undefined"
        ? (isMusicActive ? KOMA_ICONS.musicOn(16) : KOMA_ICONS.musicOff(16))
        : "";
      this.dom.btnMobileMusicToggle.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;">${mIcon} <span>${isMusicActive ? "Musik pausieren" : "Musik starten"}</span></span>`;
      this.dom.btnMobileMusicToggle.classList.toggle("active", isMusicActive);
    }
    if (this.dom.btnMobileSoundToggle) {
      const isMuted = Sound.masterMuted;
      const sIcon = typeof KOMA_ICONS !== "undefined"
        ? (isMuted ? KOMA_ICONS.soundOff(16) : KOMA_ICONS.soundOn(16))
        : "";
      this.dom.btnMobileSoundToggle.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;">${sIcon} <span>${isMuted ? "Stumm" : "SFX Aktiv"}</span></span>`;
      this.dom.btnMobileSoundToggle.classList.toggle("active", !isMuted);
    }

    // 4. Update Main Home Screen Audio Buttons
    if (this.dom.btnHomeAudioMusic) {
      const isMusicActive = Sound.bgmPlaying && !Sound.masterMuted;
      this.dom.btnHomeAudioMusic.innerHTML = typeof KOMA_ICONS !== "undefined"
        ? (isMusicActive ? KOMA_ICONS.musicOn(18) : KOMA_ICONS.musicOff(18))
        : "";
      this.dom.btnHomeAudioMusic.classList.toggle("muted", !isMusicActive);
      this.dom.btnHomeAudioMusic.classList.toggle("playing", isMusicActive);
    }
    if (this.dom.btnHomeAudioSound) {
      const isMuted = Sound.masterMuted;
      this.dom.btnHomeAudioSound.innerHTML = typeof KOMA_ICONS !== "undefined"
        ? (isMuted ? KOMA_ICONS.soundOff(18) : KOMA_ICONS.soundOn(18))
        : "";
      this.dom.btnHomeAudioSound.classList.toggle("muted", isMuted);
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
      const bonus = localStorage.getItem("spirit_bonus_stars");
      if (bonus) {
        this.bonusStars = parseInt(bonus, 10) || 0;
      } else {
        this.bonusStars = 0;
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
    total += (this.bonusStars || 0);
    return total;
  }

  addBonusStars(count = 3) {
    this.bonusStars = (this.bonusStars || 0) + count;
    try {
      localStorage.setItem("spirit_bonus_stars", this.bonusStars.toString());
    } catch (e) {}
    this.updateStarsDisplay();
    this.renderSkinsModal();
    this.renderMobileSkins();
    if (typeof Sound !== "undefined" && typeof Sound.playStarDing === "function") {
      Sound.playStarDing(3);
    }
    this.showNetworkToast(`✨ +${count} Kami-Sterne geschenkt erhalten!`);
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
    this.updateHomeScreen();
  }

  isSkinUnlocked(skinId) {
    if (skinId === "original") return true;
    const skin = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS[skinId]);
    if (!skin) return false;
    if (skin.specialUnlock === "boss_fuji") {
      try {
        return typeof localStorage !== "undefined" && localStorage.getItem("koma_defeated_ryujin") === "true";
      } catch (e) {
        return false;
      }
    }
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
    this.updateHomeScreen();
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
    this.updateHomeScreen();
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

  onLanguageChange() {
    // 1. Update command names
    if (this.commandMeta && typeof I18N !== "undefined") {
      this.commandMeta.F.name = I18N.t("cmd_forward");
      this.commandMeta.L.name = I18N.t("cmd_left");
      this.commandMeta.R.name = I18N.t("cmd_right");
      this.commandMeta.A.name = I18N.t("cmd_action");
    }

    // 2. Refresh active level details
    const lvl = this.getCurrentLevel();
    if (lvl) {
      if (this.dom.levelTitle) this.dom.levelTitle.textContent = lvl.n;
      if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = lvl.c;
      if (this.dom.missionDesc) this.dom.missionDesc.textContent = lvl.d;
      if (this.dom.levelTag) this.dom.levelTag.textContent = lvl.t;
      if (this.dom.mobileLvlTitle) {
        this.dom.mobileLvlTitle.textContent = this.isTowerMode
          ? `${typeof I18N !== "undefined" ? I18N.t("tower_hud_floor", { floor: lvl.towerFloor }) : `Turm · E${lvl.towerFloor}`}`
          : `Lvl ${this.currentLevelIdx + 1}`;
      }
    }

    // 3. Update DOM buttons, inputs & labels
    if (typeof I18N !== "undefined") {
      I18N.updateDOM();
    }
    this.updateLanguageUI();
    this.renderSkinsModal();
    this.renderMobileSkins();
    this.renderTrophies();
    this.renderMobileTrophies();
    this.renderLevelDrawer();
    this.updateHomeScreen();

    if (typeof TowerTrial !== "undefined" && typeof TowerTrial.updateUI === "function") {
      TowerTrial.updateUI();
    }
    if (typeof DailyTrial !== "undefined" && typeof DailyTrial.updateUI === "function") {
      DailyTrial.updateUI();
    }
  }

  updateLanguageUI() {
    if (typeof I18N === "undefined") return;
    const lang = I18N.getLanguage();
    if (this.dom.homeLangFlag) {
      this.dom.homeLangFlag.textContent = lang === "de" ? "🇩🇪" : "🇬🇧";
    }
    if (this.dom.homeLangLabel) {
      this.dom.homeLangLabel.textContent = lang === "de" ? "DE" : "EN";
    }
    if (this.dom.btnSettingLangDe) {
      this.dom.btnSettingLangDe.classList.toggle("active", lang === "de");
    }
    if (this.dom.btnSettingLangEn) {
      this.dom.btnSettingLangEn.classList.toggle("active", lang === "en");
    }
  }

  showMechanicIntro(type) {
    if (!this.dom.modalMechanicIntro) return;
    const isEn = (typeof I18N !== "undefined" && I18N.getLanguage() === "en");

    if (type === "fragile") {
      if (this.dom.mechanicIntroTitle) this.dom.mechanicIntroTitle.textContent = isEn ? "New Obstacle" : "Neues Hindernis";
      if (this.dom.mechanicIntroSubtitle) this.dom.mechanicIntroSubtitle.textContent = isEn ? "Fragile Stepping Stones (Moroi Ishi)" : "Brüchige Trittsteine (Moroi Ishi)";
      if (this.dom.mechanicIntroDesc) this.dom.mechanicIntroDesc.textContent = isEn ? "Ancient stones in the water basin that carry the robot only once." : "Uralte Steine im Wasserbecken, die den Roboter nur ein einziges Mal tragen.";
      if (this.dom.mechanicIntroIcon && typeof KOMA_ICONS !== "undefined") {
        this.dom.mechanicIntroIcon.innerHTML = KOMA_ICONS.fragileTile(32, "var(--cyan)");
      }
      if (this.dom.mechanicIntroBullets) {
        this.dom.mechanicIntroBullets.innerHTML = `
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Einmalige Überquerung:</strong> Sobald der Roboter den Trittstein verlässt, versinkt er im Wasser.</div>
          </div>
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Kein Rückweg:</strong> Versunkene Steine können nicht mehr betreten werden. Plane deinen Pfad ohne Schleifen!</div>
          </div>
        `;
      }
    } else if (type === "blocks") {
      if (this.dom.mechanicIntroTitle) this.dom.mechanicIntroTitle.textContent = "Neue Mechanik";
      if (this.dom.mechanicIntroSubtitle) this.dom.mechanicIntroSubtitle.textContent = "Heilige Felsblöcke (Iwa-Karakuri)";
      if (this.dom.mechanicIntroDesc) this.dom.mechanicIntroDesc.textContent = "Schwere Opferblöcke, die verschoben werden können.";
      if (this.dom.mechanicIntroIcon && typeof KOMA_ICONS !== "undefined") {
        this.dom.mechanicIntroIcon.innerHTML = KOMA_ICONS.shrineBlock(32, "var(--cyan)");
      }
      if (this.dom.mechanicIntroBullets) {
        this.dom.mechanicIntroBullets.innerHTML = `
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Felsen schieben:</strong> Fahre vorwärts gegen den Felsblock, um ihn vor dir her zu schieben.</div>
          </div>
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Brücken bauen:</strong> Schiebst du einen Block in ein Wasserfeld, versinkt er und wird zur begehbaren Trittstein-Brücke!</div>
          </div>
        `;
      }
    } else if (type === "switch") {
      if (this.dom.mechanicIntroTitle) this.dom.mechanicIntroTitle.textContent = "Neues Element";
      if (this.dom.mechanicIntroSubtitle) this.dom.mechanicIntroSubtitle.textContent = "Schrein-Schalter & Tore";
      if (this.dom.mechanicIntroDesc) this.dom.mechanicIntroDesc.textContent = "Leuchtende Boden-Schalter öffnen versperrte Tore im Schreingarten.";
      if (this.dom.mechanicIntroIcon) {
        this.dom.mechanicIntroIcon.innerHTML = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="4" fill="rgba(0, 245, 255, 0.18)" stroke="var(--cyan)" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="var(--cyan)"/><circle cx="12" cy="12" r="2" fill="#ffffff"/></svg>`;
      }
      if (this.dom.mechanicIntroBullets) {
        this.dom.mechanicIntroBullets.innerHTML = `
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Auf den Schalter fahren:</strong> Bewege deinen Roboter direkt auf das leuchtende Schalter-Feld.</div>
          </div>
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>✦ Aktion ausführen:</strong> Drücke den <strong>✦ Aktion</strong>-Befehl, während du auf dem Schalter stehst. Das Tor öffnet sich dauerhaft!</div>
          </div>
          <div class="mechanic-rule-row">
            <span class="mechanic-rule-dot"></span>
            <div><strong>Farbabstimmung:</strong> Die Leuchtfarbe des Schalters entspricht der Farbe des versperrten Tors.</div>
          </div>
        `;
      }
    }

    this.dom.modalMechanicIntro.classList.add("active");
  }

  closeMechanicIntro() {
    if (this.dom.modalMechanicIntro) {
      this.dom.modalMechanicIntro.classList.remove("active");
    }
  }

  getProgressionLevel() {
    if (typeof LEVELS === "undefined" || !LEVELS.length) return 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (!this.completedLevels.has(i)) {
        return i;
      }
    }
    return LEVELS.length - 1;
  }

  isLevelUnlocked(idx) {
    if (typeof navigator !== "undefined" && navigator.webdriver) return true; // keep automated tests unblocked
    if (idx === 0) return true;
    return this.completedLevels.has(idx - 1) || this.completedLevels.has(idx);
  }

  openLevelDrawer() {
    this.renderLevelDrawer();
    if (this.dom.levelDrawer) {
      this.dom.levelDrawer.classList.add("open");
    }
  }

  closeLevelDrawer() {
    if (this.dom.levelDrawer) {
      this.dom.levelDrawer.classList.remove("open");
    }
  }

  setHomeMode(mode) {
    this.selectedHomeMode = mode;
    const items = document.querySelectorAll(".home-mode-item");
    items.forEach(item => {
      const isCurrent = item.getAttribute("data-mode") === mode;
      item.classList.toggle("active", isCurrent);
    });
    if (this.dom.checkModeCampaign) this.dom.checkModeCampaign.textContent = (mode === "campaign" ? "✓" : "");
    if (this.dom.checkModeTower) this.dom.checkModeTower.textContent = (mode === "tower" ? "✓" : "");
    if (this.dom.checkModeDaily) this.dom.checkModeDaily.textContent = (mode === "daily" ? "✓" : "");

    if (mode === "campaign") {
      if (this.dom.homeCurrentModeIcon) this.dom.homeCurrentModeIcon.textContent = "⛩️";
      if (this.dom.homeCurrentModeLabel) this.dom.homeCurrentModeLabel.textContent = "Kampagne";
    } else if (mode === "tower") {
      if (this.dom.homeCurrentModeIcon) this.dom.homeCurrentModeIcon.textContent = "🗼";
      if (this.dom.homeCurrentModeLabel) this.dom.homeCurrentModeLabel.textContent = "Turm";
    } else if (mode === "daily") {
      if (this.dom.homeCurrentModeIcon) this.dom.homeCurrentModeIcon.textContent = "🔥";
      if (this.dom.homeCurrentModeLabel) this.dom.homeCurrentModeLabel.textContent = "Täglich";
    }
    this.updateHomeScreen();
  }

  showHomeScreen() {
    this.updateHomeScreen();
    if (this.dom.homeScreen) {
      this.dom.homeScreen.classList.add("active");
    }
    if (this.renderer && typeof this.renderer.enterHomeScreenMode === "function") {
      this.renderer.enterHomeScreenMode();
    }
  }

  hideHomeScreen() {
    if (this.dom.homeScreen) {
      this.dom.homeScreen.classList.remove("active");
    }
    if (this.renderer && typeof this.renderer.exitHomeScreenMode === "function") {
      this.renderer.exitHomeScreenMode();
    }
  }

  updateHomeScreen() {
    const progIdx = this.getProgressionLevel();
    let lvl = (typeof LEVELS !== "undefined" && LEVELS[progIdx]) ? LEVELS[progIdx] : (typeof LEVELS !== "undefined" ? LEVELS[0] : null);
    if (lvl && typeof I18N !== "undefined") {
      lvl = I18N.translateLevel(lvl, progIdx);
    }

    // 1. Synchronize Active Robot Skin in Showroom
    const skinId = this.equippedSkin || "original";
    let skinDef = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS[skinId]) || {
      name: "Shiro Usagi",
      jpName: "白兎",
      subtitle: "Original · Shinto-Bote",
      tag: "Standard",
      desc: "Das klassische weiße Shinto-Schrein-Chassis mit leuchtend cyanfarbenen Visor-Augen und natürlichem Furoshiki-Holzpaket.",
      accentColor: "#00f5ff"
    };
    if (typeof I18N !== "undefined") {
      skinDef = I18N.getSkin(skinId, skinDef);
    }

    if (this.dom.homeActiveSkinLabel) {
      this.dom.homeActiveSkinLabel.textContent = skinDef.name;
    }
    if (this.dom.homeSkinName) this.dom.homeSkinName.textContent = skinDef.name;
    if (this.dom.homeSkinSub) this.dom.homeSkinSub.textContent = `${skinDef.jpName || ""} · ${skinDef.subtitle || "Shinto-Bote"}`;
    if (this.dom.homeSkinTag) {
      this.dom.homeSkinTag.textContent = skinDef.tag || "Standard";
      this.dom.homeSkinTag.style.borderColor = skinDef.accentColor || "var(--accent-torii)";
    }
    if (this.dom.homeSkinDesc) this.dom.homeSkinDesc.textContent = skinDef.desc || "";
    if (this.dom.homeSkinIcon) {
      this.dom.homeSkinIcon.innerHTML = (typeof KOMA_ICONS !== "undefined" && typeof KOMA_ICONS.getSkinIcon === "function")
        ? KOMA_ICONS.getSkinIcon(skinId, 32, skinDef.accentColor)
        : "";
    }

    if (window.showroomViewer && typeof window.showroomViewer.loadSkin === "function") {
      window.showroomViewer.loadSkin(skinId);
    }

    // 2. Synchronize Current Level Plaque
    if (lvl) {
      const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
      const chNum = (lvl.chapter && lvl.chapter.num) ? lvl.chapter.num : Math.floor(progIdx / 10) + 1;
      const chPrefix = isEn ? "Chapter" : "Kapitel";
      let chTitle = lvl.c || (lvl.chapter && lvl.chapter.title) || `${chPrefix} ${chNum}`;
      if (!chTitle.toLowerCase().includes("kapitel") && !chTitle.toLowerCase().includes("chapter")) {
        chTitle = `${chPrefix} ${String(chNum).padStart(2, "0")} · ${chTitle}`;
      }
      const isCompleted = this.completedLevels.has(progIdx);
      const stars = this.levelStars[progIdx] || 0;

      if (this.dom.homeCurrentChapter) {
        this.dom.homeCurrentChapter.textContent = chTitle.toUpperCase();
      }
      if (this.dom.homeLevelBigNumber) {
        this.dom.homeLevelBigNumber.textContent = `LEVEL ${progIdx + 1}`;
      }
      if (this.dom.homeCurrentLevelTitle) {
        this.dom.homeCurrentLevelTitle.textContent = lvl.n || "";
      }
      if (this.dom.homeCurrentStatus) {
        const completedTxt = isEn ? "Mastered ✓" : "Gemeistert ✓";
        const readyTxt = isEn ? "Current Goal" : "Aktuelles Ziel";
        this.dom.homeCurrentStatus.textContent = isCompleted ? completedTxt : readyTxt;
        this.dom.homeCurrentStatus.className = `resume-status-badge ${isCompleted ? "completed" : "ready"}`;
      }
      if (this.dom.homeCurrentLevelDesc) {
        this.dom.homeCurrentLevelDesc.textContent = lvl.d || (isEn ? "Bring the sacred offering safely to the shrine." : "Bringe die heilige Opfergabe sicher zum Schrein.");
      }
      if (this.dom.homeCurrentStarsRow) {
        if (typeof KOMA_ICONS !== "undefined") {
          let starsHtml = "";
          for (let s = 1; s <= 3; s++) {
            const filled = s <= stars;
            starsHtml += `<span class="home-plaque-star ${filled ? "filled" : "empty"}">${filled ? KOMA_ICONS.starFilled(22, "var(--gold)", true) : KOMA_ICONS.starEmpty(22, "rgba(255,255,255,0.22)")}</span>`;
          }
          this.dom.homeCurrentStarsRow.innerHTML = starsHtml;
        }
      }
    }

    // 3. Synchronize Total Stars in Top-Right
    const totalStars = this.getTotalStars();
    if (this.dom.homeTotalStars) {
      this.dom.homeTotalStars.textContent = totalStars;
    }

    // 4. Synchronize Mode Badges
    if (this.dom.homeTowerBadge && typeof TowerTrial !== "undefined") {
      this.dom.homeTowerBadge.textContent = `Rekord: Ebene ${TowerTrial.getBestFloor() || 1}`;
    }
    if (typeof DailyTrial !== "undefined") {
      const streak = DailyTrial.getEffectiveStreak();
      const isDone = DailyTrial.isTodayCompleted();
      const streakStr = isDone ? `${streak} Tage ✓` : `${streak} Tage`;
      if (this.dom.homeDailyBadge) {
        this.dom.homeDailyBadge.textContent = streakStr;
      }
      if (this.dom.menuDailyBadge) {
        this.dom.menuDailyBadge.textContent = isDone ? `${streak} Tage geschafft ✓` : `${streak} Tage Streak`;
      }
    }
    if (this.dom.homeTrophiesBadge) {
      this.dom.homeTrophiesBadge.textContent = `${this.unlockedAchievements.size} / ${ACHIEVEMENTS.length} Siegel`;
    }

    // 5. Update Play Button Text based on mode
    if (this.dom.homePlayBtnText) {
      if (this.selectedHomeMode === "tower") {
        this.dom.homePlayBtnText.textContent = "SCHREINPRÜFUNG";
      } else if (this.selectedHomeMode === "daily") {
        this.dom.homePlayBtnText.textContent = "TÄGLICHE PRÜFUNG";
      } else {
        this.dom.homePlayBtnText.textContent = "SPIELEN";
      }
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

    list.innerHTML = ACHIEVEMENTS.map(rawAch => {
      const ach = (typeof I18N !== "undefined" ? I18N.getAchievement(rawAch.id, rawAch) : rawAch);
      const isUnlocked = this.unlockedAchievements.has(ach.id);
      const prog = Math.min(ach.goal, ach.getProgress(this));
      const pct = Math.round((prog / ach.goal) * 100);
      const trophyIconSvg = typeof KOMA_ICONS !== "undefined"
        ? (isUnlocked ? KOMA_ICONS.render(ach.iconKey, 26, "var(--gold)") : KOMA_ICONS.amulet(24, "rgba(255,255,255,0.3)"))
        : ach.icon;

      return `
        <div class="trophy-card ${isUnlocked ? "unlocked" : "locked"}">
          <div class="trophy-icon-wrap">
            <span>${trophyIconSvg}</span>
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
            ${isUnlocked ? "✓" : (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(12) : "🔒")}
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

    list.innerHTML = ACHIEVEMENTS.map(rawAch => {
      const ach = (typeof I18N !== "undefined" ? I18N.getAchievement(rawAch.id, rawAch) : rawAch);
      const isUnlocked = this.unlockedAchievements.has(ach.id);
      const prog = Math.min(ach.goal, ach.getProgress(this));
      const pct = Math.round((prog / ach.goal) * 100);
      const trophyIconSvg = typeof KOMA_ICONS !== "undefined"
        ? (isUnlocked ? KOMA_ICONS.render(ach.iconKey, 24, "var(--gold)") : KOMA_ICONS.amulet(22, "rgba(255,255,255,0.3)"))
        : ach.icon;

      return `
        <div class="mobile-trophy-item ${isUnlocked ? "unlocked" : "locked"}">
          <div class="trophy-icon-wrap">
            <span>${trophyIconSvg}</span>
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
            ${isUnlocked ? "✓" : (typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(12) : "🔒")}
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
      const origSkin = skin;
      if (typeof I18N !== "undefined") {
        skin = I18N.getSkin(skin.id, skin);
      }
      const isUnlocked = this.isSkinUnlocked(skin.id);
      const isEquipped = this.equippedSkin === skin.id;
      const progress = skin.starsRequired > 0 
        ? Math.min(100, Math.round((totalStars / skin.starsRequired) * 100)) 
        : 100;

      let statusBadge = "";
      let actionBtn = "";

      if (isEquipped) {
        const activeTxt = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Active" : "Aktiv";
        const equippedTxt = (typeof I18N !== "undefined") ? I18N.t("wardrobe_equipped") : "Ausgerüstet";
        statusBadge = `<span class="mobile-skin-badge active">✓ ${activeTxt}</span>`;
        actionBtn = `<button class="mobile-skin-btn equipped" disabled>${equippedTxt}</button>`;
      } else if (isUnlocked) {
        const freeTxt = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Free" : "Frei";
        const equipTxt = (typeof I18N !== "undefined") ? I18N.t("wardrobe_equip_btn") : "Ausrüsten";
        statusBadge = `<span class="mobile-skin-badge unlocked">${freeTxt}</span>`;
        actionBtn = `<button class="mobile-skin-btn equip" data-mobile-skin="${skin.id}">${equipTxt}</button>`;
      } else if (origSkin.specialUnlock === "boss_fuji") {
        const lockSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(11) : "🔒";
        const bossTxt = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "🐉 Defeat Lvl 60 Boss" : "🐉 Lvl 60 Boss besiegen";
        statusBadge = `<span class="mobile-skin-badge locked">${lockSvg} Boss</span>`;
        actionBtn = `
          <div class="mobile-skin-progress">
            <span class="mobile-skin-prog-txt">${bossTxt}</span>
          </div>
        `;
      } else {
        const starSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(11, "var(--gold)", false) : "⭐";
        const lockSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(11) : "🔒";
        statusBadge = `<span class="mobile-skin-badge locked">${lockSvg} ${skin.starsRequired} ${starSvg}</span>`;
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
      const isUnlocked = this.isLevelUnlocked(absIdx);
      const stars = this.levelStars[absIdx];

      let starsHtml = "";
      if (isUnlocked && stars !== undefined && stars > 0) {
        starsHtml = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getStarsRow(stars, stars, 11) : "⭐".repeat(stars);
      } else if (isUnlocked) {
        starsHtml = `<span style="opacity:0.3; font-size:11px;">–</span>`;
      } else {
        starsHtml = `<span style="opacity:0.5; font-size:10px; font-weight:700;">🔒 Gesperrt</span>`;
      }

      return `
        <button class="mobile-level-card ${isActive ? "active" : ""} ${isDone ? "done" : ""} ${!isUnlocked ? "locked" : ""}" data-level-idx="${absIdx}" ${!isUnlocked ? 'aria-disabled="true"' : ""}>
          <div class="mobile-level-num">${!isUnlocked ? "🔒" : String(absIdx + 1).padStart(2, "0")}</div>
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
          if (!this.isLevelUnlocked(idx)) {
            Sound.playBump();
            this.triggerHaptic([35, 30, 40]);
            this.setFeedback(`🔒 Level ${idx + 1} ist noch gesperrt! Schließe zuerst Level ${idx} ab.`, "bad");
            return;
          }
          this.closeMobileHub();
          this.hideHomeScreen();
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
      const origSkin = skin;
      if (typeof I18N !== "undefined") {
        skin = I18N.getSkin(skin.id, skin);
      }
      const isUnlocked = this.isSkinUnlocked(skin.id);
      const isEquipped = this.equippedSkin === skin.id;
      const progress = skin.starsRequired > 0 
        ? Math.min(100, Math.round((totalStars / skin.starsRequired) * 100)) 
        : 100;

      let statusBadge = "";
      let actionButton = "";

      if (isEquipped) {
        const activeTxt = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Active" : "Aktiv";
        const equippedTxt = (typeof I18N !== "undefined") ? I18N.t("wardrobe_equipped") : "Ausgerüstet";
        statusBadge = `<span class="skin-badge active">✓ ${activeTxt}</span>`;
        actionButton = `<button class="skin-action-btn equipped" disabled>${equippedTxt}</button>`;
      } else if (isUnlocked) {
        const unlockedTxt = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Unlocked" : "Freigeschaltet";
        const equipTxt = (typeof I18N !== "undefined") ? I18N.t("wardrobe_equip_btn") : "Ausrüsten";
        statusBadge = `<span class="skin-badge unlocked">${unlockedTxt}</span>`;
        actionButton = `<button class="skin-action-btn equip" data-skin-id="${skin.id}">${equipTxt}</button>`;
      } else if (origSkin.specialUnlock === "boss_fuji") {
        const lockSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(12) : "🔒";
        const bossVictory = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Boss Victory" : "Boss-Sieg";
        const bossText = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "🐉 Defeat Ryūjin in Level 60" : "🐉 Besiege Ryūjin in Level 60";
        statusBadge = `<span class="skin-badge locked">${lockSvg} ${bossVictory}</span>`;
        actionButton = `
          <div class="skin-progress-container">
            <span class="skin-progress-text">${bossText}</span>
          </div>
        `;
      } else {
        const starSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.starFilled(12, "var(--gold)", false) : "⭐";
        const lockSvg = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lock(12) : "🔒";
        statusBadge = `<span class="skin-badge locked">${lockSvg} ${skin.starsRequired} ${starSvg}</span>`;
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
        this.setFeedback(typeof I18N !== "undefined" ? I18N.t("feedback_camera_empty") : "Kamera-Credits aufgebraucht (0 Sterne möglich – Level kann trotzdem abgeschlossen werden).", "bad");
      } else {
        this.setFeedback(typeof I18N !== "undefined" ? I18N.t("feedback_camera_credit", { remaining: this.cameraCredits }) : `Kamera geschwenkt (-1 Credit, noch ${this.cameraCredits} übrig).`, "normal");
      }
    }
  }

  renderCameraCredits() {
    const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
    if (this.isDailyTrial) {
      if (this.dom.creditBadge) {
        this.dom.creditBadge.textContent = isEn ? "0 / 0 (Locked)" : "0 / 0 (Gesperrt)";
      }
      if (this.dom.creditStars) {
        const trialLabel = isEn ? "🔥 Master Trial" : "🔥 Meister-Prüfung";
        this.dom.creditStars.innerHTML = `<span style="color: #f97316; font-weight: 700;">${trialLabel}</span>`;
      }
      if (this.dom.mobileLvlCredits) {
        this.dom.mobileLvlCredits.textContent = "0/0 🚫";
      }
      if (this.dom.btnCamRotateLeft) {
        this.dom.btnCamRotateLeft.classList.add("disabled");
        this.dom.btnCamRotateLeft.title = isEn ? "Camera rotation forbidden in daily trial!" : "Kameraschwenker in der täglichen Prüfung verboten!";
      }
      if (this.dom.btnCamRotateRight) {
        this.dom.btnCamRotateRight.classList.add("disabled");
        this.dom.btnCamRotateRight.title = isEn ? "Camera rotation forbidden in daily trial!" : "Kameraschwenker in der täglichen Prüfung verboten!";
      }
      return;
    }

    if (this.dom.btnCamRotateLeft) {
      this.dom.btnCamRotateLeft.classList.remove("disabled");
      this.dom.btnCamRotateLeft.title = isEn ? "Rotate camera 45° left (-1 Credit)" : "Kamera 45° nach links schwenken (-1 Credit)";
    }
    if (this.dom.btnCamRotateRight) {
      this.dom.btnCamRotateRight.classList.remove("disabled");
      this.dom.btnCamRotateRight.title = isEn ? "Rotate camera 45° right (-1 Credit)" : "Kamera 45° nach rechts schwenken (-1 Credit)";
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
      const camIcon = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.camera(13) : "🎥";
      this.dom.mobileLvlCredits.innerHTML = `${this.cameraCredits}/${this.maxCameraCredits} ${camIcon}<span class="sr-only">🎥</span>`;
    }
  }

  loadDailyTrial() {
    if (this.isPlaying) return;
    this.isDailyTrial = true;
    if (this.dom.bossHudBar) this.dom.bossHudBar.style.display = "none";
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

  loadTowerFloor(towerLevel = null) {
    if (this.isPlaying) return;
    this.isTowerMode = true;
    this.isDailyTrial = false;
    if (this.dom.bossHudBar) this.dom.bossHudBar.style.display = "none";

    const lvl = towerLevel || (typeof TowerTrial !== "undefined" ? TowerTrial.getCurrentLevel() : null);
    if (!lvl) return;

    this.currentLevelIdx = -2;
    this.queue = [];
    this.currentStep = 0;

    this.maxCameraCredits = lvl.maxCredits || 4;
    this.cameraCredits = this.maxCameraCredits;
    if (this.renderer) {
      this.renderer.swivelDisabled = false;
    }

    if (typeof document !== "undefined") {
      document.body.classList.remove("is-daily-trial");
      document.body.classList.add("is-tower-mode");
    }

    this.resetState();

    if (this.dom.levelTitle) this.dom.levelTitle.textContent = lvl.n;
    if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = lvl.c;
    if (this.dom.levelTag) this.dom.levelTag.textContent = lvl.t;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = lvl.d;
    if (this.dom.missionBadge) this.dom.missionBadge.textContent = `⛩️ EBENE ${lvl.towerFloor}`;
    if (this.dom.progressBar) this.dom.progressBar.style.width = "0%";
    if (this.dom.mobileLvlTitle) this.dom.mobileLvlTitle.textContent = `Turm · E${lvl.towerFloor}`;
    if (this.dom.mobileLvlCredits) {
      const camIcon = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.camera(13) : "🎥";
      this.dom.mobileLvlCredits.innerHTML = `${this.cameraCredits}/${this.maxCameraCredits} ${camIcon}<span class="sr-only">🎥</span>`;
    }

    this.setFeedback(`⛩️ Turm-Ebene ${lvl.towerFloor} geladen! Plane den Weg zum heiligen Schrein-Torii.`, "normal");

    this.renderer.loadLevel(lvl);

    const isFuji = (lvl.theme === "fuji");
    if (typeof Sound !== "undefined" && typeof Sound.setTrack === "function") {
      Sound.setTrack(isFuji ? "ice" : "default");
    }

    if (typeof TowerTrial !== "undefined") {
      TowerTrial.updateUI();
    }

    this.renderQueue();
    this.renderLevelDrawer();
    this.renderCameraCredits();
  }

  showTowerAltar(choices, floor) {
    if (!this.dom.modalTowerAltar || !this.dom.towerAltarChoices) return;
    this.dom.towerAltarChoices.innerHTML = "";

    choices.forEach(choice => {
      const card = document.createElement("div");
      card.className = "blessing-card";
      const transChoice = (typeof I18N !== "undefined") ? I18N.getBlessing(choice.id, choice) : choice;
      const blessingSvg = (typeof KOMA_ICONS !== "undefined" && choice.iconKey)
        ? KOMA_ICONS.render(choice.iconKey, 34, "var(--gold)")
        : choice.icon;
      const sakuraSvg = (typeof KOMA_ICONS !== "undefined")
        ? KOMA_ICONS.sakura(16)
        : "";
      const btnLabel = (typeof I18N !== "undefined" && I18N.getLanguage() === "en") ? "Receive Gift" : "Gabe empfangen";
      card.innerHTML = `
        <div class="blessing-icon">${blessingSvg}</div>
        <div class="blessing-name">${transChoice.name}</div>
        <div class="blessing-desc">${transChoice.desc}</div>
        <div class="blessing-select-btn" style="display:inline-flex;align-items:center;justify-content:center;gap:6px;"><span>${btnLabel}</span> ${sakuraSvg}</div>
      `;
      card.addEventListener("click", () => {
        this.triggerHaptic([30, 40, 60]);
        this.dom.modalTowerAltar.classList.remove("active");
        if (typeof TowerTrial !== "undefined") {
          TowerTrial.chooseBlessing(choice.id);
        }
        if (typeof Sound !== "undefined" && typeof Sound.playStarChime === "function") {
          Sound.playStarChime(2);
        }
        const chosenFeedback = (typeof I18N !== "undefined" && I18N.getLanguage() === "en")
          ? `Gift chosen: ${transChoice.name}! Ascending to next floor...`
          : `Gabe gewählt: ${transChoice.name}! Aufstieg zur nächsten Ebene...`;
        this.setFeedback(chosenFeedback, "good");
        setTimeout(() => {
          this.loadTowerFloor();
        }, 600);
      });
      this.dom.towerAltarChoices.appendChild(card);
    });

    this.dom.modalTowerAltar.classList.add("active");
  }

  showTowerGameOver(failRes) {
    const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
    const floorWord = isEn ? "Floor" : "Ebene";
    const ptsWord = isEn ? "Pts." : "Pkt.";
    const floorsWord = isEn ? "Floor(s)" : "Ebene(n)";
    const locale = isEn ? "en-US" : "de-DE";

    if (this.dom.towerResultFloor) {
      this.dom.towerResultFloor.textContent = `${floorWord} ${failRes.floor}`;
    }
    if (this.dom.towerResultScore) {
      this.dom.towerResultScore.textContent = `${failRes.score.toLocaleString(locale)} ${ptsWord}`;
    }
    if (this.dom.towerResultZen) {
      const zenIcon = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.lightning(14) : "⚡";
      this.dom.towerResultZen.innerHTML = `${failRes.zenCount || 0} ${floorsWord} ${zenIcon} (+${(failRes.zenBonus || 0).toLocaleString(locale)} ${ptsWord})`;
    }
    if (this.dom.towerResultRecord) {
      this.dom.towerResultRecord.style.display = failRes.isRecord ? "block" : "none";
    }
    if (this.dom.towerReviveBox) {
      this.dom.towerReviveBox.style.display = (failRes && failRes.canRevive) ? "block" : "none";
    }
    if (this.dom.modalTowerGameOver) {
      this.dom.modalTowerGameOver.classList.add("active");
    }
  }

  loadLevel(idx) {
    if (this.isPlaying) return;
    this.isDailyTrial = false;
    this.isTowerMode = false;
    if (this.dom.towerHudBar) this.dom.towerHudBar.style.display = "none";
    this.maxCameraCredits = 6;
    this.cameraCredits = 6;
    if (this.renderer) {
      this.renderer.swivelDisabled = false;
    }
    if (typeof document !== "undefined") {
      document.body.classList.remove("is-daily-trial");
      document.body.classList.remove("is-tower-mode");
    }
    this.currentLevelIdx = idx;
    this.queue = [];
    this.currentStep = 0;
    
    const lvl = this.getCurrentLevel();
    this.resetState();

    // Dedicated Boss Fight HUD (Level 60 Ryūjin Boss Fight)
    const isBoss = lvl && (lvl.bossId === "ryujin" || lvl.isBossLevel);
    if (this.dom.bossHudBar) {
      this.dom.bossHudBar.style.display = isBoss ? "flex" : "none";
    }
    if (isBoss) {
      if (this.dom.seal1) this.dom.seal1.className = "boss-seal lit";
      if (this.dom.seal2) this.dom.seal2.className = "boss-seal lit";
      if (this.dom.seal3) this.dom.seal3.className = "boss-seal lit";
      if (this.dom.bossPhaseBadge) {
        this.dom.bossPhaseBadge.className = "boss-phase-badge";
        this.dom.bossPhaseBadge.textContent = "⚡ Frost-Odem lädt (1/3)";
      }
      if (typeof Sound !== "undefined" && typeof Sound.playTaikoDrum === "function") {
        setTimeout(() => Sound.playTaikoDrum(), 250);
      }
    }
    
    // Update Header & Card
    if (this.dom.levelTitle) this.dom.levelTitle.textContent = lvl.n;
    if (this.dom.chapterTitle) this.dom.chapterTitle.textContent = lvl.c;
    if (this.dom.levelTag) this.dom.levelTag.textContent = lvl.t;
    if (this.dom.missionDesc) this.dom.missionDesc.textContent = lvl.d;
    if (this.dom.missionBadge) this.dom.missionBadge.textContent = `${String(idx + 1).padStart(2, "0")} / ${LEVELS.length}`;
    if (this.dom.progressBar) this.dom.progressBar.style.width = "0%";
    if (this.dom.mobileLvlTitle) this.dom.mobileLvlTitle.textContent = `Lvl ${String(idx + 1).padStart(2, "0")}`;
    if (this.dom.mobileLvlCredits) {
      const camIcon = typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.camera(13) : "🎥";
      this.dom.mobileLvlCredits.innerHTML = `${this.cameraCredits}/${this.maxCameraCredits} ${camIcon}<span class="sr-only">🎥</span>`;
    }
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
    this.updateHomeScreen();

    // Check for new mechanic introductions (Erklär-Box)
    const urlParams = (typeof window !== "undefined" && window.location) ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const isTestSkipped = (typeof navigator !== "undefined" && navigator.webdriver) && !urlParams.has("testMechanic");

    if (!isTestSkipped) {
      if (lvl && lvl.fragile && lvl.fragile.length > 0 && (typeof localStorage !== "undefined" && !localStorage.getItem("koma_seen_fragile_intro"))) {
        this.showMechanicIntro("fragile");
        localStorage.setItem("koma_seen_fragile_intro", "true");
      } else if (lvl && lvl.blocks && lvl.blocks.length > 0 && (typeof localStorage !== "undefined" && !localStorage.getItem("koma_seen_blocks_intro"))) {
        this.showMechanicIntro("blocks");
        localStorage.setItem("koma_seen_blocks_intro", "true");
      } else if (lvl && lvl.sw && lvl.sw.length > 0 && (typeof localStorage !== "undefined" && !localStorage.getItem("spirit_seen_switch_intro"))) {
        this.showMechanicIntro("switch");
        localStorage.setItem("spirit_seen_switch_intro", "true");
      }
    }
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
      collapsedFragileTiles: new Set(),
      blocks: (lvl.blocks || []).map(b => [b[0], b[1]]),
      waterTiles: new Set((lvl.water || []).map(w => `${w[0]},${w[1]}`)),
      isWin: false,
      isFail: false
    };
    if (this.renderer) {
      this.renderer.setKomaInitialState(this.state.x, this.state.y, this.state.dir);
      this.renderer.setGateOpen("all", false);
      this.renderer.setSwitchActive("all", false);
      this.renderer.resetOrbs();
      if (typeof this.renderer.resetMechanics === "function") {
        this.renderer.resetMechanics(lvl);
      }
    }

    if (lvl && (lvl.bossId === "ryujin" || lvl.isBossLevel)) {
      if (this.dom.seal1) this.dom.seal1.className = "boss-seal lit";
      if (this.dom.seal2) this.dom.seal2.className = "boss-seal lit";
      if (this.dom.seal3) this.dom.seal3.className = "boss-seal lit";
      if (this.dom.bossPhaseBadge) {
        this.dom.bossPhaseBadge.className = "boss-phase-badge";
        this.dom.bossPhaseBadge.textContent = "⚡ Frost-Odem lädt (1/3)";
      }
      if (this.renderer && typeof this.renderer.clearFrostHazard === "function") {
        this.renderer.clearFrostHazard();
      }
    }
  }

  onOrbCollected(lvl) {
    if (lvl && (lvl.bossId === "ryujin" || lvl.isBossLevel)) {
      const count = this.state.collectedOrbs.size;
      if (count === 1) {
        if (this.dom.seal1) this.dom.seal1.className = "boss-seal shattered";
        if (this.dom.bossPhaseBadge) this.dom.bossPhaseBadge.textContent = "⚔️ Relikt 1 befreit (Eisschwert)";
        this.setFeedback("🔮 1. Magatama-Siegel zerborsten! Der Himmelsdrache tobt!", "good");
      } else if (count === 2) {
        if (this.dom.seal2) this.dom.seal2.className = "boss-seal shattered";
        if (this.dom.bossPhaseBadge) this.dom.bossPhaseBadge.textContent = "🪞 Relikt 2 befreit (Himmelsspiegel)";
        this.setFeedback("🔮 2. Magatama-Siegel zerborsten! Drachen-Aura pulsiert!", "good");
      } else if (count >= 3) {
        if (this.dom.seal3) this.dom.seal3.className = "boss-seal shattered";
        if (this.dom.bossPhaseBadge) this.dom.bossPhaseBadge.textContent = "💥 Alle Siegel zerborsten! Erklimme den Gipfel!";
        this.setFeedback("💥 Alle 3 Siegel gebrochen! Das Gipfel-Torii erstrahlt!", "good");
      }

      if (typeof Sound !== "undefined" && typeof Sound.playMagatamaShatter === "function") {
        Sound.playMagatamaShatter();
      }
      if (this.renderer && typeof this.renderer.animateDragonRoar === "function") {
        this.renderer.animateDragonRoar();
      }
    }
  }

  getBossHazardTarget(fireStep) {
    const targets = {
      3: {
        type: "col",
        index: 3,
        name: "Spalte 3",
        tiles: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]
      },
      6: {
        type: "col",
        index: 2,
        name: "Spalte 2",
        tiles: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]
      },
      9: {
        type: "row",
        index: 4,
        name: "Krater-Schlucht (Reihe 4)",
        tiles: [[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],
        shieldable: true,
        shieldPos: [4, 4]
      },
      12: {
        type: "col",
        index: 5,
        name: "Spalte 5",
        tiles: [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]
      },
      15: {
        type: "row",
        index: 3,
        name: "Reihe 3",
        tiles: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]
      },
      18: {
        type: "col",
        index: 4,
        name: "Zentraler Pfad (Spalte 4)",
        tiles: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]
      },
      21: {
        type: "row",
        index: 3,
        name: "Reihe 3",
        tiles: [[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]
      },
      24: {
        type: "col",
        index: 3,
        name: "Spalte 3",
        tiles: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7]]
      },
      27: {
        type: "col",
        index: 1,
        name: "Spalte 1",
        tiles: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]
      }
    };

    if (targets[fireStep]) return targets[fireStep];

    const fallbackCols = [3, 5, 2, 4];
    const col = fallbackCols[Math.floor(fireStep / 3) % fallbackCols.length];
    const tiles = [];
    for (let y = 0; y < 8; y++) tiles.push([col, y]);
    return {
      type: "col",
      index: col,
      name: `Spalte ${col}`,
      tiles
    };
  }

  processBossBreath(lvl, step, onComplete) {
    const isBoss = lvl && (lvl.bossId === "ryujin" || lvl.isBossLevel);
    if (!isBoss) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    const cycleMod = step % 3;

    if (cycleMod === 1) {
      if (this.renderer && typeof this.renderer.clearFrostHazard === "function") {
        this.renderer.clearFrostHazard();
      }
      if (this.dom.bossPhaseBadge) {
        this.dom.bossPhaseBadge.className = "boss-phase-badge";
        this.dom.bossPhaseBadge.textContent = "⚡ Frost-Odem lädt (1/3)";
      }
      if (typeof onComplete === "function") onComplete();
      return;
    }

    if (cycleMod === 2) {
      const nextFireStep = step + 1;
      const target = this.getBossHazardTarget(nextFireStep);
      if (this.renderer && typeof this.renderer.showFrostHazard === "function") {
        this.renderer.showFrostHazard(target.tiles);
      }
      if (this.dom.bossPhaseBadge) {
        this.dom.bossPhaseBadge.className = "boss-phase-badge warning";
        this.dom.bossPhaseBadge.textContent = `⚠️ ZIELVISIER: ${target.name} (Feuert nächste Runde!)`;
      }
      this.triggerHaptic([35, 40]);
      if (typeof onComplete === "function") onComplete();
      return;
    }

    if (cycleMod === 0 && step > 0) {
      const target = this.getBossHazardTarget(step);
      const isKomaInLane = target.tiles.some(([tx, ty]) => tx === this.state.x && ty === this.state.y);

      let isBlocked = false;
      let blockPos = null;

      if (target.shieldable && target.shieldPos) {
        const [sx, sy] = target.shieldPos;
        const hasStandingBlock = (this.state.blocks || []).some(b => b[0] === sx && b[1] === sy);
        const hasSunkenOrMeshBlock = this.renderer && this.renderer.blockMeshes && !!this.renderer.blockMeshes[`${sx},${sy}`];
        const isWaterBridged = (lvl.water || []).some(w => w[0] === sx && w[1] === sy) &&
                               this.state.waterTiles && !this.state.waterTiles.has(`${sx},${sy}`);

        if (hasStandingBlock || hasSunkenOrMeshBlock || isWaterBridged) {
          isBlocked = true;
          blockPos = [sx, sy];
        }
      }

      const isKomaHit = isKomaInLane && !isBlocked;

      if (this.dom.bossPhaseBadge) {
        if (isBlocked) {
          this.dom.bossPhaseBadge.className = "boss-phase-badge shielded";
          this.dom.bossPhaseBadge.textContent = "🛡️ Frost-Odem abgewehrt!";
        } else if (isKomaHit) {
          this.dom.bossPhaseBadge.className = "boss-phase-badge bad";
          this.dom.bossPhaseBadge.textContent = "❄️ KOMA eingefroren!";
        } else {
          this.dom.bossPhaseBadge.className = "boss-phase-badge firing";
          this.dom.bossPhaseBadge.textContent = "💥 Frost-Odem feuert!";
        }
      }

      if (this.renderer && typeof this.renderer.fireDragonBreathBeam === "function") {
        this.renderer.fireDragonBreathBeam(target.tiles, isBlocked, isKomaHit, blockPos, () => {
          if (this.renderer && typeof this.renderer.clearFrostHazard === "function") {
            this.renderer.clearFrostHazard();
          }

          if (isBlocked) {
            this.setFeedback("🛡️ Der Basaltblock fängt den Frost-Odem ab! KOMA bleibt unversehrt!", "good");
          } else if (isKomaHit) {
            this.state.isFail = true;
            this.isPlaying = false;
            if (typeof document !== "undefined") {
              document.body.classList.remove("is-executing");
            }
            this.setFeedback("❄️ Eingefroren! Der Frost-Odem von Ryūjin hat KOMA erfasst. Weiche den markierten Zonen aus!", "bad");
            this.triggerHaptic([60, 80, 100]);
            this.renderQueue();
            return;
          } else {
            this.setFeedback("💥 Ryūjins Frost-Odem schlägt über den Krater ein! KOMA entkommt knapp.", "normal");
          }

          if (typeof onComplete === "function") {
            onComplete();
          }
        });
      } else {
        if (typeof onComplete === "function") onComplete();
      }
      return;
    }

    if (typeof onComplete === "function") onComplete();
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
      // 1. Native iOS / Android Taptic Engine via Capacitor Plugin
      if (typeof window !== "undefined" && window.Capacitor?.Plugins?.Haptics) {
        const haptics = window.Capacitor.Plugins.Haptics;
        if (Array.isArray(pattern) || pattern >= 35) {
          haptics.notification({ type: "WARNING" }).catch(() => {});
        } else if (pattern >= 20) {
          haptics.impact({ style: "MEDIUM" }).catch(() => {});
        } else {
          haptics.impact({ style: "LIGHT" }).catch(() => {});
        }
      }
      // 2. Standard Web Vibration API Fallback
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
      if (this.currentLevelIdx === 0 && !this.isTowerMode && !this.isDailyTrial) {
        this.dom.queueContainer.innerHTML = `<div class="empty-queue-hint" style="color: var(--cyan); font-weight: 600;">👆 Tippe auf <strong>Vorwärts</strong> & dann auf <strong>▶ Plan abspielen</strong>!</div>`;
      } else {
        this.dom.queueContainer.innerHTML = `<div class="empty-queue-hint">Dein Plan erscheint hier …</div>`;
      }
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

      const isUnlocked = this.isLevelUnlocked(idx);
      const isCompleted = this.completedLevels.has(idx);
      const isActive = idx === this.currentLevelIdx;

      const btn = document.createElement("button");
      btn.className =
        "level-pill-btn" +
        (isActive ? " active" : "") +
        (isCompleted ? " done" : "") +
        (!isUnlocked ? " locked" : "");
      
      if (!isUnlocked) {
        btn.setAttribute("aria-disabled", "true");
        btn.title = `Level ${idx + 1} ist noch gesperrt. Schließe Level ${idx} ab.`;
      }

      const stars = this.levelStars[idx];
      let starMarkup = "";
      if (isUnlocked && stars !== undefined) {
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
        ${!isUnlocked ? '<span class="pill-lock">🔒</span>' : (isCompleted ? '<span class="pill-check">✓</span>' : "")}
      `;
      btn.onclick = () => {
        if (!isUnlocked) {
          Sound.playBump();
          this.triggerHaptic([35, 30, 40]);
          this.setFeedback(`🔒 Level ${idx + 1} ist noch gesperrt! Schließe zuerst Level ${idx} ab.`, "bad");
          return;
        }
        this.triggerHaptic(14);
        this.dom.levelDrawer.classList.remove("open");
        this.hideHomeScreen();
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
        if (this.isTowerMode && typeof TowerTrial !== "undefined") {
          const failRes = TowerTrial.handleFail();
          if (failRes.gameOver) {
            this.setFeedback(`💥 Absturz! Alle Laternen erloschen auf Ebene ${failRes.floor}.`, "bad");
            Sound.playBump();
            this.triggerHaptic([50, 60, 80]);
            setTimeout(() => this.showTowerGameOver(failRes), 500);
            return;
          } else {
            Sound.playBump();
            this.triggerHaptic([35, 40]);
            this.reset(false);
            this.setFeedback(failRes.message, failRes.absorbed ? "normal" : "bad");
            return;
          }
        }
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
      this.processBossBreath(lvl, this.currentStep, () => {
        this.playbackTimer = setTimeout(() => this.executeNextStep(), 250);
      });
      return;
    }

    // 2. Turn Right
    if (cmd === "R") {
      const turnMap = { N: "E", E: "S", S: "W", W: "N" };
      this.state.dir = turnMap[this.state.dir];
      this.renderer.animateRotate(this.state.dir, 220);
      Sound.playTurn();
      this.processBossBreath(lvl, this.currentStep, () => {
        this.playbackTimer = setTimeout(() => this.executeNextStep(), 250);
      });
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
      this.processBossBreath(lvl, this.currentStep, () => {
        this.playbackTimer = setTimeout(() => this.executeNextStep(), 300);
      });
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

      // Check collapsed fragile tile collision (cannot step into water where stone collapsed)
      const isCollapsedTile = this.state.collapsedFragileTiles && this.state.collapsedFragileTiles.has(`${nx},${ny}`);

      // Check open water hazard (cannot walk on water unless it's a fragile tile or bridge)
      const isFragileTile = (lvl.fragile || []).some(f => f[0] === nx && f[1] === ny);
      const isWaterHazard = this.state.waterTiles && this.state.waterTiles.has(`${nx},${ny}`) && !isFragileTile;

      // Check Pushable Block collision / pushing
      const blockIdx = this.state.blocks ? this.state.blocks.findIndex(b => b[0] === nx && b[1] === ny) : -1;
      let isPushingBlock = false;
      let pushTargetX = 0;
      let pushTargetY = 0;
      let isPushIntoWater = false;

      if (blockIdx !== -1) {
        pushTargetX = nx + dx;
        pushTargetY = ny + dy;
        const pushOOB = pushTargetX < 0 || pushTargetY < 0 || pushTargetX >= lvl.w || pushTargetY >= lvl.h;
        const pushWall = hasCoord(lvl.walls, pushTargetX, pushTargetY);
        const pushOtherBlock = this.state.blocks.some(b => b[0] === pushTargetX && b[1] === pushTargetY);
        const pushGate = allGates.find(g => g[0] === pushTargetX && g[1] === pushTargetY);
        let pushBlockedGate = false;
        if (pushGate) {
          const color = pushGate[2] || "magenta";
          if (!this.state.openGates.has(color)) pushBlockedGate = true;
        }
        const pushIsWater = this.state.waterTiles && this.state.waterTiles.has(`${pushTargetX},${pushTargetY}`);

        if (pushOOB || pushWall || pushOtherBlock || pushBlockedGate) {
          this.state.isFail = true;
          this.isPlaying = false;
          if (typeof document !== "undefined") document.body.classList.remove("is-executing");
          this.renderer.animateBump();
          Sound.playBump();
          this.triggerHaptic([45, 30, 50]);
          this.setFeedback("Der heilige Felsblock ist blockiert und lässt sich nicht weiterschieben!", "bad");
          this.renderQueue();
          return;
        }

        isPushingBlock = true;
        isPushIntoWater = pushIsWater;
      }

      if (isOutOfBounds || isWall || isBlockedGate || isCollapsedTile || isWaterHazard) {
        this.state.isFail = true;
        this.isPlaying = false;
        if (typeof document !== "undefined") {
          document.body.classList.remove("is-executing");
        }
        this.renderer.animateBump();
        Sound.playBump();
        this.triggerHaptic([45, 30, 50]);

        if (this.isTowerMode && typeof TowerTrial !== "undefined") {
          const failRes = TowerTrial.handleFail();
          if (failRes.gameOver) {
            this.setFeedback(`💥 Absturz! Alle Laternen erloschen auf Ebene ${failRes.floor}.`, "bad");
            setTimeout(() => this.showTowerGameOver(failRes), 550);
            return;
          } else {
            this.reset(false);
            this.setFeedback(failRes.message, failRes.absorbed ? "normal" : "bad");
            return;
          }
        }

        let reason = "Da ist ein Hindernis.";
        if (isBlockedGate) reason = "Das Tor ist noch verschlossen!";
        else if (isCollapsedTile) reason = "Der Trittstein ist bereits im Wasser versunken!";
        else if (isWaterHazard) reason = "Das Wasser ist zu tief! KOMA kann ohne Trittstein nicht hinüber.";
        this.setFeedback(`Plopp! ${reason} KOMA bleibt stehen – passe deinen Plan an.`, "bad");
        this.renderQueue();
        return;
      }

      // Check if KOMA is stepping off a fragile tile
      const prevX = this.state.x;
      const prevY = this.state.y;
      const isSteppingOffFragile = (lvl.fragile || []).some(f => f[0] === prevX && f[1] === prevY);

      // Handle pushing block
      if (isPushingBlock) {
        if (isPushIntoWater) {
          this.state.waterTiles.delete(`${pushTargetX},${pushTargetY}`);
          this.state.blocks.splice(blockIdx, 1);
          Sound.playStoneSlide();
          setTimeout(() => Sound.playSplash(), 160);
          this.setFeedback("Platsch! Der Felsblock versinkt im Wasser und bildet eine neue Trittstein-Brücke!", "good");
        } else {
          this.state.blocks[blockIdx] = [pushTargetX, pushTargetY];
          Sound.playStoneSlide();
          this.setFeedback("Rumpel! KOMA schiebt den heiligen Steinblock vor sich her.", "normal");
        }
        if (this.renderer && typeof this.renderer.animateBlockPush === "function") {
          this.renderer.animateBlockPush(nx, ny, pushTargetX, pushTargetY, isPushIntoWater);
        }
      }

      // Valid step: Hop forward (300ms) and trigger audio & events on exact touchdown
      this.state.x = nx;
      this.state.y = ny;

      this.renderer.animateMove(nx, ny, 300, () => {
        if (!this.isPlaying) return; // In case reset was pressed during animation

        // If KOMA stepped off a fragile tile, collapse it now!
        if (isSteppingOffFragile) {
          this.state.collapsedFragileTiles.add(`${prevX},${prevY}`);
          if (this.renderer && typeof this.renderer.collapseFragileTile === "function") {
            this.renderer.collapseFragileTile(prevX, prevY);
          }
          Sound.playSplash();
        }

        // If KOMA just stepped onto a fragile tile, crack it!
        const isLandingOnFragile = (lvl.fragile || []).some(f => f[0] === nx && f[1] === ny);
        if (isLandingOnFragile) {
          Sound.playCrack();
          if (this.renderer && typeof this.renderer.crackFragileTile === "function") {
            this.renderer.crackFragileTile(nx, ny);
          }
          this.setFeedback("Knacks! Der morsche Trittstein bekommt Risse und versinkt gleich!", "normal");
        } else {
          Sound.playStep();
        }
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
            this.onOrbCollected(lvl);
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
          this.onOrbCollected(lvl);
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

      if (this.isTowerMode) {
        const res = (typeof TowerTrial !== "undefined")
          ? TowerTrial.handleFloorClear(this.currentStep)
          : { type: "next_floor", floor: 2, score: 200, isNewBestFloor: false };

        this.renderer.animateWin();
        Sound.playWin();
        this.triggerHaptic([40, 50, 40, 50, 80, 80, 120]);

        if (this.dom.progressBar) this.dom.progressBar.style.width = "100%";

        const earnedPts = res.floorScore || (res.score || 200);
        const zenFeedback = res.zenLabel ? ` · ${res.zenLabel}` : "";
        const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
        const ptsWord = isEn ? "Pts." : "Pkt.";

        if (res.type === "altar") {
          const altarMsg = isEn 
            ? `⛩️ GREAT SHRINE GATE CLEARED!${zenFeedback} (+${earnedPts} ${ptsWord}) Altar opening...`
            : `⛩️ GROSSE SCHREIN-PFORTE GEMEISTERT!${zenFeedback} (+${earnedPts} Pkt.) Altar öffnet sich...`;
          this.setFeedback(altarMsg, "good");
          if (res.zenTier === "perfect" && typeof Sound !== "undefined" && typeof Sound.playStarChime === "function") {
            setTimeout(() => Sound.playStarChime(3), 200);
          }
          setTimeout(() => {
            this.showTowerAltar(res.choices, res.floor);
          }, 700);
        } else {
          const floorMsg = isEn
            ? `⛩️ FLOOR ${res.floor - 1} CLEARED!${zenFeedback} (+${earnedPts} ${ptsWord}) Ascending to floor ${res.floor}...`
            : `⛩️ EBENE ${res.floor - 1} GEMEISTERT!${zenFeedback} (+${earnedPts} Pkt.) Aufstieg zu Ebene ${res.floor}...`;
          this.setFeedback(floorMsg, "good");
          if (res.zenTier === "perfect" && typeof Sound !== "undefined" && typeof Sound.playStarChime === "function") {
            setTimeout(() => Sound.playStarChime(3), 200);
          } else if (res.zenTier === "great" && typeof Sound !== "undefined" && typeof Sound.playStarChime === "function") {
            setTimeout(() => Sound.playStarChime(2), 200);
          }
          setTimeout(() => {
            this.loadTowerFloor();
          }, 850);
        }
        return;
      }

      if (this.isDailyTrial) {
        const res = (typeof DailyTrial !== "undefined")
          ? DailyTrial.recordCompletion()
          : { currentStreak: 1, isNewRecord: false };

        this.renderer.animateWin();
        Sound.playWin();
        this.triggerHaptic([40, 50, 40, 50, 80, 80, 120]);

        if (this.dom.progressBar) this.dom.progressBar.style.width = "100%";
        const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
        const daysWord = isEn ? (res.currentStreak === 1 ? "day" : "days") : (res.currentStreak === 1 ? "Tag" : "Tage");
        const dailyFeedback = isEn
          ? `⛩️ DAILY TRIAL CLEARED! 🔥 Streak: ${res.currentStreak} ${daysWord}!`
          : `⛩️ TÄGLICHE PRÜFUNG GEMEISTERT! 🔥 Tages-Streak: ${res.currentStreak} Tage!`;
        this.setFeedback(dailyFeedback, "good");

        setTimeout(() => {
          if (this.dom.modalWinTitle) {
            this.dom.modalWinTitle.textContent = typeof I18N !== "undefined" ? I18N.t("win_title_daily") : "Tägliche Schreinprüfung gemeistert! 🔥";
          }
          if (this.dom.modalWinText) {
            this.dom.modalWinText.textContent = typeof I18N !== "undefined" ? I18N.t("win_desc_daily", { steps: this.currentStep }) : `Du hast die heutige Meisterprüfung ohne Kameraschwenker in ${this.currentStep} Schritten gelöst!`;
          }
          if (this.dom.modalWinStars) {
            const streakTitle = `${res.currentStreak} ${daysWord} Streak!`;
            const streakSub = res.isNewRecord 
              ? (isEn ? "🎉 NEW PERSONAL RECORD!" : "🎉 NEUER PERSÖNLICHER REKORD!")
              : (isEn ? "Come back tomorrow for the next shrine trial!" : "Komm morgen für die nächste Schrein-Prüfung wieder!");
            this.dom.modalWinStars.innerHTML = `
              <div class="daily-win-streak-badge">
                <span class="flame-big">🔥</span>
                <div class="streak-big-val">${streakTitle}</div>
                <div class="streak-sub-text">${streakSub}</div>
              </div>
            `;
          }
          if (this.dom.modalWinCredits) {
            this.dom.modalWinCredits.textContent = typeof I18N !== "undefined" ? I18N.t("win_credits_zero") : "0 Kameraschwenker verwendet · Reine Vorab-Planung!";
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

      const isBoss = lvl && (lvl.bossId === "ryujin" || lvl.isBossLevel);
      if (isBoss) {
        try {
          localStorage.setItem("koma_defeated_ryujin", "true");
        } catch (e) {}
        if (this.renderer && typeof this.renderer.animateDragonAscend === "function") {
          this.renderer.animateDragonAscend();
        }
      }

      this.renderer.animateWin();
      Sound.playWin();
      this.triggerHaptic([40, 50, 40, 50, 80, 80, 120]);

      if (this.dom.progressBar) this.dom.progressBar.style.width = "100%";
      const isEn = typeof I18N !== "undefined" && I18N.getLanguage() === "en";
      if (isBoss) {
        this.setFeedback(isEn ? "🐉 Sacred dragon Ryūjin is redeemed and ascends into the heavens!" : "🐉 Der heilige Drache Ryūjin ist erlöst und steigt in den Himmel auf!", "good");
      } else {
        this.setFeedback(isEn ? "Package successfully delivered! A sacred corner of Japan lights up." : "Paket erfolgreich zugestellt! Eine Ecke Japans leuchtet auf.", "good");
      }

      setTimeout(() => {
        if (this.dom.modalWinTitle) {
          if (isBoss) {
            this.dom.modalWinTitle.textContent = typeof I18N !== "undefined" ? I18N.t("win_title_boss") : "「富士の龍神」 BEZWUNGEN! 🐉";
          } else {
            this.dom.modalWinTitle.textContent =
              this.currentLevelIdx === LEVELS.length - 1 
                ? (isEn ? "All Deliveries Completed! 🎉" : "Alle Lieferungen geschafft! 🎉")
                : (typeof I18N !== "undefined" ? I18N.t("win_title_normal") : "Lieferung erfolgreich! 🌸");
          }
        }
        if (this.dom.modalWinText) {
          if (isBoss) {
            this.dom.modalWinText.textContent = typeof I18N !== "undefined" ? I18N.t("win_desc_boss", { steps: this.currentStep }) : `Du hast alle 3 Relikte geborgen, das Torii des Gipfels versöhnt und den Drachen Ryūjin in ${this.currentStep} Schritten erlöst!`;
          } else {
            this.dom.modalWinText.textContent = typeof I18N !== "undefined" ? I18N.t("win_desc_normal", { steps: this.currentStep }) : `KOMA hat das Paket in ${this.currentStep} Befehl${
              this.currentStep === 1 ? "" : "en"
            } sicher abgeliefert.`;
          }
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
          if (isEn) {
            if (stars === 3) starLabel = "3 Stars · Full Camera Credits preserved (Perfect!)";
            else if (stars === 2) starLabel = "2 Stars · At least half Credits preserved (Great!)";
            else if (stars === 1) starLabel = "1 Star · Few Credits remaining (Good!)";
            else starLabel = "0 Stars · All Camera Credits depleted (Delivered!)";
          } else {
            if (stars === 3) starLabel = "3 Sterne · Volle Kamera-Credits erhalten (Perfekt!)";
            else if (stars === 2) starLabel = "2 Sterne · Mindestens halbe Credits erhalten (Sehr gut!)";
            else if (stars === 1) starLabel = "1 Stern · Wenig Credits übrig (Gut!)";
            else starLabel = "0 Sterne · Alle Kamera-Credits aufgebraucht (Erfolgreich geliefert)";
          }
          
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
          this.dom.modalWinCredits.textContent = typeof I18N !== "undefined"
            ? I18N.t("win_credits_normal", { credits: this.cameraCredits, max: this.maxCameraCredits })
            : `Übrige Kamera-Credits: ${this.cameraCredits} / ${this.maxCameraCredits}`;
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
          if (isBoss) {
            const ryujinSkin = (typeof window !== "undefined" && window.KOMA_SKINS && window.KOMA_SKINS.ryujin);
            if (ryujinSkin) {
              const bossKicker = isEn ? "👑 LEGENDARY BOSS TROPHY UNLOCKED!" : "👑 LEGENDÄRE BOSS-TROPHÄE FREIGESCHALTET!";
              const bossSub = isEn ? "Mother of Pearl Chassis · Imperial Horns · Celestial Ribbons" : "Perlmutt-Chassis · Kaiserliche Hörner · Himmelsbänder";
              const equipBtnTxt = typeof I18N !== "undefined" ? `${I18N.t("wardrobe_equip_btn")} 👘` : "Ausrüsten 👘";
              const transRyujin = typeof I18N !== "undefined" ? I18N.getSkin("ryujin", ryujinSkin) : ryujinSkin;
              this.dom.modalWinSkinNotice.innerHTML = `
                <div class="win-skin-banner boss-skin-banner">
                  <span class="win-skin-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getSkinIcon("ryujin", 32, "#00f0ff") : "🐉"}</span>
                  <div class="win-skin-info">
                    <span class="win-skin-kicker">${bossKicker}</span>
                    <strong class="win-skin-name">${transRyujin.name} (${transRyujin.jpName})</strong>
                    <div style="font-size:0.75rem;opacity:0.8;margin-top:2px;">${bossSub}</div>
                  </div>
                  <button class="win-skin-btn" id="btnWinOpenSkins">${equipBtnTxt}</button>
                </div>
              `;
              this.dom.modalWinSkinNotice.style.display = "block";
              const btnNotice = document.getElementById("btnWinOpenSkins");
              if (btnNotice) {
                btnNotice.addEventListener("click", () => {
                  if (this.dom.modalWin) this.dom.modalWin.classList.remove("active");
                  this.equipSkin("ryujin");
                  this.openSkinsModal();
                });
              }
            }
          } else if (newlyUnlockedSkin) {
            const newKicker = isEn ? "🎉 New Kami Skin unlocked!" : "🎉 Neuer Kami-Skin freigeschaltet!";
            const wardrobeBtnTxt = isEn ? "Wardrobe 👘" : "Garderobe 👘";
            const transNewSkin = typeof I18N !== "undefined" ? I18N.getSkin(newlyUnlockedSkin.id, newlyUnlockedSkin) : newlyUnlockedSkin;
            this.dom.modalWinSkinNotice.innerHTML = `
              <div class="win-skin-banner">
                <span class="win-skin-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.getSkinIcon(newlyUnlockedSkin.id, 28, newlyUnlockedSkin.accentColor) : newlyUnlockedSkin.icon}</span>
                <div class="win-skin-info">
                  <span class="win-skin-kicker">${newKicker}</span>
                  <strong class="win-skin-name">${transNewSkin.name} (${transNewSkin.jpName})</strong>
                </div>
                <button class="win-skin-btn" id="btnWinOpenSkins">${wardrobeBtnTxt}</button>
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
          if (this.currentLevelIdx === LEVELS.length - 1) {
            this.dom.btnNextLevel.textContent = typeof I18N !== "undefined" ? I18N.t("btn_replay_first") : "Erstes Level erneut spielen";
          } else {
            this.dom.btnNextLevel.textContent = typeof I18N !== "undefined" ? I18N.t("btn_next_level") : "Nächstes Level →";
          }
        }
        if (this.dom.modalWin) this.dom.modalWin.classList.add("active");
        if (typeof window !== "undefined" && window.adManager && typeof window.adManager.showInterstitialAd === "function") {
          window.adManager.showInterstitialAd();
        }
      }, isBoss ? 1100 : 700);
      return;
    }

    // Next step with crisp, steady rhythm (100ms interval between steps)
    this.processBossBreath(lvl, this.currentStep, () => {
      this.playbackTimer = setTimeout(() => this.executeNextStep(), 100);
    });
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
  window.gameInstance = window.Game;
});
