document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  let sexoSeleccionado = null;

  const inputFechaNacimiento = document.getElementById("fecha_nacimiento");

  // restringe la fecha de nacimiento
  const restringirFechaNacimiento = () => {
      const hoy = new Date();

      const anio = hoy.getFullYear() - 18;
      const mes = String(hoy.getMonth() + 1 ).padStart(2, '0'); // le suma 1 porque los meses van del 0 al 11, y le agrega un
      const dia = String(hoy.getDate()).padStart(2, '0'); // y le agrega un 0 al inicio si es de un solo digito

      // el formato es YYYY-MM-DD
      const fechaMax = `${anio}-${mes}-${dia}`;

      // le agregamos la restriccion al input
      inputFechaNacimiento.setAttribute('max', fechaMax);
  }

  // manejod e botones sexo/género
  document.querySelectorAll("#sexo-genero .tag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#sexo-genero .tag-btn")
        .forEach(b => b.classList.remove("seleccionado"));

      btn.classList.add("seleccionado");
      sexoSeleccionado = btn.dataset.value;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!sexoSeleccionado) {
      alert("Seleccioná un sexo / género");
      return;
    }

    const usuario = {
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
      mail: document.getElementById("email").value,
      contrasenia: document.getElementById("password").value,
      sexo_genero: sexoSeleccionado,
      descripcion_personal: document.getElementById("bio").value,
      foto_perfil: document.getElementById("foto_url").value || null,
      ubicacion: document.getElementById("ciudad").value
    };

    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear usuario");
        return;
      }

     alert("Usuario creado correctamente");
     localStorage.setItem("usuario", JSON.stringify(data));
     window.location.href = "pag-editar-perfil.html";


    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  });
  restringirFechaNacimiento();
});
