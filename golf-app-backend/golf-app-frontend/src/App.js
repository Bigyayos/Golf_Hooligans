import React from 'react';
import { Container, Typography } from '@mui/material';
import Torneos from './Torneos';
import Usuarios from './Usuarios';
import Rankings from './Rankings';
import Resultados from './Resultados';

function App() {
  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Golf App
      </Typography>
      <Torneos />
      <Usuarios />
      <Rankings />
      <Resultados />
    </Container>
  );
}

export default App;
