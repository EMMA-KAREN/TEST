import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom Intervention Icons
const blueFlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684913.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default Map Center (Nairobi, Kenya)
const center = [-1.286389, 36.817223];

const InterventionMap = () => {
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
      <Marker position={[-1.2921, 36.8219]} icon={blueFlagIcon}>
        <Popup> 🔨 Intervention Request</Popup>
      </Marker>
    </MapContainer>
  );
};

export default InterventionMap;
