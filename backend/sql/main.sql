-- CREATE DATABASE hilo_rojo;
-- la creamos automáticamente desde la configuración del archivo docker-compose.yml.


CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE IF NOT EXISTS usuarios (
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

INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, mail, contrasenia, sexo_genero, descripcion_personal, foto_perfil, ubicacion)
VALUES
('Ana', 'Torres', '1998-03-12', 'ana.torres@example.com', '@Aa123456', 'Femenino', 'Amo viajar y sacar fotos.', 'https://randomuser.me/api/portraits/women/68.jpg', 'Buenos Aires'),
('Lucas', 'Pérez', '1995-07-23', 'lucas.perez@example.com', '@Aa123456', 'Masculino', 'Fanático del cine y los videojuegos.', 'https://randomuser.me/api/portraits/men/75.jpg', 'Córdoba'),
('María', 'Gómez', '2000-01-05', 'maria.gomez@example.com', '@Aa123456', 'Femenino', 'Disfruto de la lectura y la música.', 'https://randomuser.me/api/portraits/women/45.jpg', 'Rosario'),
('Juan', 'Martínez', '1992-11-17', 'juan.martinez@example.com', '@Aa123456', 'Masculino', 'Amante del deporte y la naturaleza.', 'https://randomuser.me/api/portraits/men/32.jpg', 'Mendoza'),
('Valentina', 'Rojas', '1999-05-29', 'valentina.rojas@example.com', '@Aa123456', 'Femenino', 'Me encanta cocinar y pintar.', 'https://randomuser.me/api/portraits/women/12.jpg', 'Salta'),
('Sofía', 'López', '1997-08-14', 'sofia.lopez@example.com', '@Aa123456', 'Femenino', 'Yoga, café y charlas largas.', 'https://randomuser.me/api/portraits/women/22.jpg', 'Buenos Aires'),
('Tomás', 'Fernández', '1994-02-09', 'tomas.fernandez@example.com', '@Aa123456', 'Masculino', 'Ingeniero y amante del running.', 'https://randomuser.me/api/portraits/men/41.jpg', 'La Plata'),
('Camila', 'Suárez', '2001-06-30', 'camila.suarez@example.com', '@Aa123456', 'Femenino', 'Fotografía y redes sociales.', 'https://randomuser.me/api/portraits/women/30.jpg', 'Mar del Plata'),
('Nicolás', 'Ramírez', '1996-10-21', 'nicolas.ramirez@example.com', '@Aa123456', 'Masculino', 'Programador y gamer casual.', 'https://randomuser.me/api/portraits/men/53.jpg', 'Córdoba'),
('Florencia', 'Castro', '1993-12-02', 'florencia.castro@example.com', '@Aa123456', 'Femenino', 'Arte, museos y caminatas.', 'https://randomuser.me/api/portraits/women/55.jpg', 'Buenos Aires'),
('Martín', 'Díaz', '1990-04-18', 'martin.diaz@example.com', '@Aa123456', 'Masculino', 'Fan del asado y el fútbol.', 'https://randomuser.me/api/portraits/men/60.jpg', 'Rosario'),
('Julieta', 'Vega', '1998-09-07', 'julieta.vega@example.com', '@Aa123456', 'Femenino', 'Viajes cortos y escapadas.', 'https://randomuser.me/api/portraits/women/19.jpg', 'Neuquén'),
('Agustín', 'Morales', '1995-01-26', 'agustin.morales@example.com', '@Aa123456', 'Masculino', 'Entrenamiento funcional.', 'https://randomuser.me/api/portraits/men/18.jpg', 'San Juan'),
('Paula', 'Herrera', '1997-07-11', 'paula.herrera@example.com', '@Aa123456', 'Femenino', 'Diseño gráfico freelance.', 'https://randomuser.me/api/portraits/women/63.jpg', 'Santa Fe'),
('Diego', 'Ortiz', '1991-05-03', 'diego.ortiz@example.com', '@Aa123456', 'Masculino', 'Ciclismo urbano.', 'https://randomuser.me/api/portraits/men/27.jpg', 'Buenos Aires'),
('Carolina', 'Molina', '1999-11-22', 'carolina.molina@example.com', '@Aa123456', 'Femenino', 'Psicología y bienestar.', 'https://randomuser.me/api/portraits/women/7.jpg', 'Tucumán'),
('Leandro', 'Silva', '1994-08-05', 'leandro.silva@example.com', '@Aa123456', 'Masculino', 'Música indie y vinilos.', 'https://randomuser.me/api/portraits/men/83.jpg', 'CABA'),
('Micaela', 'Navarro', '2000-02-16', 'micaela.navarro@example.com', '@Aa123456', 'Femenino', 'Estudiante de medicina.', 'https://randomuser.me/api/portraits/women/40.jpg', 'Corrientes'),
('Federico', 'Arias', '1993-06-28', 'federico.arias@example.com', '@Aa123456', 'Masculino', 'Barista y amante del café.', 'https://randomuser.me/api/portraits/men/91.jpg', 'Córdoba'),
('Rocío', 'Benítez', '1996-09-19', 'rocio.benitez@example.com', '@Aa123456', 'Femenino', 'Senderismo y aire libre.', 'https://randomuser.me/api/portraits/women/26.jpg', 'Bariloche'),
('Pablo', 'Ibarra', '1989-12-14', 'pablo.ibarra@example.com', '@Aa123456', 'Masculino', 'Emprendedor tech.', 'https://randomuser.me/api/portraits/men/14.jpg', 'Buenos Aires'),
('Lara', 'Peralta', '2001-04-09', 'lara.peralta@example.com', '@Aa123456', 'Femenino', 'Ilustración digital.', 'https://randomuser.me/api/portraits/women/50.jpg', 'La Rioja'),
('Gonzalo', 'Rivas', '1997-01-31', 'gonzalo.rivas@example.com', '@Aa123456', 'Masculino', 'Streamer casual.', 'https://randomuser.me/api/portraits/men/36.jpg', 'San Luis'),
('Belén', 'Cabrera', '1995-10-08', 'belen.cabrera@example.com', '@Aa123456', 'Femenino', 'Amante de los animales.', 'https://randomuser.me/api/portraits/women/72.jpg', 'Chaco'),
('Emiliano', 'Acosta', '1992-03-25', 'emiliano.acosta@example.com', '@Aa123456', 'Masculino', 'Marketing digital.', 'https://randomuser.me/api/portraits/men/67.jpg', 'CABA'),
('Natalia', 'Ponce', '1998-06-17', 'natalia.ponce@example.com', '@Aa123456', 'Femenino', 'Nutrición y vida sana.', 'https://randomuser.me/api/portraits/women/34.jpg', 'Mendoza'),
('Franco', 'Sosa', '1996-09-02', 'franco.sosa@example.com', '@Aa123456', 'Masculino', 'Escalada deportiva.', 'https://randomuser.me/api/portraits/men/48.jpg', 'San Martín'),
('Victoria', 'Luna', '1999-12-27', 'victoria.luna@example.com', '@Aa123456', 'Femenino', 'Astrología y tarot.', 'https://randomuser.me/api/portraits/women/9.jpg', 'Buenos Aires'),
('Matías', 'Correa', '1994-05-15', 'matias.correa@example.com', '@Aa123456', 'Masculino', 'Docente de historia.', 'https://randomuser.me/api/portraits/men/5.jpg', 'La Pampa')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS tags (
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
('Heterosexual', 'ORIENTACION'), ('Homosexual', 'ORIENTACION'), ('Bisexual', 'ORIENTACION')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS usuarios_tags (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_tag INT NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tag) REFERENCES tags(id) ON DELETE CASCADE
);

INSERT INTO usuarios_tags(id_usuario, id_tag) VALUES
(1, 1), (1, 4), (1, 5), (1, 34), (1, 25),
(2, 2), (2, 3), (2, 6), (2, 35), (2, 27),
(3, 5), (3, 8), (3, 10), (3, 36), (3, 30),
(4, 1), (4, 4), (4, 5), (4, 34), (4, 24),
(5, 1), (5, 4), (5, 5), (5, 34), (5, 28)
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    id_usuario_1 INT NOT NULL,
    id_usuario_2 INT NOT NULL,
    fecha_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    id_usuario_1 INT NOT NULL,
    id_usuario_2 INT NOT NULL,
    gusta BOOLEAN NOT NULL,
    FOREIGN KEY (id_usuario_1) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_2) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_likes_unicos ON likes(id_usuario_1, id_usuario_2);

CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    id_match INT NOT NULL,
    lugar VARCHAR(100) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    tipo_encuentro VARCHAR(50),
    estado VARCHAR(20),
    duracion_estimada_minutos INT NOT NULL,
    FOREIGN KEY (id_match) REFERENCES matches(id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS feedback (
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

