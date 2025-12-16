import { pool } from '../db.js';

export const obtenerTagsPorUsuarioId = async (req, res) => {
    try {
        const { id } = req.params;

        const resul = await pool.query( //pide el nombre y categoria de los tags asociados al usuario
            `SELECT t.nombre, t.categoria
            FROM tags t
            JOIN usuarios_tags ut ON t.id = ut.id_tag
            WHERE ut.id_usuario = $1`,
            [id]
        );

        const agruparTags = resul.rows.reduce( (acumulador, tags) => { //reduce para agrupar los tags por categoria (itera por cada elemento)
            const categoria = tags.categoria;
            if (!acumulador[categoria]) { //si no existe la categoria en el acumulador
                acumulador[categoria] = [];
            }
            acumulador[categoria].push(tags.nombre); //agrega el tag a la categoria
            return acumulador;
        }, {})

        res.json(agruparTags);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error : "Error al obtener los tags del usuario"
        })
    }
}
