import React from 'react';
import './CustomPollHeader.scss';

interface CustomPollHeaderProps {
   heading: string;
   description: string;
 }

 //Header for Polls
const CustomPollHeader: React.FC<CustomPollHeaderProps> = ({ heading, description }) => {

    return (
       <div>
         <p className="heading">
            {heading}
         </p>
         <p className="description">
            {description}
         </p>
       </div> 
    );
  };
  
  export default CustomPollHeader;