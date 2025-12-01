import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

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
        <div className="container mx-auto px-4 sm:px-6 py-10">
          {/* ENCABEZADO */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Gestión de Sedes
              </h1>
              <p className="text-gray-500 mt-1 text-lg">
                Administra las sedes deportivas registradas
              </p>
            </div>

            {usuario?.rol_Nombre === "Administrador" && (
              <Link
                to="/sedes/crear"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md flex items-center gap-2"
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

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              {
                label: "Total Sedes",
                value: estadisticas.total,
                color: "green-600",
              },
              {
                label: "Pasto Natural",
                value: estadisticas.natural,
                color: "emerald-500",
              },
              {
                label: "Pasto Sintético",
                value: estadisticas.sintetico,
                color: "lime-500",
              },
              {
                label: "Otros Tipos",
                value: estadisticas.otros,
                color: "gray-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-5 border-l-4 border-${item.color}`}
              >
                <p className="text-gray-600 text-sm font-medium">
                  {item.label}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* BUSCADOR */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-md p-6 mb-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600"
                />
              </div>

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl font-semibold focus:ring-2 focus:ring-green-600"
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
            <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-8 shadow">
              {error}
            </div>
          )}

          {/* SIN RESULTADOS */}
          {sedesFiltradas.length === 0 ? (
            <div className="bg-white shadow-md rounded-2xl p-16 text-center">
              <p className="text-gray-500 text-lg font-semibold">
                {busqueda
                  ? "No se encontraron sedes con esos criterios"
                  : "No hay sedes registradas"}
              </p>

              {!busqueda && usuario?.rol_Nombre === "Administrador" && (
                <Link
                  to="/sedes/crear"
                  className="text-green-600 hover:text-green-700 font-bold mt-3 inline-block"
                >
                  Crear la primera sede
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sedesFiltradas.map((sede) => (
                <div
                  key={sede.sede_Id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100"
                >
                  {/* Encabezado */}
                  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow">
                        <svg
                          id="_x32_"
                          height="40px"
                          width="40px"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 512 512"
                          xmlSpace="preserve"
                        >
                          <style type="text/css">
                            {"\n\t.st0{fill:#000000;}\n"}
                          </style>
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

                      <div className="flex-1">
                        <h3 className="text-xl font-extrabold leading-tight break-words">
                          {sede.sede_Nombre}
                        </h3>

                        {sede.sede_TipoCampo && (
                          <span className="inline-block bg-green-500 px-3 py-1 rounded-full text-xs font-bold mt-2">
                            {sede.sede_TipoCampo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-6 space-y-4">
                    {sede.sede_Direccion && (
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm shadow-inner">
                        <p className="break-words">{sede.sede_Direccion}</p>
                      </div>
                    )}

                    {sede.sede_Capacidad && (
                      <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm shadow-inner">
                        <p className="font-bold">
                          Capacidad: {sede.sede_Capacidad} personas
                        </p>
                      </div>
                    )}

                    {/* ACCIONES */}
                    {usuario?.rol_Nombre === "Administrador" && (
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <Link
                          to={`/sedes/editar/${sede.sede_Id}`}
                          className="bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl font-bold text-center transition"
                        >
                          Editar
                        </Link>

                        <button
                          onClick={() => confirmarEliminar(sede.sede_Id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold shadow transition"
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
