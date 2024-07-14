import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './src/app/Routes/index.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(
    cors({
        origin: 'https://web-cms-client.vercel.app',
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.urlencoded({ extended: true }));
const URL = process.env.DATABASE_URL;

mongoose
    .connect(URL, {})
    .then(() => {
        console.log('Connected to DB');
        routes(app);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log('errl', err);
    });
