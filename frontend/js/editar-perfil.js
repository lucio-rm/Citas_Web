const MAXIMOS= {HOBBY:5, HABITOS:5, SIGNO:1, ORIENTACION:1}; //maximos seleccionables por categoria
let seleccionados = {HOBBY:[], HABITOS:[], SIGNO:[], ORIENTACION:[]}; //tags seleccionados por categoria

//variable del formulario
const formPerfil = document.querySelector('.editar-perfil-form');

//variables de los inputs
const inputNombre = document.getElementById('editar-nombre');
const inputApellido = document.getElementById('editar-apellido');
const inputBio = document.getElementById('editar-bio');
const inputGenero = document.getElementById('editar-genero');
const inputUbicacion = document.getElementById('editar-ubicacion');
const inputFechaNacimiento = document.getElementById('editar-fecha-nacimiento');
const inputFotoPerfil = document.getElementById('editar-foto-perfil')
const inputContrasenia = document.getElementById('editar-contraseña');

//variables de la vista previa
const vistaPreviaNombre = document.getElementById('vista-previa-nombre');
const vistaPreviaApellido = document.getElementById('vista-previa-apellido');
const vistaPreviaBio = document.getElementById('vista-previa-bio');
const vistaPreviaGenero = document.getElementById('vista-previa-genero');
const vistaPreviaUbicacion = document.getElementById('vista-previa-ciudad');
const vistaPreviaEdad = document.getElementById('vista-previa-edad');
const vistaPreviaOrientacion = document.getElementById('vista-previa-orientacion');
const vistaPreviaFotoPerfil = document.getElementById('vista-previa-img');

// calcula la edad a partir de la fecha de nacimiento
const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

// muestra los datos en la vista previa a medida que se escriben
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

// muestra la imagen de vista previa a medida que se escribe la url
function mostrarVistaPreviaImagen(editarElemento, vistaPreviaElemento, urlDefault) {
    const actualizarVistaPreviaImagen = () => {
        const url = editarElemento.value.trim();
        vistaPreviaElemento.src = url ? url : urlDefault;
    };

    actualizarVistaPreviaImagen();

    editarElemento.addEventListener('input', actualizarVistaPreviaImagen);
}

let listaTags = []

// carga los tags desde el backend a la variable listaTags
const inicializarListaTags = async () => {

    try {
        const respuesta = await fetch('http://localhost:3000/tags', {
            method : 'GET'
        });
        if (!respuesta.ok) {
            throw new Error("Error al obtener los tags");
        };

        const tags = await respuesta.json();

        listaTags = tags.map(tag => ({ //convertimos 
            id : tag.id,
            nombre : tag.nombre,
            categoria : tag.categoria
        }));

    } catch (error) {
        console.error("Error al cargar los tags: ", error);
    };

}

