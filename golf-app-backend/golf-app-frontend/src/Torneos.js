// src/Torneos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Torneos = () => {
  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/torneos')
      .then(response => {
        setTorneos(response.data);
      })
      .catch(error => {
        console.error('Error fetching torneos:', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Torneos
      </Typography>
      <Paper elevation={3}>
        <List>
          {torneos.map(torneo => (
            <ListItem key={torneo.id}>
              <ListItemText primary={torneo.Nombre} secondary={`${torneo.Fecha} - ${torneo.Ubicacion}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Torneos;