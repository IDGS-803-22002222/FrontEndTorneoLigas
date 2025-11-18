// Configuración centralizada de la API
const API_CONFIG = {
  baseURL: "https://localhost:7089", // Cambia solo aquí si el puerto cambia
};

// Construir URLs completas
export const API_ENDPOINTS = {
  // Auth
  login: `${API_CONFIG.baseURL}/api/auth/login`,
  register: `${API_CONFIG.baseURL}/api/auth/register`,

  // Equipos
  equipos: `${API_CONFIG.baseURL}/api/equipos`,
  equipoById: (id) => `${API_CONFIG.baseURL}/api/equipos/${id}`,
  equipoQR: (id) => `${API_CONFIG.baseURL}/api/equipos/qr/${id}`,

  // Torneos
  torneos: `${API_CONFIG.baseURL}/api/torneos`,
  torneoById: (id) => `${API_CONFIG.baseURL}/api/torneos/${id}`,
  inscribirEquipo: `${API_CONFIG.baseURL}/api/torneos/inscribir-equipo`,
  equiposTorneo: (id) => `${API_CONFIG.baseURL}/api/torneos/${id}/equipos`,
  cambiarEstadoTorneo: (id) => `${API_CONFIG.baseURL}/api/torneos/${id}/estado`,

  // QR Capitanes (TIPO 1: Admin genera para convertir usuarios en capitanes)
  generarQRCapitan: `${API_CONFIG.baseURL}/api/qr/generar-capitan`,
  validarQRCapitan: `${API_CONFIG.baseURL}/api/qr/validar-capitan`,
  listarQRCapitanes: `${API_CONFIG.baseURL}/api/qr/capitanes`,

  // QR Equipos (TIPO 2: Capitán genera para inscribir jugadores)
  generarQREquipo: (equipoId) =>
    `${API_CONFIG.baseURL}/api/qr/generar-equipo/${equipoId}`,
  listarQREquipos: `${API_CONFIG.baseURL}/api/qr/equipos`,
  obtenerQREquipo: (equipoId) =>
    `${API_CONFIG.baseURL}/api/qr/equipo/${equipoId}`,
};

export default API_CONFIG;
