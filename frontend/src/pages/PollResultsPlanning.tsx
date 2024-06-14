import React from 'react';
import HorizontalBarChart from "../Components/BarChart";
import c from './Page_styles.module.scss';
import { calculateCountsPlanning, PollData } from './PollResultsHelpers';

const PollResultsPlanning = ({ data }: { data: PollData }) => {
    const musicPreferencesCounts = calculateCountsPlanning(data.PollPlannings, 'MusicToBePlayed');
    const eventActivitiesCounts = calculateCountsPlanning(data.PollPlannings, 'Activities');
    const eventWishesCounts = calculateCountsPlanning(data.PollPlannings, 'EventWish');

    return (
        <div>
            <div className={c.pollResCard}>
                <h3>Which drinks are absolutely essential? 🥤</h3>
                {data.PollPlannings.map((item, index) => (
                    <div key={index}>{item.EssentialDrink}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3>Which food are absolutely essential? 🍔</h3>
                {data.PollPlannings.map((item, index) => (
                    <div key={index}>{item.EssentialFood}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3>What kind of music should be played? 🎶</h3>
                <HorizontalBarChart counts={musicPreferencesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What activities should be at the event? 🎉</h3>
                <HorizontalBarChart counts={eventActivitiesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What do you wish for the event? 🌟</h3>
                <HorizontalBarChart counts={eventWishesCounts} />
            </div>
        </div>
    );
};

export default PollResultsPlanning;
