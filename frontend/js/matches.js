const usuario_logueado = JSON.parse(localStorage.getItem("usuario"));

async function cargarMatches () {
    try {
        const response = await fetch(`http://localhost:3000/matches/${usuario_logueado.id}`);
        const matches = await response.json();
        return matches;
    }
    catch (error) {
        console.error('Error al cargar los matches:', error);
    }
}
async function cargarPersona (id) {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`);
    const pareja = await response.json();
    return pareja;
}

async function mostrarMatches () {
    const matches = await cargarMatches();
    for (const match of matches) {
        const template = `
                    <img class="foto" src="https://bulma.io/assets/images/placeholders/96x96.png" alt="icon">
                    <h1 class="nombre letra"></h1>
                <div>
                    <button class="color-boton boton btn-eliminar">Eliminar</button>
                    <button class="color-boton boton btn-organizar">Organizar cita</button>
                </div>  
        `;
        const match_div = document.getElementById('contenedor-matches');
        const match_actual = document.createElement('div');
        match_actual.classList.add('contenido');
        match_actual.innerHTML = template;
        match_div.appendChild(match_actual);
        let id_pareja;
        if (match.id_usuario_1 === usuario_logueado.id) {
            id_pareja = match.id_usuario_2;
        } else {
            id_pareja = match.id_usuario_1;
        }
        const pareja = await cargarPersona(id_pareja);
        const nombre = pareja.nombre + ' ' + pareja.apellido;
        const img = pareja.foto_perfil || 'https://bulma.io/assets/images/placeholders/96x96.png';
        match_actual.querySelector('.nombre').textContent = nombre;
        match_actual.querySelector('.foto').src = img;
        match_actual.dataset.matchId = match.id;
    };
}

const contenedorMatches = document.getElementById('contenedor-matches');
contenedorMatches.addEventListener('click', async (evento) => {
    if (evento.target.classList.contains('btn-eliminar')) {
        const match_div = evento.target.closest('.contenido');
        const match_id = match_div.dataset.matchId;
        if (!confirm('¿Estás seguro de qué queres eliminar este match?')) return;
        try {
            const response = await fetch(`http://localhost:3000/matches/${match_id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                match_div.remove();
            } else {
                console.error('Error al eliminar el match');
            }
        } catch (error) {
            console.error('Error al eliminar el match:', error);
        }
    }
    if (evento.target.classList.contains('btn-organizar')) {
        const match_div = evento.target.closest('.contenido');
        const match_id = match_div.dataset.matchId;
        localStorage.setItem("id_match", match_id)
        
        window.location.href = ('planificar_cita.html')
    }
});

mostrarMatches();