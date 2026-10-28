import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Clock3, Menu, Minus, Plus, X } from 'lucide-react'
import { getEditorialImage, type EditorialImage } from './data/visualAssets'
import { beautyExperts } from './data/booking'
import { pricedTreatments, treatmentCategories, type TreatmentCategoryId } from './data/treatments'
import { findSkinProduct, formatSkinPrice, skinProducts } from './data/skinProducts'
import BookingWizard from './BookingWizard'
import { CartButton } from './CartContext'
import { useCart } from './cartStore'
import { ProductArtwork, type ArtworkView } from './ProductArtwork'
import { RouteSEO } from './SEO'

type Treatment = {
  title: string
  subtitle: string
  path: string
  index: string
  visual: string
  image: EditorialImage
  description: string
  bookingCategory: TreatmentCategoryId
}

const treatments: Treatment[] = [
  { title: 'Lashes & Brows', subtitle: 'Der Ausdruck im Detail', path: '/treatments/lashes-brows', index: '01', visual: 'visual-lashes', image: 'lashes', description: 'Feine Akzente, die deinen natürlichen Ausdruck unterstreichen. Entdecke individuell abgestimmte Treatments für Wimpern und Brauen.', bookingCategory: 'lashes-brows' },
  { title: 'Nails & Manicure', subtitle: 'Zeitlose Handpflege', path: '/treatments/nails', index: '02', visual: 'visual-nails', image: 'nails', description: 'Ein gepflegter Look beginnt mit einem Moment für dich. Von klassischer Maniküre bis zu sorgfältig gestalteten Nägeln.', bookingCategory: 'nails' },
  { title: 'Face & Skin', subtitle: 'Pflege, die sich gut anfühlt', path: '/treatments/face-skin', index: '03', visual: 'visual-face', image: 'facial', description: 'Individuelle Gesichtsbehandlungen und apparative Kosmetik – abgestimmt auf deine Wünsche und dein persönliches Pflegeritual.', bookingCategory: 'facial-skin' },
  { title: 'Body & Laser', subtitle: 'Ein gutes Körpergefühl', path: '/treatments/body-laser', index: '04', visual: 'visual-body', image: 'bodyLaser', description: 'Entspannende Body Treatments und Laser-Haarentfernung in ruhiger, persönlicher Atmosphäre.', bookingCategory: 'body' },
]

const navGroups = [
  { title: 'Alle Treatments', path: '/treatments' },
  ...treatments.map(({ title, path }) => ({ title, path })),
]

function Brand({ light = false }: { light?: boolean }) {
  return <Link className={`brand${light ? ' brand-light' : ''}`} to="/" aria-label="VELORA Startseite">
    <span className="brand-name">VELORA</span>
    <span className="brand-caption">BEAUTY HOUSE · KÖLN</span>
  </Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const mobileNavigationRef = useRef<HTMLElement>(null)
  const mobileMenuWasOpen = useRef(false)
  const location = useLocation()
  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    if (mobileNavigationRef.current) {
      mobileNavigationRef.current.inert = !open
      mobileNavigationRef.current.setAttribute('aria-hidden', String(!open))
    }
    if (open) {
      mobileMenuWasOpen.current = true
      const closeOnEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false)
      }
      window.addEventListener('keydown', closeOnEscape)
      return () => window.removeEventListener('keydown', closeOnEscape)
    }
    if (mobileMenuWasOpen.current) {
      mobileMenuWasOpen.current = false
      mobileToggleRef.current?.focus()
    }
  }, [open])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Hauptnavigation">
        <div className="nav-dropdown">
          <NavLink to="/treatments" className={({ isActive }) => isActive ? 'active' : ''}>Treatments</NavLink>
          <div className="dropdown-panel">{navGroups.map(item => <Link key={item.path} to={item.path}>{item.title}</Link>)}</div>
        </div>
        <NavLink to="/collection">Skin Collection</NavLink>
        <NavLink to="/about">Über uns</NavLink>
        <NavLink to="/contact">Kontakt</NavLink>
      </nav>
      <CartButton />
      <Link to="/book" className="button button-dark header-book">Termin buchen </Link>
      <button ref={mobileToggleRef} className="mobile-toggle" aria-label={open ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    <AnimatePresence>
      {open && <motion.nav ref={mobileNavigationRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobile Navigation" aria-hidden={!open} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }}>
        <Link to="/treatments">Treatments </Link>
        <Link to="/collection">Skin Collection </Link>
        <Link to="/about">Über uns </Link>
        <Link to="/contact">Kontakt </Link>
        <Link to="/book" className="button button-dark mobile-book">Termin buchen </Link>
      </motion.nav>}
    </AnimatePresence>
  </header>
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion()
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reducedMotion ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function Visual({ variant, label, className = '', asset, loading = 'lazy' }: { variant: string; label?: string; className?: string; asset?: EditorialImage; loading?: 'eager' | 'lazy' }) {
  const image = asset ? getEditorialImage(asset) : undefined
  return <div className={`art-visual ${variant} ${className}${image ? ' has-image' : ''}`} role="img" aria-label={label ?? 'Abstrakte VELORA Bildwelt als Platzhalter'}>
    <span className="art-shape art-shape-one" /><span className="art-shape art-shape-two" /><span className="art-shape art-shape-three" />
    {image && <img className="art-image" src={image} alt="" loading={loading} decoding="async" fetchPriority={loading === 'eager' ? 'high' : 'auto'} />}
    <span className="art-caption">VELORA · BEAUTY HOUSE</span>
  </div>
}

function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const sceneScale = useSpring(useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.1]), { stiffness: 80, damping: 24, mass: 0.4 })
  const sceneY = useSpring(useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, -25]), { stiffness: 80, damping: 24, mass: 0.4 })
  const pointerX = useSpring(useMotionValue(0), { stiffness: 80, damping: 22, mass: 0.5 })
  const pointerY = useSpring(useMotionValue(0), { stiffness: 80, damping: 22, mass: 0.5 })

  function moveWithPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 14)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return <section ref={heroRef} className="hero">
    <motion.div className="hero-copy" initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}>
      <p className="eyebrow hero-eyebrow">VELORA — BEAUTY HOUSE, KÖLN</p>
      <h1><span className="hero-title-line">Beauty,</span><span className="hero-title-bridge">auf deine</span><span className="hero-title-line hero-title-accent">Art.</span></h1>
      <p className="hero-description">Ausdrucksstarke Brows. Feine Nails. Frische Haut. Treatments, die deinen Stil unterstreichen.</p>
      <div className="hero-actions"><Link to="/book" className="button button-dark">Termin buchen </Link><Link to="/treatments" className="text-link">Treatments entdecken </Link></div>
    </motion.div>
    <motion.div className="hero-art-wrap" style={{ scale: sceneScale, y: sceneY }} onPointerMove={moveWithPointer} onPointerLeave={resetPointer}>
      <motion.div className="hero-art-depth" style={{ x: pointerX, y: pointerY }}>
        <Visual variant="hero-art" asset="hero" label="Beauty-Porträt mit ausdrucksstarkem Augen-Make-up" loading="eager" />
      </motion.div>
    </motion.div>
    <a href="#intro" className="scroll-cue" aria-label="Weiter zum Inhalt"><span>Scrollen</span></a>
  </section>
}

