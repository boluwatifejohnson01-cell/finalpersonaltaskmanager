import type { Task } from "../types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
  useCallback,
} from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "./AuthContext";

interface TaskInput {
  title: string;
  description: string;
  dueDate: string;
  tags: string;
  completed: boolean;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  createTask: (input: TaskInput) => Promise<boolean>;
  getAllTasks: () => Promise<void>;
  updateTask: (id: string, updates: Partial<TaskInput>) => Promise<boolean>;
  searchTasks: (query: string) => Promise<void>;
  deleteTask: (id: string) => Promise<boolean>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof AxiosError
    ? (error.response?.data?.message ?? fallback)
    : fallback;

interface TaskProviderProps {
  children: ReactNode;
}

const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // GET ALL
  const getAllTasks = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load tasks"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks when a user logs in, clear them on logout
  useEffect(() => {
    if (user) {
      getAllTasks();
    } else {
      setTasks([]);
    }
  }, [user, getAllTasks]);

  // CREATE
  const createTask = async (input: TaskInput): Promise<boolean> => {
    try {
      const { data } = await api.post<Task>("/tasks", input);
      setTasks((prev) => [data, ...prev]);
      toast.success("Task created");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create task"));
      return false;
    }
  };

  // UPDATE
  const updateTask = async (
    id: string,
    updates: Partial<TaskInput>,
  ): Promise<boolean> => {
    try {
      const { data } = await api.put<Task>(`/tasks/${id}`, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update task"));
      return false;
    }
  };

  // SEARCH
  const searchTasks = useCallback(
    async (query: string): Promise<void> => {
      const trimmed = query.trim();

      // empty search -> go back to the full list
      if (!trimmed) {
        await getAllTasks();
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get<Task[]>("/tasks/search", {
          params: { q: trimmed },
        });
        setTasks(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Search failed"));
      } finally {
        setLoading(false);
      }
    },
    [getAllTasks],
  );

  // DELETE
  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete task"));
      return false;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        createTask,
        getAllTasks,
        searchTasks,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

export default TaskProvider;
