import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext"; 

import { BarChart, Flag, AlertTriangle, Users, Settings, X } from "lucide-react";
import RedFlags from "../components/RedFlags";
import Interventions from "../components/Interventions";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { admins, setAdmins, current_admin, updateUser } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAdminList, setShowAdminList] = useState(false);
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [updatedPhone, setUpdatedPhone] = useState(current_admin?.phone ?? "");
  const [updatedEmail, setUpdatedEmail] = useState(current_admin?.email ?? "");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [updatedProfilePicture, setUpdatedProfilePicture] = useState(current_admin?.profile_picture ?? "");
  
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
    updateUser(updatedPhone, updatedEmail, updatedPassword, updatedProfilePicture);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "red-flags":
        return <RedFlags role="admin" />; // Pass role as "admin"
      case "interventions":
        return <Interventions />;
      case "settings":
        return <div className="p-6">Settings Content</div>;
      default:
        return <div className="p-6">Dashboard Content</div>;
    }
  };
  

  return (
    <div className="flex h-screen bg-white mt-20 rounded-xl shadow-lg text-center">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white flex flex-col p-6">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => setShowAdminList(true)}>
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
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Admin List Modal */}
      {showAdminList && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Admins</h2>
              <X size={24} className="cursor-pointer" onClick={() => setShowAdminList(false)} />
            </div>
            <div className="space-y-4">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin.id} className="flex items-center space-x-3 border-b pb-2">
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Admin Profile</h2>
              <X size={24} className="cursor-pointer" onClick={() => setShowAdminProfile(false)} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Name</label>
              <p>{current_admin?.first_name} {current_admin?.last_name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Phone</label>
              <p>{current_admin?.phone}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold">Email</label>
              <p>{current_admin?.email}</p>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-sm font-semibold">Phone</label>
                <input
                  type="text"
                  value={updatedPhone}
                  onChange={(e) => setUpdatedPhone(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold">
                  Password (leave empty to keep unchanged)
                </label>
                <input
                  type="password"
                  value={updatedPassword}
                  onChange={(e) => setUpdatedPassword(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold">Profile Picture URL</label>
                <input
                  type="text"
                  value={updatedProfilePicture}
                  onChange={(e) => setUpdatedProfilePicture(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
