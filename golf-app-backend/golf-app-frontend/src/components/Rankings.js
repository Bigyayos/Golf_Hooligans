// src/components/Rankings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';

const Rankings = () => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        // Fetch rankings from the API
        axios.get('http://localhost:3001/api/rankings')
            .then(response => {
                setRankings(response.data);
            })
            .catch(error => {
                console.error('Error fetching rankings:', error);
            });
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Rankings
            </Typography>
            <Grid container spacing={2}>
                {rankings.map(ranking => (
                    <Grid item xs={12} sm={6} md={4} key={ranking.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    Usuario ID: {ranking.Usuario_ID}
                                </Typography>
                                <Typography color="textSecondary">
                                    Posición: {ranking.Posicion}
                                </Typography>
                                <Typography color="textSecondary">
                                    Puntuación Total: {ranking.PuntuacionTotal}
                                </Typography>
                                <Typography color="textSecondary">
                                    Torneo ID: {ranking.TorneoID}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Rankings;