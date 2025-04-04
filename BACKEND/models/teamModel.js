import mongoose from "mongoose"

const TeamSchema = new mongoose.Schema({
    
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }

});

const teamModel = mongoose.model("team", TeamSchema);
export default teamModel;
