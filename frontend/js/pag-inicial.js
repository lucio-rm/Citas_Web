
document.addEventListener("DOMContentLoaded", () => {
  const usuarioJSON = localStorage.getItem("usuario");

  // Si NO hay sesión → login
  if (!usuarioJSON) {
    window.location.href = "login.html";
    return;
  }

  // Si hay sesión
  const usuario = JSON.parse(usuarioJSON);

  // Mostrar nombre
  const nombreElem = document.getElementById("match-nombre");
  if (nombreElem) {
    nombreElem.textContent = `${usuario.nombre} ${usuario.apellido}`;
  }

  // Mostrar ciudad
  const ubicacionElem = document.getElementById("match-ubi");
  if (ubicacionElem && usuario.ubicacion) {
    ubicacionElem.textContent = "Ciudad: " + usuario.ubicacion;
  }
});
