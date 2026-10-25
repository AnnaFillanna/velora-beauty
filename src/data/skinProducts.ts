import type { EditorialImage } from './visualAssets'

export type SkinProduct = {
  id: string
  name: string
  volume: string
  priceEuro: number
  description: string
  skinType: string
  application: string
  ingredientHighlights: string[]
  productForm: 'dropper' | 'essence' | 'jar' | 'balm' | 'eye' | 'pump'
  image: EditorialImage
  collection: string
}

export const skinProducts: SkinProduct[] = [
  {
    id: 'radiance-serum',
    name: 'VELORA Radiance Serum',
    volume: '30 ml',
    priceEuro: 89,
    description: 'Ein leichtes Serum als bewusstes Pflegeritual am Morgen oder Abend.',
    skinType: 'Alle Hauttypen',
    application: 'Einige Tropfen auf die gereinigte Haut geben und sanft verteilen.',
    ingredientHighlights: ['Hyaluronsäure', 'Niacinamid', 'Panthenol'],
    productForm: 'dropper',
    image: 'collectionSerum',
    collection: '01 · ESSENZ',
  },
  {
    id: 'hydra-essence',
    name: 'VELORA Hydra Essence',
    volume: '100 ml',
    priceEuro: 59,
    description: 'Eine wässrige Pflege-Essenz für einen ruhigen Start in deine Routine.',
    skinType: 'Alle Hauttypen',
    application: 'Nach der Reinigung in die Handflächen geben und sanft auf Gesicht und Hals verteilen.',
    ingredientHighlights: ['Glycerin', 'Aloe vera', 'Betaine'],
    productForm: 'essence',
    image: 'collectionEssence',
    collection: '02 · ESSENZ',
  },
  {
    id: 'renewal-night-cream',
    name: 'VELORA Renewal Night Cream',
    volume: '50 ml',
    priceEuro: 98,
    description: 'Eine reichhaltige Abendpflege mit einer cremigen, angenehmen Textur.',
    skinType: 'Normale bis trockene Haut',
    application: 'Abends als letzten Schritt der Pflegeroutine auf Gesicht und Hals auftragen.',
    ingredientHighlights: ['Ceramide', 'Squalan', 'Sheabutter'],
    productForm: 'jar',
    image: 'collectionCream',
    collection: '03 · NACHTRITUAL',
  },
  {
    id: 'gentle-cleansing-balm',
    name: 'VELORA Gentle Cleansing Balm',
    volume: '100 ml',
    priceEuro: 45,
    description: 'Ein weicher Reinigungsbalsam für einen entspannten Abschluss des Tages.',
    skinType: 'Alle Hauttypen',
    application: 'Auf trockener Haut sanft einmassieren, mit Wasser aufemulgieren und abspülen.',
    ingredientHighlights: ['Haferöl', 'Jojobaöl', 'Vitamin E'],
    productForm: 'balm',
    image: 'collectionCleanser',
    collection: '04 · REINIGUNG',
  },
  {
    id: 'eye-contour-complex',
    name: 'VELORA Eye Contour Complex',
    volume: '15 ml',
    priceEuro: 69,
    description: 'Eine feine Pflege für die tägliche Routine rund um die Augenpartie.',
    skinType: 'Alle Hauttypen',
    application: 'Eine kleine Menge mit dem Ringfinger sanft um die Augenpartie einklopfen.',
    ingredientHighlights: ['Koffein', 'Peptide', 'Hyaluronsäure'],
    productForm: 'eye',
    image: 'collectionEye',
    collection: '05 · AUGENPFLEGE',
  },
  {
    id: 'daily-protection-spf-50',
    name: 'VELORA Daily Protection SPF 50',
    volume: '50 ml',
    priceEuro: 55,
    description: 'Eine tägliche Pflege mit Lichtschutzfaktor 50 für deine Morgenroutine.',
    skinType: 'Alle Hauttypen',
    application: 'Morgens großzügig als letzten Pflegeschritt auftragen. Regelmäßig erneuern.',
    ingredientHighlights: ['Lichtschutzfilter', 'Glycerin', 'Vitamin E'],
    productForm: 'pump',
    image: 'collectionSpf',
    collection: '06 · TAGESRITUAL',
  },
]

export function findSkinProduct(id: string | undefined) {
  return skinProducts.find((product) => product.id === id)
}

export function formatSkinPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}
