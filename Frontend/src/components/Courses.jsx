import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/courses/allcourses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-2">
          <img src={logo} alt="Profile" className="rounded-full h-14 w-14 shadow-md" />
        </div>
        <nav>
          <ul className="space-y-4 text-gray-700 font-medium">
            <li>
              <a href="/" className="flex items-center hover:text-blue-600 transition">
                <RiHome2Fill className="mr-2 text-lg" /> Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-blue-600 font-semibold">
                <FaDiscourse className="mr-2 text-lg" /> Courses
              </a>
            </li>
            <li>
              <a href="/purchases" className="flex items-center hover:text-blue-600 transition">
                <FaDownload className="mr-2 text-lg" /> Purchases
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-blue-600 transition">
                <IoMdSettings className="mr-2 text-lg" /> Settings
              </a>
            </li>
            <li>
              {isLoggedIn ? (
                <Link
                  to={"/"}
                  className="flex items-center text-red-600 hover:text-red-700 transition"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-2 text-lg" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center hover:text-blue-600 transition">
                  <IoLogIn className="mr-2 text-lg" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-30 w-full p-10 transition-all">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800">Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center shadow-md rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Search courses..."
                className="border border-gray-200 rounded-l-full px-4 py-2 h-10 focus:outline-none"
              />
              <button className="h-10 bg-white border border-gray-200 rounded-r-full px-4 flex items-center justify-center">
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
            <FaCircleUser className="text-4xl text-blue-600" />
          </div>
        </header>

        {/* Courses Section */}
        <div className="overflow-y-auto h-[75vh] pr-2">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">No course posted yet by admin</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-200 rounded-lg p-4 shadow-md bg-white hover:shadow-lg duration-300"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4 h-40 w-full object-cover"
                  />
                  <h2 className="font-bold text-lg mb-2 text-gray-800">{course.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl text-gray-800">
                      ₹{course.price} <span className="text-gray-500 line-through">5999</span>
                    </span>
                    <span className="text-green-600 font-semibold">20% off</span>
                  </div>

                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-blue-600 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-800 duration-300 text-center block"
                  >
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
