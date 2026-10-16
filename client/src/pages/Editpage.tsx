import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTasks } from "../context/TaskContext";

const Editpage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, loading, getAllTasks, updateTask } = useTasks();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // initialized: the form has been filled from the task (done only once,
  // so later list updates never overwrite what the user is typing)
  const [initialized, setInitialized] = useState<boolean>(false);
  // loadedOnce: the fetch finished, so "not found" is a real answer
  const [loadedOnce, setLoadedOnce] = useState<boolean>(false);

  const tags = ["Work", "Personal", "Urgent"];

  const task = tasks.find((t) => t._id === id);

  // Fetch tasks on mount. This also covers a page refresh on /edittask/:id,
  // where the context starts out empty.
  useEffect(() => {
    let active = true;
    getAllTasks().finally(() => {
      if (active) setLoadedOnce(true);
    });
    return () => {
      active = false;
    };
  }, [getAllTasks]);

  // Fill the form once the task is available
  useEffect(() => {
    if (initialized || !task) return;

    setTitle(task.title);
    setDescription(task.description ?? "");
    // <input type="date"> needs "YYYY-MM-DD", but the API sends a full ISO string
    setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setSelectedTag(task.tags ?? "");
    setCompleted(task.completed ?? false);
    setInitialized(true);
  }, [task, initialized]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setIsSubmitting(true);

    const success = await updateTask(id, {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      tags: selectedTag,
      completed,
    });

    setIsSubmitting(false);

    if (success) {
      toast.success("Task updated");
      navigate("/alltasks");
    }
  };

  // Task doesn't exist (wrong id, or it belongs to another user)
  if (!task && !initialized && loadedOnce && !loading) {
    return (
      <div className="w-full py-8 px-42.5 flex flex-col items-center mt-4">
        <p className="text-[#292929] text-[24px]">Task not found.</p>
        <Link to="/alltasks" className="text-[#974FD0] underline mt-4">
          Back to all tasks
        </Link>
      </div>
    );
  }

  // Still loading, or waiting for the form to be filled
  if (!initialized) {
    return (
      <div className="w-full py-8 flex justify-center mt-4">
        <p className="text-[#9C9C9C] text-[16px] md:text-[24px]">
          Loading task...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto w-90 md:w-full py-8 px-5 md:px-42.5 flex flex-col gap-15 justify-center items-center mt-4 ">
        <div className="flex gap-5 items-center w-85 md:w-full text-start ">
          <Link to="/alltasks" className="cursor-pointer">
            <FaChevronLeft className="text-[20px] md:text-[35px] text-[#292929]" />
          </Link>
          <h3 className="font-medium text-[25px] md:text-[50px] text-[#292929] ">
            Edit Task
          </h3>
        </div>

        <form className="w-90 md:w-full" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-5 ">
            {/* ==============COMPLETED=============== */}
            <label className="flex items-center gap-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-4 h-4 md:w-6 md:h-6 accent-[#974FD0] cursor-pointer"
              />
              <span className="text-[#292929] font-normal text-[16px] md:text-[22px]">
                Mark as completed
              </span>
            </label>

            <div className="relative w-90 md:w-full mb-12">
              <input
                id="taskTitle"
                type="text"
                placeholder="Project Completion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-85 md:w-full border border-[#B8B6B6] rounded-[5px] px-10 pt-5 pb-4 md:px-14 md:pt-8.75 md:pb-6 text-[#292929] outline-none placeholder:text-[#292929] md:text-[22px] placeholder:text-[16px] md:placeholder:text-[22px] placeholder:font-normal focus:border-[#974FD0]"
              />
              <label
                htmlFor="taskTitle"
                className="absolute left-12 -top-4 md:-top-5 bg-white px-2 text-[#9C9C9C] text-[20px] md:text-[30px]"
              >
                Task Title
              </label>
            </div>

            <div className="relative w-90 md:w-full mb-12">
              <textarea
                id="description"
                rows={7}
                placeholder="Describe the task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-85 md:w-full border border-[#B8B6B6] rounded-[5px] px-9 pt-5 pb-5 md:px-14 md:pt-6.75 md:pb-6 text-[#292929] outline-none placeholder:text-[#292929]  placeholder:text-[16px] md:placeholder:text-[22px] placeholder:font-normal focus:border-[#974FD0] md:text-[22px] resize-none"
              ></textarea>
              <label
                htmlFor="description"
                className="absolute left-12 -top-4 md:-top-5 bg-white px-2 text-[#9C9C9C] text-[20px] md:text-[30px]"
              >
                Description
              </label>
            </div>

            <div className="relative w-90 md:w-full mb-12">
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-85 md:w-full border border-[#B8B6B6] rounded-[5px] px-9 pt-5 pb-5 md:px-14 md:pt-8.75 md:pb-6 text-[#292929] outline-none focus:border-[#974FD0] md:text-[22px]"
              />
              <label
                htmlFor="dueDate"
                className="absolute left-12 -top-4 md:-top-5 bg-white px-2 text-[#9C9C9C] text-[20px] md:text-[30px]"
              >
                Due Date
              </label>
            </div>

            <div className="relative w-90 md:w-270">
              <label
                htmlFor="tags"
                className="absolute -top-4 md:-top-6 left-14 md:px-2 bg-[#FFFFFF] text-[20px] md:text-[30px] text-[#9C9C9C] text-normal"
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
                className="w-85 md:w-340 pl-10 pb-6 pt-3 md:pb-9 md:pt-4 md:pl-14 border border-[#B8B6B6] rounded-sm cursor-pointer text-[#292929] font-normal md:text-[22px] placeholder:text-[22px] placeholder:text-[#292929]"
              />
              {isOpen && (
                <div className="absolute top-16 left-5 md:left-3 w-80 md:w-335 bg-white border border-[#B8B6B6] z-10">
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
                      <span className="text-[#292929] font-normal text-[16px] md:text-[22px]">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#974FD0] cursor-pointer hover:bg-[#6B3399] text-white text-[20px] md:text-2xl font-semibold py-4 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Done"}
            </button>

            <div className="text-center mt-12">
              <a
                href="#"
                className="font-normal text-[20px] md:text-[26px] underline text-[#974FD0] cursor-pointer hover:text-[#6b3399] "
              >
                Back To Top
              </a>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Editpage;
