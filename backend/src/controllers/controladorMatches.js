import { pool } from "../db";

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
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM matches WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener match' });
    }
};

const crearMatch = async (req, res) => {
    try {
        const { usuario1_id, usuario2_id, fecha_match } = req.body;
        const result = await pool.query(
            'INSERT INTO matches (usuario1_id, usuario2_id, fecha_match) VALUES ($1, $2, $3) RETURNING *',
            [usuario1_id, usuario2_id, fecha_match]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear match' });
    }
};

const eliminarMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM matches WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match no encontrado' });
        }
        res.json({ message: 'Match eliminado', match: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar match' });
    }
};

export {
    obtenerMatches,
    obtenerMatchPorId,
    crearMatch,
    eliminarMatch
};