# VELORA — Beauty House Köln

**Ein fiktives Premium-Beauty-Studio als interaktives Frontend-Portfolio-Projekt.**

> **Projekt ansehen:** [github.com/AnnaFillanna/velora-beauty](https://github.com/AnnaFillanna/velora-beauty)
>
> **Live-Demo:** [annafillanna.github.io/velora-beauty](https://annafillanna.github.io/velora-beauty/)

VELORA verbindet ein ruhiges, editorial geprägtes Markenerlebnis mit funktionierenden Demo-Interaktionen. Das Projekt demonstriert Konzeption und Umsetzung einer responsiven Beauty-Website – von Treatments und Preisen bis zur Buchungsstrecke und einem kleinen Produktkatalog.

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

## Lokal starten

Voraussetzung: eine aktuelle Node.js-LTS-Version.

```bash
git clone https://github.com/AnnaFillanna/velora-beauty.git
cd velora-beauty
npm install
npm run dev
```

Vite zeigt anschließend die lokale Entwicklungsadresse im Terminal an.

## Qualität prüfen und Production Build erstellen

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` führt zuerst den TypeScript-Projektbuild und anschließend den Vite-Production-Build aus. Der abschließende SEO-Schritt erstellt `sitemap.xml`, sobald eine öffentliche URL konfiguriert ist. Im Projekt gibt es derzeit kein separates automatisiertes Testskript.

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

Es sind derzeit illustrative Team-Porträts im SVG-Format vorhanden. Fehlende Studio-, Treatment- und Produktfotos werden durch gestaltete Platzhalterflächen ersetzt, sodass keine kaputten Bildverweise entstehen.

Empfohlene Dateinamen, Formate und Bildkompositionen stehen im [Bildleitfaden](./IMAGE_GUIDE.md). Finale WebP-Dateien gehören nach `src/assets/images/`.

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
