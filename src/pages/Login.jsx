import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const equipos = [
    {
      id: 1,
      imagen:
        "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=1200",
    },
    {
      id: 2,
      imagen:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
    },
    {
      id: 3,
      imagen:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
    },
    {
      id: 4,
      imagen:
        "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=1200",
    },
    {
      id: 5,
      imagen:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % equipos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        setCargando(false);
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("usuario", JSON.stringify(data.data));
      navigate("/home");
    } catch (err) {
      setError("Error de conexión con el servidor ");
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* Carrusel de fondo */}
      <div className="absolute inset-0">
        {equipos.map((equipo, index) => (
          <div
            key={equipo.id}
            className={`absolute inset-0 transition-opacity duration-2000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={equipo.imagen}
              alt="Equipo"
              className="w-full h-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/40 to-black/80"></div>
          </div>
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Indicadores */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {equipos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-1 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 rounded-lg flex items-center justify-center shadow-2xl backdrop-blur-sm">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <div className="text-white hidden sm:block">
          <h1 className="text-sm sm:text-base font-black tracking-tight">
            LIGA LOCAL
          </h1>
          <p className="text-xs text-white/60 font-medium">
            Sistema de Gestión
          </p>
        </div>
      </div>

      {/* Botón volver */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex items-center gap-2 text-white/80 hover:text-white font-semibold transition-all bg-white/5 backdrop-blur-sm px-3 py-2 sm:px-4 rounded-lg hover:bg-white/10 border border-white/10 text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="hidden sm:inline">Volver</span>
      </button>

      {/* Card de Login */}
      <div className="relative z-20 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100">
          {/* Header del formulario */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block bg-gray-900 p-3 sm:p-4 rounded-xl mb-4 sm:mb-5 shadow-lg">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 sm:p-4 rounded-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800 font-semibold">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder="correo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50 focus:bg-white text-sm sm:text-base"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-gray-900 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {cargando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>INICIAR SESIÓN</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-10 text-center text-white/50 text-xs font-medium">
        <p>Universidad Tecnológica de León | IDGS1003</p>
      </div>
    </div>
  );
};

export default Login;
