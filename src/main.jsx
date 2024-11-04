import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

/**
 * Main entry point for the React application.
 * Renders the root `App` component within `StrictMode` to highlight potential problems.
 * `BrowserRouter` is used to enable routing functionality across the app.
 * 
 * @module main
 */

/**
 * Mounts the application onto the DOM element with ID 'root'.
 * Wraps the app in `StrictMode` and `BrowserRouter` for enhanced functionality and routing support.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
