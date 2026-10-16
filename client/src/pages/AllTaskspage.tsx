import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";
import { LuTrash2 } from "react-icons/lu";
import { useTasks } from "../context/TaskContext";

const AllTaskspage: React.FC = () => {
  // tasks, loading and all actions now come from the context
  const { tasks, loading, getAllTasks, searchTasks, updateTask, deleteTask } =
    useTasks();

  const [filter, setFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [search, setSearch] = useState("");
  const lastSearched = useRef("");

  const tags = ["Work", "Personal", "Urgent"];

  // Refresh the list when the page opens, so a leftover search result
  // from an earlier visit never shows up
  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  // Debounced server-side search
  useEffect(() => {
    const timer = setTimeout(() => {
      const term = search.trim();
      if (term === lastSearched.current) return; // nothing new to search
      lastSearched.current = term;
      searchTasks(term); // empty term reloads the full list
    }, 400);

    return () => clearTimeout(timer);
  }, [search, searchTasks]);

  // Status and tag filters run on whatever the context currently holds
  const visibleTasks = tasks.filter((t) => {
    const matchesStatus =
      filter === "All"
        ? true
        : filter === "Completed"
          ? t.completed
          : !t.completed;

    const matchesTag = tagFilter === "All" ? true : t.tags === tagFilter;

    return matchesStatus && matchesTag;
  });

  const toggleCompleted = (id: string, completed: boolean) => {
    updateTask(id, { completed: !completed });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this task?")) {
      deleteTask(id);
    }
  };

  const formatDate = (value?: string): string => {
    if (!value) return "No due date";
    const date = new Date(value);
    return isNaN(date.getTime()) ? "No due date" : date.toLocaleDateString();
  };

  return (
    <div>
      <div className="w-full py-8 px-20 flex flex-col gap-10">
        <div className="w-90 md:w-full flex flex-col items-start justify-between md:gap-6">
          <h3 className="font-medium text-[20px] md:text-[50px] text-[#292929] tracking-[0%]">
            My Tasks
          </h3>

          <div className="w-full flex items-center gap-6 md:justify-between">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-[#974FD0] rounded-lg px-3 py-1 text-[14px] md:text-[20px] md:w-150"
            />

            <div className="flex flex-col items-start gap-3 md:gap-5 md:flex-row md:items-center">
              <Link
                to="/newtask"
                className="flex gap-2 md:gap-4 items-center cursor-pointer"
              >
                <FiPlus className="text-[#974FD0] h-4 w-4 md:h-6 md:w-6" />
                <h5 className="text-[#974FD0] text-[16px] md:text-[24px] font-medium tracking-[0%]">
                  Add New Task
                </h5>
              </Link>

              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="border border-[#974FD0] text-[#974FD0] rounded-lg px-3 py-1 text-[14px] md:text-[20px] bg-white cursor-pointer"
              >
                <option value="All">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-[#974FD0] text-[#974FD0] rounded-lg px-3 py-1 text-[14px] md:text-[20px] bg-white cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Not Completed">Not Completed</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-[#9C9C9C] text-[16px] md:text-[24px]">
            Loading tasks...
          </p>
        )}

        {!loading && visibleTasks.length === 0 && (
          <p className="text-[#9C9C9C] text-[16px] md:text-[24px]">
            {tasks.length === 0 && !search.trim()
              ? "No tasks yet. Add one to get started."
              : "No tasks match your search or filters."}
          </p>
        )}

        {visibleTasks.map((task) => (
          <div
            key={task._id}
            className="border-[0.5px] border-[#B8B6B6] rounded-[10px] px-3 py-4"
          >
            <div className="flex flex-col gap-4">
              <div className="w-full flex justify-between items-end">
                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-10">
                  <p className="text-[#F38383] font-normal text-[14px] md:text-[24px] uppercase">
                    {task.tags}
                  </p>
                  <p className="text-[#974FD0] font-normal text-[14px] md:text-[24px]">
                    {formatDate(task.dueDate)}
                  </p>
                  <div className="flex gap-3 items-center">
                    <label
                      htmlFor={`done-${task._id}`}
                      className="text-[#974FD0] font-normal text-[14px] md:text-[24px]"
                    >
                      Completed
                    </label>
                    <input
                      id={`done-${task._id}`}
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompleted(task._id, task.completed)}
                      className="md:w-5 md:h-5 w-3 h-3 bg-white cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:flex-row md:gap-5">
                  <Link to={`/edittask/${task._id}`}>
                    <button className="flex gap-2.5 bg-[#974FD0] py-2.5 px-6.25 rounded-lg items-center cursor-pointer hover:bg-[#6B3399]">
                      <BiEdit className="text-[#FAF9FB] w-3 h-3 md:w-6 md:h-6" />
                      <p className="text-[#FAF9FB] font-medium text-[14px] md:text-[24px]">
                        Edit
                      </p>
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex gap-2.5 bg-[#FAF9FB] py-2.5 px-6.25 rounded-lg items-center border border-[#974FD0] cursor-pointer"
                  >
                    <LuTrash2 className="text-[#974FD0] w-3 h-3 md:w-6 md:h-6" />
                    <p className="text-[#974FD0] font-medium text-[14px] md:text-[24px]">
                      Delete
                    </p>
                  </button>
                </div>
              </div>

              <hr className="h-[0.5px] text-[#B8B6B6]" />

              <div className="flex flex-col gap-3 items-start">
                <h4 className="md:text-[35px] text-[20px] text-[#292929] tracking-[0%]">
                  {task.title}
                </h4>
                <p className="text-[#737171] md:text-[24px] text-[16px] font-normal leading-[120%] tracking-widest text-start">
                  {task.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mt-6">
          <a
            href="#"
            className="font-normal text-[20px] md:text-[26px] underline text-[#974FD0] cursor-pointer hover:text-[#6b3399]"
          >
            Back To Top
          </a>
        </div>
      </div>
    </div>
  );
};

export default AllTaskspage;
