import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { React, useContext } from "react";

export default function Navbar() {
  const { current_user, current_admin } = useContext(UserContext);

  return (
    <nav className="Navbar fixed top-0 left-0 w-full z-50 shadow-xl rounded-b-3xl">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div className="Navbar-logo flex items-center space-x-3 text-3xl font-bold">
          <span className="text-white hover:text-purple-600">iReporter</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="31px"
            width="31px"
            viewBox="0 -960 960 960"
            fill="black"
          >
            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
          </svg>
        </div>

        <div className="Navbar-links flex-grow flex justify-center space-x-6">
          {current_user && !current_admin ? (
            <>
              <Link to="/userprofile" className="text-white text-lg hover:text-purple-600">
                Dashboard
              </Link>
              <Link to="/about" className="text-white text-lg hover:text-purple-600">
                About
              </Link>
             
            </>
          ) : current_admin && !current_user ? (
            <>
              <Link to="/adminprofile" className="text-white text-lg hover:text-purple-600">
                Dashboard
              </Link>
              <Link to="/about" className="text-white text-lg hover:text-purple-600">
                About
              </Link>
              
            </>
          ) : (
            <>
              <Link to="/" className="text-white text-lg hover:text-purple-600">
                Home
              </Link>
              <Link to="/about" className="text-white text-lg hover:text-purple-600">
                About
              </Link>
              <Link to="/contacts" className="text-white text-lg hover:text-purple-600">
                Contact
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
