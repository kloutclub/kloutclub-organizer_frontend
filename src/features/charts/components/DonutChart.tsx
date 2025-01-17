import React from 'react';
import {Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    checkedInUsers: number;
    nonCheckedInUsers: number;
}

const DonutChart:React.FC<DonutChartProps> = (props) => {

    const data = {
        labels: ["Checked In", "Non-Checked In"],
        datasets: [{
            label: "Users",
            data: [props.checkedInUsers, props.nonCheckedInUsers],
            backgroundColor: ["#07845e", "#fbbf24"],
            borderColor: ["white"]
        }]
    }

    const options = {}

  return (
    <div className='w-full'>
        <Doughnut data={data} options={options} />
    </div>
  )
}

export default DonutChart;