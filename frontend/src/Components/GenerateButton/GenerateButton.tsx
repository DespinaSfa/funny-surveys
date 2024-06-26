import React from 'react';
import Button from '@mui/material/Button';
import c from './GenerateButton.module.scss';

interface GenerateButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ label, onClick, disabled }) => {
    return (
        <Button className={c.generateButton} variant="contained" onClick={onClick} disabled={disabled}>
            {label}
        </Button>
    );
};

export default GenerateButton;