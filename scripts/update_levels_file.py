import json

def update_levels():
    with open("js/levels.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Split at the first occurrence of Chapter 6 / Level 51
    # We know Level 50 ends with the closing of its object
    # Find "LEVELS = "
    start_idx = content.find("const LEVELS = [")
    if start_idx == -1:
        print("Error: Could not find const LEVELS = [")
        return

    # Parse JSON array: strip "const LEVELS = " and trailing ";"
    json_text = content[start_idx + len("const LEVELS = "):].strip()
    if json_text.endswith(";"):
        json_text = json_text[:-1].strip()

    all_levels = json.loads(json_text)
    print(f"Total levels currently in js/levels.js: {len(all_levels)}")

    # First 50 levels (Level 1 to 50, index 0 to 49)
    first_50 = all_levels[:50]
    print(f"Preserving first 50 levels: {len(first_50)}")

    # Load 10 newly designed & verified Fuji levels
    with open("scripts/fuji_verified.json", "r", encoding="utf-8") as f:
        fuji_10 = json.load(f)

    print(f"Appending {len(fuji_10)} new verified Fuji levels (51 to 60)")
    for i, lvl in enumerate(fuji_10, 51):
        print(f"Level {i}: {lvl['n']} ({len(lvl['solution'])} steps, limit {lvl['limit']})")

    full_60 = first_50 + fuji_10
    print(f"Total updated campaign: {len(full_60)} levels")

    header = """/**
 * KOMA: Spirit Delivery - 60 Level Campaign
 * Fully verified for puzzle depth and zero gate/portal bypasses.
 * Features Japanese Garden & Mount Fuji aesthetics: Machiya houses, Pavilions,
 * Bamboo fences, Stone walls, Sculpted pines, Sakura blossoms, Moss meadows,
 * and the Sacred Mount Fuji with snow caps and wind gusts!
 */
const LEVELS = """

    new_content = header + json.dumps(full_60, indent=2, ensure_ascii=False) + ";\n"

    with open("js/levels.js", "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Successfully wrote updated 60 levels to js/levels.js!")

if __name__ == "__main__":
    update_levels()
