import React from "react";

interface HeroProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function Hero({ title, description, children }: HeroProps) {
  return (
    <div className="relative bg-indigo-900 py-24 sm:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{title}</h1>
        {description && (
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
