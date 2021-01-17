import React from "react";
import "./map.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { showDataOnMap } from "../utilities/util";

const Map = ({ countries, casesType, center, zoom }) => {
  return (
    <div className="map">
      {center !== null && (
        <MapContainer center={center} zoom={zoom}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showDataOnMap(countries, casesType)}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
