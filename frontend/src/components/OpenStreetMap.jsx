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
  iconSize: [12, 20],
  iconAnchor: [6, 20],
  popupAnchor: [1, -20],
});

const interventionIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [12, 20],
  iconAnchor: [6, 20],
  popupAnchor: [1, -20],
});

// Default Map Center (Kenya)
const center = [1.2921, 36.8219];

const OpenStreetMap = () => {
  const [redFlags, setRedFlags] = useState([]);
  const [interventions, setInterventions] = useState([]);

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
          coordinates: (flag.coordinates.split(",")),
        }));
        setRedFlags(formattedData);
      } catch (error) {
        console.error("Failed to fetch red flags:", error);
      }
    };

    const fetchInterventions = async () => {
      try {
        const response = await fetch(`${apiURL}/interventions/all`);
        const data = await response.json();
        const formattedData = data.map((intervention) => ({
          id: intervention.id,
          title: intervention.title,
          description: intervention.description,
          location: intervention.location,
          coordinates: (intervention.coordinates.split(",")),
        }));
        setInterventions(formattedData);
      } catch (error) {
        console.error("Failed to fetch interventions:", error);
      }
    };

    fetchRedFlags();
    fetchInterventions();
  }, []);

  return (
    <MapContainer
      className="map-container"
      center={center}
      zoom={6}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "1rem",
        overflow: "hidden",
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
        redFlags.map((post) => (
          <Marker
            key={post.id}
            position={[post.coordinates[0], post.coordinates[1]]}
            icon={redFlagIcon}
          >
            <Popup>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Popup>
          </Marker>
        ))}
      
      {interventions.map((post) => (
        <Marker
          key={post.id}
          position={[post.coordinates[0], post.coordinates[1]]}
          icon={interventionIcon}
        >
          <Popup>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default OpenStreetMap;