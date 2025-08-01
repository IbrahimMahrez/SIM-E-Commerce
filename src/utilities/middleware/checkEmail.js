import { userModel } from "../../../db/modules/user.model.js";



export const checkEmail =async(req, res, next)=>{
    const check = await userModel.findOne({ email: req.body.email });
    if (check) return res.status(400).json({ message: "User already registered. Please login." });
    next();



}