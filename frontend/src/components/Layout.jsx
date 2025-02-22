// import React from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import { ToastContainer } from "react-toastify";

// export default function Layout() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow p-8">
//         <Outlet />
//         <ToastContainer />
//       </main>
//       <Footer />
//     </div>
//   );
// }

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-8 overflow-auto"> {/* Allow content to scroll, if necessary */}
        <Outlet />
        <ToastContainer />
      </main>
      <Footer />
    </div>
  );
}
