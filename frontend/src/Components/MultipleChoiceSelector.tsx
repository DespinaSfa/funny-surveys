import React, { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface ChoiceSelectorProps {
    options: string[];
    onChange: (option: string) => void;
}

const ChoiceSelector: React.FC<ChoiceSelectorProps> = ({ options, onChange }) => {
    const [localSelectedOption, setLocalSelectedOption] = useState(options[0]);

    const handleOptionChange = (option: string) => {
        if (localSelectedOption !== option) {
            setLocalSelectedOption(option); 
            onChange(option); 
        }
    };

    return (
        <FormGroup>
            {options.map((option) => (
                <FormControlLabel
                    key={option}
                    control={
                        <Checkbox
                            checked={localSelectedOption === option} 
                            onChange={() => handleOptionChange(option)}
                            sx={{
                                '&.MuiCheckbox-root': {
                                    color: '#ffffff', 
                                },
                                '&.Mui-checked': {
                                    color: '#DBF881', 
                                },
                            }}
                        />
                    }
                    label={option}
                />
            ))}
        </FormGroup>
    );
}

export default ChoiceSelector;
