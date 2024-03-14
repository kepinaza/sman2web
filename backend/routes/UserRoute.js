import express from 'express';
import {
    getUsers,
    getUserById,
    createUsers,
    updateUsers,
    deleteUsers,
    // Register
} from "../controllers/Users.js"
import {
    verifyUser,
    adminOnly
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/dashboard/users', verifyUser, adminOnly, getUsers);
router.get('/dashboard/users/:id', verifyUser, adminOnly, getUserById); //GET USER BY ID CAN SEE BY ORDINARY USER
router.post('/dashboard/add/users', verifyUser, adminOnly, createUsers);  
router.patch('/dashboard/edit/users/:id', verifyUser, adminOnly, updateUsers);
router.delete('/dashboard/delete/users/:id', verifyUser, adminOnly, deleteUsers);

export default router;