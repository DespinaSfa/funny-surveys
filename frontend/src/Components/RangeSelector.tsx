import React from 'react';
import Slider from '@mui/material/Slider';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const SliderComponent: React.FC<SliderProps> = ({ min, max, step, onChange, disabled  }) => {
  const defaultValue = Math.ceil((max - min) / 2 + min);

  const handleSliderChange = (event: Event, value: number | number[]) => {
    if (!Array.isArray(value)) {
      onChange(value);
    }
  };

  return (
    <Slider
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      marks
      valueLabelDisplay='auto'
      aria-label='slider'
      sx={{
        width: '100%',
        color: '#DBF881'
      }}
      disabled={disabled}
      onChange={handleSliderChange} 
    />
  );
};

export default SliderComponent;
