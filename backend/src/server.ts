import 'dotenv/config';
import { validateEnvironment } from './config/env.js';
import app from './app.js';

// Validate environment on startup
validateEnvironment();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`☕ Coffeelo Server is running smoothly on http://localhost:${PORT}`);
  console.log(`🚀 Health Check available at http://localhost:${PORT}/api/health`);
});
