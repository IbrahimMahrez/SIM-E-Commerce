import { userModel } from "../../../db/modules/user.model.js"

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { sendMail } from "../../utilities/email/sendMail.js"




/////get all users for admin
let getAllUsers = async (req, res) => {
  try {
        const users = await userModel.find({}, { password: 0 });
    res.status(200).json({
      message: "All users fetched successfully",
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};
/////signup for user

let signup = async (req, res) => {
  
    const hashed = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hashed;
    const result = await userModel.insertOne(req.body);
    req.body.password = undefined;
        sendMail(req.body.email)

    res.status(201).json({ message: "User registered successfully , plz confirm email",result});
    res.status(500).json({ message: "Registration failed", error: error.message });
  
};


//////////login for user
let login = async (req, res) => {
  const foundedUser = await userModel.findOne({ email: req.body.email });
  if (!foundedUser)
    return res.status(400).json({ message: "Email or password not correct" });
  const match = bcrypt.compareSync(req.body.password, foundedUser.password);
  if (!match)
    return res.status(400).json({ message: "Email or password not correct" });
  if (!foundedUser.isConfirmed)
    return res.status(401).json({ message: "Please confirm your email first" });
  let token = jwt.sign(
    { _id: foundedUser._id, role: foundedUser.role },"SIM7");
  res .status(200).json({ message: `Welcome ${foundedUser.username}`, token });
};


//////////login for admin
let adminLogin = async (req, res) => {
  try {
    const foundedUser = await userModel.findOne({
      email: req.body.email,
      role: "admin" 
    });
    if (!foundedUser) {
      return res.status(401).json({ message: "email or password not correct" });
    }
    if (req.body.password !== foundedUser.password) {
      return res.status(401).json({ message: "email or password not correct" });
    }
    const token = jwt.sign(
      { _id: foundedUser._id, role: foundedUser.role },"SIM7");
    res.status(200).json({message: `Welcome  ${foundedUser.username}`,token,});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


/////get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.decoded._id; // جاي من التوكن
    const user = await userModel.findOne({ _id: userId }, { password: 0 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User profile", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
///////update user profile
const updateUser = async (req, res) => {
  try {
    const userId = req.decoded._id; 
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" }); 
    }
    updatedUser.password = undefined;
    res.status(200).json({
      message: "User updated successfully", user: updatedUser,});
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};


// Delete user account
const deleteUser = async (req, res) => {
  try {
    const userId = req.decoded._id;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account", error: error.message });
  }
};
///delete user by admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
///admin update user
const adminUpdateUser = async (req, res) => {
  try {
    if (req.decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const { id } = req.params;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    updatedUser.password = undefined;
    res.status(200).json({
      message: "User updated by admin successfully",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Admin update failed", error: error.message });
  }
};



///// Add user by admin
const addUserByAdmin = async (req, res) => {
  try {
    const { username, email, password, age, role } = req.body;
    if (!username || !email || !password || !age) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      age,
      role: role || 'user',      
      isConfirmed: true          
    });
    newUser.password = undefined;
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to add user", error: error.message });
  }
};


const verifyAccount = (req,res)=>{
    jwt.verify(req.params.email,"SIMmail", async(err,decoded)=>{
        if(err) return res.status(403).json({message:"Invalid email"})
            
        await userModel.findOneAndUpdate({email:decoded.email},{isConfirmed:true})
        res.json({message:"Hello i'm from verify"})
        
    })

   
}
export {
     getAllUsers ,
     signup,
     login,
     adminLogin,
      verifyAccount,
      getUserProfile,
      updateUser,
      deleteUser,
      deleteUserByAdmin,
      adminUpdateUser,
      addUserByAdmin

}