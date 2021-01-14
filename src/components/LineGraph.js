import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

const LineGraph = () => {
  const [data, setData] = useState({});
  const url = "https://disease.sh/v3/covid-19/historical/all?lastdays=120";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);
  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    data[casesType].forEach((date) => {
      if (lastDataPoint) {
        const newDataPoint = {
          x: Date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data["cases"][date];
    });
    return chartData;
  };
  //   buildChartData(data);
  return (
    <div>
      {/* <Line data options /> */}
      <p>Chart</p>
    </div>
  );
};

export default LineGraph;
