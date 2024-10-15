// App.js
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import { UserContextProvider } from './context/userContext.jsx';
import AppRoutes from './App.routes';
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <NextUIProvider>
      <UserContextProvider>
        <ToastContainer />
        <AppRoutes />
      </UserContextProvider>
    </NextUIProvider>
  );
}

export default App;
