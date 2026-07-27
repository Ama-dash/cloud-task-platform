// Import required packages
const bcrypt = require("bcrypt");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

// Register User
const register = async (req, res) => {

  
    // Get data from request body
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into database
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword]
        );

        // Send success response
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });

    }

};

const login = async (req, res) => {
    
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            message:  "Email and password are required"
        });
    }

    try {

        //find user by email
        const result = await pool.query(
             "SELECT * FROM users WHERE email = $1",
            [email]
        )

         // Check if user exists
         if (result.rows.length === 0) {
            return res.status(400).json({
            message:  "Invalid Email or Password"
        });
            
         }

        const user = result.rows[0];

        //compare entered password wit ased password

        const passwordMatch = await bcrypt.compare(
            //password comes from user and user.password comes from database
            password,
            user.password

        );

        if (!passwordMatch) {
            return res.status(400).json({
            message:  "Invalid Email or Password"
        });
                    
        }

         // Create JWT token
         //We store user information usin secret key

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:  "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });


        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Export the register function
module.exports = {
    register,
    login
};