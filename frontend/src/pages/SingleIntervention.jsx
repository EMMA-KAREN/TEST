import React, { useState, useContext, useEffect } from "react";
import { InterventionContext } from "../context/InterventionContext";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function SingleIntervention() {
  const { current_admin, current_user } = useContext(UserContext);
  const { interventions, updateIntervention, deleteIntervention, updateInterventionStatus } = useContext(InterventionContext);
  const { id } = useParams();
  const intervention = interventions && interventions.find((intervention) => intervention.id == id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (current_user && intervention) {
      setTitle(intervention.title);
      setDescription(intervention.description);
      setVideo(intervention.video);
      setImage(intervention.image);
    } else if (current_admin && intervention) {
      setStatus(intervention.status);
    }
  }, [current_user, current_admin, intervention]);

  function handleSubmitAdmin(e) {
    e.preventDefault();
    if (current_admin && intervention) {
      updateInterventionStatus(intervention.id, status);
      setIsModalOpen(false);
    }
  }

  function handleSubmitUser(e) {
    e.preventDefault();
    if (current_user && intervention) {
      updateIntervention(intervention.id, title, description, image, video);
      setIsModalOpen(false);
    }
  }

  function handleDelete(e) {
    e.preventDefault();
    deleteIntervention(intervention.id);
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  const isOwner = current_user && intervention && intervention.user_id.id === current_user.id;
  return (
    <div className="flex justify-center items-center p-8 mt-8 w-full h-screen">
      {/* Intervention Detail Card */}
      <div className="flex flex-row w-full max-w-[1200px] bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image on the left */}
        <div className="w-[45%] h-[500px] bg-gray-100">
          <img
            src={image || "https://via.placeholder.com/600x600"} // fallback image
            alt="Red Flag"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details on the right */}
        <div className="w-[55%] p-8 space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-black">{title || "Untitled"}</h1>
            <h2 className="text-lg text-gray-700 uppercase font-medium mt-2">
            Intervention Details
            </h2>
          </div>

          {/* Intervention Details */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <h3 className="text-black">Reported By: </h3>
              <p className="text-gray-800">
                {intervention?.user_id
                  ? `${intervention.user_id["First Name"]} ${intervention.user_id["Last Name"]}`
                  : "Loading..."}
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-black">Description:</h3>
              <p className="text-gray-800">{intervention?.description}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-black">Intervention Status:</h3>
              <p className="text-gray-800">{intervention?.status}</p>
            </div>
            <div className="flex flex-col">
              <h3 className="text-black">Video Link:</h3>
              <a href={intervention?.video} className="text-blue-600 hover:underline">
                Watch Video
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-x-4 flex justify-start">
            {/* Only show Delete button if the current user is the owner */}
            {isOwner && !current_admin && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-1 px-4 rounded-md text-sm transition-shadow hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            )}

            {/*Update button */}
            {(isOwner || current_admin) && (
              <button
                onClick={toggleModal}
                className="bg-green-600 text-white py-1 px-4 rounded-md text-sm transition-shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500"
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for updating Intervention */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg flex justify-center items-center mt-16">
          <div className="bg-white rounded-lg p-6 w-full sm:w-[600px] md:w-[700px]">
            <h2 className="text-2xl font-semibold text-black mb-4">
              {current_admin ? "Update Status" : "Update Intervention"}
            </h2>

            <form
              onSubmit={current_admin ? handleSubmitAdmin : handleSubmitUser}
              className="space-y-4"
            >
              {current_admin ? (
                <div className="flex flex-col">
                  <label htmlFor="status" className="text-black mb-2">Update Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-3 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="under investigation">Under Investigation</option>
                    <option value="rejected">Rejected</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <label htmlFor="title" className="text-black mb-2">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="px-4 py-2 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="description" className="text-black mb-2">Description</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="px-4 py-2 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="video" className="text-black mb-2">Video Link</label>
                    <input
                      type="text"
                      id="video"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      className="px-4 py-2 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="image" className="text-black mb-2">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="px-4 py-2 rounded-md border border-gray-400 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}

              {/* Button section */}
              <div className="mt-8 flex justify-between items-center space-x-4">
                <button
                  type="submit"
                  className="w-[48%] bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {current_admin ? "Update Status" : "Update Intervention"}
                </button>
                <button
                  onClick={toggleModal}
                  className="w-[48%] bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
