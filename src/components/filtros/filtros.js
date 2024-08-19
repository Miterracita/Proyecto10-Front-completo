import "./filtros.css";
import { EventByName } from "../../../funciones";

export const Filtros = () => {

    const filtrosHtml = `
        <h2>Filtros</h2>
        <form id="filtro-eventos">
            <div class="form-buscar-nombre">
                <div>
                    <label class="bold" for="event-name">Buscar eventos por nombre:</label>
                    <input type="text" name="event-name" id="event-name" size="30">
                </div>
                <button type="submit" id="buscar-evento" class="btn btn-header">Buscar</button>
            </div>
        </form>
    `;

    const filtrosDiv = document.querySelector('.filtros');
    filtrosDiv.innerHTML = filtrosHtml;

    const formBuscarEvento = document.querySelector('#filtro-eventos');

    formBuscarEvento.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventName = document.querySelector('#event-name').value.trim();

        if (eventName) {
            EventByName(eventName);
        } else {
            alert('Por favor, ingresa un nombre de evento para buscar.');
        }
    });
}

export default Filtros;

{/* <div class="form-ordenar-fecha">
<p class="bold">Ordenar por:</p>
<div>
    <input type="radio" id="ordenar-fecha" name="ordenar-fecha">
    <label for="ordenar-fecha">Fecha más cercana</label>
</div>
</div> */}