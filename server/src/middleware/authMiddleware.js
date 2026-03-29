import jwt from 'jsonwebtoken';
import Admin from '../models/admin';

const authMiddleware = async (req, res, next) => {
    try {
        
        // Check if token is provided in the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access denied. Unauthorized' });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin user by ID from token
        const admin = await Admin.findById(decoded.id).select('-password');
        if(!admin) return res.status(401).json({ success: false, message: 'Admin not found' });



    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
        }
        
        console.error('Authentication error:', error);
        return res.status(401).json({ success: false, message: 'Access denied. Unauthorized' });
    }
};

export default authMiddleware;