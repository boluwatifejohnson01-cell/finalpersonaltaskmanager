import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/heroImage.png";

const Homepage: React.FC = () => {
  return (
    <header className="flex flex-col items-center">
      <div className="w-90 md:w-360 mx-auto flex flex-col gap-15 md:flex-row items-center md:justify-between py-15 md:py-25 px-20">
        <div className="flex flex-col items-center md:items-start gap-8 md:gap-5 md:w-133.75 w-90 md:text-start text-center ">
          <h1 className="font-medium text-[30px] md:text-[50px] leading-[120%] tracking-[0%] text-[#292929] ">
            Manage your Tasks on{" "}
            <span className="text-[#974FD0]">TaskDuty</span>
          </h1>

          <p className="font-normal text-[18px] md:text-[24px] leading-[120%] tracking-[0%] text-[#737171] text-center md:text-start ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus,
            sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea
            tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl
            semper porttitor. Nec accumsan.
          </p>

          <Link to="/alltasks">
            <button className="py-2.5 px-6.25 text-[#FAF9FB] bg-[#974FD0] rounded-lg text-center font-medium text-[24px] cursor-pointer ">
              Go to My Tasks
            </button>
          </Link>
        </div>

        <img src={heroImg} alt="" className="" />
      </div>
    </header>
  );
};

export default Homepage;
