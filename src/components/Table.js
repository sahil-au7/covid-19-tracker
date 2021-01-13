import React from "react";
import "./table.css";

const Table = ({ countries, sortBy }) => {
  const getData = (sortBy) => {
    console.log(sortBy);
    switch (sortBy) {
      case "cases":
        return "{ cases }";
      case "deaths":
        return "deaths";
      case "recovered":
        return "recovered";
      case "critical":
        return "critical";
    }
  };
  return (
    <div className="table">
      {countries.map(
        ({ country, active, cases, deaths, critical, recovered }) => (
          <tr>
            <td>{country}</td>
            <td>
              <strong>{cases} </strong>
            </td>
          </tr>
        )
      )}
    </div>
  );
};

export default Table;
