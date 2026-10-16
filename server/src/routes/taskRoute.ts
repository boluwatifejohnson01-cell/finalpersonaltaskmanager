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
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Specific paths first, so they are never mistaken for "/tasks/:id"

// Search tasks by keyword: GET /api/tasks/search?q=...
router.get("/tasks/search", protect, searchTask);

// Tasks by tag: GET /api/tasks/tag/Work
router.get("/tasks/tag/:tag", protect, getTaskByTags);

// Tasks by completed status: GET /api/tasks/completed/true
router.get("/tasks/completed/:completed", protect, getTaskByCompleted);

// Get all tasks: GET /api/tasks
router.get("/tasks", protect, getAllTasks);

// Create task: POST /api/tasks
router.post("/tasks", protect, createTask);

// Update task: PUT /api/tasks/:id
router.put("/tasks/:id", protect, updateTask);

// Delete task: DELETE /api/tasks/:id
router.delete("/tasks/:id", protect, deleteTask);

export default router;
