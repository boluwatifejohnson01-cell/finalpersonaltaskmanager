import mongoose, { Schema } from "mongoose";
import { Task } from "../types/indexServer";

const taskSchema = new Schema<Task>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is Required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      lowercase: true,
    },

    dueDate: {
      type: Date,
      required: [true, "Date is Required"],
    },

    tags: {
      type: String,
      required: [true, "Tags are required"],
      enum: {
        values: ["Urgent", "Personal", "Work"],
        message: "Tags can only be Urgent, Personal, Work",
      },
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model<Task>("Task", taskSchema);

export default Task;
