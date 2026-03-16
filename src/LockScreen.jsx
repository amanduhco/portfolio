import BrowserGuy from './BrowserGuy'
import ContactAmanda1 from './ContactAmanda1'

export default function LockScreen({ onEnter }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#F2F2F2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      padding: '40px 24px',
      fontFamily: "'Futura', 'Century Gothic', sans-serif",
      zIndex: 9999,
    }}>

      {/* Name + browser guy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrowserGuy />
        <span style={{ fontSize: 16, color: '#333333', letterSpacing: '0.01em' }}>
          amanda piñero
        </span>
      </div>

      {/* Contact card */}
      <div style={{ width: '100%', maxWidth: 480 }}>
        <ContactAmanda1 />
      </div>

      {/* WIP note */}
      <p style={{
        fontSize: 13,
        color: '#999999',
        textAlign: 'center',
        maxWidth: 360,
        lineHeight: 1.6,
      }}>
        Portfolio is currently a work in progress,<br />contact Amanda for updates.
      </p>

      {/* Enter anyway */}
      <button
        onClick={onEnter}
        style={{
          background: 'none',
          border: 'none',
          fontSize: 12,
          color: '#bbbbbb',
          cursor: 'pointer',
          letterSpacing: '0.08em',
          textTransform: 'lowercase',
          fontFamily: "'Futura', 'Century Gothic', sans-serif",
          padding: '4px 0',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = '#333333'}
        onMouseLeave={e => e.target.style.color = '#bbbbbb'}
      >
        view anyway →
      </button>

    </div>
  )
}
