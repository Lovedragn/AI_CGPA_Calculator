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
      setIsCircle((prev) => !prev);
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
        width: "5px",
        height: "5px",
        transition: "top 12s ease-out, left 12s ease-in-out, border-radius 5s ease-in-out",
      }}
      className={` from-transparent to-white ${
        isCircle ? "bg-gradient-to-b rounded-full animate-spin delay-1000 opacity-80" : "bg-radial rounded animate-ping delay-1000 ease-out scale-150 opacity-50"
      }`}
      
    ></div>
  );
};

export default FloatingObject;
