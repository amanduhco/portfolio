import { useState, useRef, useEffect } from 'react'
import BrowserGuy from './BrowserGuy'
import PotteryWheelAnimation from './PotteryWheelAnimation'
import amandaPhoto from './assets/amanda-photo.jpeg'
import mercuryAutomation   from './assets/accounting-automations.png'
import mercuryFoundations  from './assets/accounting-foundations.png'
import revDesignSystem     from './assets/rev-design-system.png'
import revApiPlayground    from './assets/rev-ai-playground.png'

const IS_TOUCH = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768)

const NAV = ['hello', 'work', 'fun', 'me']

export default function App() {
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
              <span className="section-label">✦ Hello</span>
            </div>
            <div>
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
                <a href="https://mercury.com" target="_blank" rel="noopener noreferrer" className="company-link">Mercury</a>.
              </p>
              <p className="bio-text bio-prev">
                Previously at{' '}
                <a href="https://rev.com" target="_blank" rel="noopener noreferrer" className="company-link">Rev</a>,{' '}
                <a href="https://michaels.com" target="_blank" rel="noopener noreferrer" className="company-link">Michaels</a>,{' '}
                and{' '}
                <a href="https://www.wholefoodsmarket.com" target="_blank" rel="noopener noreferrer" className="company-link">Whole Foods Market</a>.
              </p>
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
                  <span>
                    <span className="company-name">mercury</span>
                    <span className="company-role"> product designer</span>
                  </span>
                  <span className="company-date">jun 2022 - present</span>
                </div>

                <div className="company-intro">
                  <p className="intro-text"><strong>Mercury</strong> is a startup that revolutionizes business banking* by taking a tedious process and making easy and accessible to founders.</p>
                  <p className="intro-text">I help founders spend less time wrestling with their books by designing tools that bring clarity and accuracy to accounting right at the source.</p>
                  <p className="contact-note">For in-depth details of my work, please contact me.</p>
                </div>

                <div className="project-entries">
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">Accounting automation</div>
                      <p className="project-desc">Mercury already sat at the origin of every financial transaction, giving it a structural advantage over standalone accounting tools. The manual categorization approach wasn't working though, founders lacked the bandwidth, books fell behind, and tax season became chaotic.</p>
                      <p className="project-desc">The solution rolled out in phases: bulk actions first, then automation, then insights for all users. Bulk actions result was a 41% increase in usage and 67% increase in adoption.</p>
                    </div>
                    <img src={mercuryAutomation} alt="Accounting automation" className="project-image" />
                  </div>
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">Accounting foundations</div>
                      <p className="project-desc">Mercury already sat at the origin of every financial transaction, giving it a structural advantage over standalone accounting tools. The manual categorization approach wasn't working though, founders lacked the bandwidth, books fell behind, and tax season became chaotic.</p>
                      <p className="project-desc">The solution rolled out in phases: bulk actions first, then automation, then insights for all users. Bulk actions result was a 41% increase in usage and 67% increase in adoption.</p>
                    </div>
                    <img src={mercuryFoundations} alt="Accounting foundations" className="project-image" />
                  </div>
                </div>
              </div>

              {/* Rev */}
              <div className="company-block">
                <div className="company-header-row">
                  <span>
                    <span className="company-name">rev</span>
                    <span className="company-role"> product designer</span>
                  </span>
                  <span className="company-date">jun 2021 - jun 2022</span>
                </div>

                <div className="company-intro">
                  <p className="intro-text"><strong>Rev</strong> is a speech-to-text company that provides several services that include transcription, captions, and subtitles, along with utilizing the output of these</p>
                  <p className="intro-text">I helped helped with updating our design system to compliment our new branding along with and engineers to be able to engage with our API playground.</p>
                  <p className="contact-note">For in-depth details of my work, please contact me.</p>
                </div>

                <div className="project-entries">
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">Brand & Design system</div>
                      <p className="project-desc">Mercury already sat at the origin of every financial transaction, giving it a structural advantage over standalone accounting tools. The manual categorization approach wasn't working though, founders lacked the bandwidth, books fell behind, and tax season became chaotic.</p>
                      <p className="project-desc">The solution rolled out in phases: bulk actions first, then automation, then insights for all users. Bulk actions result was a 41% increase in usage and 67% increase in adoption.</p>
                    </div>
                    <img src={revDesignSystem} alt="Brand & Design system" className="project-image" />
                  </div>
                  <div className="project-entry">
                    <div className="project-text">
                      <div className="work-project-title">API Playground</div>
                      <p className="project-desc">Mercury already sat at the origin of every financial transaction, giving it a structural advantage over standalone accounting tools. The manual categorization approach wasn't working though, founders lacked the bandwidth, books fell behind, and tax season became chaotic.</p>
                      <p className="project-desc">The solution rolled out in phases: bulk actions first, then automation, then insights for all users. Bulk actions result was a 41% increase in usage and 67% increase in adoption.</p>
                    </div>
                    <img src={revApiPlayground} alt="API Playground" className="project-image" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Fun ── */}
        <section ref={funRef} className="placeholder-section">
          <span className="section-label">✦ fun</span>
        </section>

        {/* ── Me ── */}
        <section ref={meRef} className="me-section last-section">
          {/* Left: label */}
          <div>
            <span className="section-label">✦ me</span>
          </div>

          {/* Center: bio + photo placeholder */}
          <div>
            <p className="bio-text">
              Designer based in New York. I care a lot about craft —
              the kind that shows up in the details. When I'm not pushing
              pixels I'm usually throwing pots, sketching, or overanalyzing
              type choices nobody else notices.
            </p>
          </div>

          {/* Right: date + pottery wheel */}
          <div className="me-right">
            <span className="me-date">2022 – now</span>
            <div className="pottery-wrapper">
              <PotteryWheelAnimation />
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
