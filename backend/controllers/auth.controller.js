import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    try {
        if (!email || !password || !name) {
            throw new Error("Please provide all the fields");
        }

        // Check if the user already exists
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate a verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,  // 24 hours expiration
        });

        // Save the user
        await user.save();

        // Generate JWT token and set in cookies
        generateTokenAndSetCookie(res, user._id);

        // Send response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,  // Do not expose the password in the response
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Validation errors',
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(401).json({
                success: false,
                msg: 'Email or password is incorrect',
            });
        }

        // Compare password
        const isPasswordMatch = await bcryptjs.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Email or password is incorrect',
            });
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { id: userData._id, email: userData.email },
            process.env.JWT_SECRET, // Ensure this is in your .env file
            { expiresIn: '1h' }
        );

        // Send success response with the token
        return res.status(200).json({
            success: true,
            msg: 'Login successful!',
            tokenType: 'Bearer',
            accessToken,
            user: {
                ...userData._doc,
                password: undefined, // Don't expose the password in the response
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// export const signup  = async (req, res) => {
//     const { email, password, name } = req.body;
//     try {
//         if(!email || !password || !name){
//             throw new Error("Please provide all the fields");
//         }

//         const userAlreadyExists = await User.findOne({ email });
//         console.log("userAlreadyExists", userAlreadyExists);

//         if(userAlreadyExists){
//             return  res.status(400).json({success:false, message: "User already exists" });
//         }
//         const hashedPassword = await bcryptjs.hash(password, 10);
//         const verificationToken =  Math.floor(100000 + Math.random() * 900000).toString();
//         const user = new User({ 
//             email, 
//             password: hashedPassword, 
//             name, verificationToken,
//             verificationTokenExpiresAt:  Date.now() + 24 * 60 *  60 * 1000 
//         });

//         await user.save();

//         //jwt
//         generateTokenAndSetCookie(res,user._id);

//         //sendV

//         res.status(201).json({
//             success: true,
//             message: "User created successfully",
//             user: {
//                 ...user._doc,
//                 password: undefined,
//             },
//         });

//     }catch(error){
//         res.status(400).json({success:false,message: error.message});
//     }
// }

// export const login  = async (req, res) => {
//     res.send("Login route");
// }


export const logout = async (req, res) => {
    try {
        // Invalidate the token by clearing it on the client side
        res.status(200).json({
            success: true,
            msg: 'Logout successful!',
            token: null 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Logout failed',
        });
    }
};

