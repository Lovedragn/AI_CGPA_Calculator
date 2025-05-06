import React, { useState, useEffect } from "react";

const FloatingObject = () => {
  const [position, setPosition] = useState({ top: "30%", left: "50%" });
  const [isCircle, setIsCircle] = useState(false);

  useEffect(() => {
    const moveObject = () => {
      setPosition({
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 80}%`,
      });
      setIsCircle((prev) => !prev); // Toggle between box and circle
    };

    const interval = setInterval(moveObject, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 0,
        top: position.top,
        left: position.left,
        width: "7px",
        height: "7px",
        background: "rgba(255, 255, 255, 0.2)",
        transition: "top 5s ease-in-out, left 10s ease-in-out, border-radius 1s ease-in-out",
      }}
      className={`animate-pulse ${isCircle ? "rounded-full" : "rounded-none"}`}
    ></div>
  );
};

export default FloatingObject;
