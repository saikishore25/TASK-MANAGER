import express from "express"
const router = express.Router();
import { createTask, deleteTask, getAllAssignedTasks, getAllTasks, getStatistics, togglePinTask, updateTask } from "../controllers/taskController.js";
import upload from "../multer.js";

router.post("/create-task",upload.single("attachments"), createTask);
router.post("/get-all-tasks", getAllTasks);
router.delete("/delete-task/:taskID/:userID", deleteTask);
router.post("/get-statistics", getStatistics);
router.post("/toggle-pin-task", togglePinTask);
router.post("/get-assigned-tasks", getAllAssignedTasks)
router.put("/update-task/:id",upload.single("attachments"), updateTask);

export default router;