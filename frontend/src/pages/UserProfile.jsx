import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { RedFlagContext } from "../context/RedFlagContext";
import { InterventionContext } from "../context/InterventionContext";
import Profile from "./Profile";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineCog, HiOutlineUser, HiOutlineFlag } from "react-icons/hi";
import RedFlagMap from "../components/RedFlagMap";
import { Link } from "react-router-dom";
import InterventionMap from "../components/IntervenstionMap";
import Settings from "./Settings";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showReportOptions, setShowReportOptions] = useState(false);
  const { current_user, logout, users } = useContext(UserContext);
  const { red_flags, addRedFlag } = useContext(RedFlagContext);
  const { interventions, addIntervention } = useContext(InterventionContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [location, setLocation] = useState("");

  // Modal state
  const [isAddRedFlagModalOpen, setAddRedFlagIsModalOpen] = useState(false);
  const [isAddInterventionModalOpen, setAddInterventionModalOpen] = useState(false);
  const [isLogOutModalOpen, setLogOutIsModalOpen] = useState(false);

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    addRedFlag(title, description, image, video, location);
    addIntervention(title, description, image, video, location);
    setTitle("");
    setDescription("");
    setImage("");
    setVideo("");
    setLocation("");
    setAddRedFlagIsModalOpen(false);
    setAddInterventionModalOpen(false);
  }

  // Handle logout
  const handleLogout = () => {
    if (current_user) {
      logout();
      setLogOutIsModalOpen(false);
      navigate("/login");
    }
  };

  const sections = {
    Dashboard: (
      <div>
        <h3 className="text-lg font-semibold ">
          Welcome, {current_user?.first_name} {current_user?.last_name}!
        </h3>
        <p className="mt-2">Here is an overview of your activity.</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
            Total Red Flags: {red_flags && red_flags.length}
          </div>
          <div className="bg-gradient-to-r from-[#80d88f] to-[#89ff7e] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
            Total Interventions: {interventions && interventions.length}
          </div>
          <div className="bg-gradient-to-r from-[#d7d880] to-[#fff27e] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
            Héroes del Cambio : {users && users.length}
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6">
          Red Flags & Interventions Guide
        </h3>
        <p className="mt-2">
          Examples of red flags and interventions for guidance.
        </p>
        <div className="flex justify-between gap-6 p-4">
          {/* Red Flag Card */}
          <div className="bg-gradient-to-r from-[#9e4ca2] to-[#ff4789] transition-all duration-300 ease-in-out text-white text-center p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">
              Alleged Bribery Scheme in Government Contracts
            </h3>
            <p className="text-sm mt-2">
              Description:{" "}
              <span>
                A series of documents and whistleblower testimonies indicate
                that government officials are allegedly accepting bribes in
                exchange for awarding lucrative public contracts to specific
                companies. These practices undermine transparency and fairness,
                and could lead to misallocation of public resources.
              </span>
            </p>
            <img
              src="https://img.freepik.com/free-vector/money-laundering-isometric-illustration-with-criminals-selling-weapons-illegally-3d-vector-illustration_98292-8520.jpg?t=st=1740139720~exp=1740143320~hmac=d9b8cef0ccfb3c978c49aa14c73771fb3fa2c64a9842821fd991505686833b27&w=826"
              alt="Image"
              className="w-full h-48 object-cover mt-6 rounded-lg"
            />
            <p className="mt-2 text-sm">
              Location: <span className="font-bold">Latitude, Longitude</span>
            </p>
            <p className="mt-2 text-sm">
              Status: <span className="font-bold">Active</span>
            </p>
            <a
              href="https://linktovideo.com"
              className="mt-2 text-blue-400 hover:underline"
            >
              Watch Video
            </a>
          </div>

          {/* Intervention Card */}
          <div className="bg-gradient-to-r from-[#5a9f6b] to-[#6ef76a] transition-all duration-300 ease-in-out text-white text-center p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">
              Potholes and Traffic Hazards on Highway
            </h3>
            <p className="text-sm mt-2">
              Description:{" "}
              <span>
                Highway 57 has numerous potholes and uneven surfaces, causing
                frequent accidents and vehicle damage. Local commuters have
                reported a significant increase in vehicle breakdowns, and the
                poor condition of the road presents a serious risk to public
                safety.
              </span>
            </p>
            <img
              src="https://img.freepik.com/premium-photo/wooden-police-barricades-city-new-york_1236033-32262.jpg?w=740"
              alt="Image"
              className="w-full h-48 object-cover mt-4 rounded-lg"
            />
            <p className="mt-2 text-sm">
              Location: <span className="font-bold">Latitude, Longitude</span>
            </p>
            <p className="mt-2 text-sm">
              Status: <span className="font-bold">Active</span>
            </p>
            <a
              href="https://linktovideo.com"
              className="mt-2 text-blue-400 hover:underline"
            >
              Watch Video
            </a>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6">Your Follow-Up Records</h3>
        <p className="mt-2">
          Your records' status is yet to be marked as either under
          investigation, rejected, or resolved.
        </p>
      </div>
    ),
    "Red-Flag": (
      <div>
        <div className="flex flex-col items-center mt-6">
          {/* Message Prompt */}
          <p className="text-center text-lg text-gray-700 mb-4">
            Have you witnessed an incident related to corruption? <br />
            Add a red flag to help highlight <br />
            potential issues that need attention.
          </p>
          {/* Add Red Flag Button */}
          <button
            onClick={() => setAddRedFlagIsModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 mb-4"
          >
            Add Red Flag
          </button>
        </div>

        <h3 className="text-lg font-semibold"> Current Red-Flag Reported</h3>
        <div>
          <RedFlagMap />
        </div>
        <div>
          <div className="text-center">
            <p>Click on a Red flag Card to edit it.</p>
          </div>
          <div className="red_flag-cards-container mt-8 p-8 rounded-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {red_flags &&
                red_flags.map((red_flag) => (
                  <div
                    className="flex items-center justify-center p-4"
                    key={red_flag.id}
                  >
                    <Link to={`/singleredflag/${red_flag.id}`}>
                      <div className="red_flag-card bg-gray-200 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-2xl border border-[#a66cff] w-[400px]">
                        <div className="relative rounded-t-xl overflow-hidden">
                          <img
                            src={red_flag.image}
                            alt="red_flag"
                            className="w-full h-52 object-cover rounded-t-xl"
                          />
                        </div>

                        <div className="p-6 space-y-6 text-gray-800">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                              {red_flag.title}
                            </h3>
                            <p className="text-sm">{red_flag.description}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-bold">Location:</p>
                            <p className="text-sm">{red_flag.location}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-bold">Video:</p>
                            <a
                              href={red_flag.video}
                              className="text-blue-400 hover:underline"
                            >
                              Watch Video
                            </a>
                          </div>

                          <div className="mt-4 text-center">
                            <p className="text-sm font-bold">Status</p>
                            <span
                              className={`${
                                red_flag.status === "active"
                                  ? "text-green-600"
                                  : "text-red-500"
                              } text-lg font-semibold`}
                            >
                              {red_flag.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    ),
    Intervention: (
      <div>
        <div className="flex flex-col items-center mt-6">
          {/* Message Prompt */}
          <p className="text-center text-lg text-gray-700 mb-4">
            Have you encountered a dangerous road or other critical
            infrastructure issue? <br />
            Add a red flag to call for government intervention and help address{" "}
            <br />
            problems that require immediate attention.
          </p>
          {/* Add Intervention Button */}
          <button
            onClick={() => setAddInterventionModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 mb-4"
          >
            Add Intervention
          </button>
        </div>

        <h3 className="text-lg font-semibold">
          {" "}
          Current Interventions Reported
        </h3>
        <div>
          <InterventionMap />
        </div>
        <div>
          <div className="text-center">
            <p>Click on an Intervention to edit it.</p>
          </div>
          <div className="red_flag-cards-container mt-8 p-8 rounded-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {interventions &&
                interventions.map((intervention) => (
                  <div
                    className="flex items-center justify-center p-4"
                    key={intervention.id}
                  >
                    <Link to={`/singleintervention/${intervention.id}`}>
                      <div className="intervention-card bg-gray-200 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-2xl border border-[#a66cff] w-[400px]">
                        <div className="relative rounded-t-xl overflow-hidden">
                          <img
                            src={intervention.image}
                            alt="intervention"
                            className="w-full h-52 object-cover rounded-t-xl"
                          />
                        </div>

                        <div className="p-6 space-y-6 text-gray-800">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                              {intervention.title}
                            </h3>
                            <p className="text-sm">
                              {intervention.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-bold">Location:</p>
                            <p className="text-sm">{intervention.location}</p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-bold">Video:</p>
                            <a
                              href={intervention.video}
                              className="text-blue-400 hover:underline"
                            >
                              Watch Video
                            </a>
                          </div>

                          <div className="mt-4 text-center">
                            <p className="text-sm font-bold">Status</p>
                            <span
                              className={`${
                                intervention.status === "active"
                                  ? "text-green-600"
                                  : "text-red-500"
                              } text-lg font-semibold`}
                            >
                              {intervention.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    ),
    Profile: (
      <div className="w-full flex-8 flex flex-col items-center justify-start text-center  p-4">
        <Profile />
      </div>
    ),
    Settings: (
      <div className="w-full flex-8 flex flex-col items-center justify-start text-center  p-4">
        <Settings />
      </div>
    ),
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6 rounded-xl shadow-xl mt-16">
      {/* Sidebar */}
      <div className="w-1/5 bg-white rounded-xl shado.w-lg p-6 flex flex-col items-center ">
        <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
        <ul className="mt-6 w-full">
          <li
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              activeSection === "Dashboard"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveSection("Dashboard")}
          >
            Dashboard
          </li>
          <li
            className="p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center"
            onClick={() => setShowReportOptions(!showReportOptions)}
          >
            Report <HiOutlineFlag className="text-lg" />
          </li>
          {showReportOptions && (
            <div className="pl-4">
              <li
                className="p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-200"
                onClick={() => setActiveSection("Red-Flag")}
              >
                🚩 Red-Flag
              </li>
              <li
                className="p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-200"
                onClick={() => setActiveSection("Intervention")}
              >
                🔨 Intervention
              </li>
            </div>
          )}
          <li
            className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
              activeSection === "Profile"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveSection("Profile")}
          >
            Profile <HiOutlineUser className="text-lg" />
          </li>
          <li
            className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${
              activeSection === "Settings"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveSection("Settings")}
          >
            Settings <HiOutlineCog className="text-lg" />
          </li>
          <li
            className="p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center text-red-500 hover:bg-red-100"
            onClick={() => setLogOutIsModalOpen(true)}
          >
            Logout <FiLogOut className="text-lg" />
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 ml-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {activeSection}
        </h2>
        <div className="text-gray-700 mt-4">{sections[activeSection]}</div>
      </div>

      {/*Add Red Flag Modal */}
      {isAddRedFlagModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add Red Flag</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Video URL"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-green-400 transition-all"
                  onClick={() => {
                    setAddRedFlagIsModalOpen(false);
                    setTitle("");
                    setDescription("");
                    setImage("");
                    setVideo("");
                    setLocation("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-400 rounded-md hover:bg-blue-600 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*Add Intervention Modal */}
      {isAddInterventionModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add an Intervention</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Video URL"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-green-400 transition-all"
                  onClick={() => {
                    setAddInterventionModalOpen(false);
                    setTitle("");
                    setDescription("");
                    setImage("");
                    setVideo("");
                    setLocation("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-400 rounded-md hover:bg-blue-600 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {isLogOutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-green-400 transition-all"
                onClick={() => setLogOutIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-400 rounded-md hover:bg-red-600 transition-all"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
