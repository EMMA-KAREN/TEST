import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import apiURL from "../config";

const { BaseLayer } = LayersControl;

// Custom Icons
const redFlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default Map Center (Nairobi, Kenya)
const center = [-1.286389, 36.817223];

const OpenStreetMap = () => {
  const [redFlags, setRedFlags] = useState([]);

  useEffect(() => {
    const fetchRedFlags = async () => {
      try {
        const response = await fetch(`${apiURL}/red_flags/all`);
        const data = await response.json();
        const formattedData = data.map((flag) => ({
          id: flag.id,
          title: flag.title,
          description: flag.description,
          location: flag.location,
          coordinates: flag.coordinates.split(","),
        }));
        setRedFlags(formattedData);
      } catch (error) {
        console.error("Failed to fetch red flags:", error);
      }
    };
    fetchRedFlags();
  }, []); // Add empty dependency array to run once after mount

  return (
    <MapContainer className="map-style" // Applying the updated class
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
      <LayersControl position="topright">
        <BaseLayer checked name="Street View">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </BaseLayer>
        <BaseLayer name="Satellite View">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </BaseLayer>
      </LayersControl>

      {redFlags &&
        redFlags.map((red_flag) => (
          <Marker
            key={red_flag.id}
            position={[red_flag.coordinates[0], red_flag.coordinates[1]]}
            icon={redFlagIcon}
          >
            <Popup>
              <h3>{red_flag.title}</h3>
              <p>{red_flag.description}</p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default OpenStreetMap;

