CREATE DATABASE hilo_rojo;

USE hilo_rojo;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    mail VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(100) NOT NULL,
    sexo_genero VARCHAR(30) NOT NULL,
    descripcion_personal TEXT,
    foto_perfil VARCHAR(255),
    ubicacion VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edad_preferida_min INT,
    edad_preferida_max INT
    
    -- NOTA:
    -- de esta tabla me faltaron Hobbies, Hábitos y Orientación que tienen los 'tags' que van en las tablas satélites.
);

/*
Usuarios
-Id primary
-Nombre not null
-Apellido not null
-fecha_de_nacimiento not null
-Mail not null
-ContraseÃ±a not null
-Sexo/genero not null
-Hobbies:
	(tags)
-Habitos:
	(tags)
-Orientacion_sexual:
	(tags)
-descripcion_personal
-foto_perfil (url)
-ubicacion
-fecha_registro

(VER)
-orientacion_preferida:
	(tags)
-edad_preferida
-Hobbies_preferidos:
	(Tags)
-Habitos_preferidos:
	(Tags)
*/







/*
match
-id
-id_usuario1
-id_usuario2

citas
-id
-id_match
-Lugar
-horario
-tipo de evento
-duracion_estimada
-estado
*/

/*
Feedback
-id
-id_citas
-id_usuario
-calificacion_evento
-calificacion_pareja
-repetir
-fecha_feedback
-puntualidad
-fluidez
-comodidad
-calidad_evento
-afinidad
-nota_extra


*/