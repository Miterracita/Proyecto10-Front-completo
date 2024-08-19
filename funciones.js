import EventList from "./src/pages/eventsList/eventList";

//url proyecto en producción para todas las llamadas fetch
const urlProduccion = "https://back-proyecto-10-mu.vercel.app/";

//Función LOGIN
export const Login = async (userName, password) => {

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
          // const eventos = await fetchEvents();
          // EventList(eventos);/
          AllEvents();

      } else {
          console.error('El token no está definido en la respuesta:', respuestaFinal);
          errorMessage.textContent = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      }
  } catch (error) {
      console.error('Error en la petición:', error);
      errorMessage.textContent = "Error en la conexión. Por favor, inténtalo de nuevo.";
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
    const res = await fetch(`${urlProduccion}events/eventList/?name=${encodeURIComponent(eventName)}`, {
      
      method: 'GET',
      headers: {
          'Content-Type': 'application/json', 
      }

    });

    console.log('Response status:', res.status); // verificar el estado de la respuesta

    if (!res.ok) {
        throw new Error('Error al obtener el evento');
    }

    const events = await res.json();
    console.log('Eventos obtenidos:', events); // verificar los datos obtenidos

    EventList(events);
    return events;

  } catch (error) {
      console.error('Error al obtener los eventos:', error);
      return [];
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