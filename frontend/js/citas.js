const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const nombreEnModal = document.getElementById('modal-nombre-persona');
const formulario = document.querySelector('.calificar-cita-form')

//boton para cerrar el modal (formulario de calificacion)
btnCerrarModal.addEventListener('click' , () => {
    modal.style.display = 'none';
});

const configurarBotones = () => {
    //boton para abrir el modal (formulario de calificacion)
    document.querySelectorAll('.boton-abrir-modal').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.tarjeta-cita');
            modal.dataset.idCita = tarjeta.dataset.id; //le pasamos el id de la tarjeta al modal *1
            modal.dataset.idPareja = tarjeta.dataset.pareja; //le pasamos el id de la pareja al modal *2
            const nombrePersona = tarjeta.querySelector('h3').innerText;
            nombreEnModal.innerText = nombrePersona;
            modal.style.display = 'block';
            
        });
    });
    
    //boton para cancelar cita
    document.querySelectorAll('.boton-cancelar').forEach(boton => {
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
};

formulario.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const puntajes = formulario.querySelectorAll('input[type="number"]'); //guarda todos los puntajes
    const repiteSeleccionado = formulario.querySelector('input[type="radio"]:checked'); //si repite o no
    const notaExtra = formulario.querySelector('textarea').value;//nota extra
    
    const idCita = modal.dataset.idCita; //recupera el id de la tarjeta que se guardó en el modal *1
    const idPareja = modal.dataset.idPareja; //recupera el id de la pareja que se guardó en el modal *2
    
    const calificaciones = {
        id_citas : idCita,
        id_usuario : idPareja,
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


const cargarCitas = async () => {
    try {
        const respuesta = await fetch('http://localhost:3000/citas');
        const citas = await respuesta.json();

        const listaPendientes = document.getElementById('contenedor-pendientes')
        const listaAnteriores = document.getElementById('contenedor-anteriores')

        citas.forEach( cita => {
            const fechaFormateada = new Date(cita.fecha_hora).toLocaleString('es-AR', {
                day : '2-digit',
                month : '2-digit',
                year : 'numeric',
                hour : '2-digit',
                minute : '2-digit',
            });

            const tarjeta = `
            <article class="tarjeta-cita" data-id="${cita.id_cita}" data-pareja="${cita.id_pareja}">
                    <img src="${cita.foto_perfil}" alt="foto-perfil" class="foto-cita">
                    <div class="info-cita">
                        <h3 class="letra">${cita.nombre_pareja}</h3>
                        <p class="info-fecha">${fechaFormateada}</p>
                        <p class="info-lugar">${cita.lugar}</p>
                    </div>
                    ${cita.estado === 'pendiente' ?
                    '<button class="boton boton-cancelar">Cancelar</button>' :
                    '<button class="boton boton-abrir-modal">Calificar</button>'}
                    
                </article>
            `;

            if (cita.estado === 'pendiente') {
                listaPendientes.innerHTML += tarjeta;
            } else {
                listaAnteriores.innerHTML += tarjeta;
            }
        });

        configurarBotones();

    } catch (error) {

        console.error("Error al cargar las citas", error)

    }
}

document.addEventListener('DOMContentLoaded', cargarCitas);