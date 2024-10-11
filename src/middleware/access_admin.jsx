/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/userContext.jsx';
import { Spinner } from '@nextui-org/react';

function AccessAdmin({ element }) {
  const { isAdmin, isLoading } = useContext(Context);



  if (isLoading) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
          <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-32" color="secondary" />
        </div>
      );
  }

  return isAdmin ? element : <Navigate to="/unauthorized" />;
}

export default AccessAdmin;
