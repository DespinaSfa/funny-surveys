import React from 'react';
import Button from '@mui/material/Button';
import c from './GenerateButton.module.scss';

interface GenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled }) => {
    return (
        <Button className={c.generateButton} variant="contained" onClick={onClick} disabled={disabled}>
        </Button>
    );
};

export default GenerateButton;