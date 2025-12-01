// src/pages/jugadores/Jugadores.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const Jugadores = () => {
  const navigate = useNavigate();
  const [jugadores, setJugadores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("Todos");
  const [filtroPosicion, setFiltroPosicion] = useState("Todas");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar jugadores
      const responseJugadores = await fetch(API_ENDPOINTS.jugadores);
      const dataJugadores = await responseJugadores.json();

      if (dataJugadores.isSuccess) {
        setJugadores(dataJugadores.data);
      }

      // Cargar equipos para el filtro
      const responseEquipos = await fetch(API_ENDPOINTS.equipos);
      const dataEquipos = await responseEquipos.json();

      if (dataEquipos.isSuccess) {
        setEquipos(dataEquipos.data);
      }
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  const jugadoresFiltrados = jugadores.filter((jugador) => {
    const coincideBusqueda =
      jugador.usua_NombreCompleto
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      jugador.equi_Nombre?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEquipo =
      filtroEquipo === "Todos" || jugador.equi_Nombre === filtroEquipo;

    const coincidePosicion =
      filtroPosicion === "Todas" || jugador.juga_Posicion === filtroPosicion;

    return coincideBusqueda && coincideEquipo && coincidePosicion;
  });

  const posiciones = [
    "Todas",
    ...new Set(
      jugadores.filter((j) => j.juga_Posicion).map((j) => j.juga_Posicion)
    ),
  ];

  const estadisticas = {
    total: jugadores.length,
    delanteros: jugadores.filter((j) => j.juga_Posicion === "Delantero").length,
    mediocampistas: jugadores.filter((j) => j.juga_Posicion === "Mediocampista")
      .length,
    defensas: jugadores.filter((j) => j.juga_Posicion === "Defensa").length,
    porteros: jugadores.filter((j) => j.juga_Posicion === "Portero").length,
  };

  const getPosicionIcon = (posicion) => {
    const icons = {
      Delantero: (
        <svg
          width="50px"
          height="50px"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M133.401 175.556C162.585 159.866 211.524 147.532 218.707 148.728M218.707 148.728L194.762 215.225C187.029 228.673 166.776 260.433 162.585 262.226C157.347 264.468 107.211 219.707 102.721 219.707C99.1293 219.707 92.7438 228.673 90 233.156M218.707 148.728C223.129 149.463 242.787 155.995 262.857 164.577M310 193.557C304.682 184.454 283.551 173.426 262.857 164.577M262.857 164.577C255.125 184.946 232.925 230.168 232.925 233.156C232.925 236.892 286.054 249.594 288.299 257.812C290.544 266.031 274.082 340 277.823 340C280.816 340 293.039 337.011 298.775 335.517"
            stroke="#ffff"
            strokeOpacity={0.9}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M238.824 75.0932C287.194 24.5853 328.007 107.672 278.589 123.541C239.53 136.085 211.497 102.547 242.335 72.8382"
            stroke="#ffff"
            strokeOpacity={0.9}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M190.455 294.359C232.875 249.293 268.666 323.429 225.328 337.588C191.074 348.781 166.489 318.855 193.534 292.347"
            stroke="#ffff"
            strokeOpacity={0.9}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      Mediocampista: (
        <svg
          width="50px"
          height="50px"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width={48} height={48} fill="white" fillOpacity={0.01} />
          <path
            d="M19.036 44.0001C18.0561 40.8045 16.5778 38.4222 14.6011 36.8532C11.636 34.4997 6.92483 35.9624 5.18458 33.5349C3.44433 31.1073 6.40382 26.6431 7.44234 24.009C8.48086 21.375 3.46179 20.4436 4.04776 19.6958C4.43842 19.1973 6.97471 17.7587 11.6567 15.3801C12.987 7.79346 17.9008 4.00014 26.3982 4.00014C39.1441 4.00014 44 14.8061 44 21.679C44 28.552 38.1201 35.9563 29.7441 37.5528C28.9951 38.6436 30.0754 40.7927 32.9848 44.0001"
            stroke="#ffff"
            strokeWidth={4.66685}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.4997 14.5C18.8464 17.0342 19.0408 18.8138 20.0829 19.8385C21.125 20.8633 22.9011 21.5334 25.4112 21.8489C24.8417 25.1176 25.5361 26.6511 27.4942 26.4493C29.4524 26.2475 30.6289 25.4338 31.0239 24.0083C34.0842 24.8684 35.7428 24.1486 35.9997 21.8489C36.3852 18.3993 34.525 15.6475 33.7624 15.6475C32.9997 15.6475 31.0239 15.5547 31.0239 14.5C31.0239 13.4452 28.7159 12.8493 26.6329 12.8493C24.5499 12.8493 25.8035 11.4452 22.9432 12C21.0363 12.3698 19.8885 13.2031 19.4997 14.5Z"
            fill="#ffff"
            stroke="#ffff"
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <path
            d="M30.5002 25.5001C29.4833 26.1311 28.0878 27.1804 27.5002 28.0001C26.0313 30.0496 24.8398 31.2975 24.5791 32.6082"
            stroke="#ffff"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
      ),
      Defensa: (
        <svg
          height="50px"
          width="50px"
          id="_x32_"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xmlSpace="preserve"
        >
          <style type="text/css">{"\n\t.st0{fill:#ffff;}\n"}</style>
          <g>
            <path
              className="st0"
              d="M392.08,216.693c-0.489,0.91-0.971,1.837-1.74,2.616l-22.262,22.254c-4.216,4.225-11.057,4.225-15.282,0 c-4.225-4.216-4.225-11.057,0-15.282l15.903-15.911c-8.091-2.528-16.41-5.45-24.834-8.686c-0.131,0.14-0.175,0.323-0.306,0.454 l-25.429,25.429c-4.225,4.216-11.066,4.216-15.291,0c-4.225-4.234-4.225-11.065,0-15.299l19.411-19.411 c-8.634-3.717-17.18-7.61-25.473-11.582c-0.534,1.234-1.268,2.406-2.274,3.421l-25.429,25.42c-4.216,4.224-11.066,4.224-15.291,0 c-4.216-4.225-4.216-11.066,0-15.282l23.304-23.312c-22.481-11.512-41.524-22.551-52.363-29.786 c-26.811-17.88-31.92-8.931-43.414-1.277c-11.494,7.654-38.306,41.586-80.442,41.586c-37.028,0-49.738-12.702-63.84-28.806 C19.148,132.813,0,138.193,0,166.561c0,16.594,0,132.542,0,155.53c0,20.88,8.512,35.392,38.76,37.885l1.006,12.308 c0.385,4.74,4.348,8.398,9.106,8.398h15.176c4.75,0,8.722-3.658,9.106-8.398l1.085-13.323c10.48-1.084,21.064-2.642,32.83-4.224 l1.067,13.069c0.385,4.74,4.357,8.398,9.106,8.398h15.178c4.749,0,8.721-3.658,9.106-8.398l1.39-17.05 c11.013-0.909,23.172-1.61,37.116-1.88c1.977-0.044,3.91-0.018,5.817,0.026l1.548,18.904c0.385,4.74,4.356,8.398,9.106,8.398 h15.177c4.758,0,8.721-3.658,9.106-8.398l1.164-14.181c11.643,2.266,24.476,4.89,40.623,6.841l0.962,11.818 c0.385,4.74,4.356,8.398,9.106,8.398h15.177c4.758,0,8.721-3.658,9.106-8.398l0.752-9.212c12.325,0.385,26.242,0.324,42.154-0.402 l0.788,9.614c0.385,4.74,4.356,8.398,9.106,8.398h15.177c4.749,0,8.721-3.658,9.106-8.398l0.997-12.204 c12.001-1.215,23.102-2.781,33.24-4.714l0.743,9.08c0.385,4.74,4.357,8.398,9.106,8.398h15.177c4.758,0,8.721-3.657,9.106-8.398 l1.496-18.344C494.995,328.451,512,299.549,512,272.293C512,235.597,451.074,230.532,392.08,216.693z M63.27,220.306 c-11.94,0-46.283,0-46.283,0s0-44.779,0-50.01c0-5.23,5.231-8.966,11.95-2.991c3,2.668,27.608,25.384,37.316,29.863 C75.963,201.647,75.21,220.306,63.27,220.306z M137.275,314.359l-56.09-76.138h31.351l56.09,76.138H137.275z M201.044,314.359 l-56.089-76.138h31.351l56.089,76.138H201.044z M268.225,314.359l-56.089-76.138h31.351l56.089,76.138H268.225z"
            />
          </g>
        </svg>
      ),
      Portero: (
        <svg
          width="50px"
          height="50px"
          viewBox="0 0 32 32"
          enableBackground="new 0 0 32 32"
          xmlSpace="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g id="ball" />
          <g id="wistle" />
          <g id="pitch" />
          <g id="goal" />
          <g id="socks" />
          <g id="shoe" />
          <g id="jersey" />
          <g id="bottle" />
          <g id="shorts" />
          <g id="corner" />
          <g id="winner" />
          <g id="trophy" />
          <g id="substitution" />
          <g id="medal_award" />
          <g id="strategy" />
          <g id="card" />
          <g id="gloves">
            <path
              d="M20,19h-8c-0.553,0-1-0.448-1-1c0-0.552,0.447-1,1-1h8c0.553,0,1,0.448,1,1C21,18.552,20.553,19,20,19z"
              fill="#ffff"
            />
            <path
              d="M30,31h-8c-0.553,0-1-0.448-1-1s0.447-1,1-1h8c0.553,0,1,0.448,1,1S30.553,31,30,31z M20,30   c0-0.552-0.447-1-1-1h-2c-0.553,0-1,0.448-1,1s0.447,1,1,1h2C19.553,31,20,30.552,20,30z M15,30c0-0.552-0.447-1-1-1H2   c-0.553,0-1,0.448-1,1s0.447,1,1,1h12C14.553,31,15,30.552,15,30z"
              fill="#ffff"
            />
            <path
              d="M28.707,8.293c-1.383-1.382-3.031-1.382-4.414,0c-0.076,0.076-0.14,0.164-0.188,0.26L24,8.764V6   c0-0.155-0.036-0.309-0.106-0.447C23.641,5.045,22.868,3.5,21.5,3.5c-1.368,0-2.141,1.545-2.395,2.053C19.036,5.691,19,5.845,19,6   V5c0-2.763-1.256-4-2.5-4C15.256,1,14,2.237,14,5v1c0-0.155-0.036-0.309-0.106-0.447C13.641,5.045,12.868,3.5,11.5,3.5   c-1.368,0-2.141,1.545-2.395,2.053C9.036,5.691,9,5.845,9,6v4.772L8.848,10.47C8.305,9.603,5.927,8.523,4.452,8.946   C3.543,9.207,3,9.975,3,11c0,2.221,2.666,5.888,3.219,6.625L10,22.351V26c0,0.552,0.447,1,1,1h10c0.553,0,1-0.448,1-1v-3.638   l4.769-5.722c0.089-0.107,0.154-0.231,0.193-0.365l2-7C29.061,8.925,28.964,8.55,28.707,8.293z M20,25h-8v-2h8V25z M25.097,15.522   L20.531,21H11.48L7.8,16.4C6.638,14.85,5,12.149,5,11c0-0.074,0.008-0.12,0.004-0.134c0.39-0.157,1.735,0.317,2.156,0.691   l0.945,1.89C8.275,13.786,8.621,14,9,14h1c0.553,0,1-0.448,1-1V6.245c0.234-0.43,0.408-0.622,0.5-0.703   c0.092,0.081,0.266,0.273,0.5,0.703V11c0,0.552,0.447,1,1,1h2c0.553,0,1-0.448,1-1V5c0-1.447,0.436-1.958,0.456-2.007   C16.563,3.042,17,3.553,17,5v6c0,0.552,0.447,1,1,1h2c0.553,0,1-0.448,1-1V6.245c0.234-0.43,0.408-0.622,0.5-0.703   c0.092,0.081,0.266,0.273,0.5,0.703V11c0,0.552,0.447,1,1,1h1c0.379,0,0.725-0.214,0.894-0.553l0.923-1.846   c0.393-0.361,0.689-0.443,1.041-0.245L25.097,15.522z"
              fill="#ffff"
            />
          </g>
          <g id="stadium" />
          <g id="keeper" />
          <g id="time" />
          <g id="horns" />
          <g id="flag" />
          <g id="referee" />
          <g id="player" />
          <g id="injury" />
          <g id="supporter" />
          <g id="coach" />
          <g id="cone" />
          <g id="captain" />
          <g id="match" />
          <g id="score" />
          <g id="celender" />
          <g id="grass" />
          <g id="game" />
          <g id="subsitutions" />
          <g id="bench" />
        </svg>
      ),
    };
    return icons[posicion] || "👤";
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Gestión de Jugadores
              </h1>
              <p className="text-gray-600 mt-1">
                Consulta la información de todos los jugadores registrados
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold">Total</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.total}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm font-semibold">Delanteros</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.delanteros}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm font-semibold">
                Mediocampistas
              </p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.mediocampistas}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-semibold">Defensas</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.defensas}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-semibold">Porteros</p>
              <p className="text-3xl font-black text-gray-900">
                {estadisticas.porteros}
              </p>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="grid sm:grid-cols-3 gap-4">
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
                  placeholder="Buscar jugador o equipo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <select
                value={filtroEquipo}
                onChange={(e) => setFiltroEquipo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-semibold"
              >
                <option value="Todos">Todos los equipos</option>
                {equipos.map((equipo) => (
                  <option key={equipo.equi_Id} value={equipo.equi_Nombre}>
                    {equipo.equi_Nombre}
                  </option>
                ))}
              </select>

              <select
                value={filtroPosicion}
                onChange={(e) => setFiltroPosicion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent font-semibold"
              >
                {posiciones.map((posicion) => (
                  <option key={posicion} value={posicion}>
                    {posicion === "Todas" ? "Todas las posiciones" : posicion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grid de jugadores */}
        {jugadoresFiltrados.length === 0 ? (
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
              {busqueda ||
              filtroEquipo !== "Todos" ||
              filtroPosicion !== "Todas"
                ? "No se encontraron jugadores con esos criterios"
                : "No hay jugadores registrados"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jugadoresFiltrados.map((jugador) => (
              <div
                key={jugador.juga_Id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Header con número */}
                <div className="bg-gradient-to-r bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 text-white relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-600 font-black text-2xl shadow-lg">
                        #{jugador.juga_Numero || "?"}
                      </div>
                      <div className="text-4xl">
                        {getPosicionIcon(jugador.juga_Posicion)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {jugador.usua_NombreCompleto}
                    </h3>
                    <p className="text-sm text-blue-600 font-bold">
                      {jugador.equi_Nombre}
                    </p>
                  </div>

                  {jugador.juga_Posicion && (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span className="font-bold text-gray-700">
                        {jugador.juga_Posicion}
                      </span>
                    </div>
                  )}

                  {jugador.juga_FechaInscripcion && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
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
                        Inscrito:{" "}
                        {new Date(
                          jugador.juga_FechaInscripcion
                        ).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jugadores;
