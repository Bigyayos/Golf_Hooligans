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

// Crear un nuevo torneo
app.post('/api/torneos', (req, res) => {
    const { nombre, fecha, ubicacion } = req.body;
    const query = 'INSERT INTO Torneos (Nombre, Fecha, Ubicacion) VALUES (?, ?, ?)';
    connection.query(query, [nombre, fecha, ubicacion], (error, results) => {
        if (error) {
            console.error('Error creating tournament:', error);
            return res.status(500).send(error);
        }
        res.json({ id: results.insertId, nombre, fecha, ubicacion });
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

// Inscribir un jugador en un torneo
app.post('/api/torneos/:torneoId/jugadores', (req, res) => {
    const { torneoId } = req.params;
    const { jugadorId } = req.body;
    const query = 'INSERT INTO Rankings (TorneoID, JugadorID, Posicion) VALUES (?, ?, ?)';
    connection.query(query, [torneoId, jugadorId, null], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json({ torneoId, jugadorId });
    });
});

// Registrar un score
app.post('/api/resultados', (req, res) => {
    const { torneoId, jugadorId, hoyo, score } = req.body;
    const query = 'INSERT INTO Resultados (TorneoID, JugadorID, Hoyo, Score) VALUES (?, ?, ?, ?)';
    connection.query(query, [torneoId, jugadorId, hoyo, score], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.json({ torneoId, jugadorId, hoyo, score });
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});