const MAXIMOS= {HOBBIES:5, HABITOS:5, SIGNOS:1, ORIENTACION:1};
let seleccionados = {HOBBIES:[], HABITOS:[], SIGNOS:[], ORIENTACION:[]};

const inputNombre = document.getElementById('editar-nombre');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');
const inputFechaNacimiento = document.getElementById('editar-fecha-nacimiento');
const inputFotoPerfil = document.getElementById('editar-foto-perfil')
const inputContrasenia = document.getElementById('editar-contraseña');

const vistaPreviaNombre = document.getElementById('vista-previa-nombre');
const vistaPreviaBio = document.getElementById('vista-previa-bio');
const vistaPreviaGenero = document.getElementById('vista-previa-genero');
const vistaPreviaUbicacion = document.getElementById('vista-previa-ciudad');
const vistaPreviaEdad = document.getElementById('vista-previa-edad');
const vistaPreviaOrientacion = document.getElementById('vista-previa-orientacion');
const vistaPreviaFotoPerfil = document.getElementById('vista-previa-img');

const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function mostrarVistaPrevia(editarElemento, vistaPreviaElemento, textoDefault, prefijo = '') {

    const actualizarVistaPrevia = () => {
        const valor = editarElemento.value.trim();
        if (valor) {
            vistaPreviaElemento.textContent = prefijo + valor;
        } else {
            vistaPreviaElemento.textContent = prefijo + textoDefault;
        }
    }

    actualizarVistaPrevia();

    editarElemento.addEventListener('input', actualizarVistaPrevia);

}
function mostrarVistaPreviaImagen(editarElemento, vistaPreviaElemento, urlDefault) {
    const actualizarVistaPreviaImagen = () => {
        const url = editarElemento.value.trim();
        vistaPreviaElemento.src = url ? url : urlDefault;
    };

    actualizarVistaPreviaImagen();

    editarElemento.addEventListener('input', actualizarVistaPreviaImagen);
}
//temporal
const listaTags = []

function incializarTags() {
    const mapeoContenedores = {
        'HOBBIES' : document.querySelector('.editor-hobbies'),
        'HABITOS' : document.querySelector('.editor-habitos'),
        'SIGNOS' : document.querySelector('.editor-signos'),
        'ORIENTACION' : document.querySelector('.editor-orientacion'),
    };

    listaTags.forEach(tag => {
        const contenedor = mapeoContenedores[tag.tipo];
        if (!contenedor){
            console.error('ERROR: Tag no encontrado')
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = tag.nombre;
        btn.className = 'boton tag tag-btn'

        btn.onclick = () => manejarClickTag(tag, btn);

        contenedor.appendChild(btn);
    })
}

function manejarClickTag(tag, btn){
    const cat = tag.tipo;
    const listaActual = seleccionados[cat];
    const indice = listaActual.indexOf(tag.nombre);

    if (indice > -1) {
        listaActual.splice(indice , 1);
        btn.classList.remove('seleccionado')
    }
    else{
        if (listaActual.length < MAXIMOS[cat]){
            listaActual.push(tag.nombre);
            btn.classList.add('seleccionado')
            console.log('aaaaa')
        }
        else if (MAXIMOS[cat] === 1){
            seleccionados[cat] = [tag.nombre];
            const hermanos = btn.parentElement.querySelectorAll('.tag-btn');
            hermanos.forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado')
            console.log('bbbbb')
        }
        else{
            alert('No puedes seleccionar mas tags de esta categoria.')
        }
    }
    mostrarVistaPreviaTags();
}

function mostrarVistaPreviaTags(){

    const renderizarTags = (contenedor, listaTags) => {
        const contenedorVistaPrevia = document.querySelector(contenedor);
        contenedorVistaPrevia.innerHTML = '';

        listaTags.forEach(tag => {
            const span = document.createElement('span');
            span.className= 'tag-vista-previa';
            span.textContent = tag;
            contenedorVistaPrevia.appendChild(span);
        });
    }

    renderizarTags('.vista-previa-hobbies', seleccionados['HOBBIES'])
    renderizarTags('.vista-previa-habitos', seleccionados['HABITOS'])
    const extras = seleccionados['SIGNOS'].concat(seleccionados['ORIENTACION'])
    renderizarTags('.vista-previa-extras', extras)

}

//listo
const cargarDatosUsuario = async () => {
    try {

        const usuarioId = localStorage.getItem('idUsuario') || 1;

        const respuesta = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method : 'GET'
        })

        if (!respuesta.ok) {
            throw new Error("Error al obtener datos del usuario");
        }

        const usuario = await respuesta.json();

        // asigna los datos del usuario que recibimos del backend o un valor por defecto si no existe para evitar errores
        inputNombre.value = usuario.nombre || '';
        inputFotoPerfil.value = usuario.foto_perfil || '';
        inputBio.value = usuario.descripcion_personal || '';
        inputGenero.value = usuario.sexo_genero || '';
        inputUbicacion.value = usuario.ubicacion || '';

        if (usuario.fecha_nacimiento) {
            inputFechaNacimiento.value = usuario.fecha_nacimiento.substring(0, 10); // asigna la fecha recortada a YYYY-MM-DD
        }

        mostrarVistaPrevia(inputNombre, vistaPreviaNombre, 'Nombre Apellido');
        mostrarVistaPrevia(inputBio, vistaPreviaBio, 'Sin biografía');
        mostrarVistaPreviaImagen(inputFotoPerfil, vistaPreviaFotoPerfil, 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?b=1&s=612x612&w=0&k=20&c=xGKz23oV80Alrtdt1xj_jr_MBSiJ9gnlOYtQv14ISwY=');
        mostrarVistaPrevia(inputUbicacion, vistaPreviaUbicacion, '-', 'Ciudad: ');
        
        const mostrarEdad = () => {
            const fecha = inputFechaNacimiento.value;
            const edad = calcularEdad(fecha);
            vistaPreviaEdad.textContent = edad > 0 ? `Edad: ${edad}` : 'Edad: -';
        }

        inputFechaNacimiento.addEventListener('change', mostrarEdad); 
        mostrarEdad();
        incializarTags();
        mostrarVistaPreviaTags();

    } catch (error) {
        console.error("Error al cargar datos del usuario: ", error);
    }
}



document.addEventListener('DOMContentLoaded', cargarDatosUsuario);