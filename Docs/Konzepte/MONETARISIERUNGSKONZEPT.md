# Monetarisierungskonzept durch In-Game- & Web-Werbung
## Spieltitel: KOMA: Spirit Delivery (3D WebGL Puzzle)

---

## 1. Executive Summary & Zielsetzung

*KOMA: Spirit Delivery* ist ein atmosphärisches, rundenbasiertes 3D-Programmier- und Logik-Puzzlespiel im Cyberpunk-/Japan-Schrein-Stil. Der Kern des Spielerlebnisses besteht aus logischer Konzentration, vorausschauender Planung ("Planen & Ausführen") und dem Meistern der Level mit optimaler Sterne-Bewertung.

### Die Kernherausforderung bei Puzzle-Spielen
Klassische, aggressive Werbeformate (z. B. willkürliche Pop-Ups mitten im Denkprozess) zerstören den "Flow-State" des Spielers und führen auf Web-Plattformen zu Absprungraten (Bounce Rates) von über **65–80 %**.

### Die Lösungsstrategie: „Wertschätzende Monetarisierung“
Das Monetarisierungsmodell setzt auf **hohe Spieler-Akzeptanz**, **starke eCPMs** und eine harmonische Einbettung in die Spielmechanik:
1. **Rewarded Video Ads (Belohnungswerbung)** als dominierende Einnahmequelle (Opt-In, kein Zwang).
2. **Smarte Interstitials (Zwischenlevel-Clips)** mit strengem Frequency-Capping und Pacing.
3. **Nicht-störende Display-/Banner-Zonen** außerhalb der interaktiven 3D-Bühne.
4. **Optionale In-Universe Cyberpunk-Werbeflächen** (Native 3D Billboards) für maximale Immersion.

---

## 2. Die 4 Werbesäulen im Detail

