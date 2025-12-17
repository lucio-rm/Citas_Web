document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  let sexoSeleccionado = null;

  // Manejo botones sexo/género
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
      ubicacion: document.getElementById("ciudad").value,
      edad_preferida_min: 18,
      edad_preferida_max: 99
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
      window.location.href = "login.html";

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  });
});
