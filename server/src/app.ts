import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { setupSocket } from './services/socketService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
setupSocket(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// API Documentation
const swaggerOptions = {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
    ]
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Main Routes
app.use('/api', router);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        service: 'luxel-backend'
    });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Luxel Backend running on http://localhost:${PORT}`);
});

export default app;
