// src/components/Usuarios.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
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
                Lista de Usuarios
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Correo Electrónico</TableCell>
                            <TableCell>Handicap</TableCell>
                            <TableCell>Username</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map(usuario => (
                            <TableRow key={usuario.ID}>
                                <TableCell>{usuario.ID}</TableCell>
                                <TableCell>{usuario.Nombre}</TableCell>
                                <TableCell>{usuario.CorreoElectronico}</TableCell>
                                <TableCell>{usuario.handicap}</TableCell>
                                <TableCell>{usuario.username}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Usuarios;