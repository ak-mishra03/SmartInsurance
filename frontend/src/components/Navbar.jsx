import {Link} from "react-router-dom"

export default function Navbar(){
  return (
    <nav className= "flex items-center justify-between px-10 py-5 border-b border-gray-200">
      <Link to="/" className="text-3xl font-bold text-blue-900">
          SmartInsurance
      </Link>
      <div className="flex px-10 items-center justify-between gap-8 text-gray-700 font-medium">
        <Link to="/products">Products & Services</Link>   
        <Link to="/dashboard">Dashboard</Link>   
        <Link to="/signup">Signup</Link>   
        <Link to="/login">Login</Link>   
        <button className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition">
          Get Protected
        </button>
      </div>   
    </nav>
  );
}
