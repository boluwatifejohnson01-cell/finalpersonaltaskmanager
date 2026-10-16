import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Registerpage: React.FC = () => {
  const { register, user } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] =
    useState<boolean>(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name should be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.trim().length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Re-type your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitting = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
      );

      if (success) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const field: {
    label: string;
    name: keyof typeof formData;
    type: string;
    placeholder: string;
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
  }[] = [
    {
      label: "Full Name",
      name: "name",
      type: "text",
      placeholder: "Lawal Akannii",
      icon: <FiUser className="text-black/30 text-base" />,
    },
    {
      label: "Email Address",
      name: "email",
      type: "text",
      placeholder: "akannii@gmail.com",
      icon: <FiMail className="text-black/30 text-base" />,
    },
    {
      label: "Password",
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "*******",
      icon: <FiLock className="text-black/30 text-base" />,
      rightIcon: showPassword ? (
        <FiEyeOff className="text-black/30 text-base" />
      ) : (
        <FiEye className="text-black/30 text-base" />
      ),
      onRightIconClick: () => setShowPassword((prev) => !prev),
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: showConfirmedPassword ? "text" : "password",
      placeholder: "********",
      icon: <FiLock className="text-black/30 text-base" />,
      rightIcon: showConfirmedPassword ? (
        <FiEyeOff className="text-black/30 text-base" />
      ) : (
        <FiEye className="text-black/30 text-base" />
      ),
      onRightIconClick: () => setShowConfirmedPassword((prev) => !prev),
    },
  ];
  return (
    <div className="flex flex-col mx-auto items-center mt-10">
      <div className="flex gap-2 pt-15 items-center">
        <p className="text-[40px] text-black font-bold sm:text-[16px]  uppercase md:text-[40px]">
          TaskDuty
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center w-100 md:w-200 md:items-start md:mx-auto">
        <form
          action=""
          onSubmit={handleSubmitting}
          className="flex flex-col gap-4 mx-auto md:items-center md:grid md:grid-cols-2  md:gap-8"
        >
          {errors.form && (
            <p className="text-sm text-red-500 text-center">{errors.form}</p>
          )}

          {field.map(
            ({
              label,
              name,
              type,
              placeholder,
              icon,
              rightIcon,
              onRightIconClick,
            }) => {
              return (
                <div key={name} className="mx-auto w-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={name}
                      className={`text-xs font-bold ${errors[name] ? "text-red-500" : "text-[#0c0114]"}`}
                    >
                      {label}
                    </label>
                    {errors[name] && (
                      <span className="text-xs text-red-500">
                        {errors[name]}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-3 w-full border rounded-lg px-6 py-4 transition-colors focus-within:border-[#2D0050] ${errors[name] ? "border-red-500" : "border-[#CFCFCF]"}`}
                  >
                    {icon}
                    <input
                      id={name}
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="flex-1 text-sm font-bold text-[#0c0114] placeholder:text-gray-400 outline-none bg-transparent"
                    />
                    {rightIcon && (
                      <button
                        type="button"
                        onClick={onRightIconClick}
                        className="text-[#0c0114] hover:text-[#2D0050] transition-colors"
                        tabIndex={-1}
                      >
                        {rightIcon}
                      </button>
                    )}
                  </div>
                </div>
              );
            },
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2D0050] text-white p-2 uppercase font-bold hover:bg-[#0c0114] hover:text-white transition-colors duration-200 cursor-pointer py-4 px-8 md:w-205 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-start gap-3 mx-auto">
          <p className="text-[14px] font-normal text-black text-start">
            By signing up, you agree to our{" "}
            <span className="text-[#2D0050] cursor-pointer hover:text-[#0c0114]">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#2D0050] cursor-pointer hover:text-[#0c0114]">
              Privacy Policy.
            </span>
          </p>

          <p className="text-[14px] font-normal text-black">
            Already Registered?{" "}
            <Link to="/login" className="text-[#2D0050] hover:text-[#0c0114]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;
