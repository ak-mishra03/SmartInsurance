import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapUpdater({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 13);
    }
  }, [lat, lon, map]);

  return null;
}
