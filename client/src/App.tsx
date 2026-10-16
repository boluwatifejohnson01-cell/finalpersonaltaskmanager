import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import AllTaskspage from "./pages/AllTaskspage";
import NewTaskpage from "./pages/NewTaskpage";
import Editpage from "./pages/Editpage";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthContext";
import TaskProvider from "./context/TaskContext";
import Registerpage from "./pages/Registerpage";
import Loginpage from "./pages/Loginpage";

function App() {
  return (
    <>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#FFFFFF",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "14px",
                },

                success: {
                  iconTheme: {
                    primary: "D87D4A",
                    secondary: "#FFFFFF",
                  },
                },
              }}
            />
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/alltasks" element={<AllTaskspage />} />
              <Route path="/newtask" element={<NewTaskpage />} />
              <Route path="/register" element={<Registerpage />} />
              <Route path="/login" element={<Loginpage />} />
              <Route path="/edittask/:id" element={<Editpage />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </>
  );
}

export default App;
