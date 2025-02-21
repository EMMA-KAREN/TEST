import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiURL from "../config";

export const RedFlagContext = createContext();

export const RedFlagProvider = ({ children }) => {
  const [redFlags, setRedFlags] = useState([]);
  const [onChange, setOnChange] = useState(true);

   const [authToken, setAuthToken] = useState(() =>
      sessionStorage.getItem("token")
    );

    // fetch all redflags
    useEffect(() => {
        fetch(`${apiURL}/red_flag`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch red flags");
            }
            return response.json();
          })
          .then((data) => {
            setRedFlags(data);
            console.log("Fetched Red Flags:", data);
          })
          .catch((error) => console.error("Error fetching red flags:", error));
      }, [onChange]); // Re-fetch when onChange updates
      

  // Add new red flag
  const addRedFlag = (formData) => {
    fetch(`${apiURL}/red_flag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          toast.success(data.success);
          setOnChange(!onChange);
        } else {
          toast.error(data.error || "Failed to create red flag");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };
  

  // Update red flag details
  const updateRedFlag = (id, updatedData) => {
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((resp) => resp.json())
      .then((response) => {
        response.success ? toast.success("Red-flag updated") : toast.error(response.error);
        setOnChange(!onChange);
      })
      .catch(() => toast.error("Failed to update red flag"));
  };

  // Delete red flag
  const deleteRedFlag = (id) => {
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          setOnChange(!onChange);
        } else {
          toast.error(data.error || "Failed to delete red flag");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  // Update the status of a red flag
  const updateStatus = (id, status) => {
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then((updatedRecord) => {
        if (updatedRecord.success) {
          setRedFlags((prevFlags) =>
            prevFlags.map((r) => (r.id === id ? { ...r, status } : r))
          );
          toast.success("Status updated successfully");
        } else {
          toast.error(updatedRecord.error || "Failed to update status");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };
  

  return (
    <RedFlagContext.Provider value={{ redFlags, addRedFlag, updateRedFlag, setRedFlags, updateStatus, deleteRedFlag }}>
      {children}
    </RedFlagContext.Provider>
  );
};
