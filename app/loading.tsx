import React from "react";
import { HashLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <HashLoader size={100} color="#ffffff" />
    </div>
  );
};

export default Loading;
