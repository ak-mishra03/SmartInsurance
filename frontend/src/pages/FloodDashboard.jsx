//frontend/src/pages/FloodDashboard.jsx

import { useState } from "react";

import AnalysisForm from "../components/AnalysisForm";
import ResultsCard from "../components/ResultsCard";
import FloodMap from "../components/FloodMap";
import SampleLocations from "../components/SampleLocations";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [result, setResult] = useState(null);
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
  });

  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const [preStart, setPreStart] = useState("");
  const [preEnd, setPreEnd] = useState("");

  const [postStart, setPostStart] = useState("");
  const [postEnd, setPostEnd] = useState("");

  const [loading, setLoading] = useState(false);

  return (

    <>
    <Navbar/>
      <section className="min-h-screen bg-slate-100 p-10">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-blue-950 mb-10">
            Flood Risk Dashboard
          </h1>
          <SampleLocations
            setLat={setLat}
            setLon={setLon}

            setPreStart={setPreStart}
            setPreEnd={setPreEnd}

            setPostStart={setPostStart}
            setPostEnd={setPostEnd}
          />
          <div className="grid grid-cols-2 gap-8">

            <AnalysisForm
              lat={lat}
              setLat={setLat}

              lon={lon}
              setLon={setLon}

              preStart={preStart}
              setPreStart={setPreStart}

              preEnd={preEnd}
              setPreEnd={setPreEnd}

              postStart={postStart}
              setPostStart={setPostStart}

              postEnd={postEnd}
              setPostEnd={setPostEnd}

              setResult={setResult}
              setLocation={setLocation}
              
              loading={loading}
              setLoading = {setLoading}
            />
            <ResultsCard
              result={result}
              loading= {loading}
            />

          </div>

          <div className="mt-8">

            <FloodMap
              lat={location.lat}
              lon={location.lon}
              radius={3000}
            />

          </div>

        </div>

      </section>
    </>
  );
}
