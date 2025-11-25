import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/alert";

const CrearSede = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede_Nombre: "",
    sede_Direccion: "",
    sede_Capacidad: "",
    sede_TipoCampo: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Estado para el ALERT futbolero
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
      const response = await fetch(API_ENDPOINTS.sedes, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.isSuccess) {
        // Mostrar alerta futbolera personalizada
        setAlerta({
          visible: true,
          type: "success",
          message: "Sede creada exitosamente",
        });

        // Redirigir después de 1.5 segundos
        setTimeout(() => navigate("/sedes"), 1500);
      } else {
        setError(data.message || "Error al crear sede");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* ALERT FUTBOLERO */}
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
              onClick={() => navigate("/sedes")}
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Crear Nueva Sede
                </h1>
                <p className="text-gray-600 text-sm">
                  Registra una nueva sede deportiva
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  value={formData.sede_Nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, sede_Nombre: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Ej: Campo Deportivo Central"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.sede_Direccion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sede_Direccion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Ej: Av. Principal #123, Col. Centro"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Capacidad (personas)
                  </label>
                  <input
                    type="number"
                    value={formData.sede_Capacidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sede_Capacidad: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="100"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tipo de Campo
                  </label>
                  <select
                    value={formData.sede_TipoCampo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sede_TipoCampo: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Pasto Natural">Pasto Natural</option>
                    <option value="Pasto Sintético">Pasto Sintético</option>
                    <option value="Tierra">Tierra</option>
                    <option value="Cemento">Cemento</option>
                    <option value="Indoor">Indoor</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/sedes")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={cargando}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
                >
                  {cargando ? "Creando..." : "Crear Sede"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CrearSede;
