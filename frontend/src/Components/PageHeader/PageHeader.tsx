import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React from 'react';
import c from './PageHeader.module.scss';

interface PageHeaderProps {
  heading: string;
}

//Header for pages
//displays header of page
//contains a back button
const PageHeader: React.FC<PageHeaderProps> = ({ heading }) => {
  
  return (
    <div className={c.container}>
        <IconButton onClick={() => {window.history.back()}}>
            <ArrowBackIcon  className={c.backButton} />
        </IconButton>
        <p className={c.heading}>{heading}</p>
    </div>
  );
};

export default PageHeader;