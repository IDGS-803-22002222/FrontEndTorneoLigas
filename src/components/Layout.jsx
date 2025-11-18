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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
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
