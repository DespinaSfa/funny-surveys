import React from 'react';
import Button from '@mui/material/Button';
import './GenerateButton.scss';

interface GenerateButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

//fancy Button used to generate poll
const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, disabled }) => {

    return (
        <Button className='generateButton' variant="contained" onClick={onClick} disabled={disabled} />
    );
};

export default GenerateButton;