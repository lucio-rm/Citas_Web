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
const orientacion = document.getElementById("match-orientacion");
const hobbies = document.getElementById("match-hobbies");
const tags = document.getElementById("match-tags");

async function cargarPersonas () {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/`);
        const personas = await response.json();
        const personas_filtradas = personas
        .filter(personas => personas.id !== id_logueado)
        .map(personas_filtradas => ({
            id: personas_filtradas.id,
            nombre: `${personas_filtradas.nombre} ${personas_filtradas.apellido}`,
            descripcion: personas_filtradas.descripcion_personal,
            imagen: personas_filtradas.imagen_url,
            edad: personas_filtradas.edad,
            ciudad: personas_filtradas.ubicacion,
            orientacion: personas_filtradas.orientacion_sexual
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
    cargarPersona(usuarioActual);
}

function obtenerSiguientePersona() {
    if (cola.length === 0) {
        mostrarFinDePersonas();
        return;
    }
    usuarioActual = cola.shift();
    cargarPersona(usuarioActual);
}

function mostrarFinDePersonas() {
    img.src = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";
    nombre.textContent = "No hay más personas disponibles";
    descripcion.textContent = "";
    ubicacion.textContent = "";
    edad.textContent = "";
    orientacion.textContent = "";
    hobbies.textContent = "";
    tags.textContent = "";
}

function cargarPersona() {
    img.src = usuarioActual.imagen;
    nombre.textContent = usuarioActual.nombre;
    descripcion.textContent = usuarioActual.descripcion;
    ubicacion.textContent = `Ciudad: ${usuarioActual.ciudad}`;
    edad.textContent = `Edad: ${usuarioActual.edad}`;
    orientacion.textContent = `Orientación Sexual: ${usuarioActual.orientacion}`;
    hobbies.textContent = usuarioActual.hobbies;
    tags.textContent = usuarioActual.tags;
}

document.getElementById("like").addEventListener("click", function (event) {
    event.preventDefault();
    obtenerSiguientePersona();
});

document.getElementById("xmark").addEventListener("click", function (event) {
    event.preventDefault();
    obtenerSiguientePersona();
});

inicializarCola();