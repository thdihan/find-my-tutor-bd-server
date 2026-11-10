import { Server } from 'http';
import app from './app.js';
import { config } from './app/config/index.js';
import { checkDatabaseConnection, dbPool } from './app/db/index.js';

let server: Server;

async function bootstrap() {
  try {
    // Check DB status
    const isDbConnected = await checkDatabaseConnection();
    if (isDbConnected) {
      console.log('✅ PostgreSQL + PostGIS database connected successfully.');
    } else {
      console.log('ℹ️  PostgreSQL offline or connecting. In-memory demo data mode active.');
    }

    server = app.listen(config.port, () => {
      console.log(`🚀 Find My Tutor BD server running on http://localhost:${config.port}`);
      console.log(`📡 API Base Route: http://localhost:${config.port}/api/v1`);
      console.log(`🩺 Health Check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown helpers
const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log('Server gracefully closed.');
      dbPool.end(() => {
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection detected, closing server...', error);
  exitHandler();
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received.');
  exitHandler();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  exitHandler();
});

bootstrap();
