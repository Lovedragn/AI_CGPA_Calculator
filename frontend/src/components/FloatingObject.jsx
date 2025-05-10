import React, { useState, useEffect } from "react";

const FloatingObject = () => {
  const [position, setPosition] = useState({ top: "30%", left: "50%" });
  const [isCircle, setIsCircle] = useState(false);

  useEffect(() => {
    const moveObject = () => {
      setPosition({
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 90}%`,
      });
      setIsCircle((prev) => !prev); // Toggle between box and circle
    };

    const interval = setInterval(moveObject, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 0,
        top: position.top,
        left: position.left,
        width: "3px",
        height: "3px",
        transition: "top 12s ease-out, left 12s ease-in-out, border-radius 5s ease-in-out",
      }}
      className={` from-transparent to-white  transition-transform duration-1000 ${
        isCircle ? "bg-conic rounded-full animate-spin" : "bg-radial rounded-[1px] scale-150 opacity-40 animate-pulse"
      }`}
      
    ></div>
  );
};

export default FloatingObject;
