// Dashboard.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import Context from '../context/userContext.jsx';
import useUserProfile from '../hooks/user/profile.jsx';
import menu_hamburguesa from "../assets/menu-hamburguesa.png";
import logo from "../assets/logo2.png";
import hogar from "../assets/hogar.png";
import flecha_izquierda from "../assets/flecha_izquierda.png";
import users from "../assets/users.png";
import fundamentos_icon from "../assets/fundamento-legal.png";
import materias_icon from "../assets/materias.png";
import user from "../assets/usuario.png";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import logout_icon from "../assets/salida.png";
import { User } from '@nextui-org/react';

/**
 * Dashboard component
 * Provides the main layout and navigation for the dashboard.
 * Includes a sidebar for navigation and a top navbar with user options.
 * @component
 * @returns {JSX.Element} The rendered Dashboard component.
 */
function Dashboard() {
    const { logout, isAdmin, isAnalyst } = useContext(Context);
    const { name, email, profilePicture } = useUserProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };  
    const handlerSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (isSidebarOpen && !event.target.closest("#logo-sidebar") && !event.target.closest("button[aria-controls='logo-sidebar']")) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isSidebarOpen]);

    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-primary border-b border-primary">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={handlerSidebar}
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm rounded-lg lg:hidden xl:hidden hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <img src={menu_hamburguesa} alt="Open sidebar" className="w-6 h-6" />
                            </button>
                            <a className="flex ms-2 md:me-24">
                                <img src={logo} className="me-3 rounded-full h-20 w-24" alt="FlowBite Logo" />
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 relative">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <User
                                            isBordered
                                            color='warning'
                                            as="button"
                                            aria-label='user_avatar'
                                            className="transition-transform"
                                            avatarProps={{
                                                src: profilePicture || user,
                                            }}
                                        />
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="User Menu" variant="light">
                                        <DropdownItem textValue='Nombre de Usuario' key="profile" className="h-14 gap-2">
                                            <p className="font-semibold mt-2 text-primary">
                                                {name || "Usuario"} - {isAdmin ? "Admin" : isAnalyst ? "Analista" : "Invitado"}
                                            </p>
                                            <p className="font-normal mb-1 text-secondary">{email || "example@isaambiental.com"}</p>
                                        </DropdownItem>
                                        <DropdownItem textValue='Cerrar Sesión'  startContent={<img src={logout_icon} alt="Logout Icon" className="w-4 h-4 flex-shrink-0" />} className='mt-1 hover:bg-red/20' key="logout" onClick={handleLogout}>
                                            <p className="font-normal text-red ml-20">Cerrar Sesión</p>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-primary border-r border-primary lg:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-primary">
                    <ul className="space-y-2 mt-12 font-medium">
                        <li>
                            <Link to="/" className={`flex items-center p-2 text-white rounded-lg hover:bg-white/15 group ${location.pathname === '/' ? 'bg-white/20' : ''}`}>
                                <img src={hogar} className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                <span className="ms-3 font-medium">Hogar</span>
                            </Link>
                        </li>
                        {isAdmin && (
                            <li>
                                <Link to="/users" className={`flex items-center p-2 text-white rounded-lg hover:bg-white/15 group ${location.pathname === '/users' ? 'bg-white/20' : ''}`}>
                                    <img src={users} className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                    <span className="ms-3 font-medium">Usuarios</span>
                                </Link>
                            </li>
                        )}
                         <li>
                            <Link to="/subjects" className={`flex items-center p-2 text-white rounded-lg hover:bg-white/15 group ${/\/subjects(\/\d+\/aspects)?$/.test(location.pathname) ? 'bg-white/20' : ''}`}>
                                <img src={materias_icon} className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                <span className="ms-3 font-medium">Materias Legales</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/legal_basis" className={`flex items-center p-2 text-white rounded-lg hover:bg-white/15 group ${location.pathname === '/legal_basis' ? 'bg-white/20' : ''}`}>
                                <img src={fundamentos_icon} className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                <span className="ms-3 font-medium">Fundamentos Legales</span>
                            </Link>
                        </li>
                        <li>
                            <a onClick={handleLogout} className="flex items-center p-2 text-white hover:bg-white/15 rounded-lg group">
                                <img src={flecha_izquierda} className="flex-shrink-0 w-5 h-5 transition duration-75" />
                                <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <main className="ml-64 pt-20 px-4 bg-white ">
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;
