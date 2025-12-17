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

const usuario_logueado = JSON.parse(localStorage.getItem("usuario")); // Mas adelante se importa usuario desde el login
let usuario_actual = null;
let cola = [];
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

function calcularEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

async function cargarTags(id_pareja) {
    const response = await fetch(`http://localhost:3000/usuarios/tags?id=${id_pareja}`);
    const tags = await response.json();
    
    const hobbies = tags.filter(tag => tag.categoria === 'HOBBY').map(tag => tag.nombre);
    const habitos = tags.filter(tag => tag.categoria === 'HABITOS').map(tag => tag.nombre);
    const orientacion = tags.filter(tag => tag.categoria === 'ORIENTACION').map(tag => tag.nombre);
    const signo = tags.filter(tag => tag.categoria === 'SIGNO').map(tag => tag.nombre);

    return { hobbies, habitos, orientacion, signo };

}

async function cargarPersonas () {
    try {
        const response = await fetch(`http://localhost:3000/usuarios/disponibles?id=${usuario_logueado.id}`);
        const personas = await response.json();
        const personas_filtradas = personas
        .filter(persona => persona.id !== usuario_logueado.id)
        .map(persona => ({
            id: persona.id,
            nombre: `${persona.nombre} ${persona.apellido}`,
            descripcion: persona.descripcion_personal,
            imagen: persona.foto_perfil,
            edad: calcularEdad(persona.fecha_nacimiento),
            ciudad: persona.ubicacion,
            genero: persona.sexo_genero
        }));
        return personas_filtradas;
    }
    catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

async function cargarPersonasConFiltro(filtros) {
    const params = new URLSearchParams({id: usuario_logueado.id});
    if (filtros.signo) params.append('signo', filtros.signo);
    if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
    if (filtros.edad_min) params.append('edad_min', filtros.edad_min);
    if (filtros.edad_max) params.append('edad_max', filtros.edad_max);
    if (filtros.genero) params.append('genero', filtros.genero);
    const response = await fetch(`http://localhost:3000/usuarios/disponibles?${params.toString()}`);
    const personas = await response.json();
    return personas;
}

async function inicializarCola() {
    cola = await cargarPersonas();
    if (!cola || cola.length === 0) {
        mostrarFinDePersonas();
        return;
    }
    usuario_actual = cola.shift();
    mostrarPersona(usuario_actual);
}

function obtenerSiguientePersona() {
    if (cola.length === 0) {
        mostrarFinDePersonas();
        return;
    }
    usuario_actual = cola.shift();
    mostrarPersona(usuario_actual);
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

async function mostrarPersona(usuario_actual) {
    img.src = usuario_actual.imagen || "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";
    nombre.textContent = usuario_actual.nombre;
    descripcion.textContent = usuario_actual.descripcion;
    ubicacion.textContent = `Ciudad: ${usuario_actual.ciudad}`;
    edad.textContent = `Edad: ${usuario_actual.edad}`;
    genero.textContent = `Genero: ${usuario_actual.genero}`;
    const tags = await cargarTags(usuario_actual.id);
    hobbies.textContent = tags.hobbies.join(', ') || "";
    habitos.textContent = tags.habitos.join(', ') || "";
    orientacion.textContent = tags.orientacion.join(', ') || "";
    signo.textContent = tags.signo.join(', ') || "";
}

async function darLike() {
    if (!usuario_actual) return; // por si no hay usuario cargado

    try {
        const response = await fetch("http://localhost:3000/matches/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario_1: usuario_logueado.id,
                id_usuario_2: usuario_actual.id,
                gusta: true
            })
        });

        const data = await response.json();

        if (data.match) {
            // Si se creó un match
            alert(`¡Es match con ${usuario_actual.nombre}!`);
        } else {
            console.log(data.message); // solo like registrado
        }

    } catch (error) {
        console.error('Error al dar like:', error);
    }
}

document.getElementById("like").addEventListener("click", async function (event) {
    event.preventDefault();
    await darLike();
    cola = await cargarPersonas();
    obtenerSiguientePersona();
});

document.getElementById("xmark").addEventListener("click", function (event) {
    event.preventDefault();
    obtenerSiguientePersona();
});


document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay-filtros");
    const boton_abrir = document.getElementById("abrir-filtros");
    const boton_cerrar = document.getElementById("cerrar-filtros");
    const boton_aplicar = document.getElementById("aplicar-filtros")

    // Abrir overlay
    boton_abrir.addEventListener("click", () => {
        overlay.style.display = "flex";
    });

    // Cerrar overlay con botón
    boton_cerrar.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    // Cerrar overlay al hacer clic fuera del contenido
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.display = "none";
        }
    });

    // Aplicar filtros
    boton_aplicar.addEventListener("click", async (e) => {
        e.preventDefault();
        const filtros = {
            edad_min: parseInt(document.getElementById("filtro-edad-min").value) || undefined,
            edad_max: parseInt(document.getElementById("filtro-edad-max").value) || undefined,
            ciudad: document.getElementById("filtro-ciudad").value || undefined,
            genero: document.getElementById("filtro-genero").value || undefined,
            signo: document.getElementById("filtro-signo").value || undefined,

        }
        overlay.style.display = "none";
        cola = await cargarPersonasConFiltro(filtros);

        if (!cola || cola.length === 0){
            mostrarFinDePersonas();
            return;
        }

        usuario_actual = cola.shift();
        mostrarPersona(usuario_actual);
    })
});


inicializarCola();

