import mongoose from "mongoose";
import validator, { isLowercase } from "validator";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        isLowercase: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;