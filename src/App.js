import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import "./App.css";
import React, { useState, useEffect } from "react";
import InfoBox from "./components/InfoBox";
import Table from "./components/Table";
import Map from "./components/Map";
import { sortData } from "./utilities/util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [flag, setFlag] = useState("");
  const [tableData, setTableData] = useState([]);
  const [sortBy, setSortBy] = useState("cases");

  useEffect(async () => {
    await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const fetchingData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data, sortBy);
          // console.log(sortBy);
          // console.log(sortedData);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    fetchingData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setFlag(data.countryInfo.flag);
        }
      });
  };

  const sortDataBy = (event) => {
    const sort = event.target.value;
    setSortBy(sort);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__headerTitle">COVID-19 TRACKER</h1>
          {country === "worldwide" ? (
            <img
              className="app__flag"
              src="https://www.pikpng.com/pngl/m/209-2093609_globe-black-and-white-png-world-globe-black.png"
              alt=""
            />
          ) : (
            <img className="app__flag" src={flag} alt="" />
          )}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries?.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.active}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        {/* Map */}
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__rightTable">
            <h3 className="app__rightTitle">Live Cases by Country</h3>
            <FormControl className="app__rightTableDropdownMenu">
              <p className="app__rightTableDropdownSort">SortBy: </p>
              <Select
                variant="outlined"
                value={sortBy}
                onChange={sortDataBy}
                className="app__rightTableDropdown"
              >
                <MenuItem value="cases">Cases</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="deaths">Deaths</MenuItem>
                <MenuItem value="recovered">Recovered</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* Table */}
          <Table countries={tableData} sortBy={sortBy} />
          <h3 className="app__rightTitle2">Worldwide new Cases</h3>
          {/* <Graph /> */}
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
