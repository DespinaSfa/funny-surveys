import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface InputFieldProps {
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
    startIcon?: JSX.Element;
    type?: string;
    error?: boolean;
    sx?: any;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, onChange, startIcon, type, error, sx }) => {
    const [internalValue, setInternalValue] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInternalValue(value);
        onChange(value);
    };

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& > :not(style)': { m: 0 },
                width: '100%',
                ...sx,
            }}
            noValidate
            autoComplete="off"
        >
            <TextField 
                label={label}
                placeholder={placeholder}
                variant="outlined" 
                value={internalValue}
                onChange={handleChange}
                InputProps={{
                    startAdornment: startIcon, 
                }}
                type={type}
                error={error} 
                helperText={error ? 'This field is required' : ''}
                sx={{
                    '& .MuiInputLabel-root': { 
                        color: 'white',
                        '&.Mui-focused': {
                            color: '#DBF881',
                        },
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: error ? 'red' : 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: error ? 'red' : '#DBF881' },
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    ...sx
                }}
            />
        </Box>
    );
};

export default InputField;
