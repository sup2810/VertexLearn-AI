
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

// Always use the permanent production domain
const CANONICAL_HOST = 'vertex-learn-ai-tau.vercel.app'

if (window.location.hostname !== CANONICAL_HOST) {
  window.location.replace(
    `https://${CANONICAL_HOST}${window.location.pathname}${window.location.search}${window.location.hash}`
  )
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>
  )
}
