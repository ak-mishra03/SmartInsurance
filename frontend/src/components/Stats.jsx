export default function Stats() {
  const stats = [
    {
      number: "10m",
      label: "Satellite Resolution",
    },
    {
      number: "24/7",
      label: "Satellite Coverage",
    },
    {
      number: "<5 min",
      label: "Claim Assessment",
    },
    {
      number: "5km",
      label: "Assessment Radius",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <h2 className="text-center text-4xl font-bold text-blue-950 mb-16">
        Powered by Earth Observation Intelligence
      </h2>

      <div className="max-w-7xl mx-auto px-10">

        <div className="grid grid-cols-4 gap-12">

          {stats.map((stat) => (
            <div
              className="text-center"
              key={stat.label}
            >
              <h3 className="text-5xl font-bold text-blue-900">
                {stat.number}
              </h3>

              <p className="mt-3 text-gray-800">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}
