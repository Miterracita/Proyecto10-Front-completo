import "./eventList.css";
import { EventBox } from '../../components/event/event';
import Header from '../../components/header/header';
import Filtros from "../../components/filtros/filtros";

export const EventList = (eventos) => {

    //Seleccionamos la etiqueta body de la página y le agregamos la clase
    const bodyEventList = document.querySelector('body');
    bodyEventList.className = '';
    bodyEventList.classList.add('body-eventList');

    const mainEventList = document.querySelector('main');

    //generamos el html del listado de eventos
    const eventListHtmlMap = eventos.map(event => EventBox(event)).join('');
    const eventListHtml = `
            <section id="eventos">
                <h1>Próximos Eventos</h1>
                <div class="filtros"></div>
                <div class="list-events">
                    ${eventListHtmlMap}
                </div>
            </section>
        `;
    
    mainEventList.innerHTML = eventListHtml;
    
    Header();
    Filtros();
};

export default EventList;