# VELORA — Beauty House Köln

**Ein fiktives Premium-Beauty-Studio als interaktives Frontend-Portfolio-Projekt.**

> **Projekt ansehen:** [github.com/AnnaFillanna/velora-beauty](https://github.com/AnnaFillanna/velora-beauty)
>
> **Live-Demo:** [annafillanna.github.io/velora-beauty](https://annafillanna.github.io/velora-beauty/)

Mit VELORA zeige ich eine Beauty-Website mit mehr als statischen Seiten: Besucher können eine Behandlung auswählen, eine Demo-Terminbuchung durchlaufen und Produkte in einen lokalen Warenkorb legen. Mein Fokus liegt auf responsiven Oberflächen, nachvollziehbaren Zustandsänderungen und verständlichen Formularen.

**Wichtig:** VELORA ist ein Konzeptprojekt, kein realer Salon. Es werden keine echten Termine gebucht, Nachrichten versendet, Bestellungen ausgelöst oder Formulardaten dauerhaft gespeichert.

## Projektüberblick

- Premium-Designsystem mit Ivory, Soft Rose, Warm Taupe, Burgundy und Charcoal
- Editorial-Typografie, mobile-first Layouts und dezente Motion-Animationen
- Individuelle Seiten für Treatments, Preise, About, Kontakt und die Skin Collection
- Interaktive Demo-Terminbuchung mit fünf Schritten und simulierten Verfügbarkeiten
- Produktdetails und sitzungsinterner Demo-Warenkorb
- Barrierearme Formulare, Tastaturbedienung, Fokuszustände und Reduced-Motion-Unterstützung
- Route-spezifische SEO-Metadaten und konfigurierbare Canonicals/Sitemap

## Seiten und Funktionen

| Bereich | Inhalt |
| --- | --- |
| Startseite | Cinematic Hero, Beauty-Welt, Treatment-Teaser und Collection |
| Treatments | Kategorien, Leistungen, Demo-Beschreibungen, Dauer und Preise |
| Termin buchen | Behandlung, Beauty Expert, Datum, Uhrzeit und lokale Bestätigung |
| Über VELORA | Philosophie, Studio-Platzhalter, illustrative Teamprofile und Markenprinzipien |
| Skin Collection | Sechs fiktive Produkte, Detailansichten und Demo-Warenkorb |
| Kontakt | Validiertes lokales Formular ohne Versand oder Speicherung |
| Impressum & Datenschutz | Projektinformationen und Hinweise zu Demo-Funktionen und externen Fonts |

## Technologie

- React 19 und TypeScript
- Vite 6
- React Router 7
- Motion for React
- Lucide React
- CSS mit Custom Properties und responsiven Layouts
- ESLint

## Technische Entscheidungen

| Aufgabe | Umsetzung | Code |
| --- | --- | --- |
| Buchung in fünf Schritten | Behandlung, passende Expertin, Datum und Uhrzeit werden nacheinander ausgewählt. Wenn sich die Behandlung ändert, werden abhängige Auswahlen zurückgesetzt. | [BookingWizard.tsx](src/BookingWizard.tsx) |
| Demo-Verfügbarkeit | Die angebotenen Zeiten berücksichtigen Arbeitstage, Behandlungslänge, Schließzeit und bereits vergangene Uhrzeiten. Vor der Bestätigung wird die Auswahl erneut geprüft. | [Buchungslogik](src/BookingWizard.tsx), [Expertinnen und Zeitplan](src/data/booking.ts) |
| Gemeinsamer Warenkorb | React Context verbindet Produktseite, Warenkorb-Button und Drawer. Artikelanzahl und Zwischensumme werden aus den Positionen abgeleitet. Für diesen Umfang ist kein zusätzlicher State-Manager nötig. | [CartContext.tsx](src/CartContext.tsx), [cartStore.ts](src/cartStore.ts) |
| Tastatur und Formulare | Der Warenkorb begrenzt den Tab-Fokus, lässt sich mit Escape schließen und gibt den Fokus zurück. Formularfehler sind den Eingabefeldern zugeordnet. | [CartContext.tsx](src/CartContext.tsx), [Kontaktformular](src/App.tsx) |
| Bilder und Produktdarstellung | Bildzuordnungen liegen zentral. Fehlt ein Bild, bleibt eine gestaltete Ersatzdarstellung sichtbar. Produktdarstellungen sind von Produktdaten getrennt. | [visualAssets.ts](src/data/visualAssets.ts), [ProductArtwork.tsx](src/ProductArtwork.tsx) |
| Veröffentlichung | React Router verwendet den konfigurierten Basispfad. Seitentitel und Canonicals werden je Route aktualisiert; der Build erzeugt Sitemap und eine 404-Einstiegsdatei für GitHub Pages. | [main.tsx](src/main.tsx), [SEO.tsx](src/SEO.tsx), [generate-seo.mjs](scripts/generate-seo.mjs) |

### Zum Ausprobieren

1. Eine Behandlung öffnen und mit der Vorauswahl in die Terminbuchung wechseln.
2. Behandlung oder Expertin ändern und beobachten, wie Datum und Uhrzeit zurückgesetzt werden.
3. Die Buchung zunächst mit leeren Pflichtfeldern abschicken und anschließend die lokale Demo-Bestätigung ansehen.
4. Ein Produkt in den Warenkorb legen, die Menge ändern und den Drawer mit Escape schließen. Nach einem Reload ist der Warenkorb wieder leer.

### Abgrenzung

React, React Router, Motion und Lucide liefern die technische Grundlage. Die projektspezifischen Abläufe sind in den oben verlinkten Dateien nachvollziehbar. Der Buchungskalender simuliert Verfügbarkeiten; er reserviert keine Termine und synchronisiert sich nicht mit anderen Besuchern. Für einen echten Salon wären ein Backend, serverseitige Prüfung und eine verbindliche Reservierung nötig.

## Lokal starten

Voraussetzung: eine aktuelle Node.js-LTS-Version.

```bash
git clone https://github.com/AnnaFillanna/velora-beauty.git
cd velora-beauty
npm ci
npm run dev
```

Vite zeigt anschließend die lokale Entwicklungsadresse im Terminal an.

## Qualität prüfen und Production Build erstellen

```bash
npm run lint
npm run build
npx playwright install chromium
npm test
npm run preview
```

`npm run build` führt zuerst den TypeScript-Projektbuild und anschließend den Vite-Production-Build aus. Der abschließende SEO-Schritt erstellt `sitemap.xml`, sobald eine öffentliche URL konfiguriert ist. Die Playwright-Tests prüfen Buchungsvalidierung, abgelaufene Zeitfenster, Warenkorb und Kontaktformular auf Desktop und Smartphone. Der Testlauf startet seinen eigenen Vite-Server. In GitHub Actions laufen diese Prüfungen vor dem Deployment.

## Deployment-URL für SEO konfigurieren

Canonical-Links und Sitemap verwenden die öffentliche Deployment-Adresse.

Die GitHub-Pages-Veröffentlichung wird bei jedem Push auf `main` über GitHub Actions gebaut und bereitgestellt. Für eine lokale Auslieferung unter dem gleichen Projektpfad:

```bash
VITE_SITE_URL=https://annafillanna.github.io/velora-beauty \
VITE_BASE_PATH=/velora-beauty/ \
npm run build
```

Für eine eigene Domain müssen `VITE_SITE_URL` und `VITE_BASE_PATH` im GitHub-Actions-Workflow entsprechend angepasst werden.

Ohne `VITE_SITE_URL` wird absichtlich keine Sitemap mit einer falschen Domain erzeugt. `robots.txt` erlaubt das Crawling; der Generator ergänzt den Sitemap-Verweis erst mit einer gültigen URL.

## Bildmaterial

Studio-, Treatment- und Hero-Motive liegen als JPG-Dateien unter `src/assets/images/`, die drei Demo-Teamporträts unter `src/assets/team/`. Welche Motive verwendet werden, steht in [visualAssets.ts](src/data/visualAssets.ts). Für nicht vorhandene Produktbilder verwendet die Anwendung gestaltete Ersatzdarstellungen.

Der [Bildleitfaden](./IMAGE_GUIDE.md) beschreibt die Zuordnung und Anforderungen an Ersatzbilder. Die dargestellten Teamprofile gehören zum fiktiven Konzept; sie sind kein Nachweis realer Mitarbeiterinnen.

## Demo- und Datenschutz-Hinweise

- Buchungsdaten und Kontaktformulare werden nur vorübergehend im Browser verarbeitet.
- Das Kontaktformular leert seine Felder nach der lokalen Demo-Bestätigung.
- Der Warenkorb lebt nur im Anwendungszustand und wird nicht über einen Reload hinweg gespeichert.
- Es gibt keine Zahlungs-, Buchungs-, E-Mail-, Analytics- oder Tracking-Integration.
- Cormorant Garamond und Manrope werden über Google Fonts geladen; dabei kann eine Verbindung zu Google hergestellt werden.
- Impressum und Datenschutz sind Projektinformationen, keine rechtsverbindlichen Endfassungen.
- Teamprofile, Öffnungszeiten, Preise und Produkte sind fiktive Demo-Inhalte.

## Repository

Quellcode und Projekt ansehen: **[github.com/AnnaFillanna/velora-beauty](https://github.com/AnnaFillanna/velora-beauty)**
