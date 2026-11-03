// ─────────────────────────────────────────────────────────────
//  HIER passt du alle Auswahlmöglichkeiten an – gilt für alle Entwürfe.
//  Neue Option = neue Zeile in der Liste. Reihenfolge = Anzeige-Reihenfolge.
//  Vorausgewählt ist jeweils die erste Option (bei Größen die zweite).
// ─────────────────────────────────────────────────────────────
const CONFIG = {
  brand: 'Squeez-It',

  sizes: [
    // cm = Durchmesser, scale = wie groß die Vorschau gezeichnet wird (1 = volle Größe)
    { name: 'S', cm: 5,   scale: 0.72 },
    { name: 'M', cm: 6.5, scale: 0.86 },
    { name: 'L', cm: 8,   scale: 1 },
  ],

  // Füllung in der klaren Silikonhülle. mix = optionale zweite Farbe, die sich einmischt (marmoriert)
  fillings: [
    { name: 'Mint',       hex: '#4fc8a8' },
    { name: 'Türkis',     hex: '#2f9fcf' },
    { name: 'Lila',       hex: '#8a6ad8' },
    { name: 'Rosa',       hex: '#ec8cc0' },
    { name: 'Pink-Weiß',  hex: '#d95fa8', mix: '#f6eef6' },
    { name: 'Lila-Blau',  hex: '#8d6ad6', mix: '#4fa3e0' },
    { name: 'Mint-Blau',  hex: '#4fc8a8', mix: '#3a8fd8' },
  ],

  shapes: [
    // path = SVG-Umriss in einem 200×200-Feld
    { name: 'Kugel',  path: 'M20 100a80 80 0 1 0 160 0a80 80 0 1 0-160 0Z' },
    { name: 'Herz',   path: 'M100 172C46 136 18 104 22 70 26 40 52 26 74 28 88 30 96 40 100 52 104 40 112 30 126 28 148 26 174 40 178 70 182 104 154 136 100 172Z' },
    { name: 'Stern',  path: 'M100 20L123.5 72.6 180.8 78.7 138 117.4 150 173.8 100 145 50 173.8 62 117.4 19.2 78.7 76.5 72.6Z' },
    { name: 'Würfel', path: 'M50 25h100a25 25 0 0 1 25 25v100a25 25 0 0 1-25 25H50a25 25 0 0 1-25-25V50a25 25 0 0 1 25-25Z' },
  ],

  quantity: { min: 1, max: 50 }, // Stückzahl pro Bestellung
};
