import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

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
              <div className="w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                <svg
                  id="_x32_"
                  height="40px"
                  width="40px"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                >
                  <style type="text/css">{"\n\t.st0{fill:#ffff;}\n"}</style>
                  <g>
                    <rect
                      x={452.035}
                      y={200.935}
                      className="st0"
                      width={59.965}
                      height={129.779}
                    />
                    <path
                      className="st0"
                      d="M473.104,80.845H268.248l0.008,79.249c47.648,6.039,84.513,46.622,84.513,95.899 c0,49.293-36.866,89.876-84.513,95.914v79.249h204.848c21.483,0,38.896-17.413,38.896-38.896v-37.048h-84.463V176.438H512v-56.706 C512,98.251,494.587,80.845,473.104,80.845z"
                    />
                    <path
                      className="st0"
                      d="M307.11,204.905c-10.37-10.358-23.81-17.489-38.853-20.062v142.306c15.043-2.565,28.483-9.703,38.853-20.054 c13.092-13.115,21.162-31.109,21.162-51.102C328.272,236.007,320.202,218.021,307.11,204.905z"
                    />
                    <path
                      className="st0"
                      d="M204.898,307.095c10.371,10.36,23.81,17.49,38.854,20.054V184.843c-15.044,2.573-28.483,9.704-38.854,20.062 c-13.1,13.116-21.158,31.102-21.165,51.088C183.74,275.986,191.798,293.98,204.898,307.095z"
                    />
                    <rect
                      y={200.935}
                      className="st0"
                      width={59.962}
                      height={129.779}
                    />
                    <path
                      className="st0"
                      d="M159.234,255.993c0.008-49.278,36.869-89.86,84.517-95.899V80.845H38.896C17.413,80.845,0,98.251,0,119.732 v56.706h84.459v178.774H0v37.048c0,21.483,17.413,38.896,38.896,38.896h204.863l-0.007-79.249 C196.103,345.868,159.242,305.286,159.234,255.993z"
                    />
                  </g>
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
                  className="flex-1  bg-gray-800 hover:bg-gray-900  text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
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
