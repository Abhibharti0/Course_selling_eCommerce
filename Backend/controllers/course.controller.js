import Course from '../models/course.model.js';

export const createCourse = async (req, res) => {
  const { title, description, price, image } = req.body;
  console.log(req.body);

  try {
    // Validate required fields
    if (!title || !description || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const courseData = {
      title,
      description,
      price,
      image
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
