import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { config } from './app/config/index.js';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler.js';
import { notFoundHandler } from './app/middlewares/notFoundHandler.js';
import { globalRoutes } from './app/routes.js';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || config.corsOrigins.includes(origin) || config.env === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' not allowed by CORS.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept', 'X-Requested-With', 'Origin'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'find-my-tutor-server',
  });
});

// Root welcome route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Find My Tutor BD API Engine',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: '/api/v1',
  });
});

// Mount modular global routes under /api/v1
app.use('/api/v1', globalRoutes);

// 404 handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
