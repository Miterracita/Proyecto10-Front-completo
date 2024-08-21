import "./header.css";
import NewEvent from '../../pages/NewEvent/newEvent';
import { BtnVolver, DeleteBtnCrearEvent } from "../../../funciones";

export const Header = () => {
    
    //Seleccionamos la etiqueta body de la página y le agregamos la clase
    const header = document.querySelector('header');
    header.innerHTML = `
        <div class="header-btns">
            <button class="btn btn-header" id="new-event-link">Crear nuevo evento</button>
        </div>
    `;

    // Añadimos los event listeners para los enlaces
    const newEventLink = document.querySelector('#new-event-link');

    newEventLink.addEventListener('click', (e) => {
        e.preventDefault();
        NewEvent();
        DeleteBtnCrearEvent();
        BtnVolver();
    });
};

export default Header;
