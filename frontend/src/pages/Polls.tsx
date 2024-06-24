import { useEffect, useState } from "react";
import CostumePollHeader from "../Components/CostumePollHeader/CostumePollHeader"
import Party from "../Components/Templates/Party";
import { useParams } from "react-router-dom"
import { PollData } from "./PollHelpers";
import Wedding from "../Components/Templates/Wedding";
import Planning from "../Components/Templates/Planning";


const Polls = () => {

    const [pollData, setPollData] = useState<PollData | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/polls/${id}`);
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

    console.log(pollData);
    
    return (
            <>
                <CostumePollHeader heading={pollData.Title} description={pollData.Description} />
                {pollData.PollType == 'party' && <Party poll_id={pollData.ID} />}
                {pollData.PollType == 'wedding' && <Wedding poll_id={pollData.ID} />}
                {pollData.PollType == 'planning' && <Planning poll_id={pollData.ID}/>}
            </>
     );
  };
  
  export default Polls;