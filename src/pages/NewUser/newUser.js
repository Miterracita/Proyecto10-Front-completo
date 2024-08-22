import "./newUser.css";
// import Login from '../Login/Login';
import { Login } from "../../../funciones";

const urlProduccion = "https://back-proyecto-10-mu.vercel.app/";

export const NewUser = () => {

    //Seleccionamos la etiqueta body de la página y le agregamos la clase
    const bodyRegister = document.querySelector('body');
    bodyRegister.className = '';
    bodyRegister.classList.add('body-newRegister');

    const mainRegister = document.querySelector('main');

    //creamos el contenido del main
    const mainRegisterHtml = `
        <section class="main-newRegister">
            <h1 class="register">New User</h1>
            <h2 class="register">2024</h2>
            <h2 class="register">Summer Events</h2>
            <div id="error-message"></div>
            <div class="box-newRegister">
                <form id="newRegisterForm">
                    <div class="box-form">
                        <div>
                            <label for="userName">UserName: </label>
                            <input type="text" name="username" id="username" >
                        </div>
                        <div>
                            <label for="password">Pasword: </label>
                            <input type="password" id="password" name="password" minlength="8" required />
                        </div>
                        <div>
                            <label for="email">Email: </label>
                            <input type="email" id="email" name="email" size="30" required />
                        </div>
                    </div>
                    <button type="submit" class="btn" id="btn-save-user">Guardar</button>
                </form>
            </div>
        </section>
    `;

    //agregamos el main al body de la página
    mainRegister.innerHTML = mainRegisterHtml;

    //MANEJAMOS LA SOLICITUD DE NUEVO REGISTRO
    
    //seleccionamos el formulario
    const newRegisterForm = document.querySelector('#newRegisterForm');

    //funcion que lanzaremos el enviar el formulario
    const newUser = async (e) => {
        e.preventDefault(); // prevenimos comportamiento por defecto para que no recargue la página

        const errorMessage = document.querySelector('#error-message');

        const userName = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        const email = document.querySelector('#email').value;

        const objetoNewRegister = JSON.stringify({
            userName,
            password,
            email
        });

        const opciones = {
            method: "POST",
            body: objetoNewRegister,
            headers: {
                "Content-Type": "application/json"
            }
        }
        
        // Mostrar el loading
        document.getElementById('loading').style.display = 'block';

        try {
            const res = await fetch(`${urlProduccion}users/registro`, opciones);

            if (!res.ok) {
                if (res.status === 400) { //usuario o password ya existe
                    errorMessage.textContent= 'El nombre de usuario y/o password ya existe. Por favor, elija otro.';
                } else {
                    console.error("Error en la respuesta del servidor:", res.statusText);
                }
                return;
            }

            // eliminamos el mensaje de error
            if (errorMessage) {
                errorMessage.textContent='';
            }

            // si el usuario se ha creado correctamente
            const respuestaFinal = await res.json();
            console.log("Respuesta del servidor:", respuestaFinal);

            errorMessage.textContent= 'Usuario creado correctamente.';

            //si el proceso de alta se ha realizado correctamente llamamos a la funcion de login
            // y usamos los datos de la nueva alta para identificarnos
            // Esperar 8 segundos antes de realizar la acción de login
            setTimeout(() => {
                Login(userName, password);
            }, 5000);
            

        } catch (error){
            console.error('Error en la solicitud:', error);
            errorMessage.textContent = 'Error en la solicitud. Inténtalo de nuevo más tarde.';
        
        } finally {

            // Ocultar el loading
            document.getElementById('loading').style.display = 'none';
        }
    }

    newRegisterForm.addEventListener('submit', newUser);
}

export default NewUser;