import EventList from "./src/pages/eventsList/eventList";
import EventPage from "./src/pages/eventPage/eventPage";

//url proyecto en producción para todas las llamadas fetch
const urlProduccion = "https://back-proyecto-10-mu.vercel.app/";
const token = localStorage.getItem('token');

// Función FETCH con loading
const fetchData = async (url, options = {}) => {
  
  // Mostrar el loading
  document.getElementById('loading').style.display = 'block';

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {

    console.error('Error en la solicitud:', error);
    throw error;

  } finally {

    // Ocultar el loading
    document.getElementById('loading').style.display = 'none';
  }
};

//Función LOGIN
export const Login = async (userName, password) => {

  const errorMessage = document.querySelector('#error-message');  

  const objetoFinal = JSON.stringify({ userName, password });
  const opciones = {
      method: "POST",
      body: objetoFinal,
      headers: {
          "Content-Type": "application/json"
      }
  }

  try {

      const respuestaFinal = await fetchData(`${urlProduccion}users/login`, opciones);
      
      if (respuestaFinal.token) {
        // guardamos el token una vez identificados, en el localStorage
        localStorage.setItem("token", respuestaFinal.token);
        //--> una vez identificados correctamente nos redirige a la página de eventos
        AllEvents();

      } else {

        console.error('El token no está definido en la respuesta:', respuestaFinal);
        errorMessage.textContent = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      }
    } catch (error) {
      errorMessage.textContent = "Error en la conexión. Por favor, inténtalo de nuevo.";
    }
  
}

//Ver Evento con determinado id
export const VerEvento = async (eventId) => {

  try {

    const event = await fetchData(`${urlProduccion}events/${eventId}`);

      EventPage(event); //ejecutamos la función para pintar la página con la info del evento proporcionado

    } catch (error) {
      console.error('Error al obtener los detalles del evento:', error);

    }

};

//Función que lanzaremos al enviar el formulario CREAR NUEVO EVENTO
export const NuevoEvento = async (e) => {
  e.preventDefault();

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
  
  const opciones = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: body
  };

  try {
    const respuestaFinal = await fetchData(`${urlProduccion}events/nuevoEvento`, opciones);
    const errorMessage = document.querySelector('#error-message');
    errorMessage.textContent = 'El evento se ha creado correctamente.';
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

//ELIMINAR EVENTO por id
export const EliminarEvento = async (eventId) => {

  const opcionesEliminarE = {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

  try {
    const respuestaFinal = await fetchData(`${urlProduccion}events/${eventId}/borrar`, opcionesEliminarE);
    
    //SI SE HA ELIMINADO CORRECTAMENTE
    const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);
    boxErrorMessage.textContent = 'El evento se ha eliminado correctamente.';
    
    // Eliminar el evento del DOM
    document.getElementById(`event-${eventId}`).remove();

  } catch (error) {

    const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);
    boxErrorMessage.textContent = `Error al eliminar el evento: ${error.message}. Inténtelo de nuevo.`;
  }
}
//Función para VER TODOS LOS EVENTOS DISPONIBLES dentro del componente EventList
export const AllEvents = async () => {

  try {
    const eventos = await fetchData(`${urlProduccion}events/events`);
    EventList(eventos);
    return eventos;

  } catch (error) {

    console.error('Error al obtener los eventos:', error);
    return [];
  }
  
}

//Función para buscar un evento por nombre
export const EventByName = async (eventName) => {

  const opciones = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
    
  try {
    //El uso de encodeURIComponent(eventName) en la construcción de URLs con parámetros de consulta es una buena práctica que asegura que la URL sea válida y funcione correctamente, independientemente de los caracteres que contenga eventName.
    const events = await fetchData(`${urlProduccion}events?name=${encodeURIComponent(eventName)}`, opciones);
    EventList(events);

  } catch (error) {
    const errorMessage = document.querySelector('.error');
    errorMessage.textContent = 'Error al buscar el evento. Inténtelo de nuevo.';
  }
  
}

// Función para VER LOS ASISTENTES A UN EVENTO
export const VerAsistentes = async (eventId) => {

  const opciones = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

  try {
      const asistentes = await fetchData(`${urlProduccion}events/${eventId}/asistentes`, opciones);
      const divAsistentes = document.querySelector('.asistentes');
      const errorMessage = document.querySelector('#error-message');
      
      if (Array.isArray(asistentes) && asistentes.length > 0) {
  
        divAsistentes.innerHTML = `
          <h3>Estos son los asistentes al evento:</h3>
          <ul>
            ${asistentes.map(a => `<li><strong>Usuario:</strong> ${a.userName} - ${a.email}</li>`).join('\n')}
          </ul>
        `;
  
      } else {
        errorMessage.textContent= 'No hay asistentes al evento.';
      }

      return;
  
    } catch (error) {
      errorMessage.textContent= 'Error al obtener los asistentes:', error;
    }
}

// función para CONFIRMAR ASISTENCIA A UN EVENTO con determinado ID
export const ConfirmarAsistencia = async (eventId) => {

  const opcionesCAsistencia = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
  
    //llamamos al endpoint que comprobará si el usuario está en la lista de asistentes, y si no lo está lo agregará
    try {
      const respuestaFinal = await fetchData(`${urlProduccion}events/${eventId}/confirmarAsistencia`, opcionesCAsistencia);
  
      //si ha ido bien nos devuelve el resultado y pintamos mensaje de 
      const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);
      boxErrorMessage.textContent = respuestaFinal.message;
  
    } catch (error) {

      console.error('Error:', error);
      boxErrorMessage.textContent = 'Hubo un problema al confirmar tu asistencia. Por favor, intenta de nuevo más tarde.', error;
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
// borrar botones header
export const DeleteBtns = () => {
  const header = document.querySelector('.header-btns');
  header.innerHTML = '';
}
// BOTÓN cerrar sesión
export const CerrarSesion = () => {
  localStorage.removeItem("token"); // Borra el token del almacenamiento local
  window.location.reload();
}