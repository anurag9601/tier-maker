import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        required: true
    }
}, { timestamps: true });

const UsersModel = mongoose.models.Users || mongoose.model("Users", UsersSchema);

export default UsersModel;