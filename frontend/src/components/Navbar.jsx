import {Link} from "react-router-dom"
import {
  UserCircleIcon,
}  from "@heroicons/react/24/solid"

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
  const {user, logout} = useAuth();
  const [open,setOpen] = useState(false);
  return (
    <nav className= "flex items-center justify-between px-10 py-5 border-b border-gray-200">
      <Link to="/" className="text-3xl font-bold text-blue-900">
          SmartInsurance
      </Link>
      <div className="flex px-10 items-center justify-between gap-8 text-gray-700 font-medium">
        <Link to="/products">Products & Services</Link>   
        <Link to="/dashboard">Dashboard</Link>   

{user ? (

  <div className="relative">

    <button
      onClick={() =>
        setOpen(!open)
      }
    >
      <UserCircleIcon
        className="
          h-10
          w-10
          text-blue-900
        "
      />
    </button>

    {open && (

      <div
        className="
          absolute
          right-0
          mt-3
          w-64
          bg-white
          rounded-2xl
          shadow-xl
          border
          p-3
        "
      >

        <div className="pb-3 border-b">

          <p className="font-semibold">
            {user.username}
          </p>

          <p className="text-sm text-gray-500">
            {user.email}
          </p>

        </div>

        <div className="py-2">

          <Link
            to="/profile"
            className="
              block
              px-3
              py-2
              hover:bg-gray-100
              rounded-lg
            "
          >
            Profile
          </Link>

        </div>

        <button
          onClick={logout}
          className="
            w-full
            bg-red-500
            text-white
            py-2
            rounded-lg
          "
        >
          Logout
        </button>

      </div>

    )}

  </div>

) : (

  <>
    <Link to="/register">
      Register
    </Link>

    <Link to="/login">
      Login
    </Link>
  </>

)}
        <button className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition">
          Get Protected
        </button>
      </div>   
    </nav>
  );
}
