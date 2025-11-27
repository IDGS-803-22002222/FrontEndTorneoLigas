import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const CrearTorneo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    torn_Nombre: "",
    torn_Descripcion: "",
    torn_FechaInicio: "",
    torn_FechaFin: "",
    torn_Tipo: "",
    torn_NumeroEquipos: "",
  });
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.equipos);
      const data = await response.json();

      if (data.isSuccess) {
        setEquiposDisponibles(data.data);
      }
    } catch (err) {
      console.error("Error al cargar equipos:", err);
    }
  };

  const toggleEquipo = (equipoId) => {
    if (equiposSeleccionados.includes(equipoId)) {
      setEquiposSeleccionados(
        equiposSeleccionados.filter((id) => id !== equipoId)
      );
    } else {
      setEquiposSeleccionados([...equiposSeleccionados, equipoId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      // 1. Crear el torneo
      const response = await fetch(API_ENDPOINTS.torneos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.isSuccess) {
        setError(data.message || "Error al crear torneo");
        setCargando(false);
        return;
      }

      const torneoId = data.data;

      // 2. Inscribir equipos seleccionados
      if (equiposSeleccionados.length > 0) {
        for (const equipoId of equiposSeleccionados) {
          await fetch(API_ENDPOINTS.inscribirEquipo, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              torn_Id: torneoId,
              equi_Id: equipoId,
            }),
          });
        }
      }

      alert("Torneo creado exitosamente");
      navigate("/torneos");
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/torneos")}
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
          <h1 className="text-3xl font-black text-gray-900 mb-6">
            Crear Torneo
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información del Torneo */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-black text-gray-900 mb-4">
                Información del Torneo
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Nombre del Torneo *
                  </label>
                  <input
                    type="text"
                    value={formData.torn_Nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, torn_Nombre: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.torn_Descripcion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        torn_Descripcion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.torn_FechaInicio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        torn_FechaInicio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={formData.torn_FechaFin}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        torn_FechaFin: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Tipo de Torneo
                  </label>
                  <select
                    value={formData.torn_Tipo}
                    onChange={(e) =>
                      setFormData({ ...formData, torn_Tipo: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Liga">Liga</option>
                    <option value="Eliminación">Eliminación</option>
                    <option value="Round Robin">Round Robin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Número de Equipos
                  </label>
                  <input
                    type="number"
                    value={formData.torn_NumeroEquipos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        torn_NumeroEquipos: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    min="2"
                  />
                </div>
              </div>
            </div>

            {/* Selección de Equipos */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4">
                Equipos Participantes ({equiposSeleccionados.length}{" "}
                seleccionados)
              </h2>

              {equiposDisponibles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No hay equipos disponibles</p>
                  <button
                    type="button"
                    onClick={() => navigate("/equipos/crear")}
                    className="text-blue-600 hover:text-blue-700 font-bold"
                  >
                    Crear primer equipo
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {equiposDisponibles.map((equipo) => (
                    <label
                      key={equipo.equi_Id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        equiposSeleccionados.includes(equipo.equi_Id)
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={equiposSeleccionados.includes(equipo.equi_Id)}
                        onChange={() => toggleEquipo(equipo.equi_Id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {equipo.equi_Nombre}
                        </p>
                        {equipo.equi_ColorUniforme && (
                          <p className="text-sm text-gray-600">
                            {equipo.equi_ColorUniforme}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/torneos")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="flex-1  bg-gray-800 hover:bg-gray-900  text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
              >
                {cargando ? "Creando..." : "Crear Torneo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CrearTorneo;
