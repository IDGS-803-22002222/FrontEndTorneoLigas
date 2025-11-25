import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/alert";

const Sedes = () => {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
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
      setUsuario(JSON.parse(usuarioGuardado));
    }
    cargarSedes();
  }, []);

  const cargarSedes = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sedes);
      const data = await response.json();

      if (data.isSuccess) {
        setSedes(data.data);
      } else {
        setError("Error al cargar sedes");
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
      message: "¿Deseas eliminar esta sede?",
      onConfirm: () => eliminarSede(id),
      onCancel: () => setAlerta({ visible: false }),
    });
  };

  const eliminarSede = async (id) => {
    setAlerta({ visible: false });

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_ENDPOINTS.sedeById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.isSuccess) {
        setAlerta({
          visible: true,
          type: "success",
          message: "Sede eliminada exitosamente",
        });
        cargarSedes();
      } else {
        setAlerta({
          visible: true,
          type: "error",
          message: "Error al eliminar sede",
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

  const sedesFiltradas = sedes.filter((sede) => {
    const coincideBusqueda =
      sede.sede_Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      sede.sede_Direccion?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo =
      filtroTipo === "Todos" || sede.sede_TipoCampo === filtroTipo;

    return coincideBusqueda && coincideTipo;
  });

  const tiposCampo = [
    "Todos",
    ...new Set(
      sedes.filter((s) => s.sede_TipoCampo).map((s) => s.sede_TipoCampo)
    ),
  ];

  const estadisticas = {
    total: sedes.length,
    natural: sedes.filter((s) => s.sede_TipoCampo === "Pasto Natural").length,
    sintetico: sedes.filter((s) => s.sede_TipoCampo === "Pasto Sintético")
      .length,
    otros: sedes.filter(
      (s) =>
        s.sede_TipoCampo &&
        !["Pasto Natural", "Pasto Sintético"].includes(s.sede_TipoCampo)
    ).length,
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
                Gestión de Sedes
              </h1>
              <p className="text-gray-600 mt-1">
                Administra las sedes deportivas del sistema
              </p>
            </div>

            {usuario?.rol_Nombre === "Administrador" && (
              <Link
                to="/sedes/crear"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2"
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
                Nueva Sede
              </Link>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm font-semibold">Total Sedes</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.total}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-emerald-500">
              <p className="text-gray-600 text-sm font-semibold">
                Pasto Natural
              </p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.natural}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-lime-500">
              <p className="text-gray-600 text-sm font-semibold">
                Pasto Sintético
              </p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.sintetico}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-gray-500">
              <p className="text-gray-600 text-sm font-semibold">Otros Tipos</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.otros}
              </p>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
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
                  placeholder="Buscar sede por nombre o dirección..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                />
              </div>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-green-600"
              >
                {tiposCampo.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === "Todos" ? "Todos los tipos de campo" : tipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Grid de sedes */}
          {sedesFiltradas.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg font-semibold">
                {busqueda
                  ? "No se encontraron sedes con esos criterios"
                  : "No hay sedes registradas"}
              </p>

              {!busqueda && usuario?.rol_Nombre === "Administrador" && (
                <Link
                  to="/sedes/crear"
                  className="text-green-600 hover:text-green-700 font-bold mt-2 inline-block"
                >
                  Crear la primera sede
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sedesFiltradas.map((sede) => (
                <div
                  key={sede.sede_Id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black break-words">
                          {sede.sede_Nombre}
                        </h3>

                        {sede.sede_TipoCampo && (
                          <span className="inline-block bg-green-500 px-3 py-1 rounded-full text-xs font-bold mt-1">
                            {sede.sede_TipoCampo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    {sede.sede_Direccion && (
                      <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <span className="font-medium break-words">
                          {sede.sede_Direccion}
                        </span>
                      </div>
                    )}

                    {sede.sede_Capacidad && (
                      <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <span className="font-bold">
                          Capacidad: {sede.sede_Capacidad} personas
                        </span>
                      </div>
                    )}

                    {/* ACCIONES */}
                    {usuario?.rol_Nombre === "Administrador" && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <Link
                          to={`/sedes/editar/${sede.sede_Id}`}
                          className="bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg font-bold text-center"
                        >
                          Editar
                        </Link>

                        <button
                          onClick={() => confirmarEliminar(sede.sede_Id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
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

export default Sedes;
