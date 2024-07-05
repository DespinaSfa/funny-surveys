import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import styles from "./Page_styles.module.scss";

const Layout = () => {
    return (
        <div>
          <Header />
    
          <div className={styles["page-margin"]}>
           <Outlet/>
          </div>
        </div>
      );
};
  
export default Layout;
