import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const EditarEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    equi_Id: 0,
    equi_Nombre: "",
    equi_Logo: "",
    equi_ColorUniforme: "",
    usua_Id: 0,
  });
  const [capitanes, setCapitanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCapitanes();
    cargarEquipo();
  }, [id]);

  const cargarCapitanes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.usuariosPorRol(3), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.isSuccess) {
        setCapitanes(data.data);
      }
    } catch (err) {
      console.error("Error al cargar capitanes:", err);
    }
  };

  const cargarEquipo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.equipoById(id));
      const data = await response.json();

      if (data.isSuccess) {
        setFormData({
          equi_Id: data.data.equi_Id,
          equi_Nombre: data.data.equi_Nombre || "",
          equi_Logo: data.data.equi_Logo || "",
          equi_ColorUniforme: data.data.equi_ColorUniforme || "",
          usua_Id: data.data.usua_Id || 0,
        });
      } else {
        setError("Error al cargar equipo");
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
      const response = await fetch(API_ENDPOINTS.equipos, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.isSuccess) {
        alert("Equipo actualizado exitosamente");
        navigate("/equipos");
      } else {
        setError(data.message || "Error al actualizar equipo");
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
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/equipos")}
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
            Editar Equipo
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Nombre del Equipo *
              </label>
              <input
                type="text"
                value={formData.equi_Nombre}
                onChange={(e) =>
                  setFormData({ ...formData, equi_Nombre: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Capitán del Equipo *
              </label>
              <select
                value={formData.usua_Id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usua_Id: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value={0}>Seleccione un capitán</option>
                {capitanes.map((capitan) => (
                  <option key={capitan.usua_Id} value={capitan.usua_Id}>
                    {capitan.usua_NombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                URL del Logo
              </label>
              <input
                type="url"
                value={formData.equi_Logo}
                onChange={(e) =>
                  setFormData({ ...formData, equi_Logo: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Color de Uniforme
              </label>
              <input
                type="text"
                value={formData.equi_ColorUniforme}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    equi_ColorUniforme: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/equipos")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
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

export default EditarEquipo;
