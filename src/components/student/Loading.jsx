import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full border-t-4 border-t-blue-400 w-16 sm:w-20 border-4 border-gray-300 aspect-square"></div>
    </div>
  );
};

export default Loading;
