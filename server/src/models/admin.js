import mongoose from "mongoose";
import validator from "validator";  
import bcrypt from "bcryptjs";

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

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)  // cost factor 10 
  next()
})

// Compare password method
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;