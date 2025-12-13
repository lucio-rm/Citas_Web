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
