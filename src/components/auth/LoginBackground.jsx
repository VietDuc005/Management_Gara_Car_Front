// src/components/auth/LoginBackground.jsx
import { useRef } from "react";
import { Car } from "lucide-react";

const LoginBackground = () => {
  const glowRef = useRef(null);
  const trailRef = useRef([]);

  const handleMouseMove = (e) => {
    if (!glowRef.current) return;
    const { clientX, clientY, movementX, movementY } = e;
    const speed = Math.min(Math.sqrt(movementX**2 + movementY**2) * 4, 250);

    glowRef.current.style.left = `${clientX}px`;
    glowRef.current.style.top = `${clientY}px`;
    glowRef.current.style.width = `${340 + speed}px`;
    glowRef.current.style.height = `${340 + speed}px`;
    glowRef.current.style.opacity = 0.85;

    const spark = document.createElement("div");
    spark.className =
      "absolute w-2 h-2 rounded-full bg-orange-500 blur-sm opacity-80 animate-spark";
    spark.style.left = `${clientX - 4}px`;
    spark.style.top = `${clientY - 4}px`;
    document.body.appendChild(spark);
    trailRef.current.push(spark);
    setTimeout(() => {
      spark.remove();
      trailRef.current.shift();
    }, 600);
  };

  const cars = Array.from({ length: 18 }).map(() => {
    const direction = Math.random() > 0.45 ? -1 : 1;
    const startLeft =
      direction === 1
        ? Math.random() * -600
        : window.innerWidth + Math.random() * 600;

    return {
      top: `${10 + Math.random() * 80}%`,
      size: 28 + Math.random() * 26,
      speed: `${6 + Math.random() * 6}s`,
      delay: `${Math.random() * 4}s`,
      direction,
      startLeft,
      color: [
        "text-orange-400",
        "text-amber-400",
        "text-orange-300",
        "text-yellow-500",
        "text-orange-500",
      ][Math.floor(Math.random() * 5)],
    };
  });

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseMove}
    >
      {/* ✅ Background đen xám không vệt loang */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#0d0d0d]" />
      <div className="absolute inset-0 opacity-[0.12] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] animate-texture" />

      {cars.map((car, i) => (
        <div
          key={i}
          className={`absolute car-run-${car.direction} flex items-center gap-1`}
          style={{
            top: car.top,
            left: car.startLeft,
            animationDelay: car.delay,
            animationDuration: car.speed,
          }}
        >
          <Car
            className={`${car.color} drop-shadow-[0_0_14px_rgba(255,120,40,0.7)]`}
            style={{
              width: car.size,
              height: car.size,
            }}
          />

          <div
            className="rounded-full"
            style={{
              width: car.size * 1.6,
              height: "3px",
              background: "rgba(255,120,40,0.45)",
              filter: "blur(2px)",
            }}
          />
        </div>
      ))}

      {/* Glow follow mouse */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed rounded-full -translate-x-1/2 -translate-y-1/2
        bg-[radial-gradient(circle,rgba(255,120,40,0.5)_0%,rgba(255,80,20,0.3)_40%,transparent_100%)]
        blur-[100px] transition-all duration-[60ms] opacity-0"
        style={{ width: 340, height: 340 }}
      />

      <style jsx>{`
        @keyframes spark {
          from { opacity: 0.9; transform: scale(1); }
          to { opacity: 0; transform: scale(0.1) translateY(-20px); }
        }
        .animate-spark { animation: spark 0.6s ease-out forwards; }

        /* ✅ Đã gộp transform scaleX vào animation */
        @keyframes runRight {
          0% { transform: translateX(-150px) scaleX(1); }
          100% { transform: translateX(120vw) scaleX(1); }
        }
        .car-run-1 {
          animation: runRight linear infinite;
        }

        @keyframes runLeft {
          0% { transform: translateX(110vw) scaleX(-1); }
          100% { transform: translateX(-180px) scaleX(-1); }
        }
        .car-run--1 {
          animation: runLeft linear infinite;
        }

        @keyframes textureMove {
          0% { transform: translate(0,0); }
          100% { transform: translate(-200px,-200px); }
        }
        .animate-texture { animation: textureMove 48s linear infinite; }
      `}</style>
    </div>
  );
};

export default LoginBackground;
