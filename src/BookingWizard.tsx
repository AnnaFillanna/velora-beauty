import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CalendarDays, Check, Clock3, UserRound } from 'lucide-react'
import { beautyExperts, demoAvailability, expertsForTreatment, noPreferenceExpertId, type BeautyExpert } from './data/booking'
import { getPricedTreatment, pricedTreatments, treatmentCategories, type TreatmentCategoryId } from './data/treatments'

type CustomerDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  privacyAccepted: boolean
}

type BookingState = {
  category: TreatmentCategoryId
  treatmentId: string
  expertId: string
  date: string
  time: string
  customer: CustomerDetails
}

type FormErrors = Partial<Record<keyof CustomerDetails | 'treatment' | 'expert' | 'date' | 'time', string>>

const steps = ['Behandlung', 'Beauty Expert', 'Datum & Uhrzeit', 'Deine Angaben', 'Übersicht'] as const
const emptyCustomer: CustomerDetails = { firstName: '', lastName: '', email: '', phone: '', message: '', privacyAccepted: false }

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

function dateAtOffset(offset: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date
}

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

function getCalendarDays(date: Date) {
  const firstWeekday = (monthStart(date).getDay() + 6) % 7
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(date.getFullYear(), date.getMonth(), index + 1, 12)),
  ]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatDate(dateKey: string) {
  if (!dateKey) return 'Noch nicht ausgewählt'
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(fromDateKey(dateKey))
}

function getDemoTimes(dateKey: string, durationMinutes: number, experts: BeautyExpert[]) {
  if (!dateKey) return []
  const date = fromDateKey(dateKey)
  if ((demoAvailability.closedWeekdays as readonly number[]).includes(date.getDay())) return []
  const closingMinutes = Number(demoAvailability.closingTime.slice(0, 2)) * 60 + Number(demoAvailability.closingTime.slice(3))
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const todayKey = toDateKey(now)
  const excludedIndex = (date.getDate() + date.getMonth()) % demoAvailability.excludedSlotEveryNthDay
  const times = experts.flatMap((expert) => {
    if (!expert.weekdays.includes(date.getDay())) return []
    return expert.startsAt.filter((start, index) => {
      const startMinutes = Number(start.slice(0, 2)) * 60 + Number(start.slice(3))
      return startMinutes + durationMinutes <= closingMinutes
        && (dateKey !== todayKey || startMinutes > currentMinutes)
        && index !== excludedIndex
    })
  })
  return [...new Set(times)].sort()
}

function initialBooking(searchParams: URLSearchParams): BookingState {
  const requestedTreatment = getPricedTreatment(searchParams.get('service'))
  const requestedCategory = treatmentCategories.find((category) => category.id === searchParams.get('category'))?.id
  const requestedExpert = beautyExperts.find((expert) => expert.id === searchParams.get('expert'))
  const expertTreatment = requestedExpert && pricedTreatments.find((item) => requestedExpert.treatmentIds.includes(item.id))
  const treatment = requestedTreatment && (!requestedExpert || requestedExpert.treatmentIds.includes(requestedTreatment.id))
    ? requestedTreatment
    : expertTreatment
  const category = treatment?.category ?? requestedCategory ?? treatmentCategories[0].id
  const firstTreatment = pricedTreatments.find((treatment) => treatment.category === category)
  const treatmentId = treatment?.id ?? firstTreatment?.id ?? ''
  return {
    category,
    treatmentId,
    expertId: requestedExpert?.treatmentIds.includes(treatmentId) ? requestedExpert.id : noPreferenceExpertId,
    date: '',
    time: '',
    customer: emptyCustomer,
  }
}

function validateCustomer(customer: CustomerDetails): FormErrors {
  const errors: FormErrors = {}
  if (!customer.firstName.trim()) errors.firstName = 'Bitte gib deinen Vornamen ein.'
  if (!customer.lastName.trim()) errors.lastName = 'Bitte gib deinen Nachnamen ein.'
  if (!customer.email.trim()) errors.email = 'Bitte gib deine E-Mail-Adresse ein.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = 'Bitte prüfe das Format deiner E-Mail-Adresse.'
  if (!customer.privacyAccepted) errors.privacyAccepted = 'Bitte bestätige die Datenschutzhinweise für diese Demo.'
  return errors
}

