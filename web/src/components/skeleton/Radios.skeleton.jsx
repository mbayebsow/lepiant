import React from "react";

export default function RadiosSkeleton() {
  return Array.from(Array(20).keys()).map((_, i) => (
    <div key={i} role="status" className="w-full animate-pulse px-3 mb-1 flex gap-5 items-center">
      <div className="bg-gray-200 rounded-full dark:bg-gray-700 w-12 h-12"></div>
      <div className="w-full flex flex-col gap-3 h-auto">
        <div className="bg-gray-200 rounded-lg dark:bg-gray-700 w-20 h-2"></div>
        <div className="bg-gray-200 rounded-lg dark:bg-gray-700 w-full h-2"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  ));
}
