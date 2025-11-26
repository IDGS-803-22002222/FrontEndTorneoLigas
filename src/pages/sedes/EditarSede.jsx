import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

const EditarSede = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede_Id: 0,
    sede_Nombre: "",
    sede_Direccion: "",
    sede_Capacidad: "",
    sede_TipoCampo: "",
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [alerta, setAlerta] = useState({
    visible: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    cargarSede();
  }, [id]);

  const cargarSede = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sedeById(id));
      const data = await response.json();

      if (data.isSuccess) {
        setFormData({
          sede_Id: data.data.sede_Id,
          sede_Nombre: data.data.sede_Nombre || "",
          sede_Direccion: data.data.sede_Direccion || "",
          sede_Capacidad: data.data.sede_Capacidad || "",
          sede_TipoCampo: data.data.sede_TipoCampo || "",
        });
      } else {
        setError("Error al cargar sede");
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
      const response = await fetch(API_ENDPOINTS.sedes, {
        method: "PUT",
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
          message: "Sede editada exitosamente",
          onCloseNavigate: true,
        });
        //navigate("/sedes");
      } else {
        setError(data.message || "Error al actualizar sede");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      {alerta.visible && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => {
            setAlerta({ visible: false });

            if (alerta.onCloseNavigate) {
              navigate("/sedes");
            }
          }}
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Editar Sede
                </h1>
                <p className="text-gray-600 text-sm">
                  Modifica la información de la sede
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
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
                  required
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.sede_Direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, sede_Direccion: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Capacidad y Tipo */}
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

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/sedes")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default EditarSede;
