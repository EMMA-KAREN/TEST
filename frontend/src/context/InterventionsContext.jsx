import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiURL from "../config";

export const InterventionContext = createContext();

export const InterventionProvider = ({ children }) => {
  const [interventions, setInterventions] = useState([]);
  const [onChange, setOnChange] = useState(true);

  // Fetch all intervention records
  useEffect(() => {
    fetch(`${apiURL}/interventions`, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((response) => {
        setInterventions(response);
      });
  }, [onChange]);

  // Add a new intervention record
  const addIntervention = (title, description, location, images, videos) => {
    fetch(`${apiURL}/interventions`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ title, description, location, images, videos }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          toast.success("Intervention created successfully");
          setOnChange(!onChange);
        } else {
          toast.error(response.error || "Failed to create intervention");
        }
      });
  };

  // Delete an intervention record
  const deleteIntervention = (id) => {
    fetch(`${apiURL}/interventions/${id}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          toast.success("Intervention deleted successfully");
          setOnChange(!onChange);
        } else {
          toast.error(response.error || "Failed to delete intervention");
        }
      });
  };

//   update
  const updateIntervention = (id, updatedData) => {
    fetch(`${apiURL}/interventions/${id}`, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((resp) => resp.json())
      .then((response) => {
        response.success ? toast.success("Intervention updated") : toast.error(response.error);
        setOnChange(!onChange);
      });
  };
  

  const data = { interventions, addIntervention, updateIntervention,deleteIntervention };
  return <InterventionContext.Provider value={data}>{children}</InterventionContext.Provider>;
};
