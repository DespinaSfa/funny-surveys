import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from "react-router-dom";
import c from './userHandler.module.scss';
import InputField from "../InputField";
import MainButton from "../MainButton/MainButton";

interface DropdownMenuProps {
    icon: React.ReactElement; // Icon als React-Element (Pflicht)
    menuItems: { label: string, link?: string, action?: () => void, disabled?: boolean }[]; // Menüeinträge mit Text und Link oder Aktion
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-username`, {
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
        <div className={c.updateUsername}>
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
                        disabled={item.disabled}
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
                        padding: '1rem',
                        width: '90%'
                    }
                }}
            >
                <DialogTitle sx={{ fontFamily: 'Raleway', fontWeight: 700, color: 'white', padding: '1rem'}}>
                    Update Username
                </DialogTitle>
                <div className={c.inputField}>
                <DialogContent>
                    <InputField
                        label="New Username"
                        placeholder="Enter your new username"
                        onChange={setNewUsername}
                    />
                </DialogContent>
                </div>
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
