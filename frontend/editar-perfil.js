const inputNombre = document.getElementById('editar-nombre');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');
const inputEdad = document.getElementById('editar-edad');
const inputOrientacion = document.getElementById('editar-orientacion-sexual');

const vistaPreviaNombre = document.getElementById('vista-previa-nombre');
const vistaPreviaBio = document.getElementById('vista-previa-bio');
const vistaPreviaGenero = document.getElementById('vista-previa-genero');
const vistaPreviaUbicacion = document.getElementById('vista-previa-ciudad');
const vistaPreviaEdad = document.getElementById('vista-previa-edad');
const vistaPreviaOrientacion = document.getElementById('vista-previa-orientacion');

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


mostrarVistaPrevia(inputNombre, vistaPreviaNombre, 'Nombre Apellido');
mostrarVistaPrevia(inputBio, vistaPreviaBio, 'Sin biografía');
//mostrarVistaPrevia(inputGenero, vistaPreviaGenero, '-', 'Género: ');
mostrarVistaPrevia(inputUbicacion, vistaPreviaUbicacion, '-', 'Ciudad: ');
mostrarVistaPrevia(inputEdad, vistaPreviaEdad, '-', 'Edad: ');
mostrarVistaPrevia(inputOrientacion, vistaPreviaOrientacion, '-', 'Orientación sexual: ');
