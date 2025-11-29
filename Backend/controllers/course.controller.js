import Course from '../models/course.model.js';
import {v2 as cloudinary} from 'cloudinary';


export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  console.log(req.body);

  try {
    // Validate required fields
    if (!title || !description || !price ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle file upload
    const{image} = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const allowedFormate=['image/jpeg','image/jpg','image/png'];
    if(!allowedFormate.includes(image.mimetype)){
      return res.status(400).json({message:"Only jpg,jpeg and png format are allowed"});
    }
    // Upload image to Cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: 'courses',
    });
    if(!cloud_response || cloud_response.error){
      return res.status(500).json({message:"Image upload failed"});
    }

    const courseData = {
      title,
      description,
      price,
      image:{
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url,
      }
    };

    // IMPORTANT: await database call
    const course = await Course.create(courseData);

    return res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};




export const updateCourse = async (req, res) => {
  const { id } = req.params; // this is the actual ID sent
  const { title, description, price, image } = req.body;

  try {
    // Get existing course first (so fallback image works)
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Prepare updated data
    const updatedData = {
      title,
      description,
      price,
      image: {
        public_id: image?.public_id || existingCourse.image.public_id,
        url: image?.url || existingCourse.image.url,
      }
    };

    // Update the course
    const course = await Course.updateOne({ _id: id }, updatedData);

    res.status(200).json({
      message: "Course updated successfully",
      course
    });

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const deleteCourse = async (req, res) => {
  const { id } = req.params;    
  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }     
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();      
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};



