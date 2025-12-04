import Course from '../models/course.model.js';
import Purchase from '../models/purchase.model.js';
import { v2 as cloudinary } from 'cloudinary';
import Stripe from "stripe";
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

// ------------------------- CREATE COURSE -------------------------
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { image } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFormats.includes(image.mimetype)) {
      return res.status(400).json({ message: "Only jpg, jpeg and png are allowed" });
    }

    const upload = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "courses",
    });

    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: upload.public_id,
        url: upload.secure_url,
      },
      creatorId: adminId,
    });

    return res.status(201).json({ message: "Course created", course });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------- UPDATE COURSE -------------------------
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const existingCourse = await Course.findOne({ _id: id, creatorId: adminId });
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    const updatedData = {
      title,
      description,
      price,
      image: {
        public_id: image?.public_id || existingCourse.image.public_id,
        url: image?.url || existingCourse.image.url,
      },
    };

    await Course.updateOne({ _id: id }, updatedData);

    return res.status(200).json({ message: "Course updated successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------- DELETE COURSE -------------------------
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;

  try {
    const deleted = await Course.findOneAndDelete({ _id: id, creatorId: adminId });

    if (!deleted) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    return res.status(200).json({ message: "Course deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------- GET ALL COURSES -------------------------
export const getAllCourses = async (_, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json({ courses });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json({ course });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------- CREATE PAYMENT INTENT -------------------------
export const createPaymentIntent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100,  // price in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      course,
    });

  } catch (err) {
    console.error("PAYMENT INTENT ERROR:", err);
    return res.status(500).json({ message: "Failed to create payment intent" });
  }
};

// ------------------------- BUY COURSE -------------------------
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ errors: "Course already purchased" });
    }

    // ❌ REMOVE PAYMENT INTENT CREATION HERE
    // ❌ DO NOT create paymentIntent in buy route

    const newPurchase = new Purchase({
      userId,
      courseId,
    });

    await newPurchase.save();

    return res.status(201).json({
      message: "Course purchased successfully",
      newPurchase,
    });

  } catch (error) {
    console.error("Purchase error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
