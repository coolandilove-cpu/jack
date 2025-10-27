"use client"

export default function Watermark() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none opacity-10">
      <div
        className="text-black font-bold"
        style={{
          transform: "rotate(-45deg)",
          fontSize: "10vw", // Responsive font size
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "clip",
          background: "linear-gradient(to right, #87CEEB, #FF69B4)", // Light blue to pink gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "var(--font-montserrat)",
          fontWeight: "bold",
          letterSpacing: "0.1em",
        }}
      >
        jackliam.fun
      </div>
    </div>
  )
}
