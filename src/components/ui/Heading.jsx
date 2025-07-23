import React from "react";

const Heading = ({ children, className = "" }) => {
  return <h1 className={`text-2xl font-bold text-gray-800 dark:text-gray-200 ${className}`}>{children}</h1>;
};

export default Heading;
