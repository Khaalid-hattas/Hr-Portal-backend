import * as authModel from '../models/authModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username and password were provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user by username
        const user = await authModel.getUserByUsername(username);

        // User does not exist
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Compare entered password with hashed password in database
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        // Password is incorrect
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Login successful
        res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export {
    login
};
