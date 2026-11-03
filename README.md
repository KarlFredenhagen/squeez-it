# Squeez-It – Bestellseite (Entwürfe)

Reine HTML-Seiten ohne Build-Schritt. Laufen auf GitHub Pages und auf jedem Webserver.

| Datei | Inhalt |
|---|---|
| `index.html` | Übersicht der drei Entwürfe |
| `entwurf-1/` | Konfigurator – alles auf einer Seite |
| `entwurf-2/` | Schritt für Schritt – eine Frage pro Bildschirm |
| `entwurf-3/` | Knautsch-Bühne – dunkel, Ball zum Drücken |
| `config.js` | **Alle Optionen** (Größen, Schleim-Füllungen, Formen, Stückzahl, Name) |
| `shared.js` | Gemeinsame Logik (Vorschau, Prüfung der Eingaben, Absenden) |

## Optionen ändern
Nur `config.js` bearbeiten – gilt für alle drei Entwürfe. Beispiel neue Schleim-Füllung (in `fillings`):
```js
{ name: 'Türkis', hex: '#30b0c7' },
{ name: 'Silber-Glitzer', hex: '#c7c7cc', glitter: ['#ffffff', '#8e8e93'] },
```
Neue Form: `path` ist ein SVG-Umriss in einem 200×200-Feld (z. B. in Figma/Inkscape zeichnen und den Pfad kopieren).

## Auf GitHub Pages testen
1. Neues Repo anlegen, alle Dateien hochladen.
2. Repo → *Settings* → *Pages* → *Branch: main / root* → *Save*.
3. Nach ~1 Minute erreichbar unter `https://<benutzername>.github.io/<repo>/`.

## Lokal ansehen
```bash
python -m http.server 8000
```
Dann http://localhost:8000 öffnen.

## Wichtig: Bestellungen werden noch nicht gespeichert
Der Test speichert nichts (`submitOrder` in `shared.js`). Für den Heimserver dort einen
`fetch('/api/bestellung', …)` an euer Backend einbauen. Weil Name, Telefon und E-Mail
personenbezogene Daten sind, braucht die echte Seite **HTTPS**, eine **Datenschutzerklärung**
und ein **Impressum**.

## QR-Codes
QR-Code auf die Adresse des gewählten Entwurfs zeigen lassen, z. B. `…/entwurf-2/`.
