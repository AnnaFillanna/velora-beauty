import type { SkinProduct } from './data/skinProducts'
import { getEditorialImage } from './data/visualAssets'

export type ArtworkView = 'front' | 'detail' | 'ritual'

export function ProductArtwork({ product, view = 'front', className = '', loading = 'lazy' }: { product: SkinProduct; view?: ArtworkView; className?: string; loading?: 'eager' | 'lazy' }) {
  const prefix = `art-${product.id}`
  const image = getEditorialImage(product.image)
  const isJar = product.productForm === 'jar' || product.productForm === 'balm'
  const bottleWidth = product.productForm === 'eye' ? 104 : product.productForm === 'pump' ? 142 : 132
  const bottleHeight = product.productForm === 'eye' ? 258 : product.productForm === 'pump' ? 322 : 350

  return <div className={`skin-artwork ${className} artwork-${view}${image ? ' has-product-image' : ''}`} role="img" aria-label={`${product.name} – stilisierte VELORA Produktabbildung`}>
    {image && <img src={image} alt="" loading={loading} decoding="async" fetchPriority={loading === 'eager' ? 'high' : 'auto'} />}
    <svg viewBox="0 0 520 620" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${prefix}-backdrop`} x1="45" y1="30" x2="458" y2="588" gradientUnits="userSpaceOnUse"><stop stopColor={view === 'ritual' ? '#e6d5ce' : '#eee5df'} /><stop offset="1" stopColor={view === 'detail' ? '#c9aca0' : '#d7c0b5'} /></linearGradient>
        <linearGradient id={`${prefix}-glass`} x1="148" y1="104" x2="354" y2="462" gradientUnits="userSpaceOnUse"><stop stopColor="#fffaf3" stopOpacity=".88" /><stop offset=".4" stopColor="#e9d9d0" stopOpacity=".94" /><stop offset="1" stopColor="#b78f82" stopOpacity=".92" /></linearGradient>
        <linearGradient id={`${prefix}-cap`} x1="190" y1="0" x2="322" y2="100" gradientUnits="userSpaceOnUse"><stop stopColor="#8e6c68" /><stop offset="1" stopColor="#4d3c3d" /></linearGradient>
        <linearGradient id={`${prefix}-stone`} x1="86" y1="472" x2="430" y2="572" gradientUnits="userSpaceOnUse"><stop stopColor="#e8ddd3" /><stop offset="1" stopColor="#b99d91" /></linearGradient>
        <filter id={`${prefix}-shadow`} x="74" y="426" width="372" height="112" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="16" /></filter>
        <pattern id={`${prefix}-grain`} width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="4" cy="8" r=".8" fill="#703d48" fillOpacity=".12" /><circle cx="19" cy="20" r=".7" fill="#292326" fillOpacity=".1" /></pattern>
      </defs>
      <rect width="520" height="620" fill={`url(#${prefix}-backdrop)`} />
      <circle cx="415" cy="116" r="113" fill="#f8f3ef" fillOpacity=".22" />
      <path d="M0 489c94-37 158 22 255-7 82-25 151-48 265-11v149H0V489Z" fill="#c4a89c" fillOpacity=".18" />
      <ellipse cx="260" cy="489" rx="151" ry="26" fill="#4b3838" fillOpacity=".24" filter={`url(#${prefix}-shadow)`} />
      <path d={view === 'ritual' ? 'M81 481h358l-24 70H105l-24-70Z' : 'M96 469h328l-22 72H118l-22-72Z'} fill={`url(#${prefix}-stone)`} />
      <path d="M106 475h309" stroke="#f8f3ef" strokeOpacity=".48" />
      <path d="M113 523h294" stroke="#8d7169" strokeOpacity=".18" />
      {view !== 'front' && <path d="M0 0h520v620H0z" fill={`url(#${prefix}-grain)`} opacity={view === 'detail' ? '.5' : '.23'} />}
      {isJar ? <>
        <rect x="168" y="270" width="184" height="190" rx="23" fill={`url(#${prefix}-glass)`} stroke="#fffaf3" strokeOpacity=".7" />
        <path d="M178 299c45 12 110 12 164 0v130c0 12-10 21-22 21H200c-12 0-22-9-22-21V299Z" fill="#fffaf3" fillOpacity=".13" />
        <rect x="161" y="244" width="198" height="42" rx="8" fill={`url(#${prefix}-cap)`} />
        <path d="M173 256h174" stroke="#ead9cf" strokeOpacity=".35" />
      </> : <>
        <rect x={(520 - bottleWidth) / 2} y="128" width={bottleWidth} height={bottleHeight} rx={product.productForm === 'eye' ? 28 : 34} fill={`url(#${prefix}-glass)`} stroke="#fffaf3" strokeOpacity=".86" />
        <path d={`M${(520 - bottleWidth) / 2 + 16} 163v${bottleHeight - 72}`} stroke="#fff" strokeOpacity=".56" strokeWidth="5" strokeLinecap="round" />
        {product.productForm === 'dropper' ? <>
          <rect x="219" y="82" width="82" height="49" rx="9" fill={`url(#${prefix}-cap)`} />
          <path d="M237 86v39m12-39v39m12-39v39m12-39v39" stroke="#d9c4b8" strokeOpacity=".28" />
          <rect x="243" y="60" width="34" height="28" rx="9" fill="#4d3c3d" />
          <path d="M251 64v-17c0-4 3-7 7-7s7 3 7 7v17" stroke="#4d3c3d" strokeWidth="5" />
        </> : product.productForm === 'pump' ? <>
          <rect x="223" y="91" width="74" height="42" rx="7" fill={`url(#${prefix}-cap)`} />
          <path d="M259 92V67h53v10h-31v15" stroke="#4d3c3d" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </> : product.productForm === 'eye' ? <>
          <rect x="223" y="102" width="74" height="37" rx="7" fill={`url(#${prefix}-cap)`} />
          <path d="M234 109h52" stroke="#d9c4b8" strokeOpacity=".45" />
        </> : <>
          <rect x="225" y="88" width="70" height="43" rx="7" fill={`url(#${prefix}-cap)`} />
          <path d="M235 96h50" stroke="#d9c4b8" strokeOpacity=".35" />
        </>}
      </>}
      {view === 'ritual' && <g opacity=".95"><rect x="76" y="354" width="48" height="118" rx="22" fill="#b79c94" /><path d="M82 379h36" stroke="#f8f3ef" strokeOpacity=".5" /><circle cx="408" cy="402" r="30" fill="#f8f3ef" fillOpacity=".7" /></g>}
      <g textAnchor="middle" fill="#703d48">
        <text x="260" y={isJar ? 345 : 284} fontFamily="Georgia,serif" fontSize="22" letterSpacing="4">VELORA</text>
        <path d={isJar ? 'M210 356h100' : 'M210 295h100'} stroke="#703d48" strokeOpacity=".4" />
        <text x="260" y={isJar ? 379 : 323} fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2.2">{product.name.replace('VELORA ', '').toUpperCase()}</text>
        <text x="260" y={isJar ? 398 : 342} fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2">{product.volume.toUpperCase()}</text>
      </g>
      <text x="36" y="584" fill="#5e4b49" fillOpacity=".68" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2">VELORA SKIN COLLECTION</text>
      <text x="484" y="584" textAnchor="end" fill="#5e4b49" fillOpacity=".68" fontFamily="Arial,sans-serif" fontSize="8" letterSpacing="2">{product.collection}</text>
    </svg>
  </div>
}
