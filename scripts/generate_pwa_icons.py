#!/usr/bin/env python3
"""
Generates high-resolution PWA icons for KOMA: Spirit Delivery.
Generates 512x512, 192x192, and maskable PNG icons using pure Python standard library.
"""

import os
import math
import struct
import zlib

def write_png(filename, width, height, rgba_data):
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter type 0
        raw.extend(rgba_data[y * width * 4 : (y + 1) * width * 4])
    
    compressed = zlib.compress(bytes(raw), level=9)
    
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", compressed) + chunk(b"IEND", b"")
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "wb") as f:
        f.write(png)

def create_koma_icon(size=512, is_maskable=False):
    buf = bytearray(size * size * 4)
    scale = size / 512.0
    
    # Safe zone factor for maskable icon
    content_scale = 0.82 if is_maskable else 1.0

    cx = size / 2.0
    cy = size / 2.0

    for py in range(size):
        for px in range(size):
            nx = (px - cx) / (cx * content_scale)
            ny = (py - cy) / (cy * content_scale)
            dist_center = math.hypot(nx, ny)

            # 1. Background: Dark Midnight Cyber-Shinto Vignette
            dist_sq = nx * nx + ny * ny
            bg_lerp = min(1.0, math.sqrt(dist_sq) * 0.9)
            # Center #0f1c30 -> Edge #050912
            r = int(15 * (1 - bg_lerp) + 5 * bg_lerp)
            g = int(28 * (1 - bg_lerp) + 9 * bg_lerp)
            b = int(48 * (1 - bg_lerp) + 18 * bg_lerp)
            a = 255

            # 2. Glowing Golden Shinto Halo Ring (radius ~ 0.72)
            halo_dist = abs(dist_center - 0.70)
            if halo_dist < 0.12:
                intensity = math.exp(-halo_dist * halo_dist / 0.0035) * 0.75
                # Gold/Cyan blend
                r = min(255, int(r + 255 * intensity * 0.85))
                g = min(255, int(g + 215 * intensity * 0.75))
                b = min(255, int(b + 70 * intensity * 0.4 + 180 * intensity * 0.2))

            # 3. Torii Gate in Background
            # Top Beam (horizontal curve)
            if -0.68 < ny < -0.56 and abs(nx) < 0.65:
                # Vermilion Shinto Red
                r = int(220 * 0.85 + r * 0.15)
                g = int(45 * 0.85 + g * 0.15)
                b = int(45 * 0.85 + b * 0.15)
            # Secondary Beam
            elif -0.52 < ny < -0.45 and abs(nx) < 0.52:
                r = int(200 * 0.85 + r * 0.15)
                g = int(40 * 0.85 + g * 0.15)
                b = int(40 * 0.85 + b * 0.15)
            # Pillars (left & right)
            elif -0.60 < ny < 0.62 and (abs(nx - 0.38) < 0.05 or abs(nx + 0.38) < 0.05):
                r = int(190 * 0.8 + r * 0.2)
                g = int(35 * 0.8 + g * 0.2)
                b = int(35 * 0.8 + b * 0.2)

            # 4. KOMA Spirit Rabbit Character
            # Rabbit Ear (top-left angled)
            # Line segment from (-0.14, -0.05) to (-0.24, -0.42)
            ear_dx = nx - (-0.14)
            ear_dy = ny - (-0.05)
            # Project onto ear axis (-0.26, -0.96)
            proj = ear_dx * (-0.26) + ear_dy * (-0.96)
            if 0.0 < proj < 0.38:
                perp = abs(ear_dx * (-0.96) - ear_dy * (0.26))
                if perp < 0.065 * (1.0 - proj * 0.45):
                    # Ear tip glowing cyan
                    if proj > 0.30:
                        r, g, b = 0, 245, 255
                    else:
                        r, g, b = 245, 248, 252

            # Main Body Sphere: center (0, 0.08), radius 0.36
            body_dx = nx
            body_dy = ny - 0.08
            body_dist = math.hypot(body_dx, body_dy)

            if body_dist < 0.36:
                # 3D shading light from top-left (-0.3, -0.4)
                nx3d = body_dx / 0.36
                ny3d = body_dy / 0.36
                nz3d = math.sqrt(max(0.0, 1.0 - nx3d * nx3d - ny3d * ny3d))
                diff = max(0.0, -nx3d * 0.35 - ny3d * 0.5 + nz3d * 0.78)
                spec = math.pow(max(0.0, -nx3d * 0.35 - ny3d * 0.5 + nz3d * 0.78), 12) * 0.45

                # Porcelain White Shading
                r = min(255, int(245 * (0.55 + 0.45 * diff) + 255 * spec))
                g = min(255, int(248 * (0.55 + 0.45 * diff) + 255 * spec))
                b = min(255, int(252 * (0.55 + 0.45 * diff) + 255 * spec))

                # Dark Visor Screen (center (0, 0.08), oval width 0.28, height 0.18)
                v_dx = body_dx / 0.26
                v_dy = (body_dy - 0.02) / 0.16
                v_dist = math.hypot(v_dx, v_dy)
                if v_dist < 1.0:
                    # Sleek obsidian visor
                    vr = int(10 + 20 * (1 - v_dist))
                    vg = int(18 + 25 * (1 - v_dist))
                    vb = int(32 + 35 * (1 - v_dist))
                    r, g, b = vr, vg, vb

                    # Glowing Visor Eyes (two pill/oval lights)
                    # Left Eye: (-0.10, 0.08), Right Eye: (0.10, 0.08)
                    for eye_x in (-0.095, 0.095):
                        e_dx = (body_dx - eye_x) / 0.038
                        e_dy = (body_dy - 0.02) / 0.065
                        e_dist = math.hypot(e_dx, e_dy)
                        if e_dist < 1.0:
                            # Cyan glow #00f5ff with white core
                            glow_p = 1.0 - e_dist
                            r = int(0 * (1 - glow_p) + 255 * glow_p)
                            g = int(245 * (1 - glow_p * 0.2) + 255 * glow_p * 0.2)
                            b = 255

            # Delivery Backpack (brown wooden furoshiki pack with glowing cyan ribbon)
            if 0.18 < ny < 0.42 and abs(nx) < 0.18:
                if body_dist >= 0.34:
                    # Pack wood
                    r = 180
                    g = 115
                    b = 65
                    # Cyan strap in middle
                    if abs(nx) < 0.03:
                        r, g, b = 0, 245, 255

            # 5. Floating Sakura Petals
            for px_c, py_c, r_c, angle in [
                (0.38, -0.22, 0.05, 0.4),
                (-0.35, 0.32, 0.045, -0.5),
                (0.28, 0.42, 0.04, 0.8)
            ]:
                p_dx = nx - px_c
                p_dy = ny - py_c
                # Rotated coordinates
                cos_a = math.cos(angle)
                sin_a = math.sin(angle)
                rx = p_dx * cos_a - p_dy * sin_a
                ry = p_dx * sin_a + p_dy * cos_a
                if (rx * rx) / (r_c * r_c) + (ry * ry) / ((r_c * 0.4) * (r_c * 0.4)) < 1.0:
                    r = 255
                    g = 140
                    b = 185

            # 6. Firefly Glow Motes
            for fx_c, fy_c in [(-0.32, -0.38), (0.35, 0.12), (-0.25, 0.52)]:
                f_dist = math.hypot(nx - fx_c, ny - fy_c)
                if f_dist < 0.07:
                    intensity = math.exp(-f_dist * f_dist / 0.001)
                    r = min(255, int(r + 255 * intensity))
                    g = min(255, int(g + 245 * intensity))
                    b = min(255, int(b + 120 * intensity * 0.4))

            idx = (py * size + px) * 4
            buf[idx + 0] = r
            buf[idx + 1] = g
            buf[idx + 2] = b
            buf[idx + 3] = a

    return buf

