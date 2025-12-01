import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

const CrearArbitro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usua_NombreCompleto: "",
    usua_Email: "",
    usua_Telefono: "",
    usua_Password: "",
    usua_FechaNacimiento: "",
    rol_Id: 4, // Rol de árbitro
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [alerta, setAlerta] = useState({
    visible: false,
    type: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.arbitros, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setAlerta({
          visible: true,
          type: "success",
          message: "Árbitro creado exitosamente",
        });
        setTimeout(() => navigate("/arbitros"), 1500);
      } else {
        setError(data.message || "Error al crear árbitro");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {alerta.visible && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta({ visible: false })}
        />
      )}
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
          <div className="mb-6">
            <button
              onClick={() => navigate("/arbitros")}
              className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              Volver
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                <svg
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="40px"
                  height="40px"
                  viewBox="0 0 940.838 940.838"
                  fill="white"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path d="M382.587,0c-4.993,0-9.818,1.808-13.587,5.089L169.716,178.671c-8.603,7.495-9.505,20.592-2.013,29.193l233.002,267.501 l11.754,13.494l11.95,13.721c-9.571,0.99-19.716,2.354-29.751,4.23c-36.883,6.906-60.356,18.801-64.404,32.631 c-1.296,4.422-3.096,21.168,8.113,81.021c6.888,36.775,17.64,84.287,31.958,141.211c19.545,77.701,40.511,152.033,48.263,179.164 h156.069l13.769-255.023c0,0-19.079-177.572-21.125-197.01c-1.089-10.344-3.327-21.193-3.327-31.594l-1.738-16.506v-0.813 c0-3.202-0.444-6.3-1.258-9.247c-4.062-14.703-17.547-25.534-33.523-25.534c-19.178,0-34.78,15.604-34.78,34.781v19.785 c0,62.324-0.483,124.646-0.483,186.968c0,5.014-2.505,9.695-6.675,12.479c-2.502,1.67-5.404,2.521-8.326,2.521 c-1.948,0-3.905-0.379-5.758-1.148c-2.896-1.203-28.484-12.432-34.621-35.354c-2.349-8.771-2.627-22.52,9.381-38.197 c0.202-0.264,0.413-0.52,0.632-0.77l15.367-17.52l-0.483-56.754l-9.898-11.363l-12.457-14.303l-12.241-14.053L185.152,194.402 L382.464,22.538l28.205,32.381l11.42-3.638l11.419-3.637L398.193,7.102C394.263,2.588,388.574,0,382.587,0z" />
                      <path d="M598.015,514.172l8.687,82.496h0.751c13.307,0,24.003-4.711,31.795-13.998c6.657-7.938,10.633-18.947,10.633-29.453 c0-23.355-21.938-39.045-42.428-39.045H598.015z" />
                      <path d="M777.753,420.025L647.973,12.592c-1.313-4.123-5.125-6.754-9.232-6.753c-0.975,0-1.966,0.148-2.943,0.459l-186.545,59.42 l-11.419,3.638l-11.421,3.638l-42.431,13.515c-5.1,1.625-7.917,7.076-6.293,12.177l89.89,282.202l6.562,20.6 c1.286-1.779,2.656-3.495,4.108-5.135c7.479-8.441,17.088-14.945,27.979-18.672c6.665-2.28,13.801-3.537,21.229-3.537 c16.688,0,31.271,6.257,42.162,16.54c5.933,5.6,10.771,12.391,14.249,20.024c1.618,3.549,2.933,7.282,3.938,11.157 c1.065,4.107,1.772,8.375,2.092,12.767c0.106,1.453,0.186,2.915,0.204,4.394l5.19,49.291l9.315-2.967l14.372-4.578l152.479-48.569 C776.561,430.577,779.378,425.125,777.753,420.025z" />
                    </g>
                  </g>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Crear Nuevo Árbitro
                </h1>
                <p className="text-gray-600 text-sm">
                  Registra un árbitro en el sistema
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.usua_NombreCompleto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usua_NombreCompleto: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.usua_Email}
                    onChange={(e) =>
                      setFormData({ ...formData, usua_Email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.usua_Telefono}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usua_Telefono: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="4771234567"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={formData.usua_Password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usua_Password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={formData.usua_FechaNacimiento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usua_FechaNacimiento: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">
                      Información importante
                    </p>
                    <p className="text-xs text-blue-700">
                      El árbitro podrá iniciar sesión con el correo y contraseña
                      proporcionados. Podrá registrar resultados de partidos y
                      estadísticas de jugadores.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/arbitros")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg border border-gray-700"
                >
                  {cargando ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creando...
                    </span>
                  ) : (
                    "Crear Árbitro"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CrearArbitro;
