const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const nombrePersonaModal = document.getElementById('modal-nombre-persona');

btnCerrarModal.addEventListener('click' , () => {
    modal.style.display = 'none';
});
