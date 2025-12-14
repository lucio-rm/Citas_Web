document.addEventListener("DOMContentLoaded", () => {
    // Borramos el usuario del storage
    localStorage.removeItem("user");

    // Redirigimos al login
    window.location.href = "login.html";
});