function DemoNotice() {
  return <p className="booking-demo-notice"><span aria-hidden="true">i</span><span>Demo-Buchung · Keine echte Terminanfrage, E-Mail oder Datenspeicherung.</span></p>
}

function BookingSummary({ booking, expert, completed = false }: { booking: BookingState; expert?: BeautyExpert; completed?: boolean }) {
  const treatment = getPricedTreatment(booking.treatmentId)
  return <aside className="booking-summary" aria-label="Buchungsübersicht">
    <div className="booking-summary-top"><p className="eyebrow">DEIN VELORA MOMENT</p><span>ÜBERSICHT</span></div>
    <h2>{completed ? 'Dein Moment.' : 'In deinem Tempo.'}</h2>
    <div className="booking-summary-rows">
      <div><span>Behandlung</span><strong>{treatment?.name ?? 'Noch nicht ausgewählt'}</strong></div>
      <div><span>Beauty Expert</span><strong>{booking.expertId === noPreferenceExpertId ? 'Keine Präferenz' : expert?.name ?? 'Noch nicht ausgewählt'}</strong></div>
      <div><span>Datum & Uhrzeit</span><strong>{booking.date ? `${formatDate(booking.date)}${booking.time ? ` · ${booking.time} Uhr` : ''}` : 'Noch nicht ausgewählt'}</strong></div>
      <div><span>Dauer</span><strong>{treatment ? `${treatment.durationMinutes} Minuten` : '—'}</strong></div>
      <div className="booking-summary-total"><span>Demo-Preis</span><strong>{treatment ? formatPrice(treatment.priceEuro) : '—'}</strong></div>
    </div>
    <p className="booking-summary-note">Fiktive Angaben für ein Portfolio-Demoprojekt. Es wird nichts verbindlich gebucht.</p>
  </aside>
}

