import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin";

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@silverpath.com' });

        if (!existingAdmin) {
            // Create a new admin
            const newAdmin = new Admin({
                name: 'Silver Path Admin',
                email: 'admin@silverpath.com',
                password: 'Admin@12345'  
            });
            await newAdmin.save();

            console.log('Admin seeded successfully');
            process.exit(0);
            
        } else {
            console.log('Admin already exists');
            process.exit(1);
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
        process.exit(1);
    }
};