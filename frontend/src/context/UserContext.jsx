import React from "react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import apiURL  from "../config";
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() =>
    sessionStorage.getItem("token")
  );

  const [current_user, setCurrentUser] = useState(null);
  const [current_admin, setCurrentAdmin] = useState(null);
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])

  const [onChange, setOnChange] = useState(true);

// LOGIN
  const login = (email, password) => {
    toast.loading("Logging you in ... ");
    fetch(`${apiURL}/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.access_token) {
          toast.dismiss();
          sessionStorage.setItem("token", response.access_token);
          setAuthToken(response.access_token);

          fetch(`${apiURL}/current_user`, {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${response.access_token}`,
            },
          })
            .then((response) => response.json())
            .then((response) => {
              console.log(response); 

              if (response.is_admin) {
                setCurrentAdmin(response);
                navigate("/adminprofile")  
              } else {
                setCurrentUser(response);
                navigate("/userprofile")                 }
            });

          toast.success("Successfully Logged in");
          // navigate("/");
        } else if (response.error) {
          toast.dismiss();
          toast.error(response.error);
        } else {
          toast.dismiss();
          toast.error("Failed to login");
        }
      });
  };

  //  google login 
const google_login = (email) => {
  toast.loading("Logging you in ... ");
  fetch(`${apiURL}/google_login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((resp) => resp.json())
    .then((response) => {
      toast.dismiss();

      if (response.error) {
        toast.error(response.error);
        return; 
      }

      if (response.access_token) {
        sessionStorage.setItem("token", response.access_token);
        setAuthToken(response.access_token);

        fetch(`${apiURL}/current_user`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${response.access_token}`,
          },
        })
        .then((response) => response.json())
            .then((response) => {
              console.log(response); 

              if (response.is_admin) {
                setCurrentAdmin(response);
                navigate("/adminprofile")  
              } else {
                setCurrentUser(response);
                navigate("/userprofile")                 }
            });

          toast.success("Successfully Logged in");
          
        } else if (response.error) {
          toast.dismiss();
          toast.error(response.error);
        } else {
          toast.dismiss();
          toast.error("Failed to login");
        }
      });
  };


  // LOG OUT
  const logout = () => {
    toast.loading("Logging out ... ");
    fetch(`${apiURL}/logout`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);

        if (response.success) {
          sessionStorage.removeItem("token");
          setAuthToken(null);
          setCurrentUser(null);
          setCurrentAdmin(null);

          toast.dismiss();
          toast.success("Successfully Logged out");

          navigate("/");
        }
      });
  };


// FETCHING ALL USERS
  useEffect(() => {
    fetch(`${apiURL}/users`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setUsers(response);
        console.log(response)
      });
  }, []);

  // FETCH ALL ADMINS
  useEffect(() => {
    fetch(`${apiURL}/admins`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setAdmins(response);
        console.log(response)
      });
  }, []);

  // FETCH CURRENT USER
  useEffect(() => {
    if (authToken) {
      fetchCurrentUser();
    }
  }, [authToken]);

  const fetchCurrentUser = () => {
    fetch(`${apiURL}/current_user`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.is_admin) {
          setCurrentAdmin(response);
        } else {
          setCurrentUser(response);
        }
      });
  };


  // ADD USER
  const addUser = (first_name, last_name, phone, email, password, profile_picture = null, provider="email") => {
    toast.loading("Registering ... ");
    fetch(`${apiURL}/user`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name,
        last_name,
        phone,
        email,
        password,
        profile_picture,
        provider,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        toast.dismiss();  
        if (response.msg) {
          toast.success("User added successfully");
          setTimeout(() => {
            navigate("/login");
          }, 500); 
        } 
        else if(email.error)
          {
            toast.error("Email already exists");
            navigate("/login")
            }
        else if (response.error) {
          toast.error(response.error);
        }
      })
  };


    // UPDATE  USER
    const updateUser = (updated_phone, updated_email, updated_password, updated_profile_picture) => {
      fetch(`${apiURL}/user/update`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          phone: updated_phone,
          email: updated_email,
          password: updated_password || "",
          profile_picture: updated_profile_picture
        }),
      })
        .then((resp) => resp.json())
        .then((response) => {
          if (response.success) {
            toast.success("Updated successfully");
            setOnChange(!onChange);
            // navigate("/profile");
          } else if (response.error) {
            toast.error("Details Not Updated");
          } else {
            alert("Failed to update");
          }
        })
        .catch((error) => console.error("Error updating entry:", error));
      console.log("Updating entry");
    };


// DELETE USER
const deleteUser = (userId) => {
    toast.loading("Deleting user...");
    
    fetch(`${apiURL}/user/${userId}`, {
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
          
          const updatedUsers = users.filter(user => user.id !== userId); 
          setUsers(updatedUsers); 
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
        console.error("Error deleting user:", error); 
      });
  };
  

  const data = {
    authToken,
    current_user,
    current_admin,
    users,
    login,
    logout,
    addUser,
    updateUser,
    deleteUser,
    setAdmins,
    google_login,
    admins,
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;

}