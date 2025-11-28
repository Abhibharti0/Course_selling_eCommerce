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
