import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-10 py-20">
        <div className="grid grid-cols-4 gap-12">

          {/* Company Info */}
          <div>
            <h2 className="text-3xl font-bold">
              SmartInsurance
            </h2>

            <p className="mt-4 text-blue-100 leading-relaxed">
              AI-powered flood intelligence,
              satellite monitoring,
              and automated claim assessment
              for the next generation of insurance.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg">
              Products
            </h3>

            <ul className="mt-4 space-y-3 text-blue-100">
              <li>
                <Link to="/products">
                  Basic Protection
                </Link>
              </li>

              <li>
                <Link to="/products">
                  Premium Protection
                </Link>
              </li>

              <li>
                <Link to="/products">
                  Enterprise Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg">
              Company
            </h3>

            <ul className="mt-4 space-y-3 text-blue-100">
              <li>
                <Link to="/about">
                  About Us
                </Link>
              </li>

              <li>
                <Link to="/contact">
                  Contact
                </Link>
              </li>

              <li>
                <Link to="/careers">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg">
              Resources
            </h3>

            <ul className="mt-4 space-y-3 text-blue-100">
              <li>
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </li>

              <li>
                <Link to="/reports">
                  Risk Reports
                </Link>
              </li>

              <li>
                <Link to="/docs">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-blue-800 mt-16 pt-8">
          <p className="text-center text-blue-200 mb-4">
            Powered by Satellite Intelligence and AI Risk Assessment
          </p>
          <p className="text-center text-blue-200">
            © 2026 SmartInsurance. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}