```
┌────────────────────────────────────────────────────────────────────────┐
│                   WERBEMONETARISIERUNG KOMA                             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. REWARDED ADS   │ 2. INTERSTITIALS  │ 3. DISPLAY / NATIVE IN-GAME   │
│ (Freiwillig)      │ (Dezente Pausen)  │ (Passiv / Begleitend)         │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ • Kamera-Credits  │ • Alle 3 Level    │ • Sticky Banner im Footer      │
│ • +2 Command Slots│ • Nur nach Sieg   │ • Cyberpunk-Neon-Schilder im   │
│ • Geister-Hinweis │ • 5s Skip-Option  │   3D-Hintergrund               │
│ • Kosmetische Skin│ • Max. 1x / 4 Min │                                │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

### Säule 1: Rewarded Video Ads (Belohnungsvideos – Höchste Priorität)

Rewarded Ads bieten auf Casual- und Puzzle-Plattformen mit **15 € bis 35 € eCPM** (im DACH- und US-Raum) die lukrativsten Erträge bei gleichzeitig **höchster Nutzerzufriedenheit**, da der Spieler den Werbespot aus eigenem Antrieb startet.

#### Konkrete Use-Cases in KOMA:

1. **„Drohnen-Aufklärung“ (Kamera-Credit-Refill)**
   - **Problem:** Hat der Spieler alle 6 Kamera-Credits verbraucht, kann er die Kamera nicht mehr drehen, ohne seine 0-Sterne-Wertung zu behalten.
   - **Belohnung:** Nach einem kurzen 15–30-Sekunden-Spot erhält der Spieler **+3 Kamera-Credits** zurück, ohne dass sein Sterne-Potenzial für dieses Level dauerhaft auf 0 gesetzt wird.
   - **Button im UI:** Ein kleiner leuchtender Button neben der Kamera-Anzeige: `📡 Drohnen-Scan (+3 Credits) [Werbung ansehen]`.

2. **„Speichererweiterung“ (+2 zusätzliche Befehls-Slots)**
   - **Problem:** In späteren, komplexen Leveln reicht das Befehlslimit (z. B. Limit 10 oder 12) für unerfahrene Spieler oft nicht aus, um Umwege zu kompensieren.
   - **Belohnung:** Das Anschauen einer Anzeige schaltet temporär für den aktuellen Durchlauf **+2 zusätzliche Slots** frei (`Expansion Slot: +2`).

3. **„Schrein-Orakel“ (Geister-Vorschau / Ghost Path Hint)**
   - **Problem:** Ein Spieler scheitert 3 Mal in Folge an einem kniffligen Level (z. B. Schalter-Tor-Kombination).
   - **Belohnung:** Ein transparenter, geisterhafter KOMA zeigt die ersten 4 korrekten Schritte im 3D-Feld vor.

4. **Kosmetische Freischaltungen (Cyberpunk Customization)**
   - **Belohnung:** Exklusive KOMA-Chassis-Farben (z. B. *Neon Gold*, *Sakura Pink*, *Cyber Void*) oder Partikeleffekte (Kirschblüten statt Funken) nach dem Anschauen von 3 Rewarded Ads.

---

### Säule 2: Smarte Interstitials (Zwischensequenzen)

Interstitials (Vollbildanzeigen mit Überspringen-Option nach 5 Sekunden) erzielen gute Grundumsätze (**5 € bis 12 € eCPM**), müssen aber psychologisch vorsichtig getimt werden.

#### Strenge Regeln für KOMA:
- **Niemals nach Misserfolg:** Wird ein Level zurückgesetzt oder scheitert ein Plan, darf **keine** Werbung erscheinen. Das würde Frust maximieren.
- **Nur nach Dopamin-Momenten:** Erst wenn das Torii-Tor durchschritten ist und das Sieges-Modal (`modalWin`) aufpoppt.
- **Frequency Capping (Frequenzbegrenzung):**
  - Maximal **1 Interstitial alle 3 abgeschlossene Level**.
  - Maximal **1 Anzeige alle 4 Minuten** Spielzeit (globaler Cooldown).
  - Level 1 und 2 sind komplett werbefrei (Onboarding & Tutorial-Schutz).

---

### Säule 3: Passive Display- / Banner-Werbung

Standard-Display-Banner (300×250 Medium Rectangle oder 728×90 Leaderboard) generieren kontinuierliche Impressionen (**0,80 € bis 2,50 € eCPM**).

#### Platzierungsstrategie:
- **Keine Überlagerung der 3D-Bühne:** Das 3D-WebGL-Canvas bleibt unberührt, damit die Klick- und Drehsteuerung nicht gestört wird.
- **Platzierung im Seitenpanel:** Unterhalb des "Befehls-Panels" oder im Drawer-Menü der Level-Auswahl ist ausreichend Platz für eine responsive 300×250 Banner-Zone.
- **Pause bei Inaktivität:** Banner-Refresh stoppt, wenn der Tab im Hintergrund ist (schont CPU & verhindert Richtlinienverstöße).

---

### Säule 4: Native In-Game 3D-Billboards (Zukunftspotenzial)

Da *KOMA* ein Cyberpunk-Japan-Theme mit Neon-Beleuchtung besitzt, können echte Werbepartner oder Gaming-Affiliate-Links immersiv in die 3D-Szene eingebettet werden:
- **Laternen- & Schild-Texturen:** Kleine Neon-Banner an Torbögen oder Gebäudefassaden am Rand der Karte.
- **Vorteil:** 100 % immun gegen klassische AdBlocker, stört das Gameplay nicht und passt stilistisch perfekt in die Spielwelt (z. B. Kooperationen mit Indie-Game-Portalen oder Merch-Partnerschaften).

---

## 3. Empfohlene Werbenetzwerke & Plattformen

| Plattform / SDK | Typ | Vorteile | Geschätzter eCPM |
| :--- | :--- | :--- | :--- |
| **CrazyGames SDK** | Web-Portal | Fertiges SDK für HTML5/WebGL, extrem einfache Integration (`showAd('rewarded')`), hohe globale Spielerschaft. | 12 € – 28 € |
| **Poki for Developers** | Web-Portal | Qualitäts-orientiert, sehr hohe Retention, automatische Rewarded- & Commercial-Break-Hooks. | 14 € – 32 € |
| **Google Ad Placement API (H5 Games Ads)** | Eigenständige Website | Offizielles Google-Produkt für Web-Games (Nachfolger von AdSense for Games), optimiert für Canvas & Fullscreen. | 8 € – 22 € |
| **AdinPlay** | Eigene Web-Präsenz | Spezialisiert auf .io- und Casual-Webspiele, exzellenter Support, header bidding. | 7 € – 18 € |

> **Empfehlung:** 
> 1. Für den direkten Self-Hosted-Betrieb auf eigener Domain: **Google Ad Placement API (AdSense for H5 Games)**.
> 2. Für maximale Reichweite ohne eigene Marketingkosten: Einreichung bei **CrazyGames** oder **Poki** mit deren jeweiligem SDK.

---

## 4. Wirtschaftlichkeits- und Ertragsprognose

### Beispiel-Kalkulation (Szenario: 10.000 monatlich aktive Spieler – MAU)

- **Durchschnittliche Sitzungsdauer:** 12 Minuten
- **Gespielte Level pro Sitzung:** 5 Level
- **Traffic-Mix:** 60 % DACH / US / UK (Tier 1), 40 % Rest der Welt (Tier 2/3)

| Werbeformat | Impressionen / Monat | Durchschn. eCPM | Monatlicher Erlös |
| :--- | :--- | :--- | :--- |
| **Rewarded Ads** (z. B. Drohnen-Kamera-Scan / Slots) | 28.000 Views | 22,00 € | **616,00 €** |
| **Interstitials** (1x alle 3 Level) | 16.000 Views | 9,00 € | **144,00 €** |
| **Display Banner** (im UI-Panel) | 65.000 Impressionen | 1,20 € | **78,00 €** |
| **GESAMT PRO MONAT:** | | | **~ 838,00 €** |

*Hinweis: Bei 50.000 MAU (typisch für ein gelistetes Spiel auf CrazyGames/Poki) skaliert der Monatsumsatz linear auf ca. **3.500 € – 4.500 €**.*

---

## 5. Technische Implementierung & Code-Architektur

Um Werbenetzwerke sauber und ohne Abhängigkeiten einzubinden, empfiehlt sich ein modularer `AdManager` in JavaScript.

### Schnittstellen-Entwurf (`js/ads.js`):

```javascript
// js/ads.js — Abstraktionsschicht für flexible Werbenetzwerke
export class AdManager {
  constructor(game) {
    this.game = game;
    this.lastInterstitialTime = 0;
    this.levelsSinceLastAd = 0;
    this.minAdIntervalMs = 240000; // 4 Minuten Cooldown
  }

