import { useEffect, useState } from "react";
import CustomPollHeader from "../Components/CustomPollHeader/CustomPollHeader"
import Party from "../Components/Polls/Party";
import { useParams } from "react-router-dom"
import { PollData } from "./models/PollHelpers";
import Wedding from "../Components/Polls/Wedding";
import Planning from "../Components/Polls/Planning";


const Polls = () => {

    const [pollData, setPollData] = useState<PollData | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch poll data");
                }
                const data = await response.json();
                setPollData(data);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPollData();
    }, [id]);

    if (!pollData) return <div>Loading...</div>;
    
    return (
            <>
                <CustomPollHeader heading={pollData.Title} description={pollData.Description} />
                {pollData.PollType === 'party' && <Party poll_id={pollData.ID} />}
                {pollData.PollType === 'wedding' && <Wedding poll_id={pollData.ID} />}
                {pollData.PollType === 'planning' && <Planning poll_id={pollData.ID}/>}
            </>
     );
  };
  
  export default Polls;