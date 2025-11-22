import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const Torneos = () => {
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modalEstado, setModalEstado] = useState(false);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [cambiandoEstado, setCambiandoEstado] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
    cargarTorneos();
  }, []);

  const cargarTorneos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.torneos);
      const data = await response.json();

      if (data.isSuccess) {
        setTorneos(data.data);
      } else {
        setError("Error al cargar torneos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const eliminarTorneo = async (id) => {
    if (!window.confirm("¿Eliminar este torneo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.torneoById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.isSuccess) {
        alert("Torneo eliminado exitosamente");
        cargarTorneos();
      } else {
        alert("Error al eliminar torneo");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const abrirModalEstado = (torneo) => {
    setTorneoSeleccionado(torneo);
    setNuevoEstado(torneo.torn_Estado || "Pendiente");
    setModalEstado(true);
  };

  const cerrarModalEstado = () => {
    setModalEstado(false);
    setTorneoSeleccionado(null);
    setNuevoEstado("");
  };

  const cambiarEstadoTorneo = async () => {
    if (!nuevoEstado) {
      alert("Selecciona un estado");
      return;
    }

    setCambiandoEstado(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        API_ENDPOINTS.cambiarEstadoTorneo(torneoSeleccionado.torn_Id),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevoEstado),
        }
      );

      const data = await response.json();

      if (data.isSuccess) {
        alert("Estado actualizado exitosamente");
        cerrarModalEstado();
        cargarTorneos();
      } else {
        alert("Error al cambiar el estado");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setCambiandoEstado(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      "En Curso": "bg-green-100 text-green-800",
      Finalizado: "bg-gray-100 text-gray-800",
    };
    return badges[estado] || "bg-gray-100 text-gray-800";
  };

  const torneosFiltrados =
    filtroEstado === "Todos"
      ? torneos
      : torneos.filter((t) => t.torn_Estado === filtroEstado);

  const estadisticas = {
    total: torneos.length,
    pendientes: torneos.filter((t) => t.torn_Estado === "Pendiente").length,
    enCurso: torneos.filter((t) => t.torn_Estado === "En Curso").length,
    finalizados: torneos.filter((t) => t.torn_Estado === "Finalizado").length,
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
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Gestión de Torneos
              </h1>
              <p className="text-gray-600 mt-1">
                Administra torneos y sus equipos
              </p>
            </div>
            {usuario?.rol_Nombre === "Administrador" && (
              <Link
                to="/torneos/crear"
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
                Nuevo Torneo
              </Link>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold">Total</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.total}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-semibold">Pendientes</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.pendientes}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">En Curso</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.enCurso}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-gray-500">
              <p className="text-gray-600 text-sm font-semibold">Finalizados</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.finalizados}
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroEstado("Todos")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filtroEstado === "Todos"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({torneos.length})
            </button>
            <button
              onClick={() => setFiltroEstado("Pendiente")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filtroEstado === "Pendiente"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pendientes ({estadisticas.pendientes})
            </button>
            <button
              onClick={() => setFiltroEstado("En Curso")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filtroEstado === "En Curso"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En Curso ({estadisticas.enCurso})
            </button>
            <button
              onClick={() => setFiltroEstado("Finalizado")}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filtroEstado === "Finalizado"
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Finalizados ({estadisticas.finalizados})
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista de torneos */}
        {torneosFiltrados.length === 0 ? (
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
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <p className="text-gray-500 text-lg font-semibold">
              No hay torneos{" "}
              {filtroEstado !== "Todos" && filtroEstado.toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {torneosFiltrados.map((torneo) => (
              <div
                key={torneo.torn_Id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-2xl font-black text-gray-900 mb-1 break-words">
                            {torneo.torn_Nombre}
                          </h2>
                          {torneo.torn_Descripcion && (
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {torneo.torn_Descripcion}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${getEstadoBadge(
                            torneo.torn_Estado
                          )}`}
                        >
                          {torneo.torn_Estado}
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                            {new Date(
                              torneo.torn_FechaInicio
                            ).toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        {torneo.torn_Tipo && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <span className="font-medium">
                              {torneo.torn_Tipo}
                            </span>
                          </div>
                        )}
                        {torneo.torn_NumeroEquipos && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <svg
                              className="w-4 h-4 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span className="font-medium">
                              {torneo.torn_NumeroEquipos} equipos
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {usuario?.rol_Nombre === "Administrador" && (
                      <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                        <Link
                          to={`/torneos/${torneo.torn_Id}/partidos`}
                          className="flex-1 lg:flex-initial bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <span className="text-lg">⚽</span>
                          <span>Ver Partidos</span>
                        </Link>
                        <Link
                          to={`/torneos/generar-ia/${torneo.torn_Id}`}
                          className="flex-1 lg:flex-initial bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap flex items-center justify-center gap-2"
                        >
                          <span className="text-lg">🤖</span>
                          <span>Generar con IA</span>
                        </Link>
                        <button
                          onClick={() => abrirModalEstado(torneo)}
                          className="flex-1 lg:flex-initial bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap"
                        >
                          Cambiar Estado
                        </button>
                        <Link
                          to={`/torneos/equipos/${torneo.torn_Id}`}
                          className="flex-1 lg:flex-initial bg-green-100 hover:bg-green-200 text-green-700 px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap"
                        >
                          Ver Equipos
                        </Link>
                        <Link
                          to={`/torneos/editar/${torneo.torn_Id}`}
                          className="flex-1 lg:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-bold transition text-center text-sm"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => eliminarTorneo(torneo.torn_Id)}
                          className="flex-1 lg:flex-initial bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2.5 rounded-lg font-bold transition text-sm whitespace-nowrap"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Cambiar Estado */}
      {modalEstado && torneoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">
                  Cambiar Estado del Torneo
                </h3>
                <button
                  onClick={cerrarModalEstado}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Torneo:</p>
                <p className="text-lg font-black text-gray-900">
                  {torneoSeleccionado.torn_Nombre}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Selecciona el nuevo estado
                </label>
                <div className="space-y-2">
                  {["Pendiente", "En Curso", "Finalizado"].map((estado) => (
                    <label
                      key={estado}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                        nuevoEstado === estado
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="estado"
                        value={estado}
                        checked={nuevoEstado === estado}
                        onChange={(e) => setNuevoEstado(e.target.value)}
                        className="w-5 h-5 text-purple-600"
                      />
                      <span className="font-bold text-gray-900">{estado}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cerrarModalEstado}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={cambiarEstadoTorneo}
                  disabled={cambiandoEstado}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
                >
                  {cambiandoEstado ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Torneos;
