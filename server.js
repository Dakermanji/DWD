//! server.js

import express from 'express';

const app = express();
const HOST = 'http://localhost';
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
	res.send('Dakermanji {Web Dev} portfolio API is running...');
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on ${HOST}:${PORT}`);
});
