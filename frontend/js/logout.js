document.addEventListener("DOMContentLoaded", () => {
    // Borramos el usuario del storage
    localStorage.removeItem("user");

    // Redirigimos al login
    window.location.href = "login.html";
});

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "/frontend/paginas/login.html";
}
