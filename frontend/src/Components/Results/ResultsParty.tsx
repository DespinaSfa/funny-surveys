import HorizontalBarChart from "../BarChart";
import c from '../../pages/Page_styles.module.scss';
import '../../pages/Results.scss';
import { calculateCounts, PollData } from '../../pages/models/PollHelpers';

interface ResultsPartyProps {
    data: PollData;
}

//displays results for party polls
const ResultsParty: React.FC<ResultsPartyProps> = ({ data }) => {

    const alcoholLevelCounts = calculateCounts(data.PollParties, 'CurrentAlcoholLevel');
    const goalAlcoholLevelCounts = calculateCounts(data.PollParties, 'PreferredAlcoholLevel');
    const favPartyActivityCounts = calculateCounts(data.PollParties, 'FavoriteActivity');

    return (
        <div>
            <div className={c.pollResCard}>
                <h3>Which songs should definitely be played tonight? 📻</h3>
                {data.PollParties.map((item, index) => (
                    <div className="text-result" key={index}>{ `● ${item.SongToBePlayed}`}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3>What is your current alcohol level? 📈</h3>
                <HorizontalBarChart counts={alcoholLevelCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What alcohol level have you set as your goal for today? 🍺</h3>
                <HorizontalBarChart counts={goalAlcoholLevelCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What is your favorite party activity?</h3>
                <HorizontalBarChart counts={favPartyActivityCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>Which snacks or drinks would you like for the next party? 🍔</h3>
                {data.PollParties.map((party, index) => (
                    <div className="text-result" key={index}>{`● ${party.WishSnack}`}</div>
                ))}
            </div>
        </div>
    );
};

export default ResultsParty;
