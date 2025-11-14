import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import useMediaQuery from '../../hooks/useMediaQuery';
import Link from './Link';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
    const navigate = useNavigate();
    const { isLoggedIn, hasRole, logout } = useAuth();
    const canAccessUsers = hasRole(['Administrador', 'Desenvolvedor', 'Bibliotecário']);
    const canAccessSettings = hasRole(['Administrador', 'Desenvolvedor']);

    return (
        <nav>
            <div className={`${flexBetween} fixed top-0 z-30 w-full py-6 bg-white shadow-md`}>
                <div className={`${flexBetween} mx-auto w-5/6`}>
                    {/* LEFT SIDE */}
                    <div className={`${flexBetween} w-full`}>
                        <img src="/logo.svg" alt="Logo" />
                    </div>
                    {/* RIGHT SIDE */}
                    {isAboveMediumScreens ? (
                        <>
                            <div className={`flex items-center justify-end mr-10 w-full gap-8 text-sm`}>
                                <Link page="Acervo" to="/books" />
                                {isLoggedIn && <Link page="Empréstimos" to="/loans" />}
                                {canAccessUsers && <Link page="Usuários" to="/users" />}
                                {canAccessSettings && <Link page="Configurações" to="/settings" />}
                                {isLoggedIn && <Link page="Minha conta" to="/my-account" />}
                            </div>
                            <div className={`${flexBetween} gap-8`}>
                                {!isLoggedIn ? (
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary transition-colors duration-300"
                                    >
                                        Login
                                    </button>
                                ) : (
                                    <button 
                                        onClick={logout} 
                                        className="px-4 py-2 border border-secondary text-secondary rounded hover:bg-secondary hover:text-white transition-colors duration-300"
                                    >
                                        Sair
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                            <Bars3Icon className='h-6 w-6 text-gray-600' />
                        </button>
                    )}
                </div>
            </div>

            {/* MOBILE MENU MODAL */}
            {!isAboveMediumScreens && isMenuToggled && (
                <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-white shadow-lg">
                    {/* CLOSE ICON */}
                    <div className="flex justify-end p-12">
                        <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                            <XMarkIcon className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* MENU ITEMS */}
                    <div className="ml-[33%] flex flex-col gap-1 text-2xl">
                        <Link page="Acervo" to="/books" />
                        {isLoggedIn && <Link page="Empréstimos" to="/loans" />}
                        {canAccessUsers && <Link page="Usuários" to="/users" />}
                        {canAccessSettings && <Link page="Configurações" to="/settings" />}
                        {isLoggedIn && <Link page="Minha conta" to="/my-account" />}
                    </div>

                    {/* LOGIN/LOGOUT */}
                    <div className="ml-[33%] mt-10 flex flex-col gap-4">
                        {!isLoggedIn ? (
                            <button 
                                onClick={() => navigate('/login')} 
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary w-fit transition-colors duration-300"
                            >
                                Login
                            </button>
                        ) : (
                            <button 
                                onClick={logout} 
                                className="px-4 py-2 border border-secondary text-secondary rounded w-fit transition-colors duration-300 hover:bg-secondary hover:text-white"
                            >
                                Sair
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
