const matchId = JSON.parse(localStorage.getItem("id_match"));
// validacion simple para que no se rompa si entran sin matchId
console.log(matchId);
if (!matchId) {
    console.warn("No hay matchId en la URL. Esto es solo prueba visual.");
}

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
        const response = await fetch('http://localhost:3000/citas', {
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