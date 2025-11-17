import { createBrowserRouter } from "react-router-dom";
import { PantallaInicial } from "../pages/PantallaInicial";
import Login from "../pages/Login";
import Home from "../pages/Home";
import { Navigate } from "react-router-dom";

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
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
