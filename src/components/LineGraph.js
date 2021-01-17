import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import "./LineGraph.css";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(247,105,89)",
  },
  recovered: {
    hex: "rgb(46,133,110)",
    rgb: "rgb(1,254,17)",
  },
  deaths: {
    hex: "#CC1034",
    rgb: "#fb4443 ",
  },
};

const LineGraph = ({ casesType, ...props }) => {
  const [data, setData] = useState({});
  // const [casesType, setCasesType] = useState("cases");
  const [query, setQuery] = useState(120);
  const url = `https://disease.sh/v3/covid-19/historical/all?lastdays=${query}`;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [query, casesType]);

  const dataByDays = (event) => {
    const days = event.target.value;
    setQuery(days);
  };

  return (
    <div className="lineGraph">
      <div className="lineGraph__titleOptions">
        <h3 className="app__rightTitle2">Worldwide new {casesType}</h3>
        <FormControl className="app__rightTableDropdownMenu">
          <Select
            variant="outlined"
            value={query}
            onChange={dataByDays}
            className="app__rightTableDropdown"
          >
            <MenuItem value="120">120</MenuItem>
            <MenuItem value="60">60</MenuItem>
            <MenuItem value="90">90</MenuItem>
            <MenuItem value="180">180</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={props.className}>
        {data?.length > 0 && (
          <Line
            data={{
              datasets: [
                {
                  backgroundColor: casesTypeColors[casesType].rgb,
                  borderColor: casesTypeColors[casesType].hex,
                  data: data,
                },
              ],
            }}
            options={options}
          />
        )}
      </div>
    </div>
  );
};

export default LineGraph;
