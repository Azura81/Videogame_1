/**
 * KOMA: Spirit Delivery - Level Definitions
 * Preserves all 10 original levels, metadata, coordinates, and command limits.
 */
const LEVELS = [
  {
    n: "Die erste Lieferung",
    c: "Kapitel 01 · Laternenviertel",
    t: "Tutorial",
    d: "Fahre zuerst geradeaus durch die Gasse und biege dann nach Süden zum Paket ab. Mit sechs Befehlen kommst du ans Ziel.",
    w: 5,
    h: 5,
    s: [0, 0, "E"],
    g: [4, 1],
    walls: [[1, 1], [1, 2], [3, 2], [3, 3]],
    limit: 8
  },
  {
    n: "Um die Ecke",
    c: "Kapitel 01 · Laternenviertel",
    t: "Weg finden",
    d: "Die Mauer versperrt den mittleren Weg. Fahre nach Norden bis zur oberen Gasse und dann nach Osten zum Paket. Du hast genau acht Befehle.",
    w: 5,
    h: 5,
    s: [0, 2, "E"],
    g: [4, 0],
    walls: [[2, 1], [2, 2], [2, 3]],
    limit: 8
  },
  {
    n: "Das Tor des Schreins",
    c: "Kapitel 02 · Alter Schrein",
    t: "Schalter",
    d: "Aktiviere den mintfarbenen Schalter mit ✦. Danach öffnet sich das violette Tor.",
    w: 6,
    h: 6,
    s: [5, 4, "W"],
    g: [3, 0],
    walls: [
      [0, 0], [1, 0], [2, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [4, 1], [5, 1],
      [0, 2], [1, 2], [2, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [2, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [2, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    sw: [[3, 3]],
    gate: [[3, 1]],
    limit: 8
  },
  {
    n: "Der kleine Umweg",
    c: "Kapitel 02 · Alter Schrein",
    t: "Planen",
    d: "Ein längerer Korridor zwingt dich zu einem Richtungswechsel. Aktiviere unterwegs den Schalter, bevor du das Tor erreichst.",
    w: 6,
    h: 6,
    s: [1, 0, "S"],
    g: [3, 5],
    walls: [
      [0, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [0, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [0, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [2, 4], [3, 4], [4, 4], [5, 4],
      [0, 5], [4, 5], [5, 5]
    ],
    sw: [[1, 2]],
    gate: [[1, 4]],
    limit: 9
  },
  {
    n: "Zwei Schritte voraus",
    c: "Kapitel 02 · Alter Schrein",
    t: "Kombination",
    d: "Plane eine längere Strecke mit mehreren Abschnitten. Der Schalter muss vor dem Tor aktiviert werden.",
    w: 6,
    h: 6,
    s: [4, 3, "S"],
    g: [0, 2],
    walls: [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [1, 3], [2, 3], [3, 3], [5, 3],
      [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    sw: [[2, 4]],
    gate: [[0, 4]],
    limit: 10
  },
  {
    n: "Laternenlicht",
    c: "Kapitel 03 · Geistergarten",
    t: "Route lesen",
    d: "Der Weg wird länger und führt um mehrere Ecken. Achte auf die Ausrichtung von KOMA nach jeder Drehung.",
    w: 6,
    h: 6,
    s: [0, 5, "E"],
    g: [0, 1],
    walls: [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [3, 1], [4, 1], [5, 1],
      [0, 2], [1, 2], [3, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [3, 4], [4, 4], [5, 4],
      [3, 5], [4, 5], [5, 5]
    ],
    sw: [[2, 5]],
    gate: [[2, 3]],
    limit: 11
  },
  {
    n: "Der richtige Moment",
    c: "Kapitel 03 · Geistergarten",
    t: "Reihenfolge",
    d: "Jetzt brauchst du mehrere Richtungswechsel. Der Schalter liegt auf dem einzigen begehbaren Pfad.",
    w: 6,
    h: 6,
    s: [3, 2, "N"],
    g: [1, 2],
    walls: [
      [4, 0], [5, 0],
      [1, 1], [2, 1], [4, 1], [5, 1],
      [2, 2], [4, 2], [5, 2],
      [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]
    ],
    sw: [[2, 0]],
    gate: [[0, 0]],
    limit: 12
  },
  {
    n: "Geheime Gasse",
    c: "Kapitel 03 · Geistergarten",
    t: "Kombination",
    d: "Ein verwinkelter Weg verlangt vorausschauendes Planen. Öffne das Tor, bevor KOMA es erreicht.",
    w: 6,
    h: 6,
    s: [2, 1, "W"],
    g: [3, 5],
    walls: [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [3, 1], [4, 1], [5, 1],
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2],
      [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
      [4, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [4, 5], [5, 5]
    ],
    sw: [[0, 1]],
    gate: [[0, 3]],
    limit: 13
  },
  {
    n: "Fast am Ziel",
    c: "Kapitel 04 · Neon-Kyoto",
    t: "Knifflig",
    d: "Die Route ist länger und hat mehrere Ecken. Ein falsch gesetzter Drehbefehl kann den gesamten Plan stoppen.",
    w: 6,
    h: 6,
    s: [5, 2, "N"],
    g: [0, 5],
    walls: [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2],
      [0, 3], [1, 3], [2, 3], [3, 3], [5, 3],
      [0, 4], [1, 4], [2, 4], [3, 4], [5, 4],
      [5, 5]
    ],
    sw: [[4, 2]],
    gate: [[4, 4]],
    limit: 14
  },
  {
    n: "Die letzte Lieferung",
    c: "Kapitel 04 · Neon-Kyoto",
    t: "Finale",
    d: "Die Abschlussmission verbindet eine lange Route, mehrere Drehungen und die richtige Reihenfolge von Schalter und Tor.",
    w: 6,
    h: 6,
    s: [0, 4, "N"],
    g: [4, 5],
    walls: [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [0, 1], [5, 1],
      [0, 2], [2, 2], [3, 2], [5, 2],
      [2, 3], [3, 3], [5, 3],
      [1, 4], [2, 4], [3, 4], [5, 4],
      [0, 5], [1, 5], [2, 5], [3, 5], [5, 5]
    ],
    sw: [[1, 3]],
    gate: [[1, 1]],
    limit: 16
  }
];
