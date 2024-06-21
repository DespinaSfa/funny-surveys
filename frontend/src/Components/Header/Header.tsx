import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import c from './Header.module.scss';
import MainButton from '../MainButton/MainButton';
import DropdownMenu from "../UserHandler/UserHandler";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // Zustand für den Dialog hinzufügen
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/login');
    };

    const menuItems = [
        { label: 'Change Username', action: () => setOpenDialog(true) }, // Aktion zum Öffnen des Dialogs
        { label: 'Logout', action: handleLogout },
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');
        if (token) {
            setIsLoggedIn(true);
            setUsername(user || '');
        }
    }, []);

    return (
        <div className={c.header}>
            <Link to="/" className={c.icon}>
                Party Poll
            </Link>
            {isLoggedIn ? (
                <div className={c.user_handling}>
                    <DropdownMenu
                        text={username}
                        icon={<KeyboardArrowDownIcon />}
                        menuItems={menuItems}
                        openDialog={openDialog}
                        setOpenDialog={setOpenDialog}
                    />
                </div>
            ) : (
                <MainButton text='Login' link='/login' />
            )}
        </div>
    );
};

export default Header;
