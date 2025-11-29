import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import {v2 as cloudinary} from 'cloudinary';

import courseRoutes from './routes/course.route.js';
import fileUpload from 'express-fileupload';

const app = express();
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
}));

const PORT = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL;

try {
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
}

//define routes
app.use('/api/courses', courseRoutes);


//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});