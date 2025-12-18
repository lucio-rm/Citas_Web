# Citas_Web
2 OPCIONEs de levantar el proyecto
npm + docker db

docker completo



Página de citas a ciegas. 
1.
    Para levantar backend y frontend fuera de docker (Localmente)
    En la carpeta de backend hacer:
    - npm start

    En la carpeta de frontend hacer:
    - npm start

    (Si les salta error pq no tienen instalado express, hagan npm install)

    levantan la base de datos con:

    - docker-compose up -d db
    y en .env tienen que tener estos dos asi:

    DB_HOST=localhost
    DB_NAME=hilo_rojo

2.
    Si estan levantando backend y frontend con docker en .env tienen que tener:
    DB_HOST=db
    DB_NAME=hilo_rojo


el 1 es para desarrollo, es mas facil cargar las cosas cuando cambias algo, solo haces en la consola ctrl + c y salen, luego de nuevo npm start y levantan con los cambios.
el 2 es para cuando este terminado y no haya que hacer muchos cambios (pq si cambian algo tienen que bajar los contenedores, y volver a hacer un docker compose build, lo que les crea una imagen, las anteriores no se eliminan, asi que se les llena la memoria, vayan borrando si hacen eso)

# Descripción del proyecto

# Instrucciones para instalarlo

# Instrucciones para correrlo

# Capturas de pantalla
![alt text](<screenshot/Screenshot from 2025-12-17 21-08-08.png>)
# Tecnologías usadas



Tobi:
    boton de organizar evento, lo apretas y te manda a planificar_cita
    te guarda el id de quien crea la cita y con quien la crea
    y la cita creada va para mis citas


de crear cuenta a editar-perfil -> widder

CRUD FEEDBACK -> tommy
    eliminar feedback
    editar feedback


personas en la db -> widder

poner contraseña chequeada -> lucio

completar README.md -------__> Lucio

Makefile - pal npm

borrar preferencias htlm css js + Todas las funciones y llamdos (ojo)-> widder

chequear comentarios chatgpt -> lucio




LLAMDA ds 17:00
FINAL:
pulir detalles 
chequeamos comentarios
revisar github
ramas ¿
Publicarlo - Deploy -> todos juntitos

