import React from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";
import Form from "../components/Form";

const NewTaskpage: React.FC = () => {
  return (
    <div className="w-90 md:w-full mx-auto py-8 md:px-42.5 flex flex-col md:items-start gap-15 justify-center items-center mt-4">
      <div className="flex gap-2 md:gap-5 items-center w-full text-start ">
        <Link to="/" className="cursor-pointer">
          <FaChevronLeft className="text-[20px] md:text-[35px] text-[#292929]" />
        </Link>
        <h3 className="font-medium text-[20px] md:text-[50px] text-[#292929] ">
          New Task
        </h3>
      </div>

      <Form />
    </div>
  );
};

export default NewTaskpage;
