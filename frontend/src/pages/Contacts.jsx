import React from "react";

export default function Contacts() {
  return (
    <div className="container mx-auto p-5 flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-center text-2xl font-bold text-primary mb-4">Contact Us</h2>
        <form className="space-y-3">
          <input 
            type="text" 
            placeholder="Your Name" 
            required 
            className="form-control p-2 border rounded w-full" 
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            required 
            className="form-control p-2 border rounded w-full" 
          />
          <textarea 
            placeholder="Your Message" 
            required 
            className="form-control p-2 border rounded w-full h-32 resize-none" 
          ></textarea>
          <button type="submit" className="btn btn-primary w-full p-2 rounded">Send Message</button>
        </form>
      </div>
    </div>
  );
}