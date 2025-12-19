const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://citasweb-production.up.railway.app/';

const matchId = JSON.parse(localStorage.getItem("id_match"));
const inputFechaHora = document.getElementById('fecha_hora')


console.log(matchId);
if (!matchId) {
    console.warn("No hay matchId en la URL. Esto es solo prueba visual.");
}

const restringirFechaHoraCita = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const horas = String(hoy.getHours()).padStart(2, '0');
    const minutos = String(hoy.getMinutes()).padStart(2, '0');

    const fechaMin = `${anio}-${mes}-${dia}T${horas}:${minutos}`;

    inputFechaHora.min = fechaMin;
};

document.getElementById('form-planificar-cita').addEventListener('submit', async (e) => {
    e.preventDefault();
            
    const cita = {
        id_match: matchId ? parseInt(matchId) : 1, // el fallback pasa a 1 para pruebas si no hay ID
        lugar: document.getElementById('lugar').value,
        fecha_hora: document.getElementById('fecha_hora').value,
        tipo_encuentro: document.getElementById('tipo_encuentro').value,
        duracion_estimada_minutos: parseInt(document.getElementById('duracion').value)
    };
            
    try {
        const response = await fetch(`${API_URL}/citas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cita)
    });
                
    if (response.ok) {
        alert('¡Cita creada exitosamente!');
         window.location.href = '/paginas/citas.html';
    } else {
        const data = await response.json();
        alert('Error al crear la cita: ' + (data.error || 'Desconocido'));
    }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});

restringirFechaHoraCita();