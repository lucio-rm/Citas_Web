import { pool } from '../db.js';

export const obtenerTags = async (req, res) => {
    
    try {

        const resul = await pool.query(
            `SELECT id, nombre, categoria
            FROM tags
            ORDER BY categoria, nombre`
        )
        res.json(resul.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error : "Error al obtener los tags"
        })
    }
}

export const obtenerTagPorId = async (req, res) => {
    
    try{

        const { id } = req.params;

        const resul = await pool.query(
            `SELECT id, nombre, categoria
            FROM tags
            WHERE id = $1`,
            [id]
        );
        if (resul.rows.length === 0) {
            return res.status(404).json({
                error : "Tag no encontrado"
            })
        }
        res.json(resul.rows[0])

    }catch (err) {
        console.error(err);
        res.status(500).json({
            error : "Error al obtener el tag por id"
        });
    }
}

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

export const actualizarTagsUsuario = async (req, res) => {
    const { id : usuarioId } = req.params; // llamamos usuarioId al id del usuario
    const { tags } = req.body; // array de tags

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // comienza a hacer "cambios temporales" en la base de datos

        await client.query(
            'DELETE FROM usuarios_tags WHERE id_usuario = $1', [usuarioId]
        ); // elimina los tags actuales del usuario

        if (tags && tags.length > 0) { // solo si hay tags para insertar

            const tagNombrePlaceholders = tags.map((_, index) => `$${index + 1}`).join(', '); // crea una lista de placeholders por cada tag

            const tagIdResul = await client.query(
                `SELECT id FROM tags WHERE nombre IN (${tagNombrePlaceholders})`,
                tags
            ); // obtiene los ids de los tags que coinciden con los nombres proporcionados (usa los placeholders para la query)

            const tagIds = tagIdResul.rows.map(fila => fila.id); // crea un array con los ids de los tags encontrados

            if (tagIds.length > 0) { // si encuentra tags coincidente

                const queryInsert = tagIds.map(tagId => 
                    client.query('INSERT INTO usuarios_tags (id_usuario, id_tag) VALUES ($1, $2)',
                        [usuarioId, tagId]
                    )
                ); // crea la promesa de insercion por cada tagId
                await Promise.all(queryInsert); // ejecuta todas las inserciones simultaneamente
            }

        }

        await client.query('COMMIT'); // confirma y aplica permanentemente todos los cambios realizados desde BEGIN

        res.json(
            { mensaje: 'Tags actualizados correctamente'}
        )

    } catch (err) {
        await client.query('ROLLBACK'); // si algo falla anula los cambios temporales realizados desde BEGIN
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar los tags del usuario' });
    } finally {
        client.release();
    }

}