def generate_all_icons():
    print("Generating 512x512 standard PWA icon...")
    icon512 = create_koma_icon(512, is_maskable=False)
    write_png("icons/icon-512.png", 512, 512, icon512)

    print("Generating 512x512 maskable PWA icon...")
    icon512_maskable = create_koma_icon(512, is_maskable=True)
    write_png("icons/icon-maskable.png", 512, 512, icon512_maskable)

    print("Generating 192x192 standard PWA icon...")
    icon192 = create_koma_icon(192, is_maskable=False)
    write_png("icons/icon-192.png", 192, 192, icon192)

    print("Generating 180x180 Apple touch icon...")
    icon180 = create_koma_icon(180, is_maskable=False)
    write_png("icons/apple-touch-icon.png", 180, 180, icon180)

    print("Writing scalable SVG favicon...")
    svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f1f38"/>
      <stop offset="100%" stop-color="#050811"/>
    </radialGradient>
    <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="50%" stop-color="#00f5ff"/>
      <stop offset="100%" stop-color="#00f5ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="128" height="128" rx="28" fill="url(#bg)"/>
  <!-- Torii Ring -->
  <circle cx="64" cy="64" r="48" fill="none" stroke="#ffd700" stroke-width="2.5" opacity="0.45" filter="url(#glow)"/>
  <!-- Torii Beam -->
  <path d="M28 32 C48 28 80 28 100 32" stroke="#e63946" stroke-width="6" stroke-linecap="round" fill="none"/>
  <line x1="36" y1="38" x2="92" y2="38" stroke="#e63946" stroke-width="4"/>
  <line x1="44" y1="38" x2="44" y2="100" stroke="#e63946" stroke-width="4.5"/>
  <line x1="84" y1="38" x2="84" y2="100" stroke="#e63946" stroke-width="4.5"/>
  <!-- KOMA Rabbit Ear -->
  <g transform="translate(50, 48) rotate(-16)">
    <path d="M0 0 L-6 -22 C-6 -28 6 -28 6 -22 Z" fill="#f8fafc"/>
    <circle cx="0" cy="-22" r="3" fill="#00f5ff" filter="url(#glow)"/>
  </g>
  <!-- KOMA Body -->
  <circle cx="64" cy="74" r="28" fill="#f8fafc" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.5))"/>
  <!-- Visor -->
  <ellipse cx="64" cy="75" rx="19" ry="13" fill="#070c14"/>
  <!-- Glowing Eyes -->
  <ellipse cx="56" cy="75" rx="3.5" ry="5.5" fill="#00f5ff" filter="url(#glow)"/>
  <ellipse cx="72" cy="75" rx="3.5" ry="5.5" fill="#00f5ff" filter="url(#glow)"/>
  <!-- Sakura Petal -->
  <path d="M96 46 C104 42 108 52 102 58 C96 62 90 56 96 46 Z" fill="#ff85b8" opacity="0.85"/>
  <!-- Firefly Mote -->
  <circle cx="34" cy="88" r="3" fill="#ffd700" filter="url(#glow)"/>
</svg>'''
    with open("icons/favicon.svg", "w", encoding="utf-8") as f:
        f.write(svg_icon)

    print("All PWA icons generated successfully!")

if __name__ == "__main__":
    generate_all_icons()
