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
      Delantero: "⚽",
      Mediocampista: "🎯",
      Defensa: "🛡️",
      Portero: "🥅",
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white relative">
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
