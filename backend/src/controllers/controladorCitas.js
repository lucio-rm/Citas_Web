import { pool } from '../db.js'; // Asegurate que la ruta a db.js sea correcta

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