import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
// import { mailtrapClient, sender } from '../mailtrap/mailtrap.config.js';  // Import Mailtrap Client and Sender
// import { VERIFICATION_EMAIL_TEMPLATE } from '../mailtrap/emailTemplates.js'; 

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

export const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User not found',
            });
        }

        // Generate reset token and expiry
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour from now

        // Save token in the database
        await user.save();

        // Send reset token to the user's email
        return res.status(200).json({
            success: true,
            msg: 'Password reset token sent successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// Controller: Reset Password
export const resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid or expired reset token',
            });
        }

        // Hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        // Save updated password
        await user.save();

        return res.status(200).json({
            success: true,
            msg: 'Password reset successful',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message,
        });
    }
};

// export const signup = async (req, res) => {
//     const { email, password, name } = req.body;

//     // Validate request
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             errors: errors.array(),
//         });
//     }

//     try {
//         if (!email || !password || !name) {
//             throw new Error("Please provide all the fields");
//         }

//         // Check if the user already exists
//         const userAlreadyExists = await User.findOne({ email });
//         if (userAlreadyExists) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//             });
//         }

//         // Hash the password
//         const hashedPassword = await bcryptjs.hash(password, 10);

//         // Generate a verification token
//         const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

//         // Create a new user
//         const user = new User({
//             email,
//             password: hashedPassword,
//             name,
//             verificationToken,
//             verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,  // 24 hours expiration
//         });

//         // Save the user
//         await user.save();

//         // Generate JWT token and set in cookies
//         const accessToken = jwt.sign(
//             { id: user._id, email: user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         // Prepare the verification email template with the token
//         const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationToken);

//         // Send the verification email
//         await mailtrapClient.send({
//             from: sender,
//             to: [{ email: user.email }],
//             subject: "Verify Your Email",
//             html: emailContent,  // Send the HTML template with the verification code
//         });

//         // Send response
//         res.status(201).json({
//             success: true,
//             message: "User created successfully. Verification email sent.",
//             user: {
//                 ...user._doc,
//                 password: undefined,  // Do not expose the password in the response
//             },
//             accessToken,  // Include the JWT token
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };






