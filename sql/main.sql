-- CREATE DATABASE hilo_rojo;
-- tengo entendido que la creamos automáticamente desde la configuración del archivo docker-compose.yml.

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS citas;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS usuarios_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS usuarios;



CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, 
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
    edad_preferida_min INT DEFAULT 18,
    edad_preferida_max INT DEFAULT 99
);



CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    categoria VARCHAR(50) NOT NULL
);

INSERT INTO tags (nombre, categoria) VALUES
('Fútbol', 'HOBBY'), ('Cine', 'HOBBY'), ('Lectura', 'HOBBY'),
('Videojuegos', 'HOBBY'), ('Jardinería', 'HOBBY'), ('Cocinar', 'HOBBY'),
('Tocar guitarra', 'HOBBY'), ('Pintar', 'HOBBY'), ('Fotografía', 'HOBBY'),
('Pasear perros', 'HOBBY'), ('Costura', 'HOBBY'), ('Programación', 'HOBBY'),
('Fumar', 'HABITOS'), ('Beber socialmente', 'HABITOS'), ('Tomar café', 'HABITOS'),
('Correr diariamente', 'HABITOS'), ('Ir al gimnasio', 'HABITOS'), ('Meditar', 'HABITOS'),
('Escribir', 'HABITOS'), ('Usar bicicleta', 'HABITOS'), ('Escuchar podcasts', 'HABITOS'),
('Aries', 'SIGNO'), ('Escorpio', 'SIGNO'), ('Libra', 'SIGNO'),
('Cáncer', 'SIGNO'), ('Géminis', 'SIGNO'), ('Tauro', 'SIGNO'),
('Sagitario', 'SIGNO'), ('Virgo', 'SIGNO'), ('Leo', 'SIGNO'),
('Piscis', 'SIGNO'), ('Acuario', 'SIGNO'), ('Capricornio', 'SIGNO'),
('Heterosexual', 'ORIENTACION'), ('Homosexual', 'ORIENTACION'), ('Bisexual', 'ORIENTACION');



CREATE TABLE usuarios_tags (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tag INT NOT NULL,
    tipo_relacion VARCHAR(20) NOT NULL DEFAULT 'PROPIO', 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tag) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    id_usuario_1 INT NOT NULL,
    id_usuario_2 INT NOT NULL,
    fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    id_usuario_1 INT NOT NULL,
    id_usuario_2 INT NOT NULL,
    gusta BOOLEAN NOT NULL,
    FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE citas (
    id SERIAL PRIMARY KEY,
    id_match INT NOT NULL,
    lugar VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    tipo_encuentro VARCHAR(50),
    estado VARCHAR(20),
    duracion_estimada_minutos INT NOT NULL,
    FOREIGN KEY (id_match) REFERENCES matches(id) ON DELETE CASCADE
);



CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    id_citas INT NOT NULL,
    id_usuario_calificador INT NOT NULL,
    id_usuario_calificado INT NOT NULL,
    clasificacion_evento INT NOT NULL,
    clasificacion_pareja INT NOT NULL,
    repetirias VARCHAR(10) NOT NULL,
    fecha_feedback TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    puntualidad INT NOT NULL,
    fluidez_conexion INT NOT NULL,
    comodidad INT NOT NULL,
    calidad_evento INT NOT NULL,
    nota_extra TEXT,
    FOREIGN KEY (id_citas) REFERENCES citas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_calificador) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_calificado) REFERENCES usuarios(id) ON DELETE CASCADE
);


/*
si tenemos tiempo y si pinta, agregamos?:

tabla usuarios / tags:
-orientacion_preferida: (tags)
-edad_preferida
-Hobbies_preferidos: (Tags)
-Habitos_preferidos: (Tags)

tabla matches:
fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
estado VARCHAR(20) DEFAULT, -- 'activo', 'cancelado', 'bloqueado'
score_compatibilidad INT,  -- Un número del 1 al 100 calculado por el backend

tabla feedback:
afinidad INT NOT NULL



no olvidar:
usuario_etiquetas
    tipo_relacion VARCHAR(20) NOT NULL DEFAULT 'PROPIO', -- 'propio' 'busco'
'busco' = estos tags
'propio' = 'tengo' estos tags

citas:
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada'

usuarios_tags:
    ON DELETE CASCADE hace que si borras al usuario, se borren sus tags.

*/