import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../types/indexServer";
import Task from "../models/Task";

// ---- CREATE TASK ----
// POST /api/tasks
export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { title, description, dueDate, tags, completed } = req.body;

    // completed is a boolean, so check it against undefined (false is valid)
    if (
      !title ||
      !description ||
      !dueDate ||
      !tags ||
      completed === undefined
    ) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const task = await Task.create({
      user: req.user._id, // link the task to its owner
      title,
      description,
      dueDate,
      tags,
      completed,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error", error);
    res.status(500).json({ message: "Server error creating task" });
  }
};

// ---- GET ALL TASKS ----
// GET /api/tasks
export const getAllTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error", error);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
};

// ---- GET TASKS BY TAG ----
// GET /api/tasks/tag/:tag
export const getTaskByTags = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const validTags = ["Urgent", "Personal", "Work"] as const;
    const input = (req.params.tag as string).toLowerCase();

    // match case-insensitively, but keep the original capitalization
    const tag = validTags.find((t) => t.toLowerCase() === input);

    if (!tag) {
      res.status(400).json({ message: "Invalid Tag" });
      return;
    }

    const tasks = await Task.find({ user: req.user._id, tags: tag }).sort({
      createdAt: -1,
    });

    // an empty list is a valid result, not a 404
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks by tag error", error);
    res.status(500).json({ message: "Server error fetching tasks by tags" });
  }
};

// ---- GET TASKS BY COMPLETED ----
// GET /api/tasks/completed/:completed
export const getTaskByCompleted = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const { completed } = req.params;

    if (completed !== "true" && completed !== "false") {
      res.status(400).json({ message: "Completed must be 'true' or 'false'" });
      return;
    }

    const tasks = await Task.find({
      user: req.user._id,
      completed: completed === "true",
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks by completed error", error);
    res
      .status(500)
      .json({ message: "Server error fetching tasks by completed" });
  }
};

// ---- UPDATE TASK ----
// PUT /api/tasks/:id
export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      res.status(400).json({ message: "Invalid Task Id" });
      return;
    }

    // only find the task if it belongs to the logged-in user
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Update only the fields that were sent
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.dueDate = req.body.dueDate ?? task.dueDate;
    task.tags = req.body.tags ?? task.tags;
    task.completed = req.body.completed ?? task.completed;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update task error", error);
    res.status(500).json({ message: "Server error updating task" });
  }
};

// ---- DELETE TASK ----
// DELETE /api/tasks/:id
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id as string)) {
      res.status(400).json({ message: "Invalid Task Id" });
      return;
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await task.deleteOne();
    // 200 (not 204), because 204 responses must not have a body
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
};

// ---- SEARCH TASKS ----
// GET /api/tasks/search?q=keyword
export const searchTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    // the frontend sends "q"; "search" is also accepted
    const keyword = req.query.q ?? req.query.search;

    const filter: Record<string, unknown> = { user: req.user._id };

    if (typeof keyword === "string" && keyword.trim()) {
      // escape regex special characters so user input can't break the query
      const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    // always respond, even with no keyword (returns all of the user's tasks)
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Search task error", error);
    res.status(500).json({ message: "Failed to search tasks" });
  }
};
