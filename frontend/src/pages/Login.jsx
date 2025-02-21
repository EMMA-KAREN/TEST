import { React, useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle, signInWithGithub } from "../firebase-config";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }
  return (
    <div class="font-[sans-serif] max-sm:px-4 mt-10">
      <div class="min-h-screen flex flex-col items-center justify-center">
        <div class="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
          <div class="md:max-w-md w-full px-4 py-4">
            <form onSubmit={handleSubmit}>
              <div class="mb-12">
                <h3 class="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                <p class="text-sm mt-4 text-gray-800">
                  Don't have an account{" "}
                  <Link
                    to={"/signup"}
                    class="text-[#a66cff;] font-semibold hover:text-[#d0f500d7] hover:underline ml-1 whitespace-nowrap"
                  >
                    Register here
                  </Link>
                </p>
              </div>

              <div>
                <label class="text-gray-800 text-xs block mb-2">Email</label>
                <div class="relative flex items-center">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Enter email"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="w-[18px] h-[18px] absolute right-2"
                    viewBox="0 0 682.667 682.667"
                  >
                    <defs>
                      <clipPath id="a" clipPathUnits="userSpaceOnUse">
                        <path
                          d="M0 512h512V0H0Z"
                          data-original="#000000"
                        ></path>
                      </clipPath>
                    </defs>
                    <g
                      clip-path="url(#a)"
                      transform="matrix(1.33 0 0 -1.33 0 682.667)"
                    >
                      <path
                        fill="none"
                        stroke-miterlimit="10"
                        stroke-width="40"
                        d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                        data-original="#000000"
                      ></path>
                      <path
                        d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                        data-original="#000000"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>

              <div class="mt-8">
                <label class="text-gray-800 text-xs block mb-2">Password</label>
                <div class="relative flex items-center">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                    placeholder="Enter password"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#bbb"
                    stroke="#bbb"
                    class="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                    viewBox="0 0 128 128"
                  >
                    <path
                      d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                      data-original="#000000"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* <div class="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div class="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label for="remember-me" class="ml-3 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>
                <div>
                  <a href="jajvascript:void(0);" class="text-blue-600 font-semibold text-sm hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div> */}

              <div class="mt-12">
                <button
                  type="submit"
                  class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-black bg-[#a66cff;] hover:bg-[#d0f500d7] focus:outline-none"
                >
                  Sign in
                </button>
              </div>

              <div class="my-4 flex items-center gap-4">
                <hr class="w-full border-gray-300" />
                <p class="text-sm text-gray-800 text-center">or</p>
                <hr class="w-full border-gray-300" />
              </div>

              <div class="space-x-6 flex justify-center">
                <button
                  type="button"
                  class="border-none outline-none"
                  onClick={signInWithGoogle}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-7 h-7 inline"
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
                  class="border-none outline-none"
                  onClick={signInWithGithub}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-7 h-7 inline"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#181717"
                      d="M256 0c-141.4 0-256 114.6-256 256 0 113.6 73.9 210.5 176.2 244.5 12.9 2.4 17.6-5.6 17.6-11.2v-39.1c-71.5 15.6-86.3-30.4-86.3-30.4-11.6-29.5-28.4-37.4-28.4-37.4-23.2-15.8 1.7-15.5 1.7-15.5 25.6 1.8 39.1 26.2 39.1 26.2 22.3 38.1 58.7 27.1 72.9 20.8 2.3-16.1 8.7-27.1 15.9-33.4-61.9-7.1-126.3-31-126.3-137.4 0-30.3 10.8-55.3 28.6-74.8-2.9-7.2-12.3-36.5 2.7-76.1 0 0 23.3-7.5 76.1 28.6 22.1-6.1 45.9-9.2 69.5-9.3 23.6.1 47.4 3.2 69.5 9.3 52.8-36.1 76.1-28.6 76.1-28.6 15 39.6 5.7 68.9 2.7 76.1 17.8 19.5 28.6 44.5 28.6 74.8 0 106.4-64.4 130.2-126.3 137.3 9.7 8.1 18.3 24.1 18.3 48.6v71.4c0 5.6 4.7 13.7 17.6 11.2 102.3-34.1 176.2-130.9 176.2-244.5 0-141.4-114.6-256-256-256z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <div class="w-full h-full flex items-center bg-[#a66cff;] rounded-xl p-8">
            <img
              src="https://readymadeui.com/signin-image.webp"
              class="w-full aspect-[12/12] object-contain"
              alt="login-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