function BookingWizard() {
  const [searchParams] = useSearchParams()
  const [booking, setBooking] = useState<BookingState>(() => initialBooking(searchParams))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [calendarMonth, setCalendarMonth] = useState(() => monthStart(dateAtOffset(0)))
  const [submitted, setSubmitted] = useState(false)
  const bookingFormRef = useRef<HTMLFormElement>(null)
  const reducedMotion = useReducedMotion()
  const availableTreatments = useMemo(() => pricedTreatments.filter((treatment) => treatment.category === booking.category), [booking.category])
  const treatment = getPricedTreatment(booking.treatmentId)
  const matchingExperts = useMemo(() => expertsForTreatment(booking.treatmentId), [booking.treatmentId])
  const selectedExpert = beautyExperts.find((expert) => expert.id === booking.expertId)
  const availabilityExperts = booking.expertId === noPreferenceExpertId ? matchingExperts : matchingExperts.filter((expert) => expert.id === booking.expertId)
  const monthDays = getCalendarDays(calendarMonth)
  const todayKey = toDateKey(dateAtOffset(0))
  const lastDate = dateAtOffset(demoAvailability.daysAhead)
  const lastMonth = monthStart(lastDate)
  const maxDateKey = toDateKey(lastDate)
  const selectedTimes = getDemoTimes(booking.date, treatment?.durationMinutes ?? 0, availabilityExperts)

  useEffect(() => {
    if (errors.date) {
      bookingFormRef.current?.querySelector<HTMLButtonElement>('.booking-calendar-day:not(:disabled)')?.focus()
      return
    }
    if (errors.time) {
      bookingFormRef.current?.querySelector<HTMLButtonElement>('.booking-time-option')?.focus()
      return
    }
    bookingFormRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [errors])

  function updateBooking(updates: Partial<BookingState>) {
    setBooking((current) => ({ ...current, ...updates }))
  }

  function chooseCategory(category: TreatmentCategoryId) {
    if (category === booking.category) return
    const firstTreatment = pricedTreatments.find((item) => item.category === category)
    setBooking((current) => ({
      ...current,
      category,
      treatmentId: firstTreatment?.id ?? '',
      expertId: noPreferenceExpertId,
      date: '',
      time: '',
    }))
    setErrors({})
  }

  function chooseTreatment(treatmentId: string) {
    setBooking((current) => ({ ...current, treatmentId, expertId: noPreferenceExpertId, date: '', time: '' }))
    setErrors({})
  }

  function chooseDate(dateKey: string) {
    updateBooking({ date: dateKey, time: '' })
    setErrors((current) => ({ ...current, date: undefined, time: undefined }))
  }

  function validateStep() {
    if (step === 0 && !treatment) {
      setErrors({ treatment: 'Bitte wähle eine Behandlung aus.' })
      return false
    }
    if (step === 1 && booking.expertId !== noPreferenceExpertId && !matchingExperts.some((expert) => expert.id === booking.expertId)) {
      setErrors({ expert: 'Bitte wähle eine verfügbare Beauty Expert oder keine Präferenz.' })
      return false
    }
    if (step === 2) {
      const nextErrors: FormErrors = {}
      if (!booking.date) nextErrors.date = 'Bitte wähle ein Datum aus.'
      if (!booking.time) nextErrors.time = 'Bitte wähle eine verfügbare Uhrzeit aus.'
      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    }
    if (step === 3) {
      const nextErrors = validateCustomer(booking.customer)
      setErrors(nextErrors)
      return Object.keys(nextErrors).length === 0
    }
    setErrors({})
    return true
  }

  function goNext() {
    if (!validateStep()) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    setErrors({})
    setStep((current) => Math.max(current - 1, 0))
  }

  function updateCustomer(field: keyof CustomerDetails, value: string | boolean) {
    setBooking((current) => ({ ...current, customer: { ...current.customer, [field]: value } }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step !== 4 || !validateCustomer(booking.customer) || !booking.date || !booking.time) return
    setSubmitted(true)
    setBooking((current) => ({ ...current, customer: emptyCustomer }))
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step === 4) {
      submitRequest(event)
      return
    }
    goNext()
  }

  const calendarCells = monthDays.map((date, index) => {
    if (!date) return <span className="booking-calendar-empty" key={`empty-${index}`} aria-hidden="true" />
    const dateKey = toDateKey(date)
    const isSunday = (demoAvailability.closedWeekdays as readonly number[]).includes(date.getDay())
    const isUnavailable = dateKey < todayKey || dateKey > maxDateKey || isSunday || getDemoTimes(dateKey, treatment?.durationMinutes ?? 0, availabilityExperts).length === 0
    const isSelected = booking.date === dateKey
    return <button key={dateKey} className={`booking-calendar-day${isSelected ? ' is-selected' : ''}`} type="button" disabled={isUnavailable} aria-label={new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)} aria-pressed={isSelected} onClick={() => chooseDate(dateKey)}>{date.getDate()}</button>
  })

  function renderStep() {
    if (submitted) return <section className="booking-success" aria-live="polite">
      <span className="booking-success-mark"><Check size={27} /></span>
      <p className="eyebrow">DEMO · NICHT VERBINDLICH</p>
      <h2>Danke für deinen<br /><em>Moment.</em></h2>
      <p>Deine Demo-Anfrage wurde nur in dieser Ansicht dargestellt. Es wurde keine Buchung ausgelöst, keine E-Mail versendet und nichts gespeichert.</p>
      <Link to="/" className="button button-dark">Zur Startseite </Link>
    </section>

    if (step === 0) return <section className="booking-step-content" aria-labelledby="booking-step-heading">
      <p className="eyebrow">SCHRITT 01 · DEIN RITUAL</p><h2 id="booking-step-heading">Was darf es<br /><em>für dich sein?</em></h2>
      <fieldset className="booking-category-field"><legend className="booking-field-label">Behandlungsbereich</legend><div className="booking-category-options">{treatmentCategories.map((category) => <button key={category.id} type="button" className={`booking-category-option${booking.category === category.id ? ' is-selected' : ''}`} aria-pressed={booking.category === category.id} onClick={() => chooseCategory(category.id)}>{category.label}</button>)}</div></fieldset>
      <label className="booking-field-label" htmlFor="booking-treatment">Behandlung auswählen</label>
      <select className={`booking-select${errors.treatment ? ' has-error' : ''}`} id="booking-treatment" value={booking.treatmentId} onChange={(event) => chooseTreatment(event.target.value)} aria-invalid={Boolean(errors.treatment)} aria-describedby={errors.treatment ? 'booking-treatment-error' : 'booking-treatment-detail'}>
        {availableTreatments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
      </select>
      {errors.treatment && <p className="booking-error" id="booking-treatment-error" role="alert">{errors.treatment}</p>}
      {treatment && <div className="booking-treatment-detail" id="booking-treatment-detail"><div><span>Dauer</span><strong><Clock3 size={15} />{treatment.durationMinutes} Minuten</strong></div><div><span>Demo-Preis</span><strong>{formatPrice(treatment.priceEuro)}</strong></div><p>{treatment.description}</p></div>}
    </section>

    if (step === 1) return <section className="booking-step-content" aria-labelledby="booking-step-heading">
      <p className="eyebrow">SCHRITT 02 · PERSÖNLICH FÜR DICH</p><h2 id="booking-step-heading">Wer begleitet<br /><em>dich heute?</em></h2><p className="booking-step-intro">Für {treatment?.name ?? 'deine Behandlung'} stehen dir diese Beauty Experts zur Auswahl.</p>
      <div className="booking-expert-list" role="radiogroup" aria-label="Beauty Expert auswählen">
        <button type="button" className={`booking-expert booking-no-preference${booking.expertId === noPreferenceExpertId ? ' is-selected' : ''}`} role="radio" aria-checked={booking.expertId === noPreferenceExpertId} onClick={() => updateBooking({ expertId: noPreferenceExpertId, date: '', time: '' })}><span className="booking-no-preference-icon"><UserRound size={22} /></span><span><strong>Keine Präferenz</strong><small>Wir wählen einen passenden freien Termin.</small></span>{booking.expertId === noPreferenceExpertId && <Check size={17} />}</button>
        {matchingExperts.map((expert) => <button type="button" key={expert.id} className={`booking-expert${booking.expertId === expert.id ? ' is-selected' : ''}`} role="radio" aria-checked={booking.expertId === expert.id} onClick={() => updateBooking({ expertId: expert.id, date: '', time: '' })}><img src={expert.portrait} alt={`Demo-Porträt von ${expert.name}`} /><span><strong>{expert.name}</strong><small>{expert.role}</small></span>{booking.expertId === expert.id && <Check size={17} />}</button>)}
      </div>
      {errors.expert && <p className="booking-error" role="alert">{errors.expert}</p>}
    </section>

    if (step === 2) return <section className="booking-step-content" aria-labelledby="booking-step-heading">
      <p className="eyebrow">SCHRITT 03 · WANN PASST ES DIR?</p><h2 id="booking-step-heading">Deine Zeit.<br /><em>Dein Moment.</em></h2>
      <div className="booking-calendar" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'booking-date-error' : undefined}>
        <div className="booking-calendar-heading"><div><span className="booking-field-label">Datum auswählen</span><strong>{demoAvailability.months[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</strong></div><div className="booking-calendar-nav"><button type="button" aria-label="Vorheriger Monat" disabled={monthStart(calendarMonth).getTime() <= monthStart(dateAtOffset(0)).getTime()} onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1, 12))}>Zurück</button><button type="button" aria-label="Nächster Monat" disabled={monthStart(calendarMonth).getTime() >= lastMonth.getTime()} onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1, 12))}>Weiter</button></div></div>
        <div className="booking-calendar-grid" role="group" aria-label="Kalendertage">{demoAvailability.weekdays.slice(1).concat(demoAvailability.weekdays[0]).map((day) => <span className="booking-calendar-weekday" key={day}>{day}</span>)}{calendarCells}</div>
        {errors.date && <p className="booking-error" id="booking-date-error" role="alert">{errors.date}</p>}
      </div>
      <div className="booking-time-section" aria-invalid={Boolean(errors.time)} aria-describedby={errors.time ? 'booking-time-error' : undefined}><span className="booking-field-label">{booking.date ? `Verfügbare Zeiten · ${new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long' }).format(fromDateKey(booking.date))}` : 'Bitte zuerst ein Datum auswählen'}</span>
        {booking.date && selectedTimes.length > 0 ? <div className="booking-time-options" role="group" aria-label="Uhrzeit auswählen">{selectedTimes.map((time) => <button key={time} type="button" className={`booking-time-option${booking.time === time ? ' is-selected' : ''}`} aria-pressed={booking.time === time} onClick={() => { updateBooking({ time }); setErrors((current) => ({ ...current, time: undefined })) }}>{time} Uhr</button>)}</div> : <p className="booking-empty-times">{booking.date ? 'Für dieses Datum sind keine Demo-Zeiten verfügbar. Bitte wähle einen anderen Tag.' : 'Die Demo-Verfügbarkeiten berücksichtigen Behandlungslänge und Ruhetage.'}</p>}
      </div>
      {errors.time && <p className="booking-error" id="booking-time-error" role="alert">{errors.time}</p>}
      <p className="booking-availability-note"><CalendarDays size={14} /> Fiktive Demo-Verfügbarkeit · Sonntags geschlossen</p>
    </section>

    if (step === 3) return <section className="booking-step-content" aria-labelledby="booking-step-heading">
      <p className="eyebrow">SCHRITT 04 · EIN PAAR WORTE</p><h2 id="booking-step-heading">Wie dürfen<br /><em>wir dich nennen?</em></h2><p className="booking-step-intro">Deine Angaben werden ausschließlich lokal für diese Demo-Ansicht verwendet und nicht gespeichert oder versendet.</p>
      <div className="booking-form-grid">
        <div className="booking-form-field"><label htmlFor="booking-first-name">Vorname <span>*</span></label><input id="booking-first-name" autoComplete="given-name" value={booking.customer.firstName} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? 'error-first-name' : undefined} onChange={(event) => updateCustomer('firstName', event.target.value)} />{errors.firstName && <span className="booking-error" id="error-first-name">{errors.firstName}</span>}</div>
        <div className="booking-form-field"><label htmlFor="booking-last-name">Nachname <span>*</span></label><input id="booking-last-name" autoComplete="family-name" value={booking.customer.lastName} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? 'error-last-name' : undefined} onChange={(event) => updateCustomer('lastName', event.target.value)} />{errors.lastName && <span className="booking-error" id="error-last-name">{errors.lastName}</span>}</div>
        <div className="booking-form-field booking-form-wide"><label htmlFor="booking-email">E-Mail-Adresse <span>*</span></label><input id="booking-email" type="email" autoComplete="email" value={booking.customer.email} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'error-email' : undefined} onChange={(event) => updateCustomer('email', event.target.value)} />{errors.email && <span className="booking-error" id="error-email">{errors.email}</span>}</div>
        <div className="booking-form-field booking-form-wide"><label htmlFor="booking-phone">Telefonnummer <small>optional</small></label><input id="booking-phone" type="tel" autoComplete="tel" value={booking.customer.phone} onChange={(event) => updateCustomer('phone', event.target.value)} /></div>
        <div className="booking-form-field booking-form-wide"><label htmlFor="booking-message">Persönliche Nachricht <small>optional</small></label><textarea id="booking-message" rows={3} value={booking.customer.message} onChange={(event) => updateCustomer('message', event.target.value)} /></div>
        <div className="booking-consent-field booking-form-wide"><label><input type="checkbox" checked={booking.customer.privacyAccepted} aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={errors.privacyAccepted ? 'error-privacy' : undefined} onChange={(event) => updateCustomer('privacyAccepted', event.target.checked)} /><span>Ich habe die <Link to="/datenschutz" target="_blank" rel="noreferrer">Datenschutzhinweise</Link> gelesen und stimme der Verarbeitung meiner Angaben für diese Demo-Ansicht zu. <strong>*</strong></span></label>{errors.privacyAccepted && <span className="booking-error" id="error-privacy">{errors.privacyAccepted}</span>}</div>
      </div>
      <p className="booking-privacy-reminder">Wichtig: Das Formular sendet und speichert keine Daten. Die Zustimmung bezieht sich ausschließlich auf die temporäre Anzeige in deinem Browser.</p>
    </section>

    return <section className="booking-step-content booking-review" aria-labelledby="booking-step-heading">
      <p className="eyebrow">SCHRITT 05 · FAST BEI DEINEM MOMENT</p><h2 id="booking-step-heading">Einmal noch<br /><em>in Ruhe ansehen.</em></h2>
      <div className="booking-review-group"><div><span className="eyebrow">BEHANDLUNG</span><button type="button" onClick={() => setStep(0)}>Ändern</button></div><strong>{treatment?.name}</strong><p>{treatment?.durationMinutes} Minuten · {treatment && formatPrice(treatment.priceEuro)} Demo-Preis</p></div>
      <div className="booking-review-group"><div><span className="eyebrow">BEAUTY EXPERT</span><button type="button" onClick={() => setStep(1)}>Ändern</button></div><strong>{booking.expertId === noPreferenceExpertId ? 'Keine Präferenz' : selectedExpert?.name}</strong><p>{booking.expertId === noPreferenceExpertId ? 'Passende freie Mitarbeiterin' : selectedExpert?.role}</p></div>
      <div className="booking-review-group"><div><span className="eyebrow">DATUM & UHRZEIT</span><button type="button" onClick={() => setStep(2)}>Ändern</button></div><strong>{formatDate(booking.date)}</strong><p>{booking.time} Uhr · Fiktiver Verfügbarkeitsplan</p></div>
      <div className="booking-review-group"><div><span className="eyebrow">DEINE ANGABEN</span><button type="button" onClick={() => setStep(3)}>Ändern</button></div><strong>{booking.customer.firstName} {booking.customer.lastName}</strong><p>{booking.customer.email}{booking.customer.phone ? ` · ${booking.customer.phone}` : ''}</p>{booking.customer.message && <p>„{booking.customer.message}“</p>}</div>
      <div className="booking-review-price"><span>Demo-Preis</span><strong>{treatment ? formatPrice(treatment.priceEuro) : '—'}</strong></div>
      {errors.date && <p className="booking-error" role="alert">{errors.date}</p>}
    </section>
  }

  return <main className="booking-page">
    <div className="booking-page-heading"><p className="eyebrow">VELORA · BEAUTY HOUSE KÖLN</p><h1>Dein Termin.<br /><em>Dein Moment.</em></h1><DemoNotice /></div>
    {submitted ? <div className="booking-success-layout"><div>{renderStep()}</div><BookingSummary booking={booking} expert={selectedExpert} completed /></div> : <div className="booking-layout">
      <section className="booking-process" aria-label="Online-Terminbuchung">
        <nav className="booking-progress" aria-label="Buchungsschritte">
          {steps.map((label, index) => <button type="button" key={label} className={`booking-progress-step${index === step ? ' is-current' : ''}${index < step ? ' is-complete' : ''}`} aria-current={index === step ? 'step' : undefined} disabled={index >= step} onClick={() => { setStep(index); setErrors({}) }}><span>{index < step ? <Check size={13} /> : String(index + 1).padStart(2, '0')}</span><small>{label}</small></button>)}
        </nav>
        <form ref={bookingFormRef} onSubmit={handleFormSubmit} noValidate>
          <AnimatePresence mode="wait" initial={false}><motion.div key={submitted ? 'success' : step} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reducedMotion ? 0 : .22 }}>{renderStep()}</motion.div></AnimatePresence>
          {!submitted && <div className="booking-form-actions">{step > 0 && <button type="button" className="booking-back" onClick={goBack}>Zurück</button>}{step < steps.length - 1 ? <button type="submit" className="button button-dark">Weiter </button> : <button type="submit" className="button button-dark">Terminanfrage senden </button>}</div>}
        </form>
        <p className="booking-required-note">* Erforderliche Angaben · Alle verfügbaren Termine sind fiktiv.</p>
      </section>
      <BookingSummary booking={booking} expert={selectedExpert} />
    </div>}
  </main>
}

export default BookingWizard
