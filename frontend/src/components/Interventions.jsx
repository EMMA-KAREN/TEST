import React, { useContext, useState, useEffect } from "react";
import { InterventionContext } from "../context/InterventionsContext";

const InterventionForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    images: "",
    videos: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="mb-4 p-4 border rounded-md shadow-md"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="block w-full p-2 border rounded-md mb-2"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="block w-full p-2 border rounded-md mb-2"
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
        className="block w-full p-2 border rounded-md mb-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {initialData ? "Update" : "Create"} Intervention
      </button>
    </form>
  );
};

const Interventions = () => {
  const { interventions, addIntervention, updateIntervention, deleteIntervention } =
    useContext(InterventionContext);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (formData) => {
    if (editingIntervention) {
      updateIntervention(editingIntervention.id, formData);
    } else {
      addIntervention(formData);
    }
    setEditingIntervention(null);
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Intervention Reports</h2>

      <button
        onClick={() => {
          setEditingIntervention(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4"
      >
        + Add Intervention
      </button>

      {showForm && (
        <div className="mb-4">
          <InterventionForm onSubmit={handleSubmit} initialData={editingIntervention} />
        </div>
      )}

      {interventions.length === 0 ? (
        <p>No intervention reports available.</p>
      ) : (
        <ul className="space-y-4">
          {interventions.map((intervention) => (
            <li key={intervention.id} className="border p-4 rounded-md shadow-md">
              <h3 className="font-semibold text-lg">{intervention.title}</h3>
              <p>{intervention.description}</p>
              <p>
                <strong>Location:</strong> {intervention.location}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    setEditingIntervention(intervention);
                    setShowForm(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteIntervention(intervention.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Interventions;
