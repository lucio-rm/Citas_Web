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
        id_citas, id_usuario, evento, pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra
    } = req.body;

    try {
        const querySql = `INSERT INTO feedback(id_citas, id_usuario, clasificacion_evento, clasificacion_pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`

        const datos = [id_citas, id_usuario, evento, pareja, repetirias, puntualidad, fluidez_conexion, comodidad, calidad_evento, nota_extra];
        
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