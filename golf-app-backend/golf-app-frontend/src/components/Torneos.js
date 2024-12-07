// src/components/Torneos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Grid, Card, CardContent, CardActions, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const TournamentSchema = Yup.object().shape({
    name: Yup.string().required('Nombre del torneo es requerido'),
    date: Yup.date().required('Fecha del torneo es requerida'),
    location: Yup.string().required('Ubicación del torneo es requerida')
});

const Torneos = () => {
    const [tournaments, setTournaments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        // Fetch players (users) from the API
        axios.get('http://localhost:3001/api/usuarios')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error('Error fetching players:', error);
            });

        // Fetch tournaments from the API
        axios.get('http://localhost:3001/api/torneos')
            .then(response => {
                setTournaments(response.data);
            })
            .catch(error => {
                console.error('Error fetching tournaments:', error);
            });
    }, []);

    const handleCreateTournament = (values, { setSubmitting, resetForm }) => {
        axios.post('http://localhost:3001/api/torneos', {
            nombre: values.name,
            fecha: values.date,
            ubicacion: values.location
        })
        .then(response => {
            setTournaments([...tournaments, response.data]);
            resetForm();
            setSnackbar({ open: true, message: 'Torneo creado con éxito', severity: 'success' });
        })
        .catch(error => {
            console.error('Error creating tournament:', error);
            setSnackbar({ open: true, message: 'Error al crear el torneo', severity: 'error' });
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const handleRegisterPlayer = (tournamentId, player) => {
        axios.post(`http://localhost:3001/api/torneos/${tournamentId}/jugadores`, {
            jugadorId: player.ID
        })
        .then(response => {
            const updatedTournaments = tournaments.map(tournament => {
                if (tournament.ID === tournamentId) {
                    tournament.players = tournament.players || [];
                    tournament.players.push(player);
                }
                return tournament;
            });
            setTournaments(updatedTournaments);
            setSnackbar({ open: true, message: 'Jugador inscrito con éxito', severity: 'success' });
        })
        .catch(error => {
            console.error('Error registering player:', error);
            setSnackbar({ open: true, message: 'Error al inscribir el jugador', severity: 'error' });
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Torneos
            </Typography>
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Crear Nuevo Torneo
                    </Typography>
                    <Formik
                        initialValues={{ name: '', date: '', location: '' }}
                        validationSchema={TournamentSchema}
                        onSubmit={handleCreateTournament}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <Field name="name" as={TextField} label="Nombre del Torneo" fullWidth margin="normal" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
                                <Field name="date" as={TextField} label="Fecha del Torneo" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={touched.date && !!errors.date} helperText={touched.date && errors.date} />
                                <Field name="location" as={TextField} label="Ubicación del Torneo" fullWidth margin="normal" error={touched.location && !!errors.location} helperText={touched.location && errors.location} />
                                <CardActions>
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                        Crear Torneo
                                    </Button>
                                </CardActions>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
            <Typography variant="h5" gutterBottom>
                Jugadores
            </Typography>
            <Grid container spacing={2}>
                {players.map(player => (
                    <Grid item xs={12} sm={6} md={4} key={player.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    {player.Nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    {player.CorreoElectronico}
                                </Typography>
                                <Typography color="textSecondary">
                                    Handicap: {player.handicap}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button variant="contained" color="secondary" onClick={() => handleRegisterPlayer(tournaments.length, player)}>
                                    Inscribir
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
                Torneos Actuales
            </Typography>
            <Grid container spacing={2}>
                {tournaments.map(tournament => (
                    <Grid item xs={12} sm={6} md={4} key={tournament.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    {tournament.Nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    Fecha: {tournament.Fecha}
                                </Typography>
                                <Typography color="textSecondary">
                                    Ubicación: {tournament.Ubicacion}
                                </Typography>
                                <Typography variant="h6" gutterBottom style={{ marginTop: '10px' }}>
                                    Jugadores Inscritos
                                </Typography>
                                <List>
                                    {tournament.players && tournament.players.map(player => (
                                        <ListItem key={`${tournament.ID}-${player.ID}`}>
                                            <ListItemText primary={`${player.Nombre} - ${player.handicap}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Torneos;