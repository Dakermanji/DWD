//! utils/logger.js

import winston from 'winston';
import fs from 'fs';

// Ensure log directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		winston.format.errors({ stack: true }),
		winston.format.printf(({ timestamp, level, message, stack }) => {
			return stack
				? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
				: `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		})
	),
	transports: [
		new winston.transports.File({
			filename: `${logDir}/error.log`,
			level: 'error',
		}),
		new winston.transports.File({ filename: `${logDir}/combined.log` }),
	],
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}

export default logger;
