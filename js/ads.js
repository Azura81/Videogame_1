/**
 * Spirit Delivery - AdManager
 * Google AdMob Integration for iOS Native & Interactive Simulated Fallback for Web/PWA
 */
class AdManager {
  constructor() {
    this.isNative = typeof window !== "undefined" && Boolean(window.Capacitor?.isNativePlatform?.());
    this.admob = null;
    this.isInitialized = false;

    // Official Google AdMob Ad Units
    this.adUnits = {
      ios: {
        rewarded: "ca-app-pub-4915881301731685/2652522912",
        interstitial: "ca-app-pub-3940256099942544/4411468910"
      },
      android: {
        rewarded: "ca-app-pub-4915881301731685/2652522912",
        interstitial: "ca-app-pub-3940256099942544/1033173712"
      }
    };

    this.completedLevelCount = 0;
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
          return { rewarded: true };
        }
      } catch (e) {
        console.warn("[AdMob] Native rewarded ad failed or closed, falling back to simulated modal:", e);
      }
    }

    // 2. Web & Test Environment Fallback
    return this.showSimulatedVideoModal({ title, rewardDescription });
  }

  /**
   * Show Interstitial Ad (triggered every 5 levels completed)
   */
  async showInterstitialAd() {
    this.completedLevelCount++;
    if (this.completedLevelCount % 5 !== 0) return;

    await this.init();
    if (this.isNative && this.admob) {
      try {
        const adId = this.adUnits.ios.interstitial;
        const isTestUnit = adId.includes("3940256099942544");
        await this.admob.prepareInterstitial({ adId, isTesting: isTestUnit });
        await this.admob.showInterstitial();
      } catch (e) {
        console.warn("[AdMob] Interstitial notice:", e);
      }
    }
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
            <span class="ad-badge">📢 ANZEIGE · TEST-WERBUNG</span>
            <span class="ad-timer" id="adTimerText">Noch ${remainingSec}s …</span>
          </div>
          <div class="ad-video-mockup">
            <div class="ad-pulse-ring"></div>
            <div class="ad-sponsor-icon">⛩️</div>
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
