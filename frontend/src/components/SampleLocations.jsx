export default function SampleLocations({
  setLat,
  setLon,
  setPreStart,
  setPreEnd,
  setPostStart,
  setPostEnd,
}) {

  const locations = [
    {
      name: "Varanasi Urban",

      lat: 25.2900559,
      lon: 82.9725597,

      preStart: "2025-06-01",
      preEnd: "2025-07-01",

      postStart: "2025-08-01",
      postEnd: "2025-09-24",
    },

    {
      name: "Ganga River",

      lat: 25.313944,
      lon: 83.018278,

      preStart: "2025-06-01",
      preEnd: "2025-07-01",

      postStart: "2025-08-01",
      postEnd: "2025-09-24",
    },

    {
      name: "Texas Flood",

      lat: 29.7604,
      lon: -95.3698,

      preStart: "2025-06-15",
      preEnd: "2025-06-30",

      postStart: "2025-07-15",
      postEnd: "2025-08-15",
    },
  ];

  const loadLocation = (location) => {

    setLat(location.lat);
    setLon(location.lon);

    setPreStart(location.preStart);
    setPreEnd(location.preEnd);

    setPostStart(location.postStart);
    setPostEnd(location.postEnd);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow mb-8">

      <h2 className="text-xl font-semibold mb-4">
        Sample Locations
      </h2>

      <div className="flex gap-3 flex-wrap">

        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => loadLocation(location)}
            className="
              px-4 py-2
              bg-slate-100
              hover:bg-blue-900
              hover:text-white
              rounded-xl
              transition
            "
          >
            {location.name}
          </button>
        ))}

      </div>

    </div>
  );
}
