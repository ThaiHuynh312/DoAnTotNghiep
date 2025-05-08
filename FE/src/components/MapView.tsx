import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Tutor = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
};

type Props = {
  userLat: number;
  userLng: number;
  nearbyTutors: Tutor[]; // top 3 người gần nhất
};

const MapView: React.FC<Props> = ({ userLat, userLng, nearbyTutors }) => {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker người dùng */}
        <Marker position={[userLat, userLng]} icon={markerIcon}>
          <Popup>Bạn đang ở đây</Popup>
        </Marker>

        {/* Marker các gia sư và vẽ đường nối */}
        {nearbyTutors.map((tutor) => (
          <React.Fragment key={tutor.id}>
            <Marker position={[tutor.lat, tutor.lng]} icon={markerIcon}>
              <Popup>
                {tutor.name}
                <br />
                Cách bạn: {tutor.distanceKm.toFixed(2)} km
              </Popup>
            </Marker>
            <Polyline
              positions={[
                [userLat, userLng],
                [tutor.lat, tutor.lng],
              ]}
              pathOptions={{ color: "blue" }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
