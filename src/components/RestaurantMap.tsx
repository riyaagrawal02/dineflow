import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface RestaurantMapProps {
  className?: string;
}

const RestaurantMap = ({ className }: RestaurantMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const position: L.LatLngExpression = [19.0544, 72.8406];

    const map = L.map(mapRef.current, {
      center: position,
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.marker(position, { icon })
      .addTo(map)
      .bindPopup(
        `<div style="text-align:center"><strong>MyRestaurant</strong><br/>123 Food Street, Bandra West<br/>Mumbai 400050</div>`
      );

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl ${className || ""}`}>
      <div ref={mapRef} style={{ height: "100%", width: "100%", minHeight: "280px" }} />
    </div>
  );
};

export default RestaurantMap;
