import express from 'express';
import cors from 'cors'; // Importar cors
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { adminUser, secret } from './auth.js';
import mysql from 'mysql';

const app = express();
app.use(cors()); // Usar cors

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pab305290Ban', // Añade tu contraseña aquí
  database: 'GolfApp'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

app.use(express.json());

// Middleware de autenticación
function authenticate(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Autenticación fallida');
  }
}

// Middleware de autorización
function authorizeAdmin(req, res, next) {
  if (req.user && req.user.username === adminUser.username) {
    next();
  } else {
    res.status(403).send('No autorizado');
  }
}

// Rutas para torneos
app.get('/torneos', (req, res) => {
  const sql = 'SELECT * FROM Torneos';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/torneos', [
  authenticate,
  authorizeAdmin,
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('date').isISO8601().withMessage('Fecha inválida'),
  body('location').notEmpty().withMessage('La ubicación es requerida')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newTournament = {
    Nombre: req.body.name,
    Fecha: req.body.date,
    Ubicacion: req.body.location
  };
  const sql = 'INSERT INTO Torneos SET ?';
  db.query(sql, newTournament, (err, result) => {
    if (err) throw err;
    res.send('Torneo añadido...');
  });
});

// Rutas para usuarios
app.get('/usuarios', (req, res) => {
  const sql = 'SELECT * FROM Usuarios';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/usuarios', [
  authenticate,
  authorizeAdmin,
  body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  body('handicap').isInt().withMessage('El handicap debe ser un número entero')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newUser = {
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    handicap: req.body.handicap
  };
  const sql = 'INSERT INTO Usuarios SET ?';
  db.query(sql, newUser, (err, result) => {
    if (err) throw err;
    res.send('Usuario añadido...');
  });
});

// Rutas para rankings
app.get('/rankings', (req, res) => {
  const sql = 'SELECT * FROM Rankings';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/rankings', [
  authenticate,
  authorizeAdmin,
  body('userId').notEmpty().withMessage('El ID del usuario es requerido'),
  body('score').isNumeric().withMessage('El puntaje debe ser un número')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newRanking = {
    userId: req.body.userId,
    score: req.body.score
  };
  const sql = 'INSERT INTO Rankings SET ?';
  db.query(sql, newRanking, (err, result) => {
    if (err) throw err;
    res.send('Ranking añadido...');
  });
});

// Rutas para resultados
app.get('/resultados', (req, res) => {
  const sql = 'SELECT * FROM Resultados';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/resultados', [
  authenticate,
  authorizeAdmin,
  body('tournamentId').notEmpty().withMessage('El ID del torneo es requerido'),
  body('userId').notEmpty().withMessage('El ID del usuario es requerido'),
  body('position').isNumeric().withMessage('La posición debe ser un número')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newResult = {
    tournamentId: req.body.tournamentId,
    userId: req.body.userId,
    position: req.body.position
  };
  const sql = 'INSERT INTO Resultados SET ?';
  db.query(sql, newResult, (err, result) => {
    if (err) throw err;
    res.send('Resultado añadido...');
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;