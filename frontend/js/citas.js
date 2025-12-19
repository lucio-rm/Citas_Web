const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://citasweb-production.up.railway.app/';

const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const modal = document.querySelector('.modal-calificacion-cita');
const btnCerrarEditar = document.getElementById('btn-cerrar-editar');
const modalEditar = document.getElementById('modal-editar-cita');
const nombreEnModal = document.getElementById('modal-nombre-persona');
const nombreEnModalEditar = document.getElementById('nombre-editar');
const formulario = document.getElementById('form-calificar-cita');
const formularioEditar = document.getElementById('form-editar-cita');
const inputFechaHora = document.getElementById('fecha-hora-editar')
//boton para cerrar el modal (formulario de calificacion)
btnCerrarModal.addEventListener('click' , () => {
    modal.style.display = 'none'; //le quita el display al modal (formulario)
});
//boton para cerrar el modal de editar cita
btnCerrarEditar.addEventListener('click', () => {
    modalEditar.style.display = 'none';
});


const restringirFechaHoraCita = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const horas = String(hoy.getHours()).padStart(2, '0');
    const minutos = String(hoy.getMinutes()).padStart(2, '0');

    const fechaMin = `${anio}-${mes}-${dia}T${horas}:${minutos}`;

    inputFechaHora.min = fechaMin;
};



