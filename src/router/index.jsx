import { createBrowserRouter, Navigate } from "react-router-dom";
import { PantallaInicial } from "../pages/PantallaInicial";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Equipos from "../pages/equipos/Equipos";
import CrearEquipo from "../pages/equipos/CrearEquipo";
import EditarEquipo from "../pages/equipos/EditarEquipo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PantallaInicial onContinuar={() => (window.location.href = "/login")} />
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/equipos",
    element: <Equipos />,
  },
  {
    path: "/equipos/crear",
    element: <CrearEquipo />,
  },
  {
    path: "/equipos/editar/:id",
    element: <EditarEquipo />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
