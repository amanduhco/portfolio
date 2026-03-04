import { useState, useRef } from 'react'
import BrowserGuy from './BrowserGuy'

const NAV = ['hello', 'work', 'fun', 'me']

export default function App() {
  const [activeNav, setActiveNav] = useState('hello')

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
                I'm a passionate designer that loves blah blah blah. This can be FPO
                for now, and I can save this space for when I've thought of it.
                Crafting high quality designs @ Mercury. Previously at Rev.
              </p>
            </div>
          </div>
        </section>

        {/* ── Work ── */}
        <div ref={workRef} className="work-section">

          <div className="section-grid work-entry">
            <div className="section-meta">
              <div className="section-label">✦ mercury</div>
              <div className="section-subtitle">product designer</div>
            </div>
            <div>
              <div className="project-title">accounting experience</div>
              <div className="project-title">accounting integrations</div>
            </div>
          </div>

          <div className="section-grid work-entry">
            <div className="section-meta">
              <div className="section-label">✦ rev</div>
              <div className="section-subtitle">product designer</div>
            </div>
            <div>
              <div className="project-title">API playground</div>
            </div>
          </div>

        </div>

        {/* ── Fun ── */}
        <section ref={funRef} className="placeholder-section">
          <span className="section-label">✦ fun</span>
        </section>

        {/* ── Me ── */}
        <section ref={meRef} className="placeholder-section last-section">
          <span className="section-label">✦ me</span>
        </section>

      </main>
    </div>
  )
}
