// src/components/Campos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, Card, CardContent } from '@mui/material';

const Campos = () => {
    const [campos, setCampos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [slope, setSlope] = useState('');
    const [hoyos, setHoyos] = useState(Array(18).fill({ numero: '', par: '' }));

    useEffect(() => {
        // Fetch all campos
        axios.get('http://localhost:3001/api/campos')
            .then(response => {
                setCampos(response.data);
            })
            .catch(error => {
                console.error('Error fetching campos:', error);
            });
    }, []);

    const handleHoyoChange = (index, field, value) => {
        const newHoyos = [...hoyos];
        newHoyos[index] = { ...newHoyos[index], [field]: value };
        setHoyos(newHoyos);
    };

    const handleCreateCampo = () => {
        axios.post('http://localhost:3001/api/campos', { nombre, slope, hoyos })
            .then(response => {
                setCampos([...campos, response.data]);
                setNombre('');
                setSlope('');
                setHoyos(Array(18).fill({ numero: '', par: '' }));
            })
            .catch(error => {
                console.error('Error creating campo:', error);
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Crear Nuevo Campo
            </Typography>
            <Card variant="outlined" style={{ marginBottom: '20px' }}>
                <CardContent>
                    <TextField
                        label="Nombre del Campo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Slope"
                        type="number"
                        value={slope}
                        onChange={(e) => setSlope(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                        Hoyos
                    </Typography>
                    <Grid container spacing={2}>
                        {hoyos.map((hoyo, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <TextField
                                    label={`Hoyo ${index + 1} - Número`}
                                    type="number"
                                    value={hoyo.numero}
                                    onChange={(e) => handleHoyoChange(index, 'numero', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label={`Hoyo ${index + 1} - Par`}
                                    type="number"
                                    value={hoyo.par}
                                    onChange={(e) => handleHoyoChange(index, 'par', e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Button variant="contained" color="primary" onClick={handleCreateCampo} style={{ marginTop: '20px' }}>
                        Crear Campo
                    </Button>
                </CardContent>
            </Card>
            <Typography variant="h5" gutterBottom>
                Campos Actuales
            </Typography>
            <Grid container spacing={2}>
                {campos.map(campo => (
                    <Grid item xs={12} sm={6} md={4} key={campo.ID}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">
                                    {campo.Nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    Slope: {campo.Slope}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Campos;