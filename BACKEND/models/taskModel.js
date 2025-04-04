import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

    title: { type: String, required: true },
    content: { type: String, required: true},
    priority: {type:String, enum:["Low", "Medium", "High"], default:"Medium"},
    status: {type:String, enum:["Pending", "In Progress", "Completed"], default:"Pending"},
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: {type:mongoose.Schema.Types.ObjectId},
    attachments: {type:String},     
    inputTagArray: { type: Array},
    progress: {type:Number, default:0},
    date: {type:Date, default:Date.now},
    isPinned: {type:Boolean, default: false}

},  { timestamps: true })

const taskModel = mongoose.model("task", taskSchema);

export default taskModel;