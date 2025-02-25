import React,{ createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import apiURL from "../config";

export const RedFlagContext = createContext();

export const RedFlagProvider = ({ children }) => {

    const navigate = useNavigate();
    const { authToken } = useContext(UserContext);
    const [red_flags, setRedFlags] = useState([]);
    const [onChange, setOnChange] = useState(true);

  
// FETCH RED FLAGS
    useEffect(() => {
      if (authToken) {
        fetch(`${apiURL}/red_flag`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            setRedFlags(response);
          })
          .catch((error) => {
            console.error("Error fetching Red Flags:", error);
          });
      }
    }, [authToken, onChange]);
  

// ADD A RED FLAD
const addRedFlag = (title, description, image, video, location) => {
    toast.loading("Processing... ");
    fetch(`${apiURL}/red_flag`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
         Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title,
        description,
        image,
        video,
        location,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);

        if (response.success) {
          toast.dismiss();
          toast.success(response.success);
        } else if (response.error) {
          toast.dismiss();
          toast.error(response.error);
        } else {
          toast.dismiss();
          toast.error("Failed to add Red Flag");
        }
      });
  };


  // UPDATE RED FLAG (as a normal user)
  const updateRedFlag = (id, updated_title, updated_description, updated_image, updated_video) => {
    
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: updated_title,
        description: updated_description,
        image: updated_image,
        video: updated_video,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          toast.success("Red Flag Updated ");
          setOnChange(!onChange)
        } else if (response.error) {
          toast.error("Red Flag Not Updated ");
        } else {
          alert("Failed to update");
        }
      })
      .catch((error) => console.error("Error updating entry:", error));
    console.log("Updating entry");
  };

   // UPDATE RED FLAG (as an admin)
   const updateRedFlagStatus = (id, updated_status) => {
    
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        status: updated_status,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          toast.success("Red Flag Updated ");
          setOnChange(!onChange)
        } else if (response.error) {
          toast.error("Red Flag Not Updated ");
        } else {
          alert("Failed to update");
        }
      })
      .catch((error) => console.error("Error updating entry:", error));
    console.log("Updating entry");
  };



  // DELETE RED FLAG
  const deleteRedFlag = (id) => {
    toast.loading("Deleting Red FALG ...");
  
    fetch(`${apiURL}/red_flag/${id}`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
      
        if (response.success) {
          toast.dismiss(); 
          toast.success(response.success); 
          setOnChange(!onChange);
          navigate("/userprofile")
        } else if (response.error) {
          toast.dismiss();
          toast.error(response.error); 
        } else {
          toast.dismiss();
          toast.error("Failed to delete"); 
        }
      })
      .catch((error) => {
        toast.dismiss(); 
        toast.error("Network error or failed to connect to server");
        console.error("Error deleting loan:", error); 
      });
  };
  

  const data = {
    red_flags,
    setOnChange,
    addRedFlag,
    updateRedFlag,
    deleteRedFlag,
    updateRedFlagStatus,
  };


    return <RedFlagContext.Provider value={data}>{children}</RedFlagContext.Provider>;
};    