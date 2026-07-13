import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const { fetchUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const login = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/auth/login/",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      await fetchUser();

      navigate("/dashboard");

    } catch {

      setError("Invalid credentials");
    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2">

      <div
        className="
          bg-blue-950
          text-white
          flex
          flex-col
          justify-center
          px-16
        "
      >
        <h1 className="text-5xl font-bold mb-6">
          SmartInsurance
        </h1>

        <p className="text-xl text-blue-100">
          AI-powered flood risk assessment
          from satellite imagery.
        </p>
      </div>

      <div className="flex items-center justify-center p-8">

        <form
          onSubmit={login}
          className="
            w-full
            max-w-md
            bg-white
            rounded-3xl
            shadow-xl
            p-10
          "
        >
          {location.state?.message && (

          <div
            className="
              mb-6
              bg-green-50
              border
              border-green-300
              text-green-700
              px-4
              py-3
              rounded-xl
            "
          >
            {location.state.message}
          </div>

        )}
          <h2 className="text-3xl font-bold mb-8">
            Welcome Back
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="
              w-full
              border
              rounded-xl
              p-3
              mb-4
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
              w-full
              border
              rounded-xl
              p-3
              mb-4
            "
          />

          {error && (
            <p className="text-red-500 mb-4">
              {error}
            </p>
          )}

          <button
            className="
              w-full
              bg-blue-900
              text-white
              py-3
              rounded-xl
              hover:bg-blue-800
            "
          >
            Login
          </button>

          <p className="mt-6 text-center">

            Don't have an account?

            <Link
              to="/register"
              className="
                text-blue-900
                font-semibold
                ml-2
              "
            >
              Register
            </Link>

          </p>

        </form>

      </div>

    </section>
  );
}
