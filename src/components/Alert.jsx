import { useEffect } from "react";

const Alert = ({ type = "success", message, onClose, duration = 1500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  };

  return (
    <div className="fixed top-24 left-0 right-0 z-[9999] flex justify-center px-4 animate-[fadeIn_0.3s_ease_forwards]">
      <div
        className={`${colors[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 w-fit animate-[alertBounce_0.5s_ease-out_forwards]`}
      >
        {/* Icono balón */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md animate-[ballSpin_1.2s_linear_infinite]">
          <svg
            className="w-6 h-6 text-black"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M17.562 6.28 12 3 6.438 6.28v6.44L12 16l5.562-3.28V6.28zM12 1l7 4v8l-7 4-7-4V5l7-4zm0 9.5-3.5-2v-2l3.5-2 3.5 2v2l-3.5 2z" />
          </svg>
        </div>

        <p className="text-lg font-semibold">{message}</p>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes alertBounce {
          0% { opacity: 0; transform: translateY(-25px); }
          60% { opacity: 1; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        @keyframes ballSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Alert;
