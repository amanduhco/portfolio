import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LockScreen from './LockScreen.jsx'

function Root() {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked ? <App /> : <LockScreen onEnter={() => setUnlocked(true)} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
