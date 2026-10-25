import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { findSkinProduct, formatSkinPrice, type SkinProduct } from './data/skinProducts'
import { ProductArtwork } from './ProductArtwork'
import { CartContext, type CartContextValue, type CartLine, useCart } from './cartStore'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const products = lines.map((line) => ({ ...line, product: findSkinProduct(line.productId) })).filter((line): line is CartLine & { product: SkinProduct } => Boolean(line.product))
  const itemCount = products.reduce((total, line) => total + line.quantity, 0)
  const subtotal = products.reduce((total, line) => total + line.product.priceEuro * line.quantity, 0)
  const addProduct = useCallback((product: SkinProduct, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id)
      return existing
        ? current.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + quantity } : line)
        : [...current, { productId: product.id, quantity }]
    })
    setDrawerOpen(true)
  }, [])
  const changeQuantity = useCallback((productId: string, quantity: number) => setLines((current) => quantity > 0
    ? current.map((line) => line.productId === productId ? { ...line, quantity } : line)
    : current.filter((line) => line.productId !== productId)), [])
  const removeProduct = useCallback((productId: string) => setLines((current) => current.filter((line) => line.productId !== productId)), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo<CartContextValue>(() => ({
    lines,
    itemCount,
    subtotal,
    drawerOpen,
    addProduct,
    changeQuantity,
    removeProduct,
    openDrawer,
    closeDrawer,
  }), [addProduct, changeQuantity, closeDrawer, drawerOpen, itemCount, lines, openDrawer, removeProduct, subtotal])

  return <CartContext.Provider value={value}>{children}<CartDrawer /></CartContext.Provider>
}

export function CartButton() {
  const { itemCount, openDrawer } = useCart()
  return <button className="cart-trigger" type="button" onClick={openDrawer} aria-label={`Warenkorb öffnen, ${itemCount} Artikel`}>
    <ShoppingBag size={17} strokeWidth={1.5} /><span>Warenkorb</span><span className="cart-count" aria-live="polite">{itemCount}</span>
  </button>
}

function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, changeQuantity, removeProduct } = useCart()
  const reducedMotion = useReducedMotion()
  const drawerRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!drawerOpen) return
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
      if (event.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])')
        const first = focusable.item(0)
        const last = focusable.item(focusable.length - 1)
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [closeDrawer, drawerOpen])

  const products = lines.map((line) => ({ ...line, product: findSkinProduct(line.productId) })).filter((line): line is CartLine & { product: SkinProduct } => Boolean(line.product))

  return <AnimatePresence>
    {drawerOpen && <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .22 }}>
      <button className="cart-backdrop" type="button" aria-label="Warenkorb schließen" onClick={closeDrawer} />
      <motion.aside ref={drawerRef} className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-heading" initial={reducedMotion ? false : { x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: reducedMotion ? 0 : .32, ease: [0.22, 1, 0.36, 1] }}>
        <header className="cart-drawer-header"><div><p className="eyebrow">VELORA SKIN COLLECTION</p><h2 id="cart-heading">Dein Warenkorb <span>({products.reduce((sum, line) => sum + line.quantity, 0)})</span></h2></div><button ref={closeButtonRef} type="button" className="cart-close" onClick={closeDrawer} aria-label="Warenkorb schließen"><X size={19} /></button></header>
        {products.length === 0 ? <div className="cart-empty"><ShoppingBag size={27} strokeWidth={1.2} /><p className="eyebrow">NOCH NICHTS AUSGEWÄHLT</p><h3>Ein Ritual für dich wartet.</h3><p>Entdecke die VELORA Skin Collection und finde deinen persönlichen Favoriten.</p><Link to="/collection" className="button button-dark" onClick={closeDrawer}>Kollektion entdecken <ArrowRight size={15} /></Link></div> : <>
          <div className="cart-lines">{products.map(({ product, quantity }) => <article className="cart-line" key={product.id}>
            <Link to={`/collection/${product.id}`} className="cart-line-art" aria-label={`${product.name} entdecken`} onClick={closeDrawer}><ProductArtwork product={product} /></Link>
            <div className="cart-line-info"><Link to={`/collection/${product.id}`} onClick={closeDrawer}>{product.name}</Link><span>{product.volume} · {formatSkinPrice(product.priceEuro)}</span><div className="cart-quantity" aria-label={`Menge ${product.name}`}><button type="button" aria-label={`${product.name} Menge verringern`} onClick={() => changeQuantity(product.id, quantity - 1)}><Minus size={13} /></button><span>{quantity}</span><button type="button" aria-label={`${product.name} Menge erhöhen`} onClick={() => changeQuantity(product.id, quantity + 1)}><Plus size={13} /></button></div></div>
            <div className="cart-line-total"><strong>{formatSkinPrice(product.priceEuro * quantity)}</strong><button type="button" aria-label={`${product.name} entfernen`} onClick={() => removeProduct(product.id)}><Trash2 size={14} /></button></div>
          </article>)}</div>
          <div className="cart-drawer-footer"><div className="cart-subtotal"><span>Zwischensumme · Demo</span><strong>{formatSkinPrice(subtotal)}</strong></div><p>Demo-Warenkorb · Keine Bestellung, Zahlung oder Datenspeicherung.</p><button className="button button-dark cart-demo-button" type="button" onClick={closeDrawer}>Weiter entdecken <ArrowUpRight size={15} /></button></div>
        </>}
      </motion.aside>
    </motion.div>}
  </AnimatePresence>
}
