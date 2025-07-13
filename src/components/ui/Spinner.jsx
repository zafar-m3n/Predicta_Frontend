import React from "react";

const Spinner = ({ color = "accent" }) => {
  const borderColor = color === "white" ? "border-white" : "border-accent";

  return (
    <div className="flex justify-center items-center">
      <div className={`w-8 h-8 border-4 border-t-transparent ${borderColor} rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
