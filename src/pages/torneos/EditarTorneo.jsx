import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const EditarTorneo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    torn_Id: 0,
    torn_Nombre: "",
    torn_Descripcion: "",
    torn_FechaInicio: "",
    torn_FechaFin: "",
    torn_Tipo: "",
    torn_NumeroEquipos: "",
    torn_Estado: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTorneo();
  }, [id]);

  const cargarTorneo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.torneoById(id));
      const data = await response.json();

      if (data.isSuccess) {
        const torneo = data.data;
        setFormData({
          torn_Id: torneo.torn_Id,
          torn_Nombre: torneo.torn_Nombre || "",
          torn_Descripcion: torneo.torn_Descripcion || "",
          torn_FechaInicio: torneo.torn_FechaInicio
            ? torneo.torn_FechaInicio.split("T")[0]
            : "",
          torn_FechaFin: torneo.torn_FechaFin
            ? torneo.torn_FechaFin.split("T")[0]
            : "",
          torn_Tipo: torneo.torn_Tipo || "",
          torn_NumeroEquipos: torneo.torn_NumeroEquipos || "",
          torn_Estado: torneo.torn_Estado || "",
        });
      } else {
        setError("Error al cargar torneo");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.torneos, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.isSuccess) {
        alert("Torneo actualizado exitosamente");
        navigate("/torneos");
      } else {
        setError(data.message || "Error al actualizar torneo");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

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
            Editar Torneo
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                    setFormData({ ...formData, torn_FechaFin: e.target.value })
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
                  Estado
                </label>
                <select
                  value={formData.torn_Estado}
                  onChange={(e) =>
                    setFormData({ ...formData, torn_Estado: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Curso">En Curso</option>
                  <option value="Finalizado">Finalizado</option>
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
                disabled={guardando}
                className="flex-1  bg-gray-800 hover:bg-gray-900  text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditarTorneo;
