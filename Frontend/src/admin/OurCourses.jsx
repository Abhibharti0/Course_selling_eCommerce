import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  // Redirect if no admin auth
  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // Fetch ALL courses (correct API)
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/courses/allcourses`,
          { withCredentials: true }
        );

        console.log("Courses:", response.data.courses);
        setCourses(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching courses:", error);
        toast.error("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}api/courses/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);

      // Remove deleted course from UI
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.log("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Error deleting course");

    }
  };

  if (loading) return <p className="text-center my-10 text-gray-500">Loading...</p>;

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>

      <Link
        to="/admin/dashboard"
        className="bg-orange-500 py-2 px-4 text-white rounded-md hover:bg-orange-700"
      >
        Go to Dashboard
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">

            {/* Course Image */}
            <img
              src={course?.image?.url || "/imgPL.webp"}
              alt={course.title}
              className="h-40 w-full object-cover rounded-lg"
            />

            {/* Title */}
            <h2 className="text-lg font-bold mt-3">{course.title}</h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2">
              {course.description?.length > 200
                ? course.description.slice(0, 200) + "..."
                : course.description}
            </p>

            {/* Price */}
            <div className="mt-3 font-semibold text-gray-800">
              ₹{course.price}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">

              {/* Update Button */}
              {course._id ? (
                <Link
                  to={`/admin/update-course/${course._id}`}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Update
                </Link>
              ) : (
                <button className="bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed">
                  No ID
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurCourses;
