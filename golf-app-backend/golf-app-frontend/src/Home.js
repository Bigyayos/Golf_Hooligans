// src/Home.js
import React from 'react';
import { Container, Typography, Card, CardContent, CardMedia } from '@mui/material';

const Home = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Bienvenido a Golf Hooligans
            </Typography>
            <Card>
                <CardMedia
                    component="img"
                    alt="Golf"
                    height="300"
                    image="https://www.golfladehesa.es/images/slider/LaDehesa2.jpg" // Reemplaza esta URL con la URL de tu imagen
                    title="Golf"
                />
                <CardContent>
                    <Typography variant="body1">
                    Cuanto más entreno, más suerte tengo..
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Home;