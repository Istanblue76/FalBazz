"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Force instant scroll behavior to bypass browser queuing delays
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    if (distance === 0) return;
    let startTime: number | null = null;

    // easeOutQuad: responsive start, graceful deceleration
    const easeOutQuad = (t: number) => {
      return t * (2 - t);
    };

    const step = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / 8000, 1);
      window.scrollTo(0, startPosition + easeOutQuad(progress) * distance);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 bg-transparent ${
        isScrolled
          ? "py-3"
          : "py-5"
      }`}
    >
      <div className="flex justify-between items-center w-full px-5 md:px-[120px] max-w-full mx-auto">
        {/* Brand Logo */}
        <a 
          className="hover:opacity-85 transition-opacity" 
          href="#"
        >
          <img 
            src="/assets/logo.webp" 
            alt="FalBaz Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </a>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex gap-12 items-center">
          <button 
            className="text-on-surface-variant hover:text-secondary transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none outline-none" 
            onClick={() => handleNavClick("ai-analysis")}
          >
            Fal Bak
          </button>
          <button 
            className="text-on-surface-variant hover:text-secondary transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none outline-none" 
            onClick={() => handleNavClick("tarihce")}
          >
            Tarihçe
          </button>
          <button 
            className="text-on-surface-variant hover:text-secondary transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none outline-none" 
            onClick={() => handleNavClick("horoscopes")}
          >
            Burçlar
          </button>
          <button 
            className="text-on-surface-variant hover:text-secondary transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none outline-none" 
            onClick={() => handleNavClick("details")}
          >
            Ritüeller
          </button>
        </nav>

        {/* Trailing Icons */}
        <div className="flex gap-3 items-center">
          <button 
            className="p-3 rounded-full text-secondary hover:bg-primary-container/20 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="History"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
          </button>
          <button 
            className="p-3 rounded-full text-secondary hover:bg-primary-container/20 transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Account"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
