import { useState, useRef, useEffect } from 'react'

const IS_TOUCH = typeof window !== 'undefined' && 'ontouchstart' in window

export default function BrowserGuy() {
  const [mascotState, setMascotState] = useState('awake')
  const [blinking, setBlinking] = useState(false)

  const stateRef      = useRef('awake')
  const leftEyeRef    = useRef(null)
  const rightEyeRef   = useRef(null)
  const svgRef        = useRef(null)
  const idleTimerRef  = useRef(null)
  const happyTimerRef = useRef(null)
  const blinkTimerRef = useRef(null)
  const rafRef        = useRef(null)
  const mousePos      = useRef({ x: 0, y: 0 })
  const eyeOffset     = useRef({ x: 0, y: 0 })

  function transitionTo(next) {
    stateRef.current = next
    setMascotState(next)
  }

  function resetIdleTimer() {
    clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => transitionTo('sleeping'), 60000)
  }

  // Activity listeners — mousemove (desktop) + touchstart (mobile)
  useEffect(() => {
    function onMouseMove(e) {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (stateRef.current === 'sleeping') transitionTo('awake')
      if (stateRef.current !== 'happy') resetIdleTimer()
    }
    function onTouch() {
      if (stateRef.current === 'sleeping') transitionTo('awake')
      if (stateRef.current !== 'happy') resetIdleTimer()
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchstart', onTouch, { passive: true })
    resetIdleTimer()
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchstart', onTouch)
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  // Eye tracking via RAF — desktop only, lazy lerp
  useEffect(() => {
    function tick() {
      const isMobile = IS_TOUCH || window.innerWidth < 768
      if (
        !isMobile &&
        stateRef.current === 'awake' &&
        svgRef.current &&
        leftEyeRef.current &&
        rightEyeRef.current
      ) {
        const rect    = svgRef.current.getBoundingClientRect()
        const cx      = rect.left + rect.width / 2
        const cy      = rect.top  + rect.height / 2
        const dx      = (mousePos.current.x - cx) / (window.innerWidth  / 2)
        const dy      = (mousePos.current.y - cy) / (window.innerHeight / 2)
        const targetX = Math.max(-1.5, Math.min(1.5, dx * 1.5))
        const targetY = Math.max(-1,   Math.min(1,   dy * 1))
        eyeOffset.current.x += (targetX - eyeOffset.current.x) * 0.06
        eyeOffset.current.y += (targetY - eyeOffset.current.y) * 0.06
        leftEyeRef.current.setAttribute('cx',  String(19.5 + eyeOffset.current.x))
        leftEyeRef.current.setAttribute('cy',  String(10.2341 + eyeOffset.current.y))
        rightEyeRef.current.setAttribute('cx', String(28.5 + eyeOffset.current.x))
        rightEyeRef.current.setAttribute('cy', String(10.2341 + eyeOffset.current.y))
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Random blink — awake only
  useEffect(() => {
    if (mascotState !== 'awake') return
    function scheduleBlink() {
      const delay = 5000 + Math.random() * 2000
      blinkTimerRef.current = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => {
          setBlinking(false)
          if (stateRef.current === 'awake') scheduleBlink()
        }, 80)
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(blinkTimerRef.current)
  }, [mascotState])

  // Click / tap → happy for 2.5s
  function handleClick() {
    if (stateRef.current === 'sleeping') return
    clearTimeout(happyTimerRef.current)
    clearTimeout(idleTimerRef.current)
    transitionTo('happy')
    happyTimerRef.current = setTimeout(() => {
      transitionTo('awake')
      resetIdleTimer()
    }, 2500)
  }

  const isSleeping = mascotState === 'sleeping'
  const isHappy    = mascotState === 'happy'
  const eyesClosed = isSleeping || blinking

  const closeT = blinking ? 'transform 40ms ease'          : 'transform 800ms ease'
  const openT  = blinking ? 'transform 40ms ease'          : 'transform 600ms ease 300ms'

  return (
    <svg
      ref={svgRef}
      onClick={handleClick}
      width="46" height="34"
      viewBox="0 0 46 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer', flexShrink: 0 }}
    >
      {/* Frame */}
      <rect y="4.10181" width="42.0283" height="29.3663" fill="#333333" />
      <rect x="3.15014" y="0.118892" width="41.7905" height="29.069" fill="#F2F2F2" stroke="#333333" strokeWidth="0.237784" />
      <rect x="3.15014" y="0.118892" width="41.7905" height="2.79396" fill="#F2F2F2" stroke="#333333" strokeWidth="0.237784" />
      <circle cx="4.72709" cy="1.51591" r="0.445844" fill="#333333" />
      <circle cx="5.97709" cy="1.51591" r="0.445844" fill="#333333" />
      <circle cx="7.22319" cy="1.51591" r="0.445844" fill="#333333" />

      {/* Open eyes — always in DOM for ref-based tracking */}
      <ellipse
        ref={leftEyeRef}
        cx="19.5" cy="10.2341" rx="1.5" ry="2" fill="#333333"
        style={{
          transformBox: 'fill-box', transformOrigin: 'center',
          transform: eyesClosed || isHappy ? 'scaleY(0)' : 'scaleY(1)',
          transition: eyesClosed ? closeT : openT,
        }}
      />
      <ellipse
        ref={rightEyeRef}
        cx="28.5" cy="10.2341" rx="1.5" ry="2" fill="#333333"
        style={{
          transformBox: 'fill-box', transformOrigin: 'center',
          transform: eyesClosed || isHappy ? 'scaleY(0)' : 'scaleY(1)',
          transition: eyesClosed ? closeT : openT,
        }}
      />

      {/* Sleeping closed-eye arcs */}
      <path
        d="M20.7584 10.3438C20.7584 11.003 20.224 11.5374 19.5647 11.5374C18.9055 11.5374 18.3711 11.003 18.3711 10.3438"
        stroke="#333333" strokeWidth="0.475567"
        style={{
          opacity: isSleeping ? 1 : 0,
          transition: isSleeping ? 'opacity 250ms ease 650ms' : 'opacity 150ms ease',
        }}
      />
      <path
        d="M30.3873 10.3438C30.3873 11.003 29.8529 11.5374 29.1936 11.5374C28.5344 11.5374 28 11.003 28 10.3438"
        stroke="#333333" strokeWidth="0.475567"
        style={{
          opacity: isSleeping ? 1 : 0,
          transition: isSleeping ? 'opacity 250ms ease 650ms' : 'opacity 150ms ease',
        }}
      />

      {/* Happy arc eyes */}
      <path
        d="M18 10.4 Q19.5 8.8 21 10.4"
        stroke="#333333" strokeWidth="0.55" fill="none" strokeLinecap="round"
        style={{ opacity: isHappy ? 1 : 0, transition: 'opacity 120ms ease' }}
      />
      <path
        d="M27 10.4 Q28.5 8.8 30 10.4"
        stroke="#333333" strokeWidth="0.55" fill="none" strokeLinecap="round"
        style={{ opacity: isHappy ? 1 : 0, transition: 'opacity 120ms ease' }}
      />

      {/* Smile */}
      <path
        d="M25.5709 15.7532C25.5709 16.4124 25.0365 16.9468 24.3772 16.9468C23.718 16.9468 23.1836 16.4124 23.1836 15.7532"
        stroke="#333333" strokeWidth="0.475567"
        style={{ opacity: isSleeping ? 0 : 1, transition: 'opacity 300ms ease' }}
      />

      {/* Nose — sleeping only */}
      <circle
        cx="24.3772" cy="16.9468" r="0.955852"
        stroke="#333333" strokeWidth="0.475567"
        style={{
          opacity: isSleeping ? 1 : 0,
          transition: isSleeping ? 'opacity 300ms ease 650ms' : 'opacity 200ms ease',
        }}
      />

      {/* ZZZs — zzz1 (bottom) first, staggered up */}
      <path
        d="M31.5573 19.75H33.3051V20.39H30.2109L32.1158 18.0836H30.6154V17.4497H33.4591L31.5573 19.75Z"
        fill="#333333"
        className={isSleeping ? 'zzz zzz-active zzz-d0' : 'zzz'}
      />
      <path
        d="M36.6757 15.3895H38.9126V16.0506H35.5195L37.8077 12.0508H35.8939V11.3896H38.9639L36.6757 15.3895Z"
        fill="#333333"
        className={isSleeping ? 'zzz zzz-active zzz-d1' : 'zzz'}
      />
      <path
        d="M41.78 10.001H43.5278V10.6409H40.4336L42.3384 8.33462H40.8381V7.70068H43.6818L41.78 10.001Z"
        fill="#333333"
        className={isSleeping ? 'zzz zzz-active zzz-d2' : 'zzz'}
      />
    </svg>
  )
}
