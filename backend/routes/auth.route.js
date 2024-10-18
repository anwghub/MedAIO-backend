import express from  'express';
import { login, logout, signup , forgotPassword, resetPassword,verifyEmail} from '../controllers/auth.controller.js';
import { loginValidator, logoutValidator, registerValidator, forgotPasswordValidator, resetPasswordValidator } from '../helpers/validator.js';

const router = express.Router();

router.post("/signup",signup, registerValidator);

router.post("/login",login, loginValidator);

router.get("/logout",logout, logoutValidator);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword, forgotPasswordValidator);

router.post("/reset-password", resetPassword, resetPasswordValidator );


export default router;