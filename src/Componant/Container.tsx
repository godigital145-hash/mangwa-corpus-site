import React from "react";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={twMerge("w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-360", className)}>
      {children}
    </div>
  );
}
