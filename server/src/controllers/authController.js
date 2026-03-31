import jwt from 'jsonwebtoken'
import Admin from '../models/admin.js'

// Generate JWT token
const generateToken = (admin) => {
  return jwt.sign(
    { id },
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

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')

    return res.status(200).json({
      success: true,
      data: admin
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc Logout admin (handled on frontend by deleting token, but can be used for server-side session management if needed)
// @route POST /api/auth/logout
// @access Private
export const logoutAdmin = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}