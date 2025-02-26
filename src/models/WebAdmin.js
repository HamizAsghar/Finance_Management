import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const WebAdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
    faceImage: {
        type: String,
    },
    faceVerificationSetup: {
        type: Boolean,
        default: false,
    },
});

WebAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

WebAdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const WebAdmin = mongoose.models.WebAdmin || mongoose.model("WebAdmin", WebAdminSchema);

export default WebAdmin;