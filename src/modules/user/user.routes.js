import express from 'express';
import { addUserByAdmin, adminLogin, adminUpdateUser, deleteUser, deleteUserByAdmin, getAllUsers, getStoreConfig, getUserProfile, login, signup, updateStoreCategories, updateUser } from './user.controller.js';
import { verifyToken } from '../../utilities/middleware/verfiyToken.js';
import { verifyAdmin } from '../../utilities/middleware/verifyAdmin.js';
import { verifyMerchant } from '../../utilities/middleware/verifyMerchant.js';

export const userRouters = express.Router();
userRouters.post('/signup', signup);
userRouters.post('/login', login);
userRouters.post('/adminlog', adminLogin);
userRouters.get('/store', getStoreConfig);
userRouters.get('/profile', verifyToken, getUserProfile);
userRouters.put('/update', verifyToken, updateUser);
userRouters.put('/store/categories', verifyToken, verifyMerchant, updateStoreCategories);
userRouters.delete('/delete', verifyToken, deleteUser);
userRouters.get('/user', verifyToken, verifyAdmin, getAllUsers);
userRouters.post('/admin/adduser', verifyToken, verifyAdmin, addUserByAdmin);
userRouters.put('/admin/update/:id', verifyToken, verifyAdmin, adminUpdateUser);
userRouters.delete('/admin/delete/:id', verifyToken, verifyAdmin, deleteUserByAdmin);
