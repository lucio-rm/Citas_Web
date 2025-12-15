import { pool } from "../db.js";

const crearFeedback = async (req, res) => {
    try {
        const { id_citas, id_usuario, clasificacion_evento, clasificacion_pareja,
                repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento,
                nota_extra } = req.body;
        
        // validaciones obligatorias
        if (!id_citas || !id_usuario || !clasificacion_evento || !clasificacion_pareja ||
            !repetirias || !puntualidad || !fluidez_conexion || !comodidad || !calidad_evento) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        // acá valido que las calificaciones estén entre 1 y 5
        const calificaciones = [clasificacion_evento, clasificacion_pareja, puntualidad,
                                fluidez_conexion, comodidad, calidad_evento];
        for (const cal of calificaciones) {
            if (cal < 1 || cal > 5) {
                return res.status(400).json({ error: 'Las calificaciones deben estar entre 1 y 5' });
            }
        }
        
        const result = await pool.query(
            `INSERT INTO feedback (id_citas, id_usuario, clasificacion_evento, clasificacion_pareja,
             repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [id_citas, id_usuario, clasificacion_evento, clasificacion_pareja,
             repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra || null]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear feedback' });
    }
};

const obtenerFeedbackPorCita = async (req, res) => {
    try {
        const { id_cita } = req.params;
        const result = await pool.query(
            'SELECT * FROM feedback WHERE id_citas = $1',
            [id_cita]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener feedback' });
    }
};

export {
    crearFeedback,
    obtenerFeedbackPorCita
};

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
