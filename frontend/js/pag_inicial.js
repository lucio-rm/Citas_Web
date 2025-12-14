// const personas = [
//  {
//         id : 1,
//         nombre: "Ana Torres",
//         descripcion: "Amo viajar y sacar fotos.",
//         imagen: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Miyabi_Moriya_during_Gotham_Angel_City_Sep_7_25-010_%28cropped%29.jpg",
//         edad: 24,
//         ciudad: "Buenos Aires",
//         orientacion: "Heterosexual",
//         hobbies: "Cine, viajes, fotografía",
//         tags: "#aventurera #artística"
//     },
//     {
//         id : 2,
//         nombre: "Lucas Pérez",
//         descripcion: "Fan de los videojuegos y el gym.",
//         imagen: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
//         edad: 27,
//         ciudad: "Córdoba",
//         orientacion: "Bisexual",
//         hobbies: "Gym, streaming, música",
//         tags: "#gamer #fit"
//     },
//     {
//         id : 3,
//         nombre: "María Gómez",
//         descripcion: "Me encanta cocinar y leer.",
//         imagen: "https://img.freepik.com/free-photo/expressive-woman-posing-outdoor_344912-3079.jpg?semt=ais_hybrid&w=740&q=80lma.io/assets/images/placeholders/1280x960.pnghttps://img.freepik.com/free-photo/expressive-woman-posing-outdoor_344912-3079.jpg?semt=ais_hybrid&w=740&q=80https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHwwhttps://i.pinimg.com/474x/31/9d/1e/319d1e1b798ae1da876b122cf078c51b.jpghttps://mir-s3-cdn-cf.behance.net/project_modules/1400/e98f2535036667.58bc6981515a3.jpg",
//         edad: 30,
//         ciudad: "Rosario",
//         orientacion: "Heterosexual",
//         hobbies: "Lectura, cocina, yoga",
//         tags: "#chef #relax"
//     }
// ];
//let cola = [...personas];
const id_logueado = usuario.id; // Mas adelante se importa usuario desde el login
let usuarioActual = null;
const img = document.getElementById("match-img");
const nombre = document.getElementById("match-nombre");
const descripcion = document.getElementById("match-desc");
const ubicacion = document.getElementById("match-ubi");
const edad = document.getElementById("match-edad");
const genero = document.getElementById("match-genero");
const hobbies = document.getElementById("match-hobbies");
const habitos = document.getElementById("match-habitos");
const orientacion = document.getElementById("match-orientacion");
const signo = document.getElementById("match-signo");

async function cargarTags(id_pareja) {
    const response = await fetch(`http://localhost:8080/tags/${id_pareja}`);
    const tags = await response.json();
    
    const hobbies = tags.filter(tag => tag.categoria === 'HOBBY').map(tag => tag.nombre);
    const habitos = tags.filter(tag => tag.categoria === 'HABITOS').map(tag => tag.nombre);
    const orientacion = tags.filter(tag => tag.categoria === 'ORIENTACION').map(tag => tag.nombre);
    const signo = tags.filter(tag => tag.categoria === 'SIGNO').map(tag => tag.nombre);

    return { hobbies, habitos, orientacion, signo };

}

async function cargarPersonas () {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/`);
        const personas = await response.json();
        const personas_filtradas = personas
        .filter(persona => persona.id !== id_logueado)
        .map(persona => ({
            id: persona.id,
            nombre: `${persona.nombre} ${persona.apellido}`,
            descripcion: persona.descripcion_personal,
            imagen: persona.imagen_url,
            edad: persona.edad,
            ciudad: persona.ubicacion,
            genero: persona.sexo_genero
        }));
        return personas_filtradas;
    }
    catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}


async function inicializarCola() {
    cola = await cargarPersonas();
    if (!cola || cola.length === 0) {
        mostrarFinDePersonas();
        return;
    }
    usuarioActual = cola.shift();
    mostrarPersona(usuarioActual);
}

function obtenerSiguientePersona() {
    if (cola.length === 0) {
        mostrarFinDePersonas();
        return;
    }
    usuarioActual = cola.shift();
    mostrarPersona(usuarioActual);
}

function mostrarFinDePersonas() {
    img.src = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";
    nombre.textContent = "No hay más personas disponibles";
    descripcion.textContent = "";
    ubicacion.textContent = "";
    edad.textContent = "";
    genero.textContent = "";
    hobbies.textContent = "";
    habitos.textContent = "";
    orientacion.textContent = "";
    signo.textContent = "";
}

async function mostrarPersona(usuarioActual) {
    img.src = usuarioActual.imagen;
    nombre.textContent = usuarioActual.nombre;
    descripcion.textContent = usuarioActual.descripcion;
    ubicacion.textContent = `Ciudad: ${usuarioActual.ciudad}`;
    edad.textContent = `Edad: ${usuarioActual.edad}`;
    genero.textContent = `Genero: ${usuarioActual.genero}`;
    const tags = await cargarTags(usuarioActual.id);
    hobbies.textContent = tags.hobbies.join(', ') || "";
    habitos.textContent = tags.habitos.join(', ') || "";
    orientacion.textContent = tags.orientacion || "";
    signo.textContent = tags.signo || "";
}

async function darLike() {
    try {
        const response = await fetch(`http://localhost:8080/likes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario_1: id_logueado,
                id_usuario_2: usuarioActual.id,
                gusta: true
            })
        });
        if (!response.ok) {
            throw new Error('Error al registrar el like');
        }
    } catch (error) {
        console.error('Error al dar like:', error);
    }
}

document.getElementById("like").addEventListener("click", function (event) {
    event.preventDefault();
    darLike();
    obtenerSiguientePersona();
});

document.getElementById("xmark").addEventListener("click", function (event) {
    event.preventDefault();
    obtenerSiguientePersona();
});

inicializarCola();