// muestra los tags de listaTags en los contenedores correspondientes
function incializarTags() {
    const mapeoContenedores = {
        'HOBBY' : document.querySelector('.editor-hobby'),
        'HABITOS' : document.querySelector('.editor-habitos'),
        'SIGNO' : document.querySelector('.editor-signo'),
        'ORIENTACION' : document.querySelector('.editor-orientacion'),
    };

    listaTags.forEach(tag => {
        const contenedor = mapeoContenedores[tag.categoria];
        if (!contenedor){
            console.error('No se encontró el contenedor');
            return;
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = tag.nombre;
        btn.className = 'boton tag tag-btn'

        btn.onclick = () => manejarClickTag(tag, btn);

        contenedor.appendChild(btn);
    })
}

// carga los tags del usuario
const cargarTagsUsuario = async (usuarioId) => {

    try {
        const respuesta = await fetch(`http://localhost:3000/tags/usuario/${usuarioId}`, {
            method : 'GET'
        });

        if (!respuesta.ok) { //si hubo un error
            throw new Error("Error al obtener los tags del usuario");
        }

        const tagsAgrupados = await respuesta.json();

        Object.keys(tagsAgrupados).forEach( categoria => {
            const tagsPorCategoria = tagsAgrupados[categoria];
        
            tagsPorCategoria.forEach ( tagNombre => {

                if (seleccionados[categoria]) {
                    seleccionados[categoria].push(tagNombre); //lo agrega a la variables seleccionados
                };
        
                const contenedor = document.querySelector(`.editor-${categoria.toLowerCase()}`);
        
                if (contenedor) {
                    const botonesTags = contenedor.querySelectorAll('.tag-btn');
        
                    botonesTags.forEach( btn => {
                        if (btn.textContent === tagNombre) {
                            btn.classList.add('seleccionado'); //le pone la clase seleccionado
                        }
                    });
                }
            })
        });
    } catch (error) {
        console.error("Error al cargar los tags del usuario: ", error);
    };
};


// maneja la seleccion y deseleccion de los tags
function manejarClickTag(tag, btn){
    const cat = tag.categoria;
    const listaActual = seleccionados[cat];
    const indice = listaActual.indexOf(tag.nombre);

    if (indice > -1) {
        listaActual.splice(indice , 1);
        btn.classList.remove('seleccionado')
    }
    else{
        if (listaActual.length < MAXIMOS[cat]){
            listaActual.push(tag.nombre);
            btn.classList.add('seleccionado')
            console.log('aaaaa')
        }
        else if (MAXIMOS[cat] === 1){
            seleccionados[cat] = [tag.nombre];
            const hermanos = btn.parentElement.querySelectorAll('.tag-btn');
            hermanos.forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado')
            console.log('bbbbb')
        }
        else{
            alert('No puedes seleccionar mas tags de esta categoria.')
        }
    }
    mostrarVistaPreviaTags();
}

// muestra los tags en la vista previa a medida que se seleccionan
function mostrarVistaPreviaTags(){

    const renderizarTags = (contenedor, listaTags) => {
        const contenedorVistaPrevia = document.querySelector(contenedor);
        contenedorVistaPrevia.innerHTML = '';

        listaTags.forEach(tag => {
            const span = document.createElement('span');
            span.className= 'tag-vista-previa';
            span.textContent = tag;
            contenedorVistaPrevia.appendChild(span);
        });
    }

    renderizarTags('.vista-previa-hobbies', seleccionados['HOBBY'])
    renderizarTags('.vista-previa-habitos', seleccionados['HABITOS'])
    const extras = seleccionados['SIGNO'].concat(seleccionados['ORIENTACION'])
    renderizarTags('.vista-previa-extras', extras)

}

// carga los datos del usuario desde el backend y llama a las funciones de vista previa
const cargarDatosUsuario = async () => {
    try {

        const usuarioId = localStorage.getItem('idUsuario') || 1;

        const respuesta = await fetch(`http://localhost:3000/usuarios/${usuarioId}`, {
            method : 'GET'
        })

        if (!respuesta.ok) {
            throw new Error("Error al obtener datos del usuario");
        }

        const usuario = await respuesta.json();

        // asigna los datos del usuario que recibimos del backend o un valor por defecto si no existe para evitar errores
        inputNombre.value = usuario.nombre || '';
        inputApellido.value = usuario.apellido || '';
        inputFotoPerfil.value = usuario.foto_perfil || '';
        inputBio.value = usuario.descripcion_personal || '';
        inputGenero.value = usuario.sexo_genero || '';
        inputUbicacion.value = usuario.ubicacion || '';

        if (usuario.fecha_nacimiento) {
            inputFechaNacimiento.value = usuario.fecha_nacimiento.substring(0, 10); // asigna la fecha recortada a YYYY-MM-DD
        }

        mostrarVistaPrevia(inputNombre, vistaPreviaNombre, 'Nombre ');
        mostrarVistaPrevia(inputApellido, vistaPreviaApellido, 'Apellido');
        mostrarVistaPrevia(inputBio, vistaPreviaBio, 'Sin biografía');
        mostrarVistaPreviaImagen(inputFotoPerfil, vistaPreviaFotoPerfil, 'https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?b=1&s=612x612&w=0&k=20&c=xGKz23oV80Alrtdt1xj_jr_MBSiJ9gnlOYtQv14ISwY=');
        mostrarVistaPrevia(inputUbicacion, vistaPreviaUbicacion, '-', 'Ciudad: ');
        
        const mostrarEdad = () => {
            const fecha = inputFechaNacimiento.value;
            const edad = calcularEdad(fecha);
            vistaPreviaEdad.textContent = edad > 0 ? `Edad: ${edad}` : 'Edad: -';
        }

        inputFechaNacimiento.addEventListener('change', mostrarEdad); 
        mostrarEdad();
        incializarTags();
        await cargarTagsUsuario(usuarioId);
        mostrarVistaPreviaTags();

    } catch (error) {
        console.error("Error al cargar datos del usuario: ", error);
    }
}

// actualiza los tags del usuario
const actualizarTagsUsuario = async (usuarioId) => {
    const tagsAEnviar = [
        ...seleccionados.HOBBY,
        ...seleccionados.HABITOS,
        ...seleccionados.SIGNO,
        ...seleccionados.ORIENTACION
    ]

    try {
        const respuesta = await fetch(`http://localhost:3000/tags/usuario/${usuarioId}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({ tags : tagsAEnviar })
        });

        if (!respuesta.ok) {
            throw new Error(`Fallo al actualizar tags. Status: ${respuesta.status}`);
        }

    } catch (error) {
        console.error("Error al actualizar los tags del usuario: ", error);
    }
}

// actualiza los datos del usuario
const guardarCambiosUsuario = async (e) => {

    e.preventDefault();

    const idUsuario = localStorage.getItem('idUsuario') || 1;

    const datosAActualizar = {
        nombre : inputNombre.value.trim(),
        apellido : inputApellido.value.trim(),
        foto_perfil : inputFotoPerfil.value.trim(),
        descripcion_personal : inputBio.value.trim(),
        sexo_genero : inputGenero.value,
        ubicacion : inputUbicacion.value.trim(),
        fecha_nacimiento : inputFechaNacimiento.value,
        contrasenia : inputContrasenia.value
    };

    try {
        const respuesta = await fetch(`http://localhost:3000/usuarios/${idUsuario}`, {
            method : 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(datosAActualizar)
        });

        if (!respuesta.ok) {
            throw new Error(`Fallo al actualizar los datos del usuario. Status: ${respuesta.status}`);
        };
        await actualizarTagsUsuario(usuarioId);

        alert('Cambios guardados exitosamente.');


    } catch (error) {
        console.error("Error al guardar los cambios del usuario: ", error);
        alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
    }

}


document.addEventListener('DOMContentLoaded', async () =>{
    await inicializarListaTags();

    cargarDatosUsuario();
});

if (formPerfil) { 
    formPerfil.addEventListener('submit', guardarCambiosUsuario);
}