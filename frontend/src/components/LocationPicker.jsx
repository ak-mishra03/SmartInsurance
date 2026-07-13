import { Marker, useMapEvents } from "react-leaflet";

export default function LocationPicker({
  position,
  setPosition,
}) {

  useMapEvents({

    click(e) {

      setPosition({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      });

    },

  });

  if (!position) return null;

  return (
    <Marker
      position={[
        position.lat,
        position.lon,
      ]}
    />
  );
}
