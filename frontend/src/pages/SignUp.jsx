import React,{useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle, signInWithGithub } from "../firebase-config";

export default function SignUp() {

  const navigate = useNavigate();
  const { addUser } = useContext(UserContext);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== repeatPassword) {
        return alert("Password doesn't match");
    } else {
        addUser(first_name, last_name, phone, email, password);
        navigate("/login");
    }
}

  return (
    <div className="Register-form font-[sans-serif] max-w-4xl flex items-center mx-auto p-4 mt-15 bg-gray-900 rounded-4xl border-2 border-pink-200">
      <div className="grid md:grid-cols-3 gap-6 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-3xl border-2 border-white">
        <div className="Register-form-text max-md:order-1 flex flex-col justify-center md:space-y-16 space-y-8 max-md:mt-16 min-h-full lg:px-8 px-4 py-4 text-amber-50 -mt-35">
          <div>
            <h4 className="text-lg mr-2">Create Your Account</h4>
            <p className="text-[14px] mt-3 leading-relaxed">
              Welcome to our registration page! Get started by creating your account.
            </p>
          </div>
          <div>
            <h4 className="text-lg">Simple & Secure Registration</h4>
            <p className="text-[14px] mt-3 leading-relaxed">
              Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 w-full py-6 px-6 sm:px-16 max-md:max-w-xl mx-auto">
          <div className="mb-6">
            <h3 className="text-white text-xl font-bold">
              Create an account
            </h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-white text-sm mb-2 block ">First Name</label>
              <div className="relative flex items-center ">
                <input
                  type="text"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300  placeholder-white"
                  placeholder="Enter first name"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Last Name</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300 placeholder-white"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Phone</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300 placeholder-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Email</label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300 placeholder-white"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Password</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300 placeholder-white"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm mb-2 block">Repeat Password</label>
              <div className="relative flex items-center">
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  className="text-white bg-transparent border-2 border-white w-full text-sm pl-4 pr-8 py-2.5 rounded-md outline-blue-300 placeholder-white"
                  placeholder="Confirm password"
                />
              </div>
            </div>

          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-2.5 px-4 tracking-wider text-sm rounded-md text-white bg-[#000] hover:bg-white hover:text-black focus:outline-none"
            >
              Create an account
            </button>
          </div>

          <div className="my-4 flex items-center gap-4">
                <hr className="w-full border-gray-300" />
                <p className="text-sm text-white text-center">or</p>
                <hr className="w-full border-gray-300" />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              className="border-none outline-none"
              onClick={signInWithGoogle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 inline"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#fbbd00"
                  d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  data-original="#fbbd00"
                />
                <path
                  fill="#0f9d58"
                  d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  data-original="#0f9d58"
                />
                <path
                  fill="#31aa52"
                  d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                  data-original="#31aa52"
                />
                <path
                  fill="#3c79e6"
                  d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                  data-original="#3c79e6"
                />
                <path
                  fill="#cf2d48"
                  d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                  data-original="#cf2d48"
                />
                <path
                  fill="#eb4132"
                  d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                  data-original="#eb4132"
                />
              </svg>
            </button>

            <button
              type="button"
              className="border-none outline-none"
              onClick={signInWithGithub}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 inline"
                viewBox="0 0 512 512"
              >
                <path
                  fill="#181717"
                  d="M256 0c-141.4 0-256 114.6-256 256 0 113.6 73.9 210.5 176.2 244.5 12.9 2.4 17.6-5.6 17.6-11.2v-39.1c-71.5 15.6-86.3-30.4-86.3-30.4-11.6-29.5-28.4-37.4-28.4-37.4-23.2-15.8 1.7-15.5 1.7-15.5 25.6 1.8 39.1 26.2 39.1 26.2 22.3 38.1 58.7 27.1 72.9 20.8 2.3-16.1 8.7-27.1 15.9-33.4-61.9-7.1-126.3-31-126.3-137.4 0-30.3 10.8-55.3 28.6-74.8-2.9-7.2-12.3-36.5 2.7-76.1 0 0 23.3-7.5 76.1 28.6 22.1-6.1 45.9-9.2 69.5-9.3 23.6.1 47.4 3.2 69.5 9.3 52.8-36.1 76.1-28.6 76.1-28.6 15 39.6 5.7 68.9 2.7 76.1 17.8 19.5 28.6 44.5 28.6 74.8 0 106.4-64.4 130.2-126.3 137.3 9.7 8.1 18.3 24.1 18.3 48.6v71.4c0 5.6 4.7 13.7 17.6 11.2 102.3-34.1 176.2-130.9 176.2-244.5 0-141.4-114.6-256-256-256z"
                />
              </svg>
            </button>
          </div>

          <p className="text-white text-sm mt-6 text-center">
            Already have an account?{" "}
            
            <Link
              to="/login"
              className="text-pink-300 hover:text-white font-semibold ml-2"
            >
              {" "}Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
