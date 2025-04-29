import React, { useState, useEffect } from "react";

const FloatingObject = () => {
  const [position, setPosition] = useState({ top: "30%", left: "50%" });

  useEffect(() => {
    const moveObject = () => {
      setPosition({
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
      });
    };

    const interval = setInterval(moveObject, 3000); // Change position every 3s
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 0,
        filter: "blur(30px)", // Blur the object itself
        top: position.top,
        left: position.left,
        width: "100px",
        height: "100px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        transition: "top 3s ease-in-out, left 1s ease-in-out",
      }}
    ></div>
  );
};

export default FloatingObject;
