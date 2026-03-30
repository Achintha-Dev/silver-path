import jwt from 'jsonwebtoken'
import Admin from '../models/admin.js'

// Generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Private
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        // Check password using bcrypt method on model
        const isMatch = await admin.comparePassword(password)
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

        const token = generateToken(admin._id);
        return res.status(200).json({ 
            success: true, 
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            } 
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

// @desc    register admin
// @route   POST /api/auth/register
// @access  Private
export const registerAdmin = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) return res.status(400).json({ success: false, message: 'Please provide email, password and name' });

        const adminExists = await Admin.findOne({ email });
        if (adminExists) return res.status(400).json({ success: false, message: 'Admin already exists' });

        const admin = await Admin.create({
            email,
            password,
            name
        });

        const token = generateToken(admin._id);
        return res.status(201).json({ 
            success: true, 
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            } 
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}