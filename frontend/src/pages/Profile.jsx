import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { current_user, current_admin, updateUser } = useContext(UserContext);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [profile_picture, setProfilePicture] = useState("");

  useEffect(() => {
    const currentData = current_user || current_admin;
    if (currentData) {
      setPhone(currentData.phone);
      setEmail(currentData.email);
      SetPassword(currentData.password);
      setProfilePicture(currentData.profilepicture);
    }
  }, [current_user, current_admin]);

  function handleSubmit(e) {
    e.preventDefault();
    alert("Are you sure you want to make the update?");
    updateUser(phone, email, password,profile_picture);
  }

  return (
    <div className="bg-[#d0f500d7] mt-18 rounded-2xl">
      <div className="mx-auto h-full px-4 py-8 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8 mt-10">
        <div className="flex flex-col items-center justify-between lg:flex-row md:gap-10 gap-5">
          {/* Profile Details Section */}
          {current_user || current_admin ? (
            <div className="relative lg:block lg:w-1/2 max-w-lg bg-white p-6 rounded-2xl shadow-lg ring-1 ring-gray-200">
              {/* Personal Info Header */}
              <h2 className="m-5 bg-[#a66cff] text-black rounded-xl text-center text-xl font-bold py-2">
                Personal Details
              </h2>

              {/* Personal Info */}
              <div className="flex-auto p-6">
                <div className="relative flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">First Name: {current_user?.first_name || current_admin?.first_name}</h3>
                  <p className="text-lg font-semibold mb-2">Last Name: {current_user?.last_name || current_admin?.last_name}</p>
                  <p className="text-lg font-semibold mb-2">Email: {current_user?.email || current_admin?.email}</p>
                  <p className="text-lg font-semibold mb-2">Phone: {current_user?.phone || current_admin?.phone}</p>

                  {/* Form Section */}
                  <form className="mt-8 space-y-4 bg-[#f3f3f3] p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter New Email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a66cff]"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter New Phone Number"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a66cff]"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => SetPassword(e.target.value)}
                        placeholder="Enter New Password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a66cff]"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold">Profileicture</label>
                      <input
                      type="text"
                      name="profilePicture"
                      value={profile_picture || ""}
                      onChange={(e) => setProfilePicture(e.target.value)}
                      placeholder="Enter image URL"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#a66cff]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 mt-4 text-white bg-[#a66cff] border-2 border-[#a66cff] rounded-md hover:bg-[#d0f500d7] hover:border-transparent"
                    >
                      Update Information
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : null}

          {/* Image Section */}
          {current_user || current_admin ? (
            <div className="relative lg:block lg:w-1/2">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(current_user?.first_name || current_admin?.first_name)}+${encodeURIComponent(current_user?.last_name || current_admin?.last_name)}&background=random`}
                className="w-3/5 mx-auto rounded-full"
                alt="Profile"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
