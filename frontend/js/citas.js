const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const btnCerrarEditar = document.getElementById('btn-cerrar-editar');
const modalEditar = document.getElementById('modal-editar-cita');
const nombreEnModal = document.getElementById('modal-nombre-persona');
const nombreEnModalEditar = document.getElementById('nombre-editar');
const formulario = document.getElementById('form-calificar-cita');
const formularioEditar = document.getElementById('form-editar-cita');

//boton para cerrar el modal (formulario de calificacion)
btnCerrarModal.addEventListener('click' , () => {
    modal.style.display = 'none'; //le quita el display al modal (formulario)
});
//boton para cerrar el modal de editar cita
btnCerrarEditar.addEventListener('click', () => {
    modalEditar.style.display = 'none';
});

const configurarBotones = () => {
    //boton para abrir el modal (formulario de calificacion)
    document.querySelectorAll('.boton-abrir-modal').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa
            modal.dataset.idCita = tarjeta.dataset.id; //le pasamos el id de la tarjeta al modal *1
            modal.dataset.idPareja = tarjeta.dataset.pareja; //le pasamos el id de la pareja al modal *2
            const nombrePersona = tarjeta.querySelector('h3').innerText;
            nombreEnModal.innerText = nombrePersona;
            modal.style.display = 'block'; //muestra el modal (formulario)
            
        });
    });
    
    //boton para cancelar cita
    document.querySelectorAll('.boton-cancelar').forEach(boton => {
        boton.addEventListener('click', async (e) => {
            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa
            const nombrePersona = tarjeta.querySelector('h3').innerText;
            const confirmar = confirm(`¿Seguro que quieres cancelar la cita con ${nombrePersona}?`);
            const idCita = tarjeta.dataset.id;
    
            if (confirmar) {
                try {
                    // le pide al backend que cancele la cita
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

    //boton para editar cita
    document.querySelectorAll('.boton-editar').forEach( boton => {
        boton.addEventListener('click', async (e) => {

            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa

            const info = JSON.parse(tarjeta.dataset.info); //obtiene la info de la tarjeta en formato JSON
            const modalEditar = document.getElementById('modal-editar-cita');
            

            nombreEnModalEditar.innerText = info.nombre_pareja;
            modalEditar.dataset.idCita = tarjeta.dataset.id;

            document.getElementById('lugar-editar').value = info.lugar;
            document.getElementById('duracion-editar').value = info.duracion_estimada_minutos;
            document.getElementById('tipo-encuentro-editar').value = info.tipo_encuentro;

            if (info.fecha_hora) {
                document.getElementById('fecha-hora-editar').value = info.fecha_hora.substring(0, 16);
            }

            modalEditar.style.display = 'block';
        });
    });
    
};

// boton para enviar el formulario de calificacion
formulario.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // se guardan los datos del formulario
    const puntajes = formulario.querySelectorAll('input[type="number"]'); //guarda todos los puntajes
    const repiteSeleccionado = formulario.querySelector('input[type="radio"]:checked'); //si repite o no
    const notaExtra = formulario.querySelector('textarea').value;//nota extra
    
    const idCita = modal.dataset.idCita; //recupera el id de la tarjeta que se guardó en el modal *1
    const idPareja = modal.dataset.idPareja; //recupera el id de la pareja que se guardó en el modal *2
    const idUsuario = localStorage.getItem('idUsuario') || 1; //id del usuario que califica (desde el localStorage o 1 por defecto)
    
    // objeto con los datos a enviar
    const calificaciones = {
        id_citas : idCita,
        id_usuario_calificador : idUsuario,
        id_usuario_calificado : idPareja,
        evento : puntajes[0].value,
        pareja : puntajes[1].value,
        puntualidad : puntajes[2].value,
        fluidez_conexion : puntajes[3].value,
        comodidad : puntajes[4].value,
        calidad_evento : puntajes[5].value,
        repetirias : repiteSeleccionado ? repiteSeleccionado.value : 'no',
        nota_extra : notaExtra
    }
    //console.log(calificaciones)
    
    try {
        // le pide al backendd que guarde el feedback
        const respuesta = await fetch('http://localhost:3000/feedback/guardar', {
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

formularioEditar.addEventListener('submit', async (e) => {

    e.preventDefault();

    const idCita = modalEditar.dataset.idCita;

    //toma los datos del formulario de editar
    const datosActualizados = {
        lugar : document.getElementById('lugar-editar').value,
        fecha_hora : document.getElementById('fecha-hora-editar').value,
        duracion_estimada_minutos : document.getElementById('duracion-editar').value,
        tipo_encuentro : document.getElementById('tipo-encuentro-editar').value,
        estado : 'pendiente'
    }

    try {

        const respuesta = await fetch(`http://localhost:3000/citas/${idCita}`, {
            method : 'PUT',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(datosActualizados)
        })

        if (respuesta.ok) {
            alert('Cita actualizada con éxito');
            location.reload();
        } else {
            alert('Hubo un error al actualizar la cita');
        }


    } catch (error) {
        console.error("Error al actualizar la cita: ", error);
    }
})


const cargarCitas = async () => {
    try {

        const idUsuario = localStorage.getItem('idUsuario') || 1;
        // pide las citas al backend
        const respuesta = await fetch(`http://localhost:3000/citas/ver?idUsuario=${idUsuario}`);
        const citas = await respuesta.json();

        //toma los contenedores de citas (pendientes y anteriores)
        const listaPendientes = document.getElementById('contenedor-pendientes')
        const listaAnteriores = document.getElementById('contenedor-anteriores')

        // por cada cita que recibe del backend crea una tarjeta
        citas.forEach( cita => {
            const fechaFormateada = new Date(cita.fecha_hora).toLocaleString('es-AR', {
                day : '2-digit',
                month : '2-digit',
                year : 'numeric',
                hour : '2-digit',
                minute : '2-digit',
            });

            const citaJSON = JSON.stringify(cita);

            const tarjeta = `
            <article class="tarjeta-cita" data-id="${cita.id_cita}" data-pareja="${cita.id_pareja}" data-info='${citaJSON}'>
                    <img src="${cita.foto_perfil}" alt="foto-perfil" class="foto-cita">
                    <div class="info-cita">
                        <h3 class="letra">${cita.nombre_pareja}</h3>
                        <p class="info-fecha">${fechaFormateada}</p>
                        <p class="info-lugar">${cita.lugar}</p>
                    </div>
                    ${
                        cita.estado === 'pendiente' ?
                        `<div class="botones-contenedor">
                            <button class="boton boton-cancelar">Cancelar</button>
                            <button class="boton boton-editar">Editar</button>
                        </div>`:
                        cita.id_feedback ? //si id_feedback tiene valor
                        '<button class="boton boton-calificado">Ya calificado</button>' : //si ya calificó
                        '<button class="boton boton-abrir-modal">Calificar</button>' //si no calificó aun
                        }
                    
                </article>
            `;

            // decide si va a la parte de citas pendientes o anteriores
            if (cita.estado === 'pendiente') {
                listaPendientes.innerHTML += tarjeta;
            } else {
                listaAnteriores.innerHTML += tarjeta;
            }
        });

        if (citas.filter(c => c.estado === 'pendiente').length === 0) {
            listaPendientes.innerHTML = '<p class="letra">No tienes citas pendientes.</p>';
        }
        if (citas.filter(c => c.estado !== 'pendiente').length === 0) {
            listaAnteriores.innerHTML = '<p class="letra">Aún no has tenido citas.</p>';
        }
        configurarBotones();

    } catch (error) {

        console.error("Error al cargar las citas", error)

    }
}

// carga las citas cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', cargarCitas);