//! server.js

import app from './config/express.js';
import env from './config/dotenv.js';

app.listen(env.PORT, () => {
	console.log(`Server is running on ${env.HOST}:${env.PORT}`);
});
