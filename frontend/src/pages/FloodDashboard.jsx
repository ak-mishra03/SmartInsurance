import { useState } from "react";

import AnalysisForm from "../components/AnalysisForm";
import ResultsCard from "../components/ResultsCard";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [result, setResult] = useState(null);

  return (
    <>
      <Navbar/>

      <section className="min-h-screen bg-slate-100 p-10">

        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold text-blue-950 mb-10">
            Flood Risk Dashboard
          </h1>

          <div className="grid grid-cols-2 gap-8">

            <AnalysisForm setResult={setResult} />

            <ResultsCard result={result} />

          </div>

        </div>

      </section>
      </>
  );
}
