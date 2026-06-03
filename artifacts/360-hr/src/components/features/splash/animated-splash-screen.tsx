"use client";

import { useEffect, useState, useCallback } from "react";

import { BrandLogo } from "@/components/shared/brand-logo";

interface AnimatedSplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

const DEFAULT_DURATION = 2500;
const FADE_OUT_DURATION = 500;

/**
 * Animated splash screen that shows after login before dashboard.
 * Features fade-in and scale animation for the logo.
 */
export function AnimatedSplashScreen({ 
  onComplete, 
  duration = DEFAULT_DURATION 
}: AnimatedSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleAnimationEnd = useCallback(() => {
    if (!isVisible) {
      setShouldRender(false);
      onComplete?.();
    }
  }, [isVisible, onComplete]);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - FADE_OUT_DURATION);

    const cleanupTimer = setTimeout(() => {
      if (!isVisible) {
        setShouldRender(false);
        onComplete?.();
      }
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(cleanupTimer);
    };
  }, [duration, isVisible, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
      role="presentation"
    >
      <div
        className={`will-change-transform ${
          isVisible 
            ? "animate-[scaleIn_0.8s_ease-out_forwards]" 
            : "animate-[fadeOut_0.5s_ease-in_forwards]"
        }`}
        onAnimationEnd={handleAnimationEnd}
      >
        <BrandLogo />
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}