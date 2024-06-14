import "./dashboard.scss"
import ListItem from '../Components/ListItem/ListItem';
import { useEffect, useState } from "react";
import Poll from "./models/Poll";
import StatisticCard from "../Components/StatisticCard/StatisticCard";
import MainButton from "../Components/MainButton/MainButton";
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
            const fetchPolls = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },});
                if (!response.ok) {
                    throw new Error('Failed to fetch polls');
                }
                const data = await response.json();
                if(data !== null){
                    setPolls(data);
                }
                else{
                    setPolls([])
                }
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPolls();
    }, []);

    return (
        <>
            <h2 className="dashboard-title">About Your Polls</h2>
            <div className="poll-stats">
                <StatisticCard title={"Total Polls"} value={"123"}/>
                <StatisticCard title={"Total Participants"} value={"1234"}/>
                <StatisticCard title={"Most Popular Polls"} value={"Freds Fette Fete"}/>
                <StatisticCard title={"Least Popular Polls"} value={"Unsere Hochzeit"}/>
            </div>
            <div className="spread">
                <h2 className="dashboard-title">Your Polls</h2>
                <MainButton text={"Add Poll"} link={"/select-template"}/>
            </div>
            <div className="poll-list">
                {polls.length === 0 ? (
                    <p className="empty-message">No polls available</p>
                ) : (
                    polls.map((poll, index) => (
                        <Link key={index} to={`/results/${poll.id}`} className="list-item-link">
                            <ListItem title={poll.title} description={poll.description} />
                        </Link>
                    ))
                )}
            </div>
        </>
    )
}

export default Dashboard;