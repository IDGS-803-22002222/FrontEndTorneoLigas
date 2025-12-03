const AlertDialog = ({
  message,
  onAccept,
  acceptText = "Aceptar",
  acceptColor = "blue",
}) => {
  const buttonColors = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-80 p-6 rounded-xl shadow-xl animate-[alertBounce_0.4s_ease-out_forwards]">
        <p className="text-lg font-semibold text-center mb-6">{message}</p>

        <div className="flex justify-center">
          <button
            onClick={onAccept}
            className={`${buttonColors[acceptColor]} text-white px-6 py-2 rounded-lg font-bold transition-colors`}
          >
            {acceptText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes alertBounce {
          0% { opacity: 0; transform: translateY(-25px); }
          60% { opacity: 1; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AlertDialog;
