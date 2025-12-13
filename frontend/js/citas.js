const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const nombreEnModal = document.getElementById('modal-nombre-persona');
const formulario = document.querySelector('.calificar-cita-form')

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

formulario.addEventListener('submit', (e) => {
    e.preventDefault()

    const puntajes = formulario.querySelectorAll('input[type="number"]');
    const repiteSeleccionado = formulario.querySelector('input[type="radio"]:checked');
    const notaExtra = formulario.querySelector('textarea').value;

    const calificaciones = {
        evento : puntajes[0].value,
        pareja : puntajes[1].value,
        puntualidad : puntajes[2].value,
        fluidez_conexion : puntajes[3].value,
        comodidad : puntajes[4].value,
        calidad_evento : puntajes[5].value,
        repitirias : repiteSeleccionado ? repiteSeleccionado.value : 'no',
        nota_extra : notaExtra
    }
    console.log(calificaciones)
    
    modal.style.display = 'none';
    alert('Calificación guardada');
})
