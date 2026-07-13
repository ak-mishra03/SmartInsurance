import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../lib/api";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const register = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      await api.post(
        "/auth/register/",
        form
      );

      navigate("/login",{
        state:{
          message:
            "Account created successfully. Please login."
        }
      });

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2">

      {/* Left Section */}

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

        <p className="text-xl text-blue-100 mb-8">
          Protect properties with
          AI-powered flood intelligence
          and satellite analytics.
        </p>

        <div
          className="
            border
            border-blue-800
            rounded-3xl
            p-6
            bg-blue-900/30
          "
        >

          <h3 className="text-lg font-semibold mb-3">
            Included with every account
          </h3>

          <ul className="space-y-2 text-blue-100">

            <li>
              ✓ Property Management
            </li>

            <li>
              ✓ Flood Risk Analysis
            </li>

            <li>
              ✓ Satellite Monitoring
            </li>

            <li>
              ✓ Claims Dashboard
            </li>

          </ul>

        </div>

      </div>

      {/* Right Section */}

      <div
        className="
          flex
          items-center
          justify-center
          bg-slate-50
          p-8
        "
      >

        <form
          onSubmit={register}
          className="
            w-full
            max-w-md
            bg-white
            rounded-3xl
            shadow-xl
            p-10
          "
        >

          <h2
            className="
              text-3xl
              font-bold
              mb-2
              text-slate-900
            "
          >
            Create Account
          </h2>

          <p className="text-slate-500 mb-8">
            Start protecting your properties today.
          </p>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                p-3
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                p-3
              "
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone_number: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                p-3
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="
                w-full
                border
                rounded-xl
                p-3
              "
            />

          </div>

          {error && (

            <div
              className="
                mt-4
                text-red-600
                text-sm
              "
            >
              {error}
            </div>

          )}

          <button
            disabled={loading}
            className="
              w-full
              mt-6
              bg-blue-900
              text-white
              py-3
              rounded-xl
              hover:bg-blue-800
              disabled:bg-slate-400
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p
            className="
              mt-6
              text-center
              text-slate-600
            "
          >

            Already have an account?

            <Link
              to="/login"
              className="
                text-blue-900
                font-semibold
                ml-2
              "
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </section>
  );
}