function SectionHeading({ eyebrow, title, text, centered = false }: { eyebrow: string; title: React.ReactNode; text?: string; centered?: boolean }) {
  return <div className={`section-heading${centered ? ' centered' : ''}`}><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{text && <p className="section-copy">{text}</p>}</div>
}

function TreatmentGrid({ compact = false }: { compact?: boolean }) {
  const list = compact ? treatments.slice(0, 4) : treatments
  return <div className="treatment-grid">{list.map((item, index) => <Reveal key={item.path} className={`treatment-card card-${index + 1}`} delay={index * 0.07}>
    <Link to={item.path} className="treatment-link">
      <Visual variant={item.visual} asset={item.image} label={`${item.title} – Beauty-Porträt`} />
      <div className="treatment-meta"><span className="eyebrow">{item.index} / {item.subtitle}</span></div>
      <h3>{item.title}</h3>
    </Link>
  </Reveal>)}</div>
}

function ProductRow() {
  return <div className="product-grid">{skinProducts.slice(0, 3).map((product, index) => <Reveal key={product.id} delay={index * .08}><ProductCard product={product} index={index} /></Reveal>)}</div>
}

function ProductCard({ product, index }: { product: typeof skinProducts[number]; index: number }) {
  return <Link className="skin-product-card" to={`/collection/${product.id}`}>
    <div className="skin-product-card-art"><ProductArtwork product={product} /><span className="product-number">0{index + 1}</span></div>
    <div className="skin-product-card-copy"><p className="eyebrow">{product.collection} · {product.volume}</p><h3>{product.name}</h3><div><span>{formatSkinPrice(product.priceEuro)} <small>Demo-Preis</small></span><span className="skin-product-discover">Produkt entdecken </span></div></div>
  </Link>
}

function RitualFinder() {
  const [selected, setSelected] = useState(0)
  const ritual = treatments[selected]
  return <section className="ritual-finder section-pad" aria-labelledby="ritual-title">
    <Reveal className="ritual-intro"><p className="eyebrow">WORAUF HAST DU HEUTE LUST?</p><h2 id="ritual-title">Ein kleines Ritual.<br /><em>Ein neues Gefühl.</em></h2><p>Wähle deinen Fokus und entdecke deinen nächsten Beauty-Moment.</p>
      <div className="ritual-options" role="group" aria-label="Beauty-Fokus auswählen">{treatments.map((item, index) => <button key={item.path} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.title}</button>)}</div>
    </Reveal>
    <div className="ritual-feature">
      <img key={ritual.image} src={getEditorialImage(ritual.image)} alt={ritual.title + ' – Beauty-Inspiration'} loading="lazy" />
      <div className="ritual-caption" aria-live="polite"><p className="eyebrow">DEIN FOKUS · {ritual.index}</p><h3>{ritual.subtitle}</h3><p>{ritual.description}</p><Link className="button button-dark" to={ritual.path}>Treatment entdecken</Link></div>
    </div>
  </section>
}

function BeautyJournal() {
  const moments: { asset: EditorialImage; title: string; note: string; path: string }[] = [
    { asset: 'studioDetails', title: 'Die kleinen Dinge.', note: 'TEXTUREN · LICHT · RUHE', path: '/about' },
    { asset: 'treatments', title: 'Zeit, die dir gehört.', note: 'CARE · DEIN PERSÖNLICHES RITUAL', path: '/treatments' },
    { asset: 'studioReception', title: 'Ankommen. Durchatmen.', note: 'DAS VELORA STUDIOKONZEPT', path: '/about' },
  ]
  return <section className="beauty-journal section-pad" aria-labelledby="journal-title"><Reveal><p className="eyebrow">THE VELORA EDIT</p><h2 id="journal-title">Schönheit steckt<br /><em>in den Details.</em></h2></Reveal><div className="journal-grid">{moments.map((moment, index) => <Reveal key={moment.title} delay={index * .08}><Link to={moment.path} className="journal-card"><div className="journal-image"><img src={getEditorialImage(moment.asset)} alt={moment.title} loading="lazy" /></div><p className="eyebrow">{moment.note}</p><h3>{moment.title}</h3><span className="text-link">Mehr entdecken</span></Link></Reveal>)}</div></section>
}

function Home() {
  return <>
    <main>
      <CinematicHero />

      <section className="intro-section section-pad" id="intro"><Reveal className="intro-index"><span>01</span><span className="index-rule" />EIN GEFÜHL, DAS BLEIBT</Reveal><Reveal className="intro-content"><p className="eyebrow">WILLKOMMEN BEI VELORA</p><h2>Schönheit ist<br /><em>persönlich.</em></h2></Reveal><Reveal className="intro-copy"><p>Bei VELORA beginnt jedes Treatment mit einem offenen Ohr. Wir glauben an individuelle Beratung, ein gutes Gefühl und Ästhetik, die zu dir passt.</p><p>In unserem Beauty House in Köln findest du Raum für moderne Treatments und kleine Rituale, die ganz dir gehören.</p><Link className="text-link" to="/about">VELORA kennenlernen </Link></Reveal></section>

      <section className="treatments-section section-pad"><Reveal><SectionHeading eyebrow="UNSERE TREATMENTS · 02" title={<>Zeit für das,<br /><em>was dir guttut.</em></>} text="Entdecke unsere Beauty-Welt – sorgfältig zusammengestellt und auf dich abgestimmt." /></Reveal><TreatmentGrid compact /><div className="center-action"><Link to="/treatments" className="button button-outline">Alle Treatments entdecken </Link></div></section>

      <RitualFinder />

      <section className="experience-section"><Visual variant="experience-art" asset="studio" label="Warme Studio-Atmosphäre des VELORA Demokonzepts" /><Reveal className="experience-copy"><p className="eyebrow">DAS VELORA GEFÜHL · 03</p><h2>Mehr als ein<br /><em>Termin.</em></h2><p>Ein Besuch bei uns ist eine Einladung, kurz innezuhalten. Mit Ruhe, aufmerksamer Betreuung und einem Blick für die Details gestalten wir dein persönliches Beauty-Ritual.</p><Link to="/about" className="text-link">Unser Anspruch </Link></Reveal><span className="experience-vertical">BEAUTY IN EVERY DETAIL.</span></section>

      <section className="collection-section section-pad"><div className="collection-header"><Reveal><p className="eyebrow">VELORA SKIN COLLECTION · 04</p><h2>Pflege, <em>die bleibt.</em></h2></Reveal><Reveal><p className="collection-copy">Eine kuratierte Welt aus Pflege-Essentials – mit Liebe zu Form, Textur und den kleinen Momenten deiner Routine.</p><Link to="/collection" className="text-link">Kollektion entdecken </Link></Reveal></div><ProductRow /><div className="collection-demo-note">Fiktive Produktwelt · Demo-Preise · Keine echten Bestellungen</div></section>

      <BeautyJournal />

      <section className="book-cta"><div className="cta-ornament">V</div><Reveal><p className="eyebrow">EIN MOMENT NUR FÜR DICH</p><h2>Dein Moment.<br /><em>Deine Schönheit.</em></h2><Link to="/book" className="button button-light">Jetzt Termin entdecken </Link></Reveal><span className="cta-foot">VELORA · BEAUTY HOUSE KÖLN</span></section>
    </main>
  </>
}

function PageHero({ eyebrow, title, description, visual = 'inner-art', asset }: { eyebrow: string; title: React.ReactNode; description: string; visual?: string; asset?: EditorialImage }) {
  return <section className="page-hero"><div className="page-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-description">{description}</p></div><Visual variant={visual} asset={asset} label={asset ? `${eyebrow} – Bildmotiv` : undefined} /></section>
}

function TreatmentsPage() {
  return <main><PageHero eyebrow="DIE VELORA BEAUTY WELT" title={<>Treatments,<br /><em>die zu dir passen.</em></>} description="Entdecke unsere Behandlungen für deinen persönlichen Beauty-Moment. Wir beraten dich gerne individuell." visual="treatments-art" asset="treatments" /><section className="inner-section section-pad"><SectionHeading eyebrow="FINDE DEIN RITUAL" title={<>Schönheit in<br /><em>deiner Zeit.</em></>} text="Wähle den Bereich, der dich anspricht – gemeinsam finden wir heraus, was zu dir passt." /><TreatmentGrid /></section><TreatmentPriceList /><BookingStrip /></main>
}

