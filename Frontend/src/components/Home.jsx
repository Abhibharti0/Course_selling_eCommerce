import React from 'react';
import logo from '../../public/logo.webp';
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

const Home = () => {
  return (
    <div className='bg-gradient-to-r from-black to-blue-950 min-h-screen'>
      <div className='h-screen text-white container mx-auto'>
        {/* Header */}
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt="CourseHaven logo" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>
          </div>
          <nav className='space-x-5'>
            <Link to="/login" className='bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white hover:text-black transition duration-300'>Login</Link>
            <Link to="/signup" className='bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-white hover:text-black transition duration-300'>Signup</Link>
          </nav>
        </header>

        {/* Main Section */}
        <section className='text-center py-20 px-4'>
          <h1 className='text-4xl font-semibold text-orange-500 mb-6'>
            CourseHaven
          </h1>
          <p className='text-gray-300 text-lg mb-8'>
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className='space-x-4 mt-8 flex flex-col sm:flex-row justify-center'>
            <Link to="/courses" className='bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white hover:text-black transition duration-300'>Explore Courses</Link>
            <button className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 hover:text-white transition duration-300'>Watch Course Video</button>
          </div>
        </section>

        {/* Horizontal Line Above Footer */}
        <hr className="border-t border-gray-500 mx-4 my-8" />

        {/* Footer */}
        <footer className='mt-auto py-10 px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center md:items-start'>
              <div className='flex items-center space-x-2 mb-4'>
                <img src={logo} alt="CourseHaven logo" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>
              </div>
              <div>
                <p className='mb-2 text-gray-300'>Follow us</p>
                <div className='flex space-x-4'>
                  <a href="#" aria-label="Facebook" className='text-2xl hover:text-blue-400 transition duration-300'><FaFacebook /></a>
                  <a href="https://www.linkedin.com/in/abhishek-bharti-31202a363/" aria-label="LinkedIn" className='text-2xl hover:text-blue-400 transition duration-300'><FaLinkedin /></a>
                  <a href="https://github.com/Abhibharti0" aria-label="GitHub" className='text-2xl hover:text-gray-400 transition duration-300'><FaGithub /></a>
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4'>Connect</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer transition duration-300'>YouTube - Abhishek Bharti</li>
                <li className='hover:text-white cursor-pointer transition duration-300'>Telegram - Abhishek Bharti</li>
                <li className='hover:text-white cursor-pointer transition duration-300'>GitHub - Abhishek Bharti</li>
              </ul>
            </div>
            <div className='flex flex-col items-center'>
              <h3 className='text-lg font-semibold mb-4'>
                Copyright © {new Date().getFullYear()}
              </h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer transition duration-300'>Terms & Conditions</li>
                <li className='hover:text-white cursor-pointer transition duration-300'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer transition duration-300'>Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
