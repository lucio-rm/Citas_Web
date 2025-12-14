document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                alert("Credenciales incorrectas");
                return;
            }

            const data = await response.json();

            // Guardamos usuario logueado (simple)
            localStorage.setItem("user", JSON.stringify(data.usuario));

            // Redirigimos a explorar
            window.location.href = "explorar.html";

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});
