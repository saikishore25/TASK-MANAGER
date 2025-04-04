import express from "express"
import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose"


export const createTask = async (req, res) => {
    try {
        let { title, content, priority, status, assignedTo, createdBy, inputTagArray, progress } = req.body;

        console.log("Task Data:", { title, content, priority, status, assignedTo, createdBy, inputTagArray, progress });

        if (!title || !content || !createdBy) {
            return res.status(400).json({ message: "Title, Content, and CreatedBy are required fields" });
        }

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        let assignedToObjectIDs;
        if(assignedTo.length> 0){

            // ✅ Parse assignedTo if it's a JSON string
            if (typeof assignedTo === "string") {
                try {
                    assignedTo = JSON.parse(assignedTo);
                } catch (error) {
                    return res.status(400).json({ message: "Invalid assignedTo format" });
                }
            }
    
            console.log("Formatted assignedTo:", assignedTo);
    
            if (!Array.isArray(assignedTo)) {
                return res.status(400).json({ message: "AssignedTo must be an array" });
            }
    
            // ✅ Fetch users based on assigned usernames
            const assignedUsers = await userModel.find({ username: { $in: assignedTo } }).select("_id");
    
            console.log("Assigned Users Found:", assignedUsers);
    
            if (assignedUsers.length === 0) {
                console.log("No users found with the given usernames")
    
            }
    
            assignedToObjectIDs= assignedUsers.map(user => user._id);
            console.log("Assigned ObjectIDs:", assignedToObjectIDs);

        }

        progress = Number(progress);
        if (progress < 0 || progress > 100) {
            return res.status(400).json({ message: "Progress must be between 0 and 100" });
        }

        if (typeof inputTagArray === "string") {
            try {
                inputTagArray = JSON.parse(inputTagArray);
            } catch (error) {
                return res.status(400).json({ message: "Invalid inputTagArray format" });
            }
        }

        // ✅ Create and save the task
        const task = await taskModel.create({
            title,
            content,
            priority,
            status,
            assignedTo: assignedToObjectIDs,
            createdBy,
            inputTagArray,
            progress
        });

        console.log("Task Created Successfully");
        return res.json({ message: "Task Created Successfully", task });

    } 
    
    catch(error){

        console.error("Failed to Add Task", error);
        return res.status(500).json({ message: "Failed to Add Task" });
    }
};



export const getAllTasks = async (req, res) => {
    try {
        const { userID } = req.body;
        console.log("User ID:", userID); 

        const tasks = await taskModel.find({ createdBy: userID }).lean(); // `lean()` optimizes query
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No Task Found" });
        }

        // Fetch assigned user names for each task
        const updatedTasks = await Promise.all(
            tasks.map(async (task) => {
                const assignedUsers = await userModel.find({ _id: { $in: task.assignedTo } }).select("username");
                return {
                    ...task,
                    assignedTo: assignedUsers.map(user => user.username) // Replace ObjectIds with names
                };
            })
        );

        console.log("All Tasks Found", updatedTasks);
        return res.status(200).json({ message: "All Tasks Found", tasks: updatedTasks });

    } catch (error) {
        console.error("Error fetching task:", error);
        return res.status(500).json({ message: "Failed to retrieve tasks", error: error.message });
    }
};


export const deleteTask = async (req, res)=>{

    try{

        const {taskID, userID} = req.params;
        if(!taskID || !userID){

            console.log("Task ID and User ID required");
            return res.json({message:"Task ID and User ID required"});

        }

        console.log(taskID, userID);

        const deleteTask = await taskModel.findOneAndDelete({_id:taskID, createdBy:userID});

        if(!deleteTask){

            console.log("Couldn't find task")
            return res.status(404).json({ message: "Task not found or not authorized to delete" });
        }

        return res.status(200).json({ message: "Task deleted successfully"});
    
    }

    catch(error){

        console.error("Failed to delete Task:", error);
        return res.status(500).json({ message: "Failed to delete Task" });
    
        
    }

}


export const togglePinTask = async(req, res)=>{

    try{

        const {taskID} = req.body;
        if(!taskID){

            console.log("Task ID required");
            return res.json({message:"Task ID required"});

        }

        console.log(taskID);

        const task = await taskModel.findOne({_id: taskID});

        if(!task){

            console.log("No Task Found");
            return res.json({message:"No task Found"});

        }
        console.log(task);

        task.isPinned = !task.isPinned;

        await task.save();

        console.log("Task after update:", task);

        return res.json({ message: "Task pinned status updated"});

    }

    catch(error){

        console.log("Failed to Pin/Unpin Task");
        return res.json({message:"Failed to Pin/Unpin Task"});


    }
}

export const getStatistics = async(req, res)=>{

    try{

        const {userID} = req.body;
        
        if(!mongoose.Types.ObjectId.isValid(userID)){

            return res.status(400).json({ message: "Invalid User ID" });
        }

        const userid = new mongoose.Types.ObjectId(userID);

        const stats = await taskModel.find({ createdBy: userid }).select("priority status");

        if(stats.length == 0){

            console.log("Unable to Fetch Stats")
            return res.json({message:"Unable to Fetch Stats"});

        }

        return res.json({message:"Successfully Fetched Statistics", statistics: stats})

    }

    catch(error){

        console.log("Failed to Fetch Stats", error);
        return res.json({message:"Failed to Fetch Stats"});


    }
}

export const getAllAssignedTasks = async (req, res) => {
    try {
        const { userID } = req.body; // Use params instead of body

        if (!userID) {
            console.log("User ID required from");
            return res.status(400).json({ message: "User ID empty" });
        }

        console.log("Fetching assigned tasks for user:", userID);

        // Fixing the query
        const assignedTasks = await taskModel.find({ assignedTo: { $in: [userID] } });

        if (assignedTasks.length === 0) {
            console.log("No Assigned Tasks");
            return res.status(404).json({ message: "No Assigned Tasks", assignedTasks: [] });
        }

        console.log("Assigned Tasks:", assignedTasks);
        return res.status(200).json({ message: "Assigned Tasks Found", assignedTasks });

    } catch (error) {
        console.error("Failed to fetch Assigned Tasks", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateTask = async (req, res)=>{

    try{
        const { id } = req.params; // Get task ID from URL
        const {
            title,
            content,
            priority,
            status,
            progress,
            assignedTo,
            inputTagArray,
        } = req.body;

        const updatedFields = {
            title,
            content,
            priority,
            status,
            progress,
            inputTagArray: JSON.parse(inputTagArray),
        };

        // Parse assignedTo if it's a JSON string
        if(assignedTo){

            updatedFields.assignedTo = JSON.parse(assignedTo);
        }

        // Check if there's an attachment file
        if(req.file){

            updatedFields.attachments = req.file.path; // Assuming you're using multer for file uploads
        }

        // Update task in database
        const updatedTask = await taskModel.findByIdAndUpdate(id, updatedFields, { new: true });

        if(!updatedTask){

            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task:updatedTask });
    } 
    
    catch(error){

        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}