  // Belohnungswerbung (z.B. für Kamera-Credits)
  async showRewardedCameraRefill(onSuccess, onCancel) {
    this.pauseGame();
    try {
      const rewarded = await this.triggerPlatformRewarded("camera_refill");
      if (rewarded) {
        onSuccess();
      } else {
        if (onCancel) onCancel();
      }
    } finally {
      this.resumeGame();
    }
  }

  // Zwischenlevel-Werbung mit Cooldown
  async maybeShowInterstitial(levelIdx) {
    if (levelIdx < 2) return; // Erste Level werbefrei
    this.levelsSinceLastAd++;
    
    const now = Date.now();
    if (this.levelsSinceLastAd >= 3 && now - this.lastInterstitialTime > this.minAdIntervalMs) {
      this.pauseGame();
      try {
        await this.triggerPlatformInterstitial();
        this.lastInterstitialTime = Date.now();
        this.levelsSinceLastAd = 0;
      } finally {
        this.resumeGame();
      }
    }
  }

  pauseGame() {
    // 1. Audio stummschalten
    if (window.Sound) Sound.setMuted(true);
    // 2. Three.js Render-Loop drosseln/pausieren
  }

  resumeGame() {
    // 1. Audio reaktivieren
    if (window.Sound) Sound.setMuted(false);
    // 2. Three.js Render-Loop fortsetzen
  }
}
```

---

## 6. UX-, Datenschutz- & Compliance-Checkliste

1. **DSGVO & TCF 2.2 Konformität (EU-Recht):**
   - Integration einer zertifizierten Consent Management Platform (CMP), z. B. Google Funding Choices (kostenlos in AdSense) oder Usercentrics.
   - Keine Tracking-Cookies oder Werbeaufrufe vor Zustimmung des Nutzers.

2. **Audio-Management:**
   - WebGL-Spounds und Web-Audio-Kontexte müssen während Werbeclips sofort pausiert werden (`Sound.setMuted(true)`), um überlappenden Lärm zu verhindern.

3. **AdBlocker-Umgang:**
   - Kein aggressiver AdBlock-Blocker.
   - Wenn ein AdBlocker aktiv ist, wird der Rewarded-Button freundlich ausgegraut:  
     *„Werbung blockiert – deaktiviere deinen AdBlocker für zusätzliche Drohnen-Credits.“*

4. **Kombination mit optionalem „No-Ads“-Pass (Hybrid-Modell):**
   - Angebot eines einmaligen In-App-Kaufs (z. B. 1,99 € via Stripe / Ko-fi / itch.io) zur vollständigen Deaktivierung aller Interstitials + dauerhaft freie Kamera-Credits.

---

## 7. Zusammenfassung der nächsten Schritte

1. **Phase 1 (Code-Vorbereitung):**
   - `AdManager`-Schnittstelle in `js/game.js` integrieren (Event-Hooks beim Level-Sieg und beim Credit-Mangel).
   - Mute-Schalter für die Audio-Engine (`Sound.mute()`) fertigstellen.
2. **Phase 2 (Plattform-Wahl):**
   - Bei *Poki for Developers* oder *CrazyGames* einreichen oder Google AdSense für H5-Spiele freischalten.
3. **Phase 3 (A/B-Testing):**
   - Messen, wie viele Spieler den "Drohnen-Scan" (Rewarded Ad) nutzen, wenn Kamera-Credits auf 0 fallen.
