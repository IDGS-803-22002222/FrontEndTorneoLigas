// Configuración centralizada de la API
const API_CONFIG = {
  baseURL: "https://webservicescm.epcucm.com.mx:50452/WS-Torneos/api",
};

// Construir URLs completas
export const API_ENDPOINTS = {
  //Usuarios
  usuarios: `${API_CONFIG.baseURL}/usuarios`,
  usuariosPorRol: (rolId) => `${API_CONFIG.baseURL}/usuarios/rol/${rolId}`,

  // Auth
  login: `${API_CONFIG.baseURL}/auth/login`,
  register: `${API_CONFIG.baseURL}auth/register`,

  // Equipos
  equipos: `${API_CONFIG.baseURL}/equipos`,
  equipoById: (id) => `${API_CONFIG.baseURL}/equipos/${id}`,
  equipoQR: (id) => `${API_CONFIG.baseURL}/equipos/qr/${id}`,

  // Torneos
  torneos: `${API_CONFIG.baseURL}/torneos`,
  torneoById: (id) => `${API_CONFIG.baseURL}/torneos/${id}`,
  inscribirEquipo: `${API_CONFIG.baseURL}/torneos/inscribir-equipo`,
  equiposTorneo: (id) => `${API_CONFIG.baseURL}/torneos/${id}/equipos`,
  cambiarEstadoTorneo: (id) => `${API_CONFIG.baseURL}/torneos/${id}/estado`,

  // QR Capitanes (TIPO 1: Admin genera para convertir usuarios en capitanes)
  generarQRCapitan: `${API_CONFIG.baseURL}/qr/generar-capitan`,
  validarQRCapitan: `${API_CONFIG.baseURL}/qr/validar-capitan`,
  listarQRCapitanes: `${API_CONFIG.baseURL}/qr/capitanes`,

  // QR Equipos (TIPO 2: Capitán genera para inscribir jugadores)
  generarQREquipo: (equipoId) =>
    `${API_CONFIG.baseURL}/qr/generar-equipo/${equipoId}`,
  listarQREquipos: `${API_CONFIG.baseURL}/qr/equipos`,
  obtenerQREquipo: (equipoId) => `${API_CONFIG.baseURL}/qr/equipo/${equipoId}`,

  // Sedes
  sedes: `${API_CONFIG.baseURL}/sedes`,
  sedeById: (id) => `${API_CONFIG.baseURL}/sedes/${id}`,
  crearSede: `${API_CONFIG.baseURL}/sedes`,
  editarSede: `${API_CONFIG.baseURL}/sedes`,
  eliminarSede: (id) => `${API_CONFIG.baseURL}/sedes/${id}`,
  // Jugadores
  jugadores: `${API_CONFIG.baseURL}/jugadores`,
  jugadoresPorEquipo: (equipoId) =>
    `${API_CONFIG.baseURL}/jugadores/equipo/${equipoId}`,
  //Endpoints de estadisticas
  estadisticasPartidos: (partidoId) =>
    `${API_CONFIG.baseURL}/Estaditicas/partido/${partidoId}`,
  estadisticasJugador: (jugadorId) =>
    `${API_CONFIG.baseURL}/Estaditicas/jugador/${jugadorId}`,
  Estadisticas: `${API_CONFIG.baseURL}/Estadisticas`,
  EstadisticasGoleadores: (torneoId) =>
    `${API_CONFIG.baseURL}/Estadisticas/goleadores?torneoId=${torneoId}`,
  EstadisticasTablaPocisiones: (torneoId) =>
    `${API_CONFIG.baseURL}/Estadisticas/tabla-posiciones/${torneoId}`,
  // Calendario IA
  generarCalendarioIA: (torneoId) =>
    `${API_CONFIG.baseURL}/CalendarioIA/generar/${torneoId}`,
  costoEstimadoIA: (torneoId) =>
    `${API_CONFIG.baseURL}/CalendarioIA/costo-estimado/${torneoId}`,
  partidos: `${API_CONFIG.baseURL}/partidos`,
  partidosPorTorneo: (id) => `${API_CONFIG.baseURL}/partidos/torneo/${id}`,
  partidoById: (id) => `${API_CONFIG.baseURL}/partidos/${id}`,
  editarPartido: `${API_CONFIG.baseURL}/partidos`,
  registrarResultado: `${API_CONFIG.baseURL}/partidos/resultado`,
  partidosFinalizados: (id) =>
    `${API_CONFIG.baseURL}/partidos/finalizados/${id}`,

  // Árbitros
  arbitros: `${API_CONFIG.baseURL}/arbitros`,
  arbitroById: (id) => `${API_CONFIG.baseURL}/arbitros/${id}`,
};

export default API_CONFIG;
