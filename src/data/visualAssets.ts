/// <reference types="vite/client" />

const imageFiles = import.meta.glob<string>('../assets/images/*.webp', {
  eager: true,
  import: 'default',
})

export const editorialImages = {
  hero: 'hero-beauty.webp',
  lashes: 'lashes.webp',
  nails: 'nails.webp',
  facial: 'facial.webp',
  bodyLaser: 'body-laser.webp',
  collectionSerum: 'collection-serum.webp',
  collectionCream: 'collection-cream.webp',
  collectionCleanser: 'collection-cleanser.webp',
  collectionEssence: 'collection-essence.webp',
  collectionEye: 'collection-eye.webp',
  collectionSpf: 'collection-spf.webp',
  studio: 'studio-interior.webp',
  studioReception: 'studio-reception.webp',
  studioTreatment: 'studio-treatment.webp',
  studioDetails: 'studio-details.webp',
} as const

export type EditorialImage = keyof typeof editorialImages

export function getEditorialImage(image: EditorialImage): string | undefined {
  const filename = editorialImages[image]
  const match = Object.entries(imageFiles).find(([path]) => path.endsWith(`/${filename}`))
  return match?.[1]
}
