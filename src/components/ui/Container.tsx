import { forwardRef } from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
        {...props}
      />
    );
  }
);

Container.displayName = "Container";
