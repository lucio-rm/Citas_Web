import { pool } from "../db.js";

export const guardarPreferencias = async (req, res) => {
    const {
        id_usuario,
        edad_min,
        edad_max,
        propios,
        busco
    } = req.body;

    try {
        // 1️⃣ Actualizar edades preferidas
        await pool.query(
            `UPDATE usuarios 
             SET edad_preferida_min = $1, edad_preferida_max = $2 
             WHERE id = $3`,
            [edad_min, edad_max, id_usuario]
        );

        // 2️⃣ Borrar tags anteriores del usuario
        await pool.query(
            `DELETE FROM usuarios_tags WHERE id_usuario = $1`,
            [id_usuario]
        );

        // 3️⃣ Función helper para insertar tags
        const insertarTags = async (lista, categoria, tipoRelacion) => {
            for (const nombreTag of lista) {

                const tagRes = await pool.query(
                    `SELECT id FROM tags 
                     WHERE LOWER(nombre) = LOWER($1)
                     AND categoria = $2`,
                    [nombreTag, categoria]
                );

                if (tagRes.rows.length === 0) continue;

                const idTag = tagRes.rows[0].id;

                await pool.query(
                    `INSERT INTO usuarios_tags (id_usuario, id_tag, tipo_relacion)
                     VALUES ($1, $2, $3)`,
                    [id_usuario, idTag, tipoRelacion]
                );
            }
        };

        // 4️⃣ Insertar tags propios
        await insertarTags(propios.hobbies, "HOBBY", "PROPIO");
        await insertarTags(propios.habitos, "HABITOS", "PROPIO");

        if (propios.orientacion) {
            await insertarTags([propios.orientacion], "ORIENTACION", "PROPIO");
        }

        // 5️⃣ Insertar tags buscados
        await insertarTags(busco.hobbies, "HOBBY", "BUSCO");
        await insertarTags(busco.habitos, "HABITOS", "BUSCO");

        if (busco.orientacion) {
            await insertarTags([busco.orientacion], "ORIENTACION", "BUSCO");
        }

        res.json({ mensaje: "Preferencias guardadas correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar preferencias" });
    }
};
