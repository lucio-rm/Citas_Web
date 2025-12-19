const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://citasweb-production.up.railway.app/';

document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("logout-btn");
  if (!btnLogout) return;

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "/paginas/login.html";
  });
});
