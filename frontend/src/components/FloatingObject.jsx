import React, { useState, useEffect } from "react";

const FloatingObject = () => {
  const [position, setPosition] = useState({ top: "30%", left: "50%" });

  useEffect(() => {
    const moveObject = () => {
      setPosition({
        top: `${Math.random() * 60}%`,
        left: `${Math.random() * 80}%`, 
      
      });
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
        width: "4px",
        height: "4px",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "30%",
        transition: "top 5s ease-in-out, left 10s ease-in-out",
      }}
      className="animate-pulse"
    ></div>
  );
};

export default FloatingObject;
