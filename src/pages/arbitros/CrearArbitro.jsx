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

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl flex items-center justify-center text-2xl">
                👮‍♂️
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
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                    <p className="text-sm font-bold text-yellow-900 mb-1">
                      Información importante
                    </p>
                    <p className="text-xs text-yellow-800">
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
                >
                  {cargando ? "Creando..." : "Crear Árbitro"}
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
