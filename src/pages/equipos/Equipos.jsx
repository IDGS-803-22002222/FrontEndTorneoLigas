import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const Equipos = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [qrModalAbierto, setQrModalAbierto] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.equipos);
      const data = await response.json();

      if (data.isSuccess) {
        setEquipos(data.data);
      } else {
        setError("Error al cargar equipos");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const eliminarEquipo = async (id) => {
    if (!window.confirm("¿Eliminar este equipo?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.equipoById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.isSuccess) {
        cargarEquipos();
      } else {
        alert("Error al eliminar equipo");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const abrirModalQR = (equipo) => {
    setEquipoSeleccionado(equipo);
    setQrModalAbierto(true);
  };

  const cerrarModalQR = () => {
    setQrModalAbierto(false);
    setEquipoSeleccionado(null);
  };

  const copiarQR = () => {
    if (equipoSeleccionado?.equi_CodigoQR) {
      navigator.clipboard.writeText(equipoSeleccionado.equi_CodigoQR);
      alert("¡Código QR copiado al portapapeles!");
    }
  };

  const descargarQR = () => {
    if (!equipoSeleccionado) return;

    // Crear un SVG del QR usando la API de QRServer
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      equipoSeleccionado.equi_CodigoQR
    )}`;

    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `QR-${equipoSeleccionado.equi_Nombre.replace(
      /\s+/g,
      "-"
    )}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Equipos
            </h1>
            <p className="text-gray-600 mt-1">
              Gestiona los equipos del sistema
            </p>
          </div>
          <Link
            to="/equipos/crear"
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
            Nuevo Equipo
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grid de equipos */}
        {equipos.length === 0 ? (
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500 text-lg font-semibold">
              No hay equipos registrados
            </p>
            <Link
              to="/equipos/crear"
              className="text-blue-600 hover:text-blue-700 font-bold mt-2 inline-block"
            >
              Crear el primer equipo
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipos.map((equipo) => (
              <div
                key={equipo.equi_Id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Header con logo */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative">
                  <div className="flex items-start gap-4">
                    {/* Logo del equipo */}
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      {equipo.equi_Logo ? (
                        <img
                          src={equipo.equi_Logo}
                          alt={equipo.equi_Nombre}
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                              </svg>
                            `;
                          }}
                        />
                      ) : (
                        <svg
                          className="w-10 h-10 text-blue-600"
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
                      )}
                    </div>

                    {/* Nombre y colores */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black mb-1 break-words">
                        {equipo.equi_Nombre}
                      </h3>
                      {equipo.equi_ColorUniforme && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          <p className="text-blue-100 text-sm">
                            {equipo.equi_ColorUniforme}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cuerpo */}
                <div className="p-6 space-y-4">
                  {/* Botón de QR destacado */}
                  {equipo.equi_CodigoQR && (
                    <button
                      onClick={() => abrirModalQR(equipo)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
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
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      Ver Código QR
                    </button>
                  )}

                  {/* Botones de acción */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/equipos/editar/${equipo.equi_Id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold transition text-center text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => eliminarEquipo(equipo.equi_Id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-lg font-bold transition text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de QR */}
      {qrModalAbierto && equipoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    {equipoSeleccionado.equi_Logo ? (
                      <img
                        src={equipoSeleccionado.equi_Logo}
                        alt={equipoSeleccionado.equi_Nombre}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">
                      {equipoSeleccionado.equi_Nombre}
                    </h3>
                    <p className="text-blue-100 text-sm">Código QR</p>
                  </div>
                </div>
                <button
                  onClick={cerrarModalQR}
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

            {/* Cuerpo del modal */}
            <div className="p-6 space-y-6">
              {/* Imagen del QR */}
              <div className="bg-white border-4 border-dashed border-gray-300 rounded-2xl p-6 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    equipoSeleccionado.equi_CodigoQR
                  )}`}
                  alt="Código QR"
                  className="w-64 h-64"
                />
              </div>

              {/* Código de texto */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-700 mb-2">
                  Código de Inscripción
                </p>
                <p className="text-sm font-mono text-gray-900 break-all bg-white p-3 rounded-lg border border-gray-200">
                  {equipoSeleccionado.equi_CodigoQR}
                </p>
              </div>

              {/* Instrucciones */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">
                      ¿Cómo usar este QR?
                    </p>
                    <p className="text-xs text-blue-700">
                      Los jugadores deben escanear este código QR desde la app
                      móvil para inscribirse al equipo. También pueden ingresar
                      manualmente el código mostrado arriba.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copiarQR}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar
                </button>
                <button
                  onClick={descargarQR}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Equipos;
