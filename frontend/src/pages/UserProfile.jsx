import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Profile from "./Profile";
import RedFlags from "../components/RedFlags";


const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [showReportOptions, setShowReportOptions] = useState(false);
  const { current_user, logout } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openLogoutModal = () => {
    setIsModalOpen(true);
    
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false); 
  };

  const handleLogout = () => {
    if (current_user) {
      logout(); 
      closeLogoutModal(); 
    } else {
      toast.error("FAILED LOG OUT");
    }
  };

  const sections = {
    Dashboard: (
      <div>
        <h3 className="text-lg font-semibold">
          Welcome, {current_user?.first_name} {current_user?.last_name}!
        </h3>
        <p className="mt-2">Here is an overview of your activity.</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-blue-200 rounded-lg shadow-md">
            Total Red Flags: 10
          </div>
          <div className="p-4 bg-green-200 rounded-lg shadow-md">
            Total Interventions: 5
          </div>
          <div className="p-4 bg-yellow-200 rounded-lg shadow-md">
            All Users: 100
          </div>
        </div>
  
        <h3 className="text-lg font-semibold mt-6">Red Flags & Interventions Guide</h3>
        <p className="mt-2">Examples of red flags and interventions for guidance.</p>
  
        <h3 className="text-lg font-semibold mt-6">Your Follow-Up Records</h3>
        <p className="mt-2">
          Your records' status is yet to be marked as either under investigation, rejected, or resolved.
        </p>
  
        <h3 className="text-lg font-semibold mt-6">Tell a Friend</h3>
        <p className="mt-2">
          Share our website link with others:{" "}
          <a href="#" className="text-blue-500 underline">Visit Website</a>
        </p>
      </div>
    ),
    "Red-Flag": <RedFlags />, // ✅ Corrected!
    Intervention: (
      <div>
        <h3 className="text-lg font-semibold">Intervention Reports</h3>
        <p>Users can create and manage intervention records.</p>
      </div>
    ),
    Profile: <Profile />,
    Settings: <div>Adjust your settings and preferences here.</div>,
  };
  

  return (
    <div className="flex h-screen bg-white mt-20 rounded-xl shadow-lg  text-center">
      {/* Sidebar */}
      <div className="w-1/5 bg-white rounded-xl shadow-lg p-5">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>
        <ul>
          <li
            className={`p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
              activeSection === "Dashboard"
                ? "bg-blue-500 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveSection("Dashboard");
              setShowReportOptions(false);
            }}
          >
            Dashboard
          </li>

          {/* Report Section */}
          <li
            className={`p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
              showReportOptions
                ? "bg-blue-500 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setShowReportOptions(!showReportOptions)}
          >
            Report
          </li>

          {/* Dropdown Options for Report */}
          {showReportOptions && (
            <>
              <li
                className={`p-3 pl-6 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
                  activeSection === "Red-Flag"
                    ? "bg-red-500 text-white shadow-lg"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection("Red-Flag")}
              >
                🚩 Red-Flag
              </li>
              <li
                className={`p-3 pl-6 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
                  activeSection === "Intervention"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setActiveSection("Intervention")}
              >
                🔨 Intervention
              </li>
            </>
          )}

          <li
            className={`p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
              activeSection === "Profile"
                ? "bg-blue-500 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveSection("Profile");
              setShowReportOptions(false);
            }}
          >
            Profile
          </li>
          <li
            className={`p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
              activeSection === "Settings"
                ? "bg-blue-500 text-white shadow-lg"
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveSection("Settings");
              setShowReportOptions(false);
            }}
          >
            Settings
          </li>

          {/* Logout Button */}
          <li
            className="p-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out hover:bg-red-600"
            onClick={openLogoutModal}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-8 flex flex-col items-center justify-start text-center mt-10">
        <h2 className="text-2xl font-semibold mb-4">{activeSection}</h2>
        <div className="text-gray-700">{sections[activeSection]}</div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={closeLogoutModal} // Close the modal
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={handleLogout} // Proceed with logout
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
