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
import { sortData, prettyPrintStat } from "./utilities/util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [flag, setFlag] = useState("");
  const [tableData, setTableData] = useState([]);
  const [sortBy, setSortBy] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    fetchingData();
  }, [sortBy]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
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
            isRed
            active={casesType == "cases"}
            onClick={() => {
              setCasesType("cases");
              setSortBy("cases");
            }}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.active)}
          />
          <InfoBox
            active={casesType == "recovered"}
            onClick={() => {
              setCasesType("recovered");
              setSortBy("recovered");
            }}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType == "deaths"}
            onClick={() => {
              setCasesType("deaths");
              setSortBy("deaths");
            }}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        {/* Map */}
        <Map
          center={mapCenter}
          casesType={casesType}
          countries={mapCountries}
          zoom={mapZoom}
        />
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
          {/* <Graph /> */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
