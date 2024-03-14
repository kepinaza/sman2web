import express from 'express';
import {
    Register,
    Login,
    LogOut,
    Me
} from "../controllers/Auth.js";
import {
    hasLoginCantMakeAcc
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/dashboard/me', Me);
router.post('/dashboard/register', hasLoginCantMakeAcc, Register);
router.post('/dashboard/login', Login);
router.delete('/dashboard/logout', LogOut);

export default router;