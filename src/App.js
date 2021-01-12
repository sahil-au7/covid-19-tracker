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
import Map from "./components/Map";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [flag, setFlag] = useState("");

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
        setFlag(data.countryInfo.flag);
        // console.log(data);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className="app__headerTitle">COVID-19 TRACKER</h1>
          {country === "worldwide" ? (
            <></>
          ) : (
            // console.log(">>>>>>>> line 62", flag)
            <img className="app__flag" src={flag} alt="" />
          )}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
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
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* <Table /> */}
          <h3>Worldwide new Cases</h3>
          {/* <Graph /> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