const configurarBotones = () => {
    //boton para abrir el modal (formulario de calificacion)
    document.querySelectorAll('.boton-abrir-modal').forEach(boton => {
        boton.addEventListener('click', (e) => {
            formulario.reset(); //resetea el formulario al abrirlo
            modal.querySelector('.strong1').innerText = "Calificar Cita"; //cambia el titulo del modal para evitar errores
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
                    const respuesta = await fetch(`${API_URL}/citas/cancelar/${idCita}`, {
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

    // boton para eliminar calificacion
    document.querySelectorAll('.boton-eliminar-calificacion').forEach( boton => {
        boton.addEventListener('click', async (e) => {
            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa

            const nombrePersona = tarjeta.querySelector('h3').innerText;
            const confirmar = confirm(`¿Seguro que quieres eliminar la calificación de ${nombrePersona}?`);
            
            const idCita = tarjeta.dataset.id; // obtiene el id de la cita

            if (confirmar) {
                try {
                    // le pide al backend que elimine la calificacion
                    const respuesta = await fetch(`${API_URL}/feedback/${idCita}`, {
                        method : 'DELETE'
                    });
                    const datos = await respuesta.json();
                    alert(datos.mensaje);

                    if (respuesta.ok) {
                        location.reload();
                    }
                } catch (error) {
                    console.error('Error al eliminar la calificación: ', error);
                }
            }
        });
    });

    //boton para editar calificacion
    document.querySelectorAll('.boton-editar-calificacion').forEach( boton => {
        boton.addEventListener('click', async (e) => {
            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa
            const nombrePersona = tarjeta.querySelector('h3').innerText; // obtiene el nombre de la persona
            const idCita = tarjeta.dataset.id; // obtiene el id de la cita

            try {
                const respuesta = await fetch(`${API_URL}/feedback/cita/${idCita}`, {
                    method : 'GET'
                });
                const feedback = await respuesta.json();
                
                modal.dataset.idCita = idCita; //le pasamos el id de la tarjeta al modal
                modal.dataset.idPareja = tarjeta.dataset.pareja; //le pasamos el id de la pareja al modal
                nombreEnModal.innerText = nombrePersona;

                const inputsPuntajes = formulario.querySelectorAll('input[type="number"]');
                inputsPuntajes[0].value = feedback.clasificacion_evento;
                inputsPuntajes[1].value = feedback.clasificacion_pareja;
                inputsPuntajes[2].value = feedback.puntualidad;
                inputsPuntajes[3].value = feedback.fluidez_conexion;
                inputsPuntajes[4].value = feedback.comodidad;
                inputsPuntajes[5].value = feedback.calidad_evento;

                const radio = formulario.querySelector(`input[type="radio"][value="${feedback.repetirias}"]`);
                if (radio) radio.checked = true;

                formulario.querySelector('textarea').value = feedback.nota_extra;

                modal.querySelector('.strong1').innerText = "Editar Calificación";
                modal.style.display = 'block';

            } catch (error) {
                console.error('Error al cargar los datos del feedback: ', error);
            }
        });
    })

    //boton para editar cita
    document.querySelectorAll('.boton-editar').forEach( boton => {
        boton.addEventListener('click', async (e) => {

            const tarjeta = e.target.closest('.tarjeta-cita'); //obtiene la tarjeta completa

            const info = JSON.parse(tarjeta.dataset.info); //obtiene la info de la tarjeta en formato JSON
            const modalEditar = document.getElementById('modal-editar-cita');
            

            nombreEnModalEditar.innerText = info.nombre_pareja;
            modalEditar.dataset.idCita = tarjeta.dataset.id; //le pasamos el id de la tarjeta al modal *1

            //le agrega al formulario los datos actuales de la cita
            document.getElementById('lugar-editar').value = info.lugar;
            document.getElementById('duracion-editar').value = info.duracion_estimada_minutos;
            document.getElementById('tipo-encuentro-editar').value = info.tipo_encuentro;

            if (info.fecha_hora) {
                document.getElementById('fecha-hora-editar').value = info.fecha_hora.substring(0, 16);
            }
            
            //muestra el modal de editar
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
    const usuarioLogeado = JSON.parse(localStorage.getItem('usuario'));

    const idUsuario = usuarioLogeado ? usuarioLogeado.id : null;
    
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
    
    const esEditar = modal.querySelector('.strong1').innerText === "Editar Calificación";

    const url = esEditar ? 
        `${API_URL}/feedback/actualizar` :
        `${API_URL}/feedback/guardar`;

    const metodo = esEditar ? 'PUT' : 'POST';

    try {
        // le pide al backendd que guarde el feedback
        const respuesta = await fetch(url, {
            method : metodo,
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

// boton para enviar el formulario de editar cita
formularioEditar.addEventListener('submit', async (e) => {

    e.preventDefault();

    const idCita = modalEditar.dataset.idCita; //recupera el id de la tarjeta que se guardó en el modal *3

    //toma los datos del formulario de editar
    const datosActualizados = {
        lugar : document.getElementById('lugar-editar').value,
        fecha_hora : document.getElementById('fecha-hora-editar').value,
        duracion_estimada_minutos : document.getElementById('duracion-editar').value,
        tipo_encuentro : document.getElementById('tipo-encuentro-editar').value,
        estado : document.getElementById('estado-editar').value
    }

    try {

        const respuesta = await fetch(`${API_URL}/citas/${idCita}`, {
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

        const usuarioLogeado = JSON.parse(localStorage.getItem('usuario'));

        const idUsuario = usuarioLogeado ? usuarioLogeado.id : null;

        // pide las citas al backend
        const respuesta = await fetch(`${API_URL}/citas/ver?idUsuario=${idUsuario}`);
        const citas = await respuesta.json();

        //toma los contenedores de citas (pendientes y anteriores)
        const listaPendientes = document.getElementById('contenedor-pendientes')
        const listaAnteriores = document.getElementById('contenedor-anteriores')

        // por cada cita que recibe del backend crea una tarjeta
        citas.forEach( cita => {

            const fotoAMostrar = (cita.foto_perfil && cita.foto_perfil !== "null") 
        ? cita.foto_perfil 
        : 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg';

            const fechaFormateada = new Date(cita.fecha_hora).toLocaleString('es-AR', {
                timeZone: 'UTC',
                day : '2-digit',
                month : '2-digit',
                year : 'numeric',
                hour : '2-digit',
                minute : '2-digit',
            });

            const citaJSON = JSON.stringify(cita);

            //crea la tarjeta de la cita (pendiente o anterior, calificada o no calificada)
            const tarjeta = `
            <article class="tarjeta-cita" data-id="${cita.id_cita}" data-pareja="${cita.id_pareja}" data-info='${citaJSON}'>
                    <img src="${fotoAMostrar}" alt="foto-perfil" class="foto-cita">
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
                            `<div class="botones-contenedor">
                                <button class="boton boton-editar-calificacion">Editar nota</button>
                                <button class="boton boton-eliminar-calificacion">Borrar nota</button>
                            </div>` : 
                            '<button class="boton boton-abrir-modal">Calificar</button>'
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

        //por si el usuario no tiene citas en alguna de las dos secciones
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
restringirFechaHoraCita();

// carga las citas cuando el HTML esté listo
document.addEventListener('DOMContentLoaded', cargarCitas);