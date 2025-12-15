document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("preferencias-form");

    // Traemos el usuario logueado desde localStorage
    const usuario = JSON.parse(localStorage.getItem("user"));

    if (!usuario) {
        alert("Tenés que iniciar sesión");
        window.location.href = "login.html";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const preferencias = {
            usuarioId: usuario.id,
            edadMin: document.getElementById("edadMin").value,
            edadMax: document.getElementById("edadMax").value,
            intereses: document.getElementById("interesesPreferidos").value,
            tipoCita: document.getElementById("tipoCita").value
        };

        try {
            const response = await fetch("http://localhost:3000/usuarios/preferencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(preferencias)
            });

            if (!response.ok) {
                alert("Error al guardar preferencias");
                return;
            }

            alert("Preferencias guardadas correctamente");

            // Redirigimos a explorar
            window.location.href = "explorar.html";

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "/frontend/paginas/login.html";
}
