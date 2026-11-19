"use client";

import { useEffect, useState } from "react";

// Renders the build year, then updates to the visitor's current year (static-export safe).
export default function Year() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span suppressHydrationWarning>{year}</span>;
}
