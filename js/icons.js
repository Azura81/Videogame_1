/**
 * KOMA: Spirit Delivery - Custom Japanese SVG Icon System
 * Handcrafted vector icons replacing emojis with sharp, CSS-styleable, glowing SVG assets.
 */

const KOMA_ICONS = {
  // 1. Origami Stars
  starFilled: (size = 18, color = "var(--gold)", glow = true) => `
    <svg class="svg-icon star-icon-svg filled" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="${glow ? 'filter: drop-shadow(0 0 6px var(--gold-glow, rgba(255,183,3,0.6)));' : ''}" aria-hidden="true">
      <polygon points="12,1.5 15.2,8.2 22.5,9.2 17.2,14.4 18.5,21.7 12,18.2 5.5,21.7 6.8,14.4 1.5,9.2 8.8,8.2" fill="${color}"/>
      <polygon points="12,4.8 13.9,9.2 18.7,9.9 15.2,13.4 16,18.1 12,15.8 8,18.1 8.8,13.4 5.3,9.9 10.1,9.2" fill="#ffffff" opacity="0.38"/>
    </svg>
  `,

  starEmpty: (size = 18, color = "rgba(255, 255, 255, 0.28)") => `
    <svg class="svg-icon star-icon-svg empty" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12,1.5 15.2,8.2 22.5,9.2 17.2,14.4 18.5,21.7 12,18.2 5.5,21.7 6.8,14.4 1.5,9.2 8.8,8.2"/>
    </svg>
  `,

  getStarsRow: (filledCount = 0, max = 3, size = 14) => {
    let html = `<span class="star-row-svg" style="display: inline-flex; align-items: center; gap: 3px;">`;
    for (let i = 1; i <= max; i++) {
      if (i <= filledCount) {
        html += KOMA_ICONS.starFilled(size, "var(--gold)", true);
      } else {
        html += KOMA_ICONS.starEmpty(size, "rgba(255, 255, 255, 0.25)");
      }
    }
    html += `</span>`;
    return html;
  },

  // 2. Torii Gate Emblem (⛩️)
  torii: (size = 20, color = "currentColor", glow = false) => `
    <svg class="svg-icon svg-torii" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" style="${glow ? 'filter: drop-shadow(0 0 6px rgba(255,77,109,0.6));' : ''}" aria-hidden="true">
      <path d="M2 5c6-1.8 14-1.8 20 0" stroke-width="2.6"/>
      <line x1="4" y1="8.5" x2="20" y2="8.5" stroke-width="1.8"/>
      <line x1="7.2" y1="8.5" x2="6.2" y2="21" stroke-width="2.2"/>
      <line x1="16.8" y1="8.5" x2="17.8" y2="21" stroke-width="2.2"/>
      <line x1="4.5" y1="12" x2="19.5" y2="12" stroke-width="1.6"/>
      <rect x="10.5" y="8.5" width="3" height="3.5" rx="0.5" fill="${color}" stroke="none"/>
    </svg>
  `,

  // 3. Spirit Chōchin Lantern (🏮)
  lantern: (size = 18, lit = true, color = "currentColor") => `
    <svg class="svg-icon svg-lantern ${lit ? 'lit' : 'unlit'}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="${lit ? 'filter: drop-shadow(0 0 8px rgba(255,77,109,0.8));' : 'opacity:0.35;'}" aria-hidden="true">
      <path d="M12 1.5v2.5" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="8.5" y="4" width="7" height="2" rx="0.8" fill="${color}"/>
      <path d="M7 6c-2 2.5-2 8.5 0 11h10c2-2.5 2-8.5 0-11H7z" fill="${lit ? '#ff4d6d' : 'rgba(255,255,255,0.1)'}" fill-opacity="${lit ? '0.4' : '0.1'}" stroke="${color}" stroke-width="1.6"/>
      <path d="M6 9.5h12M6 13.5h12" stroke="${color}" stroke-width="1" stroke-opacity="0.6"/>
      ${lit ? '<ellipse cx="12" cy="11.5" rx="2.5" ry="3.5" fill="#ffbe0b"/><ellipse cx="12" cy="11.5" rx="1.2" ry="2" fill="#fff"/>' : ''}
      <rect x="8.5" y="17" width="7" height="2" rx="0.8" fill="${color}"/>
      <path d="M12 19v3.5" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `,

  // 4. Hitodama Spirit Foxfire / Streak Flame (🔥)
  flame: (size = 18, color = "var(--flame, #ff7b00)") => `
    <svg class="svg-icon svg-flame" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 7px rgba(255,123,0,0.6));" aria-hidden="true">
      <path d="M12 2C8 6 6 9.5 6 13.5 6 17.6 9 21 13 21c4.4 0 7-3.4 7-7.5 0-2.8-1.5-5.5-3.5-7.5-.5 2-1.5 3-3 3-1.8 0-2.5-1.5-1.5-4.5z" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M12 11c-2 2-2 4-2 5 0 2 1.3 3.5 3 3.5s3-1.5 3-3.5c0-1.2-1-2.5-2-3.5-.3.8-.7 1-1.2 1-.6 0-.9-.5-.8-1.5z" fill="#ffbe0b"/>
    </svg>
  `,

  // 5. Japanese Sakura Cherry Blossom (🌸)
  sakura: (size = 18, color = "var(--sakura, #f472b6)") => `
    <svg class="svg-icon svg-sakura" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 5px rgba(244,114,182,0.5));" aria-hidden="true">
      <path d="M12 12C11 8.5 8 7 8 5c0-2 2-3 4-1 2-2 4-1 4 1 0 2-3 3.5-4 7z" fill="${color}" fill-opacity="0.85"/>
      <path d="M12 12C8.5 11 7 8 5 8c-2 0-3 2-1 4-2 2-1 4 1 4 2 0 3.5-3 7-4z" fill="${color}" fill-opacity="0.85"/>
      <path d="M12 12C13 15.5 16 17 16 19c0 2-2 3-4 1-2 2-4 1-4-1 0-2 3-3.5 4-7z" fill="${color}" fill-opacity="0.85"/>
      <path d="M12 12C15.5 13 17 16 19 16c2 0 3-2 1-4 2-2 1-4-1-4-2 0-3.5 3-7 4z" fill="${color}" fill-opacity="0.85"/>
      <circle cx="12" cy="12" r="2.2" fill="#ffffff" stroke="${color}" stroke-width="0.8"/>
    </svg>
  `,

  // 6. Raijin Thunderstrike / Zen Lightning (⚡)
  lightning: (size = 18, color = "var(--gold, #ffb703)") => `
    <svg class="svg-icon svg-lightning" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 6px rgba(255,183,3,0.7));" aria-hidden="true">
      <polygon points="13,2 4,14 12,14 11,22 20,10 12,10" fill="${color}" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/>
    </svg>
  `,

  // 7. Sacred Shinto Makimono Scroll (📜)
  scroll: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-scroll" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="${color}" fill-opacity="0.16"/>
      <line x1="8" y1="7" x2="16" y2="7"/>
      <line x1="8" y1="11" x2="16" y2="11"/>
      <line x1="8" y1="15" x2="13" y2="15"/>
    </svg>
  `,

  // 8. Sacred Kagura Bell / Gold Trophy (🏆)
  trophy: (size = 18, color = "var(--gold, #ffb703)") => `
    <svg class="svg-icon svg-trophy" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 6px rgba(255,183,3,0.5));" aria-hidden="true">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/>
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/>
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="${color}" fill-opacity="0.22"/>
      <path d="M12 16v3M8 21h8"/>
    </svg>
  `,

  // 9. Traditional Fūjin Wind Wave / Gust (💨)
  wind: (size = 18, color = "var(--cyan, #00f5ff)") => `
    <svg class="svg-icon svg-wind" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M3 8h11a3 3 0 1 0-3-3"/>
      <path d="M2 13h15a3 3 0 1 1-3 3"/>
      <path d="M4 18h8a2.5 2.5 0 1 0-2.5-2.5"/>
    </svg>
  `,

  // 10. Sacred Shinto Pagoda Home (⛩️ / 🏠)
  home: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-home" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 9.5c5-2 15-2 20 0L12 3 2 9.5z" fill="${color}" fill-opacity="0.25"/>
      <path d="M5 9.5V21h14V9.5"/>
      <path d="M9 21v-6a3 3 0 0 1 6 0v6"/>
      <line x1="1" y1="10" x2="23" y2="10" stroke-width="2.2"/>
    </svg>
  `,

  // 11. Japanese Furoshiki Delivery Package (📦)
  package: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-package" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="8" width="18" height="13" rx="2" fill="${color}" fill-opacity="0.2"/>
      <line x1="3" y1="13" x2="21" y2="13"/>
      <line x1="12" y1="8" x2="12" y2="21"/>
      <path d="M12 8c-2-3-5-3-5 0s5 3 5 0z" fill="${color}"/>
      <path d="M12 8c2-3 5-3 5 0s-5 3-5 0z" fill="${color}"/>
    </svg>
  `,

  // 12. Mount Fuji Peak (🏔️)
  fuji: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-fuji" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
      <polygon points="12,3 2,21 22,21" fill="${color}" fill-opacity="0.2"/>
      <path d="M8.5 10.5L10 12l2-1.5 2 1.5 1.5-1.5" stroke="${color}" stroke-width="1.6"/>
      <polygon points="12,3 8.5,10.5 10,12 12,10.5 14,12 15.5,10.5" fill="#ffffff" fill-opacity="0.95"/>
    </svg>
  `,

  // 13. Folded Realm Map / 60 Levels (🗺️)
  map: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-map" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" fill="${color}" fill-opacity="0.18"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  `,

  // 14. Shrine Chronicle / Book (📖)
  book: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-book" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="${color}" fill-opacity="0.18"/>
      <line x1="9" y1="7" x2="15" y2="7"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  `,

  // 15. Kitsune Spirit Fox Mask (🦊)
  fox: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-fox" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
      <polygon points="4,3 7,10 2,13" fill="${color}" fill-opacity="0.25"/>
      <polygon points="20,3 17,10 22,13" fill="${color}" fill-opacity="0.25"/>
      <path d="M4 11c0 6 8 11 8 11s8-5 8-11a8 8 0 0 0-16 0z" fill="${color}" fill-opacity="0.15"/>
      <path d="M7 13c1-.6 2.5-.6 3.5 0"/>
      <path d="M13.5 13c1-.6 2.5-.6 3.5 0"/>
      <circle cx="12" cy="18" r="1.2" fill="${color}"/>
    </svg>
  `,

  // 16. Divine Radiance Sparkle (✨)
  sparkle: (size = 18, color = "var(--gold, #ffb703)") => `
    <svg class="svg-icon svg-sparkle" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="filter: drop-shadow(0 0 5px rgba(255,183,3,0.6));" aria-hidden="true">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="${color}"/>
    </svg>
  `,

  // 17. Zen Meditating Monk (🧘)
  monk: (size = 18, color = "currentColor") => `
    <svg class="svg-icon svg-monk" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="3" fill="${color}" fill-opacity="0.25"/>
      <path d="M6 19c0-3 3-5 6-5s6 2 6 5"/>
      <path d="M4 21c1-2 4-3 8-3s7 1 8 3"/>
    </svg>
  `,

  // 18. Omamori Protective Talisman (🌸 / Amulet)
  amulet: (size = 18, color = "var(--sakura, #f472b6)") => `
    <svg class="svg-icon svg-amulet" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true">
      <polygon points="8,4 16,4 19,8 19,21 5,21 5,8" fill="${color}" fill-opacity="0.25"/>
      <line x1="8" y1="4" x2="12" y2="8"/>
      <line x1="16" y1="4" x2="12" y2="8"/>
      <circle cx="12" cy="13" r="2.5" fill="${color}"/>
    </svg>
  `,

  // 19. Sleek Play Arrow (▶)
  play: (size = 16, color = "currentColor") => `
    <svg class="svg-icon svg-play" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon points="6,3 20,12 6,21" fill="${color}"/>
    </svg>
  `,

  // 20. Circular Tomoe Reset / Retry (🔄 / ⟲)
  retry: (size = 16, color = "currentColor") => `
    <svg class="svg-icon svg-retry" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
    </svg>
  `,

  // 21. Wardrobe (Kimono / Haori / 👘)
  wardrobe: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2.5L6 6.5v4l3.5-1.5v12h5V9l3.5 1.5v-4L12 2.5z"/>
      <path d="M9.5 5.5l2.5 3.5 2.5-3.5"/>
      <path d="M9.5 13h5"/>
      <path d="M10.5 15.5h3"/>
    </svg>
  `,

  // 22. Camera (Credits / 🎥)
  camera: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 8a2 2 0 0 1 2-2h3.5L9 3.5h6l1.5 2.5H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
      <circle cx="12" cy="13" r="4.2" stroke-width="1.8"/>
      <circle cx="12" cy="13" r="1.5" fill="${color}"/>
      <circle cx="18" cy="8.5" r="0.8" fill="${color}"/>
    </svg>
  `,

  // 23. Camera Swivel (Orbit Left & Right)
  camRotateLeft: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 2.6-6.4L2 9"/>
      <path d="M2 3v6h6"/>
    </svg>
  `,

  camRotateRight: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-2.6-6.4L22 9"/>
      <path d="M22 3v6h-6"/>
    </svg>
  `,

  // 24. Music (BGM On / Off)
  musicOn: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3" fill="${color}" fill-opacity="0.3"/>
      <circle cx="18" cy="16" r="3" fill="${color}" fill-opacity="0.3"/>
    </svg>
  `,

  musicOff: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
      <line x1="2" y1="2" x2="22" y2="22" stroke-width="2.2" stroke="#ff4757"/>
    </svg>
  `,

  // 25. Sound SFX (On / Off)
  soundOn: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="${color}" fill-opacity="0.25"/>
      <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
      <path d="M19 5a9.5 9.5 0 0 1 0 14"/>
    </svg>
  `,

  soundOff: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15" stroke-width="2.2" stroke="#ff4757"/>
      <line x1="17" y1="9" x2="23" y2="15" stroke-width="2.2" stroke="#ff4757"/>
    </svg>
  `,

  // 26. Help / Omamori (?)
  help: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill="${color}"/>
    </svg>
  `,

  // 27. Menu / Torii Drawer (☰)
  menu: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  `,

  // Settings Gear (⚙️)
  gear: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  `,

  // Mobile Haptic Feedback (📳)
  haptic: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2.5"/>
      <line x1="10" y1="18" x2="14" y2="18"/>
      <path d="M1 9c1 1.5 1 4.5 0 6"/>
      <path d="M23 9c-1 1.5-1 4.5 0 6"/>
    </svg>
  `,

  // Checkmark (✓)
  check: (size = 16, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  `,

  // Close Cross (✕)
  close: (size = 16, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `,

  // Victory Celebration Emblem (replaces 🌸✨📦)
  victoryEmblem: (size = 54) => `
    <svg class="svg-icon victory-emblem-svg" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" style="filter: drop-shadow(0 0 16px rgba(255, 77, 109, 0.7));" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="url(#victoryGlowGrad)" stroke="#ff4d6d" stroke-width="2"/>
      <!-- Background Sakura Petals -->
      <path d="M24 6c-2 4-5 6-9 7 4 1 6 4 7 9 2-5 5-7 9-8-4-1-6-4-7-8z" fill="#ff70a6" opacity="0.65"/>
      <path d="M24 42c-2-4-5-6-9-7 4-1 6-4 7-9 2 5 5 7 9 8-4 1-6 4-7 8z" fill="#ff70a6" opacity="0.65"/>
      <!-- Central Furoshiki Package -->
      <rect x="14" y="18" width="20" height="15" rx="3" fill="#ffbe0b" stroke="#ffffff" stroke-width="1.8"/>
      <line x1="14" y1="25" x2="34" y2="25" stroke="#ffffff" stroke-width="1.5"/>
      <line x1="24" y1="18" x2="24" y2="33" stroke="#ffffff" stroke-width="1.5"/>
      <!-- Top Ribbon Knot -->
      <path d="M24 18c-3-4-8-4-8 0s8 4 8 0z" fill="#ff4d6d"/>
      <path d="M24 18c3-4 8-4 8 0s-8 4-8 0z" fill="#ff4d6d"/>
      <circle cx="24" cy="18" r="2.2" fill="#ffffff"/>
      <!-- Floating Sparkles -->
      <polygon points="10,12 11.5,15.5 15,17 11.5,18.5 10,22 8.5,18.5 5,17 8.5,15.5" fill="#ffbe0b"/>
      <polygon points="38,10 39.5,13.5 43,15 39.5,16.5 38,20 36.5,16.5 33,15 36.5,13.5" fill="#00f5ff"/>
      <defs>
        <radialGradient id="victoryGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff4d6d" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#0b1329" stop-opacity="0.85"/>
        </radialGradient>
      </defs>
    </svg>
  `,

  // 28. Gameplay Commands
  cmdForward: (size = 18, color = "currentColor") => `
    <svg class="svg-icon cmd-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5"/>
      <polyline points="5 12 12 5 19 12"/>
    </svg>
  `,

  cmdLeft: (size = 18, color = "currentColor") => `
    <svg class="svg-icon cmd-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 14L4 9l5-5"/>
      <path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
    </svg>
  `,

  cmdRight: (size = 18, color = "currentColor") => `
    <svg class="svg-icon cmd-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 14l5-5-5-5"/>
      <path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
    </svg>
  `,

  cmdAction: (size = 18, color = "currentColor") => `
    <svg class="svg-icon cmd-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C7.5 2 4 5.6 4 10c0 4 2.8 7.3 6.6 8.1-.5-1.1-.6-2.4-.2-3.6.5-1.5 1.7-2.6 3.2-3.1 2.3-.7 4.4.9 4.4 3.1 0 1.2-.5 2.3-1.4 3.1 3.2-1.3 5.4-4.4 5.4-8 0-5.3-4.5-9.6-10-9.6z" fill="${color}"/>
      <circle cx="10" cy="8.5" r="2.2" fill="#070d18"/>
    </svg>
  `,

  // 29. Kitsune Portal
  portal: (size = 20, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <path d="M12 2a10 10 0 0 1 10 10 8 8 0 0 1-8 8 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 1 2 2"/>
      <circle cx="12" cy="12" r="1.5" fill="${color}"/>
    </svg>
  `,

  // 30. Japanese Kami Skins Emblems
  skinShiroUsagi: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M8 9.5V3.5a2 2 0 0 1 4 0V9.5"/>
      <path d="M14 9.5V4.5a1.8 1.8 0 0 1 3.5.5V9.5"/>
      <rect x="4" y="9.5" width="16" height="11.5" rx="5.5" fill="${color}" fill-opacity="0.15"/>
      <path d="M7 14.5h10" stroke-width="2.2" stroke="${color}"/>
      <circle cx="9.5" cy="14.5" r="1" fill="#fff"/>
      <circle cx="14.5" cy="14.5" r="1" fill="#fff"/>
    </svg>
  `,

  skinSakuraKitsune: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4.5 11L7 3l4 6"/>
      <path d="M19.5 11L17 3l-4 6"/>
      <path d="M5 11c0 5 7 10 7 10s7-5 7-10" fill="${color}" fill-opacity="0.15"/>
      <path d="M8 12.5c1-.8 2.5-.8 3.5 0"/>
      <path d="M12.5 12.5c1-.8 2.5-.8 3.5 0"/>
      <circle cx="12" cy="7.5" r="1.5" fill="${color}"/>
    </svg>
  `,

  skinNeoTokyo: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="6" y1="9" x2="4" y2="3"/>
      <rect x="2.5" y="1.5" width="3" height="3" fill="${color}"/>
      <line x1="18" y1="9" x2="20" y2="3"/>
      <rect x="18.5" y="1.5" width="3" height="3" fill="${color}"/>
      <rect x="4" y="9" width="16" height="12" rx="3" fill="${color}" fill-opacity="0.2"/>
      <rect x="6" y="12" width="12" height="4" rx="1.5" fill="${color}"/>
      <line x1="8" y1="14" x2="16" y2="14" stroke="#070e1a" stroke-width="1.5"/>
      <circle cx="12" cy="18.5" r="1" fill="${color}"/>
    </svg>
  `,

  skinAkumaOni: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M7 10C6 7 4 4.5 3 3c2.5 1 5 3.5 6 7"/>
      <path d="M17 10C18 7 20 4.5 21 3c-2.5 1-5 3.5-6 7"/>
      <path d="M6 10c0 6 6 11 6 11s6-5 6-11" fill="${color}" fill-opacity="0.2"/>
      <path d="M7.5 12l3 1.5"/>
      <path d="M16.5 12l-3 1.5"/>
      <circle cx="9" cy="14.5" r="1.3" fill="${color}"/>
      <circle cx="15" cy="14.5" r="1.3" fill="${color}"/>
      <path d="M10 18l1-2 1 2"/>
    </svg>
  `,

  skinTsukuyomi: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14.5 2a5.5 5.5 0 1 0 0 9 4.2 4.2 0 0 1 0-9z" fill="${color}"/>
      <path d="M4 11c0-4 3.5-7 8-7s8 3 8 7v6c0 2-2 4-8 4s-8-2-8-4v-6z" fill="${color}" fill-opacity="0.2"/>
      <path d="M7 13.5h10" stroke-width="2.5" stroke="#070e1a"/>
      <circle cx="9.5" cy="13.5" r="1" fill="${color}"/>
      <circle cx="14.5" cy="13.5" r="1" fill="${color}"/>
    </svg>
  `,

  skinGoldKami: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 5c5-1.5 13-1.5 18 0"/>
      <line x1="5" y1="7.5" x2="19" y2="7.5"/>
      <circle cx="6" cy="4" r="1.2" fill="${color}"/>
      <circle cx="12" cy="2.5" r="1.5" fill="${color}"/>
      <circle cx="18" cy="4" r="1.2" fill="${color}"/>
      <path d="M9 10V6.5a1.5 1.5 0 0 1 3 0V10"/>
      <path d="M12 10V6.5a1.5 1.5 0 0 1 3 0V10"/>
      <circle cx="12" cy="15" r="6" fill="${color}" fill-opacity="0.25"/>
      <circle cx="10" cy="14.5" r="1.2" fill="#00f5d4"/>
      <circle cx="14" cy="14.5" r="1.2" fill="#00f5d4"/>
      <path d="M11 17.5c.6.5 1.4.5 2 0"/>
    </svg>
  `,

  // Lock / Unlock icons (🔒 / 🔓)
  lock: (size = 14, color = "currentColor") => `
    <svg class="svg-icon svg-lock" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  `,

  unlock: (size = 14, color = "currentColor") => `
    <svg class="svg-icon svg-unlock" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  `,

  skinRyujinDragon: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14c2-4 6-6 10-4 3 1.5 5 5 4 8-1 3-5 3-7 1"/>
      <path d="M12 4l3 3m-1-4l4 2"/>
      <circle cx="16" cy="8" r="1.5" fill="${color}"/>
      <path d="M7 17l-3 3m1-4l-3 2"/>
    </svg>
  `,

  // Helper to fetch skin SVG by id
  getSkinIcon: (skinId, size = 24, color = "currentColor") => {
    switch (skinId) {
      case "original": return KOMA_ICONS.skinShiroUsagi(size, color);
      case "sakura": return KOMA_ICONS.skinSakuraKitsune(size, color);
      case "cyber": return KOMA_ICONS.skinNeoTokyo(size, color);
      case "oni": return KOMA_ICONS.skinAkumaOni(size, color);
      case "shinobi": return KOMA_ICONS.skinTsukuyomi(size, color);
      case "kami": return KOMA_ICONS.skinGoldKami(size, color);
      case "ryujin": return KOMA_ICONS.skinRyujinDragon(size, color);
      default: return KOMA_ICONS.skinShiroUsagi(size, color);
    }
  },

  // 29. Fragile Cracking Stepping Stone Tile
  fragileTile: (size = 20, color = "currentColor") => `
    <svg class="svg-icon svg-fragile" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke-width="1.8" fill="${color}" fill-opacity="0.12"/>
      <path d="M7 5l4 6-3 3 5 5" stroke="${color}" stroke-width="2"/>
      <path d="M17 5l-4 6 2 3-3 5" stroke="${color}" stroke-width="1.6" stroke-dasharray="2 2"/>
    </svg>
  `,

  // 30. Sacred Pushable Stone Boulder with Shimenawa Rope
  shrineBlock: (size = 20, color = "currentColor") => `
    <svg class="svg-icon svg-shrine-block" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke-width="1.8" fill="${color}" fill-opacity="0.18"/>
      <path d="M3 12h18" stroke-width="2" stroke="${color}"/>
      <path d="M8 12v4l2-2 2 2v-4" fill="${color}" fill-opacity="0.5" stroke-width="1.4"/>
      <path d="M14 12v4l2-2 2 2v-4" fill="${color}" fill-opacity="0.5" stroke-width="1.4"/>
      <circle cx="12" cy="7.5" r="1.5" fill="${color}"/>
    </svg>
  `,

  // 31. Sacred Japanese Pagoda (100-Level Tower Trial)
  pagoda: (size = 18, color = "currentColor", glow = false) => `
    <svg class="svg-icon svg-pagoda" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-linecap="round" stroke-linejoin="round" style="${glow ? 'filter: drop-shadow(0 0 6px rgba(0, 240, 255, 0.6));' : ''}" aria-hidden="true">
      <path d="M12 2v2.5M10.5 4.5h3" stroke-width="1.8"/>
      <path d="M5.5 8c2-1 11-1 13 0l-1.5-3H7L5.5 8z" fill="${color}" fill-opacity="0.25" stroke-width="1.6"/>
      <line x1="8.5" y1="8" x2="8.5" y2="12" stroke-width="1.6"/>
      <line x1="15.5" y1="8" x2="15.5" y2="12" stroke-width="1.6"/>
      <path d="M3.5 13.5c2.5-1 13.5-1 17 0l-2-2H5.5l-2 2z" fill="${color}" fill-opacity="0.3" stroke-width="1.6"/>
      <line x1="7.5" y1="13.5" x2="7.5" y2="18.5" stroke-width="1.6"/>
      <line x1="16.5" y1="13.5" x2="16.5" y2="18.5" stroke-width="1.6"/>
      <path d="M2 20.5c3.5-1 16.5-1 20 0l-2-2H4l-2 2z" fill="${color}" fill-opacity="0.35" stroke-width="1.8"/>
      <rect x="10.5" y="15" width="3" height="4" rx="0.5" fill="${color}" stroke="none"/>
    </svg>
  `,

  // 32. Sacred Dragon Ryūjin Emblem
  dragon: (size = 20, color = "currentColor") => `
    <svg class="svg-icon svg-dragon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 14c2-4 6-6 10-4 3 1.5 5 5 4 8-1 3-5 3-7 1"/>
      <path d="M12 4l3 3m-1-4l4 2"/>
      <circle cx="16" cy="8" r="1.5" fill="${color}"/>
      <path d="M7 17l-3 3m1-4l-3 2"/>
      <path d="M14 11c1-1 3-1 4 0"/>
    </svg>
  `,

  // 33. Sacred Shinto Magatama Jewel / Boss Relic
  relic: (size = 18, color = "currentColor", lit = true) => `
    <svg class="svg-icon svg-relic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="${lit ? 'filter: drop-shadow(0 0 8px rgba(217, 70, 239, 0.7));' : 'opacity:0.35;'}" aria-hidden="true">
      <path d="M12 2C7 2 4 5.5 4 10c0 5 3.5 10 9 10 4.5 0 7-3.5 7-7.5 0-5.5-3.5-10.5-8-10.5z" fill="${color}" fill-opacity="${lit ? '0.4' : '0.1'}" stroke="${color}" stroke-width="1.8"/>
      <circle cx="11" cy="7.5" r="2" fill="${color}"/>
    </svg>
  `,

  // 34. Language Globe Vector
  globe: (size = 16, color = "currentColor") => `
    <svg class="svg-icon svg-globe" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  `,

  // 35. Smartphone Vector
  phone: (size = 16, color = "currentColor") => `
    <svg class="svg-icon svg-phone" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="2.5"/>
      <line x1="10" y1="18" x2="14" y2="18"/>
    </svg>
  `,

  // Generic icon helper
  render: (name, size = 18, color = "currentColor", ...args) => {
    if (typeof KOMA_ICONS[name] === "function") {
      return KOMA_ICONS[name](size, color, ...args);
    }
    return "";
  }
};

if (typeof window !== "undefined") {
  window.KOMA_ICONS = KOMA_ICONS;
}


