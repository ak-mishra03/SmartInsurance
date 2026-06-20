//frontend/src/components/FloodMap.jsx

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
} from "react-leaflet";
import {useState} from "react"
import MapUpdater from "./MapUpdater"

export default function FloodMap({
  lat,
  lon,
  radius = 3000,
}) {
  
  const [satellite, setSatellite] = useState(false);

  if (!lat || !lon) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow h-[500px] flex items-center justify-center">
        Select a location to view the map.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 shadow">
      <div className="flex justify-end mb-3">
        <button onClick={()=> setSatellite(!satellite)} className="px-4 py-2 bg-blue-900 text-white rounded-lg">
          {satellite ? "🗺 Street View" : "🛰 Satellite View"}
        </button>
      </div>  

      <MapContainer
        center={[lat, lon]}
        zoom={13}
        className="h-[500px] w-full rounded-2xl"
      >

      <MapUpdater lat={lat} lon={lon}/>
      {satellite ? (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Esri"
        />
      ) : (
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="OpenStreetMap"
        />
      )}
        <Marker position={[lat, lon]}>
          <Popup>
            Insured Property
          </Popup>
        </Marker>

        <Circle
          center={[lat, lon]}
          radius={radius}
        />

      </MapContainer>

    </div>
  );
}
