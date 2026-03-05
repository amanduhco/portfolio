import { useState, useRef } from 'react'
import BrowserGuy from './BrowserGuy'
import PotteryWheelAnimation from './PotteryWheelAnimation'
import amandaPhoto from './assets/amanda-photo.jpeg'

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

          {/* Mercury */}
          <div className="company-block">
            <div className="company-header">
              <span className="work-label">✦ work</span>
              <span className="company-name-role">
                <span className="company-name">mercury</span>
                <span className="company-role"> product designer</span>
              </span>
              <span className="company-date">jun 2022 – present</span>
            </div>
            <div className="company-divider" />

            <div className="company-intro">
              <p className="intro-text"><strong>Mercury</strong> is a financial technology company building banking infrastructure for startups and businesses.</p>
              <p className="intro-text">As a product designer on the core product team, I own end-to-end design for accounting and financial operations features — from early discovery through shipped product.</p>
              <p className="contact-note">For in-depth details of my work, please contact me.</p>
            </div>

            <div className="project-entries">
              <div className="project-entry">
                <div className="project-text">
                  <div className="work-project-title">accounting experience</div>
                  <p className="project-desc">Redesigned Mercury's core accounting workflows to reduce friction for founders managing their finances. Focused on clarity, speed, and building trust through transparency.</p>
                  <p className="project-desc">Led research, interaction design, and visual design across web and mobile surfaces.</p>
                </div>
                <div className="project-image" />
              </div>
              <div className="project-entry">
                <div className="project-text">
                  <div className="work-project-title">accounting integrations</div>
                  <p className="project-desc">Designed the integrations experience connecting Mercury to QuickBooks, Xero, and other accounting tools used by small business owners.</p>
                  <p className="project-desc">Worked closely with engineering and partnerships to ship a scalable integration framework.</p>
                </div>
                <div className="project-image" />
              </div>
            </div>
          </div>

          {/* Rev */}
          <div className="company-block">
            <div className="company-header">
              <span className="work-label">✦ work</span>
              <span className="company-name-role">
                <span className="company-name">rev</span>
                <span className="company-role"> product designer</span>
              </span>
              <span className="company-date">2020 – 2022</span>
            </div>
            <div className="company-divider" />

            <div className="company-intro">
              <p className="intro-text"><strong>Rev</strong> is a speech technology company providing transcription, captions, and translation services.</p>
              <p className="intro-text">Contributed to the consumer and enterprise product experience, focusing on order flows and account management.</p>
              <p className="contact-note">For in-depth details of my work, please contact me.</p>
            </div>

            <div className="project-entries">
              <div className="project-entry">
                <div className="project-text">
                  <div className="work-project-title">API playground</div>
                  <p className="project-desc">Designed an interactive API playground allowing developers to test Rev's transcription API directly in the browser.</p>
                  <p className="project-desc">Balanced technical depth with accessibility for non-developer users.</p>
                </div>
                <div className="project-image" />
              </div>
              <div className="project-entry">
                <div className="project-text">
                  <div className="work-project-title">order experience</div>
                  <p className="project-desc">Redesigned the end-to-end order flow for human transcription and captions, reducing drop-off and improving clarity around turnaround times and pricing.</p>
                  <p className="project-desc">Conducted usability testing and iterated based on customer feedback.</p>
                </div>
                <div className="project-image" />
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
