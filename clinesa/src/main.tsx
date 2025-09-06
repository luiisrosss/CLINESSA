import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
// import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

// Monitoring will be configured later
// import { initSentry } from './lib/sentry'
// import { initAnalytics } from './lib/analytics'
// import { log } from './lib/logger'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
      {/* <Analytics /> */}
    </BrowserRouter>
  </StrictMode>,
)
