# VELORA — Beauty House Köln

Responsive Beauty-Website mit Demo-Terminbuchung und Produktkatalog. Mit diesem Portfolio-Projekt zeige ich, wie ich Gestaltung, Formulare und interaktive Abläufe mit React und TypeScript umsetze.

**[Live-Demo ansehen](https://annafillanna.github.io/velora-beauty/)**

<p align="center">
  <img src="docs/screenshots/desktop.png" alt="VELORA Beauty House – Desktop-Ansicht" width="72%" />
  &nbsp;
  <img src="docs/screenshots/mobile.png" alt="VELORA Beauty House – mobile Ansicht" width="23%" />
</p>

## Funktionen

- Fünfstufige Terminbuchung mit Behandlung, Expertin und simulierten Verfügbarkeiten
- Produktseiten und Warenkorb mit Mengenänderung
- Kontaktformular mit Validierung
- Responsive Layouts, Tastaturbedienung und Reduced-Motion-Unterstützung
- Seitenspezifische Metadaten und Sitemap für GitHub Pages

## Technische Entscheidungen

- **Buchungslogik:** Eine andere Behandlung setzt abhängige Auswahlen zurück. Arbeitszeiten, Behandlungsdauer und vergangene Termine bestimmen die angebotenen Zeiten; vor der Bestätigung wird die Verfügbarkeit erneut geprüft. → [BookingWizard.tsx](src/BookingWizard.tsx)
- **Warenkorb:** React Context verbindet Produktseiten und Drawer. Artikelanzahl und Zwischensumme werden aus den Positionen berechnet. → [CartContext.tsx](src/CartContext.tsx)
- **Bedienbarkeit:** Der Drawer unterstützt Escape und Fokus-Rückgabe. Formularfehler sind den Eingabefeldern zugeordnet.

## Tech Stack

React · TypeScript · Vite · React Router · CSS · Motion · Lucide · Playwright · ESLint

## Lokal starten

Node.js 22 verwenden. Im Projektverzeichnis:

```bash
npm ci
npm run dev
```

## Prüfungen

```bash
npm run lint
npx playwright install chromium
npm test
npm run build
```

Acht Browserprüfungen decken Buchung, abgelaufene Termine, Warenkorb und Kontaktformular auf Desktop und Smartphone ab. GitHub Actions prüft und veröffentlicht das Projekt bei einem Push auf `main`.

## Demo-Hinweis

VELORA ist ein fiktives Studio. Buchungen, Nachrichten und Käufe werden nicht übermittelt; Formulardaten und Warenkorb bleiben nur im Anwendungszustand. Teamprofile, Produkte und Preise sind Demo-Inhalte. Die Schriftarten werden über Google Fonts geladen.

Weitere Details: [Bildleitfaden](IMAGE_GUIDE.md) · [Deployment-Konfiguration](.github/workflows/deploy-pages.yml)
