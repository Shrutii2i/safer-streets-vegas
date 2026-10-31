import { useEffect } from "react";

import { MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents
 } from "react-leaflet";
import "leaflet/dist/leaflet.css";





function MapBoundsListener({ onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
  });

  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, [map, onBoundsChange]);

  return null;
}


const collisionColors = {
  "ANGLE": "#2563eb",                  // Blue
  "REAR END": "#f97316",               // Orange
  "HEAD ON": "#dc2626",                // Red
  "SIDESWIPE - OVERTAKING": "#8b5cf6", // Purple
  "SIDESWIPE - MEETING": "#8b5cf6",    // Purple
  "NON-COLLISION": "#64748b",          // Gray
  "BACKING": "#14b8a6",                // Teal
};


function TrafficMap({hotspots, crashes=[],  onBoundsChange}) {
  return (
     <div>
    <MapContainer
      center={[36.1699, -115.1398]}
      zoom={11}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
       url={`https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`}

      />
    
   {hotspots.map((spot) => (
  <CircleMarker
    key={spot.id}
    center={[spot.latitude, spot.longitude]}
    radius={spot.crashes * 2}
    pathOptions={{
      color: "#b91c1c",
      fillColor: "#ef4444",
      fillOpacity: 0.7
    }}
  >
    <Popup>
      <strong>{spot.location}</strong>
      <p>Example crashes: {spot.crashes}</p>
      <p>Demonstration data only</p>
    </Popup>
  </CircleMarker>
))}


{crashes.map((crash) => (
  <CircleMarker
    key={crash.crash_number}
    center={[crash.latitude, crash.longitude]}
    radius={5}
    pathOptions={{
    color:
    collisionColors[crash.collision_type?.trim().toUpperCase()] ||
    "#94a3b8",
    fillOpacity: 0.7,
    }}
  >
    <Popup>
      <strong>{crash.street1 || "Unknown street"}</strong>
      <p>Date: {crash.crash_date}</p>
      <p>Type: {crash.crash_type || "Unknown"}</p>
      <p>Historical crash record</p>
    </Popup>
  </CircleMarker>
))}

{onBoundsChange && (
  <MapBoundsListener onBoundsChange={onBoundsChange} />
)}

    </MapContainer>
 </div>
  );
}

export default TrafficMap;