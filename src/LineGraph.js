import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral'
import { Chart } from 'chart.js/auto';

export const options = {  
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "nearest",
      intersect: false,
      callbacks: {
        label: function (data) {
          return numeral(data.value).format("+0,0");
        },
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,  
  // scales: {
  //   xAxes: [
  //     {
  //       type: "time",
  //       time: {
  //         format: "MM/DD/YY",
  //         tooltipFormat: "DD T",
  //       },
  //     },
  //   ],
  //   yAxes: [
  //     {
  //       gridLines: {
  //         display: false,
  //       },
  //       ticks: {
  //         // Include a dollar sign in the ticks
  //         callback: function (value, index, values) {
  //           return numeral(value).format("0a");
  //         },
  //       },
  //     },
  //   ],
  // },
};

const buildChartData = (data, casesType) => {
    let chartData = []
    let lastDataPoint
    for (let date in data.cases) {
      if (lastDataPoint) {
          let newDataPoint = {
              x: date,
              y: data[casesType][date] - lastDataPoint,
          }
          chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][date]
    }
    return chartData
}

const LineGraph = ({ casesType }) => {
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        let chartData = buildChartData(data, casesType)
        setData(chartData)
        console.log(chartData);
      })
    }        
    fetchData()
  }, [casesType])

  return (
    <div className='linegraph'>
      <Line 
        data={{
          datasets: [
            {
              label: 'Stats',
              backgroundColor: 'rgba(204, 16, 32, 0.55)',
              borderColor: '#CC1034',
              data: data,
              fill: true
            },
          ],
        }} 
        options={options}
      />
    </div>
  )
}

export default LineGraph
