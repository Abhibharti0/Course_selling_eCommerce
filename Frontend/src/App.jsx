import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses.jsx";
import Buy from "./components/Buy.jsx";
import Purchases from "./components/Purchases.jsx";

import OurCourses from "./admin/OurCourses.jsx";
import UpdateCourse from "./admin/UpdateCourse.jsx";
import CourseCreate from "./admin/CourseCreate.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminSignup from "./admin/AdminSignup.jsx";
import Dashboard from "./admin/Dashboard.jsx";

function App() {
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      <Toaster />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={<Purchases />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={admin ? <Dashboard /> : <Navigate to="/admin/login" />}
        />

        <Route
          path="/admin/create-course"
          element={admin ? <CourseCreate /> : <Navigate to="/admin/login" />}
        />

        {/* FIXED ROUTES BELOW */}
        <Route
          path="/admin/update-course/:id"
          element={admin ? <UpdateCourse /> : <Navigate to="/admin/login" />}
        />

        <Route
          path="/admin/our-courses"
          element={admin ? <OurCourses /> : <Navigate to="/admin/login" />}
        />

      </Routes>
    </>
  );
}

export default App;
