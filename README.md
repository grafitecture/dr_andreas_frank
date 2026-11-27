# Website Dr. Andreas Frank, Steuerberater – Mannheim-Käfertal

Statische Website (HTML/CSS/JS, keine Abhängigkeiten) für das Hosting auf **Vercel**.
Konzept: „Die etwas andere Website für einen Steuerberater“ – Buchhaltungszeichen als Gestaltungsmittel.
Signatur ist die **doppelte Unterstreichung** (in der Buchhaltung: die Endsumme).

## Seiten

| Datei | URL auf Vercel | Inhalt |
|---|---|---|
| `index.html` | `/` | Startseite: Headline „Belege, Fristen, Fragen? Wir sorgen für Ruhe.“, Leistungsbereich „Alles, was zählt.“ (Leistungen, Ablauf, Zitat), Team, Umzug, Karriere, Kontakt |
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
Dunkelblau `#17324A` (`--navy`, aus Air Force Blue abgeleitet): Fläche des Leistungsbereichs, Snow darauf 12 : 1. Ruby auf Dunkelblau nur als Fläche oder dicke Linie, nie als Schrift.

**Schrift:** Fira Sans (300/400/500/600), lokal gehostet als WOFF – keine Verbindung zu Google.
Lizenz: SIL Open Font License 1.1 (https://openfontlicense.org).

**Typo-Skala** (Perfect Fourth, mit `clamp()` von 360 bis 1440 px Viewport):
h1 5.61rem · h2 4.209rem · h3 3.157rem · h4 2.369rem · h5 1.777rem · h6 1.333rem · p 1rem · small 0.75rem · xs 0.563rem.

**Zeichen:** § Paragraf · Σ Summe · € Euro · % Prozent · = Gleich · + Plus – je eines steht als Kreis am Porträt jedes Teammitglieds. Die Zeile „Lieblingszeichen: …“ unter den Personen und der Satz dazu im Team-Intro wurden am 27.11.2026 auf Wunsch entfernt.
Weitere Elemente: Textmarker auf „Ruhe.“ sowie dezent auf „zuhören.“ (Team) und „Erst reden.“ (Kontakt), Umzugs-Abschnitt mit der neuen Adresse in feiner Schrift.

**Leistungsbereich (`#leistungen`, seit 27.11.2026):** Leistungen und Ablauf stehen in einem einzigen dunkelblauen Bereich, damit man alles an einer Stelle liest. Reihenfolge: drei helle Karten (privat, Unternehmen, Vereine; Überschrift, Satz und Liste bündig, Haken in Ruby) · „Vom Schuhkarton zum Steuerbescheid.“ (vier Schritte, Nummern in Ruby-Kreisen) · Zitat von Dr. Frank mit Termin- und Telefon-Button (mobil ohne Buttons, die Leiste unten übernimmt). Das Zitat steht auf Dunkelblau und hat deshalb keinen Textmarker. Auf Wunsch ersatzlos entfernt: „Die KI sortiert. Wir denken mit.“ (vier Eigenschaften, Datenschutz-Hinweis zur KI), „Technik spart Zeit. Die nehmen wir uns für Sie.“ mit Beratungsbild, die doppelte Linie über dem Zitat, das Teamwork-Bild und das Gruppenfoto im Team-Bereich (Bilddateien liegen noch in `assets/img/`). Im Menü steht nur noch „Leistungen“.

**Logo:** Typografische Wortmarke in zwei Zeilen, „Dr. Andreas Frank“ und „Steuerberatung“, beide in Ruby, Fira Sans Light, gleich groß. Auf der Website steht sie 40 px vom linken Rand, bewusst außerhalb des Rasters (Vorbild: Identity Lab / Kanzlei Denk); Kopf- und Fußzeile gleich groß, bis 52 px Schriftgröße. Auf dunklem Grund steht die Wortmarke in Snow, weil Ruby auf Ink kaum lesbar ist (1,8 : 1). Dateien: `assets/logo.svg` (Ruby), `assets/logo-negativ.svg` (Snow), Schrift in Pfaden. Favicon, Apple-Touch-Icon und App-Icon zeigen seit 27.11.2026 „DAF“ in Snow auf Ruby (Fira Sans SemiBold in Pfaden, kräftiger als die Wortmarke, damit es auch mit 16 px lesbar bleibt). Quelle: `favicon.svg` bzw. `assets/logo-zeichen.svg`; daraus `favicon.ico` (16/32/48 px), `apple-touch-icon.png` (180 px, volle Fläche, iOS rundet selbst) und `icon-512.png`. Die Icon-Links tragen einen Versions-Parameter, damit Browser das neue Icon laden.

**Handlungsfarben:** Call to Action überall Ruby (Hover Ruby dunkel). Daneben das Telefon als Linien-Button mit Rand und Schrift in Ruby, beim Überfahren gefüllt; auf dunklem Grund (FAQ-Band) bleibt er weiß. Textmarker knallgelb (`--marker: #FFE600`), nur an drei Stellen auf hellem Grund: „Ruhe.“ im Hero (gezogen beim Laden), „zuhören.“ und „Erst reden.“ (gezogen, wenn sie beim Scrollen ins Bild kommen; main.js setzt `.is-marked`). Auf den blauen Flächen bewusst kein Gelb.



## Zugangsschutz (Entwurf)

Vor der ganzen Website liegt eine Anmeldeseite (`middleware.js`, Vercel Routing Middleware). Das Passwort steht nicht im Code, sondern in der Vercel-Umgebungsvariable `SITE_PASSWORD` (Production und Preview, Typ „sensitive“). Nach der Anmeldung gilt der Zugang 30 Tage (Cookie `drf_zugang`, HttpOnly); `/abmelden` meldet ab. Frei bleiben nur CSS, Schriften, Favicon und robots.txt, die die Anmeldeseite selbst braucht. Ein neues Passwort in Vercel setzen und neu deployen – alte Anmeldungen verfallen dann automatisch.

Beim Livegang: `middleware.js` löschen und `SITE_PASSWORD` in Vercel entfernen.

## Grafitecture-Feld

Ganz unten in Impressum und Datenschutz steht das Grafitecture-Feld (Lime-Fläche mit Logo, „Marken mit KI.“, Link auf https://www.grafitecture.de/ in neuem Fenster). Quelle ist das Kit `kit/grafitecture-credit/` (v1.2, Original in `grafitecture/lannee_webseite`): Markup = Inhalt von `snippet.de.html`, CSS = letzter Block in `assets/css/style.css`, beides unverändert. Farben und Größe gehören der Agentur und werden nicht an das Designsystem angepasst. Der Ordner `kit/` wird über `.vercelignore` nicht ausgeliefert. Änderungen nur im Kit machen und neu kopieren.

## Bilder

Generiert mit Higgsfield (Soul 2.0 für Porträts, GPT Image 2.6 für Szenen), als WebP in zwei Größen.
`assets/img/og-image.jpg` ist das Vorschaubild für Social Media und Messenger.
