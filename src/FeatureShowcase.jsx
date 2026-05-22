import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ── Per-card component: hover GIF + lightbox ──────────────────────────────
function FeatureCard({ item, index, total, itemRef }) {
  const [hovered, setHovered] = useState(false)
  const [gifSrc, setGifSrc] = useState(null)
  const [lightbox, setLightbox] = useState(false)
  const closeBtnRef = useRef(null)
  const triggerRef = useRef(null)

  function openLightbox() {
    triggerRef.current = document.activeElement
    setLightbox(true)
  }

  function closeLightbox() {
    setLightbox(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!lightbox) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [lightbox])

  function handleMouseEnter() {
    setHovered(true)
    if (!gifSrc && item.hoverSrc) setGifSrc(item.hoverSrc)
  }

  return (
    <>
      <li
        ref={itemRef}
        className="fs-card"
        aria-label={`${index + 1} of ${total}: ${item.title}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        onClick={openLightbox}
        style={{ cursor: 'zoom-in' }}
      >
        <div className="fs-card-img">
          <img src={item.staticSrc} alt={item.alt} className="fs-img-static" loading="lazy" style={{ opacity: hovered ? 0 : 1 }} />
          {gifSrc && (
            <img src={gifSrc} alt="" className="fs-img-hover" style={{ opacity: hovered ? 1 : 0 }} />
          )}
        </div>
        <div className="fs-card-mobile-text">
          <div className="fs-card-mobile-title">{item.title}</div>
          <p className="fs-card-mobile-desc">{item.description}</p>
        </div>
      </li>

      {lightbox && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          onClick={closeLightbox}
        >
          <button
            ref={closeBtnRef}
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >✕</button>
          <img
            src={item.hoverSrc || item.staticSrc}
            alt={item.alt}
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function FeatureShowcase({ items, id }) {
  const sectionRef     = useRef(null)
  const itemRefs       = useRef([])
  const titleRefs      = useRef([])
  const descRefs       = useRef([])
  const counterColRef  = useRef(null)
  const activeIndexRef = useRef(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (!sectionRef.current || items.length === 0) return

    const scroller = document.querySelector('.right-panel') || window

    // ── Initial state ──────────────────────────────────────────────────
    // Item 0 active, all others waiting below (y: 20)
    titleRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, i === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 })
    })
    descRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.set(el, { opacity: i === 0 ? 1 : 0 })
    })
    gsap.set(counterColRef.current, { y: '0%' })

    // ── activateItem ────────────────────────────────────────────────────
    function activateItem(index) {
      activeIndexRef.current = index

      titleRefs.current.forEach((el, i) => {
        if (!el) return
        if (i === index) {
          // incoming: slide up + fade in
          gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' })
        } else if (i < index) {
          // past: exit upward
          gsap.to(el, { y: -20, opacity: 0, duration: 0.2, ease: 'power2.in' })
        } else {
          // future: waiting below (instant)
          gsap.set(el, { y: 20, opacity: 0 })
        }
      })

      descRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { opacity: i === index ? 1 : 0 })
      })

      gsap.set(counterColRef.current, { y: `-${index * 100}%` })
    }

    // ── ScrollTrigger per card ─────────────────────────────────────────
    const triggers = itemRefs.current
      .map((el, i) =>
        el ? ScrollTrigger.create({
          trigger: el,
          start:   'top center',
          end:     'top center',
          scroller,
          onEnter:     () => activateItem(i),
          onEnterBack: () => activateItem(Math.max(0, i - 1)),
        }) : null
      )
      .filter(Boolean)

    return () => { triggers.forEach(t => t.kill()) }
  }, [items])

  const total = String(items.length).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      className="fs"
      aria-labelledby={`${id}-fs-heading`}
      style={{ touchAction: 'pan-y' }}
    >
      <div className="fs-grid">

        {/* ── Sticky overlay — full width, pointer-events: none ── */}
        <div className="fs-sticky-col">
          <div className="fs-sticky-panel">

            {/* Titles — all stacked, GSAP controls opacity + translateY */}
            <div className="fs-title-wrapper">
              <h3 className="fs-title-container" id={`${id}-fs-heading`} aria-live="polite">
                {items.map((item, i) => (
                  <div
                    key={i}
                    ref={el => { titleRefs.current[i] = el }}
                    className="fs-title-item"
                  >
                    {item.title}
                  </div>
                ))}
              </h3>
            </div>

            {/* Descriptions — all stacked, GSAP controls opacity */}
            <div className="fs-desc-wrapper">
              <p className="fs-desc-container">
                {items.map((item, i) => (
                  <span
                    key={i}
                    ref={el => { descRefs.current[i] = el }}
                    className="fs-desc-item"
                  >
                    {item.description}
                  </span>
                ))}
              </p>
            </div>

          </div>
        </div>

        {/* ── Feature cards ── */}
        <ul className="fs-cards" aria-label={`${id} project previews`}>
          {items.map((item, i) => (
            <FeatureCard
              key={i}
              item={item}
              index={i}
              total={items.length}
              itemRef={el => { itemRefs.current[i] = el }}
            />
          ))}
        </ul>

      </div>
    </section>
  )
}
