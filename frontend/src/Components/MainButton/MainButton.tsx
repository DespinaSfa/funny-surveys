import React from 'react';
import Button from '@mui/material/Button';
import './mainButton.scss';
import { Link } from "react-router-dom";

interface MainButtonProps {
  text: string;
  link?: string;
  onClick?: () => void; 
}

//normal button
const MainButton: React.FC<MainButtonProps> = ({ text, link, onClick }) => {
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      {link ? (
        <Button className='mainButton' component={Link} to={link} variant="contained" onClick={handleClick}>
          {text}
        </Button>
      ) : (
        <Button className='mainButton' variant="contained" onClick={handleClick}>
          {text}
        </Button>
      )}
    </div>
  );
};

export default MainButton;
