//! server.js

import app from './config/express.js';
import env from './config/dotenv.js';
import logger from './utils/logger.js';

app.listen(env.PORT, () => {
	logger.info(`Server is running on ${env.HOST}:${env.PORT}`);
});
