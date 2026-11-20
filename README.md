# Website Dr. Andreas Frank, Steuerberater – Mannheim-Käfertal

Statische Website (HTML/CSS/JS, keine Abhängigkeiten) für das Hosting auf **Vercel**.
Konzept: „Die etwas andere Website für einen Steuerberater“ – Buchhaltungszeichen als Gestaltungsmittel.
Signatur ist die **doppelte Unterstreichung** (in der Buchhaltung: die Endsumme).

## Seiten

| Datei | URL auf Vercel | Inhalt |
|---|---|---|
| `index.html` | `/` | Startseite: Headline „Belege, Fristen, Fragen? Wir sorgen für Ruhe.“, Leistungen, T-Konto, Arbeitsweise (KI + Mensch), Ablauf, Team, Umzug, Karriere, Kontakt |
| `faq.html` | `/faq` | Häufige Fragen, Stand 20.11.2026, mit Steuer-Spickzettel 2026/2027 und FAQ-Schema (JSON-LD) |
| `impressum.html` | `/impressum` | Impressum nach § 5 DDG inkl. berufsrechtlicher Angaben |
| `datenschutz.html` | `/datenschutz` | Datenschutzerklärung für Hosting bei Vercel |
| `404.html` | – | Fehlerseite |
| `api/contact.js` | `/api/contact` | Vercel Function für das Kontaktformular |

## Ansehen und veröffentlichen

**Lokal ansehen:** `index.html` per Doppelklick öffnen – alles funktioniert, auch die Links zwischen den Seiten.
Mit Kontaktformular-Test und „schönen“ URLs: im Ordner `npx vercel dev` ausführen.

**Auf Vercel veröffentlichen:**
1. Ordner in ein GitHub-Repository legen und in Vercel importieren (Framework: „Other“, kein Build-Befehl, Output: Projektwurzel) – oder im Ordner `npx vercel` ausführen.
2. Domain `drfrank-steuer.de` im Vercel-Projekt verbinden.
3. `vercel.json` sorgt für saubere URLs (`/faq` statt `/faq.html`), Sicherheits-Header und Caching.

## Kontaktformular einrichten

Das Formular sendet an `/api/contact`, die Funktion verschickt eine E-Mail über die API von Resend.
In Vercel unter *Settings → Environment Variables* anlegen:

- `RESEND_API_KEY` – API-Schlüssel
- `CONTACT_TO` – z. B. `info@drfrank-steuer.de`
- `CONTACT_FROM` – Absender auf einer bei Resend verifizierten Domain, z. B. `Website <website@drfrank-steuer.de>`

Solange die Variablen fehlen, bietet das Formular automatisch den Versand über das E-Mail-Programm an.
Wer einen anderen Mailanbieter (z. B. mit Sitz in der EU) nutzen möchte, passt nur den `fetch`-Aufruf in `api/contact.js` an – und den Abschnitt 4 der Datenschutzerklärung.

## Vor dem Livegang – Checkliste

- [ ] **Entwurfsschutz entfernen:** In `vercel.json` den Header `X-Robots-Tag: noindex, nofollow` löschen – er verhindert, dass Suchmaschinen den Entwurf mit Platzhalter-Team indexieren.

Gelb markierte Stellen (`<mark class="todo">`) in Impressum und Datenschutz ausfüllen bzw. entfernen.

- [ ] **Teamfotos ersetzen.** Alle Personenfotos sind KI-generierte Platzhalter (fiktives Team). Namen, Rollen und Texte der Teammitglieder sind ebenfalls erfunden. Vor Veröffentlichung durch das echte Team ersetzen; Bildnachweis im Impressum anpassen.
- [ ] Zitat von Dr. Frank („Eine gute Steuererklärung …“) freigeben lassen oder ersetzen.
- [ ] USt-IdNr. ergänzen oder Abschnitt löschen; räumlichen Geltungsbereich der Berufshaftpflicht ergänzen.
- [ ] Umzug: Postleitzahl der Schwalbenstraße 2 (angenommen: 68309) und Umzugstermin bestätigen.
- [ ] Aussagen zur Arbeitsweise bestätigen: Mandantenportal und Beleg-App, Videoberatung, eingesetzte KI-Systeme mit AVV und § 62a StBerG-Verpflichtung.
- [ ] Mailanbieter für das Formular festlegen und in der Datenschutzerklärung eintragen.
- [ ] Vercel Web Analytics und Speed Insights deaktiviert lassen (sonst Datenschutzerklärung ergänzen).
- [ ] FAQ regelmäßig aktualisieren: Jahressteuergesetz 2026 (Bundesrat steht aus) und Einkommensteuerreformgesetz 2027 (im parlamentarischen Verfahren) – Stand jeweils im Kopf der FAQ-Seite und in `faq.html` ändern.

## Design-System

**Farben** (Vorgabe): Ruby Red `#A31621` (Handlungen, Summenlinie) · Snow `#FCF7F8` (Grundfläche) · Pale Slate `#CED3DC` (Linien) · Air Force Blue `#4E8098` (Marke, große Flächen) · Sky Blue `#90C2E7` (Akzentflächen).
Abgeleitet für gut lesbare Texte: Ink `#1C2B36`, `#46606F`, `#3B6479`.

**Schrift:** Fira Sans (300/400/500/600), lokal gehostet als WOFF – keine Verbindung zu Google.
Lizenz: SIL Open Font License 1.1 (https://openfontlicense.org).

**Typo-Skala** (Perfect Fourth, mit `clamp()` von 360 bis 1440 px Viewport):
h1 5.61rem · h2 4.209rem · h3 3.157rem · h4 2.369rem · h5 1.777rem · h6 1.333rem · p 1rem · small 0.75rem · xs 0.563rem.

**Zeichen:** § Paragraf · Σ Summe · € Euro · % Prozent · = Gleich · + Plus – jedes Teammitglied hat ein „Lieblingszeichen“.
Weitere Elemente: T-Konto „Soll und Haben“, Summenlinie, Schwalbe als Gruß an die neue Adresse.

**Logo:** Typografische Wortmarke „Dr. Andreas Frank“ in Ruby (Fira Sans Light). Auf der Website steht sie 40 px vom linken Rand, bewusst außerhalb des Rasters; „Steuerberatung“ läuft senkrecht am rechten Rand mit (Vorbild: Identity Lab / Kanzlei Denk). Auf dunklem Grund steht der Name in Snow, weil Ruby auf Ink kaum lesbar ist (1,8 : 1). Dateien: `assets/logo.svg` (Ruby), `assets/logo-negativ.svg` (Snow), Schrift in Pfaden. Favicon, Apple-Touch-Icon und App-Icon zeigen weiter die Bildmarke „=“ (`assets/logo-zeichen.svg`).

**Handlungsfarben:** Buttons Sky Blue mit Ink-Schrift, beim Überfahren Ruby. „Ruhe.“ im Hero ist knallgelb markiert (`--marker: #FFE600`), sonst kommt Gelb nirgends vor.

## Bilder

Generiert mit Higgsfield (Soul 2.0 für Porträts, GPT Image 2.6 für Szenen), als WebP in zwei Größen.
`assets/img/og-image.jpg` ist das Vorschaubild für Social Media und Messenger.
