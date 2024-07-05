import "./dashboard.scss"
import ListItem from '../Components/ListItem/ListItem';
import { useEffect, useState } from "react";
import Poll from "./models/Poll";
import StatisticCard from "../Components/StatisticCard/StatisticCard";
import MainButton from "../Components/MainButton/MainButton";
import Stats from "./models/Stats";

const Dashboard = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [stats, setStats] = useState<Stats>();
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

        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/stats`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },});
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                if(data !== null){
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPolls();
        fetchStats();
    }, []);

    return (
        <>
            <h2 className="dashboard-title">About Your Polls</h2>
            <div className="poll-stats">
                <StatisticCard title={"Total Polls"} value={stats?.totalPolls.toString()}/>
                <StatisticCard title={"Total Participants"} value={stats?.totalAnswers.toString()}/>
                <StatisticCard title={"Most Popular Polls"} value={stats?.mostPopularPoll}/>
                <StatisticCard title={"Least Popular Polls"} value={stats?.leastPopularPoll}/>
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
                        <div key={index} className="list-item-div">
                            <ListItem title={poll.title} description={poll.description} id={poll.id} />
                        </div>
                    ))
                )}
            </div>
        </>
    )
}

export default Dashboard;