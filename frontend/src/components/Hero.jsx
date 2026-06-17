import HeroImage from "../assets/HeroImage.png"
import {Link} from "react-router-dom"

export default function Hero() {
  return (
    <section className="min-h-85vh grid grid-cols-2 items-center px-20">

      <div className="space-y-6">
        <h1 className="text-6xl font-bold text-blue-950 leading-tight">
          Insurance That Sees
          Disasters Before
          Claims Arrive
        </h1>
        <p className="text-xl text-gray-600 max-w-xl">
          AI-powered flood monitoring,
          satellite intelligence,
          and automated claim assessment.
        </p>
        <Link to="/dashboard">
        <button className="bg-blue-900 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-800">Analyze Risk</button>
        </Link>
      </div>
    
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <img src={HeroImage} alt="HeroImage"/>
      </div>
    </section> 
  );
}
