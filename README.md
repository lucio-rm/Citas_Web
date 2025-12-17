# Citas_Web
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

# Tecnologías usadas

