import EventList from "./src/pages/eventsList/eventList";

//url proyecto en producción para todas las llamadas fetch
const urlProduccion = "https://back-proyecto-10-mu.vercel.app/";
const token = localStorage.getItem('token');

//Función LOGIN
export const Login = async (userName, password) => {

  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  const errorMessage = document.querySelector('#error-message');  
      
  // al fetch necesita que le pasemos además de la ruta
  // el metodo POST, un JSON con el userName y el password 
  // e indicarle a la petición qué tipo de contenido está utilizando mediante los headers

  const objetoFinal = JSON.stringify({
      userName,
      password,
  });

  const opciones = {
      method: "POST",
      body: objetoFinal,
      headers: {
          "Content-Type": "application/json"
      }
  }

  try {
      //ruta a la que queremos realizar la petición
      const res = await fetch(`${urlProduccion}users/login`, opciones);
      
      if (res.status === 400) {
          errorMessage.textContent= "Usuario o contraseña incorrectos";
          return;
      }
      //eliminamos el mensaje de error
      if (errorMessage) {
          errorMessage.remove();
      }

      const respuestaFinal = await res.json();
      console.log("Respuesta del servidor:", respuestaFinal);

      if (respuestaFinal.token) {
          // guardamos el token una vez identificados, en el localStorage
          localStorage.setItem("token", respuestaFinal.token);

          //--> una vez identificados correctamente nos redirige a la página de eventos <--
          AllEvents();

      } else {
          console.error('El token no está definido en la respuesta:', respuestaFinal);
          errorMessage.textContent = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      }
  } catch (error) {
      console.error('Error en la petición:', error);
      errorMessage.textContent = "Error en la conexión. Por favor, inténtalo de nuevo.";
  } finally {
    // Ocultar el loading
    document.getElementById('loading').style.display = 'none';
  }
  
}

//Función que lanzaremos al enviar el formulario CREAR NUEVO EVENTO
export const NuevoEvento = async (e) => {
  e.preventDefault();
  
  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  const [nameInput, descriptionInput, dateInput, timeInput, locationInput, imgInput] = e.target.elements;
  const body = new FormData();

  body.append("name", nameInput.value);
  body.append("description", descriptionInput.value);
  body.append("date", dateInput.value);
  body.append("time", timeInput.value);
  body.append("location", locationInput.value);

  // Solo añadir la imagen si se ha seleccionado una
  if (imgInput.files[0]) {
    body.append("img", imgInput.files[0]);
  }
  
  try {
      const res = await fetch(`${urlProduccion}events/nuevoEvento`, {
          method: "POST",
          headers: {
              "Authorization": `Bearer ${token}` // Incluye el token aquí
          },
          body:body
      });

      if (!res.ok) {
          console.error("Error en la respuesta del servidor:", res.statusText);
          return;
      }

      //si el evento se ha creado correctamente
      const respuestaFinal = await res.json();
      console.log("Respuesta del servidor:", respuestaFinal);

      const errorMessage = document.querySelector('#error-message');
      errorMessage.textContent= 'El evento se ha creado correctamente.';

  } catch (error){
      console.error('Error en la solicitud:', error);
  } finally {
      // Ocultar el loading
      document.getElementById('loading').style.display = 'none';
    }
}

//ELIMINAR EVENTO por id
export const EliminarEvento = async (eventId) => {
  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  try {

    const res = await fetch(`${urlProduccion}events/${eventId}/borrar`, {
      method: "DELETE",
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
      }
    });

    const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);

    if (!res.ok) {
      boxErrorMessage.textContent = `Error: ${res.statusText}`;
      console.error("Error en la respuesta del servidor:", res.statusText);
      return;
  }
    
    //SI SE HA ELIMINADO CORRECTAMENTE
    const respuestaFinal = await res.json();
    boxErrorMessage.textContent= 'El evento se ha eliminado correctamente.';
    console.log("Respuesta del servidor:", respuestaFinal);

    // Eliminar el evento del DOM
    document.getElementById(`event-${eventId}`).remove();

  } catch (error) {

    console.error('Error en la solicitud:', error);
    const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);
    boxErrorMessage.textContent = `Error al eliminar el evento: ${error.message}. Inténtelo de nuevo.`;

  } finally {

    // Ocultar el loading
    document.getElementById('loading').style.display = 'none';
  }
}
//Función para VER TODOS LOS EVENTOS DISPONIBLES dentro del componente EventList
export const AllEvents = async () => {

  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';
  
  try {      
      const res = await fetch(`${urlProduccion}events/events`);

      if (!res.ok) {
          throw new Error('Error al obtener los eventos');
      }

      const eventos = await res.json();
      EventList(eventos);
      return eventos;
      
  } catch (error) {
      console.error('Error al obtener los eventos:', error);
      return [];
  } finally {
    // Ocultar el loading
    document.getElementById('loading').style.display = 'none';
  }
  
}

