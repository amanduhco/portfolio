import { useState, useRef } from 'react'
import BrowserGuy from './BrowserGuy'

export default function App() {
  const [active, setActive] = useState('hello')

  const rightPanelRef = useRef(null)
  const helloRef = useRef(null)
  const workRef = useRef(null)
  const funRef = useRef(null)
  const meRef = useRef(null)

  const sectionRefs = { hello: helloRef, work: workRef, fun: funRef, me: meRef }

  function scrollTo(section) {
    setActive(section)
    const ref = sectionRefs[section]
    if (ref?.current && rightPanelRef?.current) {
      const panelTop = rightPanelRef.current.getBoundingClientRect().top
      const sectionTop = ref.current.getBoundingClientRect().top
      rightPanelRef.current.scrollBy({
        top: sectionTop - panelTop,
        behavior: 'smooth',
      })
    }
  }

  const navItems = ['hello', 'work', 'fun', 'me']

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#F2F2F2',
        fontFamily: "'Futura', 'Century Gothic', sans-serif",
        color: '#333333',
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          width: '268px',
          minWidth: '268px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 32px',
        }}
      >
        {/* Logo + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrowserGuy />
          <span style={{ fontSize: '14px', letterSpacing: '0.01em' }}>amanda piñero</span>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: '166px' }}>
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              style={{
                display: 'block',
                background: 'none',
                border: 'none',
                padding: '4px 0',
                fontSize: '22px',
                fontFamily: "'Futura', 'Century Gothic', sans-serif",
                color: active === item ? '#333333' : '#999999',
                cursor: 'pointer',
                letterSpacing: '0.01em',
                lineHeight: 1.4,
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', backgroundColor: '#DDDDDD', flexShrink: 0 }} />

      {/* Right Panel */}
      <div
        ref={rightPanelRef}
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* "designer" label — top right of right panel */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '28px 48px',
            backgroundColor: '#F2F2F2',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '13px', color: '#333333' }}>designer</span>
        </div>

        {/* Hello Section */}
        <div
          ref={helloRef}
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '0 48px',
            padding: '80px 48px 140px',
          }}
        >
          <div>
            <span style={{ fontSize: '13px', letterSpacing: '0.02em' }}>✦ Hello</span>
          </div>
          <div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#333333', maxWidth: '480px' }}>
              I'm a passionate designer that loves blah blah blah. This can be FPO
              for now, and I can save this space for when I've thought of it.
              Crafting high quality designs @ Mercury. Previously at Rev.
            </p>
          </div>
        </div>

        {/* Work Section */}
        <div
          ref={workRef}
          style={{ padding: '0 48px 160px' }}
        >
          {/* Mercury */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '0 48px',
              marginBottom: '0',
            }}
          >
            <div style={{ paddingTop: '4px' }}>
              <div style={{ fontSize: '13px', letterSpacing: '0.02em', marginBottom: '4px' }}>
                ✦ mercury
              </div>
              <div style={{ fontSize: '12px', color: '#999999' }}>product designer</div>
            </div>
            <div>
              <div style={{ fontSize: '38px', fontWeight: 300, lineHeight: 1.25, color: '#333333', marginBottom: '2px' }}>
                accounting experience
              </div>
              <div style={{ fontSize: '38px', fontWeight: 300, lineHeight: 1.25, color: '#333333' }}>
                accounting integrations
              </div>
            </div>
          </div>

          {/* Rev */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '0 48px',
              marginTop: '72px',
            }}
          >
            <div style={{ paddingTop: '4px' }}>
              <div style={{ fontSize: '13px', letterSpacing: '0.02em', marginBottom: '4px' }}>
                ✦ rev
              </div>
              <div style={{ fontSize: '12px', color: '#999999' }}>product designer</div>
            </div>
            <div>
              <div style={{ fontSize: '38px', fontWeight: 300, lineHeight: 1.25, color: '#333333' }}>
                API playground
              </div>
            </div>
          </div>
        </div>

        {/* Fun Section */}
        <div
          ref={funRef}
          style={{ padding: '0 48px 160px', minHeight: '60vh' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '0 48px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', letterSpacing: '0.02em' }}>✦ fun</span>
            </div>
            <div />
          </div>
        </div>

        {/* Me Section */}
        <div
          ref={meRef}
          style={{ padding: '0 48px 160px', minHeight: '60vh' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              gap: '0 48px',
            }}
          >
            <div>
              <span style={{ fontSize: '13px', letterSpacing: '0.02em' }}>✦ me</span>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}
