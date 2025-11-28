const inputNombre = document.getElementById('editar-nombre');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');

const vistaPreviaNombre = document.getElementById('vista-previa-nombre');
const vistaPreviaBio = document.getElementById('vista-previa-bio');
const vistaPreviaGenero = document.getElementById('vista-previa-genero');
const vistaPreviaUbicacion = document.getElementById('vista-previa-ciudad');

inputNombre.addEventListener('input', () => {
    const nuevoNombre = inputNombre.value.trim();
    if (nuevoNombre) {
        vistaPreviaNombre.textContent = nuevoNombre;
    } else {
        vistaPreviaNombre.textContent = 'Nombre Apellido';
    }
});

inputBio.addEventListener('input', () => {
    const nuevaBio = inputBio.value.trim();
    if (nuevaBio) {
        vistaPreviaBio.textContent = nuevaBio;
    } else {
        vistaPreviaBio.textContent = 'Biografía del usuario';
    }
});

// inputGenero.addEventListener('input', () => {
//     const nuevoGenero = inputGenero.value.trim();
//     if (nuevoGenero) {
//         vistaPreviaGenero.textContent = nuevoGenero;
//     } else {
//         vistaPreviaGenero.textContent = 'Género del usuario';
//     }
// });

inputUbicacion.addEventListener('input', () => {
    const nuevaUbicacion = inputUbicacion.value.trim();
    if (nuevaUbicacion) {
        vistaPreviaUbicacion.textContent = 'Ciudad: ' + nuevaUbicacion;
    }
    else {
        vistaPreviaUbicacion.textContent = 'Ciudad: ';
    }
});