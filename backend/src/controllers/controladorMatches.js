import { pool } from "../db.js";

const obtenerMatches = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM matches');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener matches' });
    }
};

const obtenerMatchPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(
            `SELECT * FROM matches 
            WHERE id_usuario_1 = $1 OR id_usuario_2 = $1
            ORDER BY fecha_match DESC`, [id]);
        
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener match' });
    }
};

const crearMatch = async (req, res) => {
    try {
        const { id_usuario_1, id_usuario_2, fecha_match } = req.body;
        const result = await pool.query(
            'INSERT INTO matches (id_usuario_1, id_usuario_2, fecha_match) VALUES ($1, $2, $3) RETURNING *',
            [id_usuario_1, id_usuario_2, fecha_match]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear match' });
    }
};

const eliminarMatch = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)){
            return res.status(400).json({error: "ID inválido"});
        }
        const result = await pool.query('DELETE FROM matches WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match no encontrado' });
        }
        const { id_usuario_1, id_usuario_2 } = result.rows[0];
        await pool.query(`
            UPDATE likes SET gusta = FALSE
            WHERE (id_usuario_1 = $1 AND id_usuario_2 = $2)
            OR (id_usuario_1 = $2 AND id_usuario_2 = $1)
            `, [id_usuario_1, id_usuario_2]);
        res.json({ message: 'Match eliminado', match: result.rows[0] });
    } catch (err) {
        console.error("Error al eliminar match:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const darLike = async (req, res) => {
    const { id_usuario_1, id_usuario_2, gusta } = req.body;

    if (!id_usuario_1 || !id_usuario_2 || typeof gusta !== "boolean") {
        return res.status(400).json({ error: "Faltan datos para registrar el like" });
    }

    try {
        // 1️⃣ Insertar o actualizar el like
        await pool.query(
            `INSERT INTO likes (id_usuario_1, id_usuario_2, gusta)
             VALUES ($1, $2, $3)
             ON CONFLICT (id_usuario_1, id_usuario_2)
             DO UPDATE SET gusta = EXCLUDED.gusta`,
            [id_usuario_1, id_usuario_2, gusta]
        );

        // 2️⃣ Verificar si hay reciprocidad
        if (gusta) {
            const result = await pool.query(
                `SELECT * FROM likes
                 WHERE id_usuario_1 = $1 AND id_usuario_2 = $2 AND gusta = TRUE`,
                [id_usuario_2, id_usuario_1]
            );

            if (result.rows.length > 0) {
                // 3️⃣ Revisar si el match ya existe
                const matchExist = await pool.query(
                    `SELECT * FROM matches
                     WHERE (id_usuario_1 = $1 AND id_usuario_2 = $2)
                        OR (id_usuario_1 = $2 AND id_usuario_2 = $1)`,
                    [id_usuario_1, id_usuario_2]
                );

                if (matchExist.rows.length === 0) {
                    const match = await pool.query(
                        `INSERT INTO matches (id_usuario_1, id_usuario_2)
                         VALUES ($1, $2)
                         RETURNING *`,
                        [id_usuario_1, id_usuario_2]
                    );
                    return res.json({ message: "¡Es match!", match: match.rows[0] });
                }

                return res.json({ message: "Ya existía el match" });
            }
        }

        // 4️⃣ Si no hay reciprocidad, solo registramos el like
        res.json({ message: "Like registrado" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar like" });
    }
};

export {
    obtenerMatches,
    obtenerMatchPorId,
    crearMatch,
    eliminarMatch,
    darLike
};