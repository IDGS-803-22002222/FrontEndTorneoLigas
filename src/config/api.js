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
};

export default API_CONFIG;
