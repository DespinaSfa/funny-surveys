import './landingPage.scss';
import MainButton from "../Components/MainButton/MainButton";

const LandingPage = () => {
    return(
        <div className="landingPage">
            <div className="content">
                <h1 className="icon">Party Poll</h1>
                <p className="text">Tired of boring parties? Spice things up with PartyPoll! Vote on songs, request the next party food, you name it! Plus, no need for sober sign-ups - just scan the QR code and vote instantly!</p>
                <div className="button">
                    <MainButton text="Create Poll" link="/select-template"/>
                </div>
            </div>
        </div>
    )
  };
  
  export default LandingPage;
  