import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Red-Flag & Intervention Icons
const redFlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const blueFlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684913.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default Map Center (Nairobi, Kenya)
const center = [-1.286389, 36.817223];

const OpenStreetMap = () => {
  return (
    <MapContainer center={center} zoom={12} style={{ height: "400px", width: "100%" }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Sample Markers */}
      <Marker position={[-1.286389, 36.817223]} icon={redFlagIcon}>
        <Popup>🟥 Red-Flag Report</Popup>
      </Marker>
      <Marker position={[-1.2921, 36.8219]} icon={blueFlagIcon}>
        <Popup>🟦 Intervention Request</Popup>
      </Marker>
    </MapContainer>
  );
};

export default OpenStreetMap;
