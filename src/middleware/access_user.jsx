/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import Context from '../context/userContext.jsx'

/**
 * Component that restricts access to routes for authenticated users only.
 * If a valid JWT token exists, renders the specified component; otherwise, redirects to the login page.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {JSX.Element} props.element - The component to render if the user is authenticated.
 * 
 * @returns {JSX.Element} The rendered component for authenticated users or a redirect to the login page.
 */
function AccessUser({ element }) {
  const { jwt } = useContext(Context)

  // Renders the component if a valid JWT exists; otherwise, redirects to the login page.
  return jwt ? element : <Navigate to="/login" />
}

export default AccessUser
