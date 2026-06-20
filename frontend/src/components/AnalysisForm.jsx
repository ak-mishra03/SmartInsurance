//frontend/src/components/AnalysisForm.jsx

import { useState } from "react";

export default function AnalysisForm({
  lat,
  setLat,

  lon,
  setLon,

  preStart,
  setPreStart,

  preEnd,
  setPreEnd,

  postStart,
  setPostStart,

  postEnd,
  setPostEnd,

  setResult,
  setLocation,
  
  loading,
  setLoading,}) {

  const [error, setError] = useState("");

  const analyzeFlood = async () => {
    if (!lat || !lon) {
      setError("Latitude and Longitude are required");
      return;
    }

    if (
      !preStart ||
      !preEnd ||
      !postStart ||
      !postEnd
    ) {
      setError("All dates are required");
      return;
    }
    setLocation({
      lat:Number(lat),
      lon:Number(lon),
    });
    setResult(null);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/flood/flood-damage`,
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            lat: Number(lat),
            lon: Number(lon),
            pre_start: preStart,
            pre_end: preEnd,
            post_start: postStart,
            post_end: postEnd,
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze flood risk");
      }

      const data = await response.json();

      setResult(data.flood_stats);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow">

      <h2 className="text-2xl font-semibold mb-6">
        Flood Analysis
      </h2>

      <div className="space-y-4">

        <input
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="number"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="date"
          value={preStart}
          onChange={(e) => setPreStart(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="date"
          value={preEnd}
          onChange={(e) => setPreEnd(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="date"
          value={postStart}
          onChange={(e) => setPostStart(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <input
          type="date"
          value={postEnd}
          onChange={(e) => setPostEnd(e.target.value)}
          className="w-full border rounded-xl p-3"
        />

        <button
          onClick={analyzeFlood}
          disabled={loading}
          className="
            w-full
            py-3
            rounded-xl
            text-white
            font-medium
            transition

            bg-blue-900
            hover:bg-blue-800

            disabled:bg-slate-400
            disabled:cursor-not-allowed
            disabled:hover:bg-slate-400
          "
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">

              <span
                className="
                  w-4 h-4
                  border-2 border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "
              />

              Analyzing...

            </span>
          ) : (
            "Analyze Flood"
          )}
        </button>
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}
