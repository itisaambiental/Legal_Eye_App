import { ToastContainer } from "react-toastify"
import { HeroUIProvider } from "@heroui/react"
import { UserContextProvider } from './context/userContext.jsx'
import AppRoutes from './App.routes'
import "react-toastify/dist/ReactToastify.css"

/**
 * Root component of the application.
 * Wraps the application with necessary providers for UI, user context, and toast notifications.
 * 
 * @component
 * @returns {JSX.Element} The application wrapped with providers.
 */
function App() {
  return (
    <HeroUIProvider>
      <UserContextProvider>
        <ToastContainer />
        <AppRoutes />
      </UserContextProvider>
    </HeroUIProvider>
  )
}

export default App
