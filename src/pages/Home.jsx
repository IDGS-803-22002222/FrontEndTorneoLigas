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
                      width="50px"
                      height="50px"
                      viewBox="0 0 15 15"
                      id="soccer"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <path
                        d="M11,1.5C11,2.3284,10.3284,3,9.5,3S8,2.3284,8,1.5S8.6716,0,9.5,0S11,0.6716,11,1.5z M11,11c-0.5523,0-1,0.4477-1,1&#xA;&#x9;s0.4477,1,1,1s1-0.4477,1-1S11.5523,11,11,11z M12.84,6.09l-1.91-1.91l0,0C10.8399,4.0675,10.7041,4.0014,10.56,4H3.5&#xA;&#x9;C3.2239,4,3,4.2239,3,4.5S3.2239,5,3.5,5h2.7L3,11.3l0,0c-0.0138,0.066-0.0138,0.134,0,0.2c-0.058,0.2761,0.1189,0.547,0.395,0.605&#xA;&#x9;C3.6711,12.163,3.942,11.9861,4,11.71l0,0L5,10h2l-1.93,4.24l0,0C5.0228,14.3184,4.9986,14.4085,5,14.5&#xA;&#x9;c-0.0552,0.2761,0.1239,0.5448,0.4,0.6c0.2761,0.0552,0.5448-0.1239,0.6-0.4l0,0l4.7-9.38l1.44,1.48&#xA;&#x9;c0.211,0.1782,0.5264,0.1516,0.7046-0.0593C13.0037,6.5523,13.0018,6.2761,12.84,6.09z"
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
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 59 59"
                      xmlSpace="preserve"
                      className="w-6 h-6"
                    >
                      <circle
                        style={{
                          fill: "#E6E7E8",
                          stroke: "#ECF0F1",
                          strokeMiterlimit: 10,
                        }}
                        cx="29.5"
                        cy="29.5"
                        r="29"
                      />
                      <polygon
                        style={{ fill: "#38454F" }}
                        points="36.863,38.5 23.467,38.5 18.863,26.5 29.863,18.5 40.863,26.5 "
                      />
                      <g>
                        <path
                          style={{ fill: "#38454F" }}
                          d="M24.31,37.605c-0.494-0.248-1.095-0.047-1.342,0.447l-0.447,0.895
      c-0.247,0.494-0.047,1.095,0.447,1.342c0.144,0.072,0.296,0.105,0.446,0.105c0.367,0,0.72-0.202,0.896-0.553l0.447-0.895
      C25.005,38.453,24.805,37.853,24.31,37.605z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M22.521,41.183c-0.494-0.248-1.094-0.047-1.342,0.447l-0.447,0.895
      c-0.247,0.494-0.047,1.095,0.447,1.342c0.144,0.072,0.296,0.105,0.446,0.105c0.367,0,0.72-0.202,0.896-0.553l0.447-0.895
      C23.216,42.031,23.016,41.43,22.521,41.183z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M38.205,38.947l-0.447-0.895c-0.248-0.495-0.847-0.695-1.342-0.447
      c-0.494,0.247-0.694,0.848-0.447,1.342l0.447,0.895c0.176,0.351,0.528,0.553,0.896,0.553c0.15,0,0.303-0.034,0.446-0.105
      C38.252,40.042,38.452,39.441,38.205,38.947z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M39.547,41.63c-0.247-0.495-0.848-0.695-1.342-0.447c-0.494,0.247-0.694,0.848-0.447,1.342
      l0.447,0.895c0.176,0.351,0.528,0.553,0.896,0.553c0.15,0,0.303-0.034,0.446-0.105c0.494-0.247,0.694-0.848,0.447-1.342
      L39.547,41.63z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M16.853,24.551l-0.919-0.394c-0.509-0.218-1.097,0.017-1.313,0.525
      c-0.218,0.507,0.018,1.096,0.524,1.313l0.919,0.394c0.129,0.055,0.263,0.082,0.395,0.082c0.388,0,0.757-0.228,0.919-0.606
      C17.596,25.356,17.36,24.769,16.853,24.551z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M13.177,22.975l-0.919-0.394c-0.509-0.216-1.097,0.018-1.313,0.525
      c-0.218,0.507,0.018,1.095,0.524,1.313l0.919,0.394c0.129,0.055,0.263,0.082,0.395,0.082c0.388,0,0.757-0.228,0.919-0.606
      C13.919,23.781,13.683,23.192,13.177,22.975z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M29.863,10.5c-0.553,0-1,0.448-1,1v1c0,0.552,0.447,1,1,1s1-0.448,1-1v-1
      C30.863,10.948,30.416,10.5,29.863,10.5z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M29.863,14.5c-0.553,0-1,0.448-1,1v1c0,0.552,0.447,1,1,1s1-0.448,1-1v-1
      C30.863,14.948,30.416,14.5,29.863,14.5z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M43.792,24.157l-0.919,0.394c-0.507,0.218-0.742,0.806-0.524,1.313
      c0.162,0.379,0.531,0.606,0.919,0.606c0.132,0,0.266-0.026,0.395-0.082l0.919-0.394c0.507-0.217,0.742-0.806,0.524-1.313
      C44.888,24.173,44.3,23.938,43.792,24.157z"
                        />
                        <path
                          style={{ fill: "#38454F" }}
                          d="M48.782,23.106c-0.218-0.509-0.806-0.742-1.313-0.525l-0.919,0.394
      c-0.507,0.217-0.742,0.806-0.524,1.313c0.162,0.379,0.531,0.606,0.919,0.606c0.132,0,0.266-0.026,0.395-0.082l0.919-0.394
      C48.765,24.201,49,23.613,48.782,23.106z"
                        />
                      </g>
                      <path
                        style={{ fill: "#435159" }}
                        d="M22.345,1.49l-2.497,3.59L29.863,11.5l9-6.882l-2.266-3.24c-2.215-0.557-4.531-0.859-6.915-0.874
    C27.145,0.52,24.687,0.863,22.345,1.49z"
                      />
                      <path
                        style={{ fill: "#435159" }}
                        d="M49.493,12.5l-1.63,11l10.007,6.077l0.603-1.151c-0.209-5.719-2.071-11.014-5.126-15.422L49.493,12.5
    z"
                      />
                      <path
                        style={{ fill: "#435159" }}
                        d="M50.666,49.314l0.197-4.81l-11-0.004L35.07,55.105l4.146,1.722
    C43.622,55.26,47.534,52.658,50.666,49.314z"
                      />
                      <path
                        style={{ fill: "#435159" }}
                        d="M20.863,44.5l-12,0.004l0.214,5.208c3.114,3.202,6.96,5.685,11.27,7.182l4.309-1.789L20.863,44.5z"
                      />
                      <path
                        style={{ fill: "#435159" }}
                        d="M11.863,23.5l-1.63-11l-4.254,0.556c-2.92,4.233-4.743,9.278-5.061,14.729l0.939,1.792L11.863,23.5z"
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
            <div className=" bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-6 py-5">
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
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    width="40px"
                    height="40px"
                    viewBox="0 0 923.151 923.151"
                    xmlSpace="preserve"
                    className="w-6 h-6"
                    fill="currentColor"
                  >
                    <g>
                      <g>
                        <path
                          d="M28.543,898.924c-19.766,16.963-14.832,27.49,10.878,23.312c91.877-14.93,267.75-48.025,359.799-95.016
			c78.606-40.127,106.49,14.492,79.998,56.439c-9.812,15.537-3.264,24.322,14.454,19.449
			c101.449-27.891,316.05-110.889,374.075-323.176c2.648-9.688-1.834-22.586-9.852-28.633l-3.323-2.508
			c-6.67,7.953-13.692,15.65-21.099,23.057c-32.368,32.369-70.069,57.785-112.055,75.543
			c-43.484,18.393-89.658,27.719-137.24,27.719s-93.756-9.326-137.24-27.719c-41.986-17.758-79.686-43.174-112.055-75.543
			c-32.369-32.367-57.785-70.068-75.543-112.055c-18.392-43.483-27.718-89.657-27.718-137.24c0-47.582,9.326-93.756,27.718-137.24
			c9.037-21.367,20.069-41.617,32.98-60.626l-2.871-2.166c-8.851-6.676-22.778-6.019-30.967,1.454
			C211.8,166.582,74.808,320.625,42.488,683.764c-1.592,17.887,9.228,24.295,24.204,14.387
			c19.859-13.139,46.736-23.535,66.734-3.361C162.822,724.445,100.919,836.814,28.543,898.924z"
                        />
                        <path
                          d="M584.18,645.111c98.811,0,187.227-44.447,246.395-114.418c47.504-56.178,76.161-128.806,76.161-208.138
			C906.735,144.413,762.322,0,584.18,0C472.59,0,374.24,56.67,316.326,142.797c-34.54,51.366-54.703,113.207-54.703,179.759
			C261.625,500.697,406.037,645.111,584.18,645.111z M874.922,350.992c0.135,0.124,0.277,0.236,0.42,0.35
			c-2.85,29.344-10.07,57.858-21.584,85.081c-3.732,8.823-7.877,17.419-12.416,25.773c-0.2,0.016-0.401,0.029-0.602,0.061
			l-84.267,12.543l-32.812,4.883l-53.992-70.36l-1.422-1.852l35.193-108.312l84.855-27.881L874.922,350.992z M599.18,112.495
			l102.496-57.399c0.173-0.097,0.336-0.205,0.5-0.314c33.177,14.633,63.063,35.096,88.872,60.904
			c3.74,3.741,7.357,7.576,10.874,11.486c-0.043,0.164-0.091,0.326-0.123,0.494L779.191,242.69l-87.745,28.831l-92.268-67.036
			L599.18,112.495L599.18,112.495z M647.643,429.896l52.821,68.833l-45.616,107.279c-0.079,0.188-0.145,0.377-0.209,0.568
			c-22.886,5.662-46.45,8.535-70.46,8.535s-47.573-2.873-70.46-8.535c-0.064-0.191-0.129-0.381-0.208-0.568l-45.615-107.279
			l52.821-68.833H647.643L647.643,429.896z M377.312,115.687c25.809-25.809,55.696-46.271,88.872-60.904
			c0.164,0.108,0.328,0.217,0.5,0.314l102.496,57.397v91.99l-87.138,63.309l-5.13,3.727l-87.743-28.831l-10.373-52.774
			l-12.234-62.249c-0.033-0.167-0.08-0.33-0.123-0.494C369.953,123.263,373.57,119.428,377.312,115.687z M327.019,462.195
			c-4.54-8.354-8.684-16.95-12.416-25.773c-11.514-27.224-18.735-55.736-21.584-85.081c0.142-0.114,0.285-0.225,0.42-0.35
			l86.626-79.715l84.855,27.881l35.191,108.312l-55.414,72.212l-117.078-17.426C327.419,462.225,327.219,462.209,327.019,462.195z"
                        />
                      </g>
                    </g>
                  </svg>
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
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl transition-all duration-300 border border-gray-100 hover:shadow-lg transform hover:scale-102"
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
                              : "bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-900"
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
