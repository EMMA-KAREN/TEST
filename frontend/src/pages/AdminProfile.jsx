import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RedFlagContext } from "../context/RedFlagContext";
import { InterventionContext } from "../context/InterventionContext";
import { Link } from "react-router-dom";
// import Settings from "./Settings";
// import OpenStreetMap from "../components/OpenStreetMap";


import {
  BarChart,
  Flag,
  AlertTriangle,
  User,
  Users,
  Settings,
  X,
  LogOut,
} from "lucide-react";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { admins, setAdmins, current_admin, updateUser, logout } =
    useContext(UserContext);
  const { red_flags } = useContext(RedFlagContext);
  const { interventions } = useContext(InterventionContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAdminList, setShowAdminList] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [updatedPhone, setUpdatedPhone] = useState(current_admin?.phone ?? "");
  const [updatedEmail, setUpdatedEmail] = useState(current_admin?.email ?? "");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState(
    current_admin?.profile_picture ?? ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (current_admin) {
      setUpdatedPhone(current_admin.phone ?? "");
      setUpdatedEmail(current_admin.email ?? "");
      setUpdatedProfilePicture(current_admin.profile_picture ?? "");
    }
  }, [current_admin]);

  const handleShowAdmins = () => {
    setAdmins();
    setShowAdminList(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUser(
      updatedPhone,
      updatedEmail,
      updatedPassword,
      updatedProfilePicture
    );
  };

  const openLogoutModal = () => {
    setIsModalOpen(true); // Show logout confirmation modal
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false); // Close logout modal
  };

  const handleLogout = () => {
    if (current_admin) {
      logout();
      closeLogoutModal();
    } else {
      toast.error("FAILED LOG OUT");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "red-flags":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">RED FLAGS</h2>
            <div className="red_flag-cards-container mt-8 p-8 rounded-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {red_flags &&
                  red_flags.map((red_flag) => (
                    <div
                      className="flex flex-wrap gap-6 items-center justify-center"
                      key={red_flag.id}
                    >
                      <Link to={`/singleredflag/${red_flag.id}`}>
                        <div className="bg-white rounded-2xl shadow-md border border-transparent bg-clip-border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:border-[#d580d8] max-w-full">
                          {/* Image */}
                          <div className="relative rounded-t-2xl overflow-hidden">
                            <img
                              src={red_flag.image}
                              alt="red_flag"
                              className="w-full h-52 object-cover rounded-t-2xl"
                            />
                          </div>

                          {/* Card Content */}
                          <div className="p-6 space-y-6 text-gray-800">
                            {/* Title & Description */}
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {red_flag.title}
                              </h3>
                              <p className="text-sm text-gray-700">
                                {red_flag.description}
                              </p>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-gray-900">
                                Location:
                              </p>
                              <p className="text-sm text-gray-700">
                                {red_flag.location}
                              </p>
                            </div>

                            {/* Video Link */}
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-gray-900">
                                Video:
                              </p>
                              <a
                                href={red_flag.video}
                                className="text-blue-500 font-semibold hover:underline"
                              >
                                Watch Video
                              </a>
                            </div>

                            {/* Status */}
                            <div className="mt-4 text-center">
                              <p className="text-sm font-bold text-gray-900">
                                Status
                              </p>
                              <span
                                className={`text-lg font-semibold px-3 py-1 rounded-full ${
                                  red_flag.status === "active"
                                    ? "bg-green-100 text-green-600"
                                    : red_flag.status === "underinvestigation"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-500"
                                }`}
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
        );
      case "interventions":
        return (
          <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Interventions</h2>
          <div className="mt-8 p-8 bg-white rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {interventions &&
                interventions.map((intervention) => (
                  <div className="flex items-center justify-center" key={intervention.id}>
                    <Link to={`/singleintervention/${intervention.id}`}>
                      <div className="bg-white rounded-2xl shadow-md border border-transparent bg-clip-border transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:border-[#d580d8] w-[400px]">
                        
                        {/* Image */}
                        <div className="relative rounded-t-2xl overflow-hidden">
                          <img
                            src={intervention.image}
                            alt="intervention"
                            className="w-full h-52 object-cover rounded-t-2xl"
                          />
                        </div>
        
                        {/* Card Content */}
                        <div className="p-6 space-y-6 text-gray-800">
                          
                          {/* Title & Description */}
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900">{intervention.title}</h3>
                            <p className="text-sm text-gray-700">{intervention.description}</p>
                          </div>
        
                          {/* Location */}
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-900">Location:</p>
                            <p className="text-sm text-gray-700">{intervention.location}</p>
                          </div>
        
                          {/* Video Link */}
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-gray-900">Video:</p>
                            <a
                              href={intervention.video}
                              className="text-blue-500 font-semibold hover:underline"
                            >
                              Watch Video
                            </a>
                          </div>
        
                          {/* Status */}
                          <div className="mt-4 text-center">
                            <p className="text-sm font-bold text-gray-900">Status</p>
                            <span
                              className={`text-lg font-semibold px-3 py-1 rounded-full ${
                                intervention.status === "active"
                                  ? "bg-green-100 text-green-600"
                                  : intervention.status === "underinvestigation"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-500"
                              }`}
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
        
        );
      case "settings":
        return <div className="p-6">Settings</div>;
      case "logout":
        return <div className="p-6">Logout</div>;
      default:
        return (
          <div className="p-6 justify-center items-center text-center">
            <div className="">
              <div className="grid grid-cols-3 gap-4 mt-4 ">
                <div className="bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
                  Total Red Flags: {red_flags && red_flags.length}
                </div>
                <div className="bg-gradient-to-r from-[#80d88f] to-[#89ff7e] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
                  Total Interventions: {interventions && interventions.length}
                </div>
                {/* <div className="bg-gradient-to-r from-[#d7d880] to-[#fff27e] transition-all duration-300 ease-in-out text-black text-center p-4 rounded-lg shadow-md ">
                  Héroes del Cambio : {users && users.length}
                </div> */}
              </div>
              {/* <OpenStreetMap /> */}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white mt-20 rounded-xl shadow-xg text-center">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white flex flex-col p-6">
        <div
          className="flex items-center space-x-2 mb-8 cursor-pointer"
          onClick={() => setShowAdminList(true)}
        >
          <Users size={28} />
          <span className="text-2xl font-bold">Circle</span>
        </div>
        <nav className="flex-1 space-y-6">
          <div
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-blue-700 rounded"
            onClick={() => setActiveSection("dashboard")}
          >
            <BarChart size={20} />
            <span>Dashboard</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-blue-700 rounded"
            onClick={() => setActiveSection("red-flags")}
          >
            <Flag size={20} />
            <span>Red-Flags</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-blue-700 rounded"
            onClick={() => setActiveSection("interventions")}
          >
            <AlertTriangle size={20} />
            <span>Interventions</span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-blue-700 rounded"
            onClick={() => setActiveSection("settings")}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
          {/* Logout button */}
          <div
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-blue-700 rounded"
            onClick={openLogoutModal} // Show logout confirmation modal
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
        <div
          className="mt-auto flex items-center space-x-3 p-3 rounded-lg bg-blue-800 cursor-pointer"
          onClick={() => setShowAdminProfile(true)}
        >
          <img
            src={current_admin?.profile_picture || "/default-avatar.png"}
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <span>Admin</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 ml-6">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h1>
        </header>
        <main className="mt-4">{renderContent()}</main>
      </div>

      {/* Admin List Modal */}
      {showAdminList && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Admins</h2>
              <X
                size={24}
                className="cursor-pointer"
                onClick={() => setShowAdminList(false)}
              />
            </div>
            <div className="space-y-4">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center space-x-3 border-b pb-2"
                  >
                    <img
                      src={admin.profile_picture || "/default-avatar.png"}
                      alt="Admin"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-semibold">
                      {admin.first_name} {admin.last_name}
                    </span>
                  </div>
                ))
              ) : (
                <p>No admins found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Profile Modal */}
      {showAdminProfile && (
        <div className="flex h-screen inset-0 justify-center items-center">
          <div className="bg-white p-8 rounded-4xl transform translate-x-[-50%] mt-24 mb-14 w-8/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Admin Profile</h2>
              <X
                size={24}
                className="cursor-pointer"
                onClick={() => setShowAdminProfile(false)}
              />
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Profile Picture Column */}
              <div className="lg:w-1/3 flex justify-center items-center mb-6 lg:mb-0">
                <img
                  src={current_admin?.profile_picture || "/default-avatar.png"}
                  alt="Admin"
                  className="w-44 h-44 mb-20 rounded-full shadow-lg border-4 border-transparent bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] bg-clip-border transition-all duration-300 ease-in-out"
                />
              </div>

              {/* Profile Information */}
              <div className="lg:w-2/3 w-full">
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">First Name:</h3>
                    <p className="ml-2 text-gray-900">
                      {current_admin?.first_name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Last Name:</h3>
                    <p className="ml-2 text-gray-900">
                      {current_admin?.last_name}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h5 className="text-lg font-semibold">Email:</h5>
                    <p className="ml-2 text-gray-900">{current_admin?.email}</p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Phone:</h3>
                    <p className="ml-2 text-gray-900">{current_admin?.phone}</p>
                  </div>
                </div>

                {/* Update Form */}
                <form
                  onSubmit={handleUpdate}
                  className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md"
                >
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        placeholder="Enter New Email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={updatedPhone}
                        onChange={(e) => setUpdatedPhone(e.target.value)}
                        placeholder="Enter New Phone Number"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={updatedPassword}
                        onChange={(e) => setUpdatedPassword(e.target.value)}
                        placeholder="Enter New Password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="profilePicture"
                        className="block text-sm font-semibold"
                      >
                        Profile Picture
                      </label>
                      <input
                        type="text"
                        name="profilePicture"
                        value={updatedProfilePicture || ""}
                        onChange={(e) =>
                          setUpdatedProfilePicture(e.target.value)
                        }
                        placeholder="Enter image URL"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-block px-6 py-3 text-lg font-bold text-white text-center rounded-lg bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out shadow-lg shadow-[rgba(255,_126,_179,_0.4)] hover:from-[#7effb8] hover:to-[#80d893] hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px] border border-gray-700"
                    >
                      Update Information
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Are you sure you want to log out?
              </h2>
            </div>
            <div className="flex justify-end space-x-4 ">
              <button
                onClick={closeLogoutModal}
                className="bg-gray-500 text-white px-4 py-2 -ml-60 rounded-md hover:bg-gradient-to-r hover:from-[#95ec89] hover:to-[#1bdf4c]  hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px] transition-all duration-300 ease-in-out hover:text-amber-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 mr-2 bg-red-400 rounded-md hover:bg-gradient-to-r hover:from-[#ec4c4c] hover:to-[#ff0000]  hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px] transition-all duration-300 ease-in-out hover:text-amber-50"
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

export default AdminProfile;
