// src/Usuarios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper, TextField, Button, Box } from '@mui/material';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [handicap, setHandicap] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios.get('http://localhost:3000/usuarios')
      .then(response => {
        setUsuarios(response.data);
      })
      .catch(error => {
        console.error('Error fetching usuarios:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = { username, password, handicap: parseInt(handicap) };
    axios.post('http://localhost:3000/usuarios', newUser)
      .then(response => {
        setUsername('');
        setPassword('');
        setHandicap('');
        fetchUsuarios(); // Refrescar la lista de usuarios
      })
      .catch(error => {
        console.error('Error creating usuario:', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Usuarios
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Añadir Nuevo Usuario
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre de Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Handicap"
            type="number"
            value={handicap}
            onChange={(e) => setHandicap(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Añadir Usuario
          </Button>
        </Box>
      </Paper>
      <Paper elevation={3}>
        <List>
          {usuarios.map(usuario => (
            <ListItem key={usuario.id}>
              <ListItemText primary={usuario.username} secondary={`Handicap: ${usuario.handicap}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Usuarios;