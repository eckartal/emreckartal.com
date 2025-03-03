"use client";

import { useState, useEffect } from "react";

export default function SplashCursor() {
  const [splashes, setSplashes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isMoving, setIsMoving] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(0);

  useEffect(() => {
    let timeout;
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      
      // Update mouse position
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      setLastMoveTime(currentTime);

      // Add splash with some throttling (not on every tiny movement)
      const distance = Math.hypot(
        e.clientX - mousePosition.x,
        e.clientY - mousePosition.y
      );
      
      if (distance > 5) {
        setSplashes((prevSplashes) => [
          ...prevSplashes,
          {
            id: currentTime,
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 15 + 10, // Random size between 10-25px
          },
        ]);
      }

      // Set timer to check if mouse has stopped moving
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    };

    // Clean up splashes after they animate
    const cleanupSplashes = () => {
      setSplashes((prevSplashes) => 
        prevSplashes.filter(splash => {
          return Date.now() - splash.id < 700; // Remove splashes older than 700ms
        })
      );
      animationFrameId = requestAnimationFrame(cleanupSplashes);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(cleanupSplashes);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <>
      {/* Always visible cursor dot */}
      <div
        className="cursor-dot"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      
      {/* Splash effects */}
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="splash"
          style={{
            left: `${splash.x}px`,
            top: `${splash.y}px`,
            width: `${splash.size}px`,
            height: `${splash.size}px`,
          }}
        />
      ))}

      <style jsx global>{`
        body {
          cursor: none;
        }
        
        .cursor-dot {
          position: fixed;
          width: 10px;
          height: 10px;
          background-color: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9999;
          transition: width 0.1s, height 0.1s;
        }

        .splash {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 9998;
          background-color: rgba(0, 0, 0, 0.15);
          animation: splash 0.7s ease-out forwards;
        }

        @keyframes splash {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .cursor-dot {
            background-color: rgba(255, 255, 255, 0.6);
          }
          .splash {
            background-color: rgba(255, 255, 255, 0.15);
          }
        }
      `}</style>
    </>
  );
}
