import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Torneos from './components/Torneos';
import Rankings from './components/Rankings';
import Resultados from './components/Resultados';
import Usuarios from './components/Usuarios';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/torneos" element={<Torneos />} />
                <Route path="/rankings" element={<Rankings />} />
                <Route path="/resultados" element={<Resultados />} />
            </Routes>
        </Router>
    );
};

export default App;
