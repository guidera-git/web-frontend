import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Footer from './components/Footer/Footer'
import NavigationBar from './components/NavigationBar/NavigationBar'
import App from './App'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    < App/>
  </StrictMode>,
)
