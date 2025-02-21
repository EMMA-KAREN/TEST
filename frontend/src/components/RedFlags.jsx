import React, { useContext, useState } from "react";
import { RedFlagContext } from "../context/RedFlagContext";
import { UserContext } from "../context/UserContext";

const RedFlags = () => {
  const { redFlags = [], addRedFlag, updateRedFlag, deleteRedFlag, updateStatus } =
    useContext(RedFlagContext);
  const validRedFlags = Array.isArray(redFlags) ? redFlags : [];
  const { current_user } = useContext(UserContext);

  const userRole = current_user
  ? current_user.is_admin
    ? "admin"
    : "user" // Assume non-admin users are "users"
  : undefined;


  const userId = current_user?.id; // each user has a unique ID

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    image: "",
    video: "",
    // Default status is set to "active"
    status: "active",
  });

  const adminRedFlags = validRedFlags; // Admins see all reports

  const [editingFlag, setEditingFlag] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "", // Ensure it's never null or undefined
    }));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = {
      title: formData.title || "",   // Default to empty string if falsy
      description: formData.description || "", 
      location: formData.location || "",
      image: formData.image || "",     // Ensure no null values
      video: formData.video || "", 
      status: formData.status || "active",  // Ensure "active" is used as the default status
    };

    console.log(formDataToSend);
    if (editingFlag) {
      updateRedFlag(editingFlag.id, formDataToSend);
    } else {
      addRedFlag(formDataToSend);
    }

    setEditingFlag(null);
    setShowForm(false);
    setFormData({ title: "", description: "", location: "", image: "", video: "", status: "active" });
  };
 
  console.log("Admin Red Flags:", validRedFlags);
    console.log("User Role:", userRole);
    console.log("Fetched Red Flags:", redFlags);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Red-Flag Reports</h2>

      {/* User Section - Only Users Can Add Red Flags */}
      {userRole === "user" && (
        <>
          <button
            onClick={() => {
              setEditingFlag(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
          >
            + Add Red-Flag
          </button>

          {/* Form for Adding/Editing Red-Flags */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-md shadow-md">
              <h3 className="text-lg font-semibold mb-2">{editingFlag ? "Edit" : "Create"} Red-Flag</h3>
              <div className="mb-2">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Location (Lat, Long)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Upload Image</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className="w-full border px-3 py-2 rounded-md mb-2"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Upload Video</label>
                <input
                  type="text"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  placeholder="Video URL"
                  className="w-full border px-3 py-2 rounded-md mb-2"
                />
              </div>
              {/* Do not show the status field for the user */}
              <div className="flex space-x-2 mt-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  {editingFlag ? "Update" : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* User's Red-Flags FETCHED THAT PARTICULAR USER */}
          <h3 className="font-semibold text-lg">My Reports</h3>
          <ul className="space-y-4">
            {validRedFlags
              .filter((flag) => flag.user_id === userId) // Only show user's red-flags
              .map((flag) => (
                <li key={flag.id} className="border p-4 rounded-md shadow-md">
                  <h3 className="font-semibold text-lg">{flag.title}</h3>
                  <p>{flag.description}</p>
                  <p>
                    <strong>Location:</strong> {flag.location}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="font-semibold text-blue-600">{flag.status}</span>
                  </p>
                  {flag.image && (
                    <img
                      src={flag.image}
                      alt="Red Flag"
                      className="w-full h-40 object-cover mt-2 rounded-md"
                    />
                  )}
                  {flag.video && (
                    <video controls src={flag.video} className="w-full h-40 mt-2 rounded-md" />
                  )}

                  {/* Edit and Delete Controls */}
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => {
                        setEditingFlag(flag);
                        setFormData({
                          title: flag.title,
                          description: flag.description,
                          location: flag.location,
                          image: flag.image,
                          video: flag.video,
                          status: flag.status,
                        });
                        setShowForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRedFlag(flag.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}

      {/* Admin Section - Only Admins Can See All Red-Flags */}
      {userRole === "admin" && (
  <>
    <h3 className="font-semibold text-lg">All Red-Flag Reports</h3>
    <ul className="space-y-4">
      {RedFlags.length > 0 ? (
        RedFlags.map((flag) => (
          <li key={flag.id} className="border p-4 rounded-md shadow-md">
            <h3 className="font-semibold text-lg">{flag.title}</h3>
            <p>{flag.description}</p>
            <p>
              <strong>Location:</strong> {flag.location}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="font-semibold text-blue-600">{flag.status}</span>
            </p>

            {/* Admin Controls */}
            <div className="mt-2 space-x-2">
              <button
                onClick={() => updateStatus(flag.id, "Under Investigation")}
                className="bg-gray-500 text-white px-3 py-1 rounded-md"
              >
                Mark as Under Investigation
              </button>
              <button
                onClick={() => updateStatus(flag.id, "Rejected")}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Reject
              </button>
              <button
                onClick={() => updateStatus(flag.id, "Resolved")}
                className="bg-green-600 text-white px-3 py-1 rounded-md"
              >
                Mark as Resolved
              </button>
            </div>
          </li>
        ))
      ) : (
        <p>No red-flag reports available.</p>
      )}
    </ul>
  </>
)}

    </div>
  );
};

export default RedFlags;
