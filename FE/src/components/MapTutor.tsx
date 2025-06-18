import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import mapred from "../assets/img/mapred.svg";
import mapgreen from "../assets/img/mapgreen.svg";
import center from "../assets/img/center.svg";

const markerIcon = new Icon({
  iconUrl: mapred,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const markerIcongreen = new Icon({
  iconUrl: mapgreen,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  userLat: number;
  userLng: number;
  isExpanded?: boolean;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapTutor: React.FC<Props> = ({
  userLat,
  userLng,
  isExpanded = false,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!selectedPosition) return;

      const url = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${selectedPosition[1]},${selectedPosition[0]}?overview=full&geometries=geojson`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok") {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );
          setRouteCoords(coords);
          setRouteDistance(data.routes[0].distance); // in meters
        } else {
          console.error("Lỗi khi lấy route từ OSRM:", data);
        }
      } catch (error) {
        console.error("Lỗi gọi API OSRM:", error);
      }
    };

    fetchRoute();
  }, [selectedPosition]);

  const HandleMapClick: React.FC = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSelectedPosition([pos.coords.latitude, pos.coords.longitude]);
          setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("Lỗi định vị: ", err);
        }
      );
    }
  };

  const origin: [number, number] = [userLat, userLng];

  return (
    <div className="relative w-full h-full">
      {routeDistance !== null && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded shadow-md border text-sm font-medium">
          Khoảng cách:{" "}
          {routeDistance > 1000
            ? `${(routeDistance / 1000).toFixed(2)} km`
            : `${Math.round(routeDistance)} m`}
        </div>
      )}

      {isExpanded && (
        <div className="absolute bottom-2 left-2 z-[1000] flex gap-2">
          <button
            onClick={handleGetCurrentLocation}
            className="bg-[--color2] hover:bg-[--color3] text-white p-2 rounded-full"
          >
            <img src={center} alt="Center" className="w-8 h-8 " />
          </button>
        </div>
      )}

      <MapContainer
        center={origin}
        zoom={15}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <ChangeView center={origin} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {isExpanded && <HandleMapClick />}

        <Marker position={origin} icon={markerIcon}>
          <Popup>Vị trí của đối phương</Popup>
        </Marker>

        {selectedPosition && (
          <Marker position={selectedPosition} icon={markerIcongreen}>
            <Popup>Vị trí đã chọn</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default MapTutor;
