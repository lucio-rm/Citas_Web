import { pool } from "../db.js"

const obtenerCitas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM citas');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar las citas' });
    }
};

const obtenerCitaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM citas WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No encontré esa cita' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar la cita' });
    }
};


const crearCita = async (req, res) => {
    try {
        const { id_match, lugar, fecha_hora, tipo_encuentro, duracion_estimada_minutos } = req.body;
        
        if (!id_match || !lugar || !fecha_hora) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para la cita' });
        }
        
        const result = await pool.query(
            `INSERT INTO citas (id_match, lugar, fecha_hora, tipo_encuentro, estado, duracion_estimada_minutos)
            VALUES ($1, $2, $3, $4, 'pendiente', $5)
            RETURNING *`,
            [id_match, lugar, fecha_hora, tipo_encuentro, duracion_estimada_minutos]
        );
        
        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear la cita. Verificá los datos.' });
    }
};


const actualizarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { lugar, fecha_hora, tipo_encuentro, estado, duracion_estimada_minutos } = req.body;
        
        
        const result = await pool.query(
            `UPDATE citas 
            SET lugar = $1, 
            fecha_hora = $2, 
            tipo_encuentro = $3, 
            estado = $4, 
            duracion_estimada_minutos = $5
            WHERE id = $6
            RETURNING *`,
            [lugar, fecha_hora, tipo_encuentro, estado, duracion_estimada_minutos, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No encontré la cita para actualizar' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};


const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM citas WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No encontré la cita para borrar' });
        }
        
        res.json({ message: 'Cita borrada', cita: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al borrar la cita' });
    }
};

export {
    obtenerCitas,
    obtenerCitaPorId,
    crearCita,
    actualizarCita,
    eliminarCita
};

export const cancelarCita = async (req, res) => {
    const { id } = req.params;
    console.log(`Intentando cancelar la cita con ID: ${id} en la base de datos`)

    try {
        //actualiza el estado y devuelve metadatos (filas actualizadas)
        const resul = await pool.query("UPDATE citas SET estado = 'cancelada' WHERE id = $1 RETURNING *", [id]);
        
        if (resul.rowCount === 0){ //si no afecta a ninguna fila
            return res.status(404).json({
                mensaje : "No se encontró la cita"
            })
        }

        res.json({ //si todo sale bien
            mensaje : "Cita cancelada exitosamente",
            cita : resul.rows[0]
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            mensaje : "Error al actualizar el estado"
        })
    }
}

export const obtenerVistaCitas = async (req, res) => {
    const { idUsuario } = req.query;

    if (!idUsuario) {
        return res.status(400).json({
            mensaje : 'Falta el id del usuario'
        });
    }

    const querySql = `SELECT c.id AS id_cita, c.lugar, c.fecha_hora, c.tipo_encuentro, c.estado, c.duracion_estimada_minutos, u.id AS id_pareja, u.nombre AS nombre_pareja, u.foto_perfil, f.id AS id_feedback
    FROM citas c
    JOIN matches m ON c.id_match = m.id
    JOIN usuarios u ON (m.id_usuario_1 = u.id OR m.id_usuario_2 = u.id)
    LEFT JOIN feedback f ON (c.id = f.id_citas AND f.id_usuario_calificador = $1)
    WHERE u.id != $1
    AND (m.id_usuario_1 = $1 OR m.id_usuario_2 = $1)
    AND (c.estado != 'cancelada')`

    try {

        const resul = await pool.query(querySql, [idUsuario]);
        res.json(resul.rows);

    } catch (err) {
        console.error('Error al recuperar los datos: ',err);
        res.status(500).json({
            mensaje : 'Error al obtener las citas'
        });
    };
}
