import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Loginpage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname || "/";

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await login(email, password); // the useEffect navigates on success
    setIsSubmitting(false);
  };
  return (
    <div>
      {" "}
      <div className="flex flex-col mx-auto items-center mt-10">
        <div className="flex gap-2 pt-15 items-center">
          <p className="text-[40px] text-black font-bold sm:text-[16px]  uppercase md:text-[40px]">
            TaskDuty
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 items-center w-100 md:w-200 md:items-start md:mx-auto">
          <div>
            <h1 className="font-bold text-black uppercase text-[24px]">
              Welcome Back
            </h1>
          </div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 md:items-center md:gap-8"
          >
            <div className="flex flex-col items-start">
              <label htmlFor="">Email</label>
              <div className="flex items-center gap-3 w-full border border-[#CFCFCF] rounded-lg px-6 py-2 transition-colors focus-within:border-green-950 ">
                <FiMail className="text-black/30 text-base shrink-0" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(event) => {
                    return setEmail(event.target.value);
                  }}
                  placeholder="akannii@gmail.com"
                  className="w-90 md:w-200 px-4 py-2 placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-normal"
                />
              </div>
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="">Password</label>

              <div className="flex items-center gap-3 w-full border border-[#CFCFCF] rounded-lg px-6 py-2 transition-colors focus-within:border-[#2D0050] ">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    return setPassword(event.target.value);
                  }}
                  placeholder="********"
                  className=" w-90 md:w-200 px-4 py-2 placeholder:text-[15px] placeholder:text-gray-500 placeholder:font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-black/30 hover:text-[#2D0050] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff className="text-base" />
                  ) : (
                    <FiEye className="text-base" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#2D0050] text-black p-2 uppercase font-bold cursor-pointer md:w-100 hover:bg-[#0c0115] hover:text-white"
            >
              {isSubmitting ? "Signing In...." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-start gap-3">
            <p className="text-[14px] font-normal text-black text-start">
              New Here?{" "}
              <Link
                to="/register"
                className="text-[#2D0050] cursor-pointer hover:text-[#08000e]"
              >
                Create Account
              </Link>
            </p>

            <p className="text-[14px] font-normal text-black cursor-pointer hover:text-[#2D0050]">
              Home ←
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
