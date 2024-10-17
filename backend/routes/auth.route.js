import express from  'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
import { loginValidator, logoutValidator, registerValidator } from '../helpers/validator.js';

const router = express.Router();

router.post("/signup",signup, registerValidator);

router.post("/login",login, loginValidator);

router.get("/logout",logout, logoutValidator);

export default router;