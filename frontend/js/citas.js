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
        modal.dataset.idCita = tarjeta.dataset.id; //le pasamos el id de la tarjeta al modal *1
        const nombrePersona = tarjeta.querySelector('h3').innerText;
        nombreEnModal.innerText = nombrePersona;
        modal.style.display = 'block';

    });
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()

    const puntajes = formulario.querySelectorAll('input[type="number"]'); //guarda todos los puntajes
    const repiteSeleccionado = formulario.querySelector('input[type="radio"]:checked'); //si repite o no
    const notaExtra = formulario.querySelector('textarea').value;//nota extra

    const idCita = modal.dataset.idCita; //recupera el id de la tarjeta que se guardó en el modal *1

    const calificaciones = {
        id_citas : idCita,
        id_usuario : 1,
        evento : puntajes[0].value,
        pareja : puntajes[1].value,
        puntualidad : puntajes[2].value,
        fluidez_conexion : puntajes[3].value,
        comodidad : puntajes[4].value,
        calidad_evento : puntajes[5].value,
        repetirias : repiteSeleccionado ? repiteSeleccionado.value : 'no',
        nota_extra : notaExtra
    }
    console.log(calificaciones)
    
    try {
        const respuesta = await fetch('http://localhost:3000/citas/feedback', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(calificaciones)
        });

        const datos = await respuesta.json();
        alert(datos.mensaje);

        if (respuesta.ok) {
            modal.style.display = 'none';
            formulario.reset();
            location.reload();
        }
    } catch (error) {
        console.error("Error al enviar el feedback: ", error);
    }

})

document.querySelectorAll('.bloque-citas:first-of-type .boton-cancelar').forEach(boton => {
    boton.addEventListener('click', async (e) => {
        const tarjeta = e.target.closest('.tarjeta-cita');
        const nombrePersona = tarjeta.querySelector('h3').innerText;
        const confirmar = confirm(`¿Seguro que quieres cancelar la cita con ${nombrePersona}?`);
        const idCita = tarjeta.dataset.id;

        if (confirmar) {
            try {
                const respuesta = await fetch(`http://localhost:3000/citas/cancelar/${idCita}`, {
                    method : 'PATCH'
                });
                const datos = await respuesta.json();
                alert(datos.mensaje);

                if (respuesta.ok) {
                    location.reload();
                }
            } catch (error) {
                console.error('Error al cancelar la cita: ', error);
            }
        }
    })
});
