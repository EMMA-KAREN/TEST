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
const interventionIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Default Map Center (Nairobi, Kenya)
const center = [-1.286389, 36.817223];

const OpenStreetMap = () => {
  const [interventions, setInterventions] = useState([]);

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const response = await fetch(`${apiURL}/interventions/all`);
        const data = await response.json();
        const formattedData = data.map((flag) => ({
          id: flag.id,
          title: flag.title,
          description: flag.description,
          location: flag.location,
          coordinates: flag.coordinates.split(","),
        }));
        setInterventions(formattedData);
      } catch (error) {
        console.error("Failed to fetch red flags:", error);
      }
    };
    fetchInterventions();
  }, []); 

  return (
    <MapContainer className="map-style"
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

      {interventions &&
        interventions.map((intervention) => (
          <Marker
            key={intervention.id}
            position={[intervention.coordinates[0], intervention.coordinates[1]]}
            icon={interventionIcon}
          >
            <Popup>
              <h3>{intervention.title}</h3>
              <p>{intervention.description}</p>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default OpenStreetMap;

