import React from 'react';
import { BarChart } from '@mui/x-charts';

interface HighlightCounts {
    [key: string]: number;
}

interface MyBarChartComponentProps {
    counts: HighlightCounts;
}

class MyBarChartComponent extends React.Component<MyBarChartComponentProps> {
    render() {
        const { counts } = this.props;

        const xAxisConfig = {
            tickLabelInterval: (value: any, index: any) => Number.isInteger(value), // only full numbers bc these are counts
            valueFormatter: (value: any) => value.toFixed(0),
            label:'Votes'
        };

        // Transform the highlightCounts object into an array suitable for the BarChart
        const dataset = Object.entries(counts).map(([name, value]) => ({
            name,
            value
        }));

        return (
            <BarChart
                dataset={dataset}
                yAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                xAxis={[xAxisConfig]}
                series={[
                    {
                        color:'#DBF881',
                        dataKey: 'value',
                        valueFormatter: (value) => `${value} votes`
                    }
                ]}
                width={500}
                height={200}
                layout="horizontal"
                borderRadius={5}
                margin={{ left: 75 }}
                sx={{
                    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel, & .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel, &.MuiChartsAxis-tick, .MuiChartsAxis-label": {
                        strokeWidth: "0.4",
                        fill: "#fff"
                    },
                    "& .MuiChartsAxis-left .MuiChartsAxis-line, & .MuiChartsAxis-bottom .MuiChartsAxis-line, .MuiChartsAxis-tick": {
                        stroke: "#fff",
                        strokeWidth: 0.4,
                    }
                }}
            />
        );
    }
}

export default MyBarChartComponent;
