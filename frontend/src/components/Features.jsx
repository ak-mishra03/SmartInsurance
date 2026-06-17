export default function Features() {
  const features = [
    {
      title:"Flood Intelligence",
      description:"Detect newly inundated area using Sentinel-2 satellite imagery and NDWI analysis."
    },
    {
      title:"AI CLaim Assessment",
      description:"Automatically evaluate flood severity and generate claim recommendation."
    },
    {
      title:"Risk Monitoring",
      description:"Continuously monitor insured locations for environmental hazards."
    },
    {
      title:"Climate Analytics",
      description:"Leverage Earth observation data to understand historical and emerging risks."
    },
  ]
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-10">
        <h2 className="text-center text-4xl font-bold text-blue-950">Built for future of insurance</h2>
        <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">Combining satellite intelligence,
            geospatial analytics, 
            and AI driven decision support.</p>
        <div className="grid grid-cols-2 gap-8 mt-16">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold text-blue-900">{feature.title}</h3>
              <p className="mt-6 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>  
  );
}
