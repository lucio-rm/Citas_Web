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
                    <button class="color-boton boton">Organizar evento</button>
                </div>  
        `;
        const matchDiv = document.getElementById('contenedor-matches');
        const matchActual = document.createElement('div');
        matchActual.classList.add('contenido');
        matchActual.innerHTML = template;
        matchDiv.appendChild(matchActual);
        let id_pareja;
        if (match.id_usuario_1 === usuario_logueado.id) {
            id_pareja = match.id_usuario_2;
        } else {
            id_pareja = match.id_usuario_1;
        }
        const pareja = await cargarPersona(id_pareja);
        const nombre = pareja.nombre + ' ' + pareja.apellido;
        const img = pareja.foto_perfil || 'https://bulma.io/assets/images/placeholders/96x96.png';
        matchActual.querySelector('.nombre').textContent = nombre;
        matchActual.querySelector('.foto').src = img;
        matchActual.dataset.matchId = match.id;
    };
}

const contenedorMatches = document.getElementById('contenedor-matches');
contenedorMatches.addEventListener('click', async (evento) => {
    if (evento.target.classList.contains('btn-eliminar')) {
        const matchDiv = evento.target.closest('.contenido');
        const matchId = matchDiv.dataset.matchId;
        if (!confirm('¿Estás seguro de qué queres eliminar este match?')) return;
        try {
            const response = await fetch(`http://localhost:3000/matches/${matchId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                matchDiv.remove();
            } else {
                console.error('Error al eliminar el match');
            }
        } catch (error) {
            console.error('Error al eliminar el match:', error);
        }
    }
});

mostrarMatches();