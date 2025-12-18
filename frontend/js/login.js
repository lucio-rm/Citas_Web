document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credenciales = {
      mail: document.getElementById("email").value,
      contrasenia: document.getElementById("password").value
    };

    try {
      const res = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credenciales)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al iniciar sesión");
        return;
      }

      // guarda el usuario logueado (simple)
     localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // redirige a la pantalla principal
      window.location.href = "explorar.html";

    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  });
});
