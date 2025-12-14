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