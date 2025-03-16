import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NavigationBar from './components/NavigationBar/NavigationBar.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NavigationBar />
  </StrictMode>,
)
