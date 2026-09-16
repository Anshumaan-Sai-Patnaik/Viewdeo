import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'

import { FlashProvider } from './context/FlashContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlashProvider>
      <App />
    </FlashProvider>
  </StrictMode>,
)
