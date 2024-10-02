import { Routes, Route } from 'react-router-dom';
import { UserContextProvider } from './context/userContext.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from './components/utils/NotFound.jsx';
import Login from "./components/user/login/Login.jsx";
import ResetPassword from './components/user/login/ResetPassword.jsx';
import VerifyCode from './components/user/login/VerifyCode.jsx';
import CompleteReset from './components/user/login/CompleteReset.jsx';
import AccessUser from './middleware/access_user.jsx';
import Test from './components/utils/Prueba.jsx';
import { NextUIProvider } from "@nextui-org/react";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  return (
    <NextUIProvider>
      <UserContextProvider>
        <ToastContainer />
        <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/reset-password/request" element={<ResetPassword />} />
  <Route path="/reset-password/verify/:email" element={<VerifyCode />} />
  <Route path="/reset-password/complete" element={<CompleteReset />} />

  <Route element={<AccessUser element={<Dashboard />} />}>
    <Route path="/" element={<Test />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
      </UserContextProvider>
    </NextUIProvider>
  );
}

export default App;
