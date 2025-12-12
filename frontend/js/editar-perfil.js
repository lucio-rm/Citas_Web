const inputNombre = document.getElementById('editar-nombre');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');
const inputEdad = document.getElementById('editar-edad');
const inputOrientacion = document.getElementById('editar-orientacion-sexual');
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


mostrarVistaPrevia(inputNombre, vistaPreviaNombre, 'Nombre Apellido');
mostrarVistaPrevia(inputBio, vistaPreviaBio, 'Sin biografía');
//mostrarVistaPrevia(inputGenero, vistaPreviaGenero, '-', 'Género: ');
mostrarVistaPrevia(inputUbicacion, vistaPreviaUbicacion, '-', 'Ciudad: ');
mostrarVistaPrevia(inputEdad, vistaPreviaEdad, '-', 'Edad: ');
mostrarVistaPrevia(inputOrientacion, vistaPreviaOrientacion, '-', 'Orientación sexual: ');
mostrarVistaPreviaImagen(inputFotoPerfil, vistaPreviaFotoPerfil, 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?b=1&s=612x612&w=0&k=20&c=xGKz23oV80Alrtdt1xj_jr_MBSiJ9gnlOYtQv14ISwY=');
