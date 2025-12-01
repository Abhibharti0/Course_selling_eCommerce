import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


function Signup() {
  const [firstname, setFirstname] = useState("");
const [lastname, setlastname] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <- New state

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    try {
      const response = await axios.post(
  "http://localhost:5000/api/users/signup",
  {
    firstname, 
    lastname,  
    email,
    password,
  },
  { withCredentials: true }
);

      console.log("Signup successful: ", response.data);
     alert(response.data.message);
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          Array.isArray(error.response.data.errors)
            ? error.response.data.errors.join("\n")
            : error.response.data.message || "Signup failed!"
        );
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
      <div className="min-h-screen container mx-auto flex items-center justify-center text-white px-4">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-4 sm:p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 sm:w-10 h-8 sm:h-10 rounded-full" />
            <Link to={"/"} className="text-lg sm:text-xl font-bold text-orange-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to={"/login"}
              className="bg-transparent border border-gray-500 py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-md rounded-md hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-md rounded-md hover:bg-orange-600 transition"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg mx-4 mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6 text-sm sm:text-base">
            Just Signup To Join Us!
          </p>

          <form onSubmit={handleSubmit} >
            <div className="mb-1 ">
              <label htmlFor="firstname" className="block text-gray-400 mb-2 text-sm sm:text-base">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}

                className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Type your firstname"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className="block text-gray-400 mb-2 text-sm sm:text-base">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
                className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Type your lastname"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 mb-2 text-sm sm:text-base">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-400 mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // <- toggle type
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 sm:p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-500 cursor-pointer text-lg"
                  onClick={() => setShowPassword(!showPassword)} // <- toggle password
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center text-sm sm:text-base">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md transition text-sm sm:text-base"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
