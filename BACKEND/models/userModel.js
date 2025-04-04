import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    requests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, required: true, enum: ["pending", "accepted", "rejected"] }, 
      },
    ],
    avatar: {type:String}
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
