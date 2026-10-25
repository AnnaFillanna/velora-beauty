export const treatmentCategories = [
  { id: 'lashes-brows', label: 'Lashes & Brows' },
  { id: 'nails', label: 'Nails' },
  { id: 'facial-skin', label: 'Facial & Skin' },
  { id: 'body', label: 'Body Treatments' },
  { id: 'laser', label: 'Laser-Haarentfernung' },
] as const

export type TreatmentCategoryId = (typeof treatmentCategories)[number]['id']

export type PricedTreatment = {
  id: string
  category: TreatmentCategoryId
  name: string
  description: string
  durationMinutes: number
  priceEuro: number
}

export const pricedTreatments: PricedTreatment[] = [
  { id: 'wimpern-classic', category: 'lashes-brows', name: 'Wimpernverlängerung Classic', description: 'Ein feiner, natürlicher Look – abgestimmt auf deinen Wimpernkranz.', durationMinutes: 120, priceEuro: 89 },
  { id: 'volume-lashes', category: 'lashes-brows', name: 'Volume Lashes', description: 'Mehr Fülle und ein ausdrucksstarker Augenaufschlag.', durationMinutes: 150, priceEuro: 119 },
  { id: 'lash-lifting', category: 'lashes-brows', name: 'Lash Lifting', description: 'Die eigenen Wimpern sanft in Form gebracht.', durationMinutes: 60, priceEuro: 59 },
  { id: 'brow-lifting', category: 'lashes-brows', name: 'Brow Lifting', description: 'Gepflegte Brauen mit ausdrucksvoller Form.', durationMinutes: 50, priceEuro: 55 },
  { id: 'augenbrauenstyling', category: 'lashes-brows', name: 'Augenbrauenstyling', description: 'Individuelles Formen und Stylen deiner Brauen.', durationMinutes: 30, priceEuro: 32 },
  { id: 'classic-manicure', category: 'nails', name: 'Classic Manicure', description: 'Sorgfältige Nagelpflege mit Feilen und Pflegefinish.', durationMinutes: 45, priceEuro: 39 },
  { id: 'gel-manicure', category: 'nails', name: 'Gel Manicure', description: 'Maniküre mit Gel-Finish in deiner Wunschfarbe.', durationMinutes: 75, priceEuro: 69 },
  { id: 'nail-extensions', category: 'nails', name: 'Nail Extensions', description: 'Individuelle Verlängerung und Formgebung der Nägel.', durationMinutes: 120, priceEuro: 99 },
  { id: 'nail-art', category: 'nails', name: 'Nail Art', description: 'Kleine Akzente oder individuelle Designs für deine Nägel.', durationMinutes: 30, priceEuro: 18 },
  { id: 'signature-facial', category: 'facial-skin', name: 'Signature Facial', description: 'Ein abgestimmtes Gesichtsritual mit Reinigung und Pflege.', durationMinutes: 75, priceEuro: 89 },
  { id: 'deep-cleansing', category: 'facial-skin', name: 'Deep Cleansing', description: 'Gründliche Reinigung und Pflege in entspannter Atmosphäre.', durationMinutes: 60, priceEuro: 75 },
  { id: 'hydrafacial', category: 'facial-skin', name: 'Hydrafacial', description: 'Apparative Gesichtsbehandlung als Teil deiner Pflegeroutine.', durationMinutes: 60, priceEuro: 129 },
  { id: 'anti-aging-facial', category: 'facial-skin', name: 'Anti-Aging Treatments', description: 'Ein pflegendes Facial mit ausgewählten Anwendungsschritten.', durationMinutes: 75, priceEuro: 109 },
  { id: 'body-contouring', category: 'body', name: 'Body Contouring', description: 'Apparatives Body Treatment für eine bewusste Auszeit.', durationMinutes: 60, priceEuro: 119 },
  { id: 'anti-cellulite', category: 'body', name: 'Anti-Cellulite Treatment', description: 'Ein abgestimmtes Körperritual mit aktivierenden Pflegeschritten.', durationMinutes: 60, priceEuro: 99 },
  { id: 'skin-tightening', category: 'body', name: 'Skin Tightening', description: 'Apparatives Treatment mit Fokus auf das Körpergefühl.', durationMinutes: 60, priceEuro: 129 },
  { id: 'laser-gesicht', category: 'laser', name: 'Laser-Haarentfernung · Gesicht', description: 'Behandlung einer ausgewählten Gesichtszone.', durationMinutes: 20, priceEuro: 49 },
  { id: 'laser-achseln', category: 'laser', name: 'Laser-Haarentfernung · Achseln', description: 'Behandlung der Achselzone.', durationMinutes: 20, priceEuro: 59 },
  { id: 'laser-beine', category: 'laser', name: 'Laser-Haarentfernung · Beine', description: 'Behandlung der Beine – Umfang nach individueller Absprache.', durationMinutes: 60, priceEuro: 149 },
  { id: 'laser-bikini', category: 'laser', name: 'Laser-Haarentfernung · Bikini', description: 'Behandlung der Bikinizone – Details nach individueller Absprache.', durationMinutes: 30, priceEuro: 69 },
  { id: 'laser-ganzkoerper', category: 'laser', name: 'Laser-Haarentfernung · Ganzkörper', description: 'Umfang und Ablauf werden vorab persönlich besprochen.', durationMinutes: 120, priceEuro: 299 },
]

export function getPricedTreatment(id: string | null) {
  return pricedTreatments.find((treatment) => treatment.id === id)
}
