import Course from '../models/course.model.js';
import Purchase from '../models/purchase.model.js';
import {v2 as cloudinary} from 'cloudinary';


export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  console.log("adminId in createCourse:", adminId);
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
      },
      creatorId: adminId,
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
  const adminId = req.adminId;
 
  const { id } = req.params; // this is the actual ID sent

  const { title, description, price, image } = req.body;

  try {
    // Get existing course first (so fallback image works)
    const existingCourse = await Course.findOneAndUpdate({ _id: id, creatorId: adminId });
if (!existingCourse) {
  return res.status(404).json({ message: "Course not found or not authorized" });
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
    const course = await Course.updateOne({ _id: id,creatorId:adminId }, updatedData);

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
  const adminId = req.adminId;
  const { id } = req.params;    
  try {
    const course = await Course.findOneAndDelete({_id: id, creatorId: adminId});

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



export const getCourseById = async (req, res) => {
  const { id } = req.params;    
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    } 
    res.status(200).json({ course });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  } 
};



export const buyCourses = async (req, res) => {
  
  const {userId}= req;
  const { courseId } = req.params;
  
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({  userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ errors: "Course already purchased" });
    } 
    const newPurchase = new Purchase({
       userId,
      courseId,
    });
    await newPurchase.save();
    return res.status(200).json({
      message: "Course purchased successfully",
       newPurchase
    });

  }  catch (errors) {
    console.error("Purchase error:", errors);
    return res.status(500).json({ message: "Server Error" });
  }
};
