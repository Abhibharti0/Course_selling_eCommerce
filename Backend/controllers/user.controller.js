import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {z} from 'zod';
import jwt from "jsonwebtoken";
import config from "../config.js";


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


export const login = async (req,res) =>{
    const {email,password} = req.body;

    try{
         const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        } 
        //jwt token generation
        const token = jwt.sign(
           {id:user.id
           }, config.JWT_USER_PASSWORD,
           {expiresIn:'1d'});

           const cookieOptions = {
            expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
           };

           res.cookie("jwt", token,cookieOptions)
        res.status(200).json({message:"Login successful", user,token});
} catch(error){
    res.status(500).json({message:"Error in login"});
    console.log("error", error);
}
}


export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Error in logout" });
    console.log("error", error);
  } 
}