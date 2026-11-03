# VELORA Bildleitfaden

Die bestehenden Motive liegen als JPG in `src/assets/images/`. Für neue Motive sind auch WebP-Dateien möglich; passe beim Austausch die Zuordnung an. Die Zuordnung und Dateinamen sind zentral in `src/data/visualAssets.ts` hinterlegt. Solange eine Datei fehlt, bleibt die vorhandene CSS-Bildkomposition sichtbar; fehlende Dateien werden nicht angefordert und erzeugen keine defekten Bildsymbole.

| Datei | Einsatz | Seitenverhältnis | Empfohlene Mindestgröße |
| --- | --- | ---: | ---: |
| `hero-selected.jpg` | Cinematic Hero-Motiv | 4:5 oder 3:4 Hochformat | 1800 × 2250 px |
| `lashes-brows-selected.jpg` | Lashes & Brows Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `nails.jpg` | Nails & Manicure Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `face-skin-selected.jpg` | Face & Skin Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `body-laser.jpg` | Body & Laser Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `collection-serum.webp` | Serum-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-essence.webp` | Essence-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-cream.webp` | Creme-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-cleanser.webp` | Reiniger-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-eye.webp` | Augenpflege-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-spf.webp` | SPF-Pflege-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `studio.jpg` | Studio / Atmosphäre (Reserve) | 3:2 Querformat | 1800 × 1200 px |
| `location.jpg` | Empfangsbereich der Über-uns-Galerie | 4:5 Hochformat | 1400 × 1750 px |
| `studio.jpg` | Behandlungsraum der Über-uns-Galerie | 4:5 Hochformat | 1200 × 1500 px |
| `studio-details.jpg` | Materialien und Beauty-Details der Über-uns-Galerie | 4:5 Hochformat | 1200 × 1500 px |

Die bestehenden Teamdateien `src/assets/team/sophia.jpg`, `emilia.jpg` und `isabella.jpg` sind Demo-Porträts für fiktive Teamprofile. Für fotografische Porträts können gleichnamige WebP-Dateien im Verhältnis 4:5 und mit mindestens 1000 × 1250 px die Illustrationen ersetzen; dazu werden die Zuordnungen in `src/data/booking.ts` angepasst. Alle Teamprofile und Buchungs-CTAs verwenden dieselbe zentrale Teamdatenstruktur.

## Motivkomposition

- Warme, natürliche Lichtführung und die VELORA-Farbwelt aus Ivory, Rose, Taupe und Burgundy beibehalten.
- Im Hero das Motiv eher rechts und mit ruhigen, bewusst freien Flächen setzen. Das Textfeld links bleibt frei; im Hochformat wichtige Details zentral halten, damit der mobile Zuschnitt funktioniert.
- Treatment-Bilder editorial und atmosphärisch gestalten, ohne medizinische Wirkversprechen oder erfundene Vorher-Nachher-Ergebnisse.
- Für die Studio-Galerie eine zusammengehörige Bildserie aus Empfang, Behandlungsraum und Materialdetails erstellen. Jede Aufnahme soll eigene Bildinformation zeigen; keine mehrfach verwendeten Ausschnitte desselben Motivs.
- Team-Porträts als ruhige, natürliche Editorial-Aufnahmen gestalten. Die Profile sind fiktiv; keine realen Personen oder unzutreffenden Qualifikationen suggerieren.
- Produktdateien als saubere Freisteller mit transparentem Hintergrund liefern. Das Motiv mittig platzieren und rundum genügend Rand für flexible Zuschnitte lassen.
- Keine Schrift, Logos oder Produktversprechen in Bilddateien einbacken; Beschriftungen bleiben als echte Website-Texte zugänglich.
- Bilder komprimieren und Metadaten entfernen. Für Hero-Motive eine hochwertige, responsive Quelle verwenden; Detailbilder möglichst klein halten.
