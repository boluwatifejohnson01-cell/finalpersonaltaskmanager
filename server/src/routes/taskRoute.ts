import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskByCompleted,
  getTaskByTags,
  searchTask,
  updateTask,
} from "../controller/taskController";

const router = express.Router();

//Create Task Route
router.post("/task", createTask);

// Get All Task Route
router.get("/alltasks", getAllTasks);

//Get Tasks by Tag
router.get("/task/:tag", getTaskByTags);

//Get Tasks by Tag
router.put("/edittask/:id", updateTask);

//Get Tasks by Completed
router.get("/completed/:completed", getTaskByCompleted);

//Search Task by Keyword
router.get("/searchtask", searchTask);

//Delete Task
router.delete("/alltasks/:id", deleteTask);

export default router;
