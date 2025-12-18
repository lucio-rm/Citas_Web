const usuario_logueado = JSON.parse(localStorage.getItem("usuario"));
let usuario_actual = null;
let cola = [];
const usuario_dislike = [];
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

function texto(texto){
    return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
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

async function cargarTags(id_pareja) {
    const response = await fetch(`http://localhost:3000/usuarios/tags?id=${id_pareja}`);
    const tags = await response.json();
    
    const hobbies = tags.filter(tag => tag.categoria === 'HOBBY').map(tag => tag.nombre);
    const habitos = tags.filter(tag => tag.categoria === 'HABITOS').map(tag => tag.nombre);
    const orientacion = tags.filter(tag => tag.categoria === 'ORIENTACION').map(tag => tag.nombre);
    const signo = tags.filter(tag => tag.categoria === 'SIGNO').map(tag => tag.nombre);

    return { hobbies, habitos, orientacion, signo };

}

async function cargarTagsDisponibles() {
    const response = await fetch("http://localhost:3000/tags");
    const tags = await response.json();

    const hobbies = tags.filter(tag => tag.categoria === 'HOBBY');
    const habitos = tags.filter(tag => tag.categoria === 'HABITOS');
    const orientacion = tags.filter(tag => tag.categoria === 'ORIENTACION');
    const signo = tags.filter(tag => tag.categoria === 'SIGNO');

    return { hobbies, habitos, orientacion, signo };
}

async function cargarPersonasConFiltro(filtros) {
    const params = new URLSearchParams({id: usuario_logueado.id});
    if (filtros.signo) params.append('signo', filtros.signo);
    if (filtros.hobbies) params.append('hobbies', filtros.hobbies);
    if (filtros.habitos) params.append('habitos', filtros.habitos);
    if (filtros.orientacion) params.append('orientacion', filtros.orientacion)
    if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
    if (filtros.edad_min) params.append('edad_min', filtros.edad_min);
    if (filtros.edad_max) params.append('edad_max', filtros.edad_max);
    if (filtros.genero) params.append('genero', filtros.genero);
    const response = await fetch(`http://localhost:3000/usuarios/disponibles?${params.toString()}`);
    const personas = await response.json();

    return personas.map(persona => ({
            id: persona.id,
            nombre: `${persona.nombre} ${persona.apellido}`,
            descripcion: persona.descripcion_personal,
            imagen: persona.foto_perfil,
            edad: calcularEdad(persona.fecha_nacimiento),
            ciudad: persona.ubicacion,
            genero: persona.sexo_genero
    }))
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
    orientacion.textContent = `Orientación: ${tags.orientacion.join(', ')}` || "";
    signo.textContent = `Signo: ${tags.signo.join(', ')}` || "";
}

function obtenerSiguientePersona() {
    cola = cola.filter(persona => !usuario_dislike.includes(persona.id))
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

function renderBotones(tags, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    tags.forEach(tag => {
        const btn = document.createElement("button");
        btn.textContent = tag.nombre;
        btn.classList.add("boton-opcion");
        btn.dataset.id = tag.id;

        btn.addEventListener("click", () => {
            btn.classList.toggle("activo");
        });

        container.appendChild(btn);
    });
}

function obtenerSeleccionados(containerId) {
    const activo = document.querySelector(`#${containerId} .boton-opcion.activo`);
    return activo ? activo.textContent : undefined;
}

document.getElementById("like").addEventListener("click", async function (event) {
    event.preventDefault();
    await darLike();
    obtenerSiguientePersona();
});

document.getElementById("xmark").addEventListener("click", async function (event) {
    event.preventDefault();
    await darDislike();
    obtenerSiguientePersona();
});

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay-filtros");
    const boton_abrir = document.getElementById("abrir-filtros");
    const boton_cerrar = document.getElementById("cerrar-filtros");
    const boton_aplicar = document.getElementById("aplicar-filtros")

    // Abrir overlay
    boton_abrir.addEventListener("click", async () => {
        overlay.style.display = "flex";
        const tags = await cargarTagsDisponibles();
        renderBotones(tags.signo, "filtro-signo");
        renderBotones(tags.orientacion, "filtro-orientacion");
        renderBotones(tags.hobbies, "filtro-hobby");
        renderBotones(tags.habitos, "filtro-habito");
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
            ciudad: texto(document.getElementById("filtro-ciudad").value) || undefined,
            genero: texto(document.getElementById("filtro-genero").value) || undefined,
            orientacion: obtenerSeleccionados("filtro-orientacion"),
            signo: obtenerSeleccionados("filtro-signo"),
            hobbies: obtenerSeleccionados("filtro-hobby"),
            habitos: obtenerSeleccionados("filtro-habito")
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

    document.querySelectorAll(".botones-filtro").forEach(grupo => {
    grupo.addEventListener("click", (e) => {
        if (!e.target.classList.contains("boton-opcion")) return;

        // desactivar todos los del grupo
        grupo.querySelectorAll(".boton-opcion").forEach(chip =>
            chip.classList.remove("activo")
        );

        // activar el clickeado
        e.target.classList.add("activo");
    });
});

});

async function darLike() {
    if (!usuario_actual) return;

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
            alert(`¡Es match con ${usuario_actual.nombre}!`);
        } else {
            console.log(data.message);
        }

    } catch (error) {
        console.error('Error al dar like:', error);
    }
}

async function darDislike() {
    if (!usuario_actual) return;

    try {
        const response = await fetch("http://localhost:3000/matches/like", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario_1: usuario_logueado.id,
                id_usuario_2: usuario_actual.id,
                gusta: false
            })
        });

        usuario_dislike.push(usuario_actual.id)

    } catch (error) {
        console.error('Error al dar dislike:', error);
    }
}

inicializarCola();

