import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/emailService.js";

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "10d" }
    );
};

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000
    });
};

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// ================= REGISTER USER =================

export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Please provide all required fields"
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already in use"
            });
        }

        // Generate OTP
        const otp = generateOTP();

        const otpExpiry = new Date(
            Date.now() + 5 * 60 * 1000
        );

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            otp,
            otpExpiry
        });

        // Email message
        const message = `
Your OTP for verification is: ${otp}

This OTP is valid for 5 minutes.
`;

        // Send email
        try {

            await sendEmail({
                email: user.email,
                subject: "Email Verification OTP",
                message
            });

        } catch (error) {

            console.log(
                "Email sending error:",
                error.message
            );

        }

        return res.status(201).json({
            message:
                "User registered successfully. OTP sent to email.",
            userId: user._id,
            email: user.email
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
};

// ================= LOGIN USER =================

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {

            return res.status(400).json({
                error: "Email and password are required"
            });

        }

        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });

        }

        // Check verification
        if (!user.isVerified) {

            return res.status(401).json({
                error: "Please verify your email first"
            });

        }

        // Compare password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {

            return res.status(401).json({
                error: "Invalid credentials"
            });

        }

        // Generate token
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }

};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {

    try {

        const { userId, otp } = req.body;

        // Validation
        if (!userId || !otp) {

            return res.status(400).json({
                error: "User ID and OTP are required"
            });

        }

        // Validate OTP format
        if (!/^\d{6}$/.test(otp)) {

            return res.status(400).json({
                error: "OTP must be a 6-digit number"
            });

        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                error: "User not found"
            });

        }

        // Already verified
        if (user.isVerified) {

            const token = generateToken(user._id);
            setTokenCookie(res, token);

            return res.status(200).json({
                message: "User already verified",
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        }

        // Check OTP exists
        if (!user.otp || !user.otpExpiry) {

            return res.status(400).json({
                error: "No OTP found. Please register again."
            });

        }

        // Check OTP expiry
        if (Date.now() > user.otpExpiry.getTime()) {

             await User.findByIdAndDelete(user._id);

            return res.status(400).json({
                error: "OTP has expired. Please register again."
            });

        }

        // Verify OTP
        if (user.otp !== otp) {

            return res.status(400).json({
                error: "Invalid OTP"
            });

        }

        // Mark verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        // Generate token
        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(200).json({
            message: "Email verified successfully",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );

        return res.status(500).json({
            error: error.message
        });

    }

};

// ================= GET CURRENT USER =================

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        return res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};

// ================= LOGOUT USER =================

export const logoutUser = async (_req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    return res.status(200).json({
        message: "Logout successful"
    });
};
