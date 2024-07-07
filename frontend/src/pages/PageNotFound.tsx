import { Outlet } from "react-router-dom";
import MainButton from "../Components/MainButton/MainButton";

//default page
//contains button which navigates to landing page
const PageNotFound = () => {

    return(
        <div>
            <p>This page doesn't exist, go back to the Starting Page.</p>
            <div>
                <MainButton text="Home" link="/"/>
            </div>
            <Outlet />
        </div>
    )
  };
  
  export default PageNotFound;
  