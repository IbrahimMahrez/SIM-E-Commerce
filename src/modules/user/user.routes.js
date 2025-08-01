
import express from 'express'
import { addUserByAdmin, adminLogin, adminUpdateUser, deleteUser, deleteUserByAdmin, getAllUsers, getUserProfile, login, signup, updateUser, verifyAccount } from './user.controller.js'
import { checkEmail } from '../../utilities/middleware/checkEmail.js'
import { verifyToken } from '../../utilities/middleware/verfiyToken.js'
import { verifyAdmin } from '../../utilities/middleware/verifyAdmin.js'
import { allowAdminOnly } from '../../utilities/middleware/allowAdminOnly.js'


export const userRouters=express.Router()

userRouters.use(express.json())


// User routes
userRouters.post('/signup',checkEmail,signup)
userRouters.post('/login',login)
userRouters.get('/user/verify/:email', verifyAccount)
userRouters.get("/profile", verifyToken, getUserProfile);
userRouters.put('/update', verifyToken, updateUser);
userRouters.delete('/delete', verifyToken, deleteUser);




///admin routes
userRouters.get('/user', verifyToken,getAllUsers)
userRouters.post('/adminLog', adminLogin)
userRouters.delete('/admin/delete/:id', verifyToken, verifyAdmin, deleteUserByAdmin);
userRouters.put('/admin/update/:id', verifyToken, adminUpdateUser);
userRouters.post('/admin/adduser', verifyToken, allowAdminOnly, addUserByAdmin);