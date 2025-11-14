import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import useMediaQuery from '../../hooks/useMediaQuery';
import Link from './Link';

const Navbar = () => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    return (
        <nav>
            <div className={`${flexBetween} fixed top-0 z-30 w-full py-6 bg-white shadow-md`}>
                <div className={`${flexBetween} mx-auto w-5/6`}>
                    {/* LEFT SIDE */}
                    <div className={`${flexBetween} w-full`}>
                        <h1 className="text-xl font-bold">Biblioteca PIB</h1>
                    </div>
                    {/* RIGHT SIDE */}
                    {isAboveMediumScreens ? (
                        <>
                            <div className={`${flexBetween} w-full gap-8 text-sm`}>
                                <Link page="Acervo" to="/books" />
                                <Link page="Empréstimos" to="/loans" />
                                <Link page="Usuários" to="/users" />
                                <Link page="Configurações" to="/settings" />
                                <Link page="Minha conta" to="/my-account" />
                            </div>
                            <div className={`${flexBetween} gap-8`}>
                                <p className="cursor-pointer hover:text-gray-600">Login</p>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Sair</button>
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
                    <div className="ml-[33%] flex flex-col gap-10 text-2xl">
                        <Link page="Acervo" to="/books" />
                        <Link page="Empréstimos" to="/loans" />
                        <Link page="Usuários" to="/users" />
                        <Link page="Configurações" to="/settings" />
                        <Link page="Minha conta" to="/my-account" />
                    </div>

                    {/* LOGIN/LOGOUT */}
                    <div className="ml-[33%] mt-10 flex flex-col gap-4">
                        <p className="cursor-pointer hover:text-gray-600">Login</p>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-fit">Sair</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
