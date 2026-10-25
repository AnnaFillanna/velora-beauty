# VELORA Bildleitfaden

Lege finale Bilddateien als WebP in `src/assets/images/` ab. Die Zuordnung und Dateinamen sind zentral in `src/data/visualAssets.ts` hinterlegt. Solange eine Datei fehlt, bleibt die vorhandene CSS-Bildkomposition sichtbar; fehlende Dateien werden nicht angefordert und erzeugen keine defekten Bildsymbole.

| Datei | Einsatz | Seitenverhältnis | Empfohlene Mindestgröße |
| --- | --- | ---: | ---: |
| `hero-beauty.webp` | Cinematic Hero-Motiv | 4:5 oder 3:4 Hochformat | 1800 × 2250 px |
| `lashes.webp` | Lashes & Brows Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `nails.webp` | Nails & Manicure Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `facial.webp` | Face & Skin Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `body-laser.webp` | Body & Laser Editorial | 4:5 Hochformat | 1200 × 1500 px |
| `collection-serum.webp` | Serum-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-essence.webp` | Essence-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-cream.webp` | Creme-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-cleanser.webp` | Reiniger-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-eye.webp` | Augenpflege-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `collection-spf.webp` | SPF-Pflege-Freisteller | transparent, quadratisch | 1200 × 1200 px |
| `studio-interior.webp` | Studio / Atmosphäre (Reserve) | 3:2 Querformat | 1800 × 1200 px |
| `studio-reception.webp` | Empfangsbereich der Über-uns-Galerie | 4:5 Hochformat | 1400 × 1750 px |
| `studio-treatment.webp` | Behandlungsraum der Über-uns-Galerie | 4:5 Hochformat | 1200 × 1500 px |
| `studio-details.webp` | Materialien und Beauty-Details der Über-uns-Galerie | 4:5 Hochformat | 1200 × 1500 px |

Die bestehenden Teamdateien `src/assets/team/sophia.svg`, `emilia.svg` und `isabella.svg` sind illustrative Demo-Porträts. Für fotografische Porträts können gleichnamige WebP-Dateien im Verhältnis 4:5 und mit mindestens 1000 × 1250 px die Illustrationen ersetzen; dazu werden die Zuordnungen in `src/data/booking.ts` angepasst. Alle Teamprofile und Buchungs-CTAs verwenden dieselbe zentrale Teamdatenstruktur.

## Motivkomposition

- Warme, natürliche Lichtführung und die VELORA-Farbwelt aus Ivory, Rose, Taupe und Burgundy beibehalten.
- Im Hero das Motiv eher rechts und mit ruhigen, bewusst freien Flächen setzen. Das Textfeld links bleibt frei; im Hochformat wichtige Details zentral halten, damit der mobile Zuschnitt funktioniert.
- Treatment-Bilder editorial und atmosphärisch gestalten, ohne medizinische Wirkversprechen oder erfundene Vorher-Nachher-Ergebnisse.
- Für die Studio-Galerie eine zusammengehörige Bildserie aus Empfang, Behandlungsraum und Materialdetails erstellen. Jede Aufnahme soll eigene Bildinformation zeigen; keine mehrfach verwendeten Ausschnitte desselben Motivs.
- Team-Porträts als ruhige, natürliche Editorial-Aufnahmen gestalten. Die Profile sind fiktiv; keine realen Personen oder unzutreffenden Qualifikationen suggerieren.
- Produktdateien als saubere Freisteller mit transparentem Hintergrund liefern. Das Motiv mittig platzieren und rundum genügend Rand für flexible Zuschnitte lassen.
- Keine Schrift, Logos oder Produktversprechen in Bilddateien einbacken; Beschriftungen bleiben als echte Website-Texte zugänglich.
- Bilder komprimieren und Metadaten entfernen. Für Hero-Motive eine hochwertige, responsive Quelle verwenden; Detailbilder möglichst klein halten.
