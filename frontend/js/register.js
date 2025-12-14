document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = {
            nombre: document.getElementById("nombre").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            edad: Number(document.getElementById("edad").value),
            ciudad: document.getElementById("ciudad").value,
            orientacion: document.getElementById("orientacion").value,
            bio: document.getElementById("bio").value,
            hobbies: document.getElementById("hobbies").value,
            intereses: document.getElementById("intereses").value
        };

        try {
            const response = await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            if (!response.ok) {
                alert("Error al crear el usuario");
                return;
            }

            alert("Cuenta creada correctamente");

            // Redirigimos a login
            window.location.href = "login.html";

        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    });
});
