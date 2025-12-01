// src/pages/admin/GestionQR.jsx
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { API_ENDPOINTS } from "../../config/api";

const GestionQR = () => {
  const [activeTab, setActiveTab] = useState("capitanes");
  const [qrCapitanes, setQrCapitanes] = useState([]);
  const [qrEquipos, setQrEquipos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [qrGenerado, setQrGenerado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const token = localStorage.getItem("token");

      if (activeTab === "capitanes") {
        const response = await fetch(API_ENDPOINTS.listarQRCapitanes, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.isSuccess) setQrCapitanes(data.data);
      } else {
        const response = await fetch(API_ENDPOINTS.listarQREquipos, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.isSuccess) {
          const qrsPorEquipo = {};

          data.data.forEach((qr) => {
            const equipoId = qr.equi_Id;

            if (
              !qrsPorEquipo[equipoId] ||
              new Date(qr.inQR_FechaGeneracion) >
                new Date(qrsPorEquipo[equipoId].inQR_FechaGeneracion)
            ) {
              qrsPorEquipo[equipoId] = qr;
            }
          });

          const qrsFiltrados = Object.values(qrsPorEquipo);
          setQrEquipos(qrsFiltrados);
        }
      }
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setCargando(false);
    }
  };

  const generarQRCapitan = async () => {
    setCargando(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.generarQRCapitan, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.isSuccess) {
        setQrGenerado({
          tipo: "capitan",
          codigo: data.data,
        });
        setModalAbierto(true);
        cargarDatos();
      } else {
        setError(data.message || "Error al generar QR");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  };

  const copiarQR = () => {
    if (qrGenerado?.codigo) {
      navigator.clipboard.writeText(qrGenerado.codigo);
      alert("¡Código copiado al portapapeles!");
    }
  };

  const descargarQR = () => {
    if (!qrGenerado) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      qrGenerado.codigo
    )}`;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `QR-${qrGenerado.tipo}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estaExpirado = (fechaExpiracion) => {
    return new Date(fechaExpiracion) < new Date();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12  bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                Gestión de Códigos QR
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema dual de inscripción por códigos QR
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-900 mb-2">
                Sistema Dual de QR
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-bold text-black">
                    QR Tipo 1 - Capitanes:
                  </span>{" "}
                  Los administradores generan códigos QR que los usuarios
                  escanean desde la app Android para convertirse en capitanes de
                  equipo.
                </p>
                <p>
                  <span className="font-bold text-black">
                    QR Tipo 2 - Jugadores:
                  </span>{" "}
                  Los capitanes generan códigos QR de sus equipos que los
                  jugadores escanean para inscribirse (se gestiona desde la
                  sección de Equipos).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("capitanes")}
              className={`flex-1 px-6 py-4 font-bold text-sm sm:text-base transition ${
                activeTab === "capitanes"
                  ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-b-4 border-white -mb-0.5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                QR Capitanes
              </div>
            </button>
            <button
              onClick={() => setActiveTab("equipos")}
              className={`flex-1 px-6 py-4 font-bold text-sm sm:text-base transition ${
                activeTab === "equipos"
                  ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-b-4 border-white -mb-0.5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                QR Equipos
              </div>
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {activeTab === "capitanes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">
                    Códigos QR para Capitanes
                  </h2>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mostrarSoloActivos}
                        onChange={(e) =>
                          setMostrarSoloActivos(e.target.checked)
                        }
                        className="w-4 h-4 text-black rounded focus:ring-2 focus:ring-black"
                      />
                      Solo activos
                    </label>
                    <button
                      onClick={generarQRCapitan}
                      disabled={cargando}
                      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900  text-white px-6 py-3 rounded-lg font-bold transition shadow-lg flex items-center gap-2 disabled:bg-gray-400"
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
                      Generar QR Capitán
                    </button>
                  </div>
                </div>

                {cargando ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  </div>
                ) : qrCapitanes.filter(
                    (qr) =>
                      !mostrarSoloActivos ||
                      (!qr.qrCa_Usado && !estaExpirado(qr.qrCa_FechaExpiracion))
                  ).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-semibold">
                      No hay códigos QR{" "}
                      {mostrarSoloActivos ? "activos" : "generados"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {mostrarSoloActivos
                        ? "Desactiva el filtro para ver todos los códigos"
                        : "Genera el primer código QR para crear capitanes"}
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qrCapitanes
                      .filter(
                        (qr) =>
                          !mostrarSoloActivos ||
                          (!qr.qrCa_Usado &&
                            !estaExpirado(qr.qrCa_FechaExpiracion))
                      )
                      .map((qr) => (
                        <div
                          key={qr.qrCa_Id}
                          className={`bg-white border-2 rounded-xl p-4 ${
                            qr.qrCa_Usado
                              ? "border-gray-200 bg-gray-50"
                              : estaExpirado(qr.qrCa_FechaExpiracion)
                              ? "border-red-200 bg-red-50"
                              : "border-purple-200 bg-purple-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-gray-500">
                              ID: {qr.qrCa_Id}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                qr.qrCa_Usado
                                  ? "bg-gray-200 text-gray-700"
                                  : estaExpirado(qr.qrCa_FechaExpiracion)
                                  ? "bg-red-200 text-red-700"
                                  : "bg-green-200 text-green-700"
                              }`}
                            >
                              {qr.qrCa_Usado
                                ? "Usado"
                                : estaExpirado(qr.qrCa_FechaExpiracion)
                                ? "Expirado"
                                : "Activo"}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg mb-3">
                            <p className="text-xs font-mono text-gray-600 break-all">
                              {qr.qrCa_Codigo}
                            </p>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
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
                              <span>
                                Generado:{" "}
                                {formatearFecha(qr.qrCa_FechaGeneracion)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                Expira:{" "}
                                {formatearFecha(qr.qrCa_FechaExpiracion)}
                              </span>
                            </div>
                            {qr.usua_Id && (
                              <div className="flex items-center gap-2 text-green-600">
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
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>Usado por Usuario ID: {qr.usua_Id}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setQrGenerado({
                                tipo: "capitan",
                                codigo: qr.qrCa_Codigo,
                              });
                              setModalAbierto(true);
                            }}
                            className="w-full bg-white hover:bg-gray-300 text-black px-3 py-2 rounded-lg font-bold transition text-sm flex items-center justify-center gap-2"
                          >
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Ver QR
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "equipos" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black text-gray-900">
                    Códigos QR de Equipos
                  </h2>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mostrarSoloActivos}
                      onChange={(e) => setMostrarSoloActivos(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                    />
                    Solo activos
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
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
                    <p className="text-sm text-blue-800">
                      Los códigos QR de equipos se generan desde la sección{" "}
                      <span className="font-bold">Equipos</span>. Los capitanes
                      pueden generar estos códigos para que los jugadores se
                      inscriban mediante la app móvil.
                    </p>
                  </div>
                </div>

                {cargando ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : qrEquipos.filter(
                    (qr) =>
                      !mostrarSoloActivos ||
                      (!qr.inQR_Usado && !estaExpirado(qr.inQR_FechaExpiracion))
                  ).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-semibold">
                      No hay códigos QR{" "}
                      {mostrarSoloActivos ? "activos" : "de equipos"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {mostrarSoloActivos
                        ? "Desactiva el filtro para ver todos los códigos"
                        : "No hay códigos QR de equipos generados"}
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {qrEquipos
                      .filter(
                        (qr) =>
                          !mostrarSoloActivos ||
                          (!qr.inQR_Usado &&
                            !estaExpirado(qr.inQR_FechaExpiracion))
                      )
                      .map((qr) => (
                        <div
                          key={qr.inQR_Id}
                          className={`bg-white border-2 rounded-xl p-4 ${
                            qr.inQR_Usado
                              ? "border-gray-200 bg-gray-50"
                              : estaExpirado(qr.inQR_FechaExpiracion)
                              ? "border-red-200 bg-red-50"
                              : "border-blue-200 bg-blue-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-gray-700">
                              {qr.equi_Nombre}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                qr.inQR_Usado
                                  ? "bg-gray-200 text-gray-700"
                                  : estaExpirado(qr.inQR_FechaExpiracion)
                                  ? "bg-red-200 text-red-700"
                                  : "bg-green-200 text-green-700"
                              }`}
                            >
                              {qr.inQR_Usado
                                ? "Usado"
                                : estaExpirado(qr.inQR_FechaExpiracion)
                                ? "Expirado"
                                : "Activo"}
                            </span>
                          </div>
                          <div className="bg-white p-3 rounded-lg mb-3">
                            <p className="text-xs font-mono text-gray-600 break-all">
                              {qr.inQR_CodigoQR}
                            </p>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
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
                              <span>
                                Generado:{" "}
                                {formatearFecha(qr.inQR_FechaGeneracion)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
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
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>
                                Expira:{" "}
                                {formatearFecha(qr.inQR_FechaExpiracion)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal QR Generado */}
      {modalAbierto && qrGenerado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black">¡QR Generado!</h3>
                    <p className="text-purple-100 text-sm">
                      Código para Capitán
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalAbierto(false)}
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

            <div className="p-6 space-y-6">
              <div className="bg-white border-4 border-dashed border-purple-300 rounded-2xl p-6 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    qrGenerado.codigo
                  )}`}
                  alt="Código QR"
                  className="w-64 h-64"
                />
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs font-bold text-purple-700 mb-2">
                  Código de Capitán
                </p>
                <p className="text-sm font-mono text-gray-900 break-all bg-white p-3 rounded-lg border border-purple-200">
                  {qrGenerado.codigo}
                </p>
              </div>

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
                      Instrucciones
                    </p>
                    <p className="text-xs text-blue-700">
                      Comparte este código QR con un usuario registrado. Al
                      escanearlo desde la app Android, se convertirá
                      automáticamente en Capitán de Equipo. El código expira en
                      3 meses y solo puede usarse una vez.
                    </p>
                  </div>
                </div>
              </div>

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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
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

export default GestionQR;
