import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import map from "../assets/img/mapred.svg";

const markerIcon = new Icon({
  iconUrl: map,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const ClickHandler = ({
  setClickedLatLng,
}: {
  setClickedLatLng: (coords: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      setClickedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

interface MapViewProps {
  value?: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}

const MapView: React.FC<MapViewProps> = ({ value, onChange }) => {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
        },
        () => {
          setUserLat(10.7769);
          setUserLng(106.7009);
        }
      );
    } else {
      setUserLat(10.7769);
      setUserLng(106.7009);
    }
  }, []);

  if (userLat === null || userLng === null) {
    return (
      <div className="text-center mt-4 text-white">
        Đang lấy vị trí của bạn...
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <MapContainer
        center={
          value && value.lat !== 0 ? [value.lat, value.lng] : [userLat, userLng]
        }
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px",
          zIndex: 0,
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {value && value.lat !== 0 && value.lng !== 0 && (
          <Marker position={[value.lat, value.lng]} icon={markerIcon}>
            <Popup>Tọa độ đã chọn</Popup>
          </Marker>
        )}

        <ClickHandler setClickedLatLng={onChange} />
      </MapContainer>
    </div>
  );
};

export default MapView;
