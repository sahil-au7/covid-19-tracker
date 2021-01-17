import React from "react";
import "./table.css";
import { format } from "../utilities/util";
const Table = ({ countries, sortBy }) => {
  return (
    <div className="table">
      {/* {console.log(sortBy, countries)} */}
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{format(country[sortBy])}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
