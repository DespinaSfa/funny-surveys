import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import MainButton from '../MainButton/MainButton';
import DropdownMenu from "../UserHandler/UserHandler";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//Header which is displayed on each side
//via click on logo aou can return to landing page
//shows which user is logged in
//menu button -> User Handler
const Header = () => {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // Zustand für den Dialog hinzufügen
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');
        if (token) {
            setIsLoggedIn(true);
            setUsername(user || '');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/login');
    };

    //array of menu options
    const menuItems = [
        { label: 'Dashboard', action: () => navigate("/dashboard"), disabled: window.location.pathname === '/dashboard'},
        { label: 'Change Username', action: () => setOpenDialog(true), disabled: false },
        { label: 'Logout', action: handleLogout, disabled: false },
    ];

    return (
        <div className='header'>
            <Link to="/" className='icon'>
                Party Poll
            </Link>
            {isLoggedIn ? (
                <div className='user_handling'>
                    <DropdownMenu
                        text={username}
                        icon={<KeyboardArrowDownIcon />}
                        menuItems={menuItems}
                        openDialog={openDialog}
                        setOpenDialog={setOpenDialog}
                    />
                </div>
            ) : (
                <>
                    {window.location.pathname !== '/login' && (
                        <MainButton text='Login' link='/login' />
                    )}
                </>
            )}
        </div>
    );
};

export default Header;
