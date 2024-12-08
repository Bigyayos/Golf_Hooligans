const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pab305290Ban',
    database: 'GolfApp'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    const query = 'SELECT * FROM Usuarios';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Crear un nuevo campo
app.post('/api/campos', (req, res) => {
    const { nombre, slope, hoyos } = req.body;
    const query = 'INSERT INTO Campos (Nombre, Slope) VALUES (?, ?)';
    connection.query(query, [nombre, slope], (error, results) => {
        if (error) {
            console.error('Error creating campo:', error);
            return res.status(500).send(error);
        }
        const campoId = results.insertId;
        const hoyosQuery = 'INSERT INTO Hoyos (CampoID, Numero, Par) VALUES ?';
        const hoyosValues = hoyos.map(hoyo => [campoId, hoyo.numero, hoyo.par]);
        connection.query(hoyosQuery, [hoyosValues], (error, results) => {
            if (error) {
                console.error('Error adding hoyos to campo:', error);
                return res.status(500).send(error);
            }
            res.json({ id: campoId, nombre, slope, hoyos });
        });
    });
});

// Obtener todos los campos
app.get('/api/campos', (req, res) => {
    const query = 'SELECT * FROM Campos';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Obtener hoyos de un campo específico
app.get('/api/campos/:id/hoyos', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Hoyos WHERE CampoID = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching hoyos for campo:', error);
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Crear un nuevo torneo con jugadores
app.post('/api/torneos', (req, res) => {
    const { nombre, fecha, ubicacion, campoId, jugadores } = req.body;
    const query = 'INSERT INTO Torneos (Nombre, Fecha, Ubicacion, CampoID) VALUES (?, ?, ?, ?)';
    connection.query(query, [nombre, fecha, ubicacion, campoId], (error, results) => {
        if (error) {
            console.error('Error creating tournament:', error);
            return res.status(500).send(error);
        }
        const torneoId = results.insertId;
        const jugadoresQuery = 'INSERT INTO Rankings (TorneoID, JugadorID) VALUES ?';
        const jugadoresValues = jugadores.map(jugadorId => [torneoId, jugadorId]);
        connection.query(jugadoresQuery, [jugadoresValues], (error, results) => {
            if (error) {
                console.error('Error adding players to tournament:', error);
                return res.status(500).send(error);
            }
            res.json({ id: torneoId, nombre, fecha, ubicacion, campoId, jugadores });
        });
    });
});

// Obtener todos los torneos
app.get('/api/torneos', (req, res) => {
    const query = 'SELECT * FROM Torneos';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Obtener jugadores inscritos en un torneo específico
app.get('/api/torneos/:id/jugadores', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT u.ID, u.Nombre, u.CorreoElectronico
        FROM Rankings r
        JOIN Usuarios u ON r.JugadorID = u.ID
        WHERE r.TorneoID = ?
    `;
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error fetching players for tournament:', error);
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

// Registrar múltiples scores
app.post('/api/resultados', (req, res) => {
    const scores = req.body;
    console.log('Received scores:', scores); // Agregar registro de depuración
    if (scores.length === 0) {
        return res.status(400).send({ message: 'No scores to insert' });
    }
    const query = 'INSERT INTO Resultados (TorneoID, JugadorID, Hoyo, Score) VALUES ?';
    const values = scores.map(score => [score.torneoId, score.jugadorId, score.hoyo, score.score]);
    connection.query(query, [values], (error, results) => {
        if (error) {
            console.error('Error inserting scores:', error);
            return res.status(500).send(error);
        }
        res.json({ message: 'Scores inserted successfully' });
    });
});

// Eliminar un torneo
app.delete('/api/torneos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Torneos WHERE ID = ?';
    connection.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error deleting tournament:', error);
            return res.status(500).send(error);
        }
        if (results.affectedRows === 0) {
            return res.status(404).send({ message: 'Tournament not found' });
        }
        res.json({ message: 'Tournament deleted successfully' });
    });
});

// Obtener todos los rankings
app.get('/api/rankings', (req, res) => {
    const query = 'SELECT * FROM Rankings';
    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json(results);
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});