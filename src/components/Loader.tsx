// /src/components/Loader.tsx
"use client";

export function Loader({ size = 10 }: { size?: number }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div
        style={{
          border: `${size / 8}px solid #f3f3f3`,
          borderTop: `${size / 8}px solid #d3d3d3`,
          borderRadius: "50%",
          width: size,
          height: size,
          animation: "spin 1s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
