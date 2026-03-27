import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'gary_welcome_banner_dismissed'

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false)
  const bannerRef = useRef(null)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  /* Expose banner height as CSS variable so content shifts down */
  useEffect(() => {
    if (visible && bannerRef.current) {
      const h = bannerRef.current.offsetHeight
      document.documentElement.style.setProperty('--banner-h', `${h}px`)
    } else {
      document.documentElement.style.setProperty('--banner-h', '0px')
    }
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  if (!visible) return null

  return (
    <>
      <div
        ref={bannerRef}
        className="fixed left-0 right-0 z-40 text-center py-2.5 px-10"
        style={{ top: 'var(--header-h, 60px)', background: '#1a1a1a' }}
      >
        <span className="font-serif italic text-[#FF4A3E] mr-1">GARY</span>
        <span className="font-serif text-white/90 text-sm sm:text-base tracking-wide">
          {' '}fait peau neuve — Bienvenue sur notre nouveau site
        </span>
        <button
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg leading-none p-1 transition-colors"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>
      {/* Spacer to push content below the fixed banner */}
      <div style={{ height: 'var(--banner-h, 0px)' }} />
    </>
  )
}
