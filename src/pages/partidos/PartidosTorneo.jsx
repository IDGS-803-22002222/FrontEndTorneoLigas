import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const PartidosTorneo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partidos, setPartidos] = useState([]);
  const [torneo, setTorneo] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Cargar datos del torneo
      const resTorneo = await fetch(API_ENDPOINTS.torneoById(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataTorneo = await resTorneo.json();
      if (dataTorneo.isSuccess) setTorneo(dataTorneo.data);

      // 2. Cargar partidos del torneo
      const resPartidos = await fetch(API_ENDPOINTS.partidosPorTorneo(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataPartidos = await resPartidos.json();

      if (dataPartidos.isSuccess) {
        setPartidos(dataPartidos.data);
      }
    } catch (error) {
      console.error("Error cargando partidos:", error);
    } finally {
      setCargando(false);
    }
  };

  // Agrupar partidos por jornada
  const partidosPorJornada = partidos.reduce((acc, partido) => {
    const jornada = partido.part_Jornada || 1;
    if (!acc[jornada]) acc[jornada] = [];
    acc[jornada].push(partido);
    return acc;
  }, {});

  if (cargando)
    return (
      <Layout>
        <div className="text-center p-10">Cargando partidos...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              {torneo?.torn_Nombre || "Torneo"}
            </h1>
            <p className="text-gray-600">Calendario de Partidos</p>
          </div>
          <button
            onClick={() => navigate("/torneos")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold"
          >
            Volver
          </button>
        </div>

        {partidos.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-lg text-center">
            <p className="text-gray-500 text-lg">
              No hay partidos programados aún.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(partidosPorJornada).map((jornada) => (
              <div
                key={jornada}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="bg-blue-600 px-6 py-3">
                  <h3 className="text-white font-bold text-lg">
                    Jornada {jornada}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {partidosPorJornada[jornada].map((partido) => (
                    <div
                      key={partido.part_Id}
                      className="p-4 hover:bg-gray-50 transition flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                      {/* Fecha y Sede */}
                      <div className="text-center md:text-left min-w-[150px]">
                        <p className="font-bold text-gray-700">
                          {new Date(
                            partido.part_FechaPartido
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            partido.part_FechaPartido
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          📍 {partido.sede_Nombre}
                        </p>
                      </div>

                      {/* Marcador */}
                      <div className="flex items-center gap-6 flex-1 justify-center">
                        <div className="text-right flex-1">
                          <p className="font-bold text-lg text-gray-900">
                            {partido.equi_Nombre_Local}
                          </p>
                        </div>

                        <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono font-black text-xl min-w-[100px] text-center border border-gray-200">
                          {partido.part_Estado === "Finalizado" ? (
                            <span>
                              {partido.part_GolesLocal} -{" "}
                              {partido.part_GolesVisitante}
                            </span>
                          ) : (
                            <span className="text-gray-400">VS</span>
                          )}
                        </div>

                        <div className="text-left flex-1">
                          <p className="font-bold text-lg text-gray-900">
                            {partido.equi_Nombre_Visitante}
                          </p>
                        </div>
                      </div>

                      {/* Estado y Arbitro */}
                      <div className="text-center md:text-right min-w-[150px]">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-block mb-2 ${
                            partido.part_Estado === "Finalizado"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {partido.part_Estado}
                        </span>
                        {partido.arbitro_Nombre && (
                          <p className="text-xs text-gray-500">
                            👮‍♂️ {partido.arbitro_Nombre}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PartidosTorneo;
