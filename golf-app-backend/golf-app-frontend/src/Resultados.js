// src/Resultados.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Resultados = () => {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/resultados')
      .then(response => {
        setResultados(response.data);
      })
      .catch(error => {
        console.error('Error fetching resultados:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Resultados
      </Typography>
      <Paper elevation={3}>
        <List>
          {resultados.map(resultado => (
            <ListItem key={resultado.id}>
              <ListItemText primary={`Tournament ID: ${resultado.tournamentId}`} secondary={`User ID: ${resultado.userId} - Position: ${resultado.position}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Resultados;