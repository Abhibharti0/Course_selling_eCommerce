import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import courseRoutes from './routes/course.route.js';

const app = express();
dotenv.config();


app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});