const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

function validateUserData(data) {
    if (!data.name || !data.email || !data.password) {
        return "Name, email and password are required.";
    }

    if (!data.email.includes("@")) {
        return "Invalid email address.";
    }

    if (data.password.length < 6) {
        return "Password must be at least 6 characters.";
    }

    return null;
}

exports.registerUser = async (req, res) => {
    try {
        const validationError = validateUserData(req.body);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const existingUser = await User.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || "User"
        });

        const savedUser = await newUser.save();

        sendRegistrationEmail(
            savedUser.email,
            savedUser.name
        ).catch((emailError) => {
            console.log(
                "Email sending failed, but user was registered:",
                emailError.message
            );
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};

async function sendRegistrationEmail(userEmail, userName) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Welcome to CryptoXchange",
            html: `
                <h2>Welcome ${userName}</h2>
                <p>Your CryptoXchange account was created successfully.</p>
            `
        });

        console.log("Registration email sent successfully");
    } catch (error) {
        console.log("Email sending error:", error.message);
    }
}