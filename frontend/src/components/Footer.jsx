import React from 'react';
import { Link } from 'react-router-dom'


export default function Footer() {
  return (
    <footer className="Footer bg-dark rounded-lg shadow-sm m-4 dark:bg-black mt-auto">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-white">
          © 2025 <Link to={"/"} className="hover:underline">iReporter™</Link>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white sm:mt-0">
          <li>
            <Link to={"/about"} className="hover:underline me-4 md:me-6">About</Link>
          </li>
          <li>
            <Link to={"#"} className="hover:underline me-4 md:me-6">Privacy Policy</Link>
          </li>
          <li>
            <Link to={"#"} className="hover:underline me-4 md:me-6">Licensing</Link>
          </li>
          <li>
            <Link to={"/contact"} className="hover:underline">Contact</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
