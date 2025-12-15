import { pool } from "../db.js"

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

export const guardarFeedback = async (req, res) => {
    const {
        id_citas, id_usuario_calificado, id_usuario_calificador, evento, pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra
    } = req.body;

    try {
        const querySql = `INSERT INTO feedback(id_citas, id_usuario_calificador, id_usuario_calificado, clasificacion_evento, clasificacion_pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`

        const datos = [id_citas, id_usuario_calificador, id_usuario_calificado, evento, pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra];
        
        const resul = await pool.query(querySql, datos);

        res.status(201).json({
            mensaje : 'Feedback guardado correctamente',//se muestra en el alert(front)
            feedback : resul.rows[0] //fila creada
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            mensaje : "Error al guardar el feedback"
        });
    }
}

export const obtenerCitas = async (req, res) => {
    const { idUsuario } = req.query;

    if (!idUsuario) {
        return res.status(400).json({
            mensaje : 'Falta el id del usuario'
        });
    }

    const querySql = `SELECT c.id AS id_cita, c.lugar, c.fecha_hora, c.tipo_encuentro, c.estado, u.id AS id_pareja, u.nombre AS nombre_pareja, u.foto_perfil, f.id AS id_feedback
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