function TreatmentPriceList() {
  const [activeCategory, setActiveCategory] = useState<TreatmentCategoryId>(treatmentCategories[0].id)
  const reducedMotion = useReducedMotion()
  const activeTreatments = pricedTreatments.filter((treatment) => treatment.category === activeCategory)
  const formatPrice = (price: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)

  function selectWithKeyboard(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % treatmentCategories.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + treatmentCategories.length) % treatmentCategories.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = treatmentCategories.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    const category = treatmentCategories[nextIndex]
    setActiveCategory(category.id)
    document.getElementById(`treatment-tab-${category.id}`)?.focus()
  }

  return <section className="price-section section-pad" aria-labelledby="price-heading">
    <div className="price-heading"><p className="eyebrow">DAS VELORA MENÜ · DEMO-PREISE</p><h2 id="price-heading">Dein Treatment.<br /><em>Ganz transparent.</em></h2><p>Alle Leistungen und Preise sind fiktive Inhalte für dieses Portfolio-Demoprojekt.</p></div>
    <div className="treatment-tabs" role="tablist" aria-label="Behandlungskategorie auswählen">
      {treatmentCategories.map((category, index) => <button key={category.id} id={`treatment-tab-${category.id}`} className={`treatment-tab${activeCategory === category.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={activeCategory === category.id} aria-controls="treatment-price-panel" tabIndex={activeCategory === category.id ? 0 : -1} onClick={() => setActiveCategory(category.id)} onKeyDown={(event) => selectWithKeyboard(event, index)}>{category.label}<span>{String(index + 1).padStart(2, '0')}</span></button>)}
    </div>
    <div className="price-table" id="treatment-price-panel" role="tabpanel" aria-labelledby={`treatment-tab-${activeCategory}`}>
      <div className="price-table-head" aria-hidden="true"><span>BEHANDLUNG</span><span>DAUER</span><span>PREIS</span><span /></div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={activeCategory} className="price-rows" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reducedMotion ? 0 : .24 }}>
          {activeTreatments.map((treatment) => <article className="price-row" key={treatment.id}>
            <div className="price-treatment"><h3>{treatment.name}</h3><p>{treatment.description}</p></div>
            <span className="price-duration"><Clock3 size={14} aria-hidden="true" />{treatment.durationMinutes} Min.</span>
            <span className="price-amount">{formatPrice(treatment.priceEuro)} <small>Demo</small></span>
            <Link className="price-book" to={`/book?service=${encodeURIComponent(treatment.id)}`} aria-label={`${treatment.name} für ${formatPrice(treatment.priceEuro)} als Wunschtermin auswählen`}>Termin buchen </Link>
          </article>)}
        </motion.div>
      </AnimatePresence>
    </div>
    <p className="price-footnote">Demo-Preise, Dauer und Leistungsbeschreibungen sind unverbindliche Beispielangaben. Keine echten Buchungen.</p>
  </section>
}

function TreatmentPage({ treatment }: { treatment: Treatment }) {
  return <main><PageHero eyebrow={`VELORA TREATMENTS · ${treatment.index}`} title={<>{treatment.title.split(' & ')[0]} <em>& {treatment.title.split(' & ')[1]}</em></>} description={treatment.description} visual={treatment.visual} asset={treatment.image} /><section className="inner-section section-pad detail-section"><div><p className="eyebrow">DEIN MOMENT, DEIN RITUAL</p><h2>{treatment.subtitle}<br /><em>mit VELORA.</em></h2></div><p>Jede Behandlung beginnt mit einem persönlichen Gespräch. So entsteht ein Treatment, das sich an deinen Wünschen orientiert – in deinem Tempo und in entspannter Atmosphäre.</p></section><BookingStrip category={treatment.bookingCategory} /></main>
}

function CollectionPage() {
  return <main className="skin-collection-page">
    <section className="skin-collection-hero"><div className="skin-collection-copy"><p className="eyebrow">VELORA · SKIN COLLECTION</p><h1>The Art of<br /><em>Radiant Skin</em></h1><p className="skin-collection-subtitle">Elevated skincare. Timeless beauty.</p><p className="skin-collection-intro">Pflege als tägliches Ritual: ausgewählte Texturen, klare Formen und eine ruhige Ästhetik. Die VELORA Skin Collection vereint Essentials für Momente, die ganz dir gehören.</p><a className="button button-dark" href="#kollektion">Kollektion entdecken </a><span className="skin-collection-caption">FIKTIVE PRODUKTWELT · DEMO-PREISE</span></div><div className="skin-collection-hero-art"><ProductArtwork product={skinProducts[0]} view="ritual" loading="eager" /><span className="skin-hero-stamp">CARE<br />AS A RITUAL</span><span className="skin-hero-index">VELORA FORMULA STUDIES · 01—06</span></div></section>
    <section className="skin-collection-story"><p className="eyebrow">WENIGER, MIT BEDACHT</p><h2>Schöne Routinen<br /><em>beginnen mit Gefühl.</em></h2><p>Eine fiktive Kollektion, inspiriert von bewusster Pflege und zeitlosem Design. Entdecke sechs Produktideen – sorgfältig gestaltet, ehrlich beschrieben und ohne unbelegte Wirkversprechen.</p></section>
    <section className="skin-shop section-pad" id="kollektion"><div className="skin-shop-heading"><div><p className="eyebrow">DIE KOLLEKTION · 01—06</p><h2>Dein tägliches<br /><em>Hautgefühl.</em></h2></div><p>Jedes Produkt ist Teil einer fiktiven Demo-Kollektion. Preise und Inhaltsstoffangaben sind unverbindliche Beispielinhalte.</p></div><div className="skin-shop-grid">{skinProducts.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div><p className="skin-shop-footnote">VELORA SKIN COLLECTION · FIKTIVE PRODUKTE · KEINE ECHTEN BESTELLUNGEN</p></section>
  </main>
}

function SkinProductPage() {
  const { productId } = useParams()
  const product = findSkinProduct(productId)
  const [view, setView] = useState<ArtworkView>('front')
  const [quantity, setQuantity] = useState(1)
  const { addProduct } = useCart()

  if (!product) return <main className="not-found"><p className="eyebrow">PRODUKT NICHT GEFUNDEN</p><h1>Dieser Moment<br /><em>ist woanders.</em></h1><Link className="text-link" to="/collection">Zur Kollektion </Link></main>

  const galleryViews: { id: ArtworkView; label: string }[] = [
    { id: 'front', label: 'Produktansicht' },
    { id: 'detail', label: 'Detailansicht' },
    { id: 'ritual', label: 'Ritualansicht' },
  ]

  return <main className="skin-product-page">
    <nav className="skin-breadcrumb" aria-label="Brotkrumennavigation"><Link to="/">VELORA</Link><Link to="/collection">Skin Collection</Link><span>{product.name}</span></nav>
    <section className="skin-product-detail">
      <div className="skin-product-gallery"><div className="skin-product-main-art"><ProductArtwork product={product} view={view} loading="eager" /><span className="skin-product-gallery-label">{product.collection} · {product.volume}</span></div><div className="skin-gallery-thumbnails" role="group" aria-label="Produktansicht auswählen">{galleryViews.map((galleryView, index) => <button key={galleryView.id} type="button" className={`skin-gallery-thumb${view === galleryView.id ? ' is-active' : ''}`} aria-label={galleryView.label} aria-pressed={view === galleryView.id} onClick={() => setView(galleryView.id)}><ProductArtwork product={product} view={galleryView.id} /><span>0{index + 1}</span></button>)}</div></div>
      <div className="skin-product-info"><p className="eyebrow">VELORA SKIN COLLECTION · {product.collection}</p><h1>{product.name}</h1><p className="skin-product-description">{product.description}</p><p className="skin-product-price">{formatSkinPrice(product.priceEuro)} <small>Demo-Preis · {product.volume}</small></p><div className="skin-product-facts"><div><span>HAUTTYP</span><strong>{product.skinType}</strong></div><div><span>GRÖSSE</span><strong>{product.volume}</strong></div></div><div className="skin-quantity-row"><span className="eyebrow">MENGE</span><div className="skin-quantity-control"><button type="button" aria-label="Menge verringern" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={14} /></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Menge erhöhen" onClick={() => setQuantity((current) => current + 1)}><Plus size={14} /></button></div></div><button className="button button-dark skin-add-to-cart" type="button" onClick={() => addProduct(product, quantity)}>In den Warenkorb </button><p className="skin-demo-inline">Demo-Warenkorb · Keine Bestellung, Zahlung oder Datenspeicherung</p><div className="skin-product-accordions"><details><summary>Anwendung</summary><p>{product.application}</p></details><details><summary>Inhaltsstoff-Highlights</summary><p>{product.ingredientHighlights.join(' · ')}</p><p>Fiktive Formulierungsinspiration – keine vollständige INCI-Liste.</p></details><details><summary>Produktdetails</summary><p>{product.name} · {product.volume}. Fiktives Portfolio-Produkt ohne reale Verfügbarkeit oder Produktversprechen.</p></details></div></div>
    </section>
    <section className="skin-related section-pad"><div><p className="eyebrow">DIE VELORA SKIN COLLECTION</p><h2>Weitere Pflege-<em>momente.</em></h2></div><div className="skin-related-links">{skinProducts.filter((item) => item.id !== product.id).slice(0, 3).map((item) => <Link to={`/collection/${item.id}`} key={item.id}><span>{item.collection}</span><strong>{item.name}</strong></Link>)}</div></section>
  </main>
}

function AboutPage() {
  const principles = [
    { number: '01', title: 'Personal Consultation', text: 'Deine Wünsche und Bedürfnisse geben dem Gespräch die Richtung.' },
    { number: '02', title: 'Tailored Treatments', text: 'Behandlungen, die zu deinem persönlichen Beauty-Moment passen.' },
    { number: '03', title: 'Modern Expertise', text: 'Moderne Methoden und ein sorgfältiger Blick für jedes Detail.' },
    { number: '04', title: 'Lasting Care', text: 'Pflegeimpulse, die dich auch über deinen Besuch hinaus begleiten.' },
  ]

  return <main className="about-page">
    <section className="about-hero">
      <div className="about-hero-copy"><p className="eyebrow">VELORA · BEAUTY HOUSE KÖLN</p><h1>Beauty is personal.<br /><em>So are we.</em></h1><p>Ein Ort für Schönheit, die sich nach dir anfühlt. Mit persönlicher Beratung, modernen Beauty-Ritualen und Raum zum Ankommen.</p><a className="text-link" href="#philosophie">Unsere Philosophie </a></div>
      <div className="about-hero-art"><Visual variant="about-art about-hero-visual" asset="studio" label="Illustrative Aufnahme eines Beauty-Studio-Interieurs für das fiktive VELORA Konzept" loading="eager" /><span className="about-image-note">STUDIO ATMOSPHÄRE · VISUELLES KONZEPT</span><span className="about-hero-index">KÖLN · 50° 56′ N</span></div>
    </section>

    <section className="about-philosophy section-pad" id="philosophie">
      <Reveal className="about-section-index"><span>01</span><i /> DIE VELORA PHILOSOPHIE</Reveal>
      <Reveal className="about-philosophy-heading"><p className="eyebrow">THE VELORA PHILOSOPHY</p><h2>Schönheit ist<br /><em>persönlich.</em></h2></Reveal>
      <Reveal className="about-philosophy-copy"><h3>Beauty is personal.<br />So are we.</h3><p>Wir glauben an individuelle Schönheit statt an vorgegebene Ideale. Bei VELORA beginnt jedes Ritual mit einem offenen Ohr: für deine Wünsche, deine Haut und das, was dir guttut.</p><p>Persönliche Beratung, moderne Beauty-Technologien und hochwertige Pflege verbinden sich mit Ruhe und Zeit für dich. VELORA ist ein fiktives Beauty House – entworfen als Einladung, den eigenen Moment bewusst zu erleben.</p></Reveal>
    </section>

    <section className="about-experience">
      <div className="about-experience-heading section-pad"><Reveal><p className="eyebrow">EIN ORT ZUM ANKOMMEN · 02</p><h2>The salon<br /><em>experience.</em></h2><p>Warme Materialien, sanftes Licht und ausgewählte Details bilden den Rahmen für deine persönliche Auszeit.</p></Reveal></div>
      <div className="about-gallery" aria-label="Einblicke in die fiktive VELORA Studio-Atmosphäre">
        <Reveal className="about-gallery-item about-gallery-entry"><Visual variant="about-gallery-visual about-gallery-entry-art" asset="studioReception" label="Illustrative Aufnahme eines modernen Studio-Interieurs" /><span className="about-gallery-label">01 / STUDIOINTERIEUR</span></Reveal>
        <Reveal className="about-gallery-item about-gallery-treatment" delay={.08}><Visual variant="about-gallery-visual about-gallery-treatment-art" asset="studioTreatment" label="Illustrative Aufnahme eines Beauty-Studio-Bereichs" /><span className="about-gallery-label">02 / STUDIOBEREICH</span></Reveal>
        <Reveal className="about-gallery-item about-gallery-detail" delay={.12}><Visual variant="about-gallery-visual about-gallery-detail-art" asset="studioDetails" label="Illustrative Aufnahme einer Beauty-Station im Studio" /><span className="about-gallery-label">03 / BEAUTY-STATION</span></Reveal>
        <Reveal className="about-gallery-note" delay={.16}><span className="eyebrow">RUHE IN JEDEM DETAIL</span><p>Ein bewusst gestalteter Rahmen – zurückhaltend, warm und ganz auf deinen Moment ausgerichtet.</p><span className="about-image-note">VISUELLE INSPIRATION · FIKTIVES STUDIO</span></Reveal>
      </div>
    </section>

    <section className="about-team section-pad" id="beauty-experts">
      <Reveal className="about-team-heading"><div><p className="eyebrow">MEET OUR BEAUTY EXPERTS · 03</p><h2>Persönlich.<br /><em>Mit Gefühl.</em></h2></div><p>Drei fiktive Beauty-Expertinnen begleiten dich mit unterschiedlichen Schwerpunkten. Wähle im Demo-Buchungsablauf, wen du gerne anfragen möchtest.</p></Reveal>
      <div className="about-team-grid">{beautyExperts.map((expert, index) => <Reveal className={`about-expert about-expert-${expert.id}`} delay={index * .08} key={expert.id}>
        <div className="about-expert-portrait"><img src={expert.portrait} alt={`Demo-Porträt von ${expert.name}`} loading="lazy" decoding="async" /><span>FIKTIVES PROFIL · DEMO-PORTRÄT</span></div>
        <div className="about-expert-meta"><span className="eyebrow">BEAUTY EXPERT · 0{index + 1}</span><h3>{expert.name}</h3><p className="about-expert-role">{expert.role}</p><p className="about-expert-bio">{expert.bio}</p><Link to={`/book?expert=${encodeURIComponent(expert.id)}`} className="about-expert-cta">Termin bei {expert.name} anfragen </Link></div>
      </Reveal>)}</div>
      <p className="about-team-note">Alle Teamprofile sind fiktive Demoinhalte. Die dargestellten Rollen und Schwerpunkte sind keine realen Qualifikationsnachweise.</p>
    </section>

    <section className="about-approach section-pad">
      <div className="about-approach-heading"><Reveal><p className="eyebrow">UNSER ANSATZ · 04</p><h2>Care, with<br /><em>intention.</em></h2><p>Ein paar Gedanken, die jedes VELORA Ritual prägen.</p></Reveal></div>
      <div className="about-principles">{principles.map((principle) => <Reveal className="about-principle" key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p><i aria-hidden="true" /></Reveal>)}</div>
    </section>
    <BookingStrip />
    <p className="about-demo-note">VELORA ist ein fiktives Konzeptprojekt zur Demonstration von Webdesign, Frontend-Entwicklung und interaktiven Buchungs- und Shop-Funktionen. Es handelt sich nicht um einen realen Salon.</p>
  </main>
}

type ContactFields = { name: string; email: string; phone: string; subject: string; message: string }
type ContactField = keyof ContactFields

const emptyContactFields: ContactFields = { name: '', email: '', phone: '', subject: '', message: '' }

function ContactPage() {
  const [fields, setFields] = useState<ContactFields>(emptyContactFields)
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({})
  const [sent, setSent] = useState(false)

  function updateField(field: ContactField, value: string) {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSent(false)
  }

  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Partial<Record<ContactField, string>> = {}
    if (!fields.name.trim()) nextErrors.name = 'Bitte gib deinen Namen ein.'
    if (!fields.email.trim()) nextErrors.email = 'Bitte gib deine E-Mail-Adresse ein.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) nextErrors.email = 'Bitte prüfe das Format deiner E-Mail-Adresse.'
    if (!fields.subject.trim()) nextErrors.subject = 'Bitte gib einen Betreff ein.'
    if (!fields.message.trim()) nextErrors.message = 'Bitte schreibe eine kurze Nachricht.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setFields(emptyContactFields)
    setSent(true)
  }

  return <main className="contact-page">
    <section className="contact-hero">
      <div className="contact-hero-copy"><p className="eyebrow">VELORA · WIR SIND FÜR DICH DA</p><h1>Let’s make<br /><em>time for you.</em></h1><p>Ein schöner Moment beginnt manchmal mit einem Gespräch. Teile deine Frage mit uns – in dieser Demo bleibt sie ganz bei dir.</p><a className="text-link" href="#kontaktformular">Zum Kontaktformular </a></div>
      <div className="contact-hero-art"><Visual variant="contact-art contact-hero-visual" asset="location" label="Illustrative Aufnahme eines Studio-Interieurs als visuelles Standortkonzept in Köln" /><span className="contact-art-caption">KÖLN · VISUELLES STANDORTKONZEPT</span></div>
    </section>
    <section className="contact-main section-pad" id="kontaktformular">
      <div className="contact-form-column">
        <p className="eyebrow">SCHREIB UNS · NUR DEMO</p><h2>Was liegt dir<br /><em>am Herzen?</em></h2>
        <p className="contact-form-intro">Das Formular simuliert eine Nachricht lokal in deinem Browser. Es wird nichts versendet oder gespeichert.</p>
        {sent ? <div className="contact-success" role="status" aria-live="polite"><span className="eyebrow">DEMO · NICHT VERSENDET</span><h3>Danke für deine Nachricht.</h3><p>Deine Eingaben wurden direkt wieder aus dem Formular entfernt. Es wurde keine Nachricht versendet und nichts gespeichert.</p><button type="button" className="button button-outline" onClick={() => setSent(false)}>Weitere Demo-Nachricht verfassen</button></div> : <form className="contact-form" onSubmit={submitContact} noValidate>
          <div className="contact-field"><label htmlFor="contact-name">Name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" autoComplete="name" maxLength={100} value={fields.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />{errors.name && <span className="contact-error" id="contact-name-error" role="alert">{errors.name}</span>}</div>
          <div className="contact-field"><label htmlFor="contact-email">E-Mail-Adresse <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} value={fields.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />{errors.email && <span className="contact-error" id="contact-email-error" role="alert">{errors.email}</span>}</div>
          <div className="contact-field"><label htmlFor="contact-phone">Telefon <small>optional</small></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} value={fields.phone} onChange={(event) => updateField('phone', event.target.value)} /></div>
          <div className="contact-field"><label htmlFor="contact-subject">Betreff <span aria-hidden="true">*</span></label><input id="contact-subject" name="subject" maxLength={120} value={fields.subject} onChange={(event) => updateField('subject', event.target.value)} aria-invalid={Boolean(errors.subject)} aria-describedby={errors.subject ? 'contact-subject-error' : undefined} />{errors.subject && <span className="contact-error" id="contact-subject-error" role="alert">{errors.subject}</span>}</div>
          <div className="contact-field contact-field-wide"><label htmlFor="contact-message">Deine Nachricht <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" rows={5} maxLength={2000} value={fields.message} onChange={(event) => updateField('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : 'contact-demo-note'} />{errors.message && <span className="contact-error" id="contact-message-error" role="alert">{errors.message}</span>}<span className="contact-demo-note" id="contact-demo-note">Bitte gib in dieser Demo keine sensiblen persönlichen Daten ein.</span></div>
          <p className="contact-required-note"><span aria-hidden="true">*</span> Pflichtfeld · Diese Demo sendet und speichert keine Nachricht.</p>
          <button type="submit" className="button button-dark contact-submit">Nachricht senden </button>
        </form>}
      </div>
      <aside className="contact-details" aria-label="Fiktive Studioinformationen">
        <div className="contact-detail-top"><p className="eyebrow">STUDIOINFORMATIONEN · DEMO</p><span className="contact-detail-mark">V.</span></div>
        <div className="contact-detail-item"><span>STANDORT</span><strong>Köln, Deutschland</strong><small>Allgemeine Ortsangabe – keine Geschäftsadresse.</small></div>
        <div className="contact-detail-item"><span>ÖFFNUNGSZEITEN</span><strong>Montag – Freitag · 09:00 – 18:00</strong><strong>Samstag · 10:00 – 16:00</strong><small>Nur illustrative Demo-Zeiten, keine realen Öffnungszeiten.</small></div>
        <div className="contact-detail-item"><span>KONTAKT</span><strong>Keine realen Kontaktdaten hinterlegt</strong><small>Es gibt keine echte E-Mail-Adresse oder Telefonnummer.</small></div>
        <div className="contact-booking-cta"><p>Ein bestimmtes Treatment im Sinn?</p><Link to="/book" className="text-link">Demo-Termin entdecken </Link></div>
      </aside>
    </section>
    <p className="contact-disclaimer">VELORA ist ein fiktives Konzeptprojekt. Formular, Standort und Öffnungszeiten sind illustrative Demo-Inhalte.</p>
  </main>
}

function BookingStrip({ category }: { category?: TreatmentCategoryId }) {
  return <section className="booking-strip"><p className="eyebrow">DEIN VELORA MOMENT</p><h2>Bereit für Zeit <em>für dich?</em></h2><Link to={category ? `/book?category=${category}` : '/book'} className="button button-dark">Termin entdecken </Link></section>
}

function LegalPage({ privacy = false }: { privacy?: boolean }) {
  return <main className="legal-page section-pad"><p className="eyebrow">VELORA · BEAUTY HOUSE KÖLN</p><h1>{privacy ? 'Datenschutz' : 'Impressum'}</h1>{privacy ? <><p className="legal-placeholder">VELORA ist ein fiktives Portfolio-Projekt und kein reales Unternehmen. Diese Seite ist eine Projektinformation, keine abschließende Datenschutzerklärung und keine Rechtsberatung.</p><h2>Formulare und Demo-Funktionen</h2><p>Kontaktformular und Terminbuchung verarbeiten Eingaben ausschließlich vorübergehend im Browser. Es werden keine Nachrichten versendet, keine Buchungen vorgenommen und keine personenbezogenen Formulardaten dauerhaft gespeichert. Beim Absenden des Kontaktformulars werden die Eingabefelder direkt geleert. Warenkorbinhalte bestehen nur im aktuellen Anwendungszustand und werden nicht persistent abgelegt.</p><h2>Externe Dienste</h2><p>Die Schriftarten Cormorant Garamond und Manrope werden von Google Fonts geladen. Beim Aufruf können technische Verbindungsdaten, insbesondere die IP-Adresse, an Google übermittelt werden. Die Demo verwendet nach Projektprüfung keine Analytics-, Tracking- oder Werbedienste, setzt keine eigenen Cookies und bettet keine externen Inhalte ein.</p><p>Bei einer realen Veröffentlichung müssen Betreiberangaben, eingesetzte Dienste und rechtliche Informationspflichten geprüft und durch passende, aktuelle Rechtstexte ergänzt werden.</p></> : <><p className="legal-placeholder">Dieses VELORA-Projekt ist ein fiktives Konzept zur Demonstration von Webdesign, Frontend-Entwicklung und interaktiven Buchungs- und Shop-Funktionen. Es handelt sich nicht um einen realen Salon oder ein reales Unternehmen.</p><h2>Keine Betreiberangaben</h2><p>Es werden bewusst keine erfundenen Namen, Anschriften, Telefonnummern oder E-Mail-Adressen als reale Anbieterangaben veröffentlicht. Diese Seite ist daher kein vollständiges Impressum und ersetzt keine rechtliche Prüfung.</p><p>Vor einem produktiven Einsatz müssen die tatsächlichen Betreiberinformationen und alle erforderlichen Pflichtangaben durch die verantwortliche Stelle ergänzt werden.</p></>}<p className="eyebrow">DEMO-HINWEIS</p><p>Fiktives Beauty Studio · Keine echten Buchungen oder Bestellungen</p></main>
}

function Footer() {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Brand light /><p>Beauty in every detail.</p></div><div className="footer-column"><p className="eyebrow">ENTDECKEN</p><Link to="/treatments">Treatments</Link><Link to="/collection">Skin Collection</Link><Link to="/about">Über uns</Link><Link to="/contact">Kontakt</Link></div><div className="footer-column"><p className="eyebrow">BEAUTY WELT</p>{treatments.map(item => <Link key={item.path} to={item.path}>{item.title}</Link>)}</div><div className="footer-column"><p className="eyebrow">HIER FINDEST DU UNS</p><span>Köln, Deutschland</span><span className="social-placeholder">Instagram · folgt</span><Link to="/book" className="footer-book">Termin buchen </Link></div></div><div className="footer-bottom"><span>© 2026 VELORA · BEAUTY HOUSE KÖLN</span><div><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link></div><span className="demo-note">Fiktives Konzeptprojekt · Webdesign, Frontend, Buchung & Shop als Demo · Kein realer Salon</span></div></footer>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return <><RouteSEO /><ScrollToTop /><Header /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/treatments" element={<TreatmentsPage />} />
    {treatments.map(item => <Route key={item.path} path={item.path} element={<TreatmentPage treatment={item} />} />)}
    <Route path="/collection" element={<CollectionPage />} /><Route path="/collection/:productId" element={<SkinProductPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/book" element={<BookingWizard />} /><Route path="/impressum" element={<LegalPage />} /><Route path="/datenschutz" element={<LegalPage privacy />} />
    <Route path="*" element={<main className="not-found"><p className="eyebrow">404 · NICHT GEFUNDEN</p><h1>Diese Seite<br /><em>ist woanders.</em></h1><Link className="text-link" to="/">Zurück zur Startseite </Link></main>} />
  </Routes><Footer /></>
}

export default App
