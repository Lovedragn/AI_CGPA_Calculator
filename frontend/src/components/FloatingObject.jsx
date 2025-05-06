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
        width: "4px",
        height: "4px",
        background: "rgba(255, 255, 255, 0.3)",
        transition: "top 5s ease-in-out, left 10s ease-in-out, border-radius 3s ease-in-out",
      }}
      className={`shadow-lg shadow-blue-500 mix-blend-lighten  ${isCircle ? "rounded-full animate-pulse" : "rounded-[1px] animate-ping"}`}
    ></div>
  );
};

export default FloatingObject;
