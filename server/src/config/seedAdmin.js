import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/admin.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@silverpath.com' });

        if (!existingAdmin) {
            // Create a new admin
            const newAdmin = new Admin({
                name: 'Achintha Bandara',
                email: 'achintha477@gmail.com',
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
        process.exit(1);
    }
};

seedAdmin();