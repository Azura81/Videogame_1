/**
 * KOMA: Spirit Delivery - Japanese Kami Skins & Rewards System
 * Defines creative Japanese aesthetic skins unlocked by collecting stars across the 50 levels.
 */

const KOMA_SKINS = {
  original: {
    id: "original",
    name: "Shiro Usagi",
    jpName: "白兎",
    subtitle: "Original · Shinto-Bote",
    desc: "Das klassische weiße Shinto-Schrein-Chassis mit leuchtend cyanfarbenen Visor-Augen und natürlichem Furoshiki-Holzpaket.",
    starsRequired: 0,
    icon: "🐇",
    accentColor: "#00f5ff",
    tag: "Standard",
    materials: {
      body: { color: 0xf5f8fc, metalness: 0.15, roughness: 0.22 },
      visor: { color: 0x060e18, metalness: 0.8, roughness: 0.15 },
      base: { color: 0x101a2b, metalness: 0.6, roughness: 0.3 },
      eye: { color: 0x00f5ff },
      glow: { color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.9 },
      pack: { color: 0xbd7c4c, roughness: 0.6 },
      packStrap: { color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.8 },
      light: 0x00f5ff,
      dustColor: 0x98b5d5
    },
    dustType: "default",
    accessories: ["singleEar"]
  },
  sakura: {
    id: "sakura",
    name: "Sakura Kitsune",
    jpName: "桜狐",
    subtitle: "Kirschblüten-Fuchs · Geist des Frühlings",
    desc: "Vom Geist der Frühlingsschreine gesegnet. Zartes Kirschblüten-Rosa, goldene Augen, zweite Fuchsohren und aufwirbelnde Sakura-Blütenblätter.",
    starsRequired: 15,
    icon: "🌸",
    accentColor: "#ff85b8",
    tag: "15 Sterne",
    materials: {
      body: { color: 0xffe6ee, metalness: 0.18, roughness: 0.25 },
      visor: { color: 0x240f1a, metalness: 0.75, roughness: 0.15 },
      base: { color: 0x3d172a, metalness: 0.45, roughness: 0.35 },
      eye: { color: 0xffbe0b },
      glow: { color: 0xff70a6, emissive: 0xff70a6, emissiveIntensity: 1.1 },
      pack: { color: 0xff85a1, roughness: 0.5 },
      packStrap: { color: 0xffbe0b, emissive: 0xffbe0b, emissiveIntensity: 0.9 },
      light: 0xff70a6,
      dustColor: 0xffa8cc
    },
    dustType: "sakura",
    accessories: ["dualEars", "sakuraFlower"]
  },
  cyber: {
    id: "cyber",
    name: "Neo Tokyo 2099",
    jpName: "電脳",
    subtitle: "Akihabara Cyber · Neon-Kurier",
    desc: "In den Neon-Gassen von Shinjuku aufgerüstet. Tiefschwarzes Karbon-Chassis mit pulsierenden Magenta- & Cyan-Schaltkreisen und Holo-Glitches.",
    starsRequired: 35,
    icon: "⚡",
    accentColor: "#df6eff",
    tag: "35 Sterne",
    materials: {
      body: { color: 0x141923, metalness: 0.7, roughness: 0.2 },
      visor: { color: 0x020408, metalness: 0.95, roughness: 0.05 },
      base: { color: 0x0a0d14, metalness: 0.8, roughness: 0.2 },
      eye: { color: 0xdf6eff },
      glow: { color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 1.3 },
      pack: { color: 0x1e2638, metalness: 0.7, roughness: 0.3 },
      packStrap: { color: 0xdf6eff, emissive: 0xdf6eff, emissiveIntensity: 1.2 },
      light: 0xdf6eff,
      dustColor: 0x00f5ff
    },
    dustType: "cyber",
    accessories: ["dualAntenna", "cyberVisor"]
  },
  oni: {
    id: "oni",
    name: "Akuma Oni",
    jpName: "鬼神",
    subtitle: "Feuer-Wächter · Vulkan-Schrein",
    desc: "Von uralten Berggeistern geschmiedet. Traditioneller Shu-iro Zinnober-Lack, geschwungene goldene Oni-Hörner und lodernde Flammenspuren.",
    starsRequired: 65,
    icon: "👺",
    accentColor: "#ff4d4d",
    tag: "65 Sterne",
    materials: {
      body: { color: 0xba1c1c, metalness: 0.35, roughness: 0.28 },
      visor: { color: 0x1c0505, metalness: 0.7, roughness: 0.2 },
      base: { color: 0x240808, metalness: 0.5, roughness: 0.4 },
      eye: { color: 0xff9900 },
      glow: { color: 0xff3b00, emissive: 0xff3b00, emissiveIntensity: 1.2 },
      pack: { color: 0x2b130e, metalness: 0.3, roughness: 0.5 },
      packStrap: { color: 0xffa500, emissive: 0xff8800, emissiveIntensity: 1.0 },
      light: 0xff4d00,
      dustColor: 0xff7b00
    },
    dustType: "fire",
    accessories: ["oniHorns"]
  },
  shinobi: {
    id: "shinobi",
    name: "Tsukuyomi Shinobi",
    jpName: "月読",
    subtitle: "Mondschatten · Astral-Kitsune",
    desc: "Ein lautloser Schatten unter dem Vollmond. Tiefes Mitternachts-Indigo, silberne Mondsichel an der Stirn und geisterhafte violette Nebelspuren.",
    starsRequired: 100,
    icon: "🌙",
    accentColor: "#a855f7",
    tag: "100 Sterne",
    materials: {
      body: { color: 0x161329, metalness: 0.5, roughness: 0.3 },
      visor: { color: 0x080612, metalness: 0.85, roughness: 0.1 },
      base: { color: 0x0c0a18, metalness: 0.6, roughness: 0.3 },
      eye: { color: 0xd946ef },
      glow: { color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 1.1 },
      pack: { color: 0x231e3d, roughness: 0.4 },
      packStrap: { color: 0xe2e8f0, emissive: 0xc084fc, emissiveIntensity: 0.8 },
      light: 0xa855f7,
      dustColor: 0x8b5cf6
    },
    dustType: "shadow",
    accessories: ["moonCrest", "shadowEar"]
  },
  kami: {
    id: "kami",
    name: "Gold Kami",
    jpName: "黄金神",
    subtitle: "Göttlicher Schrein-Wächter · Zen-Meister",
    desc: "Die Krönung aller Lieferungen. Spiegelndes 24-Karat Goldchassis, himmlische Smaragdaugen, Torii-Heiligenschein und glitzernder Feenstaub.",
    starsRequired: 135,
    icon: "👑",
    accentColor: "#ffb703",
    tag: "135 Sterne",
    materials: {
      body: { color: 0xffd13b, metalness: 0.9, roughness: 0.15 },
      visor: { color: 0x221a02, metalness: 0.9, roughness: 0.1 },
      base: { color: 0x3b2e04, metalness: 0.85, roughness: 0.2 },
      eye: { color: 0x00f5d4 },
      glow: { color: 0xffd700, emissive: 0xffb700, emissiveIntensity: 1.4 },
      pack: { color: 0xffea79, metalness: 0.8, roughness: 0.2 },
      packStrap: { color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 1.1 },
      light: 0xffc107,
      dustColor: 0xffd700
    },
    dustType: "gold",
    accessories: ["kamiHalo", "kamiEars"]
  },
  ryujin: {
    id: "ryujin",
    name: "Ryūjin Drache",
    jpName: "龍神",
    subtitle: "Drachenbändiger · Herrscher des Fuji",
    desc: "Vom befreiten Himmelsdrachen des Fuji verliehen. Perlmutt-weißes Chassis mit kaiserlichen Drachenhörnern, schwebenden Himmelsbändern und Frost-Gleiten.",
    starsRequired: 0,
    specialUnlock: "boss_fuji",
    icon: "🐉",
    accentColor: "#00f0ff",
    tag: "Boss-Trophäe",
    materials: {
      body: { color: 0xe6f7ff, metalness: 0.55, roughness: 0.18 },
      visor: { color: 0x05131f, metalness: 0.95, roughness: 0.05 },
      base: { color: 0x0d283d, metalness: 0.75, roughness: 0.2 },
      eye: { color: 0x00f5ff },
      glow: { color: 0x00f5ff, emissive: 0x00d4ff, emissiveIntensity: 1.5 },
      pack: { color: 0x1f3a52, metalness: 0.6, roughness: 0.25 },
      packStrap: { color: 0xffd700, emissive: 0xffb700, emissiveIntensity: 1.2 },
      light: 0x00f5ff,
      dustColor: 0x70d6ff
    },
    dustType: "ice",
    accessories: ["dragonHorns", "celestialRibbon"]
  }
};

// Expose globally
if (typeof window !== "undefined") {
  window.KOMA_SKINS = KOMA_SKINS;
}
