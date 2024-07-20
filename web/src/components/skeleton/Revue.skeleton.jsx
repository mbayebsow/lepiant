import React from "react";

export default function RevueSkeleton() {
  return Array.from(Array(3).keys()).map((_, i) => (
    <div key={i} role="status" className="max-w-sm animate-pulse">
      <div className="bg-[var(--ion-color-light)] rounded-lg w-[150px] h-[55px] mb-4"></div>
      <span className="sr-only">Loading...</span>
    </div>
  ));
}
