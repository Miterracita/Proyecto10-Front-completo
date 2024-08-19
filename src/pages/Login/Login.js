import "./Login.css";
import NewUser from '../NewUser/newUser';
import { Login } from "../../../funciones"

//Generamos el HTML de la página de login
export const RenderLoginHtml = () => {
    //Seleccionamos la etiqueta body de la página y le agregamos la clase
    const bodyLogin = document.querySelector('body');
    bodyLogin.classList.add('body-login');

    const mainLogin = document.querySelector('main');

    //creamos el contenido del main
    const mainLoginHtml = `
        <section id="main-login">
            <h1>Summer Events</h1>
            <h2>2024</h2>
            <div id="error-message"></div>
            <div class="box-login">
                <form id="loginForm">
                    <div class="box-form">
                        <div>
                            <label for="username">UserName: </label>
                            <input type="text" name="username" id="username" autocomplete="username">
                        </div>
                        <div>
                            <label for="password">Password: </label>
                            <input type="password" name="password" id="password" autocomplete="current-password">
                        </div>
                    </div>
                    <button type="submit" class="btn" id="btn-enviar">Enviar</button>
                </form>

                <div class="box-info">
                    <p class="txt">Si no recuerdas tu userName o password - Recordar</p>
                    <p class="txt">Si no estás registrado <a href="#" id="register-link">Regístrate</a></p>
                </div>
            </div>
        </section>
    `;

    //agregamos el main al body de la página
    mainLogin.innerHTML = mainLoginHtml;

    // Enviamos datos al LOGIN
    const loginForm = document.querySelector('#loginForm');
    const userName = document.querySelector('#username');
    const password = document.querySelector('#password');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        Login(userName.value, password.value);
    });

    //redirigimos a la página de nuevo usuario / registro
    const registerLink = document.querySelector('#register-link');

    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        NewUser();
    });

}
export default RenderLoginHtml;