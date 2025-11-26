import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

const EditarArbitro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usua_Id: 0,
    usua_NombreCompleto: "",
    usua_Telefono: "",
    usua_FechaNacimiento: "",
    usua_Foto: "",
  });
  const [arbitro, setArbitro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [alerta, setAlerta] = useState({
    visible: false,
    type: "",
    message: "",
    onCloseNavigate: false,
  });

  useEffect(() => {
    cargarArbitro();
  }, [id]);

  const cargarArbitro = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.arbitroById(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.isSuccess) {
        setArbitro(data.data);
        setFormData({
          usua_Id: data.data.usua_Id,
          usua_NombreCompleto: data.data.usua_NombreCompleto || "",
          usua_Telefono: data.data.usua_Telefono || "",
          usua_FechaNacimiento: data.data.usua_FechaNacimiento
            ? data.data.usua_FechaNacimiento.split("T")[0]
            : "",
          usua_Foto: data.data.usua_Foto || "",
        });
      } else {
        setError("Error al cargar árbitro");
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
      const response = await fetch(API_ENDPOINTS.arbitros, {
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
          message: "Árbitro actualizado exitosamente",
          onCloseNavigate: true,
        });
      } else {
        setError(data.message || "Error al actualizar árbitro");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
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
              navigate("/arbitros");
            }
          }}
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
                  Editar Árbitro
                </h1>
                <p className="text-gray-600 text-sm">
                  Modifica la información del árbitro
                </p>
              </div>
            </div>

            {arbitro && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-lg font-bold text-gray-900">
                  {arbitro.usua_Email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  El correo no se puede modificar
                </p>
              </div>
            )}

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
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
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
                  disabled={guardando}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
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

export default EditarArbitro;
