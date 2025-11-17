import { useState, useEffect } from "react";

export const PantallaInicial = ({ onContinuar }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("sistema");

  const slides = [
    {
      id: 1,
      title: "Gestión Profesional de Torneos",
      subtitle: "Administra tu liga como los grandes",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
      color: "from-blue-900 to-blue-700",
    },
    {
      id: 2,
      title: "Estadísticas en Tiempo Real",
      subtitle: "Datos y análisis instantáneos",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
      color: "from-green-900 to-green-700",
    },
    {
      id: 3,
      title: "Resultados al Instante",
      subtitle: "Actualización automática desde el campo",
      image:
        "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200",
      color: "from-red-900 to-red-700",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Elegante */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  LIGA LOCAL
                </h1>
                <p className="text-xs text-gray-400 font-semibold hidden sm:block">
                  Sistema de Gestión Deportiva
                </p>
              </div>
            </div>

            <button
              onClick={onContinuar}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg text-sm sm:text-base"
            >
              ACCEDER
            </button>
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-2xl">
                  <div className="inline-block bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                    TEMPORADA 2025
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-3 sm:mb-4 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 font-semibold">
                    {slide.subtitle}
                  </p>
                  <button className="bg-white text-gray-900 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-black hover:bg-gray-100 transition-all shadow-xl text-sm sm:text-base">
                    CONOCER MÁS
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 sm:w-12 bg-white"
                  : "w-1.5 sm:w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-gray-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Tab Buttons */}
          <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b-2 border-gray-300 overflow-x-auto">
            {[
              { id: "sistema", label: "SISTEMA" },
              { id: "funciones", label: "FUNCIONES" },
              { id: "plataformas", label: "PLATAFORMAS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-8 py-3 sm:py-4 font-black text-sm sm:text-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-4 border-blue-600 -mb-0.5"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content - Sistema */}
          {activeTab === "sistema" && (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4">
                  Sistema Integral de Administración
                </h3>
                <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                  Plataforma profesional diseñada para gestionar ligas de fútbol
                  local con todas las herramientas necesarias: equipos, torneos,
                  partidos y estadísticas en tiempo real.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      title: "Gestión Completa",
                      desc: "Administra equipos, jugadores y torneos desde un solo lugar",
                      color: "blue",
                    },
                    {
                      title: "Tiempo Real",
                      desc: "Actualización instantánea de resultados y estadísticas",
                      color: "green",
                    },
                    {
                      title: "Reportes Automáticos",
                      desc: "Genera informes y estadísticas con un solo clic",
                      color: "red",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-${item.color}-600 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
                      </div>
                      <div>
                        <h4 className="font-bold text-base sm:text-lg text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-sm sm:text-base text-gray-600">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl h-64 sm:h-full">
                <img
                  src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800"
                  alt="Sistema"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Tab Content - Funciones */}
          {activeTab === "funciones" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Gestión de Equipos",
                  desc: "Administra planteles, jugadores y cuerpo técnico",
                  color: "blue",
                },
                {
                  title: "Calendario de Partidos",
                  desc: "Programa jornadas y horarios automáticamente",
                  color: "green",
                },
                {
                  title: "Tabla de Posiciones",
                  desc: "Actualización automática de clasificación",
                  color: "yellow",
                },
                {
                  title: "Goleadores",
                  desc: "Ranking de mejores anotadores del torneo",
                  color: "red",
                },
                {
                  title: "Estadísticas",
                  desc: "Análisis detallado de rendimiento",
                  color: "purple",
                },
                {
                  title: "Reportes",
                  desc: "Documentos profesionales listos para imprimir",
                  color: "indigo",
                },
              ].map((func, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-${func.color}-100 rounded-xl flex items-center justify-center text-2xl sm:text-4xl mb-3 sm:mb-4`}
                  >
                    {i === 0 && "👕"}
                    {i === 1 && "📅"}
                    {i === 2 && "🏆"}
                    {i === 3 && "⚽"}
                    {i === 4 && "📊"}
                    {i === 5 && "📄"}
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-gray-900 mb-2">
                    {func.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600">
                    {func.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content - Plataformas */}
          {activeTab === "plataformas" && (
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-10 sm:h-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      Plataforma Web
                    </h3>
                    <p className="text-sm sm:text-base text-blue-200">
                      PWA - Progressive Web App
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Interfaz React con Tailwind CSS",
                    "Responsive y multiplataforma",
                    "Instalable como app nativa",
                    "Actualización en tiempo real",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">✓</span>
                      <span className="text-sm sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-10 sm:h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black">
                      App Móvil
                    </h3>
                    <p className="text-sm sm:text-base text-green-200">
                      Android & iOS
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    "Registro desde el campo",
                    "Ingreso de goles en vivo",
                    "Consulta rápida de marcadores",
                    "Optimizada para eventos",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl">✓</span>
                      <span className="text-sm sm:text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12 sm:py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { number: "500+", label: "Partidos Gestionados" },
              { number: "50+", label: "Equipos Activos" },
              { number: "1000+", label: "Jugadores Registrados" },
              { number: "24/7", label: "Soporte Disponible" },
            ].map((stat, i) => (
              <div key={i} className="p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-300 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
            ¿Listo para profesionalizar tu liga?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
            Únete a las ligas que ya confían en nuestro sistema para gestionar
            sus torneos
          </p>
          <button
            onClick={onContinuar}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg lg:text-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-2xl inline-flex items-center gap-2 sm:gap-3"
          >
            COMENZAR AHORA
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base text-gray-400 font-semibold">
            Sistema de Gestión Deportiva | Universidad Tecnológica de León |
            IDGS1003
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            © 2025 Liga Local. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
