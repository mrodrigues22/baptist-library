import React from 'react'
import { useState  } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import Link from './Link'
import { SelectedPage } from '../../shared/types';
import useMediaQuery from '../../hooks/useMediaQuery';

interface Props {
    selectedPage: SelectedPage,
    setSelectedPage: (value: SelectedPage) => void
}

const Navbar = ({ selectedPage, setSelectedPage }: Props) => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");

    return (
        <nav>
            <div
                className={`${flexBetween} fixed top-0 z-30 w-full py-6`}>
                    <div className={`${flexBetween} mx-auto w-5/6`}>
                        {/* LEFT SIDE */}
                        <div className={`${flexBetween} w-full`}>
                            bibliotecapib
                        </div>
                        {/* RIGHT SIDE */}
                        {isAboveMediumScreens ? (
                        <><div className={`${flexBetween} w-full gap-8 text-sm`}>
                            <Link page="Acervo" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                            <Link page="Empréstimos" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                            <Link page="Usuários" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                            <Link page="Configurações" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                            <Link page="Minha conta" selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
                        </div><div className={`${flexBetween} gap-8`}>
                                <p>Login</p>
                                <button>Sair</button>
                            </div></>) : (
                            <button>
                                <Bars3Icon className='h-6 w-6 text-gray-600' onClick={() => setIsMenuToggled(!isMenuToggled)} />
                            </button>
                        )}
                    </div>
            </div>
        </nav>
    )
}

export default Navbar