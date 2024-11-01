// App.routes.js
import { Routes, Route } from 'react-router-dom';
import NotFound from './components/utils/NotFound.jsx';
import Unauthorized from './components/utils/Unauthorized.jsx';
import Login from "./components/users/login/Login.jsx";
import ResetPassword from './components/users/login/ResetPassword.jsx';
import VerifyCode from './components/users/login/VerifyCode.jsx';
import CompleteReset from './components/users/login/CompleteReset.jsx';
import AccessUser from './middleware/access_user.jsx';
import AccessAdmin from './middleware/access_admin.jsx';
import Dashboard from "./components/Dashboard.jsx";
import Home from './components/Home.jsx';
import Users from './components/users/Users.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/request" element={<ResetPassword />} />
      <Route path="/reset-password/verify/:email" element={<VerifyCode />} />
      <Route path="/reset-password/complete" element={<CompleteReset />} />

      <Route element={<AccessUser element={<Dashboard />} />}>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<AccessAdmin element={<Users />} />} />
        <Route path="/legal_basis" element={<Home />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} /> 
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}

export default AppRoutes;
