import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import session from 'express-session';
import router from './routes';
import { Morgan } from './shared/morgen';
import globalErrorHandler from './globalErrorHandler/globalErrorHandler';
import { notFound } from './app/middleware/notFound';
import { welcome } from './utils/welcome';
import config from './config';
import path from 'path';
import setupTimeManagement from './utils/cronJobs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sanitizeFilter } from 'mongoose';
import getUploadDirectory from './utils/getUploadDirectory';
const app: Application = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// file retrieve
const baseUploadDir = getUploadDirectory();
app.use(express.static(baseUploadDir));
//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);
// Helmet for basic HTTP security headers
app.use(helmet());
const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100, // 100 requests / 15 min per IP
     standardHeaders: true,
});
// Prevent prototype pollution (Express)
app.disable('x-powered-by');
//body parser
// app.use(
//      cors({
//           origin: config.allowed_origins || '*',
//           credentials: true,
//      }),
// );

app.use(
     cors({
          origin: [
               'http://10.10.7.21:3000',
               'https://mijanur3000.binarybards.online',
               'https://dashboard.raconliapp.com',
               'https://www.dashboard.raconliapp.com',
               'https://api.raconliapp.com',
               'https://www.api.raconliapp.com',
          ],
          credentials: true,
     }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session configuration for OAuth
app.use(
     session({
          secret: config.express_session as string,
          resave: false,
          saveUninitialized: false,
          cookie: {
               secure: config.node_env === 'production',
               httpOnly: true,
               maxAge: 24 * 60 * 60 * 1000, // 24 hours
          },
     }),
);
app.use((req, res, next) => {
     const blocked = ['TRACE', 'TRACK'];
     if (blocked.includes(req.method)) {
          res.status(405).json({
               success: false,
               message: 'Method Not Allowed',
          });
     }
     next();
});
app.use((req, res, next) => {
     req.body = sanitizeFilter(req.body);
     req.query = sanitizeFilter(req.query);
     next();
});



// router
app.use('/api/v1', limiter, router);
// live response
app.get('/', (req: Request, res: Response) => {
     res.send(welcome());
});

// global error handle
app.use(globalErrorHandler);

// handle not found route;
app.use(notFound);
setupTimeManagement();
export default app;
