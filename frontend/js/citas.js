const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const nombreEnModal = document.getElementById('modal-nombre-persona');

btnCerrarModal.addEventListener('click' , () => {
    modal.style.display = 'none';
});

document.querySelectorAll('.bloque-citas:last-of-type .boton').forEach(boton => {
    boton.addEventListener('click', (e) => {
        const tarjeta = e.target.closest('.tarjeta-cita');
        const nombrePersona = tarjeta.querySelector('h3').innerText;
        nombreEnModal.innerText = nombrePersona;
        modal.style.display = 'block';

    });
});

