document.addEventListener("DOMContentLoaded", () => {

    // 🔒 Protección: si no hay usuario logueado → login
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    const form = document.getElementById("preferencias-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Tomamos valores
        const edadMin = document.getElementById("edadMin").value;
        const edadMax = document.getElementById("edadMax").value;

        // Convertimos strings separados por coma en arrays
        const hobbiesPropios = document.getElementById("hobbiesPropios").value
            .split(",")
            .map(h => h.trim())
            .filter(h => h !== "");

        const habitosPropios = document.getElementById("habitosPropios").value
            .split(",")
            .map(h => h.trim())
            .filter(h => h !== "");

        const orientacionPropia = document.getElementById("orientacionPropia").value
            .trim();

        const hobbiesBusco = document.getElementById("hobbiesBusco").value
            .split(",")
            .map(h => h.trim())
            .filter(h => h !== "");

        const habitosBusco = document.getElementById("habitosBusco").value
            .split(",")
            .map(h => h.trim())
            .filter(h => h !== "");

        const orientacionBusco = document.getElementById("orientacionBusco").value
            .trim();

        // Armamos payload
        const preferencias = {
            id_usuario: usuario.id,
            edad_min: edadMin,
            edad_max: edadMax,
            propios: {
                hobbies: hobbiesPropios,
                habitos: habitosPropios,
                orientacion: orientacionPropia
            },
            busco: {
                hobbies: hobbiesBusco,
                habitos: habitosBusco,
                orientacion: orientacionBusco
            }
        };

        try {
            const res = await fetch("http://localhost:3000/usuarios/preferencias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(preferencias)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Error al guardar preferencias");
                return;
            }

            alert("Preferencias guardadas correctamente");

            // Redirigimos al explorar
            window.location.href = "explorar.html";

        } catch (error) {
            console.error(error);
            alert("No se pudo conectar con el servidor");
        }
    });
});
