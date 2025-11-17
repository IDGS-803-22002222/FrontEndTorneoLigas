import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-gray-900">LIGA LOCAL</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-semibold">
                {usuario.usua_NombreCompleto}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {usuario.rol_Nombre}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-black text-gray-900 mb-8">Dashboard</h2>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-700 text-lg">
            Bienvenido al sistema de gestión de torneos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
