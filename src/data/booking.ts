import sophiaPortrait from '../assets/team/sophia.svg'
import emiliaPortrait from '../assets/team/emilia.svg'
import isabellaPortrait from '../assets/team/isabella.svg'

export type BeautyExpert = {
  id: string
  name: string
  role: string
  portrait: string
  bio: string
  treatmentIds: string[]
  weekdays: number[]
  startsAt: string[]
}

export const beautyExperts: BeautyExpert[] = [
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Skin & Facial Specialist',
    portrait: sophiaPortrait,
    bio: 'Sophia richtet den Blick auf individuelle Hautpflege, Facials und ruhige Beauty-Rituale – immer mit Raum für deine persönlichen Wünsche.',
    treatmentIds: ['signature-facial', 'deep-cleansing', 'hydrafacial', 'anti-aging-facial', 'body-contouring', 'anti-cellulite', 'skin-tightening', 'laser-gesicht', 'laser-achseln', 'laser-beine', 'laser-bikini', 'laser-ganzkoerper'],
    weekdays: [1, 2, 3, 4, 5],
    startsAt: ['09:00', '10:30', '13:00', '15:00'],
  },
  {
    id: 'emilia',
    name: 'Emilia',
    role: 'Lashes & Brows Expert',
    portrait: emiliaPortrait,
    bio: 'Emilia liebt präzise Details: von Wimpernverlängerung und Lash Lifting bis zu einem stimmigen, typgerechten Brow Styling.',
    treatmentIds: ['wimpern-classic', 'volume-lashes', 'lash-lifting', 'brow-lifting', 'augenbrauenstyling', 'laser-gesicht', 'laser-achseln', 'laser-bikini'],
    weekdays: [2, 3, 4, 5, 6],
    startsAt: ['09:30', '11:30', '14:00', '16:00'],
  },
  {
    id: 'isabella',
    name: 'Isabella',
    role: 'Nails & Body Specialist',
    portrait: isabellaPortrait,
    bio: 'Isabella verbindet sorgfältige Maniküre und Nail Design mit ausgewählten Body Treatments für eine bewusste Auszeit.',
    treatmentIds: ['classic-manicure', 'gel-manicure', 'nail-extensions', 'nail-art', 'body-contouring', 'anti-cellulite', 'skin-tightening', 'laser-achseln', 'laser-beine', 'laser-bikini', 'laser-ganzkoerper'],
    weekdays: [1, 2, 3, 4, 5, 6],
    startsAt: ['09:00', '11:00', '13:30', '15:30'],
  },
]

export const noPreferenceExpertId = 'no-preference'

export const demoAvailability = {
  daysAhead: 60,
  closedWeekdays: [0],
  closingTime: '18:00',
  excludedSlotEveryNthDay: 4,
  weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  months: [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ],
  slotIntervalMinutes: 30,
} as const

export function expertsForTreatment(treatmentId: string) {
  return beautyExperts.filter((expert) => expert.treatmentIds.includes(treatmentId))
}
