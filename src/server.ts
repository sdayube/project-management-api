import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import * as dotenv from 'dotenv';
dotenv.config();

import { router } from './routes';
import { HttpError } from './errors/HttpError';

const app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());
app.use(router);
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
      return response.status(err.statusCode).json({ error: err.message });
    }
    return response.status(500).json({ error: (err as Error).message });
  },
);

app.listen(3333, () => {
  console.log('Server is running!');
});
