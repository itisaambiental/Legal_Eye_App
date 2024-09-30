import { useState, useContext, useEffect } from 'react';
import Context from '../context/userContext.jsx';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import useUser from "../hooks/user/auth.jsx";

function Dashboard() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { jwt, isAdmin, isAnalyst } = useContext(Context);
    const { logout } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [gmail, setGmail] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (jwt) {
            const decodedToken = jwtDecode(jwt);
            setGmail(decodedToken.userForToken.gmail);
        }
    }, [jwt]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (isMenuOpen && !event.target.closest("#logo-sidebar")) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isMenuOpen]);

    const handlerSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <div>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={handlerSidebar}
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 relative">
                                {isMenuOpen && (
                                    <div className="absolute bg-white mt-48 ml-[-220%] sm:ml-[-200%] md:ml-[-220%] xs:ml-[-230%]s py-2 w-25 sm:w-26 md:w-28 xs:w-36 border rounded-lg shadow-lg">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                                                {gmail}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                                {isAdmin ? "Admin" : isAnalyst ? "Analista" : "Usuario"}
                                            </p>


                                        </div>
                                        <ul>
                                            <li>
                                                <a onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Cerrar sesión</a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <button
                                        onClick={(e) => {
                                            toggleMenu();
                                            e.stopPropagation();
                                        }}
                                        type="button"
                                        className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 hover:scale-110 transition-transform duration-200"
                                        aria-expanded={isMenuOpen}
                                        data-dropdown-toggle="dropdown-user"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 lg:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link to="/" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${location.pathname === '/' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
                                <span className="ms-3">Hogar</span>
                            </Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Abogados</span>

                                </li>

                            </>
                        )}
                        {isAnalyst && (
                            <li>
                                <span className="ms-3">Tus Expedientes</span>

                            </li>
                        )}
                        <li>
                            <a onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
            <main className="ml-64 pt-20 px-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;