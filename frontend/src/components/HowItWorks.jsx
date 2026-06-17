export default function HowItWorks() {
  const steps = [
    {
      number:"01",
      title:"Enroll Property",
      description: "Customers register their insured properties and locations."
    },
    {
      number:"02",
      title:"Satellite Monitoring",
      description: "Earth observation data continuously monitors environmental changes."
    },
    {
      number:"03",
      title:"Disaster Detection",
      description: "AI models identify flood events and estimate impact severity."
    },
    {
      number:"04",
      title:"Claim Assessment",
      description: "SmartInsurance generates claim recommendations in minutes."
    },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-10">
        <h2 className="text-center text-4xl font-bold text-blue-950">How SmartInsurance Works</h2>
        <p className="text-center text-gray-600 mt-4 max-w-3xl mx-auto">Combining satellite intelligence,
          geospatial analytics,
          and AI-driven insurance decisions.
        </p>
        <div className="grid grid-cols-4 gap-8 mt-20">
          {
            steps.map((step)=>(
              <div key={step.number} className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold ">
                  {step.number}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-blue-900">{step.title}</h3>
                <p className="mt-3 text-gray-600">{step.description}</p>       
              </div>
            ))
          }
        </div>
      </div>

    </section> 
  );
}
