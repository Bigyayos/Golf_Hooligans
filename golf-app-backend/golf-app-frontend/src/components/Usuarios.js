// src/components/Usuarios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        // Fetch users from the API
        axios.get('http://localhost:3001/api/usuarios')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Usuarios
            </Typography>
            <Grid container spacing={2}>
                {usuarios.map(usuario => (
                    <Grid item xs={12} sm={6} md={4} key={usuario.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    {usuario.Nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    Correo: {usuario.CorreoElectronico}
                                </Typography>
                                <Typography color="textSecondary">
                                    Handicap: {usuario.handicap}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Usuarios;