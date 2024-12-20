import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Golf Hooligans
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/usuarios">
                    Usuarios
                </Button>
                <Button color="inherit" component={Link} to="/torneos">
                    Torneos
                </Button>
                <Button color="inherit" component={Link} to="/rankings">
                    Rankings
                </Button>
                <Button color="inherit" component={Link} to="/resultados">
                    Resultados
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;