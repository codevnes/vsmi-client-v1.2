"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (client side)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      
      // Set the initial value
      setMatches(media.matches);

      // Define a listener function
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add the listener to media query list
      media.addEventListener("change", listener);

      // Clean up
      return () => {
        media.removeEventListener("change", listener);
      };
    }
  }, [query]);

  return matches;
}

// Common media query breakpoints
export const breakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
}; 