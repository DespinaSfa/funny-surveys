import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from "react-router-dom";
import c from './UserHandler.module.scss';
import InputField from "../InputField";
import MainButton from "../MainButton/MainButton";

interface DropdownMenuProps {
    icon: React.ReactElement; // Icon als React-Element (Pflicht)
    menuItems: { label: string, link?: string, action?: () => void }[]; // Menüeinträge mit Text und Link oder Aktion
    text?: string; // Optionaler Text
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ icon, menuItems, text, openDialog, setOpenDialog }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [newUsername, setNewUsername] = useState('');
    const token = localStorage.getItem('token');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleUsernameChange = () => {
        changeUsername()
            .then(() => {
                localStorage.setItem('username', newUsername);
                setOpenDialog(false);
                window.location.reload(); // Refresh to update username
            })
            .catch(error => {
                console.error('Failed to update username:', error);
            });
    };

    async function changeUsername() {
        try {
            const response = await fetch('http://localhost:3001/update-username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ newUsername })
            });

            if (!response.ok) {
                throw new Error('Failed to update username');
            }
        } catch (error) {
            console.error('Error occurred during update username:', error);
            throw error;
        }
    }


    return (
        <div>
            <Button
                className={c.Button}
                variant="contained"
                onClick={handleClick}
                endIcon={React.cloneElement(icon, { className: c.endIcon })} // Icon-Klasse hinzufügen
            >
                {text ? text : ""}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                    '& .MuiMenu-list': {
                        padding: '0',
                    },
                    '& .MuiMenuItem-root': {
                        backgroundColor: '#DBF881',
                    },

                }}
            >
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        component={item.link ? Link : 'div'}
                        to={item.link || ''}
                        onClick={() => {
                            handleClose();
                            if (item.action) item.action();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                PaperProps={{
                    sx: {
                        backgroundColor: '#333333',
                        color: 'white',
                        borderRadius: '0.5rem',
                        padding: '1rem'
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Raleway', fontWeight: 700, color: 'white', padding: '1rem'}}>
                    Benutzernamen aktualisieren
                </DialogTitle>
                <DialogContent>
                    <InputField
                        label="Neuer Benutzername"
                        placeholder="Geben Sie Ihren neuen Benutzernamen ein"
                        onChange={setNewUsername}
                    />
                </DialogContent>
                <DialogActions>
                    <MainButton
                        onClick={handleDialogClose}
                        text={"Cancel"}
                    />
                    <MainButton
                        onClick={handleUsernameChange}
                        text={"Save"}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DropdownMenu;
