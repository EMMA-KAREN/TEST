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
            <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z" />
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
