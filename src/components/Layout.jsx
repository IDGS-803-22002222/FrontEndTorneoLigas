// src/components/Layout.jsx - VERSION ACTUALIZADA
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (!usuarioGuardado) {
      navigate("/login");
    } else {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br  to-white rounded-lg flex items-center justify-center">
                <img src="./ligas.png" alt="" />
              </div>
              <span className="text-xl font-black text-white hidden sm:block">
                LIGA LOCAL
              </span>
            </Link>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/home"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                Dashboard
              </Link>
              <Link
                to="/equipos"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                Equipos
              </Link>
              <Link
                to="/torneos"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                Torneos
              </Link>
              <Link
                to="/jugadores"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                jugadores
              </Link>
              <Link
                to="/sedes"
                className="text-gray-300 hover:text-white font-semibold transition"
              >
                Sedes
              </Link>
              {usuario.rol_Nombre === "Administrador" && (
                <Link
                  to="/arbitros"
                  className="text-gray-300 hover:text-white font-semibold transition"
                >
                  Árbitros
                </Link>
              )}

              {/* Menú QR - Solo para Administradores */}
              {usuario.rol_Nombre === "Administrador" && (
                <Link
                  to="/admin/gestion-qr"
                  className="text-gray-300 hover:text-white font-semibold transition flex items-center gap-2"
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  Códigos QR
                </Link>
              )}

              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
                <span className="text-gray-300 text-sm font-medium">
                  {usuario.usua_NombreCompleto}
                </span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {usuario.rol_Nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition text-sm"
                >
                  Salir
                </button>
              </div>
            </div>

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden text-white p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuAbierto ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Menu móvil */}
          {menuAbierto && (
            <div className="md:hidden pb-4 border-t border-gray-700 mt-2 pt-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/home"
                  className="text-gray-300 hover:text-white font-semibold px-2 py-2"
                >
                  Dashboard
                </Link>
                {usuario.rol_Nombre === "Administrador" && (
                  <Link
                    to="/arbitros"
                    className="text-gray-300 hover:text-white font-semibold px-2 py-2"
                  >
                    Árbitros
                  </Link>
                )}
                <Link
                  to="/equipos"
                  className="text-gray-300 hover:text-white font-semibold px-2 py-2"
                >
                  Equipos
                </Link>
                <Link
                  to="/torneos"
                  className="text-gray-300 hover:text-white font-semibold px-2 py-2"
                >
                  Torneos
                </Link>
                <Link
                  to="/jugadores"
                  className="text-gray-300 hover:text-white font-semibold px-2 py-2"
                >
                  Jugadores
                </Link>

                {/* Menú QR - Solo para Administradores */}
                {usuario.rol_Nombre === "Administrador" && (
                  <Link
                    to="/admin/gestion-qr"
                    className="text-gray-300 hover:text-white font-semibold px-2 py-2 flex items-center gap-2"
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    Códigos QR
                  </Link>
                )}

                <div className="border-t border-gray-700 pt-3 mt-2">
                  <p className="text-gray-400 text-sm px-2">
                    {usuario.usua_NombreCompleto}
                  </p>
                  <p className="text-blue-400 text-xs px-2 mb-3">
                    {usuario.rol_Nombre}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
