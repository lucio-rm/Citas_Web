document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const mail = document.querySelector("input[name='email']").value;
  const contrasenia = document.querySelector("input[name='password']").value;

  const res = await fetch("http://localhost:3000/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ mail, contrasenia })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  // guardamos usuario logueado
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  // redirige a página real
  window.location.href = "/frontend/paginas/explorar.html";
});


const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "/frontend/paginas/login.html";
}
