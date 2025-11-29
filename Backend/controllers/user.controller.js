import User from "../models/user.model.js";

export const signup = async (req,res) =>{
    const {firstname,lastname,email,password} = req.body;
    try{
      
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    const newUser = new User({
        firstname,
        lastname,
        email,
        password
    });
    await newUser.save();
    res.status(201).json({message:"User created successfully", user:newUser});
    }catch(error){
        console.error("error", error);
        res.status(500).json({message:"Server Error"});
    } 
};