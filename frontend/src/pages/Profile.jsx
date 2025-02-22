import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';


export default function Profile() {
  const { current_user, current_admin, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  }

  function confirmUpdate() {
    updateUser(phone, email, password, profile_picture);
    setShowModal(false);
  }

  return (
    <div className="bg-gray-100 rounded-4xl w-full p-6 h-full overflow-auto  mb-10 shadow-md -mt-5">
      <div className="mx-auto h-full px-6 py-8 sm:max-w-xl md:max-w-full md:px-16 lg:max-w-screen-xl lg:px-12">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 -mt-5">
          {current_user || current_admin ? (
            <div className="lg:w-2/3 bg-white p-6 rounded-2xl shadow-lg w-full ">
              <h2 className="bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out text-white rounded-xl text-center text-2xl font-bold py-3 mb-5">
                Personal Details
              </h2>
              <div className="p-4">
                <div className="space-y-4 text-gray-700 items-left">
                  <div className="flex items-center">
                    <FaUser className="text-purple-600 text-xl mr-3"/>
                    <h3 className="text-lg font-semibold">First Name:</h3>
                    <p className="ml-2 text-gray-900">{current_user?.first_name || current_admin?.first_name}</p>
                  </div>

                  <div className="flex items-center">
                    <FaUser className="text-purple-600 text-xl mr-3"/>
                    <h3 className="text-lg font-semibold">Last Name:</h3>
                    <p className="ml-2 text-gray-900">{current_user?.last_name || current_admin?.last_name}</p>
                  </div>

                  <div className="flex items-center">
                    <FaEnvelope className="text-purple-600 text-xl mr-3" />
                    <h5 className="text-lg font-semibold">Email:</h5>
                    <p className="ml-2 text-gray-900">{current_user?.email || current_admin?.email}</p>
                  </div>

                  <div className="flex items-center">
                    <FaPhone className="text-purple-600 text-xl mr-3"/>
                    <h3 className="text-lg font-semibold">Phone:</h3>
                    <p className="ml-2 text-gray-900">{current_user?.phone || current_admin?.phone}</p>
                  </div>
                </div>
                <form className="mt-4 space-y-4 bg-gray-50 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter New Email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold">Phone Number</label>
                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter New Phone Number" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => SetPassword(e.target.value)} placeholder="Enter New Password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
                  </div>
                  <div>
                    <label htmlFor="profilePicture" className="block text-sm font-semibold">Profile Picture</label>
                    <input type="text" name="profilePicture" value={profile_picture || ""} onChange={(e) => setProfilePicture(e.target.value)} placeholder="Enter image URL" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" />
                  </div>
                  <button type="submit" className="inline-block px-6 py-3 text-lg font-bold text-white text-center rounded-lg bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out shadow-lg shadow-[rgba(255,_126,_179,_0.4)] hover:from-[#7effb8] hover:to-[#80d893] hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px] border border-gray-700">
                    Update Information
                  </button>
                </form>
              </div>
            </div>
          ) : null}
          {current_user || current_admin ? (
            <div className="lg:w-1/3 flex justify-center lg:items-start -mt-58">
              <img src={current_user?.profile_picture || current_admin?.profile_picture} className="w-44 h-44 rounded-full shadow-lg border-4 border-transparent bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] bg-clip-border transition-all duration-300 ease-in-out" alt="Profile" />
            </div>
          ) : null}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-xl ">
            <h2 className="text-lg font-bold mb-4">Confirm Update</h2>
            <p>Are you sure you want to update your information?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-gradient-to-r hover:from-[#ec4c4c] hover:to-[#ff0000]  hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px] transition-all duration-300 ease-in-out hover:text-amber-50">Cancel</button>
              <button onClick={confirmUpdate} className="px-4 py-2 rounded-md  bg-gradient-to-r from-[#d580d8] to-[#ff7eb3] transition-all duration-300 ease-in-out shadow-lg shadow-[rgba(255,_126,_179,_0.4)] hover:from-[#7effb8] hover:to-[#80d893] hover:shadow-[rgba(255,_126,_179,_0.6)] hover:translate-y-[-2px]">Yes, Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
