import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-0 max-w-[1440px] ${className}`}
    >
      {children}
    </div>
  );
}
