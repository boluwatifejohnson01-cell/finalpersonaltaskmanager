import React, { useState } from "react";
import { RiArrowDownWideFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTasks } from "../context/TaskContext";

const Form = () => {
  const navigate = useNavigate();
  const { createTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("Not Completed");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);

    // createTask sends POST /tasks, updates the list in context,
    // and shows its own success/error toast.
    const success = await createTask({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      tags: selectedTag,
      completed: status === "Completed",
    });

    setIsSubmitting(false);

    if (success) {
      navigate("/alltasks");
    }
  };

  const tags = ["Work", "Personal", "Urgent"];
  return (
    <form
      onSubmit={handleSubmit}
      className="w-90 md:w-full flex flex-col gap-12 pt-9"
    >
      <div className="flex flex-col gap-9 mx-auto">
        <div className="relative md:w-270 w-85">
          <label
            htmlFor=""
            className="absolute -top-4 md:-top-5 left-5 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal"
          >
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g Project Defense, Assignment ..."
            className="w-85 md:w-270 md:pb-7 pb-4 pt-2 pl-3 md:pt-4 md:pl-5  border border-[#B8B6B6] rounded-sm placeholder:text-[#CCCCCC] md:text-[22px] text-[16px] text-normal"
          />
        </div>

        <div className="relative md:w-270 w-85">
          <label
            htmlFor=""
            className="absolute -top-4 md:-top-5 left-5 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal"
          >
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your task..."
            className="w-85 md:w-270 md:pb-50 md:pt-6 pb-20 pt-2 pl-3  md:pl-5 border border-[#B8B6B6] rounded-sm placeholder:text-[#CCCCCC] md:text-[22px] text-[16px] text-normal"
          />
        </div>
        <div className="relative md:w-270 w-85">
          <label
            htmlFor=""
            className="absolute -top-4 md:-top-5 left-5 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal"
          >
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-85 md:w-270 md:pb-7 md:pt-4 md:pl-5 pb-5 pt-2 pl-3 border border-[#B8B6B6] text-[#CCCCCC] uppercase rounded-sm md:text-[22px] text-[16px] text-normal [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert-0"
          />
        </div>
        <div className="relative md:w-270 w-85">
          <label
            htmlFor="tags"
            className="absolute -top-4 md:-top-6 left-5 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal"
          >
            Tags
          </label>

          <input
            id="tags"
            type="text"
            placeholder="Work"
            value={selectedTag}
            readOnly
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-85 md:w-270 md:pb-9 md:pt-4 md:pl-5 pb-5 pt-2 pl-3 border border-[#B8B6B6] rounded-sm cursor-pointer text-[#9C9C9C] font-normal text-[16px] md:text-[22px] md:placeholder:text-[22px] placeholder:text-[16px]"
          />

          {isOpen && (
            <div className="absolute top-16 left-3 w-80 md:w-262 bg-white border border-[#B8B6B6] z-10">
              {tags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center gap-3 py-3 px-3 hover:bg-[#CCCCCC] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="tag"
                    value={tag}
                    checked={selectedTag === tag}
                    onChange={(e) => {
                      setSelectedTag(e.target.value);
                      setIsOpen(false);
                    }}
                    className="accent-purple-600 cursor-pointer"
                  />
                  <span className="text-[#9C9C9C] font-normal md:text-[22px] text-[16px]">
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <label
          htmlFor="status"
          className="absolute -top-4 md:-top-6 left-5 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal z-10"
        >
          Status
        </label>

        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-85 md:w-270 md:pb-9 md:pt-4 md:pl-5 pb-5 pt-2 pl-3 border border-[#B8B6B6] rounded-sm cursor-pointer text-[#9C9C9C] font-normal text-[16px] md:text-[22px] appearance-none bg-white"
        >
          <option value="Not Completed">Not Completed</option>
          <option value="Completed">Completed</option>
        </select>

        <RiArrowDownWideFill className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9C9C9C] pointer-events-none md:text-[28px] text-[20px]" />
      </div>

      <button
        type="submit"
        className="mx-auto bg-[#974FD0] md:w-270 w-85 py-1 rounded-lg md:text-[35px] text-[20px] font-medium text-[#FAF9FB]"
      >
        Done
      </button>
    </form>
  );
};

export default Form;
