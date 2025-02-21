import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { RedFlagProvider } from "./context/RedFlagContext";
import { InterventionProvider } from "./context/InterventionsContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UserProfile from "./pages/UserProfile"
import AdminProfile from "./pages/AdminProfile";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";

import RedFlags from "./components/RedFlags";
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
      <RedFlagProvider>
        <InterventionProvider>  
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/profile" element={< Profile />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="*" element={<NoPage />} /> */}
            <Route path="/redflags" element={<RedFlags />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>
        </Routes>
        </InterventionProvider>
        </RedFlagProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
