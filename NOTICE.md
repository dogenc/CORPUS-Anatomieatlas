# Hinweise zu Drittkomponenten (NOTICE)

CORPUS besteht aus eigenem Code und eigenen Texten unter der [MIT-Lizenz](LICENSE) sowie aus den folgenden Drittkomponenten. Wer CORPUS weitergibt, verändert oder selbst veröffentlicht, muss die jeweiligen Lizenzbedingungen einhalten.

## 1. BodyParts3D – 3D-Modelldaten

| | |
|---|---|
| **Dateien** | `dist/assets/catalog.json`, `dist/assets/body-0.bin.gz` … `body-10.bin.gz` |
| **Urheber** | © The Database Center for Life Science (DBCLS) |
| **Quelle** | <https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/README_e.html> |
| **Lizenz** | [Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 2.1 Japan (CC BY-SA 2.1 JP)](https://creativecommons.org/licenses/by-sa/2.1/jp/) |
| **Änderungen** | Koordinatentransformation (x, z, −y), räumliches Vertex-Clustering (0,8–1,35 mm), binäres Packen, gzip-Kompression, Anzeigefarben |

Die abgeleiteten 3D-Daten stehen unter **derselben Lizenz** (CC BY-SA 2.1 JP), siehe [`dist/assets/LICENSE.txt`](dist/assets/LICENSE.txt). Bei jeder Weitergabe müssen genannt werden:
- der Urheber,
- die Lizenz mit Link,
- der Hinweis, dass die Daten verändert wurden.

Die Anwendung zeigt diese Angaben unter „Quellen & Hinweise“ und in jedem gespeicherten Bild.

> Die MIT-Lizenz des CORPUS-Codes gilt **nicht** für diese Daten. Die Share-Alike-Pflicht betrifft nur die 3D-Daten und deren Bearbeitungen, nicht den Programmcode, der sie anzeigt.

## 2. three.js – 3D-Bibliothek

| | |
|---|---|
| **Dateien** | `dist/vendor/three.module.js`, `three.core.js`, `OrbitControls.js` |
| **Version** | 0.180.0 (unverändert) |
| **Urheber** | © 2010–2025 three.js authors |
| **Quelle** | <https://github.com/mrdoob/three.js> |
| **Lizenz** | MIT, siehe [`dist/vendor/LICENSE`](dist/vendor/LICENSE) |

## 3. Electron (nur Desktop-Apps)

Die Desktop-Versionen für Windows und macOS enthalten [Electron](https://www.electronjs.org) (MIT-Lizenz) mit Chromium. Deren Lizenzhinweise liegen den Programmen bei (`LICENSE.electron.txt`, `LICENSES.chromium.html`).

## 4. Inhaltliche Quellen der Texte

Die Erklärtexte, Übersetzungen und Lehrpfade sind **eigene, frei formulierte Zusammenfassungen**. Es wurden keine Texte wörtlich übernommen. Als fachliche Grundlage dienten unter anderem die folgenden Quellen. Jeder Eintrag in der App verlinkt seine Quelle.

- OpenStax, *Anatomy and Physiology 2e* (CC BY 4.0): <https://openstax.org/details/books/anatomy-and-physiology-2e>
- gesund.bund.de (Bundesministerium für Gesundheit)
- IQWiG / gesundheitsinformation.de
- Deutsches Rotes Kreuz
- NHS (National Health Service, UK)

Genannte Marken und Namen gehören ihren jeweiligen Inhabern. Eine Verbindung zu oder Billigung durch diese Organisationen besteht nicht.
