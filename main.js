'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { storeRouter, userRouter,adminRouter,productRouter,superadminRouter } from './app';

const app = express();
app.use(bodyParser.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/store', storeRouter);
app.use('/api/product', productRouter);
app.use('/api/superadmin',superadminRouter );


export default app