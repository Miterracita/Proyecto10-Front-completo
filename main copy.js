import "./style.css";
import Login from './src/pages/Login/Login';
import { EventPage } from './src/pages/eventPage/eventPage';

//url local // const urlLocal = "http://localhost:3000/";
const urlProduccion = "https://back-proyecto-10-mu.vercel.app/";


Login();

// -->>> LLAMADAS A LA BBDD <<<--

//Solicitamos la info de un evento con determinado id
const fetchEventDetails = async (eventId) => {
    try {
        const res = await fetch(`${urlProduccion}events/${eventId}`);
        if (!res.ok) {
            throw new Error('Error al obtener los detalles del evento');
        }
        return await res.json();
    } catch (error) {
        console.error('Error al obtener los detalles del evento:', error);
        return null;
    }
};

//obtiene los detalles del evento con ID x y llama a eventPage pasandole la info de este evento
window.handleViewEvent = async (eventId) => {
    const event = await fetchEventDetails(eventId);
    if (event) {
        EventPage(event); //ejecutamos la función para pintar la página con la info del evento proporcionado
        
      const btnVolver = `<button class="btn btn-header" onclick="handleListEvents();">Volver</button>`;
      const header = document.querySelector('.header-btns');
      // Insertar el botón en el header
      header.innerHTML += btnVolver;

    } else {
        console.error('Error al cargar los detalles del evento');
    }
};

//confirmar asistencia a un evento con determinado id

const fetchConfirmarAsistencia = async (eventId) => {
  // Recupera el token de localStorage
  const token = localStorage.getItem('token');
  const boxErrorMessage = document.querySelector(`#event-${eventId} .error-message`);

  if (!token) {
    console.error('No se encontró el token de autenticación.');
    boxErrorMessage.textContent = 'Por favor, inicia sesión para confirmar tu asistencia.';
    return;
  }

  try {

    //verificar si el usuario ya ha confirmado asistencia a este evento
    const checkResponse = await fetch(`${urlProduccion}events/${eventId}/asistentes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}` // Incluye el token
      }
    });

    if (!checkResponse.ok) {
      throw new Error(`Error al verificar asistencia: ${checkResponse.statusText}`);
    }

    const checkData = await checkResponse.json();
    if (checkData.isUserAttending) {
      boxErrorMessage.textContent = 'Ya has confirmado tu asistencia a este evento.';
      return;
    }

    // Si no había confirmado previamente su asistencia, se confirma
    const response = await fetch(`${urlProduccion}events/${eventId}/confirmarAsistencia`, {
      method: 'POST',
      body: JSON.stringify({ eventId }),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}` // Incluye el token
      }
    });

    if (!response.ok) {
      throw new Error(`Error al confirmar asistencia: ${response.statusText}`);
    }

    const data = await response.json();
    boxErrorMessage.textContent= 'Se ha confirmado tu asistencia al evento.';

    return data;

  } catch (error) {
    console.error('Error:', error);
    boxErrorMessage.textContent = 'Hubo un problema al confirmar tu asistencia. Por favor, intenta de nuevo más tarde.';
  }
}

window.handleConfirmarAsistencia = async (eventId) => {
  await fetchConfirmarAsistencia(eventId);
};

// muestro los asistentes a un evento con determinado id
const fetchVerAsistentes = async (eventId) => {
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
      // body: JSON.stringify({ eventId }),
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
  }
}

window.handleVerAsistentes = async (eventId) => {
  await fetchVerAsistentes(eventId);
};