export default function ResultsCard({ result, loading }) {
  
  if (loading) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow">

      <h2 className="text-2xl font-semibold mb-8">
        Assessment Results
      </h2>

      <div className="animate-pulse">

        <div className="h-10 w-32 bg-slate-200 rounded-full mb-8"></div>

        <div className="space-y-6">

          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-12 w-40 bg-slate-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-10 w-52 bg-slate-200 rounded"></div>
          </div>

          <div>
            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
            <div className="h-8 w-36 bg-slate-200 rounded"></div>
          </div>

        </div>

      </div>

    </div>
  );
}

if (!result) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-semibold mb-6">
                Assessment Results
            </h2>

            <div className="flex items-center justify-center h-[350px] text-gray-400">
                Run an analysis to view results.
            </div>

        </div>
    );
}

if (
    result.status === "PENDING" ||
    result.status === "RUNNING"
) {
    return (
        <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-semibold mb-6">
                Assessment Results
            </h2>

            <div className="flex flex-col items-center justify-center h-[350px]">

                <div
                    className="
                        w-10
                        h-10
                        border-4
                        border-blue-900
                        border-t-transparent
                        rounded-full
                        animate-spin
                    "
                />

                <p className="mt-6 text-gray-500">
                    Analyzing satellite imagery...
                </p>

            </div>

        </div>
    );
}
  const severityStyles = {
    NONE: "bg-green-100 text-green-700",
    MINOR: "bg-green-100 text-green-700",
    MODERATE: "bg-yellow-100 text-yellow-700",
    MAJOR: "bg-orange-100 text-orange-700",
    SEVERE: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow">
      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Severity
          </p>

          <p className="font-bold">
            {result.severity}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Flood %
          </p>

          <p className="font-bold">
            {Number(result.flooded_area_percent ?? 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm">
            Decision
          </p>

          <p className="font-bold">
            {result.recommendation}
          </p>
        </div>

      </div>

      <h2 className="text-2xl font-semibold mb-8">
        Assessment Results
      </h2>

      <div className="space-y-8">

        <div>
          <p className="text-gray-500 text-sm mb-2">
            Risk Level
          </p>

          <span
            className={`
              px-4 py-2 rounded-full font-semibold
              ${severityStyles[result.severity]}
            `}
          >
            {result.severity}
          </span>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Flooded Area
          </p>

          <p className="text-4xl font-bold text-blue-950">
            {Number(result.flooded_area_percent ?? 0).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Affected Area
          </p>

          <p className="text-2xl font-semibold">
            {Math.round(result.flooded_area_m2 ?? 0).toLocaleString()} m²
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Analysis Radius
          </p>

          <p className="font-semibold">
            3 km
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Recommendation
          </p>

          <p
            className={`
              text-lg font-bold
              ${
              (result.recommendation ?? "").includes("APPROVE")
                ? "text-green-700"
                : "text-red-700"}
            `}
          >
            {result.recommendation}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">
            Assessment Status
          </p>

          <p className="text-green-700 font-semibold">
            ✓ Complete
          </p>
        </div>

      </div>

    </div>
  );
}
