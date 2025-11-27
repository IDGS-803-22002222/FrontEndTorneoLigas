import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { API_ENDPOINTS } from "../config/api";
import "/public/ligas.png";

const Home = () => {
  const [torneos, setTorneos] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [goleadores, setGoleadores] = useState([]);
  const [tablaPosiciones, setTablaPosiciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarTorneos();
  }, []);

  useEffect(() => {
    if (torneoSeleccionado) {
      cargarEstadisticasTorneo(torneoSeleccionado);
    }
  }, [torneoSeleccionado]);

  const cargarTorneos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.torneos, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.isSuccess) {
        setTorneos(data.data);
        const torneoEnCurso = data.data.find(
          (t) => t.torn_Estado === "En Curso"
        );
        if (torneoEnCurso) {
          setTorneoSeleccionado(torneoEnCurso.torn_Id);
        } else if (data.data.length > 0) {
          setTorneoSeleccionado(data.data[0].torn_Id);
        }
      }
    } catch (err) {
      setError("Error al cargar torneos");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const cargarEstadisticasTorneo = async (torneoId) => {
    try {
      const token = localStorage.getItem("token");

      const resGoleadores = await fetch(
        API_ENDPOINTS.EstadisticasGoleadores(torneoId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const dataGoleadores = await resGoleadores.json();
      if (dataGoleadores.isSuccess) {
        setGoleadores(dataGoleadores.data.slice(0, 5));
      }

      const resPosiciones = await fetch(
        API_ENDPOINTS.EstadisticasTablaPocisiones(torneoId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const dataPosiciones = await resPosiciones.json();
      if (dataPosiciones.isSuccess) {
        setTablaPosiciones(dataPosiciones.data);
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  const torneoActual = torneos.find((t) => t.torn_Id === torneoSeleccionado);

  if (cargando) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 py-12 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-8 border-gray-200 mx-auto"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-blue-600 mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <p className="text-gray-700 font-bold text-lg mt-6">
              Cargando estadísticas...
            </p>
            <p className="text-gray-500 text-sm mt-2">Espera un momento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-10 max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r p-3 rounded-2xl shadow-lg">
              <img src="./ligas.png" alt="logos" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Bienvenido a Gestión de Ligas Deportivas
              </h1>
              <p className="text-gray-600 text-base lg:text-lg font-medium mt-1"></p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-xl mb-6 shadow-md animate-shake">
            <div className="flex items-center gap-3">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        {torneos.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Torneo Actual
                </label>
                <select
                  value={torneoSeleccionado || ""}
                  onChange={(e) =>
                    setTorneoSeleccionado(parseInt(e.target.value))
                  }
                  className="w-full sm:w-auto min-w-[300px] px-5 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 font-bold text-gray-800 cursor-pointer hover:border-blue-400 transition-all shadow-sm"
                >
                  {torneos.map((torneo) => (
                    <option key={torneo.torn_Id} value={torneo.torn_Id}>
                      {torneo.torn_Nombre} • {torneo.torn_Estado}
                    </option>
                  ))}
                </select>
              </div>
              {torneoActual && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-800">
                    {torneoActual.torn_Estado}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {torneoActual && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 transform">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
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
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2">
                  {tablaPosiciones.length}
                </h3>
                <p className="text-blue-100 font-semibold text-sm uppercase tracking-wide">
                  Equipos Inscritos
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 transform">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2">
                  {tablaPosiciones.reduce(
                    (sum, t) => sum + (t.taPo_PartidosJugados || 0),
                    0
                  )}
                </h3>
                <p className="text-green-100 font-semibold text-sm uppercase tracking-wide">
                  Partidos Jugados
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 transform">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2">
                  {tablaPosiciones.reduce(
                    (sum, t) => sum + (t.taPo_GolesFavor || 0),
                    0
                  )}
                </h3>
                <p className="text-white-100 font-semibold text-sm uppercase tracking-wide">
                  Goles Totales
                </p>
              </div>
            </div>

            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 transform">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-4xl font-black mb-2">
                  {torneoActual.torn_Estado}
                </h3>
                <p className="text-purple-100 font-semibold text-sm uppercase tracking-wide">
                  Estado
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tablas mejoradas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Tabla de Posiciones */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-5">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                Tabla de Posiciones
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                      Pos
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      Equipo
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      PJ
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      PG
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      PE
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      PP
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                      Pts
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tablaPosiciones.length > 0 ? (
                    tablaPosiciones.map((equipo, index) => (
                      <tr
                        key={equipo.equi_Id}
                        className={`hover:bg-blue-50 transition-colors ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-50 to-gray-100"
                            : index === 2
                            ? "bg-gradient-to-r from-orange-50 to-orange-100"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-white ${
                              index === 0
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : index === 1
                                ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                : index === 2
                                ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                : "bg-gradient-to-br bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={equipo.equi_Logo}
                              className="h-13 w-15 object-cover rounded-4xl"
                              alt="logoEquipo"
                            />
                            <span className="font-bold text-gray-900">
                              {equipo.equi_Nombre || "Equipo"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-semibold text-gray-700">
                          {equipo.taPo_PartidosJugados || 0}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg font-bold text-sm">
                            {equipo.taPo_PartidosGanados || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-bold text-sm">
                            {equipo.taPo_PartidosEmpatados || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-lg font-bold text-sm">
                            {equipo.taPo_PartidosPerdidos || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-black  text-black shadow-lg">
                            {equipo.taPo_Puntos || 0}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="text-gray-500 font-semibold">
                          No hay datos disponibles
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Goleadores */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-5">
              <h3 className="text-xl font-black text-white flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <img
                    src="/public/goles.png"
                    alt="goles"
                    className="h-10 w-10"
                  />
                </div>
                Top 5 Goleadores
              </h3>
            </div>
            <div className="p-6">
              {goleadores.length > 0 ? (
                <div className="space-y-3">
                  {goleadores.map((goleador, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:from-yellow-50 hover:to-orange-50 transition-all duration-300 border border-gray-100 hover:border-yellow-300 hover:shadow-lg transform hover:scale-102"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-2xl font-black text-white shadow-lg transform group-hover:scale-110 transition-transform ${
                            index === 0
                              ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-400 to-gray-600"
                              : index === 2
                              ? "bg-gradient-to-br from-orange-400 to-orange-600"
                              : "bg-gradient-to-br bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-lg group-hover:text-yellow-700 transition-colors">
                            {goleador.usua_NombreCompleto || "Jugador"}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            {goleador.equi_Nombre || "Equipo"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-black bg-clip-text ">
                          {goleador.totalGoles || 0}
                        </p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                          goles
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500 font-semibold text-lg">
                    No hay goleadores registrados
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Los datos aparecerán cuando se registren partidos
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </Layout>
  );
};

export default Home;
