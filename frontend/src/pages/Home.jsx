import React from "react";
import OpenStreetMap from "../components/OpenStreetMap";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="home-page">
        <div className="home-container">
          <div className="text-section">
            <h1 className="Home-h1 font-semibold text-gray-900 tracking-tight mb-4">
              Welcome to iReporter
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Corruption is a huge bane to Africa’s development. African countries must develop novel and localized solutions to curb this menace. 
              Hence, the birth of iReporter. iReporter enables any/every citizen to bring any form of corruption to the notice of appropriate authorities and the general public. 
              Users can also report on things that need government intervention.
            </p>
            <Link to="/signup" className="block w-full">
              <button className="bg-gray-700 hover:bg-gray-600 text-white w-full p-3 rounded font-semibold">
                Get Started
              </button>
            </Link>
          </div>

          <div className="w-full max-w-4xl mt-8">
            <h2 className="text-2xl font-bold text-black mb-4">Incident Reports</h2>
            <OpenStreetMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
