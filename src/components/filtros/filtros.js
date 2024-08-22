import "./filtros.css";
import { EventByName, AllEvents } from "../../../funciones";

export const Filtros = () => {

    const filtrosHtml = `
        <form id="filtro-eventos">
            <div class="form-buscar-nombre">
                <div>
                    <label class="bold" for="event-name">Buscar eventos por nombre:</label>
                    <input type="text" name="event-name" id="event-name" size="30">
                </div>
                <div class="error bold"></div>
                <div class="btns-filtros">
                    <button type="button" id="buscar-evento" class="btn btn-header">Buscar</button>
                    <button type="button" id="limpiar-filtro" class="btn btn-header">Limpiar filtro</button>
                </div>
            </div>
        </form>
    `;

    const filtrosDiv = document.querySelector('.filtros');
    filtrosDiv.innerHTML = filtrosHtml;

    const formBuscarEvento = document.querySelector('#buscar-evento');

    formBuscarEvento.addEventListener('click', () => {

        const eventName = document.querySelector('#event-name').value.trim();

        if (eventName) {
            EventByName(eventName);
        } else {
            alert('Por favor, ingresa un nombre de evento para buscar.');
        }
    });

    const btnLimpiarFiltro = document.querySelector('#limpiar-filtro');

    btnLimpiarFiltro.addEventListener('click', () => {
        AllEvents();
    });
}

export default Filtros;
