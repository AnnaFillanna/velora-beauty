/// <reference types="vite/client" />

const imageFiles = import.meta.glob<string>('../assets/images/*.{webp,jpg,jpeg,png}', {
  eager: true,
  import: 'default',
})

export const editorialImages = {
  treatments: 'treatments-selected.jpg',
  hero: 'hero-beauty.jpg',
  lashes: 'lashes-brows-selected.jpg',
  nails: 'nails.jpg',
  facial: 'face-skin-selected.jpg',
  bodyLaser: 'body-laser.jpg',
  collectionSerum: 'collection-serum.webp',
  collectionCream: 'collection-cream.webp',
  collectionCleanser: 'collection-cleanser.webp',
  collectionEssence: 'collection-essence.webp',
  collectionEye: 'collection-eye.webp',
  collectionSpf: 'collection-spf.webp',
  studio: 'studio.jpg',
  location: 'location.jpg',
  studioReception: 'location.jpg',
  studioTreatment: 'studio.jpg',
  studioDetails: 'body-laser.jpg',
} as const

export type EditorialImage = keyof typeof editorialImages

export function getEditorialImage(image: EditorialImage): string | undefined {
  const filename = editorialImages[image]
  const match = Object.entries(imageFiles).find(([path]) => path.endsWith(`/${filename}`))
  return match?.[1]
}
