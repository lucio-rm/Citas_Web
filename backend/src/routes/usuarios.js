import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// obtenemos todos los usuarios
router.get('/', async (requestAnimationFrame, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al querer obtener usuarios'});
    }
});

// obtener un solo usuario
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error : 'No se encontró el Usuario, probá de nuevo.'});
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuario.'});
    }
});

// acá creamos un nuevo usuario:
router.post('/', async (req, res) => {
    try {
        const { nombre, apellido, fecha_nacimiento, mail, 
            contrasenia, sexo_genero, descripcion_personal, foto_perfil, ubicacion, 
            edad_preferida_min, edad_preferida_max} = req.body;
        
        if (!nombre || !apellido || !mail || !contrasenia) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        if (!mail.includes('@')) {
            return res.status(400).json({ error: 'Email inválido. Fijate bien.' });
        }

        // si pasa las condiciones, ingresamos todo para crear el usuario.
        const result = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, mail, contrasenia, sexo_genero,
            descripcion_personal, foto_perfil, ubicacion, edad_preferida_min, edad_preferida_max)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
            [nombre, apellido, fecha_nacimiento, mail, contrasenia, sexo_genero,
                descripcion_personal, foto_perfil, ubicacion, edad_preferida_min, edad_preferida_max]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // error 23505 que manda ps = usuario ya existe
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});


// actualizamos un usuario
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, descripcion_personal, ubicacion, 
                edad_preferida_min, edad_preferida_max } = req.body;
        
        const result = await pool.query( // COALESCE que significa usar el primer valor que no sea NULL de la lista
            `UPDATE usuarios 
             SET nombre = COALESCE($1, nombre),
                 apellido = COALESCE($2, apellido),
                 descripcion_personal = COALESCE($3, descripcion_personal),
                 ubicacion = COALESCE($4, ubicacion),
                 edad_preferida_min = COALESCE($5, edad_preferida_min),
                 edad_preferida_max = COALESCE($6, edad_preferida_max)
             WHERE id = $7
             RETURNING *`,
            [nombre, apellido, descripcion_personal, ubicacion,
             edad_preferida_min, edad_preferida_max, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

//registro de usuario
router.post('/registro', async (req, res) => {
    try {
        const { nombre, apellido, fecha_nacimiento, mail, contrasenia, 
                sexo_genero, ubicacion } = req.body;
        
        if (!nombre || !apellido || !mail || !contrasenia) {
            return res.status(400).json({ error: 'Faltan campos obligatorios, llenalos por favor.' });
        }
        
        const result = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, fecha_nacimiento, mail, contrasenia,
             sexo_genero, ubicacion)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, nombre, apellido, mail`,
            [nombre, apellido, fecha_nacimiento, mail, contrasenia, sexo_genero, ubicacion]
        );
        
        res.status(201).json({ message: 'Usuario registrado', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { mail, contrasenia } = req.body;
        
        if (!mail || !contrasenia) {
            return res.status(400).json({ error: 'El email y la contraseña son requeridos.' });
        }
        
        const result = await pool.query(
            'SELECT id, nombre, apellido, mail FROM usuarios WHERE mail = $1 AND contrasenia = $2',
            [mail, contrasenia]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        res.json({ message: 'Login exitoso', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al hacer login' });
    }
});

export default router;
