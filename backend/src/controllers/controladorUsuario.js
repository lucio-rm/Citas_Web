import { pool } from "../db.js";

const obtenerUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al querer obtener usuarios' });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error : 'No se encontró el usuario, probá de nuevo.' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuario.' });
    }
};

const crearUsuario = async (req, res) => {
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
};

const actualizarUsuario = async (req, res) => {
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
};

const eliminarUsuario = async (req, res) => {
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
};

const loginUsuario = async (req, res) => {
    try {
        const { mail, contrasenia } = req.body;
        
        if (!mail || !contrasenia) {
            return res.status(400).json({ error: 'El email y la contraseña son requeridos.' });
        }
        
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE mail = $1',
            [mail]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Mail inexistente' });
        }
        const usuario = result.rows[0];
        if (usuario.contrasenia !== contrasenia) {
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        res.json({ message: 'Login exitoso', usuario: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al hacer login' });
    }
};

const usuariosDisponibles = async (req, res) => {
    const id_logueado = parseInt(req.query.id);
    const signo = req.query.signo;
    try{
        let query = `
            SELECT u.* FROM usuarios u
            LEFT JOIN likes l
                ON l.id_usuario_1 = $1 AND l.id_usuario_2 = u.id
            LEFT JOIN matches m
                ON ( 
                    (m.id_usuario_1 = $1 AND m.id_usuario_2 = u.id)
                    OR
                    (m.id_usuario_1 = u.id AND m.id_usuario_2 = $1)
                )
        `;
        const params = [id_logueado]
        if (signo) {
            query +=  `
                JOIN usuarios_tags ut ON ut.id_usuario = u.id
                JOIN tags t ON t.id = ut.id_tags AND t.categoria = 'SIGNO' AND t.nombre = $2 
            `;
            params.add(signo);
        }
        query += `
            WHERE u.id != $1 AND l.id IS NULL AND m.id IS NULL;
        `;
        const result = await pool.query(query, params);
        res.json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al cargar usuarios disponibles')
    }
};

const obtenerTags = async (req, res) => {
    const id_pareja = parseInt(req.query.id)
    try{
        const result = await pool.query(`
            SELECT t.nombre, t.categoria FROM tags t
            JOIN usuarios_tags ut
                ON ut.id_tag = t.id
            WHERE ut.id_usuario = $1;
            `, [id_pareja])
        res.json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al cargar tags')
    }
}
//const actualizarPreferencias = async (req, res) => {
//    try {
//        const { id } = req.params;
//        const { edad_preferida_min, edad_preferida_max } = req.body;
//
//        const result = await pool.query(
//            `UPDATE usuarios
//             SET edad_preferida_min = $1,
//                 edad_preferida_max = $2
//            WHERE id = $3
//             RETURNING *`,
//            [edad_preferida_min, edad_preferida_max, id]
//        );
//
//        if (result.rows.length === 0) {
//            return res.status(404).json({ error: "Usuario no encontrado" });
//        }
//
//        res.json(result.rows[0]);
//    } catch (err) {
//        console.error(err);
//        res.status(500).json({ error: "Error al guardar preferencias" });
//    }
//};

export {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    usuariosDisponibles,
    obtenerTags
    //actualizarPreferencias
};