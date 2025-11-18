import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const Torneos = () => {
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
        cargarTorneos();
      } else {
        alert("Error al eliminar torneo");
      }
    } catch (err) {
      alert("Error de conexión");
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              Torneos
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona los torneos y sus equipos
            </p>
          </div>
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
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista de torneos */}
        {torneos.length === 0 ? (
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
              No hay torneos registrados
            </p>
            <Link
              to="/torneos/crear"
              className="text-blue-600 hover:text-blue-700 font-bold mt-2 inline-block"
            >
              Crear el primer torneo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {torneos.map((torneo) => (
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

                    <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Torneos;
