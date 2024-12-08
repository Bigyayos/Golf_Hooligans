// src/components/Torneos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Grid, Card, CardContent, CardActions, Checkbox, FormControlLabel, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const GameSchema = Yup.object().shape({
    name: Yup.string().required('Nombre del juego es requerido'),
    date: Yup.date().required('Fecha del juego es requerida'),
    location: Yup.string().required('Ubicación del juego es requerida'),
    campoId: Yup.number().required('Campo es requerido')
});

const Torneos = () => {
    const [tournaments, setTournaments] = useState([]);
    const [players, setPlayers] = useState([]);
    const [campos, setCampos] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [editTournament, setEditTournament] = useState(null);
    const [deleteTournament, setDeleteTournament] = useState(null);

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

        // Fetch campos from the API
        axios.get('http://localhost:3001/api/campos')
            .then(response => {
                setCampos(response.data);
            })
            .catch(error => {
                console.error('Error fetching campos:', error);
            });
    }, []);

    const handleCreateTournament = (values, { setSubmitting, resetForm }) => {
        const selectedPlayers = players.filter(player => player.selected).map(player => player.ID);
        axios.post('http://localhost:3001/api/torneos', {
            nombre: values.name,
            fecha: values.date,
            ubicacion: values.location,
            campoId: values.campoId,
            jugadores: selectedPlayers
        })
        .then(response => {
            setTournaments([...tournaments, response.data]);
            resetForm();
            setSnackbar({ open: true, message: 'Juego creado con éxito', severity: 'success' });
        })
        .catch(error => {
            console.error('Error creating game:', error);
            setSnackbar({ open: true, message: 'Error al crear el juego', severity: 'error' });
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const handleUpdateTournament = (values, { setSubmitting }) => {
        axios.put(`http://localhost:3001/api/torneos/${editTournament.ID}`, {
            nombre: values.name,
            fecha: values.date,
            ubicacion: values.location,
            campoId: values.campoId
        })
        .then(response => {
            const updatedTournaments = tournaments.map(tournament => {
                if (tournament.ID === editTournament.ID) {
                    return response.data;
                }
                return tournament;
            });
            setTournaments(updatedTournaments);
            setEditTournament(null);
            setSnackbar({ open: true, message: 'Torneo actualizado con éxito', severity: 'success' });
        })
        .catch(error => {
            console.error('Error updating tournament:', error);
            setSnackbar({ open: true, message: 'Error al actualizar el torneo', severity: 'error' });
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const handleDeleteTournament = () => {
        axios.delete(`http://localhost:3001/api/torneos/${deleteTournament.ID}`)
        .then(response => {
            const updatedTournaments = tournaments.filter(tournament => tournament.ID !== deleteTournament.ID);
            setTournaments(updatedTournaments);
            setDeleteTournament(null);
            setSnackbar({ open: true, message: 'Torneo eliminado con éxito', severity: 'success' });
        })
        .catch(error => {
            console.error('Error deleting tournament:', error);
            setSnackbar({ open: true, message: 'Error al eliminar el torneo', severity: 'error' });
        });
    };

    const handlePlayerSelect = (playerId) => {
        setPlayers(players.map(player => player.ID === playerId ? { ...player, selected: !player.selected } : player));
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Crear Nuevo Juego
            </Typography>
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
                <CardContent>
                    <Formik
                        initialValues={{ name: '', date: '', location: '', campoId: '' }}
                        validationSchema={GameSchema}
                        onSubmit={handleCreateTournament}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <Field name="name" as={TextField} label="Nombre del Juego" fullWidth margin="normal" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
                                <Field name="date" as={TextField} label="Fecha del Juego" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={touched.date && !!errors.date} helperText={touched.date && errors.date} />
                                <Field name="location" as={TextField} label="Ubicación del Juego" fullWidth margin="normal" error={touched.location && !!errors.location} helperText={touched.location && errors.location} />
                                <Field name="campoId" as={TextField} label="Campo ID" select fullWidth margin="normal" error={touched.campoId && !!errors.campoId} helperText={touched.campoId && errors.campoId}>
                                    {campos.map(campo => (
                                        <MenuItem key={campo.ID} value={campo.ID}>
                                            {campo.Nombre}
                                        </MenuItem>
                                    ))}
                                </Field>
                                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                                    Seleccionar Jugadores
                                </Typography>
                                <Grid container spacing={2}>
                                    {players.map(player => (
                                        <Grid item xs={12} sm={6} md={4} key={player.ID}>
                                            <FormControlLabel
                                                control={<Checkbox checked={player.selected || false} onChange={() => handlePlayerSelect(player.ID)} />}
                                                label={`${player.Nombre} - ${player.CorreoElectronico}`}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                                <CardActions>
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                        Crear Juego
                                    </Button>
                                </CardActions>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
            <Typography variant="h5" gutterBottom>
                Juegos Actuales
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
                                <Typography color="textSecondary">
                                    Campo: {campos.find(campo => campo.ID === tournament.CampoID)?.Nombre}
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
                            <CardActions>
                                <Button variant="contained" color="primary" onClick={() => setEditTournament(tournament)}>
                                    Editar
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => setDeleteTournament(tournament)}>
                                    Eliminar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {editTournament && (
                <Dialog open={true} onClose={() => setEditTournament(null)}>
                    <DialogTitle>Editar Juego</DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{ name: editTournament.Nombre, date: editTournament.Fecha, location: editTournament.Ubicacion, campoId: editTournament.CampoID }}
                            validationSchema={GameSchema}
                            onSubmit={handleUpdateTournament}
                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form>
                                    <Field name="name" as={TextField} label="Nombre del Juego" fullWidth margin="normal" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />
                                    <Field name="date" as={TextField} label="Fecha del Juego" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} error={touched.date && !!errors.date} helperText={touched.date && errors.date} />
                                    <Field name="location" as={TextField} label="Ubicación del Juego" fullWidth margin="normal" error={touched.location && !!errors.location} helperText={touched.location && errors.location} />
                                    <Field name="campoId" as={TextField} label="Campo ID" select fullWidth margin="normal" error={touched.campoId && !!errors.campoId} helperText={touched.campoId && errors.campoId}>
                                        {campos.map(campo => (
                                            <MenuItem key={campo.ID} value={campo.ID}>
                                                {campo.Nombre}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    <DialogActions>
                                        <Button onClick={() => setEditTournament(null)} color="primary">
                                            Cancelar
                                        </Button>
                                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                            Guardar
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            )}
            {deleteTournament && (
                <Dialog open={true} onClose={() => setDeleteTournament(null)}>
                    <DialogTitle>Eliminar Juego</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Estás seguro de que deseas eliminar el juego {deleteTournament.Nombre}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteTournament(null)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleDeleteTournament} variant="contained" color="secondary">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default Torneos;