import cors from 'cors';
import express, { Request, Response } from 'express';
import HttpErrorPlugin, { HttpError } from 'http-errors';
import morgan from 'morgan';

import { routes } from './routes';

const app = express();
app.use(morgan('short'));

// Enable CORS
app.use(cors());

// Routes
app.use(routes);

// No Route Handler
app.use((req, res, next) => next(HttpErrorPlugin(404)));

// Error Handler
app.use((err: HttpError, req: Request, res: Response) => {
  if (!err.status || err.status === 500) {
    console.error(err);
  }

  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: err.status,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }
});

export { app };