//Función para buscar un evento por nombre
export const EventByName = async (eventName) => {

  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  try {
    //para asegurarte de que el nombre del evento esté correctamente codificado en la URL, especialmente si tiene espacios o caracteres especiales.
    //Esto asegura que el backend reciba correctamente el nombre del evento, evitando problemas de interpretación de la URL.
    //El uso de encodeURIComponent(eventName) en la construcción de URLs con parámetros de consulta es una buena práctica que asegura que la URL sea válida y funcione correctamente, independientemente de los caracteres que contenga eventName.
    const res = await fetch(`${urlProduccion}events?name=${encodeURIComponent(eventName)}`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      console.error("Error en la respuesta del servidor:", res.statusText);
      const errorMessage = document.querySelector('#error-message');
      errorMessage.textContent = `Error: ${res.statusText}`;
      return;
  }

    const events = await res.json();
    console.log('Eventos encontrados:', events);

            // // Aquí puedes actualizar el DOM con los eventos encontrados
            // const resultsContainer = document.querySelector('#results-container');
            // resultsContainer.innerHTML = events.map(event => `<div>${event.name}</div>`).join('');

    EventList(events);
    // return events;

  } catch (error) {
      console.error('Error al obtener los eventos:', error);
      const errorMessage = document.querySelector('#error-message');
      errorMessage.textContent = 'Error al buscar el evento. Inténtelo de nuevo.';
      // return [];
  } finally {
      document.getElementById('loading').style.display = 'none';
  }
  
}

// Función para VER LOS ASISTENTES A UN EVENTO
export const VerAsistentes = async (eventId) => {

  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  // Recupera el token de localStorage
  const token = localStorage.getItem('token');

  const divAsistentes = document.querySelector('.asistentes');
  const errorMessage = document.querySelector('#error-message');

  if (!token) {
      console.error('No se encontró el token de autenticación.');
      return;
  }

  try {
      const response = await fetch(`${urlProduccion}events/${eventId}/asistentes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}` // Incluye el token
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al consultar los asistentes a este evento: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
  
        divAsistentes.innerHTML = `
          <h3>Estos son los asistentes al evento:</h3>
          <ul>
            ${data.map(a => `<li><strong>Usuario:</strong> ${a.userName} - ${a.email}</li>`).join('\n')}
          </ul>
        `;
  
      } else {
        errorMessage.textContent= 'No hay asistentes al evento.';
      }
      // return data;
      return;
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Ocultar el loading
      document.getElementById('loading').style.display = 'none';
  }
}

// función para CONFIRMAR ASISTENCIA A UN EVENTO con determinado ID
export const ConfirmarAsistencia = async (eventId) => {

    // Mostrar el loading
    document.getElementById('loading').style.display = 'block';

    // Recupera el token de localStorage
    const token = localStorage.getItem('token');
    const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);
  
    if (!token) {
      console.error('No se encontró el token de autenticación.');
      boxErrorMessage.textContent = 'Por favor, inicia sesión para confirmar tu asistencia.';
      return;
    }
  
    //llamamos al endpoint que comprobará si el usuario está en la lista de asistentes, y si no lo está lo agregará
    try {
      const response = await fetch(`${urlProduccion}events/${eventId}/confirmarAsistencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error al confirmar asistencia: ${response.statusText}`);
      }
  
      //si ha ido bien nos devuelve el resultado
      const data = await response.json();
      boxErrorMessage.textContent = data.message;
  
    } catch (error) {
      console.error('Error:', error);
      boxErrorMessage.textContent = 'Hubo un problema al confirmar tu asistencia. Por favor, intenta de nuevo más tarde.';
    } finally {
      // Ocultar el loading
      document.getElementById('loading').style.display = 'none';
    }
}

// CARGAR BOTÓN VOLVER EN EL HEADER
export const BtnVolver = () => {
  const btnVolver = `<button class="btn btn-header" id="btn-volver">Volver</button>`;
  const header = document.querySelector('.header-btns');
  
  // Insertar el botón en el header
  header.innerHTML += btnVolver;

  //Seleccionamos el botón volver
  const botonVolver = document.querySelector('#btn-volver');

  botonVolver.addEventListener('click', (e) => {
      e.preventDefault();
      AllEvents();
  });
}
export const DeleteBtnCrearEvent = () => {
  const header = document.querySelector('.header-btns');
  header.innerHTML = '';
}
