document.addEventListener("DOMContentLoaded", () => {
  const btnLogout = document.getElementById("logout-btn");
  if (!btnLogout) return;

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  });
});
