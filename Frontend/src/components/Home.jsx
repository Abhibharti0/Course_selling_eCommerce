import React, { useEffect, useState } from 'react';
import logo from '../../public/logo.webp';
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';
import { BACKEND_URL } from "../utils/utils";
const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

   useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);


  const handleLogout = async () => {
  try {
    const response = await axios.post(
  `${BACKEND_URL}/api/users/logout`,
  { withCredentials: true }
);


    toast.success(response.data.message);
    localStorage.removeItem("user");
    setIsLoggedIn(false);

  } catch (error) {
    console.log("Error in logging out:", error);
    toast.error(error.response?.data?.message || "Error in logging out");
  }
};



   useEffect(() => {
     const fetchCourses =async () => {
       try {

        const response= await axios.get(`${BACKEND_URL}/api/courses/allcourses`,
          { withCredentials: true }
        )
        console.log("Courses data:", response.data.courses);
        setCourses(response.data.courses);

       } catch (error) {
         console.error("Error fetching courses:", error);
       }
    };
    fetchCourses();
  }, []);

 var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  cssEase: "ease-in-out",

  responsive: [
    {
      breakpoint: 1275,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
    
  ],
};

  return (
    <div className='bg-gradient-to-br from-black via-blue-950 to-purple-900 min-h-screen relative overflow-hidden'>
      {/* Subtle background overlay for depth */}
      <div className='absolute inset-0 bg-black bg-opacity-20'></div>
      <div className='text-white container mx-auto flex flex-col min-h-screen relative z-10'>
        {/* Header */}
        <header className='flex items-center justify-between p-4 sm:p-6 bg-black bg-opacity-50 backdrop-blur-sm rounded-b-lg shadow-lg'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt="CourseHaven logo" className='w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-md' />
            <h1 className='text-xl sm:text-2xl text-orange-500 font-bold drop-shadow-lg'>CourseHaven</h1>
          </div>
          <div className='space-x-3 sm:space-x-5'>
  {isLoggedIn ? (
    <button 
      onClick={handleLogout}
      className='bg-transparent text-white py-2 px-4 border border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 shadow-md hover:shadow-xl'
    >
      Logout
    </button>
  ) : (
    <>
      <Link 
        to="/login"
        className='bg-transparent text-white py-2 px-4 border border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 shadow-md hover:shadow-xl'
      >
        Login
      </Link>

      <Link 
        to="/signup"
        className='bg-transparent text-white py-2 px-4 border border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 shadow-md hover:shadow-xl'
      >
        Signup
      </Link>
    </>
  )}
</div>

        </header>

        {/* Main Section */}
        <section className='text-center py-10 sm:py-20 px-4 flex-shrink-0 mt-8'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold text-orange-500 mb-6 drop-shadow-2xl animate-pulse'>
            CourseHaven
          </h1>
          <p className='text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto leading-relaxed'>
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className='space-x-4 mt-8 flex flex-col sm:flex-row justify-center gap-4'>
            <Link to="/courses" className='bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-white hover:to-gray-100 hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105'>Explore Courses</Link>
            <button className='bg-gradient-to-r from-white to-gray-100 text-black py-3 px-6 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105'>Watch Course Video</button>
          </div>
        </section>

        <section className="p-4 sm:p-6 md:p-10 flex-grow overflow-y-auto">
 <section className="p-4 sm:p-6 md:p-10 flex-grow overflow-y-auto">
  <Slider {...settings}>
    {courses.map((course) => (
      <div key={course._id} className="px-4"> {/* GAP FIXED */}
        <div className="relative w-full transition-all duration-300 transform hover:scale-105">
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:shadow-2xl">
            
            <img
              className="h-40 w-full object-cover"
              src={course.image.url}
              alt={course.title}
            />

            <div className="p-5 text-center">
              <h2 className="text-xl font-bold text-white truncate mb-3">
                {course.title}
              </h2>

              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-full hover:from-blue-500 hover:to-purple-500 duration-300 shadow-md hover:shadow-lg transform hover:scale-110">
                Enroll Now
              </button>
            </div>

          </div>
        </div>
      </div>
    ))}
  </Slider>
</section>

</section>

        {/* Horizontal Line Above Footer */}
        <hr className="border-t border-gray-500 mx-4 my-8 flex-shrink-0 opacity-50" />

        {/* Footer */}
        <footer className='mt-auto py-6 sm:py-10 px-4 flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-sm rounded-t-lg shadow-lg'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8'>
            <div className='flex flex-col items-center md:items-start'>
              <div className='flex items-center space-x-2 mb-4'>
                <img src={logo} alt="CourseHaven logo" className='w-8 sm:w-10 h-8 sm:h-10 rounded-full shadow-md' />
                <h1 className='text-xl sm:text-2xl text-orange-500 font-bold drop-shadow-lg'>CourseHaven</h1>
              </div>
              <div>
                <p className='mb-2 text-gray-300'>Follow us</p>
                <div className='flex space-x-4'>
                  <a href="#" aria-label="Facebook" className='text-xl sm:text-2xl hover:text-blue-400 transition-all duration-300 transform hover:scale-110'><FaFacebook /></a>
                  <a href="https://www.linkedin.com/in/abhishek-bharti-31202a363/" aria-label="LinkedIn" className='text-xl sm:text-2xl hover:text-blue-400 transition-all duration-300 transform hover:scale-110'><FaLinkedin /></a>
                  <a href="https://github.com/Abhibharti0" aria-label="GitHub" className='text-xl sm:text-2xl hover:text-gray-400 transition-all duration-300 transform hover:scale-110'><FaGithub /></a>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='text-base sm:text-lg font-semibold mb-4 text-orange-400'>Connect</h3>
              <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>YouTube - Abhishek Bharti</li>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>Telegram - Abhishek Bharti</li>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>GitHub - Abhishek Bharti</li>
              </ul>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='text-base sm:text-lg font-semibold mb-4 text-orange-400'>
                Copyright © {new Date().getFullYear()}
              </h3>
              <ul className='space-y-2 text-gray-400 text-sm sm:text-base'>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>Terms & Conditions</li>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-2'>Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
