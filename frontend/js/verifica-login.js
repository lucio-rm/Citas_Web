document.addEventListener("DOMContentLoaded", () => {
  const usuarioJSON = localStorage.getItem("usuario");

  // si NO hay sesión va al login
  if (!usuarioJSON) {
    window.location.href = "login.html";
    return;
  }

  // si hay sesión
  const usuario = JSON.parse(usuarioJSON);

  // muestra el nombre
  const nombreElem = document.getElementById("match-nombre");
  if (nombreElem) {
    nombreElem.textContent = `${usuario.nombre} ${usuario.apellido}`;
  }

  // muestra la ciudad
  const ubicacionElem = document.getElementById("match-ubi");
  if (ubicacionElem && usuario.ubicacion) {
    ubicacionElem.textContent = "Ciudad: " + usuario.ubicacion;
  }
});
