const MAXIMOS= {HOBBIES:5, HABITOS:5, SIGNOS:1, ORIENTACION:1};
let seleccionados = {HOBBIES:[], HABITOS:[], SIGNOS:[], ORIENTACION:[]};

const inputNombre = document.getElementById('editar-nombre');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');
const inputEdad = document.getElementById('editar-edad');
const inputFotoPerfil = document.getElementById('editar-foto-perfil')

const vistaPreviaNombre = document.getElementById('vista-previa-nombre');
const vistaPreviaBio = document.getElementById('vista-previa-bio');
const vistaPreviaGenero = document.getElementById('vista-previa-genero');
const vistaPreviaUbicacion = document.getElementById('vista-previa-ciudad');
const vistaPreviaEdad = document.getElementById('vista-previa-edad');
const vistaPreviaOrientacion = document.getElementById('vista-previa-orientacion');
const vistaPreviaFotoPerfil = document.getElementById('vista-previa-img');

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
const listaTags = [
    {id: 1, nombre: 'Futbol', tipo : 'HOBBIES'},
    {id: 2, nombre: 'Cine', tipo : 'HOBBIES'},
    {id: 3, nombre: 'Lectura', tipo : 'HOBBIES'},
    {id: 4, nombre: 'Videojuegos', tipo : 'HOBBIES'},
    {id: 11, nombre: 'Fumar', tipo : 'HABITOS'},
    {id: 12, nombre: 'Beber Socialmente', tipo : 'HABITOS'},
    {id: 13, nombre: 'Tomar café', tipo : 'HABITOS'},
    {id: 21, nombre: 'Aries', tipo : 'SIGNOS'},
    {id: 22, nombre: 'Sagitario', tipo : 'SIGNOS'},
    {id: 31, nombre: 'Heterosexual', tipo : 'ORIENTACION'},
    {id: 32, nombre: 'Homosexual', tipo : 'ORIENTACION'},
    {id: 33, nombre: 'Bisexual', tipo : 'ORIENTACION'},
]

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
        btn.className = 'tag tag-btn'

        contenedor.appendChild(btn);
    })
}

incializarTags();



mostrarVistaPrevia(inputNombre, vistaPreviaNombre, 'Nombre Apellido');
mostrarVistaPrevia(inputBio, vistaPreviaBio, 'Sin biografía');
//mostrarVistaPrevia(inputGenero, vistaPreviaGenero, '-', 'Género: ');
mostrarVistaPrevia(inputUbicacion, vistaPreviaUbicacion, '-', 'Ciudad: ');
mostrarVistaPrevia(inputEdad, vistaPreviaEdad, '-', 'Edad: ');
mostrarVistaPreviaImagen(inputFotoPerfil, vistaPreviaFotoPerfil, 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?b=1&s=612x612&w=0&k=20&c=xGKz23oV80Alrtdt1xj_jr_MBSiJ9gnlOYtQv14ISwY=');
