import "./eventPage.css";
import { ConfirmarAsistencia, VerAsistentes } from "../../../funciones";

export const EventPage = (event) => {

  //Seleccionamos la etiqueta body de la página y le agregamos la clase
  const bodyEventPage = document.querySelector('body');
  bodyEventPage.className = '';
  bodyEventPage.classList.add('body-eventPage');

  const mainEventPage = document.querySelector('main');
  const imagenXDefecto = "https://res.cloudinary.com/dq2daoeex/image/upload/v1723579439/API-Rest-FILES/imagen_por_defecto_dldpud.jpg";


  //generamos el html de la página del evento
  const eventPageHtml = `
        <div class="eventPage-box-page" id="event-${event._id}">
            <div class="eventPage-img"><img src="${event.img || imagenXDefecto}" /></div>
            <div class="eventPage-info">              
                <h2 class="eventPage-name">${event.name}</h2>
                <div id="error-message" class="error-message"></div>
                <p class="eventPage-location">${event.location}</p>
                <p class="eventPage-description">${event.description}</p> 
                <p class="eventPage-date"><span>Date:</span> ${event.date}</p>
                <p class="eventPage-hour"><span>Hour:</span> ${event.hour}</p>
                <div class="asistentes"></div>             
            </div>
            <div class="eventPage-buttons">
                <button class="btn" id="ver-asistentes">Ver Asistentes</button>
                <button class="btn" id="confirmar-asistencia">Confirmar Asistencia</button>
            </div>
        </div>
    `;
    mainEventPage.innerHTML = eventPageHtml;

    const btnVolverBorrar = document.querySelector('#btn-volver');
    btnVolverBorrar.classList.remove("eliminar");

    const btnVerAsistentes = document.querySelector('#ver-asistentes');

    btnVerAsistentes.addEventListener('click', (e) => {
        e.preventDefault();
        VerAsistentes(`${event._id}`);
    });

    const btnConfirmarAsistencia = document.querySelector('#confirmar-asistencia');
    btnConfirmarAsistencia.addEventListener('click', (e) => {
        e.preventDefault();
        ConfirmarAsistencia(`${event._id}`);
    });
};

export default EventPage;
