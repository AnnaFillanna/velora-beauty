import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { findSkinProduct } from './data/skinProducts'

type PageMetadata = {
  title: string
  description: string
  noIndex?: boolean
}

const routeMetadata: Record<string, PageMetadata> = {
  '/': {
    title: 'VELORA Beauty House Köln | Fiktives Premium Beauty Studio',
    description: 'VELORA ist ein fiktives Beauty-Studio-Konzept aus Köln. Entdecke Demo-Treatments, Kosmetik, eine interaktive Terminbuchung und die Skin Collection.',
  },
  '/treatments': {
    title: 'Treatments & Preise in Köln | VELORA Demo',
    description: 'Fiktive Beauty-Treatments und Demo-Preise: Facials, Wimpernverlängerung, Maniküre und Laser-Haarentfernung – ein Frontend-Konzept aus Köln.',
  },
  '/treatments/lashes-brows': {
    title: 'Wimpernverlängerung & Brow Styling Köln | VELORA Demo',
    description: 'Entdecke fiktive Lash- und Brow-Treatments im VELORA Beauty-Konzept Köln. Leistungen, Demo-Preise und unverbindliche Buchungsvorschau.',
  },
  '/treatments/nails': {
    title: 'Maniküre & Nail Design Köln | VELORA Demo',
    description: 'Maniküre, Gel und Nail Design als fiktive Demo-Treatments im VELORA Beauty-Konzept aus Köln.',
  },
  '/treatments/face-skin': {
    title: 'Facial Treatments & Kosmetikstudio Köln | VELORA Demo',
    description: 'Facial Treatments und moderne Kosmetik als fiktives Website-Konzept. Entdecke die VELORA Demo-Leistungen und Preise aus Köln.',
  },
  '/treatments/body-laser': {
    title: 'Laser-Haarentfernung & Body Treatments Köln | VELORA Demo',
    description: 'Fiktive Demo-Leistungen für Laser-Haarentfernung und Body Treatments im VELORA Beauty-Konzept Köln.',
  },
  '/collection': {
    title: 'VELORA Skin Collection | Fiktive Skincare-Demo',
    description: 'Entdecke die fiktive VELORA Skin Collection mit sechs Produktkonzepten, Produktdetails und interaktivem Demo-Warenkorb.',
  },
  '/about': {
    title: 'Über VELORA | Beauty House Köln – Konzeptprojekt',
    description: 'Lerne die fiktive VELORA-Philosophie, die illustrierten Beauty Experts und die gestaltete Salon Experience des Kölner Konzeptprojekts kennen.',
  },
  '/contact': {
    title: 'Kontakt | VELORA Beauty House Köln – Demo',
    description: 'Kontaktformular, illustrative Studioinformationen und Demo-Öffnungszeiten des fiktiven VELORA Beauty-Konzepts in Köln.',
  },
  '/book': {
    title: 'Demo-Terminbuchung | VELORA Beauty House Köln',
    description: 'Erkunde den interaktiven, unverbindlichen Demo-Buchungsablauf von VELORA. Es werden keine echten Termine gebucht oder Daten gespeichert.',
  },
  '/impressum': {
    title: 'Impressum | VELORA Konzeptprojekt',
    description: 'Hinweise zum fiktiven VELORA-Portfolio-Projekt. Diese Demo ist kein reales Unternehmen und ersetzt kein vollständiges Impressum.',
  },
  '/datenschutz': {
    title: 'Datenschutz | VELORA Konzeptprojekt',
    description: 'Datenschutzhinweise zur lokalen VELORA-Demo, ihren Formularen und der Einbindung von Google Fonts.',
  },
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string | undefined) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

function updateCanonical(pathname: string) {
  const siteUrl = import.meta.env.VITE_SITE_URL?.trim().replace(/\/+$/, '')
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!siteUrl) {
    canonical?.remove()
    return undefined
  }
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.append(canonical)
  }
  canonical.href = `${siteUrl}${pathname === '/' ? '/' : pathname}`
  return canonical.href
}

export function RouteSEO() {
  const { pathname } = useLocation()

  useEffect(() => {
    const product = pathname.startsWith('/collection/')
      ? findSkinProduct(pathname.slice('/collection/'.length))
      : undefined
    const metadata = product
      ? {
          title: `${product.name} | VELORA Skin Collection Demo`,
          description: `${product.description} Fiktives Produktkonzept mit Demo-Preis, Details und Warenkorb – ohne Bestellung oder Zahlung.`,
        }
      : routeMetadata[pathname] ?? {
          title: 'Seite nicht gefunden | VELORA Demo',
          description: 'Diese Seite ist im fiktiven VELORA-Portfolio-Projekt nicht vorhanden.',
          noIndex: true,
        }

    document.title = metadata.title
    setMeta('meta[name="description"]', 'name', 'description', metadata.description)
    setMeta('meta[name="robots"]', 'name', 'robots', metadata.noIndex ? 'noindex, follow' : 'index, follow')
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'de_DE')
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'VELORA Beauty House Köln')
    setMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', metadata.description)
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary')
    const canonicalUrl = updateCanonical(pathname)
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
  }, [pathname])

  return null
}
