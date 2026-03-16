import { useState, useRef, useEffect } from 'react'
import BrowserGuy from './BrowserGuy'
import PotteryWheelAnimation from './PotteryWheelAnimation'
import amandaPhoto from './assets/amanda-photo.jpeg'
import mercuryLogo from './assets/mercury-logo-icon.svg'
import revLogo from './assets/rev.com-31.svg'
import PingAmanda from './PingAmanda'
import GradientBlobCursor from './GradientBlobCursor'
import mercuryAutomation   from './assets/accounting-automations.png'
import mercuryAutomationGif from './assets/accounting-automations-hover.gif'
import mercuryFoundations    from './assets/accounting-foundations.png'
import mercuryFoundationsGif from './assets/accounting-foundations.gif'
import revDesignSystem     from './assets/rev-design-system.png'
import revDesignSystemGif  from './assets/rev-design-system.gif'
import revApiPlayground    from './assets/rev-ai-playground.png'
import revApiPlaygroundGif from './assets/rev-ai-playground.gif'
import michaelsScreenshot from './assets/michaels-screenshot.png'

const IS_TOUCH = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768)

const NAV = ['hello', 'work', 'me']

export default function App() {
  const [activeNav, setActiveNav] = useState('hello')
  const [showPhoto, setShowPhoto] = useState(false)
  const [lightbox, setLightbox] = useState(null) // { src, alt }

  useEffect(() => {
    if (!lightbox) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox])

  // leftPanelRef doubles as the mobile sticky header for height measurement
  const leftPanelRef = useRef(null)
  const rightPanelRef = useRef(null)
  const helloRef = useRef(null)
  const workRef  = useRef(null)
  const funRef   = useRef(null)
  const meRef    = useRef(null)

  const sectionRefs = { hello: helloRef, work: workRef, fun: funRef, me: meRef }

  useEffect(() => {
    const sections = [
      { key: 'hello', ref: helloRef },
      { key: 'work',  ref: workRef  },
      { key: 'fun',   ref: funRef   },
      { key: 'me',    ref: meRef    },
    ]

    function updateActive() {
      const isDesktop = window.innerWidth >= 768
      const containerTop = isDesktop
        ? (rightPanelRef.current?.getBoundingClientRect().top ?? 0)
        : 0
      const threshold = containerTop + window.innerHeight * 0.35

      let active = 'hello'
      for (const { key, ref } of sections) {
        if (ref.current && ref.current.getBoundingClientRect().top <= threshold) {
          active = key
        }
      }
      setActiveNav(active)
    }

    const panel = rightPanelRef.current
    panel?.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('scroll', updateActive, { passive: true })
    return () => {
      panel?.removeEventListener('scroll', updateActive)
      window.removeEventListener('scroll', updateActive)
    }
  }, [])

  function scrollTo(section) {
    setActiveNav(section)
    const ref = sectionRefs[section]
    if (!ref?.current) return

    if (window.innerWidth < 768) {
      // Mobile: scroll the window, offset for sticky header
      const headerH = leftPanelRef.current?.offsetHeight ?? 0
      const top = ref.current.getBoundingClientRect().top + window.scrollY - headerH
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      // Desktop: scroll only the right panel
      const panelTop   = rightPanelRef.current.getBoundingClientRect().top
      const sectionTop = ref.current.getBoundingClientRect().top
      rightPanelRef.current.scrollBy({ top: sectionTop - panelTop, behavior: 'smooth' })
    }
  }

  return (
    <div className="portfolio">
      {!IS_TOUCH && <GradientBlobCursor />}

      {/*
       * LEFT PANEL (desktop) / STICKY HEADER (mobile)
       * One element, two presentations via CSS media query.
       */}
      <div ref={leftPanelRef} className="left-panel">
        <div className="panel-top">
          <BrowserGuy />
          <span className="panel-name">amanda piñero</span>
        </div>
        <nav className="panel-nav">
          {NAV.map(item => (
            <button
              key={item}
              className={`nav-link${activeNav === item ? ' active' : ''}`}
              onClick={() => scrollTo(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* RIGHT PANEL (desktop scrollable) / PAGE CONTENT (mobile) */}
      <main ref={rightPanelRef} className="right-panel">

        {/* "designer" label — desktop sticky top, hidden on mobile */}
        <div className="designer-bar">
          <span className="designer-label">designer</span>
        </div>

        {/* ── Hello ── */}
        <section ref={helloRef} className="section">
          <div className="section-grid">
            <div className="section-meta">
              <span className="section-label">✦ hello</span>
            </div>
            <div className="hello-content">
              <div className="hello-bio">
              <p className="bio-text">
                I'm{' '}
                <span
                  className="amanda-hover"
                  onMouseEnter={!IS_TOUCH ? () => setShowPhoto(true)  : undefined}
                  onMouseLeave={!IS_TOUCH ? () => setShowPhoto(false) : undefined}
                  onTouchStart={ IS_TOUCH ? () => setShowPhoto(true)  : undefined}
                  onTouchEnd={   IS_TOUCH ? () => { setTimeout(() => setShowPhoto(false), 1500) } : undefined}
                >
                  Amanda
                  <img
                    src={amandaPhoto}
                    alt=""
                    className={`amanda-photo${showPhoto ? ' visible' : ''}`}
                  />
                </span>
                , a product designer who turns complexity into clarity.
                I'm passionate about crafting tools that work beautifully, building
                genuine trust in AI, and finding the joy in the functional.
              </p>
              <p className="bio-text bio-currently">
                Currently @{' '}
                <a href="https://mercury.com" target="_blank" rel="noopener noreferrer" className="company-link">
                  Mercury
                  <span className="company-preview-clip">
                    <img src="https://api.microlink.io/?url=https%3A%2F%2Fmercury.com&screenshot=true&meta=false&embed=screenshot.url" alt="Mercury homepage" className="company-preview" />
                  </span>
                </a>.
              </p>
              <p className="bio-text bio-prev">
                Previously at{' '}
                <a href="https://rev.com" target="_blank" rel="noopener noreferrer" className="company-link">
                  Rev
                  <span className="company-preview-clip">
                    <img src="https://api.microlink.io/?url=https%3A%2F%2Frev.com&screenshot=true&meta=false&embed=screenshot.url" alt="Rev homepage" className="company-preview" />
                  </span>
                </a>,{' '}
                <a href="https://michaels.com" target="_blank" rel="noopener noreferrer" className="company-link">
                  Michaels
                  <span className="company-preview-clip">
                    <img src={michaelsScreenshot} alt="Michaels homepage" className="company-preview" />
                  </span>
                </a>,{' '}
                and{' '}
                <a href="https://www.wholefoodsmarket.com" target="_blank" rel="noopener noreferrer" className="company-link">
                  Whole Foods Market
                  <span className="company-preview-clip">
                    <img src="https://api.microlink.io/?url=https%3A%2F%2Fwww.wholefoodsmarket.com&screenshot=true&meta=false&embed=screenshot.url" alt="Whole Foods Market homepage" className="company-preview" />
                  </span>
                </a>.
              </p>
              </div>
              <button className="cta-btn" onClick={() => scrollTo('me')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M7 12L2.5 7.5M7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Get in touch
              </button>
            </div>
          </div>
        </section>

        {/* ── Work ── */}
        <div ref={workRef} className="work-section">
          <div className="work-grid">

            {/* Single ✦ work label — left column, top-aligned with first company header */}
            <div className="work-section-label">
              <span className="section-label">✦ work</span>
            </div>

            <div className="work-companies">

              {/* Mercury */}
              <div className="company-block">
                <div className="company-header-row">
                  <span className="company-name-row">
                    <img src={mercuryLogo} alt="Mercury" className="company-logo" />
                    <span className="company-name">mercury</span>
                    <span className="company-role"> product designer</span>
                  </span>
                  <span className="company-date">jun 2022 - present</span>
                </div>

                <div className="company-intro">
                  <p className="intro-text"><strong>Mercury</strong> is a startup that revolutionizes business banking* by taking a tedious process and making easy and accessible to founders.</p>
                  <p className="intro-text">I design tools that give founders clarity and accuracy in their books, catching problems at the source so they stop wrestling with accounting altogether.</p>
                  <p className="contact-note">For in-depth details of my work, please contact me.</p>
                </div>

                <div className="project-entries">
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">accounting automation</div>
                      <p className="project-desc">I led three successive design initiatives across the platform: bulk actions, automation, and insights, each growing in complexity and scope. Bulk actions drove +41% usage and +67% in adoption.</p>
                    </div>
                    <div className="project-image-wrapper" onClick={() => setLightbox({ src: mercuryAutomationGif, alt: 'Accounting automation' })}>
                      <img src={mercuryAutomation} alt="Accounting automation" className="project-image project-image-static" />
                      <img src={mercuryAutomationGif} alt="Accounting automation animated" className="project-image project-image-hover" />
                    </div>
                  </div>
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">accounting foundations</div>
                      <p className="project-desc">Third-party ERP integrations introduced errors outside Mercury's control. I designed error states and re-authentication flows that gave users clarity when things broke. This reduced errors for our users by 80%.</p>
                    </div>
                    <div className="project-image-wrapper" onClick={() => setLightbox({ src: mercuryFoundationsGif, alt: 'Accounting foundations' })}>
                      <img src={mercuryFoundations} alt="Accounting foundations" className="project-image project-image-static" />
                      <img src={mercuryFoundationsGif} alt="Accounting foundations animated" className="project-image project-image-hover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rev */}
              <div className="company-block">
                <div className="company-header-row">
                  <span className="company-name-row">
                    <img src={revLogo} alt="Rev" className="company-logo" />
                    <span className="company-name">rev</span>
                    <span className="company-role"> product designer</span>
                  </span>
                  <span className="company-date">jun 2021 - jun 2022</span>
                </div>

                <div className="company-intro">
                  <p className="intro-text"><strong>Rev</strong> provides transcription, captions, and subtitles powered by 100,000s of hours of transcribed audio. I updated the design system to align with the new brand and built out the API playground for developers to explore Rev's AI/ML speech-to-text model directly.</p>
                  <p className="contact-note">For in-depth details of my work, please contact me.</p>
                </div>

                <div className="project-entries">
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">API playground</div>
                      <p className="project-desc">Rev had a rare advantage in training data that made their speech-to-text model worth exploring. I designed two entry points: a no-code path for quick experimentation and a code path for developers who wanted direct API access.</p>
                    </div>
                    <div className="project-image-wrapper" onClick={() => setLightbox({ src: revApiPlaygroundGif, alt: 'API playground' })}>
                      <img src={revApiPlayground} alt="API playground" className="project-image project-image-static" />
                      <img src={revApiPlaygroundGif} alt="API playground animated" className="project-image project-image-hover" />
                    </div>
                  </div>
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">brand & design system</div>
                      <p className="project-desc">In 2021, Rev overhauled its logo, colors, and brand messaging. I audited and updated every component in the design system to match the new visual language and tone.</p>
                    </div>
                    <div className="project-image-wrapper" onClick={() => setLightbox({ src: revDesignSystemGif, alt: 'Brand & design system' })}>
                      <img src={revDesignSystem} alt="Brand & design system" className="project-image project-image-static" />
                      <img src={revDesignSystemGif} alt="Brand & design system animated" className="project-image project-image-hover" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Fun ── (hidden) */}

        {/* ── Me ── */}
        <section ref={meRef} className="me-section last-section">
          {/* Left: label */}
          <div>
            <span className="section-label">✦ me</span>
          </div>

          {/* Center: contact card */}
          <div>
            <PingAmanda />
          </div>

          {/* Right: date + pottery wheel */}
          <div className="me-right">
<div className="pottery-wrapper">
              <PotteryWheelAnimation />
            </div>
          </div>
        </section>

      </main>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  )
}
