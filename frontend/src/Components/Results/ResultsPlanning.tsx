import HorizontalBarChart from "../BarChart";
import c from '../../pages/Page_styles.module.scss';
import '../../pages/Results.scss';

import { calculateCountsPlanning, PollData } from '../../pages/models/PollHelpers';

const PollResultsPlanning = ({ data }: { data: PollData }) => {
    const musicPreferencesCounts = calculateCountsPlanning(data.PollPlannings, 'MusicToBePlayed');
    const eventActivitiesCounts = calculateCountsPlanning(data.PollPlannings, 'Activities');

    return (
        <div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>Which drinks are absolutely essential?</span> 🥤
                </h3>
                {data.PollPlannings.map((item, index) => (
                    <div className="text-result" key={index}>{`● ${item.EssentialDrink}`}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>Which food are absolutely essential?</span> 🍔
                </h3>
                {data.PollPlannings.map((item, index) => (
                    <div className="text-result" key={index}>{`● ${item.EssentialFood}`}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What kind of music should be played?</span> 🎶
                </h3>
                <HorizontalBarChart counts={musicPreferencesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What activities should be at the event?</span> 🎉
                </h3>
                <HorizontalBarChart counts={eventActivitiesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What do you wish for the event?</span> 🌟
                </h3>
                {data.PollPlannings.map((wish, index) => (
                    <div className="text-result" key={index}>{`● ${wish.EventWish}`}</div>
                ))}
            </div>
        </div>
    );
};

export default PollResultsPlanning;
