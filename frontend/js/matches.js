async function cargarMatches () {
    try {
        const id = usuario.id; // Mas adelante se importa usuario desde el login
        const response = await fetch(`http://localhost:8080/matches/${id}`);
        const matches = await response.json();
        return matches;
    }
    catch (error) {
        console.error('Error al cargar los matches:', error);
    }
}

async function cargarPersona (id) {
    const response = await fetch(`http://localhost:8080/usuarios/${id}`);
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
                    <button class="color-boton boton">Eliminar</button>
                    <button class="color-boton boton">Organizar evento</button>
                </div>  
        `;
        const matchDiv = document.getElementById('contenedor-matches');
        const matchActual = document.createElement('div');
        matchActual.classList.add('contenido');
        matchActual.innerHTML = template;
        matchDiv.appendChild(matchActual);
        const id = match.id_usuario_2; // Suponiendo que el id del otro usuario está en id_usuario_2 (Hacer verificación luego)
        const pareja = await cargarPersona(id);
        const nombre = pareja.nombre + ' ' + pareja.apellido;
        const img = pareja.imagen_url;
        matchActual.querySelector('.nombre').textContent = nombre;
        matchActual.querySelector('.foto').src = img;
    };
}

mostrarMatches();