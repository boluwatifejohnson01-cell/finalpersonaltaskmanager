export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: string;
  avatar: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  tags: "Urgent" | "Personal" | "Work";
  completed: boolean;
}
