import { useState, useRef, useEffect, useCallback } from 'react'
import BrowserGuy from './BrowserGuy'
import PotteryWheelAnimation from './PotteryWheelAnimation'
import amandaPhoto from './assets/amanda-photo.jpeg'
import mercuryLogo from './assets/mercury-logo-icon.svg'
import revLogo from './assets/rev.com-31.svg'
import PingAmanda from './PingAmanda'
import mercuryAutomation    from './assets/accounting-automations-1200x900.png'
import mercuryAutomationGif from './assets/accounting-automations-hover.gif'
import mercuryFoundations    from './assets/accounting-foundations-1200x900.png'
import mercuryFoundationsGif from './assets/accounting-foundations.gif'
import revDesignSystem       from './assets/rev-design-system-1200x900.png'
import revDesignSystemGif    from './assets/rev-design-system.gif'
import revApiPlayground      from './assets/rev-ai-playground-1200x900.png'
import revApiPlaygroundGif   from './assets/rev-ai-playground.gif'
import michaelsScreenshot from './assets/michaels-screenshot.png'
import previewMercury from './assets/preview-mercury.jpg'
import previewRev from './assets/preview-rev.jpg'
import previewWholefoods from './assets/preview-wholefoods.jpg'
import amandaCoffee from './assets/amanda-coffee.svg'
import FeatureShowcase from './FeatureShowcase'
import { trackNavClick, trackOutboundLink, trackCta, trackEvent } from './analytics'

const MERCURY_ITEMS = [
  {
    title: 'accounting automation',
    description: 'I led three successive design initiatives across the platform: bulk actions, automation, and insights, each growing in complexity and scope. Bulk actions drove +41% usage and +67% in adoption.',
    staticSrc: mercuryAutomation,
    hoverSrc:  mercuryAutomationGif,
    alt: 'Accounting automation',
  },
  {
    title: 'accounting foundations',
    description: "Third-party ERP integrations introduced errors outside Mercury's control. I designed error states and re-authentication flows that gave users clarity when things broke. This reduced errors for our users by 80%.",
    staticSrc: mercuryFoundations,
    hoverSrc:  mercuryFoundationsGif,
    alt: 'Accounting foundations',
  },
]

const REV_ITEMS = [
  {
    title: 'API playground',
    description: "Rev had a rare advantage in training data that made their speech-to-text model worth exploring. I designed two entry points: a no-code path for quick experimentation and a code path for developers who wanted direct API access.",
    staticSrc: revApiPlayground,
    hoverSrc:  revApiPlaygroundGif,
    alt: 'API playground',
  },
  {
    title: 'brand & design system',
    description: "In 2021, Rev overhauled its logo, colors, and brand messaging. I audited and updated every component in the design system to match the new visual language and tone.",
    staticSrc: revDesignSystem,
    hoverSrc:  revDesignSystemGif,
    alt: 'Brand & design system',
  },
]

const NAV = ['hello', 'work', 'me']

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(
    () => 'ontouchstart' in window || window.innerWidth < 768
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = (e) => setIsTouch(e.matches || 'ontouchstart' in window)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isTouch
}

export default function App() {
  const IS_TOUCH = useIsTouch()
  const [activeNav, setActiveNav] = useState('hello')
  const [showPhoto, setShowPhoto] = useState(false)
  // leftPanelRef doubles as the mobile sticky header for height measurement
  const leftPanelRef = useRef(null)
  const rightPanelRef = useRef(null)
  const helloRef = useRef(null)
  const workRef  = useRef(null)
  const funRef   = useRef(null)
  const meRef    = useRef(null)

  const sectionRefs = { hello: helloRef, work: workRef, fun: funRef, me: meRef }
  const lastTrackedSection = useRef('hello')

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
      if (active !== lastTrackedSection.current) {
        lastTrackedSection.current = active
        trackEvent('section_view', { section: active })
      }
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
    trackNavClick(section)
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

      {/*
       * LEFT PANEL (desktop) / STICKY HEADER (mobile)
       * One element, two presentations via CSS media query.
       */}
      <div ref={leftPanelRef} className="left-panel">
        <div className="panel-top">
          <BrowserGuy />
          <h1 className="panel-name">amanda piñero</h1>
        </div>
        <nav className="panel-nav" aria-label="Site sections">
          {NAV.map(item => (
            <button
              key={item}
              className={`nav-link${activeNav === item ? ' active' : ''}`}
              onClick={() => scrollTo(item)}
              aria-current={activeNav === item ? 'true' : undefined}
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
        <section ref={helloRef} className="section" aria-labelledby="section-hello">
          <div className="section-grid">
            <div className="section-meta">
              <h2 className="section-label" id="section-hello">✦ hello</h2>
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
                <a href="https://mercury.com" target="_blank" rel="noopener noreferrer" className="company-link" onClick={() => trackOutboundLink('Mercury', 'https://mercury.com')}>
                  Mercury
                  <span className="company-preview-clip">
                    <img src={previewMercury} alt="Mercury homepage" className="company-preview" loading="lazy" />
                  </span>
                </a>.
              </p>
              <p className="bio-text bio-prev">
                Previously at{' '}
                <a href="https://rev.com" target="_blank" rel="noopener noreferrer" className="company-link" onClick={() => trackOutboundLink('Rev', 'https://rev.com')}>
                  Rev
                  <span className="company-preview-clip">
                    <img src={previewRev} alt="Rev homepage" className="company-preview" loading="lazy" />
                  </span>
                </a>,{' '}
                <a href="https://michaels.com" target="_blank" rel="noopener noreferrer" className="company-link" onClick={() => trackOutboundLink('Michaels', 'https://michaels.com')}>
                  Michaels
                  <span className="company-preview-clip">
                    <img src={michaelsScreenshot} alt="Michaels homepage" className="company-preview" loading="lazy" />
                  </span>
                </a>,{' '}
                and{' '}
                <a href="https://www.wholefoodsmarket.com" target="_blank" rel="noopener noreferrer" className="company-link" onClick={() => trackOutboundLink('Whole Foods Market', 'https://www.wholefoodsmarket.com')}>
                  Whole Foods Market
                  <span className="company-preview-clip">
                    <img src={previewWholefoods} alt="Whole Foods Market homepage" className="company-preview" loading="lazy" />
                  </span>
                </a>.
              </p>
              </div>
              <button className="cta-btn" onClick={() => { trackCta('Get in touch'); scrollTo('me') }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M7 12L2.5 7.5M7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Get in touch
              </button>
            </div>
          </div>
        </section>

        {/* ── Work ── */}
        <section ref={workRef} className="work-section" aria-labelledby="section-work">
          <div className="work-grid">

            {/* Single ✦ work label — left column, top-aligned with first company header */}
            <div className="work-section-label">
              <h2 className="section-label" id="section-work">✦ work</h2>
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

                <FeatureShowcase items={MERCURY_ITEMS} id="mercury" />
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

                <FeatureShowcase items={REV_ITEMS} id="rev" />
              </div>

            </div>
          </div>
        </section>

        {/* ── Fun ── (hidden) */}

        {/* ── Me ── */}
        <section ref={meRef} className="me-section last-section" aria-labelledby="section-me">
          {/* Left: label */}
          <div>
            <h2 className="section-label" id="section-me">✦ me</h2>
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

        {/* ── Footer ── */}
        <div className="site-footer">
          Site created with cursor, claude code, and a lot of coffee.
          <img src={amandaCoffee} alt="" className="footer-coffee" />
        </div>

      </main>

    </div>
  )
}
