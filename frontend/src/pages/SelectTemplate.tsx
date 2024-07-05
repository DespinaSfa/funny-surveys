import { Outlet, Link } from "react-router-dom";
import './selectTemplate.scss';
import Button from "@mui/material/Button";
import PageHeader from "../Components/PageHeader/PageHeader";

//select poll type page
//contains 3 buttons one for each poll type
const SelectTemplate = () => {

    return(
        <div className="content">
            <PageHeader heading="Select poll type" />
            <div className="selectContainer">
                <Button className="selectButton party" variant="contained" component={Link} to='/template/party'>
                    <div className="buttonText">Party</div>
                </Button>
                <Button className="selectButton room" variant="contained" component={Link} to='/template/planning'>
                    <div className="buttonText">Planning</div>
                </Button>
                <Button className="selectButton wedding" variant="contained" component={Link} to='/template/wedding'>
                        
                    <div className="buttonText">Wedding</div>
                </Button>
            </div>

            <Outlet />
        </div>
    )
  };
  
  export default SelectTemplate;