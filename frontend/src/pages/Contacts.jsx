import React from "react";

export default function Contacts() {
  return (
    <div className="contact-container flex justify-center items-center h-screen px-5 w-9/10 ">
      <div className="contact-form bg-gray-900 bg-opacity-90 p-8 rounded-2xl shadow-2xl  border border-gray-700 ">
        <h2 className="text-center text-3xl font-extrabold text-white mb-6">
          Contact Us
        </h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            className="contact-input"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            className="contact-input"
          />
          <textarea
            placeholder="Your Message"
            required
            className="contact-input h-32 resize-none"
          ></textarea>
          <button type="submit" className="contact-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
