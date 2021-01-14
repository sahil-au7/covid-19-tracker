import React from "react";
import "./table.css";

const Table = ({ countries, sortBy }) => {
  return (
    <div className="table">
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{country[sortBy]}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
