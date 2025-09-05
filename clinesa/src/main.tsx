import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

// Initialize monitoring
import { initSentry } from './lib/sentry'
import { initAnalytics } from './lib/analytics'
import { log } from './lib/logger'

// Initialize Sentry
initSentry()

// Initialize Analytics
initAnalytics()

// Log app initialization
log.info('CLINESA application starting', {
  feature: 'app',
  action: 'init',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.MODE,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
      <Analytics />
    </BrowserRouter>
  </StrictMode>,
)
