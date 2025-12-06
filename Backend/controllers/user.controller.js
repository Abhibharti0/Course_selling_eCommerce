import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from 'zod';
import jwt from "jsonwebtoken";
import config from "../config.js";
import Purchase from "../models/purchase.model.js";
import Course from "../models/course.model.js";


export const signup = async (req,res) =>{
    const {firstname,lastname,email,password} = req.body;

     const userSchema = z.object({
    firstname: z.string().min(3, { message: "First name must be atleast 3 char long" }),
    lastname: z.string().min(3, { message: "Last name  must be atleast 3 char long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  });

  const validation = userSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.issues.map((err)=> err.message) });
  }

    const hashedPassword = await bcrypt.hash(password,10);
    try{
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const newUser = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({message:"User created successfully", user:newUser});
    }catch(error){
        console.error("error", error);
        res.status(500).json({message:"Server Error"});
    } 
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, config.JWT_USER_PASSWORD, { expiresIn: "1d" });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error in login" });
  }
};



export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Error in logout" });
  }
};




export const mycourse = async (req, res) => {
    const userId= req.userId;

    try {
        const purchased = await Purchase.find({userId})

        let purchasedCoursesid = [];

        for (let i = 0; i < purchased.length; i++) {
            purchasedCoursesid.push(purchased[i].courseId);

           
        }
         const courseData = await Course.find({_id:{ $in: purchasedCoursesid }});
        res.status(200).json({ purchased,courseData });
}catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Server Error" });
}
};