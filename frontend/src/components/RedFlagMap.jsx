import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Red-Flag Icon
const redFlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default Map Center (Nairobi, Kenya)
const center = [-1.286389, 36.817223];

const RedFlagMap = () => {
  return (
    <MapContainer
      className="map-style" // Applying the updated class
      center={center}
      zoom={12}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
        // zIndex: -1, // Lower z-index to keep map behind modal
      }}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Sample Markers */}
      <Marker position={[-1.286389, 36.817223]} icon={redFlagIcon}>
        <Popup> 🚩 Red-Flag Report</Popup>
      </Marker>
    </MapContainer>
  );
};

export default RedFlagMap;
