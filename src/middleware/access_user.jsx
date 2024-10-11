/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../context/userContext.jsx';


function AccessUser({ element }) {
  const { jwt } = useContext(Context);

  return jwt ? element : <Navigate to="/login" />;
}

export default AccessUser;
