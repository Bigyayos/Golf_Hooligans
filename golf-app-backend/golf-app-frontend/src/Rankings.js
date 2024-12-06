// src/Rankings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/rankings')
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
      <Paper elevation={3}>
        <List>
          {rankings.map(ranking => (
            <ListItem key={ranking.id}>
              <ListItemText primary={`User ID: ${ranking.userId}`} secondary={`Score: ${ranking.score}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Rankings;