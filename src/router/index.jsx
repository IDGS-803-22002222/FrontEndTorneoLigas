import { createBrowserRouter, Navigate } from "react-router-dom";
import { PantallaInicial } from "../pages/PantallaInicial";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Equipos from "../pages/equipos/Equipos";
import CrearEquipo from "../pages/equipos/CrearEquipo";
import EditarEquipo from "../pages/equipos/EditarEquipo";
import Torneos from "../pages/torneos/Torneos";
import CrearTorneo from "../pages/torneos/CrearTorneo";
import EditarTorneo from "../pages/torneos/EditarTorneo";
import EquiposTorneo from "../pages/torneos/EquiposTorneo";
import GestionQR from "../pages/admin/GestionQR";
import Sedes from "../pages/Sedes/Sedes";
import CrearSede from "../pages/sedes/CrearSede";
import EditarSede from "../pages/sedes/EditarSede";
import Jugadores from "../pages/jugadores/Jugadores";
import GenerarCalendarioIA from "../pages/torneos/GenerarCalendarioIA";
import PartidosTorneo from "../pages/partidos/PartidosTorneo";
import Arbitros from "../pages/arbitros/Arbitros";
import CrearArbitro from "../pages/arbitros/CrearArbitro";
import EditarArbitro from "../pages/arbitros/EditarArbitro";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PantallaInicial onContinuar={() => (window.location.href = "/login")} />
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/equipos", element: <Equipos /> },
  { path: "/equipos/crear", element: <CrearEquipo /> },
  { path: "/equipos/editar/:id", element: <EditarEquipo /> },
  { path: "/torneos", element: <Torneos /> },
  { path: "/torneos/crear", element: <CrearTorneo /> },
  { path: "/torneos/editar/:id", element: <EditarTorneo /> },
  { path: "/torneos/equipos/:id", element: <EquiposTorneo /> },
  { path: "/admin/gestion-qr", element: <GestionQR /> },
  { path: "/sedes", element: <Sedes /> },
  { path: "/sedes/crear", element: <CrearSede /> },
  { path: "/sedes/editar/:id", element: <EditarSede /> },
  { path: "/jugadores", element: <Jugadores /> },
  { path: "*", element: <Navigate to="/" replace /> },
  { path: "/torneos/generar-ia/:id", element: <GenerarCalendarioIA /> },
  { path: "/arbitros", element: <Arbitros /> },
  { path: "/arbitros/crear", element: <CrearArbitro /> },
  { path: "/arbitros/editar/:id", element: <EditarArbitro /> },
  {
    path: "/torneos",
    element: <Torneos />,
  },
  {
    path: "/torneos/:id/partidos",
    element: <PartidosTorneo />,
  },
]);
