import "./header.css";
import NewEvent from '../../pages/NewEvent/newEvent';
import { BtnVolver, DeleteBtns, CerrarSesion, AllEvents } from "../../../funciones";

export const Header = () => {
    
    //Seleccionamos la etiqueta body de la página y le agregamos la clase
    const header = document.querySelector('header');
    header.innerHTML = `
        <div class="header-btns">
            <button type="button" class="btn btn-header" id="btn-volver">Volver</button>
            <button type="button" class="btn btn-header" id="new-event-link">Crear nuevo evento</button>
            <button type="button" class="btn btn-cerrar-sesion" id="btn-cerrar-sesion">Cerrar sesión</button>
        </div>
    `;

    // Añadimos los event listeners para los enlaces
    const newEventLink = document.querySelector('#new-event-link');

    newEventLink.addEventListener('click', (e) => {
        e.preventDefault();
        NewEvent();
        DeleteBtns();
        BtnVolver();
    });

    const btnCerrarSesion = document.querySelector('#btn-cerrar-sesion');

    btnCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();
        CerrarSesion();
    });

    //Seleccionamos el botón volver
    const botonVolver = document.querySelector('#btn-volver');

    botonVolver.addEventListener('click', (e) => {
        e.preventDefault();
        AllEvents();
    });
};

export default Header;
