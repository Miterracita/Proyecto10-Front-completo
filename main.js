import "./style.css";
import RenderLoginHtml from './src/pages/Login/Login';
import { AllEvents } from "./funciones";


// antes de cargar la página comprobamos si existe token
document.addEventListener("DOMContentLoaded", function() {
  const token = localStorage.getItem('token');
  if (token) {
      // Autenticar al usuario automáticamente
      console.log("Usuario autenticado con token:", token);
      // Cargar la pagina principal
      AllEvents();
  } else {
      // Redirigir al usuario a la página de login
      RenderLoginHtml();
  }
});
