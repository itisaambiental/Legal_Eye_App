import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../context/userContext.jsx";
import { Spinner } from "@nextui-org/react";

/**
 * Component that restricts access to routes for admin users only.
 * Displays a loading spinner while the user's role is being verified.
 * If the user is an admin, renders the specified component; otherwise, redirects to an unauthorized page.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {JSX.Element} props.element - The component to render if the user is an admin.
 *
 * @returns {JSX.Element} The rendered component for admin users, a spinner while loading, or a redirect for unauthorized users.
 */
function AccessAdmin({ element }) {
  const { isAdmin, isLoading } = useContext(Context);

  /**
   * Displays a loading spinner while checking the user's admin status.
   */
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner
          className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32"
          color="secondary"
        />
      </div>
    );
  }

  // Renders the component if the user is an admin; otherwise, redirects to the unauthorized page.
  return isAdmin ? element : <Navigate to="/unauthorized" />;
}

AccessAdmin.propTypes = {
  element: PropTypes.element.isRequired,
};

export default AccessAdmin;
