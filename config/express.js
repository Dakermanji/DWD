//! config/express.js

import express from 'express';
import router from './routes.js';
import applyMiddlewares from './middleware.js';

// Initialize the Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

applyMiddlewares(app);

// Routes
app.use('/', router);

export default app;
