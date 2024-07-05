import "./statisticCard.scss"

//Statistic cards displayed on the dashboard
const StatisticCard = ({ title, value } : { title: string,  value: string | undefined}) => {

    if (value === undefined || value === "0" || value === "") {
        value = "No Data"
    }

    return (
        <div className="card">
            <p className="card-title">{title}</p>
            <p className="card-value">{value}</p>
        </div>
    )
}

export default StatisticCard