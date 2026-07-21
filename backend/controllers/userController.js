// import User from "../models/UserModel.js";
// import validator from "validator";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = 'your_jwt_secret_here123'; // Replace with your own secret key
// const TOKEN_EXPIRATION = '24h'; // Token expiration time

// const createToken = (userId) =>
//     jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });


// // REGISTER A USER
// export async function registerUser(req, res) {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         });
//     }
//     if (!validator.isEmail(email)) {
//         return res.status(400).json({
//             success: false,
//             message: "Please enter a valid email."
//         })
//     }
//     if (password.length < 8) {
//         return res.status(400).json({
//             success: false,
//             message: "Password must be atleast of 8 characters."
//         });
//     }
//     try {
//         if (await User.findOne({ email })) {
//             return res.status(409).json({
//                 success: false,
//                 message: "User already present"
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({ name, email, password: hashedPassword });
//         const token = createToken(user._id);
//         res.status(201).json({
//             success: true,
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     }

//     catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// }

// // to login a user
// export async function loginUser(req, res) {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "Both fields are required."
//         });
//     }

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//             const match = await bcrypt.compare(password, user.password);

//             if (!match) {
//                 return res.status(401).json({
//                     success: false,
//                     message: "Invalid email or password"
//                 });
//             }
//             const token = createToken(user._id);

//             res.json({
//                 success: true,
//                 token,
//                 user: {
//                     id: user._id,
//                     name: user.name,
//                     email: user.email
//                 }
//             });

//         }

//     }

//     catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// }

// // to get login user details
// export async function getCurrentUser(req, res) {
//     try {
//         const user = await User.findById(req.user.id).select("name email");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }
//         res.json({
//             success: true,
//             user
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// }

// // to update a user profile
// export async function updateProfile(req, res) {
//     const { name, email } = req.body;

//     if (!name || !email || !validator.isEmail(email)) {
//         return res.status(400).json({
//             success: false,
//             message: "Valid email and name are required."
//         });
//     }

//     try {
//         const exists = await User.findOne({
//             email,
//             _id: { $ne: req.user.id }
//         });

//         if (exists) {
//             return res.status(409).json({
//                 success: false,
//                 message: "Email already in use."
//             });
//         }

//         const user = await User.findByIdAndUpdate(
//             req.user.id,
//             { name, email },
//             {
//                 new: true,
//                 runValidators: true,
//                 select: "name email"
//             }
//         );
//         res.json({
//             success: true,
//             user
//         });

//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }

// }

// // to change user password
// export async function updatePassword(req, res) {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword || newPassword.length < 8) {
//         return res.status(400).json({
//             success: false,
//             message: "Password invalid or too short."
//         });
//     }

//     try {
//         const user = await User.findById(req.user.id).select("password");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }
//         const match = await bcrypt.compare(currentPassword, user.password);

//         if (!match) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Current Password is incorrect."
//             });
//         }
//         user.password = await bcrypt.hash(newPassword, 10);
//         await user.save();

//         res.json({
//             success: true,
//             message: "Password changed"
//         });

//     } 
    
//     catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// }

import User from "../models/UserModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here123";
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "24h";

const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION }
    );
};

// ================= REGISTER =================

export async function registerUser(req, res) {
    console.log("===== REGISTER API CALLED =====");
    console.log(req.body);

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters."
            });
        }

        console.log("Checking existing user...");
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already present"
            });
        }

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Creating user...");
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log("Generating token...");
        const token = createToken(user._id);

        console.log("Sending response...");

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Register Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// ================= LOGIN =================

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Both fields are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = createToken(user._id);

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// ================= CURRENT USER =================

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// ================= UPDATE PROFILE =================

export async function updateProfile(req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email || !validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Valid email and name are required."
            });
        }

        const exists = await User.findOne({
            email,
            _id: { $ne: req.user.id }
        });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "Email already in use."
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            {
                new: true,
                runValidators: true
            }
        ).select("name email");

        return res.json({
            success: true,
            user
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

// ================= UPDATE PASSWORD =================

export async function updatePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword || newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password invalid or too short."
            });
        }

        const user = await User.findById(req.user.id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        return res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}