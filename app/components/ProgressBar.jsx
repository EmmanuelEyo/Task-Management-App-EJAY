import React from "react";

const ProgressBar = ({ completedPercentage }) => {
  return (
    <div className="w-full mt-2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-in-out"
        style={{ width: `${completedPercentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
