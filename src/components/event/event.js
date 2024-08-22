import "./event.css";
import { ConfirmarAsistencia, EliminarEvento, VerEvento } from "../../../funciones";

export const EventBox = (event) => {

    const imagenXDefecto = "https://res.cloudinary.com/dq2daoeex/image/upload/v1723579439/API-Rest-FILES/imagen_por_defecto_dldpud.jpg";
    
    //contenido de cada elemento event del listado eventlist
    return `
        <div class="event-box" id="event-${event._id}">
            <div class="event-img"><img src="${event.img || imagenXDefecto}" alt="imagen del evento"/></div>
            <div class="event-info">              
                <h2 class="event-name">${event.name}</h2>
                <div id="error-message" class="error-message"></div>
                <p class="event-location">${event.location}</p>
                <p class="event-description">${event.description}</p> 
                <p class="event-date"><span>Date:</span> ${event.date}</p>
                <p class="event-hour"><span>Hour:</span> ${event.hour}</p>               
            </div>
            <div class="event-buttons">
                <button class="btn" onclick="VerEvento('${event._id}')">Ver Evento</button>
                <button class="btn" onclick="ConfirmarAsistencia('${event._id}')">Confirmar Asistencia</button>
                <button class="btn btn-delete" onclick="EliminarEvento('${event._id}')">Eliminar Evento</button>
            </div>
        </div>
    `;

};

export default EventBox;

window.VerEvento = async (eventId) => {
    await VerEvento(eventId);
};

window.ConfirmarAsistencia = async (eventId) => {
    await ConfirmarAsistencia(eventId);
};

window.EliminarEvento = async (eventId) => {
    await EliminarEvento(eventId);
};