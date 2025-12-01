import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

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

  const confirmarEliminarTorneo = (id) => {
    setAlerta({
      visible: true,
      type: "confirm",
      message: "¿Deseas eliminar este árbitro?",
      onConfirm: () => eliminarTorneo(id),
      onCancel: () => setAlerta({ visible: false }),
    });
  };

  const eliminarTorneo = async (id) => {
    setAlerta({ visible: false });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.torneoById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.isSuccess) {
        setAlerta({
          visible: true,
          type: "success",
          message: "Torneo eliminado exitosamente",
        });
        cargarTorneos();
      } else {
        setAlerta({
          visible: true,
          type: "success",
          message: "Error al eliminar el torneo",
        });
      }
    } catch (err) {
      setAlerta({
        visible: true,
        type: "success",
        message: "Error de conexion",
      });
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
                <p className="text-gray-600 text-sm font-semibold">
                  Pendientes
                </p>
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
                <p className="text-gray-600 text-sm font-semibold">
                  Finalizados
                </p>
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
              <img src="/public/torneos.png" alt="torneos" />
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
                          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg
                              id="Layer_1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              x="0px"
                              y="0px"
                              viewBox="0 0 512 512"
                              style={{
                                enableBackground: "new 0 0 512 512",
                              }}
                              xmlSpace="preserve"
                            >
                              <g>
                                <g>
                                  <path d="M384,449.963v-12.629c0-17.643-14.357-32-32-32h-15.104c-20.011-34.176-27.52-93.995-27.563-127.68 c3.349-6.059,6.549-11.712,9.216-16.32c17.557-30.379,44.096-99.072,44.096-133.333v-4.821c0-5.824-0.043-10.347-0.192-14.293 c0.085-0.619,0.192-1.728,0.192-2.219C362.645,47.851,314.795,0,255.979,0S149.312,47.851,149.312,106.667 c0,13.141,2.645,25.835,7.189,37.696c0.043,0.235-0.021,0.448,0.021,0.661l46.763,185.749 c-9.493,31.296-23.019,62.037-28.779,74.56H160c-17.643,0-32,14.357-32,32v12.629c-12.395,4.416-21.333,16.149-21.333,30.037 v21.333c0,5.888,4.779,10.667,10.667,10.667h277.333c5.888,0,10.667-4.779,10.667-10.667V480 C405.333,466.112,396.395,454.379,384,449.963z M277.333,128.021c2.603,0,5.035,0.64,7.36,1.493 c0.683,0.256,1.344,0.576,2.005,0.896c1.579,0.789,3.029,1.792,4.352,2.944c0.576,0.512,1.216,0.917,1.749,1.472 c3.584,3.819,5.888,8.875,5.888,14.528c0,11.755-9.557,21.333-21.333,21.333c-8.128-0.021-14.955-4.736-18.56-11.413 c-0.469-0.853-0.96-1.685-1.301-2.56c-0.853-2.325-1.493-4.757-1.493-7.36C256,137.6,265.557,128.021,277.333,128.021z  M189.781,189.504c3.84,3.051,7.893,5.845,12.203,8.384c5.717,29.824,11.371,61.077,11.371,79.467c0,1.536-0.149,3.2-0.235,4.821 L189.781,189.504z M197.952,405.333c12.395-27.968,36.715-87.979,36.715-128c0-21.312-6.187-54.741-12.629-88.043 c0-0.021,0-0.021,0-0.043l-1.408-7.296c-1.579-8.128-3.307-17.088-4.949-25.984c-1.387-7.467-2.645-14.741-3.733-21.611 c-0.299-1.899-0.64-3.904-0.917-5.717c3.093,7.765,6.784,16.491,11.328,24.96c0.235,0.427,0.469,0.853,0.704,1.28 c2.155,3.883,4.523,7.637,7.147,11.243c0.235,0.32,0.448,0.661,0.704,0.981c8.832,11.819,20.651,21.077,37.056,23.765 c3.029,0.704,6.144,1.131,9.365,1.131c3.392,0,6.656-0.491,9.835-1.259c34.816-6.123,47.445-43.371,54.165-67.435V128 c0,27.136-23.061,91.2-42.219,124.373C285.141,276.565,256,326.933,256,373.333c0,5.888,4.779,10.667,10.667,10.667 s10.667-4.779,10.667-10.667c0-18.453,5.696-38.144,13.12-56.512c3.157,28.267,9.728,61.973,22.123,88.512H197.952z" />
                                </g>
                              </g>
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
                            className="flex-1 lg:flex-initial  bg-gray-800 hover:bg-gray-900  text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap flex items-center justify-center gap-2"
                          >
                            <span className="text-lg">⚽</span>
                            <span>Ver Partidos</span>
                          </Link>
                          <Link
                            to={`/torneos/generar-ia/${torneo.torn_Id}`}
                            className="flex-1 lg:flex-initial bg-gradient-to-r  bg-gray-800 hover:bg-gray-900  text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap flex items-center justify-center gap-2"
                          >
                            <span className="text-lg">🤖</span>
                            <span>Generar con IA</span>
                          </Link>
                          <button
                            onClick={() => abrirModalEstado(torneo)}
                            className="flex-1 lg:flex-initial  bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold transition text-center text-sm whitespace-nowrap"
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
                            onClick={() =>
                              confirmarEliminarTorneo(torneo.torn_Id)
                            }
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
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  p-6 text-white rounded-t-2xl">
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
                  <p className="text-sm font-bold text-gray-700 mb-2">
                    Torneo:
                  </p>
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
                            ? "border-gray-200 hover:border-gray-300"
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
                        <span className="font-bold text-gray-900">
                          {estado}
                        </span>
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
                    className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  text-white px-4 py-3 rounded-xl font-bold transition disabled:bg-gray-400"
                  >
                    {cambiandoEstado ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default Torneos;
