// src/components/Resultados.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';

const Resultados = () => {
    const [resultados, setResultados] = useState([]);
    const [torneos, setTorneos] = useState([]);
    const [jugadores, setJugadores] = useState([]);
    const [hoyos, setHoyos] = useState([]);
    const [selectedTorneo, setSelectedTorneo] = useState(null);
    const [score, setScore] = useState({});
    const [totalScores, setTotalScores] = useState({});

    useEffect(() => {
        // Fetch all tournaments
        axios.get('http://localhost:3001/api/torneos')
            .then(response => {
                setTorneos(response.data);
            })
            .catch(error => {
                console.error('Error fetching tournaments:', error);
            });
    }, []);

    const handleTorneoSelect = (torneoId) => {
        setSelectedTorneo(torneoId);
        // Fetch players for the selected tournament
        axios.get(`http://localhost:3001/api/torneos/${torneoId}/jugadores`)
            .then(response => {
                setJugadores(response.data);
            })
            .catch(error => {
                console.error('Error fetching players for tournament:', error);
            });
        // Fetch hoyos for the selected campo
        axios.get(`http://localhost:3001/api/campos/${torneoId}/hoyos`)
            .then(response => {
                setHoyos(response.data);
            })
            .catch(error => {
                console.error('Error fetching hoyos for campo:', error);
            });
    };

    const handleScoreChange = (jugadorId, hoyo, value) => {
        const newScore = {
            ...score,
            [`${jugadorId}-${hoyo}`]: value
        };
        setScore(newScore);

        // Calculate total score for the player
        const totalScore = Object.keys(newScore)
            .filter(key => key.startsWith(`${jugadorId}-`))
            .reduce((total, key) => total + parseInt(newScore[key] || 0, 10), 0);
        setTotalScores({
            ...totalScores,
            [jugadorId]: totalScore
        });
    };

    const handleSubmitScores = () => {
        const scores = Object.keys(score).map(key => {
            const [jugadorId, hoyo] = key.split('-');
            return {
                torneoId: selectedTorneo,
                jugadorId: parseInt(jugadorId, 10),
                hoyo: parseInt(hoyo, 10),
                score: parseInt(score[key], 10)
            };
        });

        axios.post('http://localhost:3001/api/resultados', scores)
            .then(response => {
                setResultados([...resultados, ...scores]);
                setScore({});
                setSelectedTorneo(null);
            })
            .catch(error => {
                console.error('Error submitting scores:', error);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Resultados de Torneos
            </Typography>
            <Grid container spacing={2}>
                {torneos.map(torneo => (
                    <Grid item xs={12} key={torneo.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5">
                                    {torneo.Nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    Fecha: {new Date(torneo.Fecha).toLocaleDateString()}
                                </Typography>
                                <Typography color="textSecondary">
                                    Ubicación: {torneo.Ubicacion}
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handleTorneoSelect(torneo.ID)}>
                                    Ver Jugadores
                                </Button>
                                {selectedTorneo === torneo.ID && (
                                    <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                        {jugadores.map(jugador => (
                                            <Grid item xs={12} md={6} key={jugador.ID}>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="h6">
                                                            {jugador.Nombre}
                                                        </Typography>
                                                        <Grid container spacing={1}>
                                                            {hoyos.map(hoyo => (
                                                                <Grid item xs={4} key={`${jugador.ID}-${hoyo.Numero}`}>
                                                                    <TextField
                                                                        label={`Hoyo ${hoyo.Numero}`}
                                                                        type="number"
                                                                        value={score[`${jugador.ID}-${hoyo.Numero}`] || ''}
                                                                        onChange={(e) => handleScoreChange(jugador.ID, hoyo.Numero, e.target.value)}
                                                                        fullWidth
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                        <Typography variant="h6" style={{ marginTop: '20px' }}>
                                                            Puntuación Total: {totalScores[jugador.ID] || 0}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {selectedTorneo && (
                <Button variant="contained" color="primary" onClick={handleSubmitScores} style={{ marginTop: '20px' }}>
                    Guardar Resultados
                </Button>
            )}
        </Container>
    );
};

export default Resultados;