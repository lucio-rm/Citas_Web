const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://citasweb-production.up.railway.app';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credenciales = {
      mail: document.getElementById("email").value,
      contrasenia: document.getElementById("password").value
    };

    try {
      const res = await fetch(`${API_URL}/usuarios/login`, {
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
