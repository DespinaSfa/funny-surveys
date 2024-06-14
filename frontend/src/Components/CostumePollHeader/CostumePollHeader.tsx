import React from 'react';
import './CostumePollHeader.scss';

interface CostumePollHeaderProps {
   heading: string;
   description: string;
 }

const CostumePollHeader: React.FC<CostumePollHeaderProps> = ({ heading, description }) => {

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
  
  export default CostumePollHeader;