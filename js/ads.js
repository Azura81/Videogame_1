/**
 * Spirit Delivery - AdManager
 * Google AdMob Integration for iOS Native & Interactive Simulated Fallback for Web/PWA
 */
class AdManager {
  constructor() {
    this.isNative = typeof window !== "undefined" && Boolean(window.Capacitor?.isNativePlatform?.());
    this.admob = null;
    this.isInitialized = false;

    // Official Google AdMob Publisher ID & Ad Units
    // Hinweis: Sobald du in AdMob eine eigene Banner-Anzeigenblock-ID erstellt hast,
    // ersetze den Banner-String durch "ca-app-pub-4915881301731685/DEINE_BANNER_ID".
    this.publisherId = "ca-app-pub-4915881301731685";
    this.adUnits = {
      ios: {
        banner: "ca-app-pub-3940256099942544/2934735716",
        rewarded: "ca-app-pub-4915881301731685/2652522912",
        interstitial: "ca-app-pub-4915881301731685/7800993537"
      },
      android: {
        banner: "ca-app-pub-3940256099942544/6300978111",
        rewarded: "ca-app-pub-4915881301731685/2652522912",
        interstitial: "ca-app-pub-4915881301731685/7800993537"
      }
    };

    this.completedLevelCount = 0;
    this.levelsSinceLastInterstitial = 0;
    this.hasShownFirstInterstitial = false;
    this.lastInterstitialTime = 0;
    this.minInterstitialIntervalMs = 180000; // 3 Minuten Mindestabstand
    this.isBannerVisible = false;
  }

  async init() {
    if (this.isInitialized) return;

    if (this.isNative && window.Capacitor?.Plugins?.AdMob) {
      this.admob = window.Capacitor.Plugins.AdMob;
      try {
        await this.admob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: false
        });
        console.log("[AdMob] Native SDK initialized successfully.");
      } catch (err) {
        console.warn("[AdMob] Initialization notice:", err);
      }
    }
    this.isInitialized = true;
  }

  /**
   * Show a Rewarded Video Ad.
   * On native platform: launches AdMob rewarded video.
   * On web or fallback: displays interactive simulated video modal.
   * @param {Object} options - { title: string, rewardDescription: string }
   * @returns {Promise<{ rewarded: boolean }>}
   */
  async showRewardedAd({ title = "Belohnungs-Video", rewardDescription = "Bonus freischalten" } = {}) {
    await this.init();

    // 1. Native AdMob
    if (this.isNative && this.admob) {
      try {
        const adId = this.adUnits.ios.rewarded;
        const isTestUnit = adId.includes("3940256099942544");
        await this.admob.prepareRewardVideoAd({ adId, isTesting: isTestUnit });
        const rewardItem = await this.admob.showRewardVideoAd();
        if (rewardItem) {
          this.levelsSinceLastInterstitial = 0;
          this.lastInterstitialTime = Date.now();
          return { rewarded: true };
        }
      } catch (e) {
        console.warn("[AdMob] Native rewarded ad failed or closed, falling back to simulated modal:", e);
      }
    }

    // 2. Web & Test Environment Fallback
    const res = await this.showSimulatedVideoModal({ title, rewardDescription });
    if (res && res.rewarded) {
      this.levelsSinceLastInterstitial = 0;
      this.lastInterstitialTime = Date.now();
    }
    return res;
  }

  /**
   * Controls the bottom 50px Banner Ad visibility:
   * - Hidden on Home Screen and in Campaign Levels 1-5
   * - Active from Campaign Level 6+ as well as Tower & Daily Trial modes
   */
  async updateBannerForLevel({ levelNumber = 1, isHomeActive = false, isSpecialMode = false } = {}) {
    const shouldShow = !isHomeActive && (isSpecialMode || levelNumber >= 6);
    if (shouldShow) {
      await this.showBannerAd();
    } else {
      await this.hideBannerAd();
    }
    return shouldShow;
  }

  async showBannerAd() {
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.add("has-banner-ad");
    }
    if (this.isBannerVisible) return;
    this.isBannerVisible = true;

    await this.init();
    if (this.isNative && this.admob && typeof this.admob.showBanner === "function") {
      try {
        const adId = this.adUnits.ios.banner;
        const isTestUnit = adId.includes("3940256099942544");
        if (typeof document !== "undefined" && document.body) {
          document.body.classList.add("native-banner-active");
        }
        await this.admob.showBanner({
          adId,
          adSize: "ADAPTIVE_BANNER",
          position: "BOTTOM_CENTER",
          margin: 0,
          isTesting: isTestUnit
        });
      } catch (e) {
        console.warn("[AdMob] Banner notice:", e);
      }
    }
  }

  async hideBannerAd() {
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.remove("has-banner-ad", "native-banner-active");
    }
    if (!this.isBannerVisible) return;
    this.isBannerVisible = false;

    if (this.isNative && this.admob && typeof this.admob.hideBanner === "function") {
      try {
        await this.admob.hideBanner();
      } catch (e) {
        console.warn("[AdMob] Hide banner notice:", e);
      }
    }
  }

  /**
   * Show Interstitial Ad:
   * - Never shown in Levels 1-9 (only starts at Level 10+)
   * - Triggered on Level 10 and then every 4 completed levels (e.g. 10, 14, 18, 22...)
   * - Respects a 3-minute minimum cooldown between interstitials/rewarded ads
   * @param {number} completedLevelNumber - 1-based level number (1..60)
   */
  async showInterstitialAd(completedLevelNumber = 0) {
    if (completedLevelNumber < 10) {
      return { shown: false, reason: "below_level_10" };
    }

    this.completedLevelCount++;
    this.levelsSinceLastInterstitial++;

    const isFirstEligible = !this.hasShownFirstInterstitial && completedLevelNumber >= 10;
    const isFourthLevel = this.levelsSinceLastInterstitial >= 4;

    if (!isFirstEligible && !isFourthLevel) {
      return { shown: false, reason: "frequency_cap" };
    }

    const now = Date.now();
    if (this.lastInterstitialTime > 0 && (now - this.lastInterstitialTime) < this.minInterstitialIntervalMs) {
      return { shown: false, reason: "cooldown" };
    }

    this.hasShownFirstInterstitial = true;
    this.levelsSinceLastInterstitial = 0;
    this.lastInterstitialTime = now;

    await this.init();
    if (this.isNative && this.admob) {
      try {
        const adId = this.adUnits.ios.interstitial;
        const isTestUnit = adId.includes("3940256099942544");
        await this.admob.prepareInterstitial({ adId, isTesting: isTestUnit });
        await this.admob.showInterstitial();
        return { shown: true, native: true };
      } catch (e) {
        console.warn("[AdMob] Interstitial notice:", e);
      }
    }
    return { shown: true, native: false };
  }

  /**
   * Simulated Rewarded Video Overlay for Web & Test testing
   */
  showSimulatedVideoModal({ title, rewardDescription }) {
    return new Promise((resolve) => {
      let overlay = document.getElementById("adSimulatedOverlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "adSimulatedOverlay";
        overlay.className = "ad-overlay-backdrop";
        document.body.appendChild(overlay);
      }

      let remainingSec = 5;
      overlay.innerHTML = `
        <div class="ad-modal-card">
          <div class="ad-header">
            <span class="ad-badge">ANZEIGE · TEST-WERBUNG</span>
            <span class="ad-timer" id="adTimerText">Noch ${remainingSec}s …</span>
          </div>
          <div class="ad-video-mockup">
            <div class="ad-pulse-ring"></div>
            <div class="ad-sponsor-icon">${typeof KOMA_ICONS !== "undefined" ? KOMA_ICONS.torii(40, "var(--cyan)") : ""}</div>
            <h3>${title}</h3>
            <p>${rewardDescription}</p>
            <div class="ad-progress-bar">
              <div class="ad-progress-fill" id="adProgressFill" style="width: 0%;"></div>
            </div>
          </div>
          <div class="ad-footer">
            <button class="ad-close-btn" id="adCloseBtn" disabled>Bitte kurz warten …</button>
          </div>
        </div>
      `;

      overlay.classList.add("active");

      const timerEl = document.getElementById("adTimerText");
      const progressEl = document.getElementById("adProgressFill");
      const closeBtn = document.getElementById("adCloseBtn");

      const stepMs = (typeof window !== "undefined" && (window.__FAST_TEST_ADS__ || navigator.webdriver)) ? 50 : 1000;
      const interval = setInterval(() => {
        remainingSec--;
        if (timerEl) {
          timerEl.textContent = remainingSec > 0 ? `Noch ${remainingSec}s …` : "✓ Belohnung bereit!";
        }
        if (progressEl) {
          progressEl.style.width = `${((5 - remainingSec) / 5) * 100}%`;
        }

        if (remainingSec <= 0) {
          clearInterval(interval);
          if (closeBtn) {
            closeBtn.disabled = false;
            closeBtn.textContent = "Belohnung einlösen ✓";
            closeBtn.classList.add("ready");
            closeBtn.onclick = () => {
              overlay.classList.remove("active");
              resolve({ rewarded: true });
            };
          }
        }
      }, stepMs);
    });
  }
}

if (typeof window !== "undefined") {
  window.adManager = new AdManager();
}
