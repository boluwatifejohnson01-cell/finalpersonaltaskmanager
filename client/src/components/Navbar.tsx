import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/taskDuty logo.png";
import profilepic from "../assets/profile.pic.jpg";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const hideAvatar = ["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const allLinks = () => {
    return location.pathname === "/" && !user ? (
      <>
        <Link
          to="/login"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          Register
        </Link>
      </>
    ) : location.pathname === "/alltasks" ? (
      <>
        <Link
          to="/newtask"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          New Task
        </Link>
      </>
    ) : location.pathname === "/newtask" ? (
      <>
        <Link
          to="/alltasks"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          All Tasks
        </Link>
      </>
    ) : location.pathname.startsWith("/edittask") ? (
      <>
        <Link
          to="/alltasks"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          All Tasks
        </Link>
      </>
    ) : user && location.pathname === "/" ? (
      <div className="flex flex-col md:flex-row md:gap-8 gap-4 mt-2">
        <Link
          to="/newtask"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          New Task
        </Link>
        <Link
          to="/alltasks"
          className="text-white md:text-[#292929] md:font-semibold text-[16px] md:text-[22px] cursor-pointer"
        >
          All Tasks
        </Link>
      </div>
    ) : null;
  };
  return (
    <nav className="mx-auto w-90 md:w-360 md:px-15 h-20 bg-white border-b-2 flex items-center justify-between px-4">
      <Link to="/" className="flex items-center gap-1">
        <img src={logo} alt="" />
        <h3 className="text-[24px] md:text-[28px] font-bold text-[#2D0050] font-signika">
          TaskDuty
        </h3>
      </Link>

      <div className="relative" ref={menuRef}>
        <div
          className="cursor-pointer md:hidden"
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          {open ? (
            <MdCancel className="text-[#2D0050] text-[30px]" />
          ) : (
            <RxHamburgerMenu className="text-[#2D0050] text-[30px]" />
          )}
        </div>

        <div
          className={`w-40 md:w-full h-60 bg-[#2D0050] md:bg-transparent md:flex-row md:relative md:top-0 flex flex-col items-start md:items-center md:h-20 md:gap-10 justify-between absolute top-14 z-40 right-0 md:scale-x-100 p-3 ${open ? "scale-x-100" : "scale-x-0"} `}
        >
          <div className="flex flex-col md:flex-row md:gap-8 gap-4 mt-2">
            {allLinks()}
          </div>
          {user && (
            <div
              className={`w-10 h-10 md:w-15 md:h-15 rounded-full bg-white border-white md:border-black border-2 md:border-3 overflow-hidden ${hideAvatar ? "hidden" : "block"}`}
            >
              <img src={user.avatar || profilepic} alt="" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
