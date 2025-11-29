import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req,res) =>{
    const {firstname,lastname,email,password} = req.body;

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