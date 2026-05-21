import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';   
import AiRouter from './routes/ai.routes.js';


const app = express();
app.use(cors({
	origin: true,
	credentials: true
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api/ai', AiRouter);


export default app ;