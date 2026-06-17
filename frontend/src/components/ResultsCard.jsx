export default function ResultsCard({ result }) {

  const severityStyles = {
    MINOR: "bg-green-100 text-green-700",
    MODERATE: "bg-yellow-100 text-yellow-700",
    MAJOR: "bg-orange-100 text-orange-700",
    SEVERE: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow">

      <h2 className="text-2xl font-semibold mb-6">
        Assessment Results
      </h2>

      {!result ? (
        <p className="text-gray-500">
          Run an analysis to view results.
        </p>
      ) : (
        <div className="space-y-8">

          <div>
            <h3 className="text-gray-500 text-sm">
              Severity
            </h3>

            <span
              className={`
                inline-block
                mt-2
                px-4
                py-2
                rounded-full
                font-semibold
                ${severityStyles[result.severity]}
              `}
            >
              {result.severity}
            </span>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm">
              Flooded Area
            </h3>

            <p className="text-3xl font-bold mt-2">
              {result.flooded_area_percent.toFixed(2)}%
            </p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm">
              Flooded Area (m²)
            </h3>

            <p className="text-3xl font-bold mt-2">
              {result.flooded_area_m2.toLocaleString()}
            </p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm">
              Recommendation
            </h3>

            <p className="text-xl font-semibold mt-2">
              {result.recommendation}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
