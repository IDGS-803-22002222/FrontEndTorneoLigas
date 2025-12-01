import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

const Arbitros = () => {
  const navigate = useNavigate();
  const [arbitros, setArbitros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState(null);

  const [alerta, setAlerta] = useState({
    visible: false,
    type: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      setUsuario(user);
      if (user.rol_Nombre !== "Administrador") {
        navigate("/home");
        return;
      }
    }
    cargarArbitros();
  }, []);

  const cargarArbitros = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.arbitros, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.isSuccess) {
        // Filtrar solo árbitros activos
        setArbitros(data.data.filter((a) => a.usua_Activo));
      } else {
        setError("Error al cargar árbitros");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const confirmarEliminar = (id) => {
    setAlerta({
      visible: true,
      type: "confirm",
      message: "¿Deseas eliminar este árbitro?",
      onConfirm: () => eliminarArbitro(id),
      onCancel: () => setAlerta({ visible: false }),
    });
  };

  const eliminarArbitro = async (id) => {
    setAlerta({ visible: false });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.arbitroById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.isSuccess) {
        setAlerta({
          visible: true,
          type: "success",
          message: "Árbitro eliminado exitosamente",
        });
        cargarArbitros();
      } else {
        setAlerta({
          visible: true,
          type: "error",
          message: data.message || "Error al eliminar árbitro",
        });
      }
    } catch (err) {
      setAlerta({
        visible: true,
        type: "error",
        message: "Error de conexión",
      });
    }
  };

  const arbitrosFiltrados = arbitros.filter(
    (arbitro) =>
      arbitro.usua_NombreCompleto
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      arbitro.usua_Email?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          onClose={() => setAlerta({ visible: false })}
          onConfirm={alerta.onConfirm}
          onCancel={alerta.onCancel}
        />
      )}

      {alerta.visible && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta({ visible: false })}
          onConfirm={alerta.onConfirm}
          onCancel={alerta.onCancel}
        />
      )}

      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Gestión de Árbitros
              </h1>
              <p className="text-gray-600 mt-1">
                Administra los árbitros del sistema
              </p>
            </div>

            <Link
              to="/arbitros/crear"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Árbitro
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold">
                Total Árbitros Activos
              </p>
              <p className="text-3xl font-black text-gray-900">
                {arbitros.length}
              </p>
            </div>
          </div>

          {/* Búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Grid de árbitros */}
          {arbitrosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-semibold">
                {busqueda
                  ? "No se encontraron árbitros"
                  : "No hay árbitros registrados"}
              </p>
              {!busqueda && (
                <Link
                  to="/arbitros/crear"
                  className="text-blue-600 hover:text-blue-700 font-bold mt-2 inline-block"
                >
                  Crear el primer árbitro
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {arbitrosFiltrados.map((arbitro) => (
                <div
                  key={arbitro.usua_Id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Header (Dark Gradient como equipos) */}
                  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl">
                        <svg
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          x="0px"
                          y="0px"
                          width="40px"
                          height="40px"
                          viewBox="0 0 940.838 940.838"
                          style={{
                            enableBackground: "new 0 0 940.838 940.838",
                          }}
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
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black break-words">
                          {arbitro.usua_NombreCompleto}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                            arbitro.usua_Activo ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {arbitro.usua_Activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium break-all">
                        {arbitro.usua_Email}
                      </span>
                    </div>

                    {/* Telefono */}
                    {arbitro.usua_Telefono && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="font-medium">
                          {arbitro.usua_Telefono}
                        </span>
                      </div>
                    )}

                    {/* Fecha */}
                    {arbitro.usua_FechaRegistro && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium">
                          Registro:{" "}
                          {new Date(
                            arbitro.usua_FechaRegistro
                          ).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link
                        to={`/arbitros/editar/${arbitro.usua_Id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold text-center text-sm"
                      >
                        Editar
                      </Link>

                      <button
                        onClick={() => confirmarEliminar(arbitro.usua_Id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-lg font-bold text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Arbitros;
