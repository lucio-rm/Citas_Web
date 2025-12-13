async function cargarMatches () {
    try {
        const id = usuario.id; // Mas adelante se importa usuario desde el login
        const response = await fetch('http://localhost:8080/matches/${id}');
        const matches = await response.json();
        return matches;
    }
    catch (error) {
        console.error('Error al cargar los matches:', error);
    }
}

async function mostrarMatches () {
    const matches = await cargarMatches();
    matches.forEach(match => {
        const template = `
                    <img src="https://bulma.io/assets/images/placeholders/96x96.png" alt="icon">
                    <h1 class="letra">Nombre y apellido</h1>
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
    });
}

mostrarMatches();