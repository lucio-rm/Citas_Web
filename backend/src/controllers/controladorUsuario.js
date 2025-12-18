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
            edad_preferida_min, edad_preferida_max } = req.body;

        // valido los campos obligatorios
        if (!nombre || !apellido || !mail || !contrasenia || !fecha_nacimiento || !sexo_genero) {
            return res.status(400).json({
                error: "Faltan campos obligatorios."
            });
        }

        // que ni el nombre ni el apelido tengan números
        if (nombre.match(/[0-9]/) || apellido.match(/[0-9]/)) {
            return res.status(400).json({ error: 'El nombre y apellido no pueden tener números.' });
        }

        // regex mail
        const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mail.match(regexMail)) {
            return res.status(400).json({ error: 'El formato del email no es válido.' });
        }

        
        const contraRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s])[\S]{8,}/;

        if (!contrasenia.match(contraRegex)) {
            return res.status(400).json({ 
                error: 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial (sin espacios).' 
            });
        }

        // Calculo de edad
        const partes = fecha_nacimiento.split("-"); 
        const anioNacimiento = parseInt(partes[0]); 
        const anioActual = new Date().getFullYear(); // Usamos fecha real por las dudas
        const edad = anioActual - anioNacimiento;

        // valido la edad
        if (edad < 18 || edad > 100) {
            return res.status(400).json({ error: 'Edad inválida (tenes que ser mayor de edad (>18) y menor a 100 años).' });
        }

        // metemos todo a la base de datos
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
        console.error("ERROR POSTGRES:", err);
        // Si el mail ya existe (error unique violation)
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El email ya está registrado.' });
        }
        res.status(500).json({ 
            error: err.message,
            code: err.code,
            detail: err.detail
        });
    }      
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre,
        apellido, foto_perfil, descripcion_personal, sexo_genero,
        ubicacion, fecha_nacimiento, contrasenia
        } = req.body;
        
        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre = COALESCE($2, nombre),
                 apellido = COALESCE($3, apellido),
                 foto_perfil = COALESCE($4, foto_perfil),
                 descripcion_personal = COALESCE($5, descripcion_personal),
                 sexo_genero = COALESCE($6, sexo_genero),
                 ubicacion = COALESCE($7, ubicacion),
                 fecha_nacimiento = COALESCE($8, fecha_nacimiento),
                 contrasenia = COALESCE($9, contrasenia)
             WHERE id = $1
             RETURNING *`,
            [id, nombre, apellido, foto_perfil, descripcion_personal, sexo_genero,
            ubicacion, fecha_nacimiento, contrasenia]
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
            return res.status(400).json({ error: 'El email y la contraseña son necesarios.' });
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
    const {
        signo,
        ciudad,
        genero,
        edad_min,
        edad_max,
        hobbies,
        habitos,
        orientacion
    }= req.query;
    try{
        let query = `
            SELECT DISTINCT u.* FROM usuarios u
            LEFT JOIN likes l
                ON l.id_usuario_1 = $1 AND l.id_usuario_2 = u.id
            LEFT JOIN matches m
                ON ( 
                    (m.id_usuario_1 = $1 AND m.id_usuario_2 = u.id)
                    OR
                    (m.id_usuario_1 = u.id AND m.id_usuario_2 = $1)
                )
        `;
        const params = [id_logueado];
        let idx = 2;
        if (signo) {
            query += `
                JOIN usuarios_tags ut_signo ON ut_signo.id_usuario = u.id
                JOIN tags t_signo ON t_signo.id = ut_signo.id_tag 
                AND t_signo.categoria = 'SIGNO' AND t_signo.nombre = $${idx} 
            `;
            params.push(signo);
            idx++;
        }
        // NOTA: Para que funcione 'unaccent' tu base de datos debe tener la extensión instalada.
        // Si falla, cambialo a ILIKE normal.
        if (hobbies) {
            query += `
            JOIN usuarios_tags ut_hobby ON ut_hobby.id_usuario = u.id
            JOIN tags t_hobby ON t_hobby.id = ut_hobby.id_tag
            AND t_hobby.categoria = 'HOBBY' AND unaccent(t_hobby.nombre) ILIKE unaccent($${idx})
        `;
            params.push(hobbies);
            idx++;
        }
        if (habitos) {
            query += `
                JOIN usuarios_tags ut_habitos ON ut_habitos.id_usuario = u.id
                JOIN tags t_habitos ON t_habitos.id = ut_habitos.id_tag
                AND t_habitos.categoria = 'HABITOS' AND unaccent(t_habitos.nombre) ILIKE unaccent($${idx})
            `;
            params.push(habitos);
            idx++;
        }
        if (orientacion) {
            query += `
                JOIN usuarios_tags ut_orientacion ON ut_orientacion.id_usuario = u.id
                JOIN tags t_orientacion ON t_orientacion.id = ut_orientacion.id_tag
                AND t_orientacion.categoria = 'ORIENTACION' AND unaccent(t_orientacion.nombre) ILIKE unaccent($${idx})
        `;
            params.push(orientacion);
            idx++;
        }
        query += ` WHERE u.id != $1 AND m.id IS NULL AND (l.id IS NULL OR l.gusta = FALSE) `;
        if (ciudad) {
            query += ` AND unaccent(u.ubicacion) ILIKE unaccent($${idx}) `;
            params.push(ciudad);
            idx++;
        }
        if (genero) {
            query += ` AND unaccent(u.sexo_genero) ILIKE unaccent($${idx}) `;
            params.push(genero);
            idx++;
        }
        if (edad_min) {
            query += ` AND DATE_PART('year', AGE(u.fecha_nacimiento)) >= $${idx} `;
            params.push(edad_min);
            idx++;
        }
        if (edad_max) { 
            query += ` AND DATE_PART('year', AGE(u.fecha_nacimiento)) <= $${idx} `;
            params.push(edad_max);
            idx++;
        }
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
            WHERE ut.id_usuario = $1
            `, [id_pareja])
        res.json(result.rows);
    }catch(error){
        console.log(error);
        res.status(500).send('Error al cargar tags')
    }
}

const obtenerTodosLosTags = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, nombre, categoria
            FROM tags
            ORDER BY categoria, nombre
        `);

        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al cargar tags');
    }
};

export {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    usuariosDisponibles,
    obtenerTags,
    obtenerTodosLosTags
};
