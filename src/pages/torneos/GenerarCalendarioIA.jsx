import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";
import Alert from "../../components/Alert";

const GenerarCalendarioIA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [torneo, setTorneo] = useState(null);
  const [costoEstimado, setCostoEstimado] = useState(null);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [yaGenerado, setYaGenerado] = useState(false); // Nuevo estado
  const [alerta, setAlerta] = useState({
    visible: false,
    type: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const confirmarGnerarCalendario = () => {
    setAlerta({
      visible: true,
      type: "confirm",
      message:
        "¿Estás seguro de generar el calendario con IA? Esto creará todos los partidos del torneo automáticamente.",
      onConfirm: () => handleGenerar(),
      onCancel: () => setAlerta({ visible: false }),
    });
  };

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      // Cargar información del torneo
      const responseTorneo = await fetch(API_ENDPOINTS.torneoById(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataTorneo = await responseTorneo.json();

      if (dataTorneo.isSuccess) {
        setTorneo(dataTorneo.data);
      }

      // Cargar costo estimado y estado actual
      const responseCosto = await fetch(API_ENDPOINTS.costoEstimadoIA(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataCosto = await responseCosto.json();

      if (dataCosto.isSuccess) {
        setCostoEstimado(dataCosto.data);
        if (dataCosto.data.yaTienePartidos) {
          setYaGenerado(true);
        }
      }
    } catch (err) {
      setError("Error al cargar información. Asegúrate de ser Administrador.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleGenerar = async () => {
    setGenerando(true);
    setError("");
    setResultado(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.generarCalendarioIA(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.isSuccess) {
        setAlerta({
          visible: true,
          type: "success",
          message: "Calendario generado exitosamente con IA.",
        });
        setResultado(data);
        setYaGenerado(true); // Actualizamos estado inmediatamente
        setTimeout(() => {
          // Opcional: Redirigir automáticamente
        }, 2000);
      } else {
        setError(data.message || "Error al generar calendario");
        if (data.errores) {
          console.error(data.errores);
        }
      }
    } catch (err) {
      setError("Error de conexión al generar calendario");
      console.error(err);
    } finally {
      setGenerando(false);
    }
  };

  if (cargando) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
        <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => navigate("/torneos")}
              className="text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2 mb-4"
            >
              ← Volver a Torneos
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  to-white p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-3xl font-black">
                    Generar Calendario con IA
                  </h1>
                  <p className="text-purple-100 mt-1">
                    Powered by Claude Haiku 3.5 by Anthropic
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-6">
              {/* Aviso si ya generado */}
              {yaGenerado && !resultado && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">✅</div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-900">
                        Calendario ya existe
                      </h3>
                      <p className="text-blue-800">
                        Este torneo ya cuenta con partidos programados.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resultado Exitoso de la generación actual */}
              {resultado && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                      ✓
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-green-900 mb-2">
                        ¡Calendario Generado Exitosamente!
                      </h3>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>
                          <span className="font-bold">Partidos creados:</span>{" "}
                          {resultado.data.totalPartidos}
                        </p>
                        <p>
                          <span className="font-bold">Jornadas:</span>{" "}
                          {resultado.data.jornadas}
                        </p>
                        {resultado.data.explicacion && (
                          <p className="mt-3 italic">
                            "{resultado.data.explicacion}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl">
                  <p className="font-bold mb-1">Error al generar</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Información del Torneo */}
              {torneo && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-purple-200">
                  <h2 className="text-xl font-black text-gray-900 mb-3">
                    📋 Información del Torneo
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Nombre
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {torneo.torn_Nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">
                        Equipos
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {costoEstimado?.numeroEquipos || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4 border-t mt-6">
                <button
                  onClick={() => navigate("/torneos")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl font-bold transition text-lg"
                >
                  Volver
                </button>
                {yaGenerado ? (
                  // BOTÓN VER PARTIDOS (Si ya existe)
                  <button
                    // IMPORTANTE: Asegúrate de tener esta ruta configurada en tu router
                    // Si no existe, puedes enviarlo a `/torneos` por ahora
                    onClick={() => navigate(`/torneos`)}
                    className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  text-white px-6 py-4 rounded-xl font-bold transition text-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Ver Partidos</span>
                  </button>
                ) : (
                  // BOTÓN GENERAR (Si NO existe)
                  <button
                    onClick={confirmarGnerarCalendario}
                    disabled={generando || !costoEstimado}
                    className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  text-white px-6 py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-3"
                  >
                    {generando ? (
                      <span>Generando...</span>
                    ) : (
                      <>
                        <span className="text-2xl">🤖</span>
                        <span>Generar con IA</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default GenerarCalendarioIA;
