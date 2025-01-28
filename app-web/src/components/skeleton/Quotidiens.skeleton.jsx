import React from "react";

export default function QuotidiensSkeleton() {
  return Array.from(Array(20).keys()).map((_, i) => (
    <div key={i} role="status" className="max-w-sm animate-pulse">
      <div className="w-28 h-36 bg-[var(--ion-color-light)] rounded-lg mb-4"></div>
      <span className="sr-only">Loading...</span>
    </div>
  ));
}
