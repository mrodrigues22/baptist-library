import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SelectedPage } from '../../shared/types';

interface Props {
    page: string;
    to: string;
}

const Link = ({ page, to }: Props) => {
    const location = useLocation();
    const isSelected = location.pathname === to;

    return (
        <RouterLink
            className={`${isSelected ? 'text-primary' : ''} transition duration-150 delay-75 hover:text-primary font-bold`}
            to={to}
        >
            {page}
        </RouterLink>
    );
};

export default Link;
