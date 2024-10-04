import { useState, useEffect } from 'react';
import useUserProfile from '../../hooks/user/profile.jsx';
import useUsers from '../../hooks/user/users.jsx';
import { Spinner } from '@nextui-org/react';


function Users() {
  const { name } = useUserProfile();
  const { users, error, loading } = useUsers();


  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Spinner className="h-10 w-10 transform translate-x-0 lg:translate-x-28 xl:translate-x-28" color="primary" />
      </div>
    );
  }
  
 

  return (
    <section className="bg-white mt-12 text-center justify-center  flex flex-col items-center -ml-64">



      <div className="bg-white dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
         </section>
  );
}

export default Users;