/**
 * KOMA: Spirit Delivery - Custom Japanese SVG Icon System
 * Handcrafted vector icons replacing emojis with sharp, CSS-styleable, glowing SVG assets.
 */

const KOMA_ICONS = {
  // 1. Origami Stars
  starFilled: (size = 18, color = "currentColor", glow = true) => `
    <svg class="svg-icon star-icon-svg filled" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" style="${glow ? 'filter: drop-shadow(0 0 6px var(--gold-glow));' : ''}" aria-hidden="true">
      <polygon points="12,1.5 15.2,8.2 22.5,9.2 17.2,14.4 18.5,21.7 12,18.2 5.5,21.7 6.8,14.4 1.5,9.2 8.8,8.2" fill="${color}"/>
      <polygon points="12,4.8 13.9,9.2 18.7,9.9 15.2,13.4 16,18.1 12,15.8 8,18.1 8.8,13.4 5.3,9.9 10.1,9.2" fill="#ffffff" opacity="0.38"/>
    </svg>
  `,

  starEmpty: (size = 18, color = "currentColor") => `
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

  // 2. Wardrobe (Kimono / Haori)
  wardrobe: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2.5L6 6.5v4l3.5-1.5v12h5V9l3.5 1.5v-4L12 2.5z"/>
      <path d="M9.5 5.5l2.5 3.5 2.5-3.5"/>
      <path d="M9.5 13h5"/>
      <path d="M10.5 15.5h3"/>
    </svg>
  `,

  // 3. Camera (Credits)
  camera: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 8a2 2 0 0 1 2-2h3.5L9 3.5h6l1.5 2.5H20a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8z"/>
      <circle cx="12" cy="13" r="4.2" stroke-width="1.8"/>
      <circle cx="12" cy="13" r="1.5" fill="${color}"/>
      <circle cx="18" cy="8.5" r="0.8" fill="${color}"/>
    </svg>
  `,

  // 4. Camera Swivel (Orbit Left & Right)
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

  // 5. Camera Center Reset (Viewfinder Target)
  camReset: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9"/>
      <line x1="12" y1="3" x2="12" y2="7"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <line x1="3" y1="12" x2="7" y2="12"/>
      <line x1="17" y1="12" x2="21" y2="12"/>
      <circle cx="12" cy="12" r="2.2" fill="${color}"/>
    </svg>
  `,

  // 6. Music (BGM On / Off)
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

  // 7. Sound SFX (On / Off)
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

  // 8. Help / Omamori
  help: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <circle cx="12" cy="17" r="0.8" fill="${color}"/>
    </svg>
  `,

  // 9. Menu / Torii Drawer
  menu: (size = 18, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  `,

  // 10. Gameplay Commands
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

  // 11. Torii Gate Emblem
  torii: (size = 24, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 5c6-1.5 14-1.5 20 0"/>
      <line x1="4" y1="8" x2="20" y2="8"/>
      <line x1="7" y1="8" x2="6" y2="21"/>
      <line x1="17" y1="8" x2="18" y2="21"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
    </svg>
  `,

  // 12. Kitsune Portal
  portal: (size = 20, color = "currentColor") => `
    <svg class="svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
      <path d="M12 2a10 10 0 0 1 10 10 8 8 0 0 1-8 8 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 1 2 2"/>
      <circle cx="12" cy="12" r="1.5" fill="${color}"/>
    </svg>
  `,

  // 13. Japanese Kami Skins Emblems
  // (a) Shiro Usagi (白兎) - KOMA Original Shinto Porcelain Bunny
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

  // (b) Sakura Kitsune (桜狐) - Cherry Blossom Kitsune Fox
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

  // (c) Neo Tokyo 2099 (電脳) - Akihabara Cyber Courier
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

  // (d) Akuma Oni (鬼神) - Mountain Demon Guardian
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

  // (e) Tsukuyomi Shinobi (月読) - Moon Shadow Astral Kitsune
  skinTsukuyomi: (size = 24, color = "currentColor") => `
    <svg class="svg-icon skin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14.5 2a5.5 5.5 0 1 0 0 9 4.2 4.2 0 0 1 0-9z" fill="${color}"/>
      <path d="M4 11c0-4 3.5-7 8-7s8 3 8 7v6c0 2-2 4-8 4s-8-2-8-4v-6z" fill="${color}" fill-opacity="0.2"/>
      <path d="M7 13.5h10" stroke-width="2.5" stroke="#070e1a"/>
      <circle cx="9.5" cy="13.5" r="1" fill="${color}"/>
      <circle cx="14.5" cy="13.5" r="1" fill="${color}"/>
    </svg>
  `,

  // (f) Gold Kami (黄金神) - Sacred Celestial Shrine Guardian
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

  // Helper to fetch skin SVG by id
  getSkinIcon: (skinId, size = 24, color = "currentColor") => {
    switch (skinId) {
      case "original": return KOMA_ICONS.skinShiroUsagi(size, color);
      case "sakura": return KOMA_ICONS.skinSakuraKitsune(size, color);
      case "cyber": return KOMA_ICONS.skinNeoTokyo(size, color);
      case "oni": return KOMA_ICONS.skinAkumaOni(size, color);
      case "shinobi": return KOMA_ICONS.skinTsukuyomi(size, color);
      case "kami": return KOMA_ICONS.skinGoldKami(size, color);
      default: return KOMA_ICONS.skinShiroUsagi(size, color);
    }
  }
};

if (typeof window !== "undefined") {
  window.KOMA_ICONS = KOMA_ICONS;
}

