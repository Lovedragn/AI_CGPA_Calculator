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
        width: "10px",
        height: "10px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        transition: "top 3s ease-out, left 10s ease-in",
      }}
    ></div>
  );
};

export default FloatingObject;
