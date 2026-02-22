"use client";

import { Toaster } from "react-hot-toast";

export function ToasterClient